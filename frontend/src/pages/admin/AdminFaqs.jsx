import { useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import api, { formatApiError } from "@/lib/api";
import { PageHeader, Btn, Table, Td, Modal, Input, Textarea } from "@/components/admin/ui";

const EMPTY = { question: "", answer: "", order: 0, active: true };

export default function AdminFaqs() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const load = () => api.get("/faqs-admin").then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing.question || !editing.answer) { toast.error("Question and answer required"); return; }
    try { if (editing.id) await api.put(`/faqs/${editing.id}`, editing); else await api.post("/faqs", { ...editing, order: items.length }); toast.success("Saved"); setEditing(null); load(); }
    catch (e) { toast.error(formatApiError(e.response?.data?.detail)); }
  };
  const del = async (f) => { if (!window.confirm("Delete this FAQ?")) return; await api.delete(`/faqs/${f.id}`); load(); };

  return (
    <div data-testid="admin-faqs">
      <PageHeader title="FAQs" subtitle={`${items.length} questions`}><Btn variant="accent" onClick={() => setEditing(EMPTY)} data-testid="add-faq-btn"><Plus className="h-4 w-4" /> New FAQ</Btn></PageHeader>
      <Table head={["Question", "Status", "Actions"]}>
        {items.map((f) => (
          <tr key={f.id} className="hover:bg-slate-50" data-testid={`faq-row-${f.id}`}>
            <Td className="font-medium text-slate-900 max-w-[500px]">{f.question}</Td>
            <Td><span className={`text-[11px] font-semibold px-2 py-0.5 ${f.active ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>{f.active ? "Active" : "Hidden"}</span></Td>
            <Td><div className="flex gap-1"><button onClick={() => setEditing({ ...f })} className="p-1.5 border border-slate-200 text-slate-600"><Edit className="h-3.5 w-3.5" /></button><button onClick={() => del(f)} className="p-1.5 border border-red-200 text-red-500"><Trash2 className="h-3.5 w-3.5" /></button></div></Td>
          </tr>
        ))}
      </Table>
      {items.length === 0 && <div className="text-slate-400 py-16 text-center border border-slate-200 bg-white">No FAQs yet.</div>}

      {editing && (
        <Modal title={editing.id ? "Edit FAQ" : "New FAQ"} onClose={() => setEditing(null)}>
          <div className="space-y-4">
            <Input label="Question" value={editing.question} onChange={(e) => setEditing({ ...editing, question: e.target.value })} data-testid="faq-question" />
            <Textarea label="Answer" rows={4} value={editing.answer} onChange={(e) => setEditing({ ...editing, answer: e.target.value })} data-testid="faq-answer" />
            <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={!!editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} className="accent-kem-accent h-4 w-4" /> Active</label>
            <Btn variant="accent" onClick={save} className="w-full" data-testid="save-faq-btn">Save FAQ</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
