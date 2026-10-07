import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight, Download, MessageCircle, ShieldCheck, Layers, Truck, Headphones, Settings2, IndianRupee, Building2, Zap } from "lucide-react";
import api, { API_BASE, fileUrl } from "@/lib/api";
import { useSettings } from "@/context/SettingsContext";

import { generalWhatsAppLink } from "@/lib/helpers";
import ProductCard from "@/components/public/ProductCard";

const APPLICATIONS = ["Signage", "Glass Facades", "Ceiling Suspension", "Acoustic Panels", "Lighting", "Retail Displays", "Architecture", "Interior Design", "Commercial Spaces", "Industrial", "Swings & Jhula", "Railing Systems"];
const WHY = [
  ["Quality Products", ShieldCheck], ["Wide Product Range", Layers], ["Reliable Supply", Truck],
  ["Technical Support", Headphones], ["Custom Solutions", Settings2], ["Competitive Pricing", IndianRupee],
  ["B2B Support", Building2], ["Fast Enquiry Response", Zap],
];

export default function Home() {
  const { settings } = useSettings();
  const [cats, setCats] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [fresh, setFresh] = useState([]);
  const heroRef = useRef(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 120]);

  useEffect(() => {
    api.get("/categories").then((r) => setCats(r.data.filter((c) => c.product_count > 0).slice(0, 8)));
    api.get("/products?featured=true&limit=8").then((r) => setFeatured(r.data.items));
    api.get("/products?is_new=true&limit=4").then((r) => setFresh(r.data.items));
    window.scrollTo(0, 0);
  }, []);

  const hp = settings?.homepage || {};
  const heroImg = hp.hero_image || "https://images.pexels.com/photos/5233314/pexels-photo-5233314.jpeg?auto=compress&cs=tinysrgb&w=1600";

  const onMouse = (e) => {
    const r = heroRef.current?.getBoundingClientRect();
    if (!r) return;
    setMouse({ x: (e.clientX - r.left - r.width / 2) / r.width, y: (e.clientY - r.top - r.height / 2) / r.height });
  };

  return (
    <div className="relative overflow-hidden" data-testid="home-page">
      {/* HERO */}
      <section ref={heroRef} onMouseMove={onMouse} className="kem-hero relative min-h-screen flex items-center kem-grain">
        <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
          <motion.img src={heroImg} alt="" animate={{ x: mouse.x * -20, y: mouse.y * -20 }} transition={{ type: "spring", stiffness: 60, damping: 20 }}
            className="h-full w-full object-cover scale-110 opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/85 to-[#050505]/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent" />
        </motion.div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-8 pt-24 w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 border border-white/15 px-3 py-1.5 mb-6">
              <span className="h-1.5 w-1.5 bg-kem-accent" />
              <span className="text-[11px] uppercase tracking-[0.25em] text-white/70 font-semibold">Precision • Quality • Engineering</span>
            </div>
            <h1 className="font-display font-black text-white text-4xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tighter text-balance">
              {hp.hero_title || "Precision Hardware. Engineered to Hang, Hold & Connect."}
            </h1>
            <p className="text-white/60 text-base sm:text-lg mt-6 max-w-2xl leading-relaxed">
              {hp.hero_subtitle || "Premium wire rope fittings, cable grippers, suspension systems, stainless steel hardware and specialised hanging solutions."}
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-9">
              <Link to="/products" data-testid="hero-explore-btn" className="group bg-kem-accent text-white font-semibold px-6 py-3.5 flex items-center gap-2 hover:bg-white hover:text-black transition-colors">
                Explore Products <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/request-quote" data-testid="hero-quote-btn" className="border border-white/20 text-white font-semibold px-6 py-3.5 hover:border-kem-accent hover:bg-white/5 transition-colors">
                Request a Quote
              </Link>
              <Link to="/catalogue" data-testid="hero-catalogue-btn" className="text-white/70 hover:text-white font-medium px-2 py-3.5 flex items-center gap-2 underline underline-offset-4 decoration-white/20">
                <Download className="h-4 w-4" /> Download Catalogue
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/10 bg-black/40 backdrop-blur-sm overflow-hidden">
          <div className="flex whitespace-nowrap animate-marquee">
            {[...APPLICATIONS, ...APPLICATIONS].map((a, i) => (
              <span key={i} className="text-xs uppercase tracking-[0.2em] text-white/40 px-6 py-3 border-r border-white/5">{a}</span>
            ))}
          </div>
        </div>
      </section>

      {/* INTRO / STATS */}
      <section className="max-w-[1400px] mx-auto px-5 sm:px-8 py-20 sm:py-28">
        <div className="grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-7">
            <div className="text-[11px] uppercase tracking-[0.25em] text-kem-accent font-bold mb-4">Trusted Engineering</div>
            <h2 className="font-display font-bold text-white text-3xl sm:text-4xl tracking-tight leading-tight text-balance">
              A serious, professional supplier of precision wire rope, cable, suspension & stainless-steel hardware.
            </h2>
          </div>
          <div className="md:col-span-5 md:pl-8">
            <p className="text-white/55 leading-relaxed">{settings?.company?.about}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 mt-14 border border-white/10">
          {[["500+", "Product Range"], ["58+", "Categories"], ["1000+", "Projects Supplied"], ["24h", "Enquiry Response"]].map(([n, l]) => (
            <div key={l} className="bg-[#050505] p-8">
              <div className="font-display font-black text-white text-4xl tracking-tighter">{n}</div>
              <div className="text-xs uppercase tracking-[0.15em] text-white/40 mt-2">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-[1400px] mx-auto px-5 sm:px-8 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="text-[11px] uppercase tracking-[0.25em] text-kem-accent font-bold mb-3">Product Categories</div>
            <h2 className="font-display font-bold text-white text-3xl sm:text-4xl tracking-tight">Explore Our Range</h2>
          </div>
          <Link to="/products" className="hidden sm:flex items-center gap-2 text-sm text-white/60 hover:text-white">View all <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cats.map((c, i) => (
            <Link key={c.id} to={`/products/${c.slug}`} data-testid={`home-category-${c.slug}`}
              className="group relative overflow-hidden border border-white/10 aspect-[3/4] bg-neutral-900 rounded-xl">
              {c.image ? (
                <img
                  src={fileUrl(c.image)}
                  alt={c.name}
                  loading="lazy"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  className="absolute inset-0 h-full w-full object-cover opacity-65 group-hover:opacity-85 group-hover:scale-105 transition-[transform,opacity] duration-500"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-black flex items-center justify-center">
                  <span className="font-display font-black text-white/10 text-4xl tracking-widest">KEM</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="on-media absolute bottom-0 p-5 w-full">
                <div className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-1">{c.product_count} Products</div>
                <h3 className="font-display font-semibold text-white text-lg leading-tight">{c.name}</h3>
                <div className="flex items-center gap-1.5 mt-3 text-kem-accent text-sm font-semibold opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">Explore <ArrowRight className="h-4 w-4" /></div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      {featured.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-5 sm:px-8 py-16">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="text-[11px] uppercase tracking-[0.25em] text-kem-accent font-bold mb-3">Featured Products</div>
              <h2 className="font-display font-bold text-white text-3xl sm:text-4xl tracking-tight">Engineered Highlights</h2>
            </div>
            <Link to="/featured-products" className="hidden sm:flex items-center gap-2 text-sm text-white/60 hover:text-white">View all <ArrowUpRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.slice(0, 8).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}

      {/* APPLICATIONS */}
      <section className="max-w-[1400px] mx-auto px-5 sm:px-8 py-16">
        <div className="text-[11px] uppercase tracking-[0.25em] text-kem-accent font-bold mb-3">Applications & Solutions</div>
        <h2 className="font-display font-bold text-white text-3xl sm:text-4xl tracking-tight mb-10">Where KEM Hardware Works</h2>
        <div className="flex flex-wrap gap-3">
          {APPLICATIONS.map((a) => (
            <span key={a} className="border border-white/10 text-white/70 px-5 py-3 text-sm hover:border-kem-accent hover:text-white transition-colors">{a}</span>
          ))}
        </div>
      </section>

      {/* WHY */}
      <section className="border-y border-white/10 bg-[#0a0a0c] py-20">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
          <div className="text-[11px] uppercase tracking-[0.25em] text-kem-accent font-bold mb-3">Why KEM Enterprises</div>
          <h2 className="font-display font-bold text-white text-3xl sm:text-4xl tracking-tight mb-12">Built on Precision & Trust</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border border-white/10">
            {WHY.map(([label, Icon]) => (
              <div key={label} className="bg-[#0a0a0c] p-7 hover:bg-[#101013] transition-colors">
                <Icon className="h-7 w-7 text-kem-accent mb-4" strokeWidth={1.5} />
                <h3 className="font-display font-semibold text-white text-base">{label}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW PRODUCTS */}
      {fresh.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-5 sm:px-8 py-16">
          <div className="flex items-end justify-between mb-10">
            <h2 className="font-display font-bold text-white text-3xl sm:text-4xl tracking-tight">New Arrivals</h2>
            <Link to="/new-products" className="flex items-center gap-2 text-sm text-white/60 hover:text-white">View all <ArrowUpRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">{fresh.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}</div>
        </section>
      )}

      {/* CATALOGUE CTA */}
      <section className="max-w-[1400px] mx-auto px-5 sm:px-8 py-16">
        <div className="relative overflow-hidden border border-white/10 p-10 sm:p-16 kem-grain">
          <img src="https://images.pexels.com/photos/8940820/pexels-photo-8940820.jpeg?auto=compress&cs=tinysrgb&w=1600" alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />
          <div className="relative z-10 max-w-xl">
            <div className="text-[11px] uppercase tracking-[0.25em] text-kem-accent font-bold mb-4">Complete Catalogue</div>
            <h2 className="font-display font-black text-white text-3xl sm:text-5xl tracking-tighter leading-none">Download the full KEM product catalogue.</h2>
            <a href={`${API_BASE}/catalogue-full/pdf`} target="_blank" rel="noreferrer" data-testid="home-catalogue-cta" className="inline-flex items-center gap-2 bg-kem-accent text-white font-semibold px-6 py-3.5 mt-8 hover:bg-white hover:text-black transition-colors">
              <Download className="h-4 w-4" /> Download Complete Catalogue
            </a>
          </div>
        </div>
      </section>

      {/* WHATSAPP CTA */}
      <section className="max-w-[1400px] mx-auto px-5 sm:px-8 pb-24">
        <div className="border border-white/10 bg-[#0a0a0c] p-10 sm:p-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-display font-bold text-white text-2xl sm:text-3xl tracking-tight">Need a Product or Custom Requirement?</h2>
            <p className="text-white/50 mt-2">Talk to KEM Enterprises — fast response, expert guidance.</p>
          </div>
          <a href={generalWhatsAppLink(settings)} target="_blank" rel="noreferrer" data-testid="home-whatsapp-cta"
            className="shrink-0 bg-[#25D366] text-white font-semibold px-7 py-4 flex items-center gap-2 hover:scale-105 transition-transform">
            <MessageCircle className="h-5 w-5" /> Chat on WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
