import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import api from "@/lib/api";
import ProductCard from "@/components/public/ProductCard";
import { PageHead } from "@/pages/public/Products";
import { SEO, SITE_URL } from "@/components/public/SEO";

export default function CategoryPage() {
  const { categorySlug } = useParams();
  const [cat, setCat] = useState(null);
  const [items, setItems] = useState([]);
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.get(`/categories/${categorySlug}`).then((r) => setCat(r.data)).catch(() => setCat(null));
  }, [categorySlug]);

  useEffect(() => {
    setLoading(true);
    api.get(`/products?category=${categorySlug}&sort=${sort}&limit=48`).then((r) => setItems(r.data.items)).finally(() => setLoading(false));
  }, [categorySlug, sort]);

  const seoTitle = cat?.seo_title || (cat?.name ? `${cat.name} | KEM Enterprises` : "Products | KEM Enterprises");
  const seoDescription = cat?.seo_description || cat?.description || "Browse KEM Enterprises products and hardware solutions.";
  const schema = cat ? { "@context":"https://schema.org", "@type":"CollectionPage", name: cat.name, description: seoDescription, url: `${SITE_URL}/products/${categorySlug}` } : undefined;
  return (
    <div data-testid="category-page">
      <SEO title={seoTitle} description={seoDescription} path={`/products/${categorySlug}`} image={cat?.image} schema={schema} />
      <section className="relative pt-32 pb-14 kem-grain overflow-hidden">
        {cat?.image && <img src={cat.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-[#050505]/40" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-8 on-media">
          <Link to="/products" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-6"><ArrowLeft className="h-4 w-4" /> All Products</Link>
          <PageHead label={`${cat?.product_count || 0} Products`} title={cat?.name || "Category"} sub={cat?.description} />
        </div>
      </section>
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 pb-24">
        <div className="flex items-center gap-3 py-4 border-b border-white/10 mb-8">
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-white/5 border border-white/10 text-white text-sm px-3 py-2 focus:outline-none">
            <option value="newest" className="bg-black">Newest</option>
            <option value="name_asc" className="bg-black">Name A–Z</option>
            <option value="name_desc" className="bg-black">Name Z–A</option>
          </select>
          <span className="text-sm text-white/40 ml-auto">{items.length} products</span>
        </div>
        {loading ? <div className="text-white/40 py-20 text-center">Loading…</div> :
          items.length === 0 ? <div className="text-white/40 py-20 text-center border border-white/10">No products in this category yet.</div> :
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">{items.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}</div>}
      </div>
    </div>
  );
}
