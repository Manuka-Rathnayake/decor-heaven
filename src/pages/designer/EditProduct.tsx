
import { useState, useEffect } from "react";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/designer/Sidebar";
import { cn } from "@/lib/utils";
import DesignerHeader from "@/components/designer/DesignerHeader";
import ProductForm from "@/components/designer/ProductForm";
import { useNavigate, useParams } from "react-router-dom";
import { Product } from "@/types";

import { useToast } from "@/hooks/use-toast"; import { app } from "@/config/firebase";

const EditProduct = () => {
  const { designer } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const db = getFirestore(app);
  const storage = getStorage(app);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const productRef = doc(db, "products", id);
        const productSnap = await getDoc(productRef);
        if (productSnap.exists()) {
          setProduct({ id: productSnap.id, ...productSnap.data() } as Product);
        } else {
          toast({
            title: "Product Not Found",
            description: "The product you're trying to edit doesn't exist.",
            variant: "destructive",
          });
          navigate("/designer/products");
        }
      } catch (error) {
         toast({
          description: "Failed to fetch product.",
        });
        console.error("Error fetching product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate, toast, db]);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

    const handleSaveProduct = async (productData: Partial<Product>) => {
        const { id: _, ...productDataWithoutId } = productData;

        // Handle model file upload if it exists
        let modelUrl = "";
        try {
            if (productData.modelFile) {
                const modelFile = productData.modelFile as unknown as File[];
                if (modelFile.length > 0) {
                    const file = modelFile[0];
                    const storageRef = ref(storage, `models/products/${Date.now()}-${file.name}`);
                    const snapshot = await uploadBytes(storageRef, file);
                    modelUrl = await getDownloadURL(snapshot.ref);
                }
            }
        } catch (error) {
            console.error('Error uploading model file:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to upload model file. Please try again.',
            });
        }
        try {
            await setDoc(doc(db, "products", id!), { ...productDataWithoutId, modelUrl });
            toast({ title: "Product Updated", description: "Your product has been successfully updated." });
            navigate("/designer/products");
        } catch (error) { console.error("Error saving product:", error); }
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
        )}
        >
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-1">Edit Product</h1>
            <p className="text-muted-foreground">
              Update product information and assets
            </p>
          </div>
          <div>
            {isLoading ? (
              <div>Loading...</div>
            ) : product ? (
              <ProductForm 
                initialValues={product}
                onSave={handleSaveProduct}
                onCancel={() => navigate("/designer/products")}
                isEditing={true}
              />
            ) : null}
          </div>
         
        </main>
      </div>
    </div>
  );
};

export default EditProduct;
