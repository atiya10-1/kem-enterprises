import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Lock, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { formatApiError } from "@/lib/api";
import { SEO } from "@/components/public/SEO";

export default function AdminLogin() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (user) navigate("/admin"); }, [user]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { await login(email, password); toast.success("Welcome back!"); navigate("/admin"); }
    catch (err) { toast.error(formatApiError(err.response?.data?.detail) || "Login failed"); }
    finally { setLoading(false); }
  };

  return (
    <>
      <SEO title="Admin Login | KEM Enterprises" description="KEM Enterprises administration login" noindex />
    <div className="min-h-screen kem-dark grid lg:grid-cols-2" data-testid="admin-login-page">
      <div className="hidden lg:block relative kem-grain">
        <img src="https://images.pexels.com/photos/12951634/pexels-photo-12951634.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        <div className="absolute bottom-12 left-12 right-12">
          <div className="flex items-center gap-2 mb-4"><div className="h-9 w-9 bg-kem-accent grid place-items-center font-display font-black text-white text-xl">K</div><span className="font-display font-extrabold text-white text-xl">KEM Enterprises</span></div>
          <h2 className="font-display font-black text-white text-4xl tracking-tighter leading-none">Business Management Platform</h2>
          <p className="text-white/50 mt-4 max-w-md">Manage products, categories, enquiries, quotations, invoices, catalogues and more — all in one place.</p>
        </div>
      </div>
      <div className="grid place-items-center p-8">
        <form onSubmit={submit} className="w-full max-w-sm">
          <div className="h-12 w-12 bg-kem-accent grid place-items-center mb-6"><Lock className="h-6 w-6 text-white" strokeWidth={1.5} /></div>
          <h1 className="font-display font-black text-white text-3xl tracking-tight">Admin Login</h1>
          <p className="text-white/50 text-sm mt-2 mb-8">Sign in to access the KEM dashboard.</p>
          <label className="block mb-4"><span className="text-xs font-semibold text-white/60 uppercase tracking-wide block mb-1.5">Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} data-testid="login-email" required className="w-full bg-white/5 border border-white/10 text-white text-sm px-3 py-3 focus:outline-none focus:border-kem-accent" /></label>
          <label className="block mb-6"><span className="text-xs font-semibold text-white/60 uppercase tracking-wide block mb-1.5">Password</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} data-testid="login-password" required className="w-full bg-white/5 border border-white/10 text-white text-sm px-3 py-3 focus:outline-none focus:border-kem-accent" /></label>
          <button disabled={loading} data-testid="login-submit" className="w-full bg-kem-accent text-white font-semibold py-3.5 flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-colors">{loading ? "Signing in…" : <>Sign In <ArrowRight className="h-4 w-4" /></>}</button>
        </form>
      </div>
    </div>
    </>
  );
}
