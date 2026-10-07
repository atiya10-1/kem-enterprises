import { Outlet } from "react-router-dom";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import WhatsAppFloat from "@/components/public/WhatsAppFloat";
import CompareBar from "@/components/public/CompareBar";
import { useTheme } from "@/context/ThemeContext";
import { RouteSEO } from "@/components/public/SEO";

export default function PublicLayout() {
  const { theme } = useTheme();
  return (
    <div data-theme={theme} className="kem-shell kem-dark min-h-screen font-body antialiased selection:bg-kem-accent">
      <RouteSEO />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <CompareBar />
      <WhatsAppFloat />
    </div>
  );
}
