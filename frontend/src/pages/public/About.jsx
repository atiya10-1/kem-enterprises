import { useEffect } from "react";
import { ShieldCheck, Target, Gem, Cog } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { PageHead } from "@/pages/public/Products";

export default function About() {
  const { settings } = useSettings();
  const c = settings?.company || {};
  useEffect(() => window.scrollTo(0, 0), []);
  const values = [
    ["Precision Engineering", Target, "Every fitting is built to exacting tolerances for reliable, repeatable performance."],
    ["Uncompromising Quality", Gem, "Premium stainless steel, brass and zinc alloys sourced and finished to last."],
    ["Reliability at Scale", ShieldCheck, "Consistent supply and dependable lead times for B2B and project needs."],
    ["Custom Solutions", Cog, "Bespoke suspension, signage and hardware solutions engineered to your spec."],
  ];
  return (
    <div className="pt-28 pb-24" data-testid="about-page">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
        <PageHead label="About KEM Enterprises" title="Engineered to Hang, Hold & Connect." sub={c.about} />
        <div className="grid md:grid-cols-2 gap-6 mt-14">
          <img src="https://images.unsplash.com/photo-1548683726-203119be6a39?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200" alt="" className="w-full h-80 object-cover border border-white/10" />
          <img src="https://images.pexels.com/photos/12951634/pexels-photo-12951634.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="" className="w-full h-80 object-cover border border-white/10" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 border border-white/10 mt-14">
          {values.map(([t, Icon, d]) => (
            <div key={t} className="bg-[#0a0a0c] p-8">
              <Icon className="h-8 w-8 text-kem-accent mb-4" strokeWidth={1.5} />
              <h3 className="font-display font-semibold text-white text-lg mb-2">{t}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
