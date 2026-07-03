import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { DbProduct } from "@/contexts/DataContext";
import { resolveMediaUrl } from "@/lib/media";
import { generateSeoSlug } from "@/lib/slug";

interface ProductCardProps {
  product: DbProduct;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const seoSlug = generateSeoSlug(product);
  
  return (
    <Link to={`/products/${seoSlug}`}>
      <Card className="overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full group">
        <div className="aspect-square bg-muted relative overflow-hidden">
          <img
            src={resolveMediaUrl(product.image)}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = resolveMediaUrl();
            }}
            alt={product.name_ar}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {!product.available && (
            <Badge variant="destructive" className="absolute top-2 right-2">غير متاح</Badge>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-foreground mb-1 line-clamp-1">{product.name_ar}</h3>
          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{product.description_ar}</p>
          <div className="flex items-center justify-end">
            <span className="text-xs text-muted-foreground">{product.name}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;
