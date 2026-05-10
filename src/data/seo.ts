export interface PageSEO {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  robots: string;
  canonical: string;
}

export interface SEOSettings {
  pages: Record<string, PageSEO>;
  robotsRules: RobotsRule[];
  sitemapPages: SitemapPage[];
}

export interface RobotsRule {
  userAgent: string;
  allow: string[];
  disallow: string[];
}

export interface SitemapPage {
  path: string;
  title: string;
  visible: boolean;
  priority: number;
  changefreq: string;
}

export const defaultSEO: SEOSettings = {
  pages: {
    "/": {
      title: "أطلس - لإستيراد المواد الكهربائية والمنزلية",
      description: "أطلس لإستيراد المواد الكهربائية والمنزلية - أكبر تشكيلة من المنتجات عالية الجودة في طرابلس، ليبيا",
      ogTitle: "أطلس - لإستيراد المواد الكهربائية والمنزلية",
      ogDescription: "أكبر تشكيلة من المنتجات الكهربائية والمنزلية عالية الجودة",
      ogImage: "/placeholder.svg",
      robots: "index, follow",
      canonical: "/",
    },
    "/products": {
      title: "المنتجات - أطلس",
      description: "تصفح تشكيلتنا الواسعة من المنتجات الكهربائية والمنزلية من أفضل الماركات العالمية",
      ogTitle: "منتجات أطلس",
      ogDescription: "تصفح تشكيلتنا الواسعة من المنتجات الكهربائية والمنزلية",
      ogImage: "/placeholder.svg",
      robots: "index, follow",
      canonical: "/products",
    },
    "/about": {
      title: "من نحن - أطلس",
      description: "تعرف على قصة أطلس - أكثر من 15 سنة خبرة في استيراد وتوزيع المواد الكهربائية والمنزلية",
      ogTitle: "من نحن - أطلس",
      ogDescription: "أكثر من 15 سنة خبرة في استيراد المواد الكهربائية والمنزلية",
      ogImage: "/placeholder.svg",
      robots: "index, follow",
      canonical: "/about",
    },
    "/contact": {
      title: "تواصل معنا - أطلس",
      description: "تواصل مع أطلس - طرابلس، الكريمية - هاتف: 0913407799",
      ogTitle: "تواصل معنا - أطلس",
      ogDescription: "تواصل معنا عبر الهاتف أو واتساب",
      ogImage: "/placeholder.svg",
      robots: "index, follow",
      canonical: "/contact",
    },
  },
  robotsRules: [
    { userAgent: "Googlebot", allow: ["/"], disallow: ["/dashboard", "/login"] },
    { userAgent: "Bingbot", allow: ["/"], disallow: ["/dashboard", "/login"] },
    { userAgent: "*", allow: ["/"], disallow: ["/dashboard", "/login"] },
  ],
  sitemapPages: [
    { path: "/", title: "الرئيسية", visible: true, priority: 1.0, changefreq: "weekly" },
    { path: "/products", title: "المنتجات", visible: true, priority: 0.9, changefreq: "daily" },
    { path: "/about", title: "من نحن", visible: true, priority: 0.7, changefreq: "monthly" },
    { path: "/contact", title: "تواصل معنا", visible: true, priority: 0.6, changefreq: "monthly" },
  ],
};
