import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import api, { formatApiError, fileUrl } from "@/lib/api";
import { PageHeader, Btn, Table, Td, Modal, Input, Textarea } from "@/components/admin/ui";
import ImageUploader from "@/components/admin/ImageUploader";

const EMPTY = { name: "", description: "", image: "", active: true, order: 0, seo_title: "", seo_description: "", seo_keywords: "" };

export default function AdminCategories() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const load = () => api.get("/categories?all=true").then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing.name) { toast.error("Name required"); return; }
    try {
      if (editing.id) await api.put(`/categories/${editing.id}`, editing);
      else await api.post("/categories", editing);
      toast.success("Saved"); setEditing(null); load();
    } catch (e) { toast.error(formatApiError(e.response?.data?.detail)); }
  };
  const del = async (c) => { if (!window.confirm(`Delete "${c.name}"?`)) return; await api.delete(`/categories/${c.id}`); toast.success("Deleted"); load(); };
  const move = async (i, dir) => {
    const arr = [...items]; const j = i + dir; if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]]; setItems(arr);
    await api.post("/categories/reorder", { order: arr.map((c) => c.id) });
  };

  return (
    <div data-testid="admin-categories">
      <PageHeader title="Categories" subtitle={`${items.length} categories`}>
        <Btn variant="accent" onClick={() => setEditing(EMPTY)} data-testid="add-category-btn"><Plus className="h-4 w-4" /> Add Category</Btn>
      </PageHeader>
      <Table head={["", "Category", "Products", "Status", "Order", "Actions"]}>
        {items.map((c, i) => (
          <tr key={c.id} className="hover:bg-slate-50" data-testid={`category-row-${c.slug}`}>
            <Td>{c.image ? <img src={fileUrl(c.image)} alt="" className="h-9 w-9 object-cover border border-slate-200" /> : <div className="h-9 w-9 bg-slate-100" />}</Td>
            <Td><div className="font-medium text-slate-900">{c.name}</div><div className="text-xs text-slate-400 font-mono">{c.slug}</div></Td>
            <Td className="text-slate-500">{c.product_count}</Td>
            <Td><span className={`text-[11px] font-semibold px-2 py-0.5 ${c.active ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>{c.active ? "Active" : "Hidden"}</span></Td>
            <Td><div className="flex gap-1"><button onClick={() => move(i, -1)} className="p-1 border border-slate-200 text-slate-500"><ArrowUp className="h-3.5 w-3.5" /></button><button onClick={() => move(i, 1)} className="p-1 border border-slate-200 text-slate-500"><ArrowDown className="h-3.5 w-3.5" /></button></div></Td>
            <Td><div className="flex gap-1"><button onClick={() => setEditing(c)} className="p-1.5 border border-slate-200 text-slate-600 hover:border-slate-900" data-testid={`edit-cat-${c.slug}`}><Edit className="h-3.5 w-3.5" /></button><button onClick={() => del(c)} className="p-1.5 border border-red-200 text-red-500"><Trash2 className="h-3.5 w-3.5" /></button></div></Td>
          </tr>
        ))}
      </Table>

      {editing && (
        <Modal title={editing.id ? "Edit Category" : "New Category"} onClose={() => setEditing(null)}>
          <div className="space-y-4">
            <Input label="Name" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} data-testid="cat-name" />
            <Textarea label="Description" rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
            <div><span className="text-xs font-semibold text-slate-600 uppercase tracking-wide block mb-2">Image</span><ImageUploader value={editing.image} onChange={(v) => setEditing({ ...editing, image: v })} folder="categories" single /></div>
            <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={!!editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} className="accent-kem-accent h-4 w-4" /> Active</label>
            <Btn variant="accent" onClick={save} className="w-full" data-testid="save-category-btn">Save Category</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
