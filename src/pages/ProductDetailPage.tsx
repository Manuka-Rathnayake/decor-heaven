
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { products } from "@/data/products";
import { Product } from "@/types";
import { ArrowLeft, Minus, Plus, ShoppingCart, Star } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import ProductCard from "@/components/ProductCard";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    const foundProduct = products.find(p => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      
      // Find related products (same category)
      const related = products
        .filter(p => p.id !== id && p.category === foundProduct.category)
        .slice(0, 4);
      setRelatedProducts(related);
    } else {
      navigate("/not-found");
    }
  }, [id, navigate]);
  
  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= (product?.stock || 1)) {
      setQuantity(value);
    }
  };
  
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };
  
  if (!product) {
    return null; // Could add a loading state here
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            className="mb-6" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Product Image */}
            <div className="bg-secondary/30 rounded-lg overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover aspect-square"
              />
            </div>
            
            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              
              <div className="flex items-center mt-2 mb-4">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? "text-amber-500 fill-amber-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-muted-foreground">
                  {product.rating} ({Math.floor(product.rating * 12)} reviews)
                </span>
              </div>
              
              <p className="text-2xl font-semibold mb-4">
                {formatCurrency(product.price)}
              </p>
              
              <div className="prose prose-sm mb-6 text-muted-foreground">
                <p>{product.description}</p>
              </div>
              
              <div className="space-y-4 mb-6">
                {/* Dimensions */}
                {product.dimensions && (
                  <div>
                    <h3 className="text-sm font-medium mb-1">Dimensions</h3>
                    <p className="text-sm text-muted-foreground">
                      {product.dimensions.width} × {product.dimensions.depth} × {product.dimensions.height} cm (W × D × H)
                    </p>
                  </div>
                )}
                
                {/* Materials */}
                {product.materials && product.materials.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-1">Materials</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.materials.map((material) => (
                        <span 
                          key={material}
                          className="text-xs px-2 py-1 bg-secondary rounded"
                        >
                          {material.charAt(0).toUpperCase() + material.slice(1)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Colors */}
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-1">Colors</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color) => (
                        <span 
                          key={color}
                          className="text-xs px-2 py-1 bg-secondary rounded"
                        >
                          {color.charAt(0).toUpperCase() + color.slice(1)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Stock */}
                <div>
                  <h3 className="text-sm font-medium mb-1">Availability</h3>
                  <p className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock > 0 
                      ? `In Stock (${product.stock} available)` 
                      : 'Out of Stock'}
                  </p>
                </div>
              </div>
              
              {/* Quantity Selector */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center border rounded">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10" 
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 w-12 text-center">
                    {quantity}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10" 
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">
                  {formatCurrency(product.price * quantity)}
                </span>
              </div>
              
              <Button 
                className="w-full" 
                size="lg"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>
          </div>
          
          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {relatedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
