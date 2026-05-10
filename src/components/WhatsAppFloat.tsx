import { MessageCircle } from "lucide-react";
import { companyInfo } from "@/data/products";

const WhatsAppFloat = () => {
  return (
    <a
      href={`https://wa.me/${companyInfo.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[hsl(142,70%,45%)] text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
      aria-label="تواصل عبر واتساب"
    >
      <MessageCircle size={28} />
    </a>
  );
};

export default WhatsAppFloat;
