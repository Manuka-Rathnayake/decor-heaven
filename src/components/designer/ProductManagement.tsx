
import { useState, useEffect } from "react";
import { collection, getDocs, getFirestore, doc, deleteDoc } from "firebase/firestore";
import { Edit, Trash2, Plus, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import ProductSearch from "./ProductSearch";
import { Product } from "@/types";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,


  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { app } from "@/config/firebase";

const ProductManagement = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDialog, setShowDialog] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const db = getFirestore(app);

    const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCol = collection(db, 'products');
        const productSnapshot = await getDocs(productsCol);
        setProducts(productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[]);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleDeleteConfirmation = (id: string) => {
    setProductToDelete(id);
  }

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      const productRef = doc(db, "products", id);
      await deleteDoc(productRef);

      // Update UI after successful deletion
      setProducts(products.filter(product => product.id !== id));

      toast({
        title: "Product Deleted",
        description: "Product has been removed successfully."
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        variant: "destructive",
        title: "Error Deleting Product",
        description: "There was an error deleting the product. Please try again.",
      });
    } finally {
      setIsDeleting(false);
      setProductToDelete(null); // Close the dialog
    }
  };

  


  return (
    <div className="w-full">
      <ProductSearch onSearch={handleSearch} />
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Product Management</h2>
        <Button onClick={() => navigate('/designer/add-product')}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Product
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {filteredProducts.map(product => (
          <Card key={product.id} className="overflow-hidden">
            <div className="flex relative">
              <HoverCard openDelay={300} closeDelay={200}>
                <HoverCardTrigger asChild>
                  <div className="w-24 h-24 md:w-32 md:h-32 relative cursor-pointer">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80 p-0">
                  <div className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="w-full md:w-1/3">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-32 object-cover rounded-md" 
                        />
                      </div>
                      <div className="w-full md:w-2/3 space-y-2">
                        <h3 className="font-semibold text-lg">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
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
                          <span className="text-xs ml-1">({product.rating})</span>
                        </div>
                        <p className="font-bold">{formatCurrency(product.price)}</p>
                        <div className="flex gap-2">
                          <span className={`px-2 py-1 text-xs rounded ${
                            product.stock > 3 ? 'bg-green-100 text-green-800' : 
                            product.stock > 0 ? 'bg-amber-100 text-amber-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {product.stock > 3 ? `In Stock (${product.stock})` : 
                             product.stock > 0 ? `Low Stock (${product.stock})` : 
                             'Out of Stock'}
                          </span>
                          {product.featured && (
                            <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <h4 className="font-medium text-sm mb-1">Description</h4>
                      <p className="text-sm text-muted-foreground">{product.description}</p>
                    </div>
                    <Button 
                      className="w-full mt-3"
                      variant="outline" 
                      onClick={() => setShowDialog(product.id)}
                    >
                      View Full Details
                    </Button>
                  </div>
                </HoverCardContent>
              </HoverCard>
              
              <CardContent className="flex-1 p-4">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                    <p className="font-medium">${product.price}</p>
                    <p className="text-sm">Stock: {product.stock}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => setShowDialog(product.id)}
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => navigate(`/designer/edit-product/${product.id}`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Dialog open={productToDelete === product.id} onOpenChange={(open) => !open && setProductToDelete(null)}>
                     <DialogTrigger asChild>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteConfirmation(product.id)}>
                       <Trash2 className="h-4 w-4" />
                      </Button>
                     </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>This action cannot be undone.</DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="sm:justify-end">
                        <Button type="button" variant="secondary" onClick={() => setProductToDelete(null)}>Cancel</Button>
                        <Button type="button" variant="destructive" onClick={() => handleDelete(product.id)} disabled={isDeleting}>
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  </div>
                </div>
              </CardContent>            </div>
          </Card>
        ))}
      </div>
      
      {/* Detailed view dialog */}
      {showDialog && (
        <Dialog open={!!showDialog} onOpenChange={() => setShowDialog(null)}>
          <DialogContent className="max-w-2xl">
            {(() => {
              const product = products.find(p => p.id === showDialog);
              if (!product) return null;
              
              return (
                <>
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
                          product.stock > 3 ? 'bg-green-100 text-green-800' : 
                          product.stock > 0 ? 'bg-amber-100 text-amber-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {product.stock > 3 ? `In Stock (${product.stock})` : 
                           product.stock > 0 ? `Low Stock (${product.stock})` : 
                           'Out of Stock'}
                        </span>
                        {product.featured && (
                          <span className="px-2 py-1 text-sm rounded bg-blue-100 text-blue-800">
                            Featured
                          </span>
                        )}
                      </div>
                      
                      {product.colors && product.colors.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-1">Available Colors</h4>
                          <div className="flex gap-2">
                            {product.colors.map((color, idx) => (
                              <div 
                                key={idx} 
                                className="w-6 h-6 rounded-full border" 
                                style={{backgroundColor: color}}
                                title={color}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {product.materials && product.materials.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-1">Materials</h4>
                          <div className="flex gap-2 flex-wrap">
                            {product.materials.map((material, idx) => (
                              <span 
                                key={idx} 
                                className="px-2 py-1 text-xs rounded bg-secondary"
                              >
                                {material}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {product.dimensions && (
                        <div>
                          <h4 className="font-medium mb-1">Dimensions</h4>
                          <p className="text-sm">
                            W: {product.dimensions.width}cm × 
                            H: {product.dimensions.height}cm × 
                            L: {product.dimensions.depth}cm
                          </p>
                        </div>
                      )}
                      
                      <div className="pt-4 space-x-2">
                        <Button variant="outline" onClick={() => setShowDialog(null)}>
                          Close
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setShowDialog(null);
                            navigate(`/designer/edit-product/${product.id}`);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Product
                        </Button>
                      </div>                    <Dialog open={productToDelete === product.id} onOpenChange={(open) => !open && setProductToDelete(null)}>                    <DialogContent>                    <DialogHeader>                    <DialogTitle>Are you sure?</DialogTitle>                        <DialogDescription>This action cannot be undone.</DialogDescription>                    </DialogHeader>                        <DialogFooter className="sm:justify-end">                         <Button type="button" variant="secondary" onClick={() => setProductToDelete(null)} >Cancel</Button>                         <Button type="button" variant="destructive" onClick={() => handleDelete(product.id)} disabled={isDeleting}>                            Delete                         </Button>                       </DialogFooter>                     </DialogContent>                    </Dialog>
                    </div>
                  </div>
                </>
              );
            })()}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ProductManagement;
