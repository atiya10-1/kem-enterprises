import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { useSettings } from "@/context/SettingsContext";
import { PageHeader, Btn, Input, Textarea, Card } from "@/components/admin/ui";
import ImageUploader from "@/components/admin/ImageUploader";

export default function AdminSettings() {
  const { refresh } = useSettings();
  const [s, setS] = useState(null);
  const [tab, setTab] = useState("company");
  useEffect(() => { api.get("/settings").then((r) => setS(r.data)); }, []);
  if (!s) return <div className="text-slate-400 py-20 text-center">Loading…</div>;

  const setField = (group, key, val) => setS((p) => ({ ...p, [group]: { ...(p[group] || {}), [key]: val } }));
  const save = async () => {
    await api.put("/settings", { company: s.company, contact: s.contact, social: s.social, whatsapp: s.whatsapp, homepage: s.homepage, invoice: s.invoice, quotation: s.quotation, seo: s.seo, analytics: s.analytics });
    toast.success("Settings saved"); refresh();
  };

  const TABS = [["company", "Company"], ["contact", "Contact"], ["social", "Social"], ["whatsapp", "WhatsApp"], ["homepage", "Homepage"], ["invoice", "Invoice"], ["quotation", "Quotation"], ["seo", "SEO & Verification"], ["analytics", "Analytics & Ads"]];

  return (
    <div data-testid="admin-settings">
      <PageHeader title="Global Settings"><Btn variant="accent" onClick={save} data-testid="save-settings-btn"><Save className="h-4 w-4" /> Save Changes</Btn></PageHeader>
      <div className="flex gap-1 border-b border-slate-200 mb-5 overflow-x-auto no-scrollbar">
        {TABS.map(([k, l]) => <button key={k} onClick={() => setTab(k)} className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 ${tab === k ? "border-kem-accent text-kem-accent" : "border-transparent text-slate-500"}`} data-testid={`settings-tab-${k}`}>{l}</button>)}
      </div>

      <Card className="p-6 max-w-2xl space-y-4">
        {tab === "company" && <>
          <Input label="Company Name" value={s.company?.name || ""} onChange={(e) => setField("company", "name", e.target.value)} data-testid="set-company-name" />
          <Textarea label="About" rows={3} value={s.company?.about || ""} onChange={(e) => setField("company", "about", e.target.value)} />
          <Textarea label="Address" rows={2} value={s.company?.address || ""} onChange={(e) => setField("company", "address", e.target.value)} />
          <Input label="GSTIN" value={s.company?.gstin || ""} onChange={(e) => setField("company", "gstin", e.target.value)} />
          <div><span className="text-xs font-semibold text-slate-600 uppercase block mb-2">Logo</span><ImageUploader value={s.company?.logo || ""} onChange={(v) => setField("company", "logo", v)} folder="branding" single /></div>
        </>}
        {tab === "contact" && <>
          {[["phone", "Phone"], ["alt_phone", "Alternate Phone"], ["whatsapp", "WhatsApp Number"], ["email", "Email"], ["hours", "Business Hours"]].map(([k, l]) => (
            <Input key={k} label={l} value={s.contact?.[k] || ""} onChange={(e) => setField("contact", k, e.target.value)} data-testid={`set-contact-${k}`} />
          ))}
        </>}
        {tab === "social" && <>
          {[["instagram", "Instagram"], ["facebook", "Facebook"], ["linkedin", "LinkedIn"], ["youtube", "YouTube"]].map(([k, l]) => (
            <Input key={k} label={l} value={s.social?.[k] || ""} onChange={(e) => setField("social", k, e.target.value)} />
          ))}
        </>}
        {tab === "whatsapp" && <>
          <Input label="WhatsApp Number (with country code, digits only)" value={s.whatsapp?.number || ""} onChange={(e) => setField("whatsapp", "number", e.target.value)} data-testid="set-wa-number" />
          <Textarea label="Default Message" rows={2} value={s.whatsapp?.default_message || ""} onChange={(e) => setField("whatsapp", "default_message", e.target.value)} />
          <Textarea label="Product Enquiry Template (use {product})" rows={2} value={s.whatsapp?.product_template || ""} onChange={(e) => setField("whatsapp", "product_template", e.target.value)} />
        </>}
        {tab === "homepage" && <>
          <Input label="Hero Title" value={s.homepage?.hero_title || ""} onChange={(e) => setField("homepage", "hero_title", e.target.value)} />
          <Textarea label="Hero Subtitle" rows={3} value={s.homepage?.hero_subtitle || ""} onChange={(e) => setField("homepage", "hero_subtitle", e.target.value)} />
          <div><span className="text-xs font-semibold text-slate-600 uppercase block mb-2">Hero Background Image</span><ImageUploader value={s.homepage?.hero_image || ""} onChange={(v) => setField("homepage", "hero_image", v)} folder="branding" single /></div>
        </>}
        {tab === "invoice" && <>
          <Input label="Invoice Prefix" value={s.invoice?.prefix || ""} onChange={(e) => setField("invoice", "prefix", e.target.value)} />
          <Input label="Starting Number" type="number" value={s.invoice?.start || ""} onChange={(e) => setField("invoice", "start", Number(e.target.value))} />
          <Input label="GST %" type="number" value={s.invoice?.gst || ""} onChange={(e) => setField("invoice", "gst", Number(e.target.value))} />
          <Textarea label="Terms" rows={2} value={s.invoice?.terms || ""} onChange={(e) => setField("invoice", "terms", e.target.value)} />
        </>}
        {tab === "quotation" && <>
          <Input label="Quotation Prefix" value={s.quotation?.prefix || ""} onChange={(e) => setField("quotation", "prefix", e.target.value)} />
          <Input label="Starting Number" type="number" value={s.quotation?.start || ""} onChange={(e) => setField("quotation", "start", Number(e.target.value))} />
          <Input label="Validity (days)" type="number" value={s.quotation?.validity || ""} onChange={(e) => setField("quotation", "validity", Number(e.target.value))} />
          <Textarea label="Terms" rows={2} value={s.quotation?.terms || ""} onChange={(e) => setField("quotation", "terms", e.target.value)} />
        </>}
        {tab === "seo" && <>
          <p className="text-xs text-slate-500">Sitemap: <a className="text-kem-accent underline" href={`${process.env.REACT_APP_SITE_URL || "https://www.example.com"}/sitemap.xml`} target="_blank" rel="noreferrer">/sitemap.xml</a> · Robots: <a className="text-kem-accent underline" href={`${process.env.REACT_APP_SITE_URL || "https://www.example.com"}/robots.txt`} target="_blank" rel="noreferrer">/robots.txt</a> (auto-generated from your data)</p>
          <Input label="Default SEO Title" value={s.seo?.title || ""} onChange={(e) => setField("seo", "title", e.target.value)} />
          <Textarea label="Default Meta Description" rows={2} value={s.seo?.description || ""} onChange={(e) => setField("seo", "description", e.target.value)} />
          <Input label="Google Search Console verification" value={s.seo?.google_verification || ""} onChange={(e) => setField("seo", "google_verification", e.target.value)} data-testid="set-google-verify" />
          <Input label="Bing Webmaster verification" value={s.seo?.bing_verification || ""} onChange={(e) => setField("seo", "bing_verification", e.target.value)} />
          <Input label="Open Graph Image URL" value={s.seo?.og_image || ""} onChange={(e) => setField("seo", "og_image", e.target.value)} />
        </>}
        {tab === "analytics" && <>
          <p className="text-xs text-slate-500">Paste approved IDs only. These are stored securely and never hard-coded.</p>
          <Input label="Google Analytics Measurement ID (G-XXXX)" value={s.analytics?.ga_id || ""} onChange={(e) => setField("analytics", "ga_id", e.target.value)} data-testid="set-ga-id" />
          <Input label="Google Tag Manager ID (GTM-XXXX)" value={s.analytics?.gtm_id || ""} onChange={(e) => setField("analytics", "gtm_id", e.target.value)} />
          <Input label="Meta Pixel ID" value={s.analytics?.meta_pixel || ""} onChange={(e) => setField("analytics", "meta_pixel", e.target.value)} />
          <Input label="Google AdSense Publisher ID (ca-pub-XXXX)" value={s.analytics?.adsense_id || ""} onChange={(e) => setField("analytics", "adsense_id", e.target.value)} />
        </>}
      </Card>
    </div>
  );
}
