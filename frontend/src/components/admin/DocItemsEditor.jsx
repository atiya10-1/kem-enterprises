import { useState } from "react";
import { Plus, Trash2, Search } from "lucide-react";

export default function DocItemsEditor({ items, onChange, products = [] }) {
  const [q, setQ] = useState("");
  const add = () => onChange([...items, { product: "", description: "", quantity: 1, unit_price: 0, discount: 0, tax: 0 }]);
  const upd = (i, k, v) => onChange(items.map((it, idx) => idx === i ? { ...it, [k]: v } : it));
  const rm = (i) => onChange(items.filter((_, idx) => idx !== i));
  const addProduct = (p) => { onChange([...items, { product: p.id, description: p.name, quantity: 1, unit_price: Number(p.price) || 0, discount: 0, tax: 0 }]); setQ(""); };

  return (
    <div>
      {products.length > 0 && (
        <div className="relative mb-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Add item from your products…" data-testid="doc-product-search"
            className="w-full border border-slate-300 text-sm pl-8 pr-3 py-2 focus:outline-none focus:border-kem-accent" />
          {q && (
            <div className="absolute z-20 top-full mt-1 w-full bg-white border border-slate-200 max-h-56 overflow-y-auto shadow-lg">
              {products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase())).slice(0, 8).map((p) => (
                <button type="button" key={p.id} onClick={() => addProduct(p)} data-testid={`doc-add-${p.slug}`}
                  className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 text-left text-sm border-b border-slate-100 last:border-0">
                  <img src={(p.images || [])[0]} alt="" className="h-7 w-7 object-cover" /> <span className="truncate">{p.name}</span> <span className="ml-auto text-xs text-slate-400 font-mono">{p.sku}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      <div className="overflow-x-auto border border-slate-200">
        <table className="w-full text-sm">
          <thead><tr className="bg-slate-50 text-[11px] uppercase text-slate-500">
            <th className="text-left px-2 py-2">Description</th><th className="px-2 py-2 w-16">Qty</th><th className="px-2 py-2 w-24">Rate</th><th className="px-2 py-2 w-16">Disc%</th><th className="px-2 py-2 w-16">Tax%</th><th className="px-2 py-2 w-10"></th>
          </tr></thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={i} className="border-t border-slate-100">
                <td className="px-1 py-1"><input value={it.description} onChange={(e) => upd(i, "description", e.target.value)} placeholder="Item description" className="w-full border border-slate-200 px-2 py-1.5 text-sm" data-testid={`item-desc-${i}`} /></td>
                <td className="px-1 py-1"><input type="number" value={it.quantity} onChange={(e) => upd(i, "quantity", e.target.value)} className="w-full border border-slate-200 px-2 py-1.5 text-sm" data-testid={`item-qty-${i}`} /></td>
                <td className="px-1 py-1"><input type="number" value={it.unit_price} onChange={(e) => upd(i, "unit_price", e.target.value)} className="w-full border border-slate-200 px-2 py-1.5 text-sm" data-testid={`item-rate-${i}`} /></td>
                <td className="px-1 py-1"><input type="number" value={it.discount} onChange={(e) => upd(i, "discount", e.target.value)} className="w-full border border-slate-200 px-2 py-1.5 text-sm" /></td>
                <td className="px-1 py-1"><input type="number" value={it.tax} onChange={(e) => upd(i, "tax", e.target.value)} className="w-full border border-slate-200 px-2 py-1.5 text-sm" /></td>
                <td className="px-1 py-1 text-center"><button onClick={() => rm(i)} className="text-red-500"><Trash2 className="h-4 w-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={add} data-testid="add-item-btn" className="mt-2 text-sm text-kem-accent font-semibold flex items-center gap-1"><Plus className="h-4 w-4" /> Add Item</button>
    </div>
  );
}

export function computeTotal(items, discount = 0, gstOverride = null, shipping = 0, other = 0) {
  let subtotal = 0, tax = 0;
  items.forEach((it) => {
    const base = (Number(it.quantity) || 0) * (Number(it.unit_price) || 0) * (1 - (Number(it.discount) || 0) / 100);
    subtotal += base;
    const t = gstOverride != null ? gstOverride : (Number(it.tax) || 0);
    tax += base * t / 100;
  });
  const total = subtotal - Number(discount || 0) + tax + Number(shipping || 0) + Number(other || 0);
  return { subtotal: subtotal.toFixed(2), tax: tax.toFixed(2), total: total.toFixed(2) };
}
