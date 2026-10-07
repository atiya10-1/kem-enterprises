export function digits(s) {
  return (s || "").replace(/[^0-9]/g, "");
}

export function whatsappLink(number, message) {
  const n = digits(number);
  return `https://wa.me/${n}?text=${encodeURIComponent(message || "")}`;
}

export function productWhatsAppLink(settings, productName) {
  const wa = settings?.whatsapp || {};
  const template = wa.product_template || "Hello KEM Enterprises, I am interested in {product}. Please share price, availability and specifications.";
  const msg = template.replace("{product}", productName || "your products");
  return whatsappLink(wa.number, msg);
}

export function generalWhatsAppLink(settings) {
  const wa = settings?.whatsapp || {};
  return whatsappLink(wa.number, wa.default_message || "Hello KEM Enterprises");
}

export function inr(n) {
  return "₹" + Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

export const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23e9e7e2'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial,sans-serif' font-weight='bold' font-size='30' fill='%23b4b0a8' text-anchor='middle' dominant-baseline='middle'%3EKEM%3C/text%3E%3C/svg%3E";

export function productImg(p, i = 0) {
  return (p?.images || [])[i] || PLACEHOLDER;
}
