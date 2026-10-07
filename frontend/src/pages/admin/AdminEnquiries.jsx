import { useEffect, useState } from "react";
import { Phone, MessageCircle, Mail, UserPlus, Trash2, FileText } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { PageHeader, Table, Td, StatusBadge, Modal, Btn, Select } from "@/components/admin/ui";
import { whatsappLink } from "@/lib/helpers";

const STATUSES = ["New", "Contacted", "Quotation Sent", "Follow Up", "Won", "Lost", "Closed"];

export default function AdminEnquiries() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [view, setView] = useState(null);
  const [filter, setFilter] = useState("");
  const [note, setNote] = useState("");
  const load = () => api.get(`/enquiries${filter ? `?status=${encodeURIComponent(filter)}` : ""}`).then((r) => setItems(r.data));
  useEffect(() => { load(); }, [filter]);

  const setStatus = async (e, status) => { await api.patch(`/enquiries/${e.id}`, { status }); toast.success("Status updated"); load(); if (view?.id === e.id) setView({ ...view, status }); };
  const addNote = async () => { if (!note) return; const r = await api.patch(`/enquiries/${view.id}`, { note }); setView(r.data); setNote(""); toast.success("Note added"); };
  const toCustomer = async (e) => { await api.post(`/enquiries/${e.id}/to-customer`); toast.success("Converted to customer"); };
  const del = async (e) => { if (!window.confirm("Delete enquiry?")) return; await api.delete(`/enquiries/${e.id}`); setView(null); load(); };

  return (
    <div data-testid="admin-enquiries">
      <PageHeader title="Enquiries" subtitle={`${items.length} enquiries`}>
        <Select value={filter} onChange={(e) => setFilter(e.target.value)}><option value="">All Statuses</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}</Select>
      </PageHeader>
      <Table head={["Customer", "Product", "Contact", "Status", "Actions"]}>
        {items.map((e) => (
          <tr key={e.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => setView(e)} data-testid={`enquiry-row-${e.id}`}>
            <Td><div className="font-medium text-slate-900">{e.name}</div><div className="text-xs text-slate-400">{e.company}</div></Td>
            <Td className="text-slate-500 max-w-[200px] truncate">{e.product_name || "—"}</Td>
            <Td className="text-slate-500 text-xs">{e.phone}<br />{e.email}</Td>
            <Td onClick={(ev) => ev.stopPropagation()}><StatusBadge status={e.status} /></Td>
            <Td onClick={(ev) => ev.stopPropagation()}>
              <div className="flex gap-1">
                {e.phone && <a href={`tel:${e.phone}`} className="p-1.5 border border-slate-200 text-slate-600"><Phone className="h-3.5 w-3.5" /></a>}
                <a href={whatsappLink(e.whatsapp || e.phone, `Hello ${e.name}`)} target="_blank" rel="noreferrer" className="p-1.5 border border-slate-200 text-emerald-600"><MessageCircle className="h-3.5 w-3.5" /></a>
                <button onClick={() => del(e)} className="p-1.5 border border-red-200 text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </Td>
          </tr>
        ))}
      </Table>
      {items.length === 0 && <div className="text-slate-400 py-16 text-center border border-slate-200 bg-white">No enquiries yet.</div>}

      {view && (
        <Modal title="Enquiry Details" onClose={() => setView(null)} wide>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <Detail label="Name" value={view.name} /><Detail label="Company" value={view.company} />
            <Detail label="Phone" value={view.phone} /><Detail label="Email" value={view.email} />
            <Detail label="Product" value={view.product_name} /><Detail label="Quantity" value={view.quantity} />
            <div className="sm:col-span-2"><Detail label="Requirement / Message" value={view.requirement || view.message} /></div>
          </div>
          <div className="mt-4">
            <Select label="Status" value={view.status} onChange={(e) => setStatus(view, e.target.value)} data-testid="enquiry-status-select">{STATUSES.map((s) => <option key={s}>{s}</option>)}</Select>
          </div>
          <div className="mt-4">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide block mb-2">Notes</span>
            <div className="space-y-1 mb-2 max-h-32 overflow-y-auto">{(view.notes || []).map((n, i) => <div key={i} className="text-xs bg-slate-50 p-2 border border-slate-100">{n.text} <span className="text-slate-400">— {n.by}</span></div>)}</div>
            <div className="flex gap-2"><input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add note…" className="flex-1 border border-slate-300 text-sm px-3 py-2" /><Btn variant="outline" onClick={addNote}>Add</Btn></div>
          </div>
          <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-slate-200">
            <Btn variant="outline" onClick={() => toCustomer(view)}><UserPlus className="h-4 w-4" /> Convert to Customer</Btn>
            <Btn variant="accent" onClick={() => navigate("/admin/quotations/new", { state: { enquiry: view } })}><FileText className="h-4 w-4" /> Create Quotation</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
const Detail = ({ label, value }) => <div><div className="text-[10px] uppercase tracking-wide text-slate-400">{label}</div><div className="text-slate-800">{value || "—"}</div></div>;
