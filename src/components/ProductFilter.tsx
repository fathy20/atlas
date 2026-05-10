import { useData } from "@/contexts/DataContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { resolveMediaUrl } from "@/lib/media";

interface ProductFilterProps {
  selectedCategory: string;
  setSelectedCategory: (v: string) => void;
  selectedBrand: string;
  setSelectedBrand: (v: string) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  showAvailableOnly: boolean;
  setShowAvailableOnly: (v: boolean) => void;
}

const ProductFilter = ({
  selectedCategory, setSelectedCategory,
  selectedBrand, setSelectedBrand,
  searchQuery, setSearchQuery,
  showAvailableOnly, setShowAvailableOnly,
}: ProductFilterProps) => {
  const { categories, brands } = useData();

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-sm font-medium mb-2 block">بحث</Label>
        <Input placeholder="ابحث عن منتج..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>

      <div>
        <Label className="text-sm font-medium mb-2 block">الفئة</Label>
        <Select value={selectedCategory} onValueChange={(v) => setSelectedCategory(v === "all" ? "" : v)}>
          <SelectTrigger><SelectValue placeholder="كل الفئات" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل الفئات</SelectItem>
            {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.icon} {c.name_ar}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-medium mb-2 block">الماركة</Label>
        <Select value={selectedBrand} onValueChange={(v) => setSelectedBrand(v === "all" ? "" : v)}>
          <SelectTrigger><SelectValue placeholder="كل الماركات" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل الماركات</SelectItem>
            {brands.map(b => (
              <SelectItem key={b.id} value={b.id}>
                <span className="flex items-center gap-2">
                  {b.logo && b.logo !== '/placeholder.svg' && (
                    <img
                      src={resolveMediaUrl(b.logo)}
                      alt={b.name}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                      className="w-5 h-5 object-contain"
                    />
                  )}
                  {b.name}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Switch checked={showAvailableOnly} onCheckedChange={setShowAvailableOnly} />
        <Label className="text-sm">المتاح فقط</Label>
      </div>
    </div>
  );
};

export default ProductFilter;
