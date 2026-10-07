import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, Download, FileText, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import api, { API_BASE, openAuthedFile } from "@/lib/api";
import { inr } from "@/lib/helpers";
import { PageHeader, Btn, Table, Td, StatusBadge } from "@/components/admin/ui";

export default function AdminQuotations() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const load = () => api.get("/quotations").then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);
  const del = async (q) => { if (!window.confirm(`Delete ${q.number}?`)) return; await api.delete(`/quotations/${q.id}`); load(); };
  const convert = async (q) => { await api.post(`/quotations/${q.id}/convert-invoice`); toast.success("Converted to invoice"); navigate("/admin/invoices"); };

  return (
    <div data-testid="admin-quotations">
      <PageHeader title="Quotations" subtitle={`${items.length} quotations`}><Btn variant="accent" onClick={() => navigate("/admin/quotations/new")} data-testid="add-quotation-btn"><Plus className="h-4 w-4" /> New Quotation</Btn></PageHeader>
      <Table head={["Number", "Customer", "Date", "Total", "Status", "Actions"]}>
        {items.map((q) => (
          <tr key={q.id} className="hover:bg-slate-50" data-testid={`quotation-row-${q.number}`}>
            <Td className="font-mono text-xs font-semibold text-slate-900">{q.number}</Td>
            <Td>{q.customer_name}<div className="text-xs text-slate-400">{q.company}</div></Td>
            <Td className="text-slate-500">{q.date}</Td>
            <Td className="font-semibold text-slate-900">{inr(q.total)}</Td>
            <Td><StatusBadge status={q.status} /></Td>
            <Td><div className="flex gap-1">
              <button onClick={() => openAuthedFile(`/quotations/${q.id}/pdf`)} className="p-1.5 border border-slate-200 text-slate-600 hover:border-slate-900" data-testid={`pdf-${q.number}`}><Download className="h-3.5 w-3.5" /></button>
              <button onClick={() => convert(q)} title="Convert to invoice" className="p-1.5 border border-slate-200 text-slate-600 hover:border-slate-900"><FileText className="h-3.5 w-3.5" /></button>
              <button onClick={() => navigate(`/admin/quotations/${q.id}`)} className="p-1.5 border border-slate-200 text-slate-600"><Edit className="h-3.5 w-3.5" /></button>
              <button onClick={() => del(q)} className="p-1.5 border border-red-200 text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
            </div></Td>
          </tr>
        ))}
      </Table>
      {items.length === 0 && <div className="text-slate-400 py-16 text-center border border-slate-200 bg-white">No quotations yet.</div>}
    </div>
  );
}
