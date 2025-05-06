
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRoomStore, RoomDesign } from "@/store/roomStore";
import { useToast } from "@/hooks/use-toast";

interface RoomFormProps {
  onComplete?: () => void;
  existingDesign?: RoomDesign;
}

const RoomForm = ({ onComplete, existingDesign }: RoomFormProps) => {
  const createDesign = useRoomStore(state => state.createDesign);
  const updateDesign = useRoomStore(state => state.updateDesign);
  const { toast } = useToast();

  const [name, setName] = useState(existingDesign?.name || "");
  const [length, setLength] = useState(existingDesign?.length || 5);
  const [width, setWidth] = useState(existingDesign?.width || 4);
  const [height, setHeight] = useState(existingDesign?.height || 2.5);
  const [shape, setShape] = useState<"rectangular" | "L-shaped">(existingDesign?.shape || "rectangular");
  const [wallColor, setWallColor] = useState(existingDesign?.wallColor || "#F1F0FB");
  const [floorColor, setFloorColor] = useState(existingDesign?.floorColor || "#A67C52");
  const [ceilingColor, setCeilingColor] = useState(existingDesign?.ceilingColor || "#FFFFFF");

  useEffect(() => {
    if (existingDesign) {
      setName(existingDesign.name);
      setLength(existingDesign.length);
      setWidth(existingDesign.width);
      setHeight(existingDesign.height);
      setShape(existingDesign.shape);
      setWallColor(existingDesign.wallColor);
      setFloorColor(existingDesign.floorColor);
      setCeilingColor(existingDesign.ceilingColor);
    }
  }, [existingDesign]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      toast({
        title: "Error",
        description: "Please enter a name for your design",
        variant: "destructive",
      });
      return;
    }

    if (existingDesign) {
      updateDesign({
        ...existingDesign,
        name,
        length,
        width,
        height,
        shape,
        wallColor,
        floorColor,
        ceilingColor,
      });
      
      toast({
        title: "Design updated",
        description: `${name} has been updated successfully`,
      });
    } else {
      createDesign({
        name,
        length,
        width,
        height,
        shape,
        wallColor,
        floorColor,
        ceilingColor,
        furniture: [],
      });
      
      toast({
        title: "Design created",
        description: `${name} has been created successfully`,
      });
    }
    
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Room Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Living Room, Bedroom, etc."
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="length">Length (m)</Label>
          <Input
            id="length"
            type="number"
            min="1"
            max="20"
            step="0.1"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="width">Width (m)</Label>
          <Input
            id="width"
            type="number"
            min="1"
            max="20"
            step="0.1"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="height">Height (m)</Label>
          <Input
            id="height"
            type="number"
            min="1"
            max="5"
            step="0.1"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Room Shape</Label>
        <RadioGroup value={shape} onValueChange={(value) => setShape(value as "rectangular" | "L-shaped")} className="flex gap-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="rectangular" id="rectangular" />
            <Label htmlFor="rectangular">Rectangular</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="L-shaped" id="l-shaped" />
            <Label htmlFor="l-shaped">L-Shaped</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="wallColor">Wall Color</Label>
          <div className="flex gap-2">
            <div className="w-8 h-8 border rounded" style={{ backgroundColor: wallColor }}></div>
            <Input
              id="wallColor"
              type="color"
              value={wallColor}
              onChange={(e) => setWallColor(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="floorColor">Floor Color</Label>
          <div className="flex gap-2">
            <div className="w-8 h-8 border rounded" style={{ backgroundColor: floorColor }}></div>
            <Input
              id="floorColor"
              type="color"
              value={floorColor}
              onChange={(e) => setFloorColor(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="ceilingColor">Ceiling Color</Label>
          <div className="flex gap-2">
            <div className="w-8 h-8 border rounded" style={{ backgroundColor: ceilingColor }}></div>
            <Input
              id="ceilingColor"
              type="color"
              value={ceilingColor}
              onChange={(e) => setCeilingColor(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        {existingDesign && (
          <Button type="button" variant="outline" onClick={onComplete}>
            Cancel
          </Button>
        )}
        <Button type="submit">
          {existingDesign ? "Update Room" : "Create Room"}
        </Button>
      </div>
    </form>
  );
};

export default RoomForm;
