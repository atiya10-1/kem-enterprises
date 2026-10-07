import { useState } from "react";
import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
import { LayoutDashboard, Package, FolderTree, Image, MessageSquare, Users, FileText, ReceiptText, CreditCard, BookOpen, BarChart3, Settings, UserCog, LogOut, Plus, Menu, X, ExternalLink, ChevronDown, Newspaper, HelpCircle, Upload } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { SEO } from "@/components/public/SEO";

const NAV = [
  ["", "Dashboard", LayoutDashboard, "dashboard"],
  ["products", "Products", Package, "products"],
  ["import", "Bulk Import", Upload, "products"],
  ["categories", "Categories", FolderTree, "categories"],
  ["media", "Media", Image, "media"],
  ["enquiries", "Enquiries", MessageSquare, "enquiries"],
  ["customers", "Customers", Users, "customers"],
  ["quotations", "Quotations", FileText, "quotations"],
  ["invoices", "Invoices", ReceiptText, "invoices"],
  ["catalogues", "Catalogues", BookOpen, "catalogues"],
  ["blog", "Blog", Newspaper, "content"],
  ["faqs", "FAQs", HelpCircle, "content"],
  ["reports", "Reports", BarChart3, "reports"],
  ["settings", "Settings", Settings, "settings"],
  ["users", "Users & Roles", UserCog, "settings"],
];

const QUICK = [["products/new", "Product"], ["categories", "Category"], ["customers", "Customer"], ["quotations/new", "Quotation"], ["invoices/new", "Invoice"], ["catalogues", "Catalogue"]];

export default function AdminLayout() {
  const { user, logout, can } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [quick, setQuick] = useState(false);

  const doLogout = async () => { await logout(); toast.success("Logged out"); navigate("/admin/login"); };
  const visible = NAV.filter(([, , , section]) => can(section));

  return (
    <>
      <SEO title="KEM Admin" description="KEM Enterprises administration" noindex />
    <div className="min-h-screen bg-slate-50 font-body flex" data-testid="admin-layout">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-60 bg-white border-r border-slate-200 flex flex-col transition-transform ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="h-14 flex items-center gap-2 px-4 border-b border-slate-200">
          <div className="h-8 w-8 bg-kem-accent grid place-items-center font-display font-black text-white">K</div>
          <span className="font-display font-extrabold text-slate-900">KEM Admin</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-3 no-scrollbar">
          {visible.map(([to, label, Icon]) => (
            <NavLink key={to} to={`/admin/${to}`} end={to === ""} onClick={() => setOpen(false)} data-testid={`sidebar-${label.toLowerCase().replace(/[^a-z]/g, "-")}`}
              className={({ isActive }) => `flex items-center gap-3 px-4 py-2.5 text-sm font-medium border-l-2 ${isActive ? "border-kem-accent bg-orange-50 text-kem-accent" : "border-transparent text-slate-600 hover:bg-slate-50"}`}>
              <Icon className="h-4.5 w-4.5" strokeWidth={1.5} /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-slate-200 p-3">
          <div className="text-xs text-slate-500 px-1 mb-2 truncate">{user?.name} · <span className="capitalize">{user?.role?.replace("_", " ")}</span></div>
          <button onClick={doLogout} data-testid="logout-btn" className="w-full flex items-center gap-2 text-sm text-slate-600 hover:text-red-600 px-1 py-1.5"><LogOut className="h-4 w-4" /> Logout</button>
        </div>
      </aside>
      {open && <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setOpen(false)} />}

      <div className="flex-1 min-w-0">
        <header className="h-14 bg-white border-b border-slate-200 flex items-center gap-3 px-4 sticky top-0 z-20">
          <button className="lg:hidden text-slate-600" onClick={() => setOpen(true)}><Menu /></button>
          <Link to="/" target="_blank" className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1.5 ml-auto"><ExternalLink className="h-4 w-4" /> View Site</Link>
          <div className="relative">
            <button onClick={() => setQuick(!quick)} data-testid="quick-add-btn" className="bg-kem-accent text-white text-sm font-semibold px-3 py-2 flex items-center gap-1.5"><Plus className="h-4 w-4" /> Quick Add <ChevronDown className="h-3.5 w-3.5" /></button>
            {quick && (
              <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-slate-200 shadow-lg z-30" onMouseLeave={() => setQuick(false)}>
                {QUICK.map(([to, label]) => <Link key={to} to={`/admin/${to}`} onClick={() => setQuick(false)} className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">{label}</Link>)}
              </div>
            )}
          </div>
        </header>
        <div className="p-4 sm:p-6 max-w-[1400px]"><Outlet /></div>
      </div>
    </div>
    </>
  );
}
