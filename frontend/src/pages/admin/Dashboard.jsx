import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, FolderTree, MessageSquare, Users, FileText, ReceiptText, IndianRupee, Download, TrendingUp } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import api from "@/lib/api";
import { inr } from "@/lib/helpers";
import { Card, StatusBadge } from "@/components/admin/ui";

export default function Dashboard() {
  const [data, setData] = useState(null);
  useEffect(() => { api.get("/dashboard/stats").then((r) => setData(r.data)); }, []);
  if (!data) return <div className="text-slate-400 py-20 text-center">Loading dashboard…</div>;
  const c = data.cards;

  const kpis = [
    ["Total Products", c.total_products, Package, `${c.active_products} active`],
    ["Categories", c.categories, FolderTree, "Live on site"],
    ["Enquiries", c.enquiries, MessageSquare, `${c.new_enquiries} new`],
    ["Customers", c.customers, Users, "In CRM"],
    ["Quotations", c.quotations, FileText, "Created"],
    ["Invoices", c.invoices, ReceiptText, "Generated"],
    ["Total Sales", inr(c.total_sales), IndianRupee, "Invoiced"],
    ["Pending Payments", inr(c.pending_payments), TrendingUp, "Outstanding"],
  ];

  return (
    <div data-testid="admin-dashboard">
      <h1 className="font-display font-bold text-slate-900 text-2xl tracking-tight mb-1">Dashboard</h1>
      <p className="text-slate-500 text-sm mb-6">Overview of your KEM Enterprises business.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(([label, value, Icon, sub]) => (
          <Card key={label} className="p-4" data-testid={`kpi-${label.toLowerCase().replace(/[^a-z]/g, "-")}`}>
            <div className="flex items-center justify-between"><span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</span><Icon className="h-4 w-4 text-kem-accent" strokeWidth={1.5} /></div>
            <div className="font-display font-black text-slate-900 text-2xl mt-2">{value}</div>
            <div className="text-xs text-slate-400 mt-0.5">{sub}</div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mt-6">
        <Card className="p-5">
          <h3 className="font-semibold text-slate-900 mb-4">Monthly Sales</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.monthly}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="month" tick={{ fontSize: 11 }} tickFormatter={(m) => m.slice(5)} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="sales" fill="#FF4D00" /></BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold text-slate-900 mb-4">Enquiries & Quotations</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data.monthly}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="month" tick={{ fontSize: 11 }} tickFormatter={(m) => m.slice(5)} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Line type="monotone" dataKey="enquiries" stroke="#0f172a" strokeWidth={2} /><Line type="monotone" dataKey="quotations" stroke="#FF4D00" strokeWidth={2} /></LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mt-6">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4"><h3 className="font-semibold text-slate-900">Recent Enquiries</h3><Link to="/admin/enquiries" className="text-xs text-kem-accent font-semibold">View all</Link></div>
          <div className="divide-y divide-slate-100">
            {data.recent_enquiries.length === 0 && <p className="text-sm text-slate-400 py-4">No enquiries yet.</p>}
            {data.recent_enquiries.map((e) => (
              <div key={e.id} className="flex items-center justify-between py-2.5"><div><div className="text-sm font-medium text-slate-900">{e.name}</div><div className="text-xs text-slate-400 truncate max-w-[220px]">{e.product_name || e.requirement || "General enquiry"}</div></div><StatusBadge status={e.status} /></div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold text-slate-900 mb-4">Most Viewed Products</h3>
          <div className="divide-y divide-slate-100">
            {data.top_products.map((p) => (
              <div key={p.id} className="flex items-center gap-3 py-2.5"><img src={(p.images || [])[0]} alt="" className="h-9 w-9 object-cover border border-slate-200" /><div className="flex-1 min-w-0"><div className="text-sm font-medium text-slate-900 truncate">{p.name}</div><div className="text-xs text-slate-400">{p.category_name}</div></div><span className="text-xs text-slate-500 font-mono">{p.views || 0} views</span></div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
