
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/designer/Sidebar";
import { cn } from "@/lib/utils";
import DesignerHeader from "@/components/designer/DesignerHeader";
import ProductManagement from "@/components/designer/ProductManagement";

const DesignerProducts = () => {
  const { designer } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
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
            <h1 className="text-2xl font-bold mb-1">Products Management</h1>
            <p className="text-muted-foreground">
              Add, edit, delete, and manage your furniture products
            </p>
          </div>
          
          <ProductManagement />
        </main>
      </div>
    </div>
  );
};

export default DesignerProducts;
