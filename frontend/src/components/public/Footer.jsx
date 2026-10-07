import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, MessageCircle, Instagram, Facebook, Linkedin, Youtube, ArrowUpRight } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { generalWhatsAppLink } from "@/lib/helpers";

export default function Footer() {
  const { settings } = useSettings();
  const c = settings?.company || {};
  const ct = settings?.contact || {};
  const s = settings?.social || {};
  const socials = [
    [s.instagram, Instagram], [s.facebook, Facebook], [s.linkedin, Linkedin], [s.youtube, Youtube],
  ].filter(([u]) => u);

  return (
    <footer className="relative bg-[#050505] border-t border-white/10 pt-16 pb-8" data-testid="public-footer">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12">
          <div className="md:col-span-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 bg-kem-accent grid place-items-center font-display font-black text-white text-lg">K</div>
              <span className="font-display font-extrabold text-white text-lg">KEM Enterprises</span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">{c.about}</p>
            <div className="flex gap-2 mt-5">
              {socials.map(([u, Icon], i) => (
                <a key={i} href={u} target="_blank" rel="noreferrer" className="h-9 w-9 grid place-items-center border border-white/10 text-white/60 hover:text-white hover:border-kem-accent transition-colors">
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-4 font-bold">Explore</h4>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li><Link to="/products" className="hover:text-kem-accent">Products</Link></li>
              <li><Link to="/catalogue" className="hover:text-kem-accent">Catalogue</Link></li>
              <li><Link to="/industries" className="hover:text-kem-accent">Applications</Link></li>
              <li><Link to="/about" className="hover:text-kem-accent">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-kem-accent">Contact</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-4 font-bold">Company</h4>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li><Link to="/services" className="hover:text-kem-accent">Services & Solutions</Link></li>
              <li><Link to="/gallery" className="hover:text-kem-accent">Gallery</Link></li>
              <li><Link to="/request-quote" className="hover:text-kem-accent">Request a Quote</Link></li>
              <li><Link to="/privacy" className="hover:text-kem-accent">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-kem-accent">Terms & Conditions</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-4 font-bold">Get in Touch</h4>
            <ul className="space-y-3 text-sm text-white/60">
              {ct.phone && <li><a href={`tel:${ct.phone}`} className="flex items-center gap-2.5 hover:text-white"><Phone className="h-4 w-4 text-kem-accent" strokeWidth={1.5} /> {ct.phone}</a></li>}
              {ct.email && <li><a href={`mailto:${ct.email}`} className="flex items-center gap-2.5 hover:text-white"><Mail className="h-4 w-4 text-kem-accent" strokeWidth={1.5} /> {ct.email}</a></li>}
              <li><a href={generalWhatsAppLink(settings)} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 hover:text-white"><MessageCircle className="h-4 w-4 text-kem-accent" strokeWidth={1.5} /> Chat on WhatsApp</a></li>
              {c.address && <li className="flex items-start gap-2.5"><MapPin className="h-4 w-4 text-kem-accent mt-0.5 shrink-0" strokeWidth={1.5} /> {c.address}</li>}
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
          <p className="text-xs text-white/40">© {new Date().getFullYear()} {c.name || "KEM Enterprises"}. All rights reserved.</p>
          <Link to="/admin/login" className="text-xs text-white/30 hover:text-white/60 flex items-center gap-1">Admin Panel <ArrowUpRight className="h-3 w-3" /></Link>
        </div>
      </div>
    </footer>
  );
}
