
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import LoginPage from "./pages/LoginPage";
import DesignerProducts from "./pages/designer/Products";
import Viewer3D from "./pages/designer/Viewer3D";
import AddProduct from "./pages/designer/AddProduct";
import EditProduct from "./pages/designer/EditProduct";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

// Private route wrapper to protect designer routes
const PrivateRoute = ({ element }: { element: React.ReactNode }) => {
  // Auth logic is handled within each page for this demo
  return <>{element}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              
              {/* Designer (Protected) Routes */}
              <Route path="/designer" element={<Navigate to="/designer/products" replace />} />
              <Route path="/designer/products" element={<PrivateRoute element={<DesignerProducts />} />} />
              <Route path="/designer/add-product" element={<PrivateRoute element={<AddProduct />} />} />
              <Route path="/designer/edit-product/:id" element={<PrivateRoute element={<EditProduct />} />} />
              <Route path="/designer/viewer" element={<PrivateRoute element={<Viewer3D />} />} />
              
              {/* Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
