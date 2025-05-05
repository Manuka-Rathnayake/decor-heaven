
import { useState, useEffect } from "react";
import { Product } from "@/types";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getFeaturedProducts } from "@/lib/firestore-api";

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const products = await getFeaturedProducts();
        setFeaturedProducts(products);
      } catch (error: any) {
        setError(error.message || "An error occurred while fetching featured products.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <section className="py-12">
        <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Featured Products</h2>
                <Link to="/products">
          <Button variant="ghost" className="group">
            View all
            <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>

        </Link>
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
      {!loading && !error && (featuredProducts.length > 0 ?(
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
         ) : (
          <div className="flex flex-col items-center justify-center py-12">
                <h3 className="text-lg font-medium">No products found</h3>
                <p className="text-muted-foreground mt-1">
                  Try adding some products first
                </p>
              </div>
         ))}
    </div>
  </section>
  );
};

export default FeaturedProducts;
