import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Search, Phone, MessageCircle, ChevronRight, Sun, Moon } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { useTheme } from "@/context/ThemeContext";
import { generalWhatsAppLink } from "@/lib/helpers";
import api from "@/lib/api";

const NAV = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "Catalogue", to: "/catalogue" },
  { label: "Knowledge", to: "/blog" },
  { label: "Applications", to: "/industries" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const { settings } = useSettings();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [q, setQ] = useState("");
  const [sugg, setSugg] = useState([]);
  const [showSugg, setShowSugg] = useState(false);
  const timer = useRef();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onSearchChange = (v) => {
    setQ(v);
    clearTimeout(timer.current);
    if (!v) { setSugg([]); return; }
    timer.current = setTimeout(async () => {
      try { const { data } = await api.get(`/products/search?q=${encodeURIComponent(v)}`); setSugg(data); setShowSugg(true); }
      catch (e) {}
    }, 250);
  };

  const submitSearch = (e) => {
    e.preventDefault();
    if (q.trim()) { navigate(`/search?q=${encodeURIComponent(q)}`); setShowSugg(false); setOpen(false); }
  };

  const phone = settings?.contact?.phone;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-[background,border] duration-300 kem-glass" data-testid="public-navbar">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 h-[70px] flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2 shrink-0" data-testid="nav-logo">
          <div className="h-8 w-8 bg-kem-accent grid place-items-center font-display font-black text-white text-lg">K</div>
          <span className="font-display font-extrabold tracking-tight text-white text-lg leading-none">KEM<span className="text-kem-accent">.</span></span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7 ml-4">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} data-testid={`nav-${n.label.toLowerCase()}`}
              className="text-[13px] font-medium text-white/70 hover:text-white transition-colors tracking-wide uppercase">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block relative ml-auto w-56">
          <form onSubmit={submitSearch}>
            <input value={q} onChange={(e) => onSearchChange(e.target.value)} onFocus={() => sugg.length && setShowSugg(true)}
              onBlur={() => setTimeout(() => setShowSugg(false), 150)}
              placeholder="Search products…" data-testid="nav-search-input"
              className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-2 pl-9 focus:outline-none focus:border-kem-accent placeholder:text-white/40" />
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/40" strokeWidth={1.5} />
          </form>
          {showSugg && sugg.length > 0 && (
            <div className="absolute top-full mt-1 w-full bg-[#0c0c0e] border border-white/10 z-50" data-testid="search-suggestions">
              {sugg.map((s) => (
                <Link key={s.slug} to={`/product/${s.slug}`} onClick={() => setShowSugg(false)}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 border-b border-white/5">
                  <img src={s.image} alt="" className="h-8 w-8 object-cover" />
                  <div className="min-w-0"><div className="text-xs text-white truncate">{s.name}</div>
                  <div className="text-[10px] text-white/40 font-mono">{s.sku}</div></div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="hidden md:flex items-center gap-2 ml-2">
          <button onClick={toggle} data-testid="theme-toggle" title="Toggle light / dark" className="h-9 w-9 grid place-items-center border border-white/10 text-white hover:border-kem-accent transition-colors">{theme === "light" ? <Moon className="h-4 w-4" strokeWidth={1.5} /> : <Sun className="h-4 w-4" strokeWidth={1.5} />}</button>
          {phone && <a href={`tel:${phone}`} data-testid="nav-call-btn" className="h-9 w-9 grid place-items-center border border-white/10 text-white hover:border-kem-accent transition-colors"><Phone className="h-4 w-4" strokeWidth={1.5} /></a>}
          <a href={generalWhatsAppLink(settings)} target="_blank" rel="noreferrer" data-testid="nav-quote-btn"
            className="bg-kem-accent text-white text-[13px] font-semibold px-4 py-2 hover:bg-white hover:text-black transition-colors flex items-center gap-1.5">
            Request a Quote
          </a>
        </div>

        <button className="lg:hidden ml-auto text-white" onClick={() => setOpen(!open)} data-testid="nav-mobile-toggle">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden kem-glass border-t border-white/10 px-5 py-4 space-y-1" data-testid="mobile-menu">
          <form onSubmit={submitSearch} className="relative mb-3">
            <input value={q} onChange={(e) => onSearchChange(e.target.value)} placeholder="Search products…"
              className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-2.5 pl-9 focus:outline-none" />
            <Search className="absolute left-2.5 top-3 h-4 w-4 text-white/40" strokeWidth={1.5} />
          </form>
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)}
              className="flex items-center justify-between py-2.5 text-white/80 border-b border-white/5">
              {n.label} <ChevronRight className="h-4 w-4 text-white/30" />
            </Link>
          ))}
          <div className="flex gap-2 pt-3">
            <button onClick={toggle} className="border border-white/15 text-white px-3 grid place-items-center">{theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}</button>
            {phone && <a href={`tel:${phone}`} className="flex-1 border border-white/15 text-white text-center py-2.5 text-sm flex items-center justify-center gap-2"><Phone className="h-4 w-4" /> Call</a>}
            <a href={generalWhatsAppLink(settings)} target="_blank" rel="noreferrer" className="flex-1 bg-kem-accent text-white text-center py-2.5 text-sm flex items-center justify-center gap-2"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
          </div>
        </div>
      )}
    </header>
  );
}
