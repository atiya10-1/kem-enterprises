import io
import qrcode
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (SimpleDocTemplate, Table, TableStyle, Paragraph,
                                Spacer, Image as RLImage, PageBreak)

ACCENT = colors.HexColor("#FF4D00")
DARK = colors.HexColor("#0A0A0C")
GREY = colors.HexColor("#64748B")
LIGHT = colors.HexColor("#F1F3F5")


def _styles():
    ss = getSampleStyleSheet()
    ss.add(ParagraphStyle("Brand", fontName="Helvetica-Bold", fontSize=22, textColor=DARK, leading=24))
    ss.add(ParagraphStyle("DocTitle", fontName="Helvetica-Bold", fontSize=16, textColor=ACCENT, leading=18))
    ss.add(ParagraphStyle("Small", fontName="Helvetica", fontSize=8, textColor=GREY, leading=11))
    ss.add(ParagraphStyle("Body2", fontName="Helvetica", fontSize=9, textColor=DARK, leading=12))
    ss.add(ParagraphStyle("BodyB", fontName="Helvetica-Bold", fontSize=9, textColor=DARK, leading=12))
    return ss


def _header(company, title, meta_rows):
    ss = _styles()
    left = [Paragraph(company.get("name", "KEM Enterprises"), ss["Brand"]),
            Paragraph(company.get("address", ""), ss["Small"]),
            Paragraph("GSTIN: " + company.get("gstin", ""), ss["Small"])]
    right = [Paragraph(title, ss["DocTitle"])]
    for k, v in meta_rows:
        right.append(Paragraph(f"<b>{k}:</b> {v}", ss["Body2"]))
    t = Table([[left, right]], colWidths=[100 * mm, 80 * mm])
    t.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"),
                           ("ALIGN", (1, 0), (1, 0), "RIGHT")]))
    return t


def _party(ss, label, party):
    lines = [Paragraph(label, ss["Small"]),
             Paragraph(party.get("name", ""), ss["BodyB"])]
    for key in ("company", "address", "phone", "email"):
        if party.get(key):
            lines.append(Paragraph(str(party[key]), ss["Body2"]))
    if party.get("gstin"):
        lines.append(Paragraph("GSTIN: " + party["gstin"], ss["Body2"]))
    return lines


def _items_table(items, ss):
    head = ["#", "Description", "Qty", "Rate", "Disc%", "Tax%", "Amount"]
    data = [head]
    for i, it in enumerate(items):
        qty = float(it.get("quantity", 1) or 0)
        rate = float(it.get("unit_price", 0) or 0)
        disc = float(it.get("discount", 0) or 0)
        tax = float(it.get("tax", 0) or 0)
        base = qty * rate
        base_after = base * (1 - disc / 100)
        amount = base_after * (1 + tax / 100)
        data.append([str(i + 1),
                     Paragraph(it.get("description") or it.get("product") or "", ss["Body2"]),
                     f"{qty:g}", f"{rate:,.2f}", f"{disc:g}", f"{tax:g}", f"{amount:,.2f}"])
    t = Table(data, colWidths=[8 * mm, 74 * mm, 14 * mm, 22 * mm, 14 * mm, 14 * mm, 24 * mm], repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), DARK),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 8),
        ("ALIGN", (2, 0), (-1, -1), "RIGHT"),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, LIGHT]),
        ("LINEBELOW", (0, 0), (-1, -1), 0.3, colors.HexColor("#E5E7EB")),
        ("TOPPADDING", (0, 0), (-1, -1), 5), ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    return t


