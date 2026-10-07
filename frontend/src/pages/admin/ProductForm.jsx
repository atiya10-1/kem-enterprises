import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, Trash2, Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import api, { formatApiError } from "@/lib/api";
import { PageHeader, Btn, Input, Textarea, Select, Card } from "@/components/admin/ui";
import ImageUploader from "@/components/admin/ImageUploader";

const EMPTY = {
  name: "", sku: "", category_id: "", subcategory: "", images: [], video: "",
  short_description: "", description: "", specifications: [], material: "", finish: "",
  size: "", dimensions: "", wire_diameter: "", load_capacity: "", thread_size: "",
  application: "", packaging: "", moq: "", brand: "KEM Enterprises", tags: [],
  downloads: [], price: 0, show_price: false, featured: false, is_new: false,
  best_seller: false, popular: false, active: true, seo_title: "", seo_description: "", seo_keywords: "",
};

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [f, setF] = useState(EMPTY);
  const [cats, setCats] = useState([]);
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    api.get("/categories?all=true").then((r) => setCats(r.data));
    if (id) api.get(`/products?all=true&limit=500`).then((r) => {
      const p = r.data.items.find((x) => x.id === id);
      if (p) setF({ ...EMPTY, ...p, tags: p.tags || [], specifications: p.specifications || [] });
    });
  }, [id]);

  const addSpec = () => set("specifications", [...f.specifications, { label: "", value: "" }]);
  const updSpec = (i, k, v) => set("specifications", f.specifications.map((s, idx) => idx === i ? { ...s, [k]: v } : s));
  const rmSpec = (i) => set("specifications", f.specifications.filter((_, idx) => idx !== i));

  const save = async () => {
    if (!f.name || !f.category_id) { toast.error("Name and category are required"); return; }
    setSaving(true);
    const payload = { ...f, tags: typeof f.tags === "string" ? f.tags.split(",").map((t) => t.trim()).filter(Boolean) : f.tags, price: Number(f.price) || 0 };
    try {
      if (id) await api.put(`/products/${id}`, payload);
      else await api.post("/products", payload);
      toast.success("Product saved");
      navigate("/admin/products");
    } catch (e) { toast.error(formatApiError(e.response?.data?.detail)); }
    finally { setSaving(false); }
  };

  return (
    <div data-testid="product-form">
      <button onClick={() => navigate("/admin/products")} className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1.5 mb-4"><ArrowLeft className="h-4 w-4" /> Back to Products</button>
      <PageHeader title={id ? "Edit Product" : "New Product"}>
        <Btn variant="accent" onClick={save} disabled={saving} data-testid="save-product-btn"><Save className="h-4 w-4" /> {saving ? "Saving…" : "Save Product"}</Btn>
      </PageHeader>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Card className="p-5 space-y-4">
            <Input label="Product Name" value={f.name} onChange={(e) => set("name", e.target.value)} data-testid="pf-name" />
            <div className="grid grid-cols-2 gap-4">
              <Input label="SKU / Code" value={f.sku} onChange={(e) => set("sku", e.target.value)} placeholder="Auto-generated if blank" />
              <Select label="Category" value={f.category_id} onChange={(e) => set("category_id", e.target.value)} data-testid="pf-category">
                <option value="">Select category</option>
                {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Select>
            </div>
            <Textarea label="Short Description" rows={2} value={f.short_description} onChange={(e) => set("short_description", e.target.value)} />
            <Textarea label="Detailed Description" rows={5} value={f.description} onChange={(e) => set("description", e.target.value)} />
          </Card>

          <Card className="p-5">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide block mb-3">Product Images</span>
            <ImageUploader value={f.images} onChange={(v) => set("images", v)} folder="products" />
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-3"><span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Technical Specifications</span><Btn variant="outline" onClick={addSpec}><Plus className="h-3.5 w-3.5" /> Add</Btn></div>
            <div className="space-y-2">
              {f.specifications.map((s, i) => (
                <div key={i} className="flex gap-2">
                  <input value={s.label} onChange={(e) => updSpec(i, "label", e.target.value)} placeholder="Label" className="flex-1 border border-slate-300 text-sm px-2 py-1.5" />
                  <input value={s.value} onChange={(e) => updSpec(i, "value", e.target.value)} placeholder="Value" className="flex-1 border border-slate-300 text-sm px-2 py-1.5" />
                  <button onClick={() => rmSpec(i)} className="p-1.5 border border-red-200 text-red-500"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5 space-y-4">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide block">SEO</span>
            <Input label="SEO Title" value={f.seo_title} onChange={(e) => set("seo_title", e.target.value)} />
            <Textarea label="Meta Description" rows={2} value={f.seo_description} onChange={(e) => set("seo_description", e.target.value)} />
            <Input label="Keywords" value={f.seo_keywords} onChange={(e) => set("seo_keywords", e.target.value)} />
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="p-5 space-y-3">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide block">Status & Flags</span>
            {[["active", "Active (visible on site)"], ["featured", "Featured"], ["is_new", "New"], ["best_seller", "Best Seller"], ["popular", "Popular"]].map(([k, l]) => (
              <label key={k} className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={!!f[k]} onChange={(e) => set(k, e.target.checked)} data-testid={`pf-${k}`} className="accent-kem-accent h-4 w-4" /> {l}</label>
            ))}
          </Card>
          <Card className="p-5 space-y-4">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide block">Attributes</span>
            {[["material", "Material"], ["finish", "Finish"], ["size", "Size"], ["load_capacity", "Load Capacity"], ["wire_diameter", "Wire Diameter"], ["application", "Application"], ["moq", "MOQ"], ["packaging", "Packaging"]].map(([k, l]) => (
              <Input key={k} label={l} value={f[k]} onChange={(e) => set(k, e.target.value)} />
            ))}
            <Input label="Tags (comma separated)" value={Array.isArray(f.tags) ? f.tags.join(", ") : f.tags} onChange={(e) => set("tags", e.target.value)} />
          </Card>
          <Card className="p-5 space-y-3">
            <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={!!f.show_price} onChange={(e) => set("show_price", e.target.checked)} className="accent-kem-accent h-4 w-4" /> Show price publicly</label>
            {f.show_price && <Input label="Price (₹)" type="number" value={f.price} onChange={(e) => set("price", e.target.value)} />}
          </Card>
        </div>
      </div>
    </div>
  );
}
