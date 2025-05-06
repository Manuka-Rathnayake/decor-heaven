
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
import AddProduct from "./pages/designer/AddProduct";
import EditProduct from "./pages/designer/EditProduct";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateDesigner from "./pages/designer/CreateDesigner";
import DesignerDashboard from "./pages/designer/Dashboard";
import Layout from "./pages/designer/Layout";
import Viewer3D from "./pages/designer/Viewer3D";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={<NotFound />} />
              
              {/* Designer (Protected) Routes */}
              <Route path="/designer/*" element={<ProtectedRoute />}>
                <Route path="" element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<DesignerDashboard />} />
                <Route path="products" element={<DesignerProducts />} />
                <Route path="add-product" element={<AddProduct />} />
                <Route path="edit-product/:id" element={<EditProduct />} />
                <Route path="create-designer" element={<CreateDesigner />} />
                <Route path="viewer" element={<Viewer3D/>} />
              </Route>
              {/* <Route
                path="/designer/create-designer"
                element={
                  <CreateDesigner />
                }
              /> */}
            </Routes>
            <Sonner />
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