def _totals(doc, ss):
    rows = [["Subtotal", f"{doc.get('subtotal', 0):,.2f}"]]
    if doc.get("discount"):
        rows.append(["Discount", f"-{doc['discount']:,.2f}"])
    tax_label = "GST" if "gst" in doc else "Tax"
    rows.append([tax_label, f"{doc.get('gst', doc.get('tax', 0)):,.2f}"])
    if doc.get("shipping"):
        rows.append(["Shipping", f"{doc['shipping']:,.2f}"])
    if doc.get("other_charges"):
        rows.append(["Other Charges", f"{doc['other_charges']:,.2f}"])
    rows.append(["TOTAL", f"INR {doc.get('total', 0):,.2f}"])
    t = Table(rows, colWidths=[40 * mm, 32 * mm])
    t.setStyle(TableStyle([
        ("FONTSIZE", (0, 0), (-1, -1), 9), ("ALIGN", (1, 0), (1, -1), "RIGHT"),
        ("FONTNAME", (0, -1), (-1, -1), "Helvetica-Bold"),
        ("BACKGROUND", (0, -1), (-1, -1), ACCENT), ("TEXTCOLOR", (0, -1), (-1, -1), colors.white),
        ("TOPPADDING", (0, 0), (-1, -1), 4), ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    return t


def build_document_pdf(kind, doc, company, party):
    ss = _styles()
    buf = io.BytesIO()
    pdf = SimpleDocTemplate(buf, pagesize=A4, topMargin=15 * mm, bottomMargin=15 * mm,
                            leftMargin=15 * mm, rightMargin=15 * mm)
    title = "TAX INVOICE" if kind == "invoice" else "QUOTATION"
    meta = [("No", doc.get("number", "")), ("Date", doc.get("date", ""))]
    if kind == "quotation":
        meta.append(("Valid Until", doc.get("valid_until", "")))
    if kind == "invoice":
        meta.append(("Status", doc.get("payment_status", "Unpaid")))
    story = [_header(company, title, meta), Spacer(1, 8 * mm)]
    party_tbl = Table([[_party(ss, "BILL TO", party),
                        _party(ss, "FROM", {"name": company.get("name"), "address": company.get("address"),
                                            "gstin": company.get("gstin")})]],
                      colWidths=[90 * mm, 90 * mm])
    party_tbl.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP")]))
    story += [party_tbl, Spacer(1, 6 * mm), _items_table(doc.get("items", []), ss), Spacer(1, 4 * mm)]
    wrap = Table([["", _totals(doc, ss)]], colWidths=[108 * mm, 72 * mm])
    wrap.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP")]))
    story += [wrap, Spacer(1, 8 * mm)]
    if doc.get("terms"):
        story += [Paragraph("Terms & Conditions", ss["BodyB"]), Paragraph(doc["terms"], ss["Small"])]
    if doc.get("notes"):
        story += [Spacer(1, 3 * mm), Paragraph("Notes", ss["BodyB"]), Paragraph(doc["notes"], ss["Small"])]
    pdf.build(story)
    buf.seek(0)
    return buf.read()


def _qr(data):
    img = qrcode.make(data)
    b = io.BytesIO()
    img.save(b, format="PNG")
    b.seek(0)
    return b


def build_catalogue_pdf(catalogue, products, company, website_url, whatsapp_url):
    ss = _styles()
    buf = io.BytesIO()
    pdf = SimpleDocTemplate(buf, pagesize=A4, topMargin=15 * mm, bottomMargin=15 * mm,
                            leftMargin=15 * mm, rightMargin=15 * mm)
    ss.add(ParagraphStyle("Cover", fontName="Helvetica-Bold", fontSize=34, textColor=DARK, leading=38))
    ss.add(ParagraphStyle("CoverSub", fontName="Helvetica", fontSize=11, textColor=GREY, leading=16))
    ss.add(ParagraphStyle("PName", fontName="Helvetica-Bold", fontSize=11, textColor=DARK, leading=13))

    story = [Spacer(1, 40 * mm),
             Paragraph(company.get("name", "KEM Enterprises"), ss["DocTitle"]),
             Spacer(1, 6 * mm),
             Paragraph(catalogue.get("name", "Product Catalogue"), ss["Cover"]),
             Spacer(1, 6 * mm),
             Paragraph(catalogue.get("intro") or company.get("about", ""), ss["CoverSub"]),
             Spacer(1, 12 * mm)]
    try:
        qr_tbl = Table([[RLImage(_qr(website_url), width=30 * mm, height=30 * mm),
                         RLImage(_qr(whatsapp_url), width=30 * mm, height=30 * mm)]],
                       colWidths=[45 * mm, 45 * mm])
        story += [qr_tbl, Paragraph("Scan to visit website / chat on WhatsApp", ss["Small"])]
    except Exception:
        pass
    story += [Spacer(1, 6 * mm),
              Paragraph(f"{company.get('address', '')}  |  {company.get('gstin', '')}", ss["Small"]),
              PageBreak()]

    template = (catalogue.get("template") or "classic").lower()
    show_img = template != "minimal"
    per_row = 3 if template == "compact" else (1 if template == "minimal" else 2)
    img_w = 52 * mm if template == "classic" else 40 * mm
    img_h = 38 * mm if template == "classic" else 30 * mm
    col_w = (170 * mm) / per_row
    rows = []
    row = []
    for p in products:
        cell = []
        imgs = p.get("images") or []
        if show_img:
            try:
                if imgs:
                    import requests as _rq
                    r = _rq.get(imgs[0], timeout=10)
                    if r.ok:
                        cell.append(RLImage(io.BytesIO(r.content), width=img_w, height=img_h))
            except Exception:
                pass
        cell.append(Paragraph(p.get("name", ""), ss["PName"]))
        cell.append(Paragraph("SKU: " + p.get("sku", ""), ss["Small"]))
        specs = " | ".join(f"{s['label']}: {s['value']}" for s in (p.get("specifications") or [])[:3])
        cell.append(Paragraph(specs, ss["Small"]))
        row.append(cell)
        if len(row) == per_row:
            rows.append(row)
            row = []
    if row:
        while len(row) < per_row:
            row.append([])
        rows.append(row)
    if rows:
        t = Table(rows, colWidths=[col_w] * per_row)
        t.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"),
                               ("TOPPADDING", (0, 0), (-1, -1), 8),
                               ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                               ("LEFTPADDING", (0, 0), (-1, -1), 4),
                               ("LINEBELOW", (0, 0), (-1, -1), 0.3, colors.HexColor("#E5E7EB"))]))
        story.append(t)
    pdf.build(story)
    buf.seek(0)
    return buf.read()
