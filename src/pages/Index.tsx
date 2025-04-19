
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import FeaturedProducts from "@/components/FeaturedProducts";
import Categories from "@/components/Categories";
import Footer from "@/components/Footer";

const Index = () => {
  const navigate = useNavigate();
  
  const handleSearch = (term: string) => {
    navigate(`/products?search=${term}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header onSearch={handleSearch} />
      <main className="flex-1">
        <HeroBanner />
        <Categories />
        <FeaturedProducts />
        
        <section className="py-12 bg-primary/5">
          <div className="container mx-auto px-4 text-center max-w-4xl">
            <h2 className="text-2xl font-bold mb-4">Curated Designs for Every Space</h2>
            <p className="text-muted-foreground mb-6">
              We believe that well-designed furniture has the power to transform spaces and enhance your daily living experience. 
              Our collection is carefully curated to bring you pieces that combine style, comfort, and quality craftsmanship.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
