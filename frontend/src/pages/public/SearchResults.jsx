import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "@/lib/api";
import ProductCard from "@/components/public/ProductCard";
import { PageHead } from "@/pages/public/Products";

export default function SearchResults() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    api.get(`/products?search=${encodeURIComponent(q)}&limit=48`).then((r) => setItems(r.data.items)).finally(() => setLoading(false));
  }, [q]);
  return (
    <div className="pt-28 pb-24 max-w-[1400px] mx-auto px-5 sm:px-8" data-testid="search-page">
      <PageHead label="Search Results" title={`"${q}"`} sub={`${items.length} products found`} />
      <div className="mt-12">
        {loading ? <div className="text-white/40 py-20 text-center">Searching…</div> :
          items.length === 0 ? <div className="text-white/40 py-20 text-center border border-white/10">No products matched your search.</div> :
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">{items.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}</div>}
      </div>
    </div>
  );
}
