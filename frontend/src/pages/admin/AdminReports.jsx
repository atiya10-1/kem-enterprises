import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";
import api from "@/lib/api";
import { inr } from "@/lib/helpers";
import { PageHeader, Card } from "@/components/admin/ui";

const COLORS = ["#FF4D00", "#0f172a", "#64748b", "#f59e0b", "#10b981", "#8b5cf6"];

export default function AdminReports() {
  const [data, setData] = useState(null);
  useEffect(() => { api.get("/dashboard/stats").then((r) => setData(r.data)); }, []);
  if (!data) return <div className="text-slate-400 py-20 text-center">Loading reports…</div>;
  const c = data.cards;
  const enquiryData = data.most_enquired.filter((p) => p.enquiry_count > 0).map((p) => ({ name: p.name.slice(0, 18), value: p.enquiry_count }));

  return (
    <div data-testid="admin-reports">
      <PageHeader title="Business Reports" subtitle="Sales, quotations, enquiries & product analytics" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[["Total Invoiced", inr(c.total_sales)], ["Pending Payments", inr(c.pending_payments)], ["Total Quotations", c.quotations], ["Total Enquiries", c.enquiries]].map(([l, v]) => (
          <Card key={l} className="p-4"><div className="text-xs font-semibold text-slate-500 uppercase">{l}</div><div className="font-display font-black text-slate-900 text-2xl mt-1">{v}</div></Card>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="font-semibold text-slate-900 mb-4">Monthly Sales & Invoices</h3>
          <ResponsiveContainer width="100%" height={260}><BarChart data={data.monthly}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="month" tick={{ fontSize: 11 }} tickFormatter={(m) => m.slice(5)} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend /><Bar dataKey="sales" fill="#FF4D00" name="Sales ₹" /><Bar dataKey="invoices" fill="#0f172a" name="Invoices" /></BarChart></ResponsiveContainer>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold text-slate-900 mb-4">Most Enquired Products</h3>
          {enquiryData.length ? (
            <ResponsiveContainer width="100%" height={260}><PieChart><Pie data={enquiryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>{enquiryData.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer>
          ) : <div className="text-slate-400 text-sm py-20 text-center">No enquiry data yet.</div>}
        </Card>
        <Card className="p-5 lg:col-span-2">
          <h3 className="font-semibold text-slate-900 mb-4">Monthly Enquiries & Quotations</h3>
          <ResponsiveContainer width="100%" height={240}><BarChart data={data.monthly}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="month" tick={{ fontSize: 11 }} tickFormatter={(m) => m.slice(5)} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend /><Bar dataKey="enquiries" fill="#64748b" name="Enquiries" /><Bar dataKey="quotations" fill="#FF4D00" name="Quotations" /></BarChart></ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
