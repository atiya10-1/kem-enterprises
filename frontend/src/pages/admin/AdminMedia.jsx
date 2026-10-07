import { useEffect, useState } from "react";
import { Copy, Trash2, FileText } from "lucide-react";
import { toast } from "sonner";
import api, { fileUrl } from "@/lib/api";
import { PageHeader } from "@/components/admin/ui";
import ImageUploader from "@/components/admin/ImageUploader";

export default function AdminMedia() {
  const [items, setItems] = useState([]);
  const load = () => api.get("/media").then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);
  const del = async (m) => { if (!window.confirm("Delete this file?")) return; await api.delete(`/media/${m.id}`); load(); };
  const copy = (m) => { navigator.clipboard.writeText(fileUrl(m.url)); toast.success("URL copied"); };

  return (
    <div data-testid="admin-media">
      <PageHeader title="Media Library" subtitle={`${items.length} files`} />
      <div className="bg-white border border-slate-200 p-5 mb-5">
        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide block mb-3">Upload New Media</span>
        <ImageUploader value={[]} onChange={() => load()} folder="library" accept="image/*,application/pdf,video/mp4" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {items.map((m) => (
          <div key={m.id} className="border border-slate-200 bg-white group" data-testid={`media-${m.id}`}>
            <div className="aspect-square bg-slate-50 grid place-items-center overflow-hidden">
              {m.content_type?.startsWith("image") ? <img src={fileUrl(m.url)} alt="" className="h-full w-full object-cover" /> : <FileText className="h-10 w-10 text-slate-300" />}
            </div>
            <div className="p-2">
              <div className="text-xs text-slate-600 truncate">{m.original_filename}</div>
              <div className="flex gap-1 mt-2">
                <button onClick={() => copy(m)} className="flex-1 border border-slate-200 text-slate-500 py-1 text-xs flex items-center justify-center gap-1 hover:border-slate-900"><Copy className="h-3 w-3" /> Copy</button>
                <button onClick={() => del(m)} className="border border-red-200 text-red-500 py-1 px-2 text-xs"><Trash2 className="h-3 w-3" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && <div className="text-slate-400 py-16 text-center border border-slate-200 bg-white">No media uploaded yet.</div>}
    </div>
  );
}
