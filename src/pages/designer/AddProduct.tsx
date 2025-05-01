
import { useState } from 'react';
import { addDoc, collection, getFirestore, } from 'firebase/firestore';
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/designer/Sidebar";
import { cn } from "@/lib/utils";
import DesignerHeader from "@/components/designer/DesignerHeader";
import ProductForm from "@/components/designer/ProductForm";
import { useNavigate } from "react-router-dom";
import { Product } from "@/types";
import { useToast} from "@/hooks/use-toast";
import { app } from '@/config/firebase';

const AddProduct = () => {
  const { designer } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const db = getFirestore(app);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleSaveProduct = async (productData: Partial<Product>) => {
        try {
      await addDoc(collection(db, 'products'), productData);
      toast({
        title: 'Product Added',
        description: 'Your product has been successfully added.',
      });
      navigate('/designer/products');
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add product. Please try again.',
      });
    }
  };

  return (
    <div className='flex h-screen bg-muted/30'>
      <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />

      <div
        className={cn(
          'flex-1 flex flex-col transition-all duration-300 ease-in-out'
        )}
      >
        <DesignerHeader collapsed={collapsed} />

        <main
          className={cn('flex-1 p-6 overflow-y-auto', collapsed ? 'ml-16' : 'ml-64', 'transition-all duration-300 ease-in-out')}
        >
          <div className='mb-8'>
            <h1 className='text-2xl font-bold mb-1'>Add New Product</h1>
            <p className='text-muted-foreground'>
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
