import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageHead } from "@/pages/public/Products";
import ProductCard from "@/components/public/ProductCard";
import EnquiryModal from "@/components/public/EnquiryModal";
import api, { fileUrl } from "@/lib/api";


const SOLUTIONS = [
  ["Signage Suspension", "Complete ceiling and wall signage hanging systems using premium wire rope, grippers and studs."],
  ["Glass & Railing Systems", "Stainless steel studs, spigots, F-brackets and hardware for architectural glass and railings."],
  ["Ceiling & Acoustic Panels", "Adjustable suspension kits for acoustic panels, ceilings, ducts and trunking."],
  ["Lighting & Display", "Discreet transparent wires, cable grippers and LED power supplies for retail and display."],
  ["Swings & Jhula", "Heavy-duty stainless steel jhula and swing fittings for indoor and outdoor use."],
  ["Industrial Suspension", "Engineered wire rope, thimbles, clamps and terminals for demanding industrial loads."],
];

export function Services() {
  useEffect(() => window.scrollTo(0, 0), []);
  return (
    <div className="pt-28 pb-24 max-w-[1400px] mx-auto px-5 sm:px-8" data-testid="services-page">
      <PageHead label="Services & Solutions" title="Complete Hanging & Hardware Solutions" sub="From single components to fully engineered suspension systems, KEM Enterprises delivers end-to-end solutions." />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10 mt-14">
        {SOLUTIONS.map(([t, d], i) => (
          <div key={t} className="bg-[#0a0a0c] p-8 hover:bg-[#101013] transition-colors">
            <div className="font-mono text-kem-accent text-sm mb-4">0{i + 1}</div>
            <h3 className="font-display font-semibold text-white text-lg mb-2">{t}</h3>
            <p className="text-white/50 text-sm leading-relaxed">{d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const INDUSTRIES = ["Signage & Advertising", "Architecture", "Interior Design", "Retail & Display", "Commercial Spaces", "Acoustic & Lighting", "Glass & Facades", "Industrial & Manufacturing", "Hospitality", "Residential Interiors"];
export function Industries() {
  const [cats, setCats] = useState([]);
  useEffect(() => { window.scrollTo(0, 0); api.get("/categories").then((r) => setCats(r.data.filter((c) => c.product_count > 0).slice(0, 6))); }, []);
  return (
    <div className="pt-28 pb-24 max-w-[1400px] mx-auto px-5 sm:px-8" data-testid="industries-page">
      <PageHead label="Applications & Industries" title="Where KEM Hardware Performs" sub="Our precision hardware is trusted across a wide range of industries and applications." />
      <div className="flex flex-wrap gap-3 mt-12">
        {INDUSTRIES.map((a) => <span key={a} className="border border-white/10 text-white/70 px-5 py-3 text-sm hover:border-kem-accent hover:text-white transition-colors">{a}</span>)}
      </div>
      <h2 className="font-display font-bold text-white text-2xl mt-16 mb-8">Popular Categories</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cats.map((c) => (
          <Link key={c.id} to={`/products/${c.slug}`} className="group relative overflow-hidden border border-white/10 aspect-[16/9] bg-neutral-900 rounded-xl">
            {c.image && (
              <img
                src={fileUrl(c.image)}
                alt=""
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                className="absolute inset-0 h-full w-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-500"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
            <div className="on-media absolute bottom-0 p-5"><h3 className="font-display font-semibold text-white text-lg">{c.name}</h3></div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function Gallery() {
  const [imgs, setImgs] = useState([]);
  useEffect(() => { window.scrollTo(0, 0); api.get("/products?limit=24&featured=true").then((r) => setImgs(r.data.items.flatMap((p) => (p.images || []).slice(0, 1)))); }, []);
  return (
    <div className="pt-28 pb-24 max-w-[1400px] mx-auto px-5 sm:px-8" data-testid="gallery-page">
      <PageHead label="Gallery" title="Product Showcase" />
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 mt-12 space-y-4">
        {imgs.map((src, i) => <img key={i} src={src} alt="" loading="lazy" className="w-full border border-white/10 break-inside-avoid" />)}
      </div>
    </div>
  );
}

export function EnquiryPage() {
  const [open, setOpen] = useState(true);
  useEffect(() => window.scrollTo(0, 0), []);
  return (
    <div className="pt-28 pb-24 max-w-[1400px] mx-auto px-5 sm:px-8" data-testid="enquiry-page">
      <PageHead label="Request a Quote" title="Tell Us What You Need" sub="Share your requirement and our team will respond with pricing, availability and specifications." />
      {open && <EnquiryModal product={null} onClose={() => setOpen(false)} />}
      {!open && <button onClick={() => setOpen(true)} className="mt-8 bg-kem-accent text-white font-semibold px-6 py-3.5">Open Enquiry Form</button>}
    </div>
  );
}

export function Privacy() {
  useEffect(() => window.scrollTo(0, 0), []);
  return <LegalPage title="Privacy Policy" testid="privacy-page" body="KEM Enterprises respects your privacy. We collect only the information necessary to respond to enquiries and process orders — such as your name, contact details and requirement. We do not sell or share your personal data with third parties except as required to fulfil your request. Enquiry data is stored securely and used solely for business communication. By using this website you consent to this policy." />;
}
export function Terms() {
  useEffect(() => window.scrollTo(0, 0), []);
  return <LegalPage title="Terms & Conditions" testid="terms-page" body="All product information, specifications and images on this website are provided for reference and are subject to change without notice. Prices are shared on enquiry and are valid for the stated period only. Orders are subject to availability and acceptance. Goods once sold are governed by our standard trade terms. Technical specifications should be verified with our team before purchase for critical applications." />;
}
function LegalPage({ title, body, testid }) {
  return (
    <div className="pt-28 pb-24 max-w-3xl mx-auto px-5 sm:px-8" data-testid={testid}>
      <PageHead label="Legal" title={title} />
      <p className="text-white/60 leading-relaxed mt-10 whitespace-pre-line">{body}</p>
    </div>
  );
}
