
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/designer/Sidebar";
import { cn } from "@/lib/utils";
import DesignerHeader from "@/components/designer/DesignerHeader";
import ProductForm from "@/components/designer/ProductForm";
import { useNavigate, useParams } from "react-router-dom";
import { Product } from "@/types";
import { products } from "@/data/products";
import { useToast } from "@/hooks/use-toast";

const EditProduct = () => {
  const { designer } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // In a real app, this would fetch from an API
    const foundProduct = products.find(p => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      navigate("/designer/products");
      toast({
        title: "Product Not Found",
        description: "The product you're trying to edit doesn't exist.",
        variant: "destructive"
      });
    }
  }, [id, navigate, toast]);
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleSaveProduct = (productData: Partial<Product>) => {
    // In a real app, this would update in a database
    toast({
      title: "Product Updated",
      description: "Your product has been successfully updated."
    });
    navigate("/designer/products");
  };

  return (
    <div className="flex h-screen bg-muted/30">
      <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />
      
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300 ease-in-out",
      )}>
        <DesignerHeader collapsed={collapsed} />
        
        <main className={cn(
          "flex-1 p-6 overflow-y-auto",
          collapsed ? "ml-16" : "ml-64",
          "transition-all duration-300 ease-in-out"
        )}>
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-1">Edit Product</h1>
            <p className="text-muted-foreground">
              Update product information and assets
            </p>
          </div>
          
          {product && (
            <ProductForm 
              initialValues={product}
              onSave={handleSaveProduct}
              onCancel={() => navigate("/designer/products")}
              isEditing={true}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default EditProduct;
