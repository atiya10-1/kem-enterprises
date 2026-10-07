import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle, ArrowUpRight, Send, GitCompareArrows } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { productWhatsAppLink, PLACEHOLDER } from "@/lib/helpers";
import { fileUrl } from "@/lib/api";

import { useCompare } from "@/context/CompareContext";
import EnquiryModal from "@/components/public/EnquiryModal";

export default function ProductCard({ product, index = 0 }) {
  const { settings } = useSettings();
  const { has, toggle } = useCompare();
  const [enquire, setEnquire] = useState(false);
  const img = (product.images || [])[0] || PLACEHOLDER;
  const to = `/products/${slugCat(product)}/${product.slug}`;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        whileHover={{ y: -6 }}
        transition={{ duration: 0.5, delay: (index % 4) * 0.05 }}
        className="kem-card group relative bg-kem-surface border border-white/10 hover:border-kem-accent/60 rounded-2xl overflow-hidden transition-[border-color,box-shadow] hover:shadow-2xl hover:shadow-black/20"
        data-testid={`product-card-${product.slug}`}>
        <Link to={to} className="block relative overflow-hidden aspect-[4/3] bg-black">
          {img ? <img src={fileUrl(img)} alt={product.name} loading="lazy"
            onError={(e) => { e.currentTarget.src = PLACEHOLDER; }}
            className="h-full w-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-[transform,opacity] duration-500" />
            : <div className="h-full w-full grid place-items-center text-white/20 text-xs">No image</div>}
          <div className="absolute top-2 left-2 flex gap-1">
            {product.is_new && <span className="bg-kem-accent text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide">New</span>}
            {product.best_seller && <span className="bg-white text-black text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide">Best Seller</span>}
            {product.featured && !product.is_new && <span className="bg-white/10 backdrop-blur border border-white/20 text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide">Featured</span>}
          </div>
        </Link>
        <button onClick={() => toggle(product)} data-testid={`compare-${product.slug}`} title="Add to compare"
          className={`absolute top-2 right-2 h-7 w-7 grid place-items-center border transition-colors ${has(product.id) ? "bg-kem-accent border-kem-accent text-white" : "bg-black/40 border-white/20 text-white/80 hover:text-white"}`}>
          <GitCompareArrows className="h-3.5 w-3.5" strokeWidth={1.5} />
        </button>
        <div className="p-4">
          <div className="text-[10px] uppercase tracking-[0.15em] text-kem-accent font-bold mb-1.5">{product.category_name}</div>
          <Link to={to}><h3 className="font-display font-semibold text-white text-[15px] leading-snug line-clamp-2 min-h-[42px] group-hover:text-kem-accent transition-colors">{product.name}</h3></Link>
          <div className="text-[11px] text-white/40 font-mono mt-1">{product.sku}</div>
          <div className="flex items-center gap-2 mt-4">
            <button onClick={() => setEnquire(true)} data-testid={`quick-enquiry-${product.slug}`}
              className="flex-1 bg-white/5 border border-white/10 text-white text-xs font-semibold py-2 hover:bg-kem-accent hover:border-kem-accent transition-colors flex items-center justify-center gap-1.5">
              <Send className="h-3.5 w-3.5" strokeWidth={1.5} /> Enquire
            </button>
            <a href={productWhatsAppLink(settings, product.name)} target="_blank" rel="noreferrer"
              className="h-[34px] w-[34px] grid place-items-center bg-[#25D366]/90 hover:bg-[#25D366] text-white" data-testid={`wa-${product.slug}`}>
              <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
            </a>
            <Link to={to} className="h-[34px] w-[34px] grid place-items-center border border-white/10 text-white hover:border-kem-accent">
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </motion.div>
      {enquire && <EnquiryModal product={product} onClose={() => setEnquire(false)} />}
    </>
  );
}

function slugCat(p) {
  return (p.category_name || "products").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
