
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { getAllProducts } from "@/lib/firestore-api";
import ProductFilter from "@/components/ProductFilter";
import { Product, FilterOptions } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const ProductsPage = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);


  // Extract search parameters
  const searchTerm = searchParams.get("search") || "";
  const categoryParam = searchParams.get("category");

  // Initial filters based on URL params
  const initialFilters: FilterOptions = {
    category: categoryParam,
    priceRange: [0, 2000],
    materials: [],
    colors: [],
    inStock: true
  };

  const [sortBy, setSortBy] = useState<string>("featured");

  const handleSearch = (term: string) => {
    searchParams.set("search", term);
    setSearchParams(searchParams);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const products = await getAllProducts();
        setAllProducts(products);
        setFilteredProducts(products);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching products.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  const handleFilterChange = async (filters: FilterOptions) => {
    setLoading(true);
    setError(null);
    // Apply filters to products
    try{
    let result: Product[] = [...allProducts];
       if (searchTerm) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (filters.category) {
      result = result.filter((product) => product.category === filters.category);
    }

    // Filter by price range
    if (filters.priceRange) {
      result = result.filter(product => 
        product.price >= filters.priceRange[0] && 
        product.price <= filters.priceRange[1]
      );
    }

    // Filter by materials
    if (filters.materials && filters.materials.length > 0) {
      result = result.filter((product) =>
        product.materials?.some((material) =>
          filters.materials?.includes(material)
        )
      );
    }

    // Filter by colors
    if (filters.colors && filters.colors.length > 0) {
      result = result.filter((product) =>
        product.colors?.some((color) => filters.colors?.includes(color))
      );
    }
    // Filter by stock
    if (filters.inStock) {
      result = result.filter(product => product.stock > 0);
    }

    
    

    
    // Apply sorting
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        // In a real app, you'd sort by date
        result.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "featured":
      default:
        result.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
    }

    setFilteredProducts(result);
    }catch(err:any){
      setError(err.message || "An error occurred while fetching products.");
    }finally{setLoading(false);}
  };

  useEffect(() => {
    handleFilterChange(initialFilters);
  }, [searchParams]);

  // Apply sort when it changes
  useEffect(() => {
    handleFilterChange(initialFilters);
  }, [sortBy]);
  
  // Clear search
  const clearSearch = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("search");
    setSearchParams(newParams);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header onSearch={handleSearch} />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Shop Furnitur</h1>

            {/* Mobile filter button */}
            <div className="flex md:hidden">
              <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[80%] sm:w-[350px]">
                  <ProductFilter 
                    onFilterChange={handleFilterChange} 
                    initialFilters={initialFilters} 
                  />
                </SheetContent>
              </Sheet>
            </div>

            {/* Sort dropdown */}
            <div>
              <Select defaultValue={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="rating">Best Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Search results notification */}
          {searchTerm && (
            <div className="flex items-center mb-6 bg-secondary rounded-md p-2">
              <p className="text-sm">
                Showing results for: <span className="font-medium">{searchTerm}</span>
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearSearch} 
                className="ml-auto"
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </div>
          )}
          {error && <div className="text-red-500 mb-4">{error}</div>}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          )}
          
            <div className="flex flex-col md:flex-row gap-6">
            {/* Desktop Sidebar */}
            <div className="hidden md:block w-64 flex-shrink-0">
              <div className="sticky top-20">
                <ProductFilter
                  onFilterChange={handleFilterChange}
                  initialFilters={initialFilters}
                />              
              </div>
            </div>
            
            {/* Products Grid */}
            <div className="flex-1">
              {!loading && !error && filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <h3 className="text-lg font-medium">
                      No products found
                    </h3>
                    <p className="text-muted-foreground mt-1">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductsPage;
