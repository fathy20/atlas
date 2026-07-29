import { useState, useMemo } from "react";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Search, Upload, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { DbBrand } from "@/contexts/DataContext";
import { resolveMediaUrl } from "@/lib/media";

const DashboardBrands = () => {
  const { brands, products, addBrand, updateBrand, deleteBrand } = useData();
  const { toast } = useToast();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<DbBrand | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<DbBrand | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [form, setForm] = useState({
    name: "",
    slug: "",
    logo: "",
  });

  const resetForm = () => {
    setForm({ name: "", slug: "", logo: "" });
    setEditingBrand(null);
  };

  const openEdit = (b: DbBrand) => {
    setEditingBrand(b);
    setForm({
      name: b.name,
      slug: b.slug,
      logo: b.logo || "",
    });
    setDialogOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, logo: reader.result as string }));
      toast({ title: "تم رفع الشعار بنجاح" });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast({ title: "خطأ", description: "يرجى كتابة اسم الماركة", variant: "destructive" });
      return;
    }

    const slug = form.slug.trim() || form.name.toLowerCase().replace(/\s+/g, "-");

    try {
      if (editingBrand) {
        await updateBrand(editingBrand.id, {
          name: form.name.trim(),
          slug,
          logo: form.logo.trim() || null,
        });
        toast({ title: "تم تحديث الماركة بنجاح" });
      } else {
        await addBrand({
          name: form.name.trim(),
          slug,
          logo: form.logo.trim() || null,
        });
        toast({ title: "تم إضافة الماركة بنجاح" });
      }
      resetForm();
      setDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء حفظ الماركة",
        variant: "destructive",
      });
    }
  };

  const confirmDelete = async () => {
    if (!brandToDelete) return;

    try {
      await deleteBrand(brandToDelete.id);
      toast({ title: "تم حذف الماركة بنجاح" });
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء حذف الماركة",
        variant: "destructive",
      });
    } finally {
      setBrandToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const filteredBrands = useMemo(() => {
    if (!searchQuery.trim()) return brands;
    const q = searchQuery.toLowerCase();
    return brands.filter((b) => b.name.toLowerCase().includes(q) || b.slug.toLowerCase().includes(q));
  }, [brands, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">إدارة الماركات التجاريّة</h1>
          <p className="text-sm text-muted-foreground mt-1">
            إضافة وتعديل العلامات التجارية والشعارات لعرضها في الموقع والمنتجات
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={(v) => { setDialogOpen(v); if (!v) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2 shrink-0">
              <Plus size={16} /> إضافة ماركة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingBrand ? "تعديل الماركة" : "إضافة ماركة جديدة"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label className="mb-1 block text-sm font-medium">اسم الماركة *</Label>
                <Input
                  placeholder="مثال: Legrand, Fanton, Gewiss"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div>
                <Label className="mb-1 block text-sm font-medium">المعرف / Slug (اختياري)</Label>
                <Input
                  placeholder="مثال: legrand"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                />
              </div>

              <div>
                <Label className="mb-1 block text-sm font-medium">صورة الشعار (Logo)</Label>
                
                {/* Logo Preview */}
                {form.logo && (
                  <div className="mb-3 flex items-center justify-center p-3 border border-border rounded-xl bg-muted/20 relative">
                    <img
                      src={resolveMediaUrl(form.logo)}
                      alt="Logo preview"
                      className="max-h-20 max-w-full object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      onClick={() => setForm({ ...form, logo: "" })}
                      className="absolute top-1 left-1 text-destructive text-xs"
                    >
                      إزالة
                    </Button>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Input
                    placeholder="رابط الصورة (URL) أو ارفع ملف..."
                    value={form.logo}
                    onChange={(e) => setForm({ ...form, logo: e.target.value })}
                    className="text-xs"
                  />
                  <label className="cursor-pointer inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm hover:bg-accent shrink-0">
                    <Upload size={16} className="ml-1" />
                    رفع
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <Button onClick={handleSubmit} className="w-full mt-2">
                {editingBrand ? "تحديث الماركة" : "إضافة الماركة"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative w-full">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            placeholder="بحث عن ماركة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-9"
          />
        </div>
      </div>

      {/* Brands Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">الشعار</TableHead>
              <TableHead>اسم الماركة</TableHead>
              <TableHead>المعرف (Slug)</TableHead>
              <TableHead>عدد المنتجات</TableHead>
              <TableHead className="w-24 text-left">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBrands.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  لا توجد ماركات تجارية مطابقة
                </TableCell>
              </TableRow>
            ) : (
              filteredBrands.map((b) => {
                const count = products.filter((p) => p.brand_id === b.id).length;

                return (
                  <TableRow key={b.id}>
                    <TableCell>
                      {b.logo && b.logo !== "/placeholder.svg" ? (
                        <div className="w-12 h-10 rounded-lg bg-muted/40 p-1 flex items-center justify-center border border-border/50">
                          <img
                            src={resolveMediaUrl(b.logo)}
                            alt={b.name}
                            className="max-h-full max-w-full object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-10 rounded-lg bg-muted/40 flex items-center justify-center text-muted-foreground">
                          <ImageIcon size={18} />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-bold text-foreground">{b.name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">{b.slug}</TableCell>
                    <TableCell>
                      <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        {count} منتج
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 justify-end">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(b)}>
                          <Pencil size={15} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => {
                            setBrandToDelete(b);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 size={15} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت تأكد من حذف هذه الماركة؟</AlertDialogTitle>
            <AlertDialogDescription>
              {brandToDelete && (
                <span>
                  سيتم حذف ماركة <strong>{brandToDelete.name}</strong> نهائياً.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              تأكيد الحذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DashboardBrands;
