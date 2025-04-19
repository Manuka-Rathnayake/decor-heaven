
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { SheetClose, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Link } from "react-router-dom";

const CartDrawer = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  
  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <SheetHeader className="mb-4">
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-medium">Your cart is empty</h3>
            <p className="text-muted-foreground mt-1">Add items to get started</p>
          </div>
          <SheetClose asChild>
            <Button className="mt-8" asChild>
              <Link to="/products">Continue Shopping</Link>
            </Button>
          </SheetClose>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <SheetHeader className="mb-4">
        <SheetTitle>Your Cart ({cartItems.length} items)</SheetTitle>
      </SheetHeader>
      
      <div className="flex-1 overflow-y-auto">
        {cartItems.map((item) => (
          <div 
            key={item.id} 
            className="flex py-4 border-b last:border-0"
          >
            <div className="w-20 h-20 rounded bg-secondary flex-shrink-0 overflow-hidden">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover" 
              />
            </div>
            
            <div className="ml-4 flex-1">
              <div className="flex justify-between">
                <h4 className="font-medium">{item.name}</h4>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6" 
                  onClick={() => removeFromCart(item.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground mt-1">
                {formatCurrency(item.price)}
              </p>
              
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center border rounded">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="px-2">
                    {item.quantity}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <p className="font-medium">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t py-4 mt-auto">
        <div className="flex justify-between mb-4">
          <span className="font-medium">Subtotal</span>
          <span className="font-medium">{formatCurrency(cartTotal)}</span>
        </div>
        <Button className="w-full mb-2">Proceed to Checkout</Button>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={clearCart}
        >
          Clear Cart
        </Button>
      </div>
    </div>
  );
};

export default CartDrawer;
