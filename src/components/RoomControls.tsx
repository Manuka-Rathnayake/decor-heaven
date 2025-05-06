import { useState } from "react";
import * as THREE from 'three';
import { Button } from "@/components/ui/button";
import { useRoomStore, FurnitureItem } from "@/store/roomStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RoomForm from "@/components/forms/RoomForm";
import FurniturePanel from "@/components/FurniturePanel";
import { Paintbrush, Save, Trash2, Ruler, Eye, Download, Move3d } from "lucide-react";
import { furnitureModels, getFurnitureById } from "@/models/furniture";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
// Remove GLTF exporter as we're using dynamic import for OBJ exporter
import { ScrollArea } from "@/components/ui/scroll-area";


const RoomControls = () => {
  const { 
    activeDesign, 
    selectedFurniture,
    designs,
    viewMode,
    setViewMode,
    updateFurniture,
    removeFurniture,
    setActiveDesign,
    deleteDesign,
    setSelectedFurniture
  } = useRoomStore();
  
  const { toast } = useToast();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  
  const selectedItem = activeDesign?.furniture.find(item => item.id === selectedFurniture);
  const furnitureModelData = selectedItem ? getFurnitureById(selectedItem.type) : undefined;
  
  const handleFurnitureColorChange = (color: string) => {
    if (!selectedFurniture) return;
    updateFurniture(selectedFurniture, { color });
  };
  
  const handlePositionChange = (axis: 'x' | 'y' | 'z', value: number) => {
    if (!selectedItem) return;
    const newPosition = [...selectedItem.position] as [number, number, number];
    const index = axis === 'x' ? 0 : axis === 'y' ? 1 : 2;
    newPosition[index] = value;
    updateFurniture(selectedItem.id, { position: newPosition });
  };
  
  const handleRotationChange = (axis: 'x' | 'y' | 'z', value: number) => {
    if (!selectedItem) return;
    const newRotation = [...selectedItem.rotation] as [number, number, number];
    const index = axis === 'x' ? 0 : axis === 'y' ? 1 : 2;
    newRotation[index] = value;
    updateFurniture(selectedItem.id, { rotation: newRotation });
  };
  
  const handleScaleChange = (axis: 'x' | 'y' | 'z', value: number) => {
    if (!selectedItem) return;
    
    // Ensure value is positive and reasonable
    const safeValue = Math.max(0.1, Math.min(10, value));
    
    const newScale = [...selectedItem.scale] as [number, number, number];
    const index = axis === 'x' ? 0 : axis === 'y' ? 1 : 2;
    newScale[index] = safeValue;
    
    console.log(`Scaling ${furnitureModelData?.name || "item"}, ${axis} axis to ${safeValue}`);
    
    // Update the store with the new scale
    updateFurniture(selectedItem.id, { 
      scale: newScale,
      // Add a timestamp to ensure the component re-renders
      _lastUpdated: Date.now() 
    });
  };
  
  const handleDeleteFurniture = () => {
    if (!selectedFurniture) return;
    
    removeFurniture(selectedFurniture);
    toast({
      title: "Item removed",
      description: "Furniture item removed from design",
    });
  };
  
  const handleDeleteDesign = () => {
    if (!activeDesign) return;
    
    deleteDesign(activeDesign.id);
    setConfirmDeleteOpen(false);
    
    toast({
      title: "Design deleted",
      description: `"${activeDesign.name}" has been deleted`,
    });
  };

  const handleExportDesign = () => {
    if (!activeDesign) return;
    
    const designData = JSON.stringify(activeDesign, null, 2);
    const blob = new Blob([designData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeDesign.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Design exported",
      description: "Room configuration saved as JSON file",
    });
  };
  
  // Function to handle exporting the 3D model
  const handleExport3DModel = () => {
    if (!activeDesign) return;
    
    // Use dynamic import for OBJExporter
    import('three/examples/jsm/exporters/OBJExporter.js').then((module) => {
      const OBJExporter = module.OBJExporter;
      
      try {
        // Define a window global function to access the scene from Room3D component
        // This avoids TypeScript issues with accessing custom properties on DOM elements
        const scene = (window as any).__ROOM3D_SCENE__;
        
        if (!scene) {
          toast({
            title: "Export failed",
            description: "Could not access the 3D scene. Please make sure you're in 3D view",
            variant: "destructive",
          });
          return;
        }
        
        // Export the scene
        const exporter = new OBJExporter();
        const result = exporter.parse(scene);
        
        // Create blob and download
        const blob = new Blob([result], { type: 'text/plain' });
        const link = document.createElement('a');
        link.style.display = 'none';
        document.body.appendChild(link);
        link.href = URL.createObjectURL(blob);
        link.download = `${activeDesign.name || 'room-design'}.obj`;
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: "3D model exported",
          description: "Model saved as OBJ file",
        });
        
      } catch (error: any) {
        console.error("Export error:", error);
        toast({
          title: "Export failed",
          description: error.message || "Error accessing the 3D scene",
          variant: "destructive",
        });
      }
    }).catch(error => {
      console.error("Failed to load OBJExporter:", error);
      toast({
        title: "Export failed",
        description: "Failed to load export module",
        variant: "destructive",
      });
    });
  };
  
  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-[#FEF7CD]/50 to-white">
      <div className="flex justify-between items-center p-4 border-b border-[#FEF7CD]/70 flex-wrap gap-2">
        <div>
          <h2 className="font-semibold text-neutral-900">
            {activeDesign ? activeDesign.name : "No design selected"}
          </h2>
          {activeDesign && (
            <p className="text-sm text-neutral-600">
              {activeDesign.length}m × {activeDesign.width}m × {activeDesign.height}m
            </p>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setViewMode(viewMode === '2d' ? '3d' : '2d')}
            className="border-[#FEF7CD] bg-[#FEF7CD] hover:bg-[#FEF0A0] text-neutral-800"
          >
            <Eye className="h-4 w-4 mr-2" />
            View {viewMode === '2d' ? '3D' : '2D'}
          </Button>
          
          {activeDesign && (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setEditDialogOpen(true)}
                className="border-[#FEF7CD] bg-[#FEF7CD] hover:bg-[#FEF0A0] text-neutral-800"
              >
                <Paintbrush className="h-4 w-4 mr-2" />
                Edit
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExportDesign}
                className="border-[#FEF7CD] bg-[#FEF7CD] hover:bg-[#FEF0A0] text-neutral-800"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExport3DModel}
                className="border-[#FEF7CD] bg-[#FEF7CD] hover:bg-[#FEF0A0] text-neutral-800"
              >
                <Move3d className="h-4 w-4 mr-2" />
                Export 3D
              </Button>
              
              <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Design</DialogTitle>
                  </DialogHeader>
                  
                  <div className="py-4">
                    <p>Are you sure you want to delete "{activeDesign.name}"?</p>
                    <p className="text-sm text-muted-foreground mt-2">This action cannot be undone.</p>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setConfirmDeleteOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDeleteDesign}>
                      Delete
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>
      
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Room</DialogTitle>
          </DialogHeader>
          
          <RoomForm 
            existingDesign={activeDesign || undefined}
            onComplete={() => setEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      <Tabs defaultValue="designs" className="flex-1 flex flex-col">
        <TabsList className="flex w-full rounded-none border-b bg-[#FEF7CD]/30 overflow-x-auto">
          <TabsTrigger 
            value="designs" 
            className="flex-1 min-w-[100px] data-[state=active]:bg-[#FEF7CD] data-[state=active]:text-neutral-900"
          >
            Designs
          </TabsTrigger>
          <TabsTrigger 
            value="furniture" 
            className="flex-1 min-w-[100px] data-[state=active]:bg-[#FEF7CD] data-[state=active]:text-neutral-900"
          >
            Furniture
          </TabsTrigger>
          {selectedFurniture && (
            <TabsTrigger 
              value="edit" 
              className="flex-1 min-w-[100px] data-[state=active]:bg-[#FEF7CD] data-[state=active]:text-neutral-900"
            >
              Properties
            </TabsTrigger>
          )}
        </TabsList>
        
        <ScrollArea className="flex-1">
          <TabsContent value="designs" className="flex-1 p-0 m-0">
            <Dialog>
              <div className="p-4 space-y-4">
                <DialogTrigger asChild>
                  <Button className="w-full bg-[#FEF7CD] hover:bg-[#FEF0A0] text-neutral-900">
                    Create New Design
                  </Button>
                </DialogTrigger>
                
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Create New Room</DialogTitle>
                  </DialogHeader>
                  
                  <RoomForm />
                </DialogContent>
              </div>
              
              {designs.length > 0 ? (
                <div className="grid grid-cols-1 gap-2 p-4">
                  <h3 className="text-sm font-medium mb-2 text-neutral-800">Saved Designs</h3>
                  {designs.map((design) => (
                    <Button
                      key={design.id}
                      variant={activeDesign?.id === design.id ? "default" : "outline"}
                      className={cn(
                        "justify-start text-left h-auto py-3 px-4",
                        activeDesign?.id === design.id 
                          ? "bg-[#FEF7CD] hover:bg-[#FEF0A0] text-neutral-900" 
                          : "border-[#FEF7CD]/70 hover:bg-[#FEF7CD]/30"
                      )}
                      onClick={() => {
                        setActiveDesign(design.id);
                        setSelectedFurniture(null);
                      }}
                    >
                      <div className="mr-2 w-4 h-4 rounded-full" style={{ backgroundColor: design.wallColor }}></div>
                      <div>
                        <div className="font-medium">{design.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {design.shape} · {design.length}m × {design.width}m
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-neutral-500">
                  <p>No saved designs</p>
                </div>
              )}
            </Dialog>
          </TabsContent>
          
          <TabsContent value="furniture" className="flex-1 p-0 m-0">
            <FurniturePanel />
          </TabsContent>
          
          <TabsContent value="edit" className="flex-1 p-4 space-y-4 m-0">
            {selectedItem ? (
              <>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-neutral-800">{furnitureModelData?.name || "Item"}</h3>
                    <Button variant="destructive" size="sm" onClick={handleDeleteFurniture}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Separator className="bg-[#FEF7CD]/70" />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-neutral-700">Color</Label>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 border rounded" style={{ backgroundColor: selectedItem.color }}></div>
                    <Input
                      type="color"
                      value={selectedItem.color}
                      onChange={(e) => handleFurnitureColorChange(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="mb-2 block text-neutral-700">Position</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs text-neutral-600">X (left/right)</Label>
                      <Input
                        type="number"
                        value={selectedItem.position[0].toFixed(2)}
                        onChange={(e) => handlePositionChange('x', Number(e.target.value))}
                        step="0.1"
                        className="border-[#FEF7CD]/70 focus:border-[#FEF7CD]"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-neutral-600">Y (up/down)</Label>
                      <Input
                        type="number"
                        value={selectedItem.position[1].toFixed(2)}
                        onChange={(e) => handlePositionChange('y', Number(e.target.value))}
                        step="0.1"
                        className="border-[#FEF7CD]/70 focus:border-[#FEF7CD]"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-neutral-600">Z (front/back)</Label>
                      <Input
                        type="number"
                        value={selectedItem.position[2].toFixed(2)}
                        onChange={(e) => handlePositionChange('z', Number(e.target.value))}
                        step="0.1"
                        className="border-[#FEF7CD]/70 focus:border-[#FEF7CD]"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label className="mb-2 block text-neutral-700">Rotation</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs text-neutral-600">X</Label>
                      <Input
                        type="range"
                        min="-3.14"
                        max="3.14"
                        step="0.01"
                        value={selectedItem.rotation[0]}
                        onChange={(e) => handleRotationChange('x', Number(e.target.value))}
                        className="accent-[#FEF0A0]"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-neutral-600">Y</Label>
                      <Input
                        type="range"
                        min="-3.14"
                        max="3.14"
                        step="0.01"
                        value={selectedItem.rotation[1]}
                        onChange={(e) => handleRotationChange('y', Number(e.target.value))}
                        className="accent-[#FEF0A0]"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-neutral-600">Z</Label>
                      <Input
                        type="range"
                        min="-3.14"
                        max="3.14"
                        step="0.01"
                        value={selectedItem.rotation[2]}
                        onChange={(e) => handleRotationChange('z', Number(e.target.value))}
                        className="accent-[#FEF0A0]"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label className="mb-2 block text-neutral-700">Scale</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs text-neutral-600">X</Label>
                      <Input
                        type="number"
                        min="0.1"
                        max="5"
                        step="0.1"
                        value={selectedItem.scale[0].toFixed(1)}
                        onChange={(e) => handleScaleChange('x', Number(e.target.value))}
                        className="border-[#FEF7CD]/70 focus:border-[#FEF7CD]"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-neutral-600">Y</Label>
                      <Input
                        type="number"
                        min="0.1"
                        max="5"
                        step="0.1"
                        value={selectedItem.scale[1].toFixed(1)}
                        onChange={(e) => handleScaleChange('y', Number(e.target.value))}
                        className="border-[#FEF7CD]/70 focus:border-[#FEF7CD]"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-neutral-600">Z</Label>
                      <Input
                        type="number"
                        min="0.1"
                        max="5"
                        step="0.1"
                        value={selectedItem.scale[2].toFixed(1)}
                        onChange={(e) => handleScaleChange('z', Number(e.target.value))}
                        className="border-[#FEF7CD]/70 focus:border-[#FEF7CD]"
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-neutral-500">
                <p>No item selected</p>
              </div>
            )}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default RoomControls;