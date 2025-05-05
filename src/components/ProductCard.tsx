
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { ShoppingCart, Eye, X } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const [showDialog, setShowDialog] = useState(false);

  return (
    <div className="group relative bg-white rounded-lg overflow-hidden border hover:shadow-md transition-all duration-300">
      <HoverCard openDelay={300} closeDelay={200}>
        <HoverCardTrigger asChild>
          <div className="aspect-square overflow-hidden cursor-pointer">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-80 p-0">
          <div className="p-4">
            <h3 className="font-medium text-base">{product.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{product.category}</p>
            <div className="flex justify-between items-center mt-2">
              <span className="font-bold">{formatCurrency(product.price)}</span>
              <span className="text-sm bg-secondary px-2 py-1 rounded">
                Stock: {product.stock}
              </span>
            </div>
            <p className="text-sm mt-2 line-clamp-2">{product.description}</p>
            <Button 
              className="w-full mt-3"
              variant="outline" 
              onClick={() => setShowDialog(true)}
            >
              View Details
            </Button>
          </div>
        </HoverCardContent>
      </HoverCard>
      
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="secondary" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
      </div> 
      
      {product.featured && (
        <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-medium py-1 px-2 rounded">
          Featured
        </span>
      )}
      
      {product.stock <= 3 && (
        <span className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-xs font-medium py-1 px-2 rounded">
          Low Stock
        </span>
      )}

      <div className="p-4">
        <h3 className="font-medium text-sm sm:text-base truncate">
          {product.name}</h3>        
        <div className="flex items-center justify-between mt-2">
          <span className="font-semibold">{formatCurrency(product.price)}</span>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span 
                key={i}
                className={`text-xs ${
                  i < Math.floor(product.rating) 
                    ? 'text-amber-500' 
                    : 'text-gray-300'
                }`}
              >
                ★
              </span>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">{product.name}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/2">
              <div className="aspect-square overflow-hidden rounded-md">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="md:w-1/2 space-y-4">
              <div>
                <h4 className="font-medium text-muted-foreground">{product.category}</h4>
                <div className="flex items-center gap-1 mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span 
                      key={i}
                      className={`text-sm ${
                        i < Math.floor(product.rating) 
                          ? 'text-amber-500' 
                          : 'text-gray-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                  <span className="text-sm ml-1">({product.rating})</span>
                </div>
              </div>
              
              <p className="text-2xl font-bold">{formatCurrency(product.price)}</p>
              
              <div className="py-2">
                <h4 className="font-medium mb-1">Description</h4>
                <p className="text-muted-foreground">{product.description}</p>
              </div>
              
              <div className="flex gap-2">
                <span className={`px-2 py-1 text-sm rounded ${
                  product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                </span>
                {product.featured && (
                  <span className="px-2 py-1 text-sm rounded bg-amber-100 text-amber-800">
                    Featured
                  </span>
                )}
              </div>
              
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductCard;
