import { X } from "lucide-react";

export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div>
        <h1 className="font-display font-bold text-slate-900 text-2xl tracking-tight">{title}</h1>
        {subtitle && <p className="text-slate-500 text-sm mt-1">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}

export function Card({ children, className = "", ...props }) {
  return <div className={`bg-white border border-slate-200 shadow-sm ${className}`} {...props}>{children}</div>;
}

export function Btn({ children, variant = "primary", className = "", ...props }) {
  const styles = {
    primary: "bg-slate-900 text-white hover:bg-kem-accent",
    accent: "bg-kem-accent text-white hover:bg-slate-900",
    outline: "border border-slate-300 text-slate-700 hover:border-slate-900 bg-white",
    ghost: "text-slate-600 hover:bg-slate-100",
    danger: "border border-red-200 text-red-600 hover:bg-red-50 bg-white",
  };
  return <button className={`text-sm font-semibold px-4 py-2 transition-colors inline-flex items-center justify-center gap-1.5 disabled:opacity-50 ${styles[variant]} ${className}`} {...props}>{children}</button>;
}

export function Input({ label, className = "", ...props }) {
  return (
    <label className="block">
      {label && <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide block mb-1.5">{label}</span>}
      <input className={`w-full border border-slate-300 text-sm px-3 py-2 focus:outline-none focus:border-kem-accent bg-white text-slate-900 ${className}`} {...props} />
    </label>
  );
}

export function Textarea({ label, ...props }) {
  return (
    <label className="block">
      {label && <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide block mb-1.5">{label}</span>}
      <textarea className="w-full border border-slate-300 text-sm px-3 py-2 focus:outline-none focus:border-kem-accent bg-white text-slate-900" {...props} />
    </label>
  );
}

export function Select({ label, children, ...props }) {
  return (
    <label className="block">
      {label && <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide block mb-1.5">{label}</span>}
      <select className="w-full border border-slate-300 text-sm px-3 py-2 focus:outline-none focus:border-kem-accent bg-white text-slate-900" {...props}>{children}</select>
    </label>
  );
}

export function Modal({ title, onClose, children, wide }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 grid place-items-center p-4 overflow-y-auto" onClick={onClose} data-testid="admin-modal">
      <div className={`bg-white w-full ${wide ? "max-w-3xl" : "max-w-lg"} border border-slate-200 my-8`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200">
          <h3 className="font-display font-bold text-slate-900">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900" data-testid="modal-close"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export function StatusBadge({ status }) {
  const map = {
    New: "bg-blue-100 text-blue-700", Contacted: "bg-amber-100 text-amber-700",
    "Quotation Sent": "bg-violet-100 text-violet-700", "Follow Up": "bg-cyan-100 text-cyan-700",
    Won: "bg-emerald-100 text-emerald-700", Lost: "bg-red-100 text-red-700", Closed: "bg-slate-200 text-slate-600",
    Paid: "bg-emerald-100 text-emerald-700", Unpaid: "bg-red-100 text-red-700",
    "Partially Paid": "bg-amber-100 text-amber-700", Overdue: "bg-red-100 text-red-700",
    Cancelled: "bg-slate-200 text-slate-600", Draft: "bg-slate-100 text-slate-600",
  };
  return <span className={`text-[11px] font-semibold px-2 py-0.5 ${map[status] || "bg-slate-100 text-slate-600"}`}>{status}</span>;
}

export function Table({ head, children }) {
  return (
    <div className="overflow-x-auto border border-slate-200 bg-white">
      <table className="w-full text-sm">
        <thead><tr className="bg-slate-50 border-b border-slate-200">{head.map((h, i) => <th key={i} className="text-left font-semibold text-slate-500 uppercase text-[11px] tracking-wide px-3 py-2.5 whitespace-nowrap">{h}</th>)}</tr></thead>
        <tbody className="divide-y divide-slate-100">{children}</tbody>
      </table>
    </div>
  );
}

export const Td = ({ children, className = "" }) => <td className={`px-3 py-2.5 text-slate-700 ${className}`}>{children}</td>;
