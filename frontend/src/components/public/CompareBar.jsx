import { Link } from "react-router-dom";
import { GitCompareArrows, X, ArrowRight } from "lucide-react";
import { useCompare } from "@/context/CompareContext";

export default function CompareBar() {
  const { items, remove, clear } = useCompare();
  if (items.length === 0) return null;
  return (
    <div className="fixed bottom-5 left-5 z-40 kem-glass border border-white/15 p-3 max-w-[calc(100vw-2rem)]" data-testid="compare-bar">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-white text-sm font-semibold pr-2 border-r border-white/10"><GitCompareArrows className="h-4 w-4 text-kem-accent" /> Compare ({items.length})</div>
        <div className="flex gap-2">
          {items.map((p) => (
            <div key={p.id} className="relative h-10 w-10 border border-white/15 group">
              <img src={(p.images || [])[0]} alt="" className="h-full w-full object-cover" />
              <button onClick={() => remove(p.id)} className="absolute -top-1.5 -right-1.5 bg-red-500 text-white h-4 w-4 grid place-items-center"><X className="h-2.5 w-2.5" /></button>
            </div>
          ))}
        </div>
        <Link to="/compare" data-testid="compare-go-btn" className="bg-kem-accent text-white text-sm font-semibold px-4 py-2 flex items-center gap-1.5 hover:bg-white hover:text-black transition-colors">Compare <ArrowRight className="h-4 w-4" /></Link>
        <button onClick={clear} className="text-white/50 hover:text-white text-xs">Clear</button>
      </div>
    </div>
  );
}
