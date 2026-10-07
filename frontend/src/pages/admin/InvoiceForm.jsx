import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import api, { formatApiError } from "@/lib/api";
import { inr } from "@/lib/helpers";
import { PageHeader, Btn, Input, Textarea, Select, Card } from "@/components/admin/ui";
import DocItemsEditor, { computeTotal } from "@/components/admin/DocItemsEditor";

export default function InvoiceForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [f, setF] = useState({
    customer_id: "", customer_name: "", company: "", billing_address: "", shipping_address: "",
    gstin: "", items: [], discount: 0, shipping: 0, other_charges: 0, gst_percent: 18,
    payment_status: "Unpaid", payment_method: "", terms: "", notes: "",
  });
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    api.get("/customers").then((r) => setCustomers(r.data));
    api.get("/products?all=true&limit=1000").then((r) => setProducts(r.data.items));
    if (id) api.get(`/invoices/${id}`).then((r) => setF(r.data));
  }, [id]);

  const t = computeTotal(f.items, f.discount, Number(f.gst_percent), f.shipping, f.other_charges);

  const save = async () => {
    if (!f.customer_name || f.items.length === 0) { toast.error("Customer and at least one item required"); return; }
    try { id ? await api.put(`/invoices/${id}`, f) : await api.post("/invoices", f); toast.success("Invoice saved"); navigate("/admin/invoices"); }
    catch (e) { toast.error(formatApiError(e.response?.data?.detail)); }
  };
  const onCustomer = (cid) => {
    const c = customers.find((x) => x.id === cid);
    if (c) setF((p) => ({ ...p, customer_id: cid, customer_name: c.name, company: c.company, billing_address: c.address, shipping_address: c.address, gstin: c.gstin }));
    else set("customer_id", "");
  };

  return (
    <div data-testid="invoice-form">
      <button onClick={() => navigate("/admin/invoices")} className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1.5 mb-4"><ArrowLeft className="h-4 w-4" /> Back</button>
      <PageHeader title={id ? "Edit Invoice" : "New Invoice"}><Btn variant="accent" onClick={save} data-testid="save-invoice-btn"><Save className="h-4 w-4" /> Save</Btn></PageHeader>
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Card className="p-5 space-y-4">
            <Select label="Select Customer" value={f.customer_id} onChange={(e) => onCustomer(e.target.value)}><option value="">Manual entry</option>{customers.map((c) => <option key={c.id} value={c.id}>{c.name} — {c.company}</option>)}</Select>
            <div className="grid grid-cols-2 gap-4"><Input label="Customer Name" value={f.customer_name} onChange={(e) => set("customer_name", e.target.value)} data-testid="if-customer" /><Input label="GSTIN" value={f.gstin} onChange={(e) => set("gstin", e.target.value)} /></div>
            <Textarea label="Billing Address" rows={2} value={f.billing_address} onChange={(e) => set("billing_address", e.target.value)} />
            <Textarea label="Shipping Address" rows={2} value={f.shipping_address} onChange={(e) => set("shipping_address", e.target.value)} />
          </Card>
          <Card className="p-5"><span className="text-xs font-semibold text-slate-600 uppercase tracking-wide block mb-3">Items</span><DocItemsEditor items={f.items} onChange={(v) => set("items", v)} products={products} /></Card>
          <Card className="p-5 space-y-4"><Textarea label="Terms" rows={2} value={f.terms} onChange={(e) => set("terms", e.target.value)} /><Textarea label="Notes" rows={2} value={f.notes} onChange={(e) => set("notes", e.target.value)} /></Card>
        </div>
        <div className="space-y-5">
          <Card className="p-5 space-y-3">
            <Select label="Payment Status" value={f.payment_status} onChange={(e) => set("payment_status", e.target.value)}>{["Unpaid", "Partially Paid", "Paid", "Overdue", "Cancelled"].map((s) => <option key={s}>{s}</option>)}</Select>
            <Input label="GST %" type="number" value={f.gst_percent} onChange={(e) => set("gst_percent", e.target.value)} />
            <Input label="Extra Discount (₹)" type="number" value={f.discount} onChange={(e) => set("discount", e.target.value)} />
            <Input label="Shipping (₹)" type="number" value={f.shipping} onChange={(e) => set("shipping", e.target.value)} />
            <Input label="Other Charges (₹)" type="number" value={f.other_charges} onChange={(e) => set("other_charges", e.target.value)} />
          </Card>
          <Card className="p-5 space-y-2 text-sm">
            <div className="flex justify-between text-slate-500"><span>Subtotal</span><span>{inr(t.subtotal)}</span></div>
            <div className="flex justify-between text-slate-500"><span>GST</span><span>{inr(t.tax)}</span></div>
            <div className="flex justify-between font-bold text-slate-900 text-lg pt-2 border-t border-slate-200"><span>Total</span><span>{inr(t.total)}</span></div>
          </Card>
        </div>
      </div>
    </div>
  );
}
