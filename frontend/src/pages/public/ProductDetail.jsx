import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MessageCircle, Phone, Send, Download, Check, ArrowLeft, FileText } from "lucide-react";
import api, { fileUrl, PLACEHOLDER } from "@/lib/api";
import { useSettings } from "@/context/SettingsContext";
import { productWhatsAppLink } from "@/lib/helpers";
import ProductCard from "@/components/public/ProductCard";
import EnquiryModal from "@/components/public/EnquiryModal";
import { SEO, SITE_URL } from "@/components/public/SEO";

export default function ProductDetail() {
  const { productSlug } = useParams();
  const { settings } = useSettings();
  const [p, setP] = useState(null);
  const [active, setActive] = useState(0);
  const [enquire, setEnquire] = useState(false);
  const [notfound, setNotfound] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setP(null); setNotfound(false); setActive(0);
    api.get(`/products/${productSlug}`).then((r) => setP(r.data)).catch(() => setNotfound(true));
  }, [productSlug]);

  if (notfound) return <div className="pt-40 pb-40 text-center text-white/50" data-testid="product-notfound">Product not found. <Link to="/products" className="text-kem-accent underline">Browse products</Link></div>;
  if (!p) return <div className="pt-40 pb-40 text-center text-white/40">Loading…</div>;

  const images = p.images?.length ? p.images : [PLACEHOLDER];
  const phone = settings?.contact?.phone;
  const catSlug = (p.category_name || "products").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const canonicalPath = `/products/${catSlug}/${p.slug}`;
  const seoTitle = p.seo_title || `${p.name} | KEM Enterprises`;
  const seoDescription = p.seo_description || p.short_description || `View ${p.name} specifications and enquire with KEM Enterprises.`;
  const productSchema = { "@context":"https://schema.org", "@type":"Product", name:p.name, description:seoDescription, sku:p.sku || undefined, brand:{"@type":"Brand",name:p.brand || "KEM Enterprises"}, image:(p.images || []).map((x) => x?.startsWith("http") ? x : `${SITE_URL}${x || ""}`), url:`${SITE_URL}${canonicalPath}` };

  return (
    <div className="pt-24 pb-24" data-testid="product-detail-page">
      <SEO title={seoTitle} description={seoDescription} path={canonicalPath} image={images[0]} type="product" schema={productSchema} />
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
        <div className="flex items-center gap-2 text-xs text-white/40 py-5">
          <Link to="/" className="hover:text-white">Home</Link> /
          <Link to={`/products/${catSlug}`} className="hover:text-white">{p.category_name}</Link> /
          <span className="text-white/70">{p.name}</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Gallery */}
          <div className="lg:col-span-7">
            <div className="border border-white/10 bg-black aspect-[4/3] overflow-hidden">
              {images[active] ? <img src={fileUrl(images[active])} alt={p.name} onError={(e) => { e.currentTarget.src = PLACEHOLDER; }} className="h-full w-full object-contain p-2" data-testid="product-main-image" /> : <div className="h-full grid place-items-center text-white/20">No image</div>}
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 mt-3">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActive(i)} className={`h-20 w-24 border overflow-hidden ${active === i ? "border-kem-accent" : "border-white/10"}`}>
                    <img src={fileUrl(img)} alt="" onError={(e) => { e.currentTarget.src = PLACEHOLDER; }} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="lg:col-span-5">
            <div className="text-[11px] uppercase tracking-[0.2em] text-kem-accent font-bold mb-2">{p.category_name}</div>
            <h1 className="font-display font-black text-white text-3xl sm:text-4xl tracking-tight leading-tight">{p.name}</h1>
            <div className="text-white/40 font-mono text-sm mt-2">SKU: {p.sku}</div>
            <p className="text-white/60 mt-5 leading-relaxed">{p.short_description}</p>

            <div className="grid grid-cols-2 gap-px bg-white/10 border border-white/10 mt-6">
              {[["Material", p.material], ["Finish", p.finish], ["Size", p.size], ["Load Capacity", p.load_capacity]].filter(([, v]) => v).map(([k, v]) => (
                <div key={k} className="bg-[#0a0a0c] p-4"><div className="text-[10px] uppercase tracking-wide text-white/40">{k}</div><div className="text-white text-sm font-medium mt-1">{v}</div></div>
              ))}
            </div>

            <div className="text-sm text-emerald-400 flex items-center gap-2 mt-5"><Check className="h-4 w-4" /> Available — Enquire for pricing & lead time</div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <button onClick={() => setEnquire(true)} data-testid="detail-enquiry-btn" className="col-span-2 bg-kem-accent text-white font-semibold py-3.5 flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-colors"><Send className="h-4 w-4" /> Request Quote / Enquiry</button>
              <a href={productWhatsAppLink(settings, p.name)} target="_blank" rel="noreferrer" data-testid="detail-whatsapp-btn" className="bg-[#25D366] text-white font-semibold py-3.5 flex items-center justify-center gap-2 hover:opacity-90"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
              {phone ? <a href={`tel:${phone}`} data-testid="detail-call-btn" className="border border-white/15 text-white font-semibold py-3.5 flex items-center justify-center gap-2 hover:border-kem-accent"><Phone className="h-4 w-4" /> Call Now</a> : <span />}
            </div>
          </div>
        </div>

        {/* Description + Specs */}
        <div className="grid lg:grid-cols-12 gap-10 mt-16">
          <div className="lg:col-span-7 space-y-10">
            <Section title="Product Description"><p className="text-white/60 leading-relaxed whitespace-pre-line">{p.description}</p></Section>
            {p.application && <Section title="Applications"><p className="text-white/60 leading-relaxed">{p.application}</p></Section>}
            {p.downloads?.length > 0 && (
              <Section title="Product Downloads">
                <div className="space-y-2">{p.downloads.map((d, i) => (
                  <a key={i} href={fileUrl(d.url)} target="_blank" rel="noreferrer" className="flex items-center gap-3 border border-white/10 p-3 hover:border-kem-accent text-white/70 hover:text-white"><FileText className="h-4 w-4 text-kem-accent" /> {d.name || "Download"} <Download className="h-4 w-4 ml-auto" /></a>
                ))}</div>
              </Section>
            )}
          </div>
          <div className="lg:col-span-5">
            <Section title="Technical Specifications">
              <div className="border border-white/10">
                {(p.specifications || []).map((s, i) => (
                  <div key={i} className="flex justify-between px-4 py-3 border-b border-white/5 last:border-0">
                    <span className="text-white/40 text-sm">{s.label}</span>
                    <span className="text-white text-sm font-medium text-right">{s.value}</span>
                  </div>
                ))}
                {[["MOQ", p.moq], ["Packaging", p.packaging], ["Brand", p.brand]].filter(([, v]) => v).map(([k, v]) => (
                  <div key={k} className="flex justify-between px-4 py-3 border-b border-white/5 last:border-0"><span className="text-white/40 text-sm">{k}</span><span className="text-white text-sm font-medium">{v}</span></div>
                ))}
              </div>
            </Section>
          </div>
        </div>

        {p.related?.length > 0 && (
          <div className="mt-20">
            <h2 className="font-display font-bold text-white text-2xl tracking-tight mb-8">Related Products</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">{p.related.map((r, i) => <ProductCard key={r.id} product={r} index={i} />)}</div>
          </div>
        )}
      </div>

      {/* Mobile sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a0a0c] border-t border-white/10 p-3 flex gap-2">
        <button onClick={() => setEnquire(true)} className="flex-1 bg-kem-accent text-white font-semibold py-3 text-sm">Enquire</button>
        <a href={productWhatsAppLink(settings, p.name)} target="_blank" rel="noreferrer" className="bg-[#25D366] text-white px-4 grid place-items-center"><MessageCircle className="h-5 w-5" /></a>
        {phone && <a href={`tel:${phone}`} className="border border-white/15 text-white px-4 grid place-items-center"><Phone className="h-5 w-5" /></a>}
      </div>

      {enquire && <EnquiryModal product={p} onClose={() => setEnquire(false)} />}
    </div>
  );
}

function Section({ title, children }) {
  return <div><h2 className="font-display font-bold text-white text-xl tracking-tight mb-4 pb-3 border-b border-white/10">{title}</h2>{children}</div>;
}
