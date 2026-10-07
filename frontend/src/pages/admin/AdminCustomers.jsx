import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search, Phone, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import api, { formatApiError } from "@/lib/api";
import { PageHeader, Btn, Table, Td, Modal, Input, Textarea } from "@/components/admin/ui";
import { whatsappLink } from "@/lib/helpers";

const EMPTY = { name: "", company: "", phone: "", whatsapp: "", email: "", address: "", gstin: "", notes: "" };

export default function AdminCustomers() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const load = () => api.get(`/customers${search ? `?search=${encodeURIComponent(search)}` : ""}`).then((r) => setItems(r.data));
  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t); }, [search]);

  const save = async () => {
    if (!editing.name) { toast.error("Name required"); return; }
    try { if (editing.id) await api.put(`/customers/${editing.id}`, editing); else await api.post("/customers", editing); toast.success("Saved"); setEditing(null); load(); }
    catch (e) { toast.error(formatApiError(e.response?.data?.detail)); }
  };
  const del = async (c) => { if (!window.confirm(`Delete "${c.name}"?`)) return; await api.delete(`/customers/${c.id}`); load(); };

  return (
    <div data-testid="admin-customers">
      <PageHeader title="Customers" subtitle={`${items.length} customers`}>
        <Btn variant="accent" onClick={() => setEditing(EMPTY)} data-testid="add-customer-btn"><Plus className="h-4 w-4" /> Add Customer</Btn>
      </PageHeader>
      <div className="relative mb-4 max-w-sm"><Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…" className="w-full border border-slate-300 text-sm pl-9 pr-3 py-2 focus:outline-none focus:border-kem-accent" /></div>
      <Table head={["Name", "Company", "Phone", "Email", "GSTIN", "Actions"]}>
        {items.map((c) => (
          <tr key={c.id} className="hover:bg-slate-50" data-testid={`customer-row-${c.id}`}>
            <Td className="font-medium text-slate-900">{c.name}</Td>
            <Td className="text-slate-500">{c.company}</Td>
            <Td className="text-slate-500">{c.phone}</Td>
            <Td className="text-slate-500">{c.email}</Td>
            <Td className="text-slate-500 font-mono text-xs">{c.gstin}</Td>
            <Td><div className="flex gap-1">
              {c.phone && <a href={`tel:${c.phone}`} className="p-1.5 border border-slate-200 text-slate-600"><Phone className="h-3.5 w-3.5" /></a>}
              <a href={whatsappLink(c.whatsapp || c.phone, `Hello ${c.name}`)} target="_blank" rel="noreferrer" className="p-1.5 border border-slate-200 text-emerald-600"><MessageCircle className="h-3.5 w-3.5" /></a>
              <button onClick={() => setEditing(c)} className="p-1.5 border border-slate-200 text-slate-600"><Edit className="h-3.5 w-3.5" /></button>
              <button onClick={() => del(c)} className="p-1.5 border border-red-200 text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
            </div></Td>
          </tr>
        ))}
      </Table>
      {items.length === 0 && <div className="text-slate-400 py-16 text-center border border-slate-200 bg-white">No customers yet.</div>}

      {editing && (
        <Modal title={editing.id ? "Edit Customer" : "New Customer"} onClose={() => setEditing(null)}>
          <div className="space-y-3">
            {[["name", "Name *"], ["company", "Company"], ["phone", "Phone"], ["whatsapp", "WhatsApp"], ["email", "Email"], ["gstin", "GSTIN"]].map(([k, l]) => (
              <Input key={k} label={l} value={editing[k]} onChange={(e) => setEditing({ ...editing, [k]: e.target.value })} data-testid={`cust-${k}`} />
            ))}
            <Textarea label="Address" rows={2} value={editing.address} onChange={(e) => setEditing({ ...editing, address: e.target.value })} />
            <Textarea label="Notes" rows={2} value={editing.notes} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} />
            <Btn variant="accent" onClick={save} className="w-full" data-testid="save-customer-btn">Save Customer</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
