import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X, MessageCircle } from "lucide-react";
import api from "@/lib/api";
import { useCompare } from "@/context/CompareContext";
import { PageHead } from "@/pages/public/Products";

const ATTRS = [
  ["Category", (p) => p.category_name], ["SKU", (p) => p.sku], ["Material", (p) => p.material],
  ["Finish", (p) => p.finish], ["Size", (p) => p.size], ["Load Capacity", (p) => p.load_capacity],
  ["Wire Diameter", (p) => p.wire_diameter], ["Application", (p) => p.application],
  ["MOQ", (p) => p.moq], ["Brand", (p) => p.brand],
];

export default function Compare() {
  const { items, remove, clear } = useCompare();
  const [products, setProducts] = useState([]);
  useEffect(() => {
    window.scrollTo(0, 0);
    if (items.length === 0) { setProducts([]); return; }
    api.post("/compare", { ids: items.map((p) => p.id) }).then((r) => setProducts(r.data));
  }, [items]);

  return (
    <div className="pt-28 pb-24 max-w-[1400px] mx-auto px-5 sm:px-8" data-testid="compare-page">
      <div className="flex items-end justify-between gap-4">
        <PageHead label="Product Comparison" title="Compare Products" sub="Side-by-side specifications to help you choose the right hardware." />
        {products.length > 0 && <button onClick={clear} className="text-sm text-white/50 hover:text-white shrink-0">Clear all</button>}
      </div>

      {products.length === 0 ? (
        <div className="text-white/40 py-20 text-center border border-white/10 mt-10">No products selected. Add products to compare from the product listing.<div className="mt-4"><Link to="/products" className="text-kem-accent underline">Browse products</Link></div></div>
      ) : (
        <div className="overflow-x-auto mt-10 border border-white/10">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="w-40 bg-[#0a0a0c] p-4 text-left"></th>
                {products.map((p) => (
                  <th key={p.id} className="bg-[#0a0a0c] p-4 text-left border-l border-white/10 min-w-[200px]" data-testid={`compare-col-${p.slug}`}>
                    <div className="relative">
                      <button onClick={() => remove(p.id)} className="absolute -top-2 -right-2 bg-red-500 text-white h-5 w-5 grid place-items-center z-10"><X className="h-3 w-3" /></button>
                      <img src={(p.images || [])[0]} alt="" className="h-28 w-full object-cover border border-white/10 mb-3" />
                      <Link to={`/product/${p.slug}`} className="font-display font-semibold text-white text-sm hover:text-kem-accent block">{p.name}</Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ATTRS.map(([label, fn], i) => (
                <tr key={label} className={i % 2 ? "bg-[#0a0a0c]" : ""}>
                  <td className="p-4 text-xs uppercase tracking-wide text-white/40 font-semibold align-top">{label}</td>
                  {products.map((p) => <td key={p.id} className="p-4 text-sm text-white/80 border-l border-white/10 align-top">{fn(p) || "—"}</td>)}
                </tr>
              ))}
              <tr>
                <td className="p-4"></td>
                {products.map((p) => (
                  <td key={p.id} className="p-4 border-l border-white/10"><Link to={`/product/${p.slug}`} className="text-kem-accent text-sm font-semibold flex items-center gap-1">View Product</Link></td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
