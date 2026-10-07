import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import api, { formatApiError } from "@/lib/api";
import { inr } from "@/lib/helpers";
import { PageHeader, Btn, Input, Textarea, Select, Card } from "@/components/admin/ui";
import DocItemsEditor, { computeTotal } from "@/components/admin/DocItemsEditor";

export default function QuotationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const enquiry = location.state?.enquiry;
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [f, setF] = useState({
    customer_id: "", customer_name: enquiry?.name || "", company: enquiry?.company || "", address: "",
    gstin: "", items: enquiry?.product_name ? [{ description: enquiry.product_name, quantity: Number(enquiry.quantity) || 1, unit_price: 0, discount: 0, tax: 18 }] : [],
    discount: 0, shipping: 0, other_charges: 0, terms: "", notes: "", status: "Draft",
  });
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    api.get("/customers").then((r) => setCustomers(r.data));
    api.get("/products?all=true&limit=1000").then((r) => setProducts(r.data.items));
    if (id) api.get(`/quotations/${id}`).then((r) => setF(r.data));
  }, [id]);

  const t = computeTotal(f.items, f.discount, null, f.shipping, f.other_charges);

  const save = async () => {
    if (!f.customer_name || f.items.length === 0) { toast.error("Customer and at least one item required"); return; }
    try {
      const r = id ? await api.put(`/quotations/${id}`, f) : await api.post("/quotations", f);
      toast.success("Quotation saved");
      navigate("/admin/quotations");
    } catch (e) { toast.error(formatApiError(e.response?.data?.detail)); }
  };

  const onCustomer = (cid) => {
    const c = customers.find((x) => x.id === cid);
    if (c) setF((p) => ({ ...p, customer_id: cid, customer_name: c.name, company: c.company, address: c.address, gstin: c.gstin }));
    else set("customer_id", "");
  };

  return (
    <div data-testid="quotation-form">
      <button onClick={() => navigate("/admin/quotations")} className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1.5 mb-4"><ArrowLeft className="h-4 w-4" /> Back</button>
      <PageHeader title={id ? "Edit Quotation" : "New Quotation"}><Btn variant="accent" onClick={save} data-testid="save-quotation-btn"><Save className="h-4 w-4" /> Save</Btn></PageHeader>
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Card className="p-5 space-y-4">
            <Select label="Select Customer" value={f.customer_id} onChange={(e) => onCustomer(e.target.value)}><option value="">Manual entry</option>{customers.map((c) => <option key={c.id} value={c.id}>{c.name} — {c.company}</option>)}</Select>
            <div className="grid grid-cols-2 gap-4"><Input label="Customer Name" value={f.customer_name} onChange={(e) => set("customer_name", e.target.value)} data-testid="qf-customer" /><Input label="Company" value={f.company} onChange={(e) => set("company", e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-4"><Input label="GSTIN" value={f.gstin} onChange={(e) => set("gstin", e.target.value)} /><Input label="Valid Until" type="date" value={f.valid_until || ""} onChange={(e) => set("valid_until", e.target.value)} /></div>
            <Textarea label="Address" rows={2} value={f.address} onChange={(e) => set("address", e.target.value)} />
          </Card>
          <Card className="p-5"><span className="text-xs font-semibold text-slate-600 uppercase tracking-wide block mb-3">Items</span><DocItemsEditor items={f.items} onChange={(v) => set("items", v)} products={products} /></Card>
          <Card className="p-5 space-y-4"><Textarea label="Terms & Conditions" rows={2} value={f.terms} onChange={(e) => set("terms", e.target.value)} placeholder="Default terms applied if blank" /><Textarea label="Notes" rows={2} value={f.notes} onChange={(e) => set("notes", e.target.value)} /></Card>
        </div>
        <div className="space-y-5">
          <Card className="p-5 space-y-3">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide block">Charges</span>
            <Input label="Extra Discount (₹)" type="number" value={f.discount} onChange={(e) => set("discount", e.target.value)} />
            <Input label="Shipping (₹)" type="number" value={f.shipping} onChange={(e) => set("shipping", e.target.value)} />
            <Input label="Other Charges (₹)" type="number" value={f.other_charges} onChange={(e) => set("other_charges", e.target.value)} />
          </Card>
          <Card className="p-5 space-y-2 text-sm">
            <div className="flex justify-between text-slate-500"><span>Subtotal</span><span>{inr(t.subtotal)}</span></div>
            <div className="flex justify-between text-slate-500"><span>Tax</span><span>{inr(t.tax)}</span></div>
            <div className="flex justify-between font-bold text-slate-900 text-lg pt-2 border-t border-slate-200"><span>Total</span><span>{inr(t.total)}</span></div>
          </Card>
        </div>
      </div>
    </div>
  );
}
