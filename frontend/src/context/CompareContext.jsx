import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

const CompareContext = createContext(null);
const KEY = "kem_compare";

export function CompareProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
  });
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(items)); }, [items]);

  const has = (id) => items.some((p) => p.id === id);
  const toggle = (product) => {
    setItems((prev) => {
      if (prev.some((p) => p.id === product.id)) return prev.filter((p) => p.id !== product.id);
      if (prev.length >= 4) { toast.error("You can compare up to 4 products"); return prev; }
      return [...prev, { id: product.id, name: product.name, slug: product.slug, images: product.images, category_name: product.category_name }];
    });
  };
  const remove = (id) => setItems((prev) => prev.filter((p) => p.id !== id));
  const clear = () => setItems([]);

  return <CompareContext.Provider value={{ items, has, toggle, remove, clear }}>{children}</CompareContext.Provider>;
}

export const useCompare = () => useContext(CompareContext);
