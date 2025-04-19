
import { useState, useEffect } from "react";
import { Product } from "@/types";
import { products } from "@/data/products";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    // Get featured products or fallback to first 4 products
    const featured = products
      .filter(product => product.featured)
      .slice(0, 4);
    
    if (featured.length < 4) {
      const additional = products
        .filter(product => !product.featured)
        .slice(0, 4 - featured.length);
      
      setFeaturedProducts([...featured, ...additional]);
    } else {
      setFeaturedProducts(featured);
    }
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
