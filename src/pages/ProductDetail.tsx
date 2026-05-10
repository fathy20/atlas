import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MessageCircle, Languages } from "lucide-react";
import { companyInfo } from "@/data/products";
import { resolveMediaUrl } from "@/lib/media";
import { Helmet } from "react-helmet";

const ProductDetail = () => {
  const { id } = useParams();
  const { products } = useData();
  const product = products.find((p) => p.slug === id);
  const [showEnglish, setShowEnglish] = useState(false);

  // SEO metadata
  const metaTitle = showEnglish 
    ? ((product as any)?.meta_title || product?.name)
    : ((product as any)?.meta_title_ar || product?.name_ar);
  
  const metaDescription = showEnglish
    ? ((product as any)?.meta_description || product?.description?.substring(0, 160))
    : ((product as any)?.meta_description_ar || product?.description_ar?.substring(0, 160));
  
  const metaKeywords = showEnglish
    ? ((product as any)?.meta_keywords || '')
    : ((product as any)?.meta_keywords_ar || '');

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

  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription || ''} />
        {metaKeywords && <meta name="keywords" content={metaKeywords} />}
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription || ''} />
        <meta property="og:image" content={resolveMediaUrl(product.image)} />
        <meta property="og:type" content="product" />
        <meta property="product:price:amount" content={product.price.toString()} />
        <meta property="product:price:currency" content="LYD" />
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
            <div className="bg-muted rounded-lg aspect-square flex items-center justify-center">
              <img
                src={resolveMediaUrl(product.image)}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = resolveMediaUrl();
                }}
                alt={product.name_ar}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">{product.name_ar}</h1>
                {!product.available && <Badge variant="destructive">غير متاح</Badge>}
              </div>
              {product.sku && (
                <div className="mb-2">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-muted/50 text-muted-foreground border border-border/50 text-sm font-mono tracking-wider shadow-sm" dir="ltr">
                    <span className="mr-1.5 font-sans font-medium">رمز التخزين:</span> {product.sku}
                  </span>
                </div>
              )}
              <p className="text-sm text-muted-foreground mb-4">{product.name}</p>
              <p className="text-2xl font-bold text-primary mb-6">{product.price} د.ل</p>
              
              <div className="mb-6">
                <div 
                  className="text-muted-foreground leading-relaxed mb-3"
                  dangerouslySetInnerHTML={{ 
                    __html: showEnglish 
                      ? (product.description || '') 
                      : (product.description_ar || '')
                  }}
                  dir={showEnglish ? "ltr" : "rtl"}
                />
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setShowEnglish(!showEnglish)}
                  className="gap-1.5 bg-primary hover:bg-primary/90 text-xs px-3 py-1 h-auto"
                >
                  <Languages size={14} />
                  {showEnglish ? "عربي" : "English"}
                </Button>
              </div>

              <div className="mb-8">
                <h3 className="font-semibold text-foreground mb-3">المميزات</h3>
                <div className="flex flex-wrap gap-2">
                  {(product.features || []).map((f, i) => (
                    <Badge key={i} variant="secondary">{f}</Badge>
                  ))}
                </div>
              </div>

              <Button asChild size="lg" className="w-full gap-2">
                <a href={`https://wa.me/${companyInfo.whatsapp}?text=مرحبا، أريد الاستفسار عن ${product.name_ar}`} target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={20} />
                  اطلب عبر واتساب
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
