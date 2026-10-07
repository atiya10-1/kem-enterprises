import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api, { fileUrl } from "@/lib/api";

import ProductCard from "@/components/public/ProductCard";

export default function Products() {
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ category: "", sort: "newest" });

  const isNew = location.pathname === "/new-products";
  const isFeatured = location.pathname === "/featured-products";
  const isCategories = location.pathname === "/categories";
  const title = isNew ? "New Products" : isFeatured ? "Featured Products" : isCategories ? "All Categories" : "All Products";

  useEffect(() => { api.get("/categories").then((r) => setCats(r.data)); }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    const params = new URLSearchParams({ limit: "48", sort: filter.sort });
    if (filter.category) params.set("category", filter.category);
    if (isNew) params.set("is_new", "true");
    if (isFeatured) params.set("featured", "true");
    api.get(`/products?${params}`).then((r) => setItems(r.data.items)).finally(() => setLoading(false));
  }, [filter, location.pathname]);

  if (isCategories) {
    return (
      <div className="pt-28 pb-24 max-w-[1400px] mx-auto px-5 sm:px-8" data-testid="categories-page">
        <PageHead label="Browse" title="All Categories" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
          {cats.map((c) => (
            <a key={c.id} href={`/products/${c.slug}`} className="group relative overflow-hidden border border-white/10 aspect-[3/4] bg-neutral-900 rounded-xl">
              {c.image ? (
                <img
                  src={fileUrl(c.image)}
                  alt={c.name}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  className="absolute inset-0 h-full w-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-black flex items-center justify-center">
                  <span className="font-display font-black text-white/10 text-4xl">KEM</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="on-media absolute bottom-0 p-5"><div className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-1">{c.product_count} Products</div><h3 className="font-display font-semibold text-white text-lg">{c.name}</h3></div>
            </a>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 max-w-[1400px] mx-auto px-5 sm:px-8" data-testid="products-page">
      <PageHead label="Product Catalogue" title={title} />
      <div className="flex flex-wrap items-center gap-3 mt-8 mb-8 border-y border-white/10 py-4">
        {!isNew && !isFeatured && (
          <select value={filter.category} onChange={(e) => setFilter({ ...filter, category: e.target.value })} data-testid="filter-category"
            className="bg-white/5 border border-white/10 text-white text-sm px-3 py-2 focus:outline-none focus:border-kem-accent">
            <option value="" className="bg-black">All Categories</option>
            {cats.map((c) => <option key={c.id} value={c.slug} className="bg-black">{c.name} ({c.product_count})</option>)}
          </select>
        )}
        <select value={filter.sort} onChange={(e) => setFilter({ ...filter, sort: e.target.value })} data-testid="filter-sort"
          className="bg-white/5 border border-white/10 text-white text-sm px-3 py-2 focus:outline-none focus:border-kem-accent">
          <option value="newest" className="bg-black">Newest</option>
          <option value="name_asc" className="bg-black">Name A–Z</option>
          <option value="name_desc" className="bg-black">Name Z–A</option>
        </select>
        <span className="text-sm text-white/40 ml-auto">{items.length} products</span>
      </div>
      {loading ? <div className="text-white/40 py-20 text-center">Loading products…</div> :
        items.length === 0 ? <div className="text-white/40 py-20 text-center border border-white/10">No products found.</div> :
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">{items.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}</div>}
    </div>
  );
}

export function PageHead({ label, title, sub }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.25em] text-kem-accent font-bold mb-3">{label}</div>
      <h1 className="font-display font-black text-white text-4xl sm:text-6xl tracking-tighter">{title}</h1>
      {sub && <p className="text-white/55 mt-4 max-w-2xl leading-relaxed">{sub}</p>}
    </div>
  );
}
