import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { DbCategory } from "@/contexts/DataContext";

const DashboardCategories = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useData();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<DbCategory | null>(null);
  const [form, setForm] = useState({ name: "", name_ar: "", icon: "📦", slug: "" });

  const resetForm = () => { setForm({ name: "", name_ar: "", icon: "📦", slug: "" }); setEditing(null); };

  const openEdit = (c: DbCategory) => {
    setEditing(c);
    setForm({ name: c.name, name_ar: c.name_ar, icon: c.icon, slug: c.slug });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.name_ar) {
      toast({ title: "خطأ", description: "يرجى ملء كل الحقول", variant: "destructive" });
      return;
    }
    const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, "-");
    if (editing) {
      await updateCategory(editing.id, { name: form.name, name_ar: form.name_ar, icon: form.icon, slug });
      toast({ title: "تم التحديث" });
    } else {
      await addCategory({ slug, name: form.name, name_ar: form.name_ar, icon: form.icon });
      toast({ title: "تم الإضافة" });
    }
    resetForm();
    setDialogOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-foreground">إدارة الفئات</h1>
        <Dialog open={dialogOpen} onOpenChange={(v) => { setDialogOpen(v); if (!v) resetForm(); }}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2"><Plus size={16} /> إضافة فئة</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "تعديل فئة" : "إضافة فئة جديدة"}</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <div><Label>الاسم (EN)</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label>الاسم (AR)</Label><Input value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} /></div>
              <div><Label>الأيقونة (Emoji)</Label><Input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} /></div>
              <Button onClick={handleSubmit} className="w-full">{editing ? "تحديث" : "إضافة"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الأيقونة</TableHead>
              <TableHead>الاسم (AR)</TableHead>
              <TableHead>الاسم (EN)</TableHead>
              <TableHead className="w-24">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="text-2xl">{c.icon}</TableCell>
                <TableCell className="font-medium">{c.name_ar}</TableCell>
                <TableCell className="text-muted-foreground">{c.name}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(c)}><Pencil size={14} /></Button>
                    <Button variant="ghost" size="icon" onClick={async () => { await deleteCategory(c.id); toast({ title: "تم الحذف" }); }}><Trash2 size={14} /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DashboardCategories;
