import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, Download, IndianRupee } from "lucide-react";
import { toast } from "sonner";
import api, { API_BASE, openAuthedFile } from "@/lib/api";
import { inr } from "@/lib/helpers";
import { PageHeader, Btn, Table, Td, StatusBadge, Modal, Input, Select } from "@/components/admin/ui";

export default function AdminInvoices() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [pay, setPay] = useState(null);
  const [form, setForm] = useState({ amount: "", method: "Cash", note: "" });
  const load = () => api.get("/invoices").then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);
  const del = async (i) => { if (!window.confirm(`Delete ${i.number}?`)) return; await api.delete(`/invoices/${i.id}`); load(); };
  const record = async () => {
    if (!form.amount) { toast.error("Enter amount"); return; }
    await api.post(`/invoices/${pay.id}/payments`, { ...form, amount: Number(form.amount) });
    toast.success("Payment recorded"); setPay(null); setForm({ amount: "", method: "Cash", note: "" }); load();
  };
  const paidOf = (i) => (i.payments || []).reduce((s, p) => s + p.amount, 0);

  return (
    <div data-testid="admin-invoices">
      <PageHeader title="Invoices & Billing" subtitle={`${items.length} invoices`}><Btn variant="accent" onClick={() => navigate("/admin/invoices/new")} data-testid="add-invoice-btn"><Plus className="h-4 w-4" /> New Invoice</Btn></PageHeader>
      <Table head={["Number", "Customer", "Date", "Total", "Paid", "Status", "Actions"]}>
        {items.map((i) => (
          <tr key={i.id} className="hover:bg-slate-50" data-testid={`invoice-row-${i.number}`}>
            <Td className="font-mono text-xs font-semibold text-slate-900">{i.number}</Td>
            <Td>{i.customer_name}</Td>
            <Td className="text-slate-500">{i.date}</Td>
            <Td className="font-semibold text-slate-900">{inr(i.total)}</Td>
            <Td className="text-slate-500">{inr(paidOf(i))}</Td>
            <Td><StatusBadge status={i.payment_status} /></Td>
            <Td><div className="flex gap-1">
              <button onClick={() => setPay(i)} title="Record payment" className="p-1.5 border border-slate-200 text-emerald-600 hover:border-emerald-600" data-testid={`pay-${i.number}`}><IndianRupee className="h-3.5 w-3.5" /></button>
              <button onClick={() => openAuthedFile(`/invoices/${i.id}/pdf`)} className="p-1.5 border border-slate-200 text-slate-600 hover:border-slate-900" data-testid={`inv-pdf-${i.number}`}><Download className="h-3.5 w-3.5" /></button>
              <button onClick={() => navigate(`/admin/invoices/${i.id}`)} className="p-1.5 border border-slate-200 text-slate-600"><Edit className="h-3.5 w-3.5" /></button>
              <button onClick={() => del(i)} className="p-1.5 border border-red-200 text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
            </div></Td>
          </tr>
        ))}
      </Table>
      {items.length === 0 && <div className="text-slate-400 py-16 text-center border border-slate-200 bg-white">No invoices yet.</div>}

      {pay && (
        <Modal title={`Record Payment — ${pay.number}`} onClose={() => setPay(null)}>
          <div className="space-y-3">
            <div className="text-sm text-slate-500">Total: {inr(pay.total)} · Paid: {inr(paidOf(pay))} · Due: {inr(pay.total - paidOf(pay))}</div>
            <Input label="Amount (₹)" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} data-testid="payment-amount" />
            <Select label="Method" value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })}>{["Cash", "Bank Transfer", "UPI", "Cheque", "Card"].map((m) => <option key={m}>{m}</option>)}</Select>
            <Input label="Note" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
            <Btn variant="accent" onClick={record} className="w-full" data-testid="save-payment-btn">Record Payment</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
