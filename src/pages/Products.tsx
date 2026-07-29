import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import ProductCard from "@/components/ProductCard";
import ProductFilter from "@/components/ProductFilter";
import { useData } from "@/contexts/DataContext";
import { Filter, ChevronLeft, ChevronRight, Grid, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { resolveMediaUrl } from "@/lib/media";
import { motion } from "framer-motion";
import logoAtlas from "@/assets/logo-atlas.png";

const PRODUCTS_PER_PAGE = 12;

const Products = () => {
  const { products, categories, brands, loading } = useData();
  const [searchParams, setSearchParams] = useSearchParams();
  const brandParam = searchParams.get("brand") || "";

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrandState] = useState(brandParam);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Sync state with URL parameter
  useEffect(() => {
    setSelectedBrandState(brandParam);
  }, [brandParam]);

  const setSelectedBrand = (brandId: string) => {
    setSelectedBrandState(brandId);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (brandId) {
        next.set("brand", brandId);
      } else {
        next.delete("brand");
      }
      return next;
    });
  };

  const hasAtlasInDb = useMemo(() => {
    return brands.some((b) => b.name.toLowerCase().includes("atlas") || b.name.includes("أطلس"));
  }, [brands]);

  const activeBrandObj = useMemo(() => {
    if (selectedBrand === "atlas" && !brands.some(b => b.id === "atlas")) {
      return { id: "atlas", name: "أطلس (Atlas)", logo: logoAtlas, slug: "atlas" } as any;
    }
    return brands.find((b) => b.id === selectedBrand);
  }, [brands, selectedBrand]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory && p.category_id !== selectedCategory) return false;
      if (selectedBrand) {
        if (selectedBrand === "atlas" && !brands.some(b => b.id === "atlas")) {
          const isAtlas = p.brand_id === "atlas" || !p.brand_id;
          if (!isAtlas) return false;
        } else if (p.brand_id !== selectedBrand) {
          return false;
        }
      }
      if (showAvailableOnly && !p.available) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.name_ar.includes(q);
      }
      return true;
    });
  }, [products, selectedCategory, selectedBrand, searchQuery, showAvailableOnly, brands]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedBrand, searchQuery, showAvailableOnly]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PRODUCTS_PER_PAGE));

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filtered.slice(start, start + PRODUCTS_PER_PAGE);
  }, [filtered, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Build visible page numbers (show max 5 around current)
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const electricalCategoryId = useMemo(() => {
    return categories.find((category) => {
      const normalizedArabic = (category.name_ar || "").replace(/\s+/g, "");
      const normalizedEnglish = (category.name || "").toLowerCase();
      return normalizedArabic.includes("كهرب") || normalizedEnglish.includes("electric");
    })?.id || "";
  }, [categories]);

  const homeAppliancesCategoryId = useMemo(() => {
    return categories.find((category) => {
      const normalizedArabic = (category.name_ar || "").replace(/\s+/g, "");
      const normalizedEnglish = (category.name || "").toLowerCase();
      return normalizedArabic.includes("منزلي") || normalizedEnglish.includes("home");
    })?.id || "";
  }, [categories]);

  const filterProps = {
    selectedCategory, setSelectedCategory,
    selectedBrand, setSelectedBrand,
    searchQuery, setSearchQuery,
    showAvailableOnly, setShowAvailableOnly,
  };

  // Should we display the initial Brands Grid view?
  const showBrandsGrid = !selectedBrand && !searchQuery && !selectedCategory;

  return (
    <>
      <SEOHead />
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Top Header */}
          <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {selectedBrand && activeBrandObj ? `منتجات ${activeBrandObj.name}` : "المنتجات حسب الماركة"}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {showBrandsGrid
                  ? "اختر الماركة التجارية لعرض المنتجات الخاصة بها"
                  : selectedBrand && activeBrandObj
                  ? `تصفح كافة منتجات ماركة ${activeBrandObj.name}`
                  : "تصفح والبحث في المنتجات المتاحة"}
              </p>
            </div>

            {!showBrandsGrid && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedBrand("")}
                  className="gap-2 text-xs md:text-sm"
                >
                  <Grid size={16} />
                  عرض كل الماركات
                </Button>

                <div className="md:hidden">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Filter size={16} /> فلتر
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-72">
                      <SheetTitle>فلتر المنتجات</SheetTitle>
                      <div className="mt-4">
                        <ProductFilter {...filterProps} />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            )}
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-muted-foreground">جاري تحميل المنتجات والماركات...</p>
            </div>
          ) : showBrandsGrid ? (
            /* Brand Selection View when no brand is selected */
            <div className="py-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {/* Atlas Static Brand Card if not added in DB */}
                {!hasAtlasInDb && (
                  <motion.button
                    key="atlas-static"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setSelectedBrand("atlas")}
                    className="group flex flex-col items-center justify-center p-6 bg-card border border-border/80 hover:border-primary rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 text-center min-h-[170px]"
                  >
                    <div className="h-20 w-full flex items-center justify-center p-2 bg-muted/20 rounded-xl group-hover:bg-primary/10 transition-colors">
                      <img
                        src={logoAtlas}
                        alt="أطلس - Atlas"
                        className="max-h-16 max-w-full object-contain transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>

                    <div className="mt-4 w-full">
                      <h3 className="font-bold text-foreground text-lg group-hover:text-primary transition-colors">
                        أطلس (Atlas)
                      </h3>
                    </div>
                  </motion.button>
                )}

                {brands.map((brand, idx) => {
                  return (
                    <motion.button
                      key={brand.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.04 }}
                      onClick={() => setSelectedBrand(brand.id)}
                      className="group flex flex-col items-center justify-center p-6 bg-card border border-border/80 hover:border-primary rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 text-center min-h-[170px]"
                    >
                      <div className="h-20 w-full flex items-center justify-center p-2 bg-muted/20 rounded-xl group-hover:bg-primary/10 transition-colors">
                        {brand.logo && brand.logo !== "/placeholder.svg" ? (
                          <img
                            src={resolveMediaUrl(brand.logo)}
                            alt={brand.name}
                            className="max-h-16 max-w-full object-contain transition-transform duration-300 group-hover:scale-110"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <span className="text-xl font-bold text-primary">{brand.name}</span>
                        )}
                      </div>

                      <div className="mt-4 w-full">
                        <h3 className="font-bold text-foreground text-lg group-hover:text-primary transition-colors">
                          {brand.name}
                        </h3>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Products Listing View after brand selection or search/category filter */
            <div className="flex gap-8">
              <aside className="hidden md:block w-64 shrink-0">
                <div className="sticky top-24 bg-card rounded-lg border border-border p-4">
                  <ProductFilter {...filterProps} />
                </div>
              </aside>

              <div className="flex-1">
                {/* Active brand banner indicator */}
                {selectedBrand && activeBrandObj && (
                  <div className="flex items-center justify-between gap-4 mb-6 bg-card border border-border/80 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      {activeBrandObj.logo && activeBrandObj.logo !== "/placeholder.svg" && (
                        <div className="w-12 h-12 rounded-lg bg-muted/30 p-1 flex items-center justify-center shrink-0">
                          <img
                            src={resolveMediaUrl(activeBrandObj.logo)}
                            alt={activeBrandObj.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      )}
                      <div>
                        <span className="text-xs text-muted-foreground font-medium">الماركة المختارة:</span>
                        <h2 className="text-lg font-bold text-foreground">{activeBrandObj.name}</h2>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedBrand("")}
                      className="text-xs text-primary hover:text-primary/80 gap-1"
                    >
                      تغيير الماركة <ArrowRight size={14} />
                    </Button>
                  </div>
                )}

                {filtered.length === 0 ? (
                  <div className="text-center py-16 bg-card rounded-xl border border-border">
                    <p className="text-lg text-muted-foreground">لا توجد منتجات مطابقة لهذا الفلتر</p>
                    <Button variant="outline" className="mt-4" onClick={() => setSelectedBrand("")}>
                      عرض كافة الماركات
                    </Button>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground mb-4">
                      عرض {(currentPage - 1) * PRODUCTS_PER_PAGE + 1}–
                      {Math.min(currentPage * PRODUCTS_PER_PAGE, filtered.length)} من أصل {filtered.length} منتج
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {paginatedProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-1 mt-10 flex-wrap">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-card text-foreground hover:bg-primary hover:text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          aria-label="الصفحة السابقة"
                        >
                          <ChevronRight size={16} />
                        </button>

                        {getPageNumbers().map((page, idx) =>
                          page === "..." ? (
                            <span key={`ellipsis-${idx}`} className="w-9 h-9 flex items-center justify-center text-muted-foreground text-sm">
                              ...
                            </span>
                          ) : (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page as number)}
                              className={`w-9 h-9 rounded-lg border text-sm font-medium transition-colors ${
                                currentPage === page
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "border-border bg-card text-foreground hover:bg-primary hover:text-primary-foreground"
                              }`}
                              aria-label={`صفحة ${page}`}
                              aria-current={currentPage === page ? "page" : undefined}
                            >
                              {page}
                            </button>
                          )
                        )}

                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-card text-foreground hover:bg-primary hover:text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          aria-label="الصفحة التالية"
                        >
                          <ChevronLeft size={16} />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Products;

