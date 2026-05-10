import { useEffect } from "react";
import { useData } from "@/contexts/DataContext";
import { useLocation } from "react-router-dom";

const SEOHead = () => {
  const { seoSettings } = useData();
  const location = useLocation();

  useEffect(() => {
    const pageSeo = seoSettings.find(s => s.page_path === location.pathname);
    if (pageSeo) {
      document.title = pageSeo.title;

      const setMeta = (name: string, content: string, isProperty = false) => {
        const attr = isProperty ? "property" : "name";
        let el = document.querySelector(`meta[${attr}="${name}"]`);
        if (!el) {
          el = document.createElement("meta");
          el.setAttribute(attr, name);
          document.head.appendChild(el);
        }
        el.setAttribute("content", content);
      };

      setMeta("description", pageSeo.description || "");
      setMeta("robots", pageSeo.robots || "index, follow");
      setMeta("og:title", pageSeo.og_title || pageSeo.title, true);
      setMeta("og:description", pageSeo.og_description || pageSeo.description || "", true);
      setMeta("og:image", pageSeo.og_image || "/placeholder.svg", true);
    }
  }, [location.pathname, seoSettings]);

  return null;
};

export default SEOHead;
