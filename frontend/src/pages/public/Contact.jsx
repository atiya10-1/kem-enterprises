import { useEffect, useState } from "react";
import { Phone, Mail, MapPin, MessageCircle, Send, Clock } from "lucide-react";
import { toast } from "sonner";
import api, { formatApiError } from "@/lib/api";
import { useSettings } from "@/context/SettingsContext";
import { generalWhatsAppLink } from "@/lib/helpers";
import { PageHead } from "@/pages/public/Products";

export default function Contact() {
  const { settings } = useSettings();
  const ct = settings?.contact || {};
  const c = settings?.company || {};
  const [form, setForm] = useState({ name: "", company: "", phone: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  useEffect(() => window.scrollTo(0, 0), []);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) { toast.error("Name and phone are required."); return; }
    setLoading(true);
    try {
      await api.post("/enquiries", { ...form, requirement: form.message });
      toast.success("Message sent! We'll get back to you shortly.");
      setForm({ name: "", company: "", phone: "", email: "", message: "" });
    } catch (err) { toast.error(formatApiError(err.response?.data?.detail)); }
    finally { setLoading(false); }
  };

  return (
    <div className="pt-28 pb-24 max-w-[1400px] mx-auto px-5 sm:px-8" data-testid="contact-page">
      <PageHead label="Get in Touch" title="Contact KEM Enterprises" sub="Reach out for products, pricing, custom requirements or technical support." />
      <div className="grid lg:grid-cols-2 gap-12 mt-14">
        <div className="space-y-4">
          {ct.phone && <ContactRow icon={Phone} label="Phone" value={ct.phone} href={`tel:${ct.phone}`} />}
          {ct.email && <ContactRow icon={Mail} label="Email" value={ct.email} href={`mailto:${ct.email}`} />}
          <ContactRow icon={MessageCircle} label="WhatsApp" value="Chat with us" href={generalWhatsAppLink(settings)} />
          {c.address && <ContactRow icon={MapPin} label="Address" value={c.address} />}
          {ct.hours && <ContactRow icon={Clock} label="Business Hours" value={ct.hours} />}
        </div>
        <form onSubmit={submit} className="border border-white/10 bg-[#0a0a0c] p-6 sm:p-8 space-y-3">
          <h3 className="font-display font-bold text-white text-xl mb-2">Send an Enquiry</h3>
          {[["name", "Your Name *"], ["company", "Company"], ["phone", "Phone *"], ["email", "Email"]].map(([k, l]) => (
            <input key={k} value={form[k]} onChange={set(k)} placeholder={l} data-testid={`contact-${k}`}
              className="w-full bg-white/5 border border-white/10 text-white text-sm px-3 py-3 focus:outline-none focus:border-kem-accent placeholder:text-white/40" />
          ))}
          <textarea value={form.message} onChange={set("message")} rows={4} placeholder="Your message / requirement" data-testid="contact-message"
            className="w-full bg-white/5 border border-white/10 text-white text-sm px-3 py-3 focus:outline-none focus:border-kem-accent placeholder:text-white/40" />
          <button disabled={loading} data-testid="contact-submit" className="w-full bg-kem-accent text-white font-semibold py-3.5 flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-colors disabled:opacity-60"><Send className="h-4 w-4" /> {loading ? "Sending…" : "Send Message"}</button>
        </form>
      </div>
    </div>
  );
}

function ContactRow({ icon: Icon, label, value, href }) {
  const inner = (
    <div className="flex items-start gap-4 border border-white/10 p-5 hover:border-kem-accent transition-colors">
      <div className="h-10 w-10 grid place-items-center bg-kem-accent/10 text-kem-accent shrink-0"><Icon className="h-5 w-5" strokeWidth={1.5} /></div>
      <div><div className="text-[10px] uppercase tracking-[0.2em] text-white/40">{label}</div><div className="text-white mt-1">{value}</div></div>
    </div>
  );
  return href ? <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="block">{inner}</a> : inner;
}
