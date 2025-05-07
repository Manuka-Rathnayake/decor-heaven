import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import FeaturedProducts from "@/components/FeaturedProducts";
import Categories from "@/components/Categories";

import Footer from "@/components/Footer";

const Index = () => {
  // We need to conditionally use useNavigate to avoid the error
  // when the component is rendered outside of Router context
  let navigate;
  try {
    navigate = useNavigate();
  } catch (error) {
    // If useNavigate fails, we'll create a fallback function
    navigate = (path: string) => {
      window.location.href = path;
    };
  }

  const { designer } = useAuth();

  const handleSearch = (term: string) => {
    if (typeof navigate === "function") {
      navigate(`/products?search=${term}`);
    }
  };

  const goToDashboard = () => {
    navigate("/designer/products");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header onSearch={handleSearch} />
      <main className="flex-1">     
        <HeroBanner />
        <Categories />
        <FeaturedProducts />

        <section className="py-12 bg-primary/5">
          <div className="container mx-auto px-4 text-center max-w-4xl"></div>
        </section>
      </main>
    </div>
  );
};

export default Index;
