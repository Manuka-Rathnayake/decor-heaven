import React, { useState } from 'react'; // Import 'React'
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/designer/Sidebar';import { cn } from '@/lib/utils';import DesignerHeader from '@/components/designer/DesignerHeader';import ProductForm from '@/components/designer/ProductForm';import { useNavigate } from 'react-router-dom';import { Product } from '@/types';import { useToast } from '@/hooks/use-toast';import { app } from '@/config/firebase';
const AddProduct: React.FC = () => { // Add type annotation for AddProduct
  const { designer } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const db = getFirestore(app);
  const storage = getStorage(app);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleSaveProduct = async (productData: Partial<Product> & { modelFile?: File[] }) => { // update the parameter
    const { id, modelFile = [], ...dataToSave } = productData; // Destructure id, modelFile, and the rest
    let modelUrl = '';


    // 1) Upload 3D model if provided
    if (modelFile.length > 0) {
      try {
           const file = modelFile[0];
            const storageRef = ref(storage, `models/products/${Date.now()}-${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
        modelUrl = await getDownloadURL(snapshot.ref);
      } catch (err) {
        console.error('Error uploading model file:', err);
        toast({
          variant: 'destructive',
          title: 'Upload Error',
          description: 'Failed to upload model file. Please try again.',
        });
        return; // stop if upload fails
      }
    }

    // 2) Save product to Firestore
    try {
      await addDoc(collection(db, 'products'), {
        ...dataToSave, // Spread only dataToSave (without id)
        modelUrl,
      });
      toast({
        title: 'Product Added',
        description: 'Your product has been successfully added.',
      });
    } catch (err) {
      console.error('Error adding product:', err);
      toast({
        variant: 'destructive',
        title: 'Save Error',
        description: 'Failed to save product. Please try again.',
      });
      return; // stop if save fails
    
    }

    // 3) Navigate back to products list
    navigate('/designer/products');
  };

  return (
    <div className="flex h-screen bg-muted/30">
      <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />

      <div
        className={cn(
          'flex-1 flex flex-col transition-all duration-300 ease-in-out'
        )}
      >
        <DesignerHeader collapsed={collapsed} />

        <main
          className={cn(
            'flex-1 p-6 overflow-y-auto',
            collapsed ? 'ml-16' : 'ml-64',
            'transition-all duration-300 ease-in-out'
          )}
        >
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-1">Add New Product</h1>
            <p className="text-muted-foreground">
              Create a new product with details and images
            </p>
          </div>

          <ProductForm
            onSave={handleSaveProduct}
            onCancel={() => navigate('/designer/products')}
          />
        </main>
      </div>
    </div>
  );
};

export default AddProduct;
