import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MessageCircle } from "lucide-react";
import { companyInfo } from "@/data/products";
import { resolveMediaUrl } from "@/lib/media";
import { getColorHex } from "@/lib/colors";
import { Helmet } from "react-helmet";
import { supabase } from "@/integrations/supabase/client";
import type { DbProduct } from "@/contexts/DataContext";

const ProductDetail = () => {
  const { brandSlug, productSlug } = useParams();
  const { products, loading: contextLoading } = useData();
  const [fetchedProduct, setFetchedProduct] = useState<DbProduct | null>(null);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchDone, setFetchDone] = useState(false);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // Try to find in cached products first
  const cachedProduct = useMemo(() => {
    return products.find(p => p.slug === productSlug);
  }, [products, productSlug]);

  // If not in cache and context finished loading → fetch directly from DB
  useEffect(() => {
    if (cachedProduct || fetchDone) return;
    if (contextLoading) return; // wait for context first

    const slug = productSlug || '';
    if (!slug) { setFetchDone(true); return; }

    setFetchLoading(true);

    const tryFetch = async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      setFetchedProduct(data || null);
      setFetchLoading(false);
      setFetchDone(true);
    };

    tryFetch();
  }, [productSlug, cachedProduct, contextLoading, fetchDone]);

  const product = cachedProduct || fetchedProduct;
  const isLoading = contextLoading || fetchLoading;

  // All product images
  const allImages = useMemo(() => {
    if (!product) return [];
    const rawList: string[] = [];
    if (product.image) rawList.push(product.image);
    if (product.images && Array.isArray(product.images)) {
      product.images.forEach((img) => {
        if (img) rawList.push(img);
      });
    }

    // Filter out duplicates and placeholder images if real images are present
    const validImages = rawList.filter(
      (img, index, self) =>
        self.indexOf(img) === index && img !== "/placeholder.svg" && img.trim() !== ""
    );

    if (validImages.length > 0) {
      return validImages;
    }

    return ["/placeholder.svg"];
  }, [product]);

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [product?.id, allImages.length]);

  // Product colors list
  const colorsList: string[] = useMemo(() => {
    if (!product) return [];
    if ((product as any)?.colors && Array.isArray((product as any).colors)) {
      return (product as any).colors.filter(Boolean);
    }
    return [];
  }, [product]);

  // Color → image mapping
  const colorImages: Record<string, string> = useMemo(() => {
    return (product as any)?.color_images || {};
  }, [product]);

  // When color selected, switch image if mapped
  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    if (colorImages[color]) {
      const idx = allImages.indexOf(colorImages[color]);
      if (idx !== -1) setSelectedImageIndex(idx);
      else {
        // image not in allImages list yet — still show via override
        setSelectedImageIndex(-1);
      }
    }
  };

  useEffect(() => {
    if (colorsList.length > 0 && !selectedColor) {
      setSelectedColor(colorsList[0]);
      if (colorImages[colorsList[0]]) {
        const idx = allImages.indexOf(colorImages[colorsList[0]]);
        if (idx !== -1) setSelectedImageIndex(idx);
      }
    }
  }, [colorsList, selectedColor, colorImages, allImages]);

  // The image to display — may be overridden by color selection
  const displayImage = selectedColor && colorImages[selectedColor]
    ? colorImages[selectedColor]
    : (allImages[selectedImageIndex] || allImages[0]);

  // Show spinner while loading
  if (isLoading && !product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">جاري تحميل المنتج...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Only show not-found after all loading is done
  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">المنتج غير موجود</h1>
            <Button asChild><Link to="/products">العودة للمنتجات</Link></Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // SEO metadata
  const metaTitle = (product as any)?.meta_title_ar || product?.name_ar;
  const metaDescription = (product as any)?.meta_description_ar || product?.description_ar?.substring(0, 160);
  const metaKeywords = (product as any)?.meta_keywords_ar || '';

  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription || ''} />
        {metaKeywords && <meta name="keywords" content={metaKeywords} />}
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription || ''} />
        <meta property="og:image" content={resolveMediaUrl(allImages[selectedImageIndex] || product.image)} />
        <meta property="og:type" content="product" />
      </Helmet>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-foreground">الرئيسية</Link>
            <ArrowRight size={14} />
            <Link to="/products" className="hover:text-foreground">المنتجات</Link>
            <ArrowRight size={14} />
            <span className="text-foreground">{product.name_ar}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="bg-card border border-border/80 rounded-2xl aspect-square flex items-center justify-center p-4 shadow-sm overflow-hidden relative group">
                <img
                  src={resolveMediaUrl(displayImage)}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = resolveMediaUrl();
                  }}
                  alt={product.name_ar}
                  className="w-full h-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Thumbnails Gallery */}
              {allImages.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      onMouseEnter={() => setSelectedImageIndex(idx)}
                      className={`relative w-20 h-20 rounded-xl border p-1.5 bg-card shrink-0 transition-all duration-200 ${
                        selectedImageIndex === idx
                          ? "border-primary ring-2 ring-primary/40 shadow-md scale-105"
                          : "border-border/80 opacity-70 hover:opacity-100 hover:border-primary/50"
                      }`}
                    >
                      <img
                        src={resolveMediaUrl(img)}
                        alt={`${product.name_ar} ${idx + 1}`}
                        className="w-full h-full object-contain rounded-lg"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">{product.name_ar}</h1>
                {!product.available && <Badge variant="destructive">غير متاح</Badge>}
              </div>

              {product.sku && (
                <div className="mb-2">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-muted/50 text-muted-foreground border border-border/50 text-sm shadow-sm">
                    <span className="ml-1.5 font-medium">رمز التخزين:</span>
                    <span className="font-mono tracking-wider">{product.sku}</span>
                  </span>
                </div>
              )}

              <p className="text-sm text-muted-foreground mb-6">{product.name}</p>

              {/* Available Colors Filter Section */}
              {colorsList.length > 0 && (
                <div className="mb-6 bg-card border border-border/80 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-foreground text-sm flex items-center gap-1.5">
                      الخيارات والألوان المتوفرة:
                    </span>
                    {selectedColor && (
                      <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                        {selectedColor}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {colorsList.map((color) => {
                      const hex = getColorHex(color);
                      const isSelected = selectedColor === color;
                      return (
                        <button
                          key={color}
                          type="button"
                          onClick={() => handleColorSelect(color)}
                          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-medium transition-all duration-200 ${
                            isSelected
                              ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/30 font-bold shadow-sm"
                              : "border-border bg-muted/40 text-foreground hover:border-primary/40 hover:bg-muted/80"
                          }`}
                        >
                          <span
                            className="w-4 h-4 rounded-full border border-black/20 shadow-inner shrink-0"
                            style={{ backgroundColor: hex }}
                          />
                          <span>{color}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <div
                  className="text-muted-foreground leading-relaxed mb-3"
                  dangerouslySetInnerHTML={{ __html: product.description_ar || '' }}
                />
              </div>

              {product.features && product.features.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-semibold text-foreground mb-3">المميزات</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.features.map((f, i) => (
                      <Badge key={i} variant="secondary">{f}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <Button asChild size="lg" className="w-full gap-2">
                <a
                  href={`https://wa.me/${companyInfo.whatsapp}?text=مرحبا، أريد الاستفسار عن ${product.name_ar}${selectedColor ? ` (اللون: ${selectedColor})` : ''}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle size={20} />
                  اطلب عرض سعر عبر واتساب
                </a>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProductDetail;

