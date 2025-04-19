
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/designer/Sidebar";
import { cn } from "@/lib/utils";
import DesignerHeader from "@/components/designer/DesignerHeader";
import ProductViewer3D from "@/components/designer/ProductViewer3D";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Viewer3D = () => {
  const { designer } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleModelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, this would upload to storage and get a URL
      setUploading(true);
      
      // Simulate upload delay
      setTimeout(() => {
        setUploading(false);
        setSelectedModel(URL.createObjectURL(file));
        toast({
          title: "Model Uploaded",
          description: `${file.name} has been uploaded successfully.`
        });
      }, 1500);
    }
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
        )}>
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-1">3D Model Viewer</h1>
            <p className="text-muted-foreground">
              View and interact with 3D furniture models
            </p>
          </div>
          
          <Tabs defaultValue="viewer" className="w-full">
            <TabsList>
              <TabsTrigger value="viewer">Model Viewer</TabsTrigger>
              <TabsTrigger value="upload">Upload Models</TabsTrigger>
            </TabsList>
            
            <TabsContent value="viewer" className="pt-4">
              <ProductViewer3D modelUrl={selectedModel} />
            </TabsContent>
            
            <TabsContent value="upload" className="pt-4">
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg border">
                  <h2 className="text-lg font-medium mb-4">Upload 3D Models</h2>
                  <p className="text-muted-foreground mb-6">
                    Upload 3D models in GLB, GLTF, or OBJ format to visualize your furniture products.
                  </p>
                  
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-10 text-center">
                    <input
                      type="file"
                      id="model-upload"
                      className="hidden"
                      accept=".glb,.gltf,.obj"
                      onChange={handleModelUpload}
                      disabled={uploading}
                    />
                    <label
                      htmlFor="model-upload"
                      className="cursor-pointer flex flex-col items-center justify-center"
                    >
                      <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-lg font-medium">Click to upload a 3D model</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        GLB, GLTF, OBJ up to 50MB
                      </p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        disabled={uploading}
                      >
                        {uploading ? "Uploading..." : "Select File"}
                      </Button>
                    </label>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="text-lg font-medium mb-4">Recently Uploaded Models</h3>
                  {selectedModel ? (
                    <div className="border rounded-md p-4 bg-muted/20">
                      <p className="font-medium">Uploaded Model</p>
                      <p className="text-sm text-muted-foreground">
                        Model is ready to view in the Model Viewer tab
                      </p>
                      <Button 
                        variant="link" 
                        className="p-0 h-auto"
                        onClick={() => document.querySelector('[data-value="viewer"]')?.dispatchEvent(new Event('click'))}
                      >
                        View Model
                      </Button>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No models have been uploaded yet.</p>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Viewer3D;
