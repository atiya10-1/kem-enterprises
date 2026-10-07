import { useEffect, useState } from "react";
import { Plus, Trash2, Download, Share2, Copy, MessageCircle, Mail, BookOpen, Eye, GripVertical, ArrowUp, ArrowDown, X } from "lucide-react";
import { toast } from "sonner";
import api, { API_BASE, openAuthedFile } from "@/lib/api";
import { PageHeader, Btn, Card, Modal, Input, Textarea } from "@/components/admin/ui";

const EMPTY = { name: "", intro: "", product_ids: [], category_ids: [], template: "classic" };
const TEMPLATES = [["classic", "Classic", "2-column, large product images"], ["compact", "Compact", "3-column, more products per page"], ["minimal", "Minimal", "Text list, no images"]];

export default function AdminCatalogues() {
  const [items, setItems] = useState([]);
  const [cats, setCats] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [share, setShare] = useState(null);
  const [productSearch, setProductSearch] = useState("");
  const [dragI, setDragI] = useState(null);
  const load = () => api.get("/catalogues").then((r) => setItems(r.data));
  useEffect(() => {
    load();
    api.get("/categories?all=true").then((r) => setCats(r.data));
    api.get("/products?all=true&limit=1000").then((r) => setAllProducts(r.data.items));
  }, []);

  const save = async () => {
    if (!editing.name) { toast.error("Name required"); return; }
    if (editing.id) await api.put(`/catalogues/${editing.id}`, editing); else await api.post("/catalogues", editing);
    toast.success("Catalogue saved"); setEditing(null); load();
  };
  const del = async (c) => { if (!window.confirm(`Delete "${c.name}"?`)) return; await api.delete(`/catalogues/${c.id}`); load(); };
  const toggleCat = (id) => setEditing((p) => ({ ...p, category_ids: p.category_ids.includes(id) ? p.category_ids.filter((x) => x !== id) : [...p.category_ids, id] }));
  const addProduct = (id) => setEditing((p) => ({ ...p, product_ids: p.product_ids.includes(id) ? p.product_ids : [...p.product_ids, id] }));
  const removeProduct = (id) => setEditing((p) => ({ ...p, product_ids: p.product_ids.filter((x) => x !== id) }));
  const moveProduct = (i, dir) => setEditing((p) => { const a = [...p.product_ids]; const j = i + dir; if (j < 0 || j >= a.length) return p; [a[i], a[j]] = [a[j], a[i]]; return { ...p, product_ids: a }; });
  const dropAt = (i) => setEditing((p) => { if (dragI === null || dragI === i) return p; const a = [...p.product_ids]; const [m] = a.splice(dragI, 1); a.splice(i, 0, m); return { ...p, product_ids: a }; });

  const doShare = async (c, channel) => {
    const { data } = await api.post(`/catalogues/${c.id}/share`, { channel });
    const link = data.link;
    if (channel === "copy") { navigator.clipboard.writeText(link); toast.success("Link copied"); }
    else if (channel === "whatsapp") window.open(`https://wa.me/?text=${encodeURIComponent("KEM Enterprises Catalogue: " + link)}`, "_blank");
    else if (channel === "email") window.open(`mailto:?subject=KEM Catalogue&body=${encodeURIComponent(link)}`, "_blank");
    load();
  };

  return (
    <div data-testid="admin-catalogues">
      <PageHeader title="Catalogues" subtitle={`${items.length} catalogues`}>
        {items.length > 0 && <Btn variant="outline" onClick={() => items.forEach((c, idx) => setTimeout(() => openAuthedFile(`/catalogues/${c.id}/pdf`, `${c.name}.pdf`), idx * 800))} data-testid="download-all-btn"><Download className="h-4 w-4" /> Download All</Btn>}
        <Btn variant="accent" onClick={() => setEditing(EMPTY)} data-testid="add-catalogue-btn"><Plus className="h-4 w-4" /> Create Catalogue</Btn>
      </PageHeader>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((c) => (
          <Card key={c.id} className="p-5" data-testid={`catalogue-${c.id}`}>
            <BookOpen className="h-7 w-7 text-kem-accent mb-3" strokeWidth={1.5} />
            <h3 className="font-display font-bold text-slate-900">{c.name}</h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{c.intro}</p>
            <div className="flex gap-4 text-xs text-slate-400 mt-3"><span className="flex items-center gap-1"><Download className="h-3 w-3" /> {c.downloads}</span><span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {c.opens}</span><span className="flex items-center gap-1"><Share2 className="h-3 w-3" /> {c.shares}</span></div>
            <div className="flex flex-wrap gap-1.5 mt-4">
              <button onClick={() => openAuthedFile(`/catalogues/${c.id}/pdf`, `${c.name}.pdf`)} className="text-xs border border-slate-200 px-2 py-1.5 text-slate-600 hover:border-slate-900 flex items-center gap-1" data-testid={`cat-pdf-${c.id}`}><Download className="h-3 w-3" /> PDF</button>
              <button onClick={() => setShare(c)} className="text-xs border border-slate-200 px-2 py-1.5 text-slate-600 hover:border-slate-900 flex items-center gap-1"><Share2 className="h-3 w-3" /> Share</button>
              <button onClick={() => setEditing({ ...c })} className="text-xs border border-slate-200 px-2 py-1.5 text-slate-600">Edit</button>
              <button onClick={() => del(c)} className="text-xs border border-red-200 px-2 py-1.5 text-red-500"><Trash2 className="h-3 w-3" /></button>
            </div>
          </Card>
        ))}
      </div>
      {items.length === 0 && <div className="text-slate-400 py-16 text-center border border-slate-200 bg-white">No catalogues yet. Create one — it auto-uses your live products.</div>}

      {editing && (
        <Modal title={editing.id ? "Edit Catalogue" : "New Catalogue"} onClose={() => setEditing(null)} wide>
          <div className="space-y-4">
            <Input label="Catalogue Name" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} data-testid="catalogue-name" />
            <Textarea label="Introduction" rows={2} value={editing.intro} onChange={(e) => setEditing({ ...editing, intro: e.target.value })} />

            <div>
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide block mb-2">Template</span>
              <div className="grid grid-cols-3 gap-2">
                {TEMPLATES.map(([v, l, d]) => (
                  <button key={v} type="button" onClick={() => setEditing({ ...editing, template: v })} data-testid={`template-${v}`}
                    className={`text-left p-3 border transition-colors ${(editing.template || "classic") === v ? "border-kem-accent bg-orange-50" : "border-slate-200 hover:border-slate-400"}`}>
                    <div className="text-sm font-semibold text-slate-900">{l}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{d}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide block mb-2">Include Categories (adds all their products)</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-40 overflow-y-auto border border-slate-200 p-3">
                {cats.map((c) => (
                  <label key={c.id} className="flex items-center gap-2 text-xs text-slate-700"><input type="checkbox" checked={editing.category_ids.includes(c.id)} onChange={() => toggleCat(c.id)} className="accent-kem-accent" /> {c.name}</label>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide block mb-2">Add & Order Specific Products (drag to reorder)</span>
              <input value={productSearch} onChange={(e) => setProductSearch(e.target.value)} placeholder="Search products to add…" data-testid="catalogue-product-search"
                className="w-full border border-slate-300 text-sm px-3 py-2 focus:outline-none focus:border-kem-accent" />
              {productSearch && (
                <div className="border border-slate-200 border-t-0 max-h-40 overflow-y-auto">
                  {allProducts.filter((p) => p.name.toLowerCase().includes(productSearch.toLowerCase()) && !editing.product_ids.includes(p.id)).slice(0, 8).map((p) => (
                    <button key={p.id} type="button" onClick={() => { addProduct(p.id); setProductSearch(""); }} data-testid={`add-cat-prod-${p.slug}`}
                      className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 text-left text-sm border-b border-slate-100 last:border-0">
                      <img src={(p.images || [])[0]} alt="" className="h-7 w-7 object-cover" /> <span className="truncate">{p.name}</span>
                    </button>
                  ))}
                </div>
              )}
              <div className="mt-2 space-y-1">
                {editing.product_ids.map((pid, i) => {
                  const p = allProducts.find((x) => x.id === pid);
                  if (!p) return null;
                  return (
                    <div key={pid} draggable onDragStart={() => setDragI(i)} onDragOver={(e) => e.preventDefault()} onDrop={() => { dropAt(i); setDragI(null); }}
                      className="flex items-center gap-2 border border-slate-200 px-2 py-1.5 bg-white" data-testid={`cat-prod-${p.slug}`}>
                      <GripVertical className="h-4 w-4 text-slate-300 cursor-grab" />
                      <span className="text-xs text-slate-400 w-5 text-center">{i + 1}</span>
                      <img src={(p.images || [])[0]} alt="" className="h-7 w-7 object-cover" />
                      <span className="text-sm text-slate-800 flex-1 truncate">{p.name}</span>
                      <button onClick={() => moveProduct(i, -1)} className="p-1 text-slate-400 hover:text-slate-900"><ArrowUp className="h-3.5 w-3.5" /></button>
                      <button onClick={() => moveProduct(i, 1)} className="p-1 text-slate-400 hover:text-slate-900"><ArrowDown className="h-3.5 w-3.5" /></button>
                      <button onClick={() => removeProduct(pid)} className="p-1 text-red-500"><X className="h-3.5 w-3.5" /></button>
                    </div>
                  );
                })}
                {editing.product_ids.length === 0 && <div className="text-xs text-slate-400 py-1">No specific products added — the catalogue will use the selected categories, or all products if none.</div>}
              </div>
            </div>

            <Btn variant="accent" onClick={save} className="w-full" data-testid="save-catalogue-btn">Save Catalogue</Btn>
          </div>
        </Modal>
      )}

      {share && (
        <Modal title={`Share "${share.name}"`} onClose={() => setShare(null)}>
          <div className="space-y-2">
            <Btn variant="outline" onClick={() => doShare(share, "copy")} className="w-full justify-start"><Copy className="h-4 w-4" /> Copy Public Link</Btn>
            <Btn variant="outline" onClick={() => doShare(share, "whatsapp")} className="w-full justify-start"><MessageCircle className="h-4 w-4" /> Share via WhatsApp</Btn>
            <Btn variant="outline" onClick={() => doShare(share, "email")} className="w-full justify-start"><Mail className="h-4 w-4" /> Share via Email</Btn>
            <Btn variant="outline" onClick={() => openAuthedFile(`/catalogues/${share.id}/pdf`, `${share.name}.pdf`)} className="w-full justify-start"><Download className="h-4 w-4" /> Download PDF</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
