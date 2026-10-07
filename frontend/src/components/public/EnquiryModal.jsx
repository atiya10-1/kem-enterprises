import { useState } from "react";
import { X, Send } from "lucide-react";
import { toast } from "sonner";
import api, { formatApiError } from "@/lib/api";

export default function EnquiryModal({ product, onClose }) {
  const [form, setForm] = useState({
    name: "", company: "", phone: "", email: "", quantity: "", message: "",
  });
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) { toast.error("Please enter your name and phone."); return; }
    setLoading(true);
    try {
      await api.post("/enquiries", {
        ...form, product_id: product?.id || "", product_name: product?.name || "",
        requirement: form.message,
      });
      toast.success("Enquiry sent! Our team will contact you shortly.");
      onClose();
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail));
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose} data-testid="enquiry-modal">
      <div className="w-full max-w-md bg-[#0c0c0e] border border-white/15 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-kem-accent font-bold">Quick Enquiry</div>
            <h3 className="font-display font-bold text-white text-lg mt-1 leading-snug">{product?.name || "Request a Quote"}</h3>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white" data-testid="enquiry-close"><X /></button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          {[["name", "Your Name *"], ["company", "Company"], ["phone", "Phone *"], ["email", "Email"], ["quantity", "Quantity"]].map(([k, label]) => (
            <input key={k} value={form[k]} onChange={set(k)} placeholder={label} data-testid={`enquiry-${k}`}
              className="w-full bg-white/5 border border-white/10 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-kem-accent placeholder:text-white/40" />
          ))}
          <textarea value={form.message} onChange={set("message")} rows={3} placeholder="Your requirement / message" data-testid="enquiry-message"
            className="w-full bg-white/5 border border-white/10 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-kem-accent placeholder:text-white/40" />
          <button type="submit" disabled={loading} data-testid="enquiry-submit"
            className="w-full bg-kem-accent text-white font-semibold py-3 hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
            <Send className="h-4 w-4" /> {loading ? "Sending…" : "Send Enquiry"}
          </button>
        </form>
      </div>
    </div>
  );
}
