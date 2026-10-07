import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Download } from "lucide-react";
import api, { API_BASE } from "@/lib/api";
import ProductCard from "@/components/public/ProductCard";

export default function PublicCatalogueView() {
  const { token } = useParams();
  const [cat, setCat] = useState(null);
  const [err, setErr] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
    api.get(`/public/catalogue/${token}`).then((r) => setCat(r.data)).catch(() => setErr(true));
  }, [token]);

  if (err) return <div className="kem-dark min-h-screen grid place-items-center text-white/50">Catalogue not found.</div>;
  if (!cat) return <div className="kem-dark min-h-screen grid place-items-center text-white/40">Loading catalogue…</div>;

  return (
    <div className="kem-dark min-h-screen font-body">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 pt-16 pb-24">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-8 w-8 bg-kem-accent grid place-items-center font-display font-black text-white text-lg">K</div>
          <span className="font-display font-extrabold text-white text-lg">KEM Enterprises</span>
        </div>
        <div className="text-[11px] uppercase tracking-[0.25em] text-kem-accent font-bold mb-3">Digital Catalogue</div>
        <h1 className="font-display font-black text-white text-4xl sm:text-6xl tracking-tighter">{cat.name}</h1>
        {cat.intro && <p className="text-white/55 mt-4 max-w-2xl">{cat.intro}</p>}
        <a href={`${API_BASE}/public/catalogue/${token}/pdf`} target="_blank" rel="noreferrer" data-testid="public-catalogue-download"
          className="inline-flex items-center gap-2 bg-kem-accent text-white font-semibold px-6 py-3.5 mt-8 hover:bg-white hover:text-black transition-colors"><Download className="h-4 w-4" /> Download PDF</a>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
          {(cat.products || []).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </div>
    </div>
  );
}
