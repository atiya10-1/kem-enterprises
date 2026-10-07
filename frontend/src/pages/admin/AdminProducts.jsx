import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Search, Edit, Copy, Trash2, Star, Sparkles, Upload, Download, Archive, X } from "lucide-react";
import { toast } from "sonner";
import api, { API_BASE, openAuthedFile, PLACEHOLDER } from "@/lib/api";
import { PageHeader, Btn, Table, Td, StatusBadge, Modal, Select } from "@/components/admin/ui";

export default function AdminProducts() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [selected, setSelected] = useState([]);
  const [cats, setCats] = useState([]);
  const [bulkEdit, setBulkEdit] = useState(null);
  const fileRef = useRef();

  const load = () => {
    setLoading(true);
    api.get(`/products?all=true&limit=500${search ? `&search=${encodeURIComponent(search)}` : ""}`).then((r) => setItems(r.data.items)).finally(() => setLoading(false));
  };
  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t); }, [search]);
  useEffect(() => { api.get("/categories?all=true").then((r) => setCats(r.data)); }, []);

  const toggleSel = (id) => setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  const allSel = items.length > 0 && selected.length === items.length;
  const toggleAll = () => setSelected(allSel ? [] : items.map((p) => p.id));
  const bulkDelete = async () => {
    if (!window.confirm(`You are about to archive ${selected.length} product(s). Historical invoices/quotations are preserved. Continue?`)) return;
    await api.post("/products/bulk-delete", { ids: selected, hard: false });
    toast.success(`${selected.length} products archived`); setSelected([]); load();
  };
  const applyBulkEdit = async () => {
    const fields = Object.fromEntries(Object.entries(bulkEdit).filter(([k, v]) => k !== "ids" && v !== "" && v !== undefined));
    try { const { data } = await api.post("/products/bulk-edit", { ids: selected, fields }); toast.success(`${data.updated} products updated`); setBulkEdit(null); setSelected([]); load(); }
    catch (e) { toast.error("Select at least one field to change"); }
  };

  const toggle = async (p, key) => {
    await api.patch(`/products/${p.id}/flags`, { [key]: !p[key] });
    load();
  };
  const duplicate = async (p) => { await api.post(`/products/${p.id}/duplicate`); toast.success("Product duplicated"); load(); };
  const del = async (p) => { if (!window.confirm(`Delete "${p.name}"?`)) return; await api.delete(`/products/${p.id}`); toast.success("Deleted"); load(); };

  const doImport = async (file) => {
    setImporting(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const { data } = await api.post("/products-import", fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success(`Import complete: ${data.created} created, ${data.updated} updated`);
      load();
    } catch (e) { toast.error("Import failed. Check your file columns."); }
    finally { setImporting(false); }
  };

  return (
    <div data-testid="admin-products">
      <PageHeader title="Products" subtitle={`${items.length} products`}>
        <Btn variant="outline" onClick={() => openAuthedFile("/products-export", "kem-products.csv")} data-testid="export-products-btn"><Download className="h-4 w-4" /> Export CSV</Btn>
        <Btn variant="outline" onClick={() => navigate("/admin/import")} data-testid="import-products-btn"><Upload className="h-4 w-4" /> Import</Btn>
        <Btn variant="accent" onClick={() => navigate("/admin/products/new")} data-testid="add-product-btn"><Plus className="h-4 w-4" /> Add Product</Btn>
      </PageHeader>
      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products…" data-testid="product-search" className="w-full border border-slate-300 text-sm pl-9 pr-3 py-2 focus:outline-none focus:border-kem-accent" />
      </div>
      {selected.length > 0 && (
        <div className="flex items-center gap-3 bg-slate-900 text-white px-4 py-2.5 mb-3" data-testid="bulk-bar">
          <span className="text-sm font-semibold">{selected.length} selected</span>
          <Btn variant="outline" onClick={() => setBulkEdit({ ids: selected })} className="!border-white/30 !text-white !bg-transparent" data-testid="bulk-edit-btn"><Edit className="h-4 w-4" /> Bulk Edit</Btn>
          <Btn variant="outline" onClick={bulkDelete} className="!border-red-400 !text-red-300 !bg-transparent" data-testid="bulk-delete-btn"><Archive className="h-4 w-4" /> Archive</Btn>
          <button onClick={() => setSelected([])} className="ml-auto text-white/70 hover:text-white"><X className="h-4 w-4" /></button>
        </div>
      )}
      {loading ? <div className="text-slate-400 py-16 text-center">Loading…</div> : (
        <Table head={[<input key="all" type="checkbox" checked={allSel} onChange={toggleAll} className="accent-kem-accent h-4 w-4" data-testid="select-all" />, "Product", "Category", "SKU", "Status", "Flags", "Actions"]}>
          {items.map((p) => (
            <tr key={p.id} className="hover:bg-slate-50" data-testid={`product-row-${p.slug}`}>
              <Td><input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggleSel(p.id)} className="accent-kem-accent h-4 w-4" data-testid={`select-${p.slug}`} /></Td>
              <Td><div className="flex items-center gap-3"><img src={(p.images || [])[0] || PLACEHOLDER} alt="" className="h-9 w-9 object-cover border border-slate-200" /><span className="font-medium text-slate-900 max-w-[240px] truncate">{p.name}</span></div></Td>
              <Td className="text-slate-500">{p.category_name}</Td>
              <Td className="font-mono text-xs text-slate-500">{p.sku}</Td>
              <Td><button onClick={() => toggle(p, "active")} data-testid={`toggle-active-${p.slug}`}><span className={`text-[11px] font-semibold px-2 py-0.5 ${p.active ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>{p.active ? "Active" : "Inactive"}</span></button></Td>
              <Td>
                <div className="flex gap-1">
                  <button onClick={() => toggle(p, "featured")} title="Featured" className={`p-1 border ${p.featured ? "border-kem-accent text-kem-accent" : "border-slate-200 text-slate-300"}`}><Star className="h-3.5 w-3.5" /></button>
                  <button onClick={() => toggle(p, "is_new")} title="New" className={`p-1 border ${p.is_new ? "border-kem-accent text-kem-accent" : "border-slate-200 text-slate-300"}`}><Sparkles className="h-3.5 w-3.5" /></button>
                </div>
              </Td>
              <Td>
                <div className="flex gap-1">
                  <button onClick={() => navigate(`/admin/products/${p.id}`)} className="p-1.5 border border-slate-200 text-slate-600 hover:border-slate-900" data-testid={`edit-${p.slug}`}><Edit className="h-3.5 w-3.5" /></button>
                  <button onClick={() => duplicate(p)} className="p-1.5 border border-slate-200 text-slate-600 hover:border-slate-900"><Copy className="h-3.5 w-3.5" /></button>
                  <button onClick={() => del(p)} className="p-1.5 border border-red-200 text-red-500 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </Td>
            </tr>
          ))}
        </Table>
      )}

      {bulkEdit && (
        <Modal title={`Bulk Edit ${selected.length} Products`} onClose={() => setBulkEdit(null)}>
          <p className="text-xs text-slate-500 mb-3">Only the fields you set below will change. Leave a field blank to keep it as-is.</p>
          <div className="space-y-3">
            <Select label="Category" value={bulkEdit.category_id || ""} onChange={(e) => setBulkEdit({ ...bulkEdit, category_id: e.target.value })} data-testid="bulk-category"><option value="">— no change —</option>{cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select>
            <Select label="Active Status" value={bulkEdit.active ?? ""} onChange={(e) => setBulkEdit({ ...bulkEdit, active: e.target.value === "" ? "" : e.target.value === "true" })}><option value="">— no change —</option><option value="true">Active</option><option value="false">Inactive</option></Select>
            <Select label="Featured" value={bulkEdit.featured ?? ""} onChange={(e) => setBulkEdit({ ...bulkEdit, featured: e.target.value === "" ? "" : e.target.value === "true" })}><option value="">— no change —</option><option value="true">Yes</option><option value="false">No</option></Select>
            <Select label="New Product" value={bulkEdit.is_new ?? ""} onChange={(e) => setBulkEdit({ ...bulkEdit, is_new: e.target.value === "" ? "" : e.target.value === "true" })}><option value="">— no change —</option><option value="true">Yes</option><option value="false">No</option></Select>
            <Btn variant="accent" onClick={applyBulkEdit} className="w-full" data-testid="apply-bulk-edit">Apply to {selected.length} Products</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
