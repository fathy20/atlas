import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram } from "lucide-react";
import { companyInfo } from "@/data/products";
import logoAtlas from "@/assets/logo-atlas.png";

const TikTokIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M9 0h3.15a4.17 4.17 0 0 0 1.19 2.67A4.17 4.17 0 0 0 16 3.85v3.03a7.2 7.2 0 0 1-4-1.34v5.32a5.54 5.54 0 0 1-5.55 5.54A5.53 5.53 0 0 1 0 10.86 5.54 5.54 0 0 1 6.45 5.3v3.17a2.4 2.4 0 0 0-.58-.08A2.46 2.46 0 0 0 3.42 10.85a2.46 2.46 0 0 0 2.45 2.46 2.46 2.46 0 0 0 2.46-2.46V0Z" />
  </svg>
);

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="mb-4" aria-label="ATLAS أطلس">
              <img
                src={logoAtlas}
                alt="ATLAS أطلس"
                className="h-16 w-auto object-contain [filter:brightness(0)_invert(1)]"
              />
            </h3>
            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-4">
              {companyInfo.fullName}
            </p>
            <div className="flex items-center gap-3">
              <a
                href={companyInfo.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href={companyInfo.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href={companyInfo.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                aria-label="TikTok"
              >
                <TikTokIcon size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">روابط سريعة</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">الرئيسية</Link>
              <Link to="/products" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">المنتجات</Link>
              <Link to="/about" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">من نحن</Link>
              <Link to="/contact" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">تواصل معنا</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">تواصل معنا</h4>
            <div className="flex flex-col gap-3">
              <a href={`tel:${companyInfo.phone}`} className="flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                <Phone size={16} />
                <span dir="ltr">{companyInfo.phone}</span>
              </a>
              <a href={`mailto:${companyInfo.email}`} className="flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                <Mail size={16} />
                {companyInfo.email}
              </a>
              <div className="flex items-center gap-2 text-sm text-primary-foreground/70">
                <MapPin size={16} />
                {companyInfo.address}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-primary-foreground/10 text-center text-sm text-primary-foreground/50">
          © {new Date().getFullYear()} أطلس. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
