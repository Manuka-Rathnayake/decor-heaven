import { useEffect, useState } from "react";
import { useRoomStore } from "@/store/roomStore";
import { furnitureModels, useFurnitureModels } from "@/models/furniture";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileDown, Download } from "lucide-react";

// Static definition of local models instead of API call
const LOCAL_MODELS = [
  { id: 'custom-sofa', name: 'Custom Sofa', path: '/furniture/models/modern chair 11 obj.obj' },
  { id: 'custom-table', name: 'Custom Table', path: '/furniture/models/the chair modeling.obj' },
  { id: 'custom-lamp', name: 'Custom Lamp', path: '/furniture/models/lamp.glb' },
  { id: 'custom-chair', name: 'Custom Chair', path: '/furniture/models/chair.obj' },
  { id: 'custom-desk', name: 'Custom Desk', path: '/furniture/models/desk.blend' }
];

const FurniturePanel = () => {
  const activeDesign = useRoomStore((state) => state.activeDesign);
  const addFurniture = useRoomStore((state) => state.addFurniture);
  const importLocalModels = useRoomStore((state) => state.importLocalModels);
  const { toast } = useToast();
  const [uploadedModels, setUploadedModels] = useState([]);
  
  // Use the hook to fetch furniture from Firestore
  const { furnitureModels: firestoreModels, loading, error } = useFurnitureModels();
  
  // Debug logs
  console.log('Firestore models loading status:', loading);
  console.log('Firestore models error:', error);
  console.log('Firestore models count:', firestoreModels.length);

  useEffect(() => {
    // Use the static models array directly
    setUploadedModels(LOCAL_MODELS);
    importLocalModels(LOCAL_MODELS);
  }, [importLocalModels]);

  // Combine both static and Firestore models
  const allFurnitureModels = [...firestoreModels, ...furnitureModels];
  console.log('Total furniture models available:', allFurnitureModels.length);

  const handleAddFurniture = (itemId) => {
    if (!activeDesign) {
      toast({
        title: "Error",
        description: "Please create or select a room design first",
        variant: "destructive",
      });
      return;
    }

    const modelData = allFurnitureModels.find((model) => model.id === itemId);
    if (!modelData) return;

    addFurniture({
      type: modelData.id,
      position: modelData.defaultPosition,
      rotation: modelData.defaultRotation,
      scale: modelData.defaultScale,
      color: modelData.defaultColor,
      model: modelData.model,
    });

    toast({
      title: "Item added",
      description: `${modelData.name} added to your design`,
    });
  };

  const handleAddCustomModel = (model) => {
    if (!activeDesign) {
      toast({
        title: "Error",
        description: "Please create or select a room design first",
        variant: "destructive",
      });
      return;
    }

    addFurniture({
      type: model.id,
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: "#FFFFFF",
      model: model.path,
    });

    toast({
      title: "Custom model added",
      description: `${model.name} added to your design`,
    });
  };

  // Get unique furniture types from all models
  const furnitureTypes = Array.from(
    new Set(allFurnitureModels.map((model) => model.type))
  );

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-[#FEF7CD]/50 to-white overflow-hidden">
      <div className="p-4 border-b border-[#FEF7CD]/70">
        <h3 className="text-lg font-semibold mb-2 text-neutral-800">Furniture Library</h3>
        <p className="text-sm text-neutral-600">
          {loading ? 'Loading furniture...' : 
           error ? `Error loading furniture: ${error}` : 
           `Select and place furniture in your room design (${allFurnitureModels.length} items)`}
        </p>
      </div>

      <Tabs defaultValue="all" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="flex w-full rounded-none border-b bg-[#FEF7CD]/30 overflow-x-auto">
          <TabsTrigger value="all" className="flex-1 whitespace-nowrap px-2 min-w-[80px] data-[state=active]:bg-[#FEF7CD] data-[state=active]:text-neutral-900">
            All
          </TabsTrigger>
          {furnitureTypes.map((type) => (
            <TabsTrigger 
              key={type} 
              value={type} 
              className="flex-1 whitespace-nowrap px-2 min-w-[80px] capitalize data-[state=active]:bg-[#FEF7CD] data-[state=active]:text-neutral-900"
            >
              {type}s
            </TabsTrigger>
          ))}
          <TabsTrigger 
            value="uploaded" 
            className="flex-1 whitespace-nowrap px-2 min-w-[80px] data-[state=active]:bg-[#FEF7CD] data-[state=active]:text-neutral-900"
          >
            Custom
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1 overflow-y-auto">
          <TabsContent value="all" className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 m-0">
            {loading ? (
              <div className="col-span-2 flex justify-center py-10">
                <p>Loading furniture models...</p>
              </div>
            ) : error ? (
              <div className="col-span-2 flex justify-center py-10">
                <p className="text-red-500">Error: {error}</p>
              </div>
            ) : allFurnitureModels.length > 0 ? (
              allFurnitureModels.map((model) => (
                <Card key={model.id} className="overflow-hidden border-[#FEF7CD]/70 hover:shadow-md transition-shadow">
                  <div
                    className="w-full h-24 bg-gradient-to-br from-[#FEF7CD]/30 to-white flex items-center justify-center"
                    style={{ backgroundImage: `url(${model.thumbnail})`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
                  >
                    {/* Fallback if no image */}
                    {!model.thumbnail && (
                      <div className="w-16 h-16 bg-[#FEF7CD]/50 rounded-md"></div>
                    )}
                  </div>
                  <CardContent className="p-3">
                    <p className="text-sm font-medium mb-2 text-neutral-800">{model.name}</p>
                    <Button
                      onClick={() => handleAddFurniture(model.id)}
                      size="sm"
                      className="w-full bg-[#FEF7CD] hover:bg-[#FEF0A0] text-neutral-900"
                    >
                      Add
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-2 flex justify-center py-10">
                <p>No furniture models available</p>
              </div>
            )}
          </TabsContent>

          {furnitureTypes.map((type) => (
            <TabsContent
              key={type}
              value={type}
              className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 m-0"
            >
              {allFurnitureModels
                .filter((model) => model.type === type)
                .map((model) => (
                  <Card key={model.id} className="overflow-hidden border-[#FEF7CD]/70 hover:shadow-md transition-shadow">
                    <div
                      className="w-full h-24 bg-gradient-to-br from-[#FEF7CD]/30 to-white flex items-center justify-center"
                      style={{ backgroundImage: `url(${model.thumbnail})`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
                    >
                      {/* Fallback if no image */}
                      {!model.thumbnail && (
                        <div className="w-16 h-16 bg-[#FEF7CD]/50 rounded-md"></div>
                      )}
                    </div>
                    <CardContent className="p-3">
                      <p className="text-sm font-medium mb-2 text-neutral-800">{model.name}</p>
                      <Button
                        onClick={() => handleAddFurniture(model.id)}
                        size="sm"
                        className="w-full bg-[#FEF7CD] hover:bg-[#FEF0A0] text-neutral-900"
                      >
                        Add
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </TabsContent>
          ))}

          <TabsContent
            value="uploaded"
            className="p-4 m-0"
          >
            {uploadedModels.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {uploadedModels.map((model) => (
                  <Card key={model.id} className="overflow-hidden border-[#FEF7CD]/70 hover:shadow-md transition-shadow">
                    <div className="w-full h-24 bg-gradient-to-br from-[#FEF7CD]/30 to-white flex items-center justify-center">
                      <div className="w-16 h-16 bg-[#FEF7CD]/50 rounded-md flex items-center justify-center">
                        <FileDown className="w-8 h-8 text-neutral-500" />
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <p className="text-sm font-medium mb-2 text-neutral-800">
                        {model.name}
                        <span className="ml-2 text-xs text-neutral-500">
                          {model.path.endsWith('.glb') ? 'GLB' : 
                           model.path.endsWith('.obj') ? 'OBJ' :
                           model.path.endsWith('.blend') ? 'BLEND' : ''}
                        </span>
                      </p>
                      <Button
                        onClick={() => handleAddCustomModel(model)}
                        size="sm"
                        className="w-full bg-[#FEF7CD] hover:bg-[#FEF0A0] text-neutral-900"
                      >
                        Add
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-neutral-600">
                <Download className="w-10 h-10 mb-4 opacity-50" />
                <p className="text-sm mb-2">No custom models available</p>
                <p className="text-xs text-center max-w-xs text-neutral-500">
                  To add custom models, place .glb/.gltf/.obj/.blend files in the public/furniture/models folder
                </p>
              </div>
            )}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default FurniturePanel;