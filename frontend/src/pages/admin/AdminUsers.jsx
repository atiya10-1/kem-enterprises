import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import api, { formatApiError } from "@/lib/api";
import { PageHeader, Btn, Table, Td, Modal, Input, Select } from "@/components/admin/ui";

const ROLES = [["super_admin", "Super Admin"], ["admin", "Admin"], ["sales", "Sales"], ["accounts", "Accounts"], ["content_manager", "Content Manager"]];

export default function AdminUsers() {
  const [items, setItems] = useState([]);
  const [adding, setAdding] = useState(null);
  const load = () => api.get("/users").then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!adding.name || !adding.email || !adding.password) { toast.error("All fields required"); return; }
    try { await api.post("/users", adding); toast.success("User created"); setAdding(null); load(); }
    catch (e) { toast.error(formatApiError(e.response?.data?.detail)); }
  };
  const del = async (u) => { if (!window.confirm(`Delete ${u.name}?`)) return; try { await api.delete(`/users/${u.id}`); load(); } catch (e) { toast.error(formatApiError(e.response?.data?.detail)); } };

  return (
    <div data-testid="admin-users">
      <PageHeader title="Users & Roles" subtitle={`${items.length} users`}><Btn variant="accent" onClick={() => setAdding({ name: "", email: "", password: "", role: "sales" })} data-testid="add-user-btn"><Plus className="h-4 w-4" /> Add User</Btn></PageHeader>
      <Table head={["Name", "Email", "Role", "Actions"]}>
        {items.map((u) => (
          <tr key={u.id} className="hover:bg-slate-50" data-testid={`user-row-${u.email}`}>
            <Td className="font-medium text-slate-900">{u.name}</Td>
            <Td className="text-slate-500">{u.email}</Td>
            <Td><span className="text-[11px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 capitalize">{u.role.replace("_", " ")}</span></Td>
            <Td>{u.role !== "super_admin" && <button onClick={() => del(u)} className="p-1.5 border border-red-200 text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>}</Td>
          </tr>
        ))}
      </Table>
      {adding && (
        <Modal title="Add User" onClose={() => setAdding(null)}>
          <div className="space-y-3">
            <Input label="Name" value={adding.name} onChange={(e) => setAdding({ ...adding, name: e.target.value })} data-testid="user-name" />
            <Input label="Email" type="email" value={adding.email} onChange={(e) => setAdding({ ...adding, email: e.target.value })} data-testid="user-email" />
            <Input label="Password" type="password" value={adding.password} onChange={(e) => setAdding({ ...adding, password: e.target.value })} data-testid="user-password" />
            <Select label="Role" value={adding.role} onChange={(e) => setAdding({ ...adding, role: e.target.value })} data-testid="user-role">{ROLES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</Select>
            <Btn variant="accent" onClick={save} className="w-full" data-testid="save-user-btn">Create User</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
