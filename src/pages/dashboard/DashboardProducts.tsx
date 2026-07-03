import { useState, useMemo } from "react";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Pencil, Trash2, Search, Filter, Upload, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { DbProduct } from "@/contexts/DataContext";
import { resolveMediaUrl } from "@/lib/media";
import RichTextEditor from "@/components/RichTextEditor";

const DashboardProducts = () => {
  const { products, categories, brands, loading, addProduct, updateProduct, deleteProduct } = useData();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<DbProduct | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterBrand, setFilterBrand] = useState<string>("all");
  const [filterAvailable, setFilterAvailable] = useState<string>("all");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Selection
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());

  const [form, setForm] = useState({
    name: "", name_ar: "", description_ar: "",
    price: 0, category_id: "", brand_id: "", available: true, features: "", slug: "",
    sku: "",
    image: "", images: [] as string[],
    meta_title: "", meta_title_ar: "", meta_description: "", meta_description_ar: "",
    meta_keywords: "", meta_keywords_ar: "",
  });

  const resetForm = () => {
    setForm({ 
      name: "", name_ar: "", description_ar: "", 
      price: 0, category_id: "", brand_id: "", available: true, 
      features: "", slug: "", sku: "", image: "", images: [],
      meta_title: "", meta_title_ar: "", meta_description: "", meta_description_ar: "",
      meta_keywords: "", meta_keywords_ar: "",
    });
    setEditingProduct(null);
  };

  const openEdit = (p: DbProduct) => {
    setEditingProduct(p);
    setForm({
      name: p.name, name_ar: p.name_ar, 
      description_ar: p.description_ar || "",
      price: p.price, category_id: p.category_id || "", brand_id: p.brand_id || "", 
      available: p.available,
      features: (p.features || []).join(", "), slug: p.slug,
      sku: p.sku || "",
      image: p.image || "", images: p.images || [],
      meta_title: (p as any).meta_title || "", meta_title_ar: (p as any).meta_title_ar || "",
      meta_description: (p as any).meta_description || "", meta_description_ar: (p as any).meta_description_ar || "",
      meta_keywords: (p as any).meta_keywords || "", meta_keywords_ar: (p as any).meta_keywords_ar || "",
    });
    setDialogOpen(true);
  };
  
  // Filtered & Paginated Products
  const filteredProducts = useMemo(() => {
    const filtered = products.filter(p => {
      const matchSearch = searchQuery === "" || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.name_ar.includes(searchQuery);
      const matchCategory = filterCategory === "all" || p.category_id === filterCategory;
      const matchBrand = filterBrand === "all" || p.brand_id === filterBrand;
      const matchAvailable = filterAvailable === "all" || 
        (filterAvailable === "available" && p.available) ||
        (filterAvailable === "unavailable" && !p.available);
      return matchSearch && matchCategory && matchBrand && matchAvailable;
    });
    
    // Sort by created_at descending (newest first)
    return filtered.sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      return dateB - dateA;
    });
  }, [products, searchQuery, filterCategory, filterBrand, filterAvailable]);
  
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);
  
  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedProducts.size === paginatedProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(paginatedProducts.map(p => p.id)));
    }
  };
  
  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedProducts);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedProducts(newSet);
  };
  
  const handleBulkDelete = async () => {
    for (const id of selectedProducts) {
      await deleteProduct(id);
    }
    setSelectedProducts(new Set());
    toast({ title: "تم حذف المنتجات المحددة" });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.name_ar || !form.category_id) {
      toast({ title: "خطأ", description: "يرجى ملء الحقول المطلوبة", variant: "destructive" });
      return;
    }

    // Generate SEO-friendly slug
    const generateSlug = (text: string): string => {
      return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-')      // Replace spaces with hyphens
        .replace(/-+/g, '-')       // Replace multiple hyphens with single hyphen
        .replace(/^-+|-+$/g, '');  // Remove leading/trailing hyphens
    };

    const slug = form.slug 
      ? generateSlug(form.slug) 
      : generateSlug(form.name) + "-" + Date.now();
    const productData: any = {
      slug,
      name: form.name, name_ar: form.name_ar,
      description: null, description_ar: form.description_ar,
      price: form.price, category_id: form.category_id || null, brand_id: form.brand_id || null,
      image: form.image || "/placeholder.svg", 
      images: form.images.length > 0 ? form.images : ["/placeholder.svg"],
      features: form.features.split(",").map(f => f.trim()).filter(Boolean),
      available: form.available,
      sku: form.sku || null,
      meta_title: form.meta_title || null,
      meta_title_ar: form.meta_title_ar || null,
      meta_description: form.meta_description || null,
      meta_description_ar: form.meta_description_ar || null,
      meta_keywords: form.meta_keywords || null,
      meta_keywords_ar: form.meta_keywords_ar || null,
    };

    console.log("Saving product data:", { 
      id: editingProduct?.id, 
      image: productData.image?.substring(0, 50) + "...",
      imagesCount: productData.images.length 
    });

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        toast({ title: "تم التحديث بنجاح" });
      } else {
        await addProduct(productData);
        toast({ title: "تم إضافة المنتج بنجاح" });
      }
      resetForm();
      setDialogOpen(false);
    } catch (error: any) {
      console.error("Submit error:", error);
      toast({ title: "خطأ", description: error?.message || "حدث خطأ أثناء حفظ المنتج", variant: "destructive" });
    }
  };

  const confirmDelete = (id: string) => {
    setProductToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (productToDelete) {
      try {
        await deleteProduct(productToDelete);
        toast({ title: "تم حذف المنتج بنجاح" });
      } catch (error) {
        toast({ title: "خطأ", description: "حدث خطأ أثناء حذف المنتج", variant: "destructive" });
      }
      setProductToDelete(null);
      setDeleteDialogOpen(false);
    }
  };
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Convert images to base64 or upload to server
    // For now, we'll create local URLs (you can replace this with actual upload to Supabase Storage)
    const newImages: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const base64String = reader.result as string;
        newImages.push(base64String);
        
        // Update form when all images are processed
        if (newImages.length === files.length) {
          const updatedImages = [...form.images, ...newImages];
          setForm({ 
            ...form, 
            images: updatedImages,
            image: form.image || updatedImages[0]
          });
          toast({ title: "تم إضافة الصور بنجاح" });
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  const addImageUrl = () => {
    const url = prompt("أدخل رابط الصورة:");
    if (url) {
      setForm({ ...form, images: [...form.images, url] });
      if (!form.image) setForm({ ...form, image: url, images: [...form.images, url] });
    }
  };
  
  const removeImage = (index: number) => {
    const newImages = form.images.filter((_, i) => i !== index);
    setForm({ 
      ...form, 
      images: newImages,
      image: newImages[0] || ""
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">إدارة المنتجات</h1>
          <p className="text-sm text-muted-foreground mt-1">
            إجمالي المنتجات: {products.length}+ | معروض: {filteredProducts.length}
            {products.length >= 20 && products.length < 84 && (
              <span className="inline-flex items-center gap-1 mr-2 text-primary">
                <span className="inline-block animate-spin rounded-full h-3 w-3 border-b border-primary"></span>
                جاري تحميل المزيد...
              </span>
            )}
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(v) => { setDialogOpen(v); if (!v) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus size={18} /> إضافة منتج جديد</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">{editingProduct ? "تعديل منتج" : "إضافة منتج جديد"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-5 mt-4">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-muted-foreground">المعلومات الأساسية</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">الاسم بالإنجليزية *</Label>
                    <Input 
                      value={form.name} 
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Product Name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">الاسم بالعربية *</Label>
                    <Input 
                      value={form.name_ar} 
                      onChange={(e) => setForm({ ...form, name_ar: e.target.value })}
                      placeholder="اسم المنتج"
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* SKU */}
                <div>
                  <Label className="text-sm">رمز القطعة / رمز المادة (SKU)</Label>
                  <Input 
                    value={form.sku} 
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    placeholder="مثال: GW92004/1P4C"
                    className="mt-1 font-mono"
                    dir="ltr"
                  />
                  <p className="text-xs text-muted-foreground mt-1">رمز التخزين الخاص بالقطعة كما يظهر في كتالوج المنتجات</p>
                </div>
                
                <div>
                  <Label className="text-sm">الوصف</Label>
                  <div className="mt-1">
                    <RichTextEditor
                      content={form.description_ar}
                      onChange={(content) => setForm({ ...form, description_ar: content })}
                      placeholder="وصف المنتج..."
                      dir="rtl"
                    />
                  </div>
                </div>
              </div>

              {/* Categorization */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-muted-foreground">التصنيف والسعر</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm">الفئة *</Label>
                    <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="اختر فئة" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(c => (
                          <SelectItem key={c.id} value={c.id}>{c.name_ar}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-sm">الماركة</Label>
                    <Select value={form.brand_id} onValueChange={(v) => setForm({ ...form, brand_id: v })}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="اختر ماركة" />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map(b => (
                          <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-muted-foreground">الصور</h3>
                <div>
                  <Label className="text-sm">الصورة الرئيسية</Label>
                  <div className="flex gap-2 mt-1">
                    <Input 
                      value={form.image} 
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      className="flex-1"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => document.getElementById('main-image-upload')?.click()}
                      className="gap-2 whitespace-nowrap"
                    >
                      <Upload size={14} /> رفع
                    </Button>
                  </div>
                  <input
                    id="main-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const base64String = reader.result as string;
                          setForm({ ...form, image: base64String });
                          toast({ title: "تم رفع الصورة الرئيسية" });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                  {form.image && (
                    <div className="mt-2">
                      <img
                        src={resolveMediaUrl(form.image)}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = resolveMediaUrl();
                        }}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded border"
                      />
                    </div>
                  )}
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm">صور إضافية</Label>
                    <div className="flex gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={() => document.getElementById('image-upload')?.click()}
                        className="gap-2"
                      >
                        <Upload size={14} /> رفع من الجهاز
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={addImageUrl} 
                        className="gap-2"
                      >
                        <Plus size={14} /> إضافة رابط
                      </Button>
                    </div>
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  {form.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {form.images.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={resolveMediaUrl(img)}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = resolveMediaUrl();
                            }}
                            alt=""
                            className="w-full h-20 object-cover rounded border"
                          />
                          <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              type="button"
                              variant="secondary"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => setForm({ ...form, image: img })}
                              title="جعلها الصورة الرئيسية"
                            >
                              ⭐
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => removeImage(idx)}
                            >
                              <X size={12} />
                            </Button>
                          </div>
                          {form.image === img && (
                            <div className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded">
                              رئيسية
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    يمكنك رفع صور من جهازك أو إضافة روابط صور من الإنترنت. اضغط على ⭐ لجعل الصورة رئيسية.
                  </p>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-muted-foreground">المميزات والإعدادات</h3>
                <div>
                  <Label className="text-sm">المميزات (مفصولة بفاصلة)</Label>
                  <Textarea 
                    value={form.features} 
                    onChange={(e) => setForm({ ...form, features: e.target.value })}
                    placeholder="ميزة 1, ميزة 2, ميزة 3"
                    rows={2}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">مثال: LED, موفر للطاقة, ضمان سنتين</p>
                </div>
                
                <div>
                  <Label className="text-sm">Slug (اختياري)</Label>
                  <Input 
                    value={form.slug} 
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="product-slug"
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">سيتم إنشاؤه تلقائياً إذا تُرك فارغاً</p>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Switch 
                    checked={form.available} 
                    onCheckedChange={(v) => setForm({ ...form, available: v })}
                    id="available"
                  />
                  <Label htmlFor="available" className="cursor-pointer">
                    المنتج متاح للبيع
                  </Label>
                </div>
              </div>

              {/* SEO Metadata */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-muted-foreground">SEO - تحسين محركات البحث</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">Meta Title (English)</Label>
                    <Input 
                      value={form.meta_title} 
                      onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
                      placeholder="Product SEO Title"
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">60 حرف كحد أقصى</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm">Meta Title (عربي)</Label>
                    <Input 
                      value={form.meta_title_ar} 
                      onChange={(e) => setForm({ ...form, meta_title_ar: e.target.value })}
                      placeholder="عنوان SEO للمنتج"
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">60 حرف كحد أقصى</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">Meta Description (English)</Label>
                    <Textarea 
                      value={form.meta_description} 
                      onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
                      placeholder="Brief description for search engines..."
                      rows={2}
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">160 حرف كحد أقصى</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm">Meta Description (عربي)</Label>
                    <Textarea 
                      value={form.meta_description_ar} 
                      onChange={(e) => setForm({ ...form, meta_description_ar: e.target.value })}
                      placeholder="وصف مختصر لمحركات البحث..."
                      rows={2}
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">160 حرف كحد أقصى</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">Keywords (English)</Label>
                    <Input 
                      value={form.meta_keywords} 
                      onChange={(e) => setForm({ ...form, meta_keywords: e.target.value })}
                      placeholder="keyword1, keyword2, keyword3"
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">مفصولة بفاصلة</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm">Keywords (عربي)</Label>
                    <Input 
                      value={form.meta_keywords_ar} 
                      onChange={(e) => setForm({ ...form, meta_keywords_ar: e.target.value })}
                      placeholder="كلمة1, كلمة2, كلمة3"
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">مفصولة بفاصلة</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleSubmit} className="flex-1">
                  {editingProduct ? "تحديث المنتج" : "إضافة المنتج"}
                </Button>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  إلغاء
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={18} className="text-muted-foreground" />
          <h3 className="font-semibold">البحث والفلترة</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="ابحث عن منتج..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
          
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger>
              <SelectValue placeholder="كل الفئات" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الفئات</SelectItem>
              {categories.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.name_ar}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={filterBrand} onValueChange={setFilterBrand}>
            <SelectTrigger>
              <SelectValue placeholder="كل الماركات" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الماركات</SelectItem>
              {brands.map(b => (
                <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={filterAvailable} onValueChange={setFilterAvailable}>
            <SelectTrigger>
              <SelectValue placeholder="كل الحالات" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الحالات</SelectItem>
              <SelectItem value="available">متاح</SelectItem>
              <SelectItem value="unavailable">غير متاح</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {(searchQuery || filterCategory !== "all" || filterBrand !== "all" || filterAvailable !== "all") && (
          <div className="mt-3 flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setFilterCategory("all");
                setFilterBrand("all");
                setFilterAvailable("all");
              }}
            >
              <X size={14} className="ml-1" /> مسح الفلاتر
            </Button>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedProducts.size > 0 && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 flex items-center justify-between">
          <span className="text-sm font-medium">
            تم تحديد {selectedProducts.size} منتج
          </span>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={handleBulkDelete}
            className="gap-2"
          >
            <Trash2 size={14} /> حذف المحدد
          </Button>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-card rounded-lg border border-border overflow-x-auto" dir="rtl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-32 text-right">إجراءات</TableHead>
              <TableHead className="w-12 text-center">
                <Checkbox
                  checked={selectedProducts.size === paginatedProducts.length && paginatedProducts.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead className="min-w-[200px] text-right">المنتج</TableHead>
              <TableHead className="min-w-[130px] text-right">رمز المادة (SKU)</TableHead>
              <TableHead className="min-w-[120px] text-right">الفئة</TableHead>
              <TableHead className="min-w-[120px] text-right">الماركة</TableHead>
              <TableHead className="min-w-[100px] text-right">الحالة</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-16">
                  <div className="flex flex-col items-center gap-4">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="text-muted-foreground">جاري تحميل المنتجات...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  لا توجد منتجات
                </TableCell>
              </TableRow>
            ) : (
              paginatedProducts.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="flex gap-1 justify-start">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openEdit(p)}
                        title="تعديل"
                        className="h-8 px-3"
                      >
                        <Pencil size={14} className="ml-1" />
                        تعديل
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => confirmDelete(p.id)}
                        title="حذف"
                        className="h-8 px-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 size={14} className="ml-1" />
                        حذف
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox
                      checked={selectedProducts.has(p.id)}
                      onCheckedChange={() => toggleSelect(p.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img 
                        src={resolveMediaUrl(p.image)} 
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = resolveMediaUrl();
                        }}
                        alt={p.name_ar}
                        className="w-12 h-12 object-cover rounded border"
                      />
                      <div>
                        <p className="font-medium text-foreground">{p.name_ar}</p>
                        <p className="text-xs text-muted-foreground">{p.name}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-mono">
                    {p.sku ? (
                      <span className="bg-muted px-2 py-0.5 rounded text-xs tracking-wide">{p.sku}</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">
                    {categories.find(c => c.id === p.category_id)?.name_ar || "-"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {brands.find(b => b.id === p.brand_id)?.name || "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={p.available ? "default" : "secondary"}>
                      {p.available ? "متاح" : "غير متاح"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            صفحة {currentPage} من {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronRight size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronLeft size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DashboardProducts;
