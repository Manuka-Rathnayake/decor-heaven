import { useEffect, useState } from "react";
import { useRoomStore } from "@/store/roomStore";
import { furnitureModels as defaultModels, useFurnitureModels } from "@/models/furniture";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileDown, Download } from "lucide-react";


const FurniturePanel = () => {
  const activeDesign = useRoomStore((state) => state.activeDesign);
  const addFurniture = useRoomStore((state) => state.addFurniture);
  const importLocalModels = useRoomStore((state) => state.importLocalModels);
  const { toast } = useToast();
  const [uploadedModels, setUploadedModels] = useState([]);

  const { furnitureModels: firestoreModels, loading, error } = useFurnitureModels();

  const combinedFurnitureModels = Array.from(
    new Map(
      [...defaultModels, ...firestoreModels].map((model) => [model.id, model])
    ).values()
  );

  const furnitureTypes = Array.from(
    new Set(combinedFurnitureModels.map((model) => model.type || "misc"))
  );

  // useEffect(() => {
  //   setUploadedModels(LOCAL_MODELS);
  //   importLocalModels(LOCAL_MODELS);
  // }, [importLocalModels]);

  const handleAddFurniture = (itemId) => {
    if (!activeDesign) {
      toast({
        title: "Error",
        description: "Please create or select a room design first",
        variant: "destructive",
      });
      return;
    }
  
    const model = combinedFurnitureModels.find((m) => m.id === itemId);
    if (!model) return;
  
    addFurniture({
      type: model.id,
      position: model.defaultPosition || [0, 0, 0],
      rotation: model.defaultRotation || [0, 0, 0],
      scale: model.defaultScale || [1, 1, 1],
      color: model.defaultColor || "#FFFFFF",
      model: model.model, 
      name: model.name, 
      thumbnail: model.thumbnail 
    });
  
    toast({
      title: "Item added",
      description: `${model.name} added to your design`,
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

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-[#FEF7CD]/50 to-white overflow-hidden">
      <div className="p-4 border-b border-[#FEF7CD]/70">
        <h3 className="text-lg font-semibold mb-2 text-neutral-800">Furniture Library</h3>
        <p className="text-sm text-neutral-600">
          {loading
            ? "Loading furniture..."
            : error
            ? `Error loading furniture: ${error}`
            : `Select and place furniture in your room design (${combinedFurnitureModels.length} items)`}
        </p>
      </div>

      <Tabs defaultValue="all" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="flex w-full rounded-none border-b bg-[#FEF7CD]/30 overflow-x-auto">
          <TabsTrigger value="all" className="px-2 min-w-[80px]">All</TabsTrigger>
          {furnitureTypes.map((type) => (
            <TabsTrigger key={type} value={type} className="px-2 min-w-[80px] capitalize">
              {type}s
            </TabsTrigger>
          ))}
          <TabsTrigger value="uploaded" className="px-2 min-w-[80px]">Custom</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1 overflow-y-auto">
          {/* All tab */}
          <TabsContent value="all" className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {loading ? (
              <p className="col-span-2 text-center py-10">Loading furniture models...</p>
            ) : error ? (
              <p className="col-span-2 text-center py-10 text-red-500">Error: {error}</p>
            ) : combinedFurnitureModels.length > 0 ? (
              combinedFurnitureModels.map((model) => (
                <Card key={model.id} className="overflow-hidden border-[#FEF7CD]/70 hover:shadow-md transition-shadow">
                  <div
                    className="w-full h-24 flex items-center justify-center bg-gradient-to-br from-[#FEF7CD]/30 to-white"
                    style={{
                      backgroundImage: model.thumbnail ? `url(${model.thumbnail})` : "none",
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                    }}
                  />
                  <CardContent className="p-3">
                    <p className="text-sm font-medium mb-2 text-neutral-800">{model.name}</p>
                    <Button onClick={() => handleAddFurniture(model.id)} size="sm" className="w-full bg-[#FEF7CD] hover:bg-[#FEF0A0] text-neutral-900">
                      Add
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="col-span-2 text-center py-10">No furniture models available</p>
            )}
          </TabsContent>

          {furnitureTypes.map((type) => (
            <TabsContent key={type} value={type} className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {combinedFurnitureModels
                .filter((model) => model.type === type)
                .map((model) => (
                  <Card key={model.id} className="overflow-hidden border-[#FEF7CD]/70 hover:shadow-md transition-shadow">
                    <div
                      className="w-full h-24 flex items-center justify-center bg-gradient-to-br from-[#FEF7CD]/30 to-white"
                      style={{
                        backgroundImage: model.thumbnail ? `url(${model.thumbnail})` : "none",
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                      }}
                    />
                    <CardContent className="p-3">
                      <p className="text-sm font-medium mb-2 text-neutral-800">{model.name}</p>
                      <Button onClick={() => handleAddFurniture(model.id)} size="sm" className="w-full bg-[#FEF7CD] hover:bg-[#FEF0A0] text-neutral-900">
                        Add
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </TabsContent>
          ))}

        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default FurniturePanel;
