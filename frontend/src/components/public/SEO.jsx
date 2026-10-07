import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSettings } from "@/context/SettingsContext";

const FALLBACK_SITE = "https://www.example.com";
export const SITE_URL = (process.env.REACT_APP_SITE_URL || FALLBACK_SITE).replace(/\/$/, "");

function upsertMeta(selector, attrs) {
  let el = document.head.querySelector(selector);
  if (!el) { el = document.createElement("meta"); document.head.appendChild(el); }
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
}
function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) { el = document.createElement("link"); el.rel = rel; document.head.appendChild(el); }
  el.href = href;
}

export function SEO({ title, description, path, image, noindex = false, type = "website", schema }) {
  const { settings } = useSettings();
  const location = useLocation();
  useEffect(() => {
    const company = settings?.company?.name || "KEM Enterprises";
    const defaultTitle = settings?.seo?.title || "KEM Enterprises | Suspension, Signage & Hardware Solutions";
    const defaultDescription = settings?.seo?.description || "KEM Enterprises supplies wire rope fittings, cable grippers, suspension systems, signage hardware, stainless steel hardware and industrial fastening solutions.";
    const finalTitle = title || defaultTitle;
    const finalDescription = description || defaultDescription;
    const canonicalPath = path ?? location.pathname;
    const canonical = `${SITE_URL}${canonicalPath === "/" ? "/" : canonicalPath.replace(/\/$/, "")}`;
    const finalImage = image || settings?.seo?.og_image || "";

    document.title = finalTitle;
    upsertMeta('meta[name="description"]', { name: "description", content: finalDescription });
    upsertMeta('meta[name="robots"]', { name: "robots", content: noindex ? "noindex,nofollow" : "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" });
    upsertMeta('meta[property="og:title"]', { property: "og:title", content: finalTitle });
    upsertMeta('meta[property="og:description"]', { property: "og:description", content: finalDescription });
    upsertMeta('meta[property="og:type"]', { property: "og:type", content: type });
    upsertMeta('meta[property="og:url"]', { property: "og:url", content: canonical });
    upsertMeta('meta[property="og:site_name"]', { property: "og:site_name", content: company });
    upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: finalImage ? "summary_large_image" : "summary" });
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: finalTitle });
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: finalDescription });
    if (finalImage) {
      const absImage = finalImage.startsWith("http") ? finalImage : `${SITE_URL}${finalImage.startsWith("/") ? "" : "/"}${finalImage}`;
      upsertMeta('meta[property="og:image"]', { property: "og:image", content: absImage });
      upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: absImage });
    }
    upsertLink("canonical", canonical);

    const verify = settings?.seo?.google_verification;
    if (verify) upsertMeta('meta[name="google-site-verification"]', { name: "google-site-verification", content: verify });

    let json = document.head.querySelector('script[data-kem-schema="true"]');
    if (json) json.remove();
    if (schema && !noindex) {
      json = document.createElement("script"); json.type = "application/ld+json"; json.dataset.kemSchema = "true";
      json.textContent = JSON.stringify(schema); document.head.appendChild(json);
    }
  }, [title, description, path, image, noindex, type, schema, location.pathname, settings]);
  return null;
}

const STATIC = {
  "/": ["KEM Enterprises | Suspension, Signage & Hardware Solutions", "Premium wire rope fittings, cable grippers, suspension systems, signage hardware, stainless steel hardware and fastening solutions from KEM Enterprises."],
  "/products": ["Products | KEM Enterprises", "Browse KEM Enterprises hardware, suspension, signage, wire rope, stainless steel and fastening products."],
  "/categories": ["Product Categories | KEM Enterprises", "Browse KEM Enterprises products by category for architectural, signage, display and industrial applications."],
  "/new-products": ["New Products | KEM Enterprises", "Explore the latest products and hardware solutions from KEM Enterprises."],
  "/featured-products": ["Featured Products | KEM Enterprises", "Explore featured suspension, signage and hardware products from KEM Enterprises."],
  "/catalogue": ["Product Catalogue | KEM Enterprises", "Browse and request the latest KEM Enterprises product catalogue."],
  "/about": ["About KEM Enterprises | Hardware & Suspension Solutions", "Learn about KEM Enterprises and our product expertise in suspension, signage and precision hardware solutions."],
  "/services": ["Services & Solutions | KEM Enterprises", "End-to-end signage suspension, glass hardware, ceiling, lighting, display and industrial suspension solutions."],
  "/industries": ["Industries & Applications | KEM Enterprises", "KEM Enterprises hardware solutions for signage, architecture, interiors, retail, glass, lighting and industrial applications."],
  "/gallery": ["Product Gallery | KEM Enterprises", "View KEM Enterprises product and hardware application gallery."],
  "/contact": ["Contact KEM Enterprises", "Contact KEM Enterprises for product enquiries, specifications, bulk requirements and quotations."],
  "/faq": ["Frequently Asked Questions | KEM Enterprises", "Answers to common questions about KEM Enterprises products, enquiries, specifications and orders."],
  "/blog": ["Knowledge Centre | KEM Enterprises", "Technical guides, product knowledge and practical insights from KEM Enterprises."],
  "/privacy": ["Privacy Policy | KEM Enterprises", "Read the KEM Enterprises privacy policy."],
  "/terms": ["Terms & Conditions | KEM Enterprises", "Read the KEM Enterprises website and trade terms and conditions."],
};

export function RouteSEO() {
  const { pathname } = useLocation();
  const { settings } = useSettings();
  const dynamic = pathname.startsWith("/products/") || pathname.startsWith("/product/") || pathname.startsWith("/blog/");
  if (dynamic) return null;
  const noindex = pathname.startsWith("/search") || pathname.startsWith("/compare") || pathname.startsWith("/enquiry") || pathname.startsWith("/request-quote") || pathname.startsWith("/catalogue/view/");
  const [title, description] = STATIC[pathname] || [undefined, undefined];
  const orgSchema = pathname === "/" ? { "@context":"https://schema.org", "@type":"Organization", name: settings?.company?.name || "KEM Enterprises", url: `${SITE_URL}/`, description: description || undefined, email: settings?.contact?.email || undefined, telephone: settings?.contact?.phone || undefined } : undefined;
  return <SEO title={title} description={description} noindex={noindex} schema={orgSchema} />;
}
