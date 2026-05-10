import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Globe, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoAtlas from "@/assets/logo-atlas.png";

const navLinks = [
  { path: "/", label: "الرئيسية" },
  { path: "/products", label: "المنتجات" },
  { path: "/about", label: "من نحن" },
  { path: "/contact", label: "تواصل معنا" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  if (isHomePage) {
    return (
      <nav className="absolute top-0 inset-x-0 z-50">
        <div className="w-full pr-3 pl-5 md:px-5 lg:px-6 pt-5 md:pt-6 flex items-center justify-between">
          <Link to="/" className="flex items-center -mr-2 md:-mr-3">
            <img src={logoAtlas} alt="أطلس - Atlas" className="h-20 md:h-24 brightness-0 invert" />
          </Link>

          <div className="relative">
            <div className="flex items-center gap-2 rounded-xl md:rounded-2xl border border-primary-foreground/30 bg-primary-foreground/10 px-3 py-2 md:px-4 md:py-2.5 backdrop-blur-sm">
              <div className="flex items-center gap-1 text-primary-foreground/90 text-xs md:text-sm font-medium">
                <span>AR</span>
                <Globe size={14} className="md:w-4 md:h-4" />
              </div>

              <button
                onClick={() => setMobileOpen((prev) => !prev)}
                className="text-primary-foreground p-0.5 md:p-1"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={20} className="md:w-6 md:h-6" /> : <Menu size={20} className="md:w-6 md:h-6" />}
              </button>
            </div>

            {mobileOpen && (
              <div className="absolute left-0 mt-3 w-72 rounded-2xl border border-primary-foreground/20 bg-primary/95 p-2 shadow-lg">
                <div className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                        location.pathname === link.path
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "text-primary-foreground/85 hover:bg-primary-foreground/10"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 h-20 bg-primary border-b border-border shadow-sm">
      <div className="container mx-auto h-full flex items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={logoAtlas} alt="أطلس - Atlas" className="h-16 brightness-0 invert" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === link.path
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <Button asChild variant="secondary" size="sm">
            <Link to="/products">تصفح المنتجات</Link>
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-primary-foreground p-2"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-primary border-t border-primary-foreground/10">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "text-primary-foreground/80 hover:bg-primary-foreground/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Button asChild variant="secondary" size="sm" className="mt-2">
              <Link to="/products" onClick={() => setMobileOpen(false)}>تصفح المنتجات</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
