
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { categories, priceRanges, materialOptions, colorOptions } from "@/data/products";
import { FilterOptions } from "@/types";
import { X } from "lucide-react";

interface ProductFilterProps {
  onFilterChange: (filters: FilterOptions) => void;
  initialFilters?: FilterOptions;
}

const ProductFilter = ({ onFilterChange, initialFilters }: ProductFilterProps) => {
  const [filters, setFilters] = useState<FilterOptions>({
    category: initialFilters?.category || null,
    priceRange: initialFilters?.priceRange || [0, 2000],
    materials: initialFilters?.materials || [],
    colors: initialFilters?.colors || [],
    inStock: initialFilters?.inStock || true
  });

  // Update filters when props change
  useEffect(() => {
    if (initialFilters) {
      setFilters({
        ...filters,
        ...initialFilters
      });
    }
  }, [initialFilters]);

  const handleCategoryChange = (categoryId: string | null) => {
    setFilters({ ...filters, category: categoryId });
  };

  const handlePriceRangeChange = (values: number[]) => {
    setFilters({ ...filters, priceRange: [values[0], values[1]] });
  };

  const handleMaterialToggle = (material: string) => {
    const currentMaterials = filters.materials || [];
    const newMaterials = currentMaterials.includes(material)
      ? currentMaterials.filter(m => m !== material)
      : [...currentMaterials, material];
    
    setFilters({ ...filters, materials: newMaterials });
  };

  const handleColorToggle = (color: string) => {
    const currentColors = filters.colors || [];
    const newColors = currentColors.includes(color)
      ? currentColors.filter(c => c !== color)
      : [...currentColors, color];
    
    setFilters({ ...filters, colors: newColors });
  };

  const handleInStockToggle = () => {
    setFilters({ ...filters, inStock: !filters.inStock });
  };

  const clearAllFilters = () => {
    setFilters({
      category: null,
      priceRange: [0, 2000],
      materials: [],
      colors: [],
      inStock: true
    });
  };

  // Apply filters
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  // Check if any filters are active
  const hasActiveFilters = 
    filters.category !== null || 
    (filters.materials && filters.materials.length > 0) || 
    (filters.colors && filters.colors.length > 0) ||
    !filters.inStock;

  return (
    <div className="space-y-6 p-1">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-lg">Filters</h3>
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearAllFilters}
            className="h-8 text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <Accordion type="multiple" defaultValue={["category", "price", "material", "color", "availability"]}>
        <AccordionItem value="category">
          <AccordionTrigger>Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center">
                <Button 
                  variant={filters.category === null ? "secondary" : "ghost"}
                  size="sm"
                  className="text-xs w-full justify-start"
                  onClick={() => handleCategoryChange(null)}
                >
                  All Categories
                </Button>
              </div>
              
              {categories.map(category => (
                <div key={category.id} className="flex items-center">
                  <Button 
                    variant={filters.category === category.id ? "secondary" : "ghost"}
                    size="sm"
                    className="text-xs w-full justify-start"
                    onClick={() => handleCategoryChange(category.id)}
                  >
                    {category.name}
                  </Button>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="px-2 pt-4 pb-2">
              <Slider 
                defaultValue={[filters.priceRange?.[0] || 0, filters.priceRange?.[1] || 2000]} 
                max={2000} 
                step={50}
                onValueChange={handlePriceRangeChange}
              />
              <div className="flex justify-between mt-2 text-sm">
                <span>${filters.priceRange?.[0]}</span>
                <span>${filters.priceRange?.[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="material">
          <AccordionTrigger>Material</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {materialOptions.map(material => (
                <div key={material} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`material-${material}`} 
                    checked={filters.materials?.includes(material)}
                    onCheckedChange={() => handleMaterialToggle(material)}
                  />
                  <label 
                    htmlFor={`material-${material}`}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {material.charAt(0).toUpperCase() + material.slice(1)}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="color">
          <AccordionTrigger>Color</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {colorOptions.map(color => (
                <div key={color} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`color-${color}`} 
                    checked={filters.colors?.includes(color)}
                    onCheckedChange={() => handleColorToggle(color)}
                  />
                  <label 
                    htmlFor={`color-${color}`}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {color.charAt(0).toUpperCase() + color.slice(1)}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="availability">
          <AccordionTrigger>Availability</AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="in-stock" 
                checked={filters.inStock || false}
                onCheckedChange={handleInStockToggle}
              />
              <label 
                htmlFor="in-stock"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                In Stock Only
              </label>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ProductFilter;
