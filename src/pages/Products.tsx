import { useState, useMemo, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import ProductCard from "@/components/ProductCard";
import ProductFilter from "@/components/ProductFilter";
import { useData } from "@/contexts/DataContext";
import { Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const PRODUCTS_PER_PAGE = 12;

const Products = () => {
  const { products, categories, loading } = useData();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory && p.category_id !== selectedCategory) return false;
      if (selectedBrand && p.brand_id !== selectedBrand) return false;
      if (showAvailableOnly && !p.available) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.name_ar.includes(q);
      }
      return true;
    });
  }, [products, selectedCategory, selectedBrand, searchQuery, showAvailableOnly]);

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

  return (
    <>
      <SEOHead />
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">المنتجات</h1>
            <div className="flex items-center gap-2 md:hidden">
              <Button
                variant={selectedCategory === electricalCategoryId ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(selectedCategory === electricalCategoryId ? "" : electricalCategoryId)}
                disabled={!electricalCategoryId}
              >
                الكهربائية
              </Button>
              <Button
                variant={selectedCategory === homeAppliancesCategoryId ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(selectedCategory === homeAppliancesCategoryId ? "" : homeAppliancesCategoryId)}
                disabled={!homeAppliancesCategoryId}
              >
                الأجهزة المنزلية
              </Button>
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

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="hidden md:inline-flex gap-2">
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

          <div className="flex gap-8">
            <aside className="hidden md:block w-64 shrink-0">
              <div className="sticky top-24 bg-card rounded-lg border border-border p-4">
                <ProductFilter {...filterProps} />
              </div>
            </aside>

            <div className="flex-1">
              {loading ? (
                <div className="text-center py-16">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  <p className="mt-4 text-muted-foreground">جاري تحميل المنتجات...</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  لا توجد منتجات مطابقة
                </div>
              ) : (
                <>
                  {/* Products count info */}
                  <p className="text-sm text-muted-foreground mb-4">
                    عرض {(currentPage - 1) * PRODUCTS_PER_PAGE + 1}–{Math.min(currentPage * PRODUCTS_PER_PAGE, filtered.length)} من أصل {filtered.length} منتج
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-1 mt-10 flex-wrap">
                      {/* Previous */}
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-card text-foreground hover:bg-primary hover:text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        aria-label="الصفحة السابقة"
                      >
                        <ChevronRight size={16} />
                      </button>

                      {/* Page numbers */}
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

                      {/* Next */}
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
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Products;
