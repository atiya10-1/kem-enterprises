import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Download, ArrowRight } from "lucide-react";
import api, { API_BASE } from "@/lib/api";
import { PageHead } from "@/pages/public/Products";
import ProductCard from "@/components/public/ProductCard";

export default function Catalogue() {
  const [cats, setCats] = useState([]);
  const [items, setItems] = useState([]);
  const [active, setActive] = useState("");

  useEffect(() => { window.scrollTo(0, 0); api.get("/categories").then((r) => setCats(r.data.filter((c) => c.product_count > 0))); }, []);
  useEffect(() => {
    const params = new URLSearchParams({ limit: "60", sort: "name_asc" });
    if (active) params.set("category", active);
    api.get(`/products?${params}`).then((r) => setItems(r.data.items));
  }, [active]);

  return (
    <div className="pt-28 pb-24 max-w-[1400px] mx-auto px-5 sm:px-8" data-testid="catalogue-page">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <PageHead label="Digital Showroom" title="Product Catalogue" sub="Browse the complete KEM Enterprises range and download the full catalogue as a premium PDF." />
        <a href="#" onClick={(e) => { e.preventDefault(); window.print(); }} className="hidden" />
      </div>

      <div className="mt-8 border border-white/10 bg-[#0a0a0c] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-display font-bold text-white text-xl">Download the Complete Catalogue</h3>
          <p className="text-white/50 text-sm mt-1">Full product range with specifications and contact details.</p>
        </div>
        <a href={`${API_BASE}/catalogue-full/pdf`} target="_blank" rel="noreferrer" className="bg-kem-accent text-white font-semibold px-6 py-3.5 flex items-center gap-2 hover:bg-white hover:text-black transition-colors" data-testid="catalogue-download-btn">
          <Download className="h-4 w-4" /> Download Complete Catalogue
        </a>
      </div>

      <div className="flex gap-2 flex-wrap mt-10 mb-8 no-scrollbar">
        <button onClick={() => setActive("")} className={`px-4 py-2 text-sm border ${!active ? "bg-kem-accent border-kem-accent text-white" : "border-white/10 text-white/60"}`}>All</button>
        {cats.map((c) => (
          <button key={c.id} onClick={() => setActive(c.slug)} className={`px-4 py-2 text-sm border whitespace-nowrap ${active === c.slug ? "bg-kem-accent border-kem-accent text-white" : "border-white/10 text-white/60 hover:text-white"}`}>{c.name}</button>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">{items.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}</div>
    </div>
  );
}
