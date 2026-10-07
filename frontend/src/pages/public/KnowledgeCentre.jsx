import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, ChevronDown } from "lucide-react";
import api, { fileUrl } from "@/lib/api";
import { PageHead } from "@/pages/public/Products";
import { SEO, SITE_URL } from "@/components/public/SEO";

export function BlogList() {
  const [posts, setPosts] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [open, setOpen] = useState(null);
  useEffect(() => {
    window.scrollTo(0, 0);
    api.get("/blog").then((r) => setPosts(r.data));
    api.get("/faqs").then((r) => setFaqs(r.data));
  }, []);
  return (
    <div className="pt-28 pb-24 max-w-[1400px] mx-auto px-5 sm:px-8" data-testid="blog-page">
      <PageHead label="Knowledge Centre" title="Insights & Guides" sub="Technical guides, product knowledge and answers to help you specify the right hardware." />
      <div className="grid md:grid-cols-3 gap-6 mt-12">
        {posts.map((p) => (
          <Link key={p.id} to={`/blog/${p.slug}`} data-testid={`blog-card-${p.slug}`} className="group border border-white/10 bg-kem-surface hover:border-white/25 transition-colors overflow-hidden">
            <div className="aspect-[16/10] bg-black overflow-hidden">
              {p.cover_image ? <img src={fileUrl(p.cover_image)} alt="" className="h-full w-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" /> : <div className="h-full grid place-items-center text-white/15 font-display font-black text-4xl">KEM</div>}
            </div>
            <div className="p-5">
              <div className="text-[10px] uppercase tracking-[0.2em] text-kem-accent font-bold mb-2">{(p.tags || [])[0] || "Article"}</div>
              <h3 className="font-display font-semibold text-white text-lg leading-snug group-hover:text-kem-accent transition-colors">{p.title}</h3>
              <p className="text-white/50 text-sm mt-2 line-clamp-2">{p.excerpt}</p>
              <div className="flex items-center gap-1.5 mt-4 text-white/60 text-sm font-medium">Read article <ArrowUpRight className="h-4 w-4" /></div>
            </div>
          </Link>
        ))}
      </div>

      {faqs.length > 0 && (
        <div className="mt-20">
          <h2 className="font-display font-bold text-white text-3xl tracking-tight mb-8">Frequently Asked Questions</h2>
          <div className="border border-white/10" data-testid="faq-list">
            {faqs.map((f, i) => (
              <div key={f.id} className="border-b border-white/10 last:border-0">
                <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between gap-4 p-5 text-left" data-testid={`faq-${i}`}>
                  <span className="font-display font-semibold text-white">{f.question}</span>
                  <ChevronDown className={`h-5 w-5 text-kem-accent shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} />
                </button>
                {open === i && <div className="px-5 pb-5 text-white/60 leading-relaxed text-sm">{f.answer}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function BlogPost() {
  const { slug } = useParams();
  const [p, setP] = useState(null);
  const [err, setErr] = useState(false);
  useEffect(() => { window.scrollTo(0, 0); api.get(`/blog/${slug}`).then((r) => setP(r.data)).catch(() => setErr(true)); }, [slug]);
  if (err) return <div className="pt-40 pb-40 text-center text-white/50">Article not found. <Link to="/blog" className="text-kem-accent underline">Knowledge Centre</Link></div>;
  if (!p) return <div className="pt-40 pb-40 text-center text-white/40">Loading…</div>;
  const description = p.seo_description || p.excerpt || `Read ${p.title} from KEM Enterprises.`;
  const articleSchema = { "@context":"https://schema.org", "@type":"Article", headline:p.title, description, author:{"@type":"Organization",name:p.author || "KEM Enterprises"}, datePublished:p.created_at, image:p.cover_image ? (p.cover_image.startsWith("http") ? p.cover_image : `${SITE_URL}${p.cover_image}`) : undefined, mainEntityOfPage:`${SITE_URL}/blog/${p.slug}` };
  return (
    <div className="pt-28 pb-24 max-w-3xl mx-auto px-5 sm:px-8" data-testid="blog-post-page">
      <SEO title={p.seo_title || `${p.title} | KEM Enterprises`} description={description} path={`/blog/${p.slug}`} image={p.cover_image} type="article" schema={articleSchema} />
      <Link to="/blog" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-6"><ArrowLeft className="h-4 w-4" /> Knowledge Centre</Link>
      <div className="text-[11px] uppercase tracking-[0.25em] text-kem-accent font-bold mb-3">{(p.tags || [])[0] || "Article"}</div>
      <h1 className="font-display font-black text-white text-3xl sm:text-5xl tracking-tighter leading-none">{p.title}</h1>
      <div className="text-white/40 text-sm mt-4">By {p.author} · {(p.created_at || "").slice(0, 10)}</div>
      {p.cover_image && <img src={fileUrl(p.cover_image)} alt="" className="w-full h-72 object-cover border border-white/10 mt-8" />}
      <div className="text-white/70 leading-relaxed mt-8 whitespace-pre-line text-[15px]">{p.content}</div>
    </div>
  );
}

export function FaqPage() { return <BlogList />; }
