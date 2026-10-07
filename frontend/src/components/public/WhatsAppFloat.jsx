import { MessageCircle } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { generalWhatsAppLink } from "@/lib/helpers";

export default function WhatsAppFloat() {
  const { settings } = useSettings();
  if (!settings?.whatsapp?.number) return null;
  return (
    <a href={generalWhatsAppLink(settings)} target="_blank" rel="noreferrer" data-testid="whatsapp-float"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 bg-[#25D366] text-white pl-3 pr-4 py-3 shadow-lg hover:scale-105 transition-transform group">
      <MessageCircle className="h-6 w-6" strokeWidth={2} />
      <span className="text-sm font-semibold hidden sm:block max-w-0 group-hover:max-w-[160px] overflow-hidden whitespace-nowrap transition-[max-width] duration-300">Chat with KEM</span>
    </a>
  );
}
