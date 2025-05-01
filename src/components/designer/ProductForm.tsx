
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input, InputProps } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Check, ImagePlus, Plus, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  categories, 
  materialOptions, 
  colorOptions 
} from "@/data/products";
import { Product } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { productSchema, ProductFormValues } from "@/schemas/product-schema";
import { Badge } from "@/components/ui/badge";

interface ProductFormProps {
  onSave: (product: Partial<Product> & { id?: string }) => Promise<void>;
  onCancel: () => void;
  initialValues?: Product;
  isEditing?: boolean;
}

const ProductForm = ({
  onSave,
  onCancel,
  initialValues = {},
  isEditing = false,
}: ProductFormProps) => {  
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(initialValues.image || null);
  const [modelFileName, setModelFileName] = useState<string | null>(initialValues.modelFile || null);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Add isLoading state
  
  // States for color and material selection
  const [selectedColor, setSelectedColor] = useState<string>("");  
  const [selectedMaterial, setSelectedMaterial] = useState<string>("");  

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialValues?.name || "",
      description: initialValues?.description || "",
      price: initialValues?.price || 0,
      stock: initialValues?.stock || 0,
      category: initialValues?.category || "",

      image: initialValues?.image || "",
      colors: initialValues?.colors || [],
      materials: initialValues?.materials || [],

      image: initialValues.image || "",
      colors: initialValues.colors || [],
      materials: initialValues.materials || [],
      modelFile: initialValues.modelFile || "",
      dimensions: {
        width: initialValues.dimensions?.width || 0,
        height: initialValues.dimensions?.height || 0,
        depth: initialValues.dimensions?.depth || 0
      }
    }

  });
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        form.setValue("image", result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const addColor = () => {
    if (selectedColor && !form.getValues().colors?.includes(selectedColor)) {
      const currentColors = form.getValues().colors || [];
      form.setValue("colors", [...currentColors, selectedColor]);
      setSelectedColor("");
    }
  };
  
  const removeColor = (color: string) => {
    const currentColors = form.getValues().colors || [];
    form.setValue("colors", currentColors.filter(c => c !== color));
  };
  
  const addMaterial = () => {
    if (selectedMaterial && !form.getValues().materials?.includes(selectedMaterial)) {
      const currentMaterials = form.getValues().materials || [];
      form.setValue("materials", [...currentMaterials, selectedMaterial]);
      setSelectedMaterial("");
    }
  };
  
  const removeMaterial = (material: string) => {
    const currentMaterials = form.getValues().materials || [];
    form.setValue("materials", currentMaterials.filter(m => m !== material));
  };
  
  const handleFormSubmit = async (values: ProductFormValues) => {
    console.log("handleFormSubmit called");
    setIsLoading(true); // Set isLoading to true at the start
    
    const file = form.getValues("modelFile")?.[0];
    const productData: Partial<Product> & { id?: string } & { modelFile?: File[] }= {
      ...(initialValues || {}),
      id: initialValues?.id,      
      ...values,
      // Convert values to appropriate types and ensure dimensions has required properties
      price: Number(values.price),
      stock: Number(values.stock),
      dimensions: values.dimensions && {
        width: Number(values.dimensions.width),
        height: Number(values.dimensions.height),
        depth: Number(values.dimensions.depth)
      }
    };
    
    if (file) {      
      productData.modelFile = [file];
    } else {      
      productData.modelFile = [];
    }    

    try {
      await onSave(productData);
      toast({
        title: isEditing ? "Product Updated" : "Product Added",
        description: isEditing 
          ? "Product details have been updated successfully." 
          : "New product has been added successfully."
      });
    } finally {
      setIsLoading(false); // Set isLoading back to false after submission (success or failure)
    }

  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Product" : "Add New Product"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image Upload */}
              <div className="md:row-span-3 flex flex-col items-center justify-center border-2 border-dashed border-input rounded-md p-4 h-full">
                {imagePreview ? (
                  <div className="relative w-full h-48 mb-4">
                    <img 
                      src={imagePreview} 
                      alt="Product preview" 
                      className="w-full h-full object-contain"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setImagePreview(null);
                        form.setValue("image", "");
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center w-full h-48 mb-4 bg-muted/30 text-muted-foreground">
                    <ImagePlus className="h-12 w-12 mb-2" />
                    <p>Upload Product Image</p>
                  </div>
                )}
                
                <div className="w-full">
                  <label 
                    htmlFor="image-upload"
                    className="block w-full text-center cursor-pointer py-2 px-4 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
                  >
                    {imagePreview ? "Replace Image" : "Select Image"}
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Supported formats: JPG, PNG, GIF. Max size: 5MB
                  </p>
                  {form.formState.errors.image && (
                    <p className="text-sm text-destructive text-center mt-2">
                      {form.formState.errors.image.message}
                    </p>
                  )}
                </div>
              </div>
              {/* Model file */}
              <div className="md:col-span-1 space-y-4">
                <FormLabel>3D Model</FormLabel>

                <FormField
                control={form.control}
                name="modelFile"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".glb, .gltf, .obj"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            field.onChange([file]);
                            setModelFileName(file.name);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                    {modelFileName ? (
                      <p className="text-muted-foreground text-xs">{modelFileName}</p>
                    ) : null}
                  </FormItem>
                )}
                />
              </div>
              
              {/* Basic Details */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter product name" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category *</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          min="0"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Additional Fields */}
              <div className="md:col-span-2 space-y-6">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter product description"
                          rows={4}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Colors section */}
                <div className="space-y-3">
                  <FormLabel>Available Colors</FormLabel>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {form.watch("colors")?.map((color) => (
                      <Badge 
                        key={color} 
                        className="flex items-center gap-1 px-3"
                        variant="secondary"
                      >
                        <span 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: color }}
                        ></span>
                        {color}
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          className="h-4 w-4 ml-1 hover:bg-transparent"
                          onClick={() => removeColor(color)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Select 
                      value={selectedColor} 
                      onValueChange={setSelectedColor}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent>
                        {colorOptions.map((color) => (
                          <SelectItem key={color} value={color}>
                            <div className="flex items-center gap-2">
                              <span 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: color }}
                              ></span>
                              {color}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      type="button" 
                      onClick={addColor} 
                      disabled={!selectedColor} 
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>
                </div>
                
                {/* Materials section */}
                <div className="space-y-3">
                  <FormLabel>Materials</FormLabel>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {form.watch("materials")?.map((material) => (
                      <Badge 
                        key={material}
                        className="flex items-center gap-1 px-3"
                        variant="outline"
                      >
                        {material}
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          className="h-4 w-4 ml-1 hover:bg-transparent"
                          onClick={() => removeMaterial(material)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Select 
                      value={selectedMaterial} 
                      onValueChange={setSelectedMaterial}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select material" />
                      </SelectTrigger>
                      <SelectContent>
                        {materialOptions.map((material) => (
                          <SelectItem key={material} value={material}>
                            {material}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      type="button" 
                      onClick={addMaterial} 
                      disabled={!selectedMaterial}
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>
                </div>
                
                {/* Dimensions */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Dimensions</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="dimensions.width"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Width (cm)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              min="0"
                              placeholder="0"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="dimensions.height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Height (cm)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              min="0"
                              placeholder="0"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="dimensions.depth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Length (cm)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              min="0"
                              placeholder="0"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                <Check className="mr-2 h-4 w-4" />
                )}
                {isEditing ? "Update Product" : "Save Product"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProductForm;
