
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/designer/Sidebar";
import { cn } from "@/lib/utils";
import DesignerHeader from "@/components/designer/DesignerHeader";
import ProductForm from "@/components/designer/ProductForm";
import { useNavigate } from "react-router-dom";
import { Product } from "@/types";
import { useToast } from "@/hooks/use-toast";

const AddProduct = () => {
  const { designer } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleSaveProduct = (productData: Partial<Product>) => {
    // In a real app, this would save to a database
    toast({
      title: "Product Added",
      description: "Your product has been successfully added."
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
            <h1 className="text-2xl font-bold mb-1">Add New Product</h1>
            <p className="text-muted-foreground">
              Create a new product with details and images
            </p>
          </div>
          
          <ProductForm 
            onSave={handleSaveProduct}
            onCancel={() => navigate("/designer/products")}
          />
        </main>
      </div>
    </div>
  );
};

export default AddProduct;
