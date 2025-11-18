import { useState, useEffect } from "react";
import { getRecentProducts, Product } from "@/lib/products";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertCircle } from "lucide-react";

interface RecentProductsProps {
  limit?: number;
  className?: string;
}

export default function RecentProducts({
  limit = 5,
  className = "",
}: RecentProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getRecentProducts(limit);
        setProducts(data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load products";
        setError(message);
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [limit, toast]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-8 ${className}`}>
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex items-start gap-3 p-4 bg-destructive/10 rounded-lg ${className}`}
      >
        <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-destructive">
            Error loading products
          </h3>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={`text-center py-8 text-muted-foreground ${className}`}>
        <p>No products available</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {products.map((product) => (
        <div
          key={product.id}
          className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
        >
          <div className="flex gap-4">
            {product.image_url && (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-20 h-20 object-cover rounded"
              />
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{product.name}</h3>
              {product.category && (
                <p className="text-xs text-muted-foreground capitalize">
                  {product.category}
                </p>
              )}
              {product.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {product.description}
                </p>
              )}
              <div className="flex items-center justify-between mt-2">
                {product.price && (
                  <p className="font-semibold text-primary">
                    KES {product.price.toLocaleString()}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {new Date(product.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
