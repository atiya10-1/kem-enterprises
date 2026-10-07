import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { CompareProvider } from "@/context/CompareContext";
import { ThemeProvider } from "@/context/ThemeContext";

import PublicLayout from "@/components/public/PublicLayout";
import Home from "@/pages/public/Home";
import Products from "@/pages/public/Products";
import CategoryPage from "@/pages/public/CategoryPage";
import ProductDetail from "@/pages/public/ProductDetail";
import Catalogue from "@/pages/public/Catalogue";
import About from "@/pages/public/About";
import Contact from "@/pages/public/Contact";
import SearchResults from "@/pages/public/SearchResults";
import PublicCatalogueView from "@/pages/public/PublicCatalogueView";
import Compare from "@/pages/public/Compare";
import { BlogList, BlogPost } from "@/pages/public/KnowledgeCentre";
import { Services, Industries, Gallery, Privacy, Terms, EnquiryPage } from "@/pages/public/StaticPages";

import AdminLogin from "@/pages/admin/Login";
import AdminLayout from "@/components/admin/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminImport from "@/pages/admin/AdminImport";
import ProductForm from "@/pages/admin/ProductForm";
import AdminCategories from "@/pages/admin/AdminCategories";
import AdminMedia from "@/pages/admin/AdminMedia";
import AdminEnquiries from "@/pages/admin/AdminEnquiries";
import AdminCustomers from "@/pages/admin/AdminCustomers";
import AdminQuotations from "@/pages/admin/AdminQuotations";
import QuotationForm from "@/pages/admin/QuotationForm";
import AdminInvoices from "@/pages/admin/AdminInvoices";
import InvoiceForm from "@/pages/admin/InvoiceForm";
import AdminCatalogues from "@/pages/admin/AdminCatalogues";
import AdminReports from "@/pages/admin/AdminReports";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminBlog from "@/pages/admin/AdminBlog";
import AdminFaqs from "@/pages/admin/AdminFaqs";

function AdminNoIndex({ children }) {
  useEffect(() => {
    document.title = "Admin | KEM Enterprises";
    let meta = document.head.querySelector('meta[name="robots"]');
    if (!meta) { meta = document.createElement("meta"); meta.name = "robots"; document.head.appendChild(meta); }
    meta.content = "noindex,nofollow,noarchive";
  }, []);
  return children;
}

function NotFound() {
  useEffect(() => {
    document.title = "Page Not Found | KEM Enterprises";
    let meta = document.head.querySelector('meta[name="robots"]');
    if (!meta) { meta = document.createElement("meta"); meta.name = "robots"; document.head.appendChild(meta); }
    meta.content = "noindex,nofollow";
  }, []);
  return <div className="min-h-[60vh] pt-40 text-center text-white/60"><h1 className="text-3xl text-white mb-4">Page not found</h1><a href="/" className="text-kem-accent underline">Return to KEM Enterprises</a></div>;
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen grid place-items-center text-sm text-slate-500">Loading…</div>;
  if (!user) return <Navigate to="/admin/login" replace />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
      <SettingsProvider>
        <CompareProvider>
        <BrowserRouter>
          <Toaster position="top-right" richColors />
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:categorySlug" element={<CategoryPage />} />
              <Route path="/products/:categorySlug/:productSlug" element={<ProductDetail />} />
              <Route path="/product/:productSlug" element={<ProductDetail />} />
              <Route path="/categories" element={<Products />} />
              <Route path="/new-products" element={<Products />} />
              <Route path="/featured-products" element={<Products />} />
              <Route path="/catalogue" element={<Catalogue />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/industries" element={<Industries />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/enquiry" element={<EnquiryPage />} />
              <Route path="/request-quote" element={<EnquiryPage />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/catalogue/view/:token" element={<PublicCatalogueView />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/faq" element={<BlogList />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            <Route path="/admin/login" element={<AdminNoIndex><AdminLogin /></AdminNoIndex>} />
            <Route path="/admin" element={<AdminNoIndex><ProtectedRoute><AdminLayout /></ProtectedRoute></AdminNoIndex>}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="import" element={<AdminImport />} />
              <Route path="products/new" element={<ProductForm />} />
              <Route path="products/:id" element={<ProductForm />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="media" element={<AdminMedia />} />
              <Route path="enquiries" element={<AdminEnquiries />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="quotations" element={<AdminQuotations />} />
              <Route path="quotations/new" element={<QuotationForm />} />
              <Route path="quotations/:id" element={<QuotationForm />} />
              <Route path="invoices" element={<AdminInvoices />} />
              <Route path="invoices/new" element={<InvoiceForm />} />
              <Route path="invoices/:id" element={<InvoiceForm />} />
              <Route path="catalogues" element={<AdminCatalogues />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="blog" element={<AdminBlog />} />
              <Route path="faqs" element={<AdminFaqs />} />
            </Route>
          </Routes>
        </BrowserRouter>
        </CompareProvider>
      </SettingsProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
