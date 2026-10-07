import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import api, { formatApiError } from "@/lib/api";
import { PageHeader, Btn, Table, Td, Modal, Input, Textarea } from "@/components/admin/ui";
import ImageUploader from "@/components/admin/ImageUploader";

const EMPTY = { title: "", excerpt: "", content: "", cover_image: "", author: "KEM Enterprises", tags: [], published: true, seo_title: "", seo_description: "" };

export default function AdminBlog() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const load = () => api.get("/blog-admin").then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing.title) { toast.error("Title required"); return; }
    const payload = { ...editing, tags: typeof editing.tags === "string" ? editing.tags.split(",").map((t) => t.trim()).filter(Boolean) : editing.tags };
    try { if (editing.id) await api.put(`/blog/${editing.id}`, payload); else await api.post("/blog", payload); toast.success("Saved"); setEditing(null); load(); }
    catch (e) { toast.error(formatApiError(e.response?.data?.detail)); }
  };
  const del = async (p) => { if (!window.confirm(`Delete "${p.title}"?`)) return; await api.delete(`/blog/${p.id}`); load(); };

  return (
    <div data-testid="admin-blog">
      <PageHeader title="Blog / Knowledge Centre" subtitle={`${items.length} posts`}><Btn variant="accent" onClick={() => setEditing(EMPTY)} data-testid="add-blog-btn"><Plus className="h-4 w-4" /> New Post</Btn></PageHeader>
      <Table head={["Title", "Status", "Date", "Actions"]}>
        {items.map((p) => (
          <tr key={p.id} className="hover:bg-slate-50" data-testid={`blog-row-${p.slug}`}>
            <Td className="font-medium text-slate-900 max-w-[360px] truncate">{p.title}</Td>
            <Td><span className={`text-[11px] font-semibold px-2 py-0.5 ${p.published ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>{p.published ? "Published" : "Draft"}</span></Td>
            <Td className="text-slate-500">{(p.created_at || "").slice(0, 10)}</Td>
            <Td><div className="flex gap-1">
              <a href={`/blog/${p.slug}`} target="_blank" rel="noreferrer" className="p-1.5 border border-slate-200 text-slate-600"><ExternalLink className="h-3.5 w-3.5" /></a>
              <button onClick={() => setEditing({ ...p })} className="p-1.5 border border-slate-200 text-slate-600"><Edit className="h-3.5 w-3.5" /></button>
              <button onClick={() => del(p)} className="p-1.5 border border-red-200 text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
            </div></Td>
          </tr>
        ))}
      </Table>
      {items.length === 0 && <div className="text-slate-400 py-16 text-center border border-slate-200 bg-white">No posts yet.</div>}

      {editing && (
        <Modal title={editing.id ? "Edit Post" : "New Post"} onClose={() => setEditing(null)} wide>
          <div className="space-y-4">
            <Input label="Title" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} data-testid="blog-title" />
            <Textarea label="Excerpt" rows={2} value={editing.excerpt} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} />
            <Textarea label="Content" rows={8} value={editing.content} onChange={(e) => setEditing({ ...editing, content: e.target.value })} data-testid="blog-content" />
            <div><span className="text-xs font-semibold text-slate-600 uppercase block mb-2">Cover Image</span><ImageUploader value={editing.cover_image} onChange={(v) => setEditing({ ...editing, cover_image: v })} folder="blog" single /></div>
            <Input label="SEO Title" value={editing.seo_title || ""} onChange={(e) => setEditing({ ...editing, seo_title: e.target.value })} />
            <Textarea label="Meta Description" rows={2} value={editing.seo_description || ""} onChange={(e) => setEditing({ ...editing, seo_description: e.target.value })} />
            <Input label="Tags (comma separated)" value={Array.isArray(editing.tags) ? editing.tags.join(", ") : editing.tags} onChange={(e) => setEditing({ ...editing, tags: e.target.value })} />
            <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={!!editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} className="accent-kem-accent h-4 w-4" /> Published</label>
            <Btn variant="accent" onClick={save} className="w-full" data-testid="save-blog-btn">Save Post</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
