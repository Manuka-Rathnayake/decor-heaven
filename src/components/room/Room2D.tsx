
import { useRoomStore, FurnitureItem } from "@/store/roomStore";
import { useState, useRef, useEffect } from "react";
import { getFurnitureById } from "@/models/furniture";
import { Button } from "@/components/ui/button";
import { Pencil, Square, Move } from "lucide-react";

const Room2D = () => {
  const activeDesign = useRoomStore(state => state.activeDesign);
  const selectedFurniture = useRoomStore(state => state.selectedFurniture);
  const setSelectedFurniture = useRoomStore(state => state.setSelectedFurniture);
  const updateFurniture = useRoomStore(state => state.updateFurniture);
  const updateDesign = useRoomStore(state => state.updateDesign);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState(20); // pixels per meter
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [mode, setMode] = useState<'move' | 'draw'>('move');
  const [drawPoints, setDrawPoints] = useState<{ x: number, y: number }[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  
  useEffect(() => {
    drawRoom();
  }, [activeDesign, selectedFurniture, scale, drawPoints, mode]);
  
  if (!activeDesign) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-neutral-light">
        <p className="text-neutral-dark">No active design. Create or select a design to start.</p>
      </div>
    );
  }
  
  function drawRoom() {
    const canvas = canvasRef.current;
    if (!canvas || !activeDesign) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { length, width, shape, wallColor, floorColor } = activeDesign;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate room dimensions in pixels
    const roomWidthPx = width * scale;
    const roomLengthPx = length * scale;
    
    // Center room in canvas
    const offsetX = (canvas.width - roomLengthPx) / 2;
    const offsetY = (canvas.height - roomWidthPx) / 2;
    
    if (mode === 'draw' && drawPoints.length > 0) {
      // Draw custom shape based on user's drawing
      ctx.fillStyle = floorColor;
      ctx.strokeStyle = wallColor;
      ctx.lineWidth = 4;
      
      ctx.beginPath();
      ctx.moveTo(drawPoints[0].x, drawPoints[0].y);
      
      drawPoints.forEach((point, index) => {
        if (index > 0) {
          ctx.lineTo(point.x, point.y);
        }
      });
      
      if (drawPoints.length > 2) {
        ctx.closePath();
      }
      
      ctx.fill();
      ctx.stroke();
      
      // Draw points for editing
      drawPoints.forEach(point => {
        ctx.fillStyle = '#9b87f5';
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
        ctx.fill();
      });
    } else {
      // Draw room shape
      ctx.fillStyle = floorColor;
      ctx.strokeStyle = wallColor;
      ctx.lineWidth = 4;
      
      if (shape === 'rectangular') {
        // Draw rectangular room
        ctx.fillRect(offsetX, offsetY, roomLengthPx, roomWidthPx);
        ctx.strokeRect(offsetX, offsetY, roomLengthPx, roomWidthPx);
      } else {
        // Draw L-shaped room
        const mainLength = length * 0.7 * scale;
        const mainWidth = width * scale;
        const extensionLength = length * scale;
        const extensionWidth = width * 0.5 * scale;
        
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
        ctx.lineTo(offsetX + mainLength, offsetY);
        ctx.lineTo(offsetX + mainLength, offsetY + mainWidth);
        ctx.lineTo(offsetX + (mainLength - extensionLength), offsetY + mainWidth);
        ctx.lineTo(offsetX + (mainLength - extensionLength), offsetY + (mainWidth - extensionWidth));
        ctx.lineTo(offsetX, offsetY + (mainWidth - extensionWidth));
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    }
    
    // Draw furniture
    if (activeDesign.furniture && activeDesign.furniture.length > 0) {
      activeDesign.furniture.forEach(item => {
        drawFurnitureItem(ctx, item, offsetX, offsetY);
      });
    }
  }
  
  function drawFurnitureItem(ctx: CanvasRenderingContext2D, item: FurnitureItem, offsetX: number, offsetY: number) {
    const [x, y, z] = item.position;
    const [scaleX, scaleY, scaleZ] = item.scale;
    const [rotX, rotY, rotZ] = item.rotation;
    
    // Convert 3D position to 2D canvas position
    const posX = offsetX + (x + activeDesign.length / 2) * scale;
    const posY = offsetY + (z + activeDesign.width / 2) * scale;
    
    // Base size of furniture item in pixels
    const sizeX = 0.8 * scale * scaleX;
    const sizeY = 0.8 * scale * scaleZ; // z-scale for top-down view
    
    // Save current drawing state
    ctx.save();
    
    // Move to position and apply rotation
    ctx.translate(posX, posY);
    ctx.rotate(rotY); // Only use Y rotation for top-down view
    
    // Draw the furniture item
    if (item.id === selectedFurniture) {
      // Highlight selected furniture with a glow effect
      ctx.shadowColor = '#9b87f5';
      ctx.shadowBlur = 10;
    }
    
    ctx.fillStyle = item.color;
    ctx.fillRect(-sizeX/2, -sizeY/2, sizeX, sizeY);
    
    // Add outline
    ctx.strokeStyle = item.id === selectedFurniture ? '#7E69AB' : '#000000';
    ctx.lineWidth = item.id === selectedFurniture ? 2 : 1;
    ctx.strokeRect(-sizeX/2, -sizeY/2, sizeX, sizeY);
    
    // Restore drawing state
    ctx.restore();
  }
  
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!activeDesign || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    if (mode === 'draw') {
      setIsDrawing(true);
      // Start drawing or add point to existing drawing
      setDrawPoints([...drawPoints, { x: mouseX, y: mouseY }]);
      return;
    }
    
    // Move mode - for furniture manipulation
    // Calculate room offset for coordinate conversion
    const roomWidthPx = activeDesign.width * scale;
    const roomLengthPx = activeDesign.length * scale;
    const offsetX = (canvas.width - roomLengthPx) / 2;
    const offsetY = (canvas.height - roomWidthPx) / 2;
    
    // Check if clicked on furniture
    for (let i = activeDesign.furniture.length - 1; i >= 0; i--) {
      const item = activeDesign.furniture[i];
      const [x, y, z] = item.position;
      
      // Convert 3D position to 2D canvas position
      const posX = offsetX + (x + activeDesign.length / 2) * scale;
      const posY = offsetY + (z + activeDesign.width / 2) * scale;
      
      // Check if mouse is inside furniture item
      const sizeX = 0.8 * scale * item.scale[0];
      const sizeY = 0.8 * scale * item.scale[2];
      
      // Account for rotation
      const rotY = item.rotation[1];
      
      // Calculate bounding box (simplified - not perfect for rotated items)
      const distance = Math.sqrt(
        Math.pow((mouseX - posX) * Math.cos(rotY) + (mouseY - posY) * Math.sin(rotY), 2) +
        Math.pow(-(mouseX - posX) * Math.sin(rotY) + (mouseY - posY) * Math.cos(rotY), 2)
      );
      
      if (distance < Math.max(sizeX, sizeY) / 2) {
        setSelectedFurniture(item.id);
        setDragging(item.id);
        setDragOffset({ x: mouseX - posX, y: mouseY - posY });
        return;
      }
    }
    
    // If no furniture was clicked, deselect
    if (mode === 'move') {
      setSelectedFurniture(null);
    }
  };
  
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!activeDesign || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    if (mode === 'draw' && isDrawing) {
      // Update the last point for real-time drawing feedback
      const updatedPoints = [...drawPoints];
      updatedPoints[updatedPoints.length - 1] = { x: mouseX, y: mouseY };
      setDrawPoints(updatedPoints);
      return;
    }
    
    if (!dragging || mode !== 'move') return;
    
    // Calculate room offset for coordinate conversion
    const roomWidthPx = activeDesign.width * scale;
    const roomLengthPx = activeDesign.length * scale;
    const offsetX = (canvas.width - roomLengthPx) / 2;
    const offsetY = (canvas.height - roomWidthPx) / 2;
    
    // Calculate new position in room coordinates
    const newX = ((mouseX - dragOffset.x) - offsetX) / scale - activeDesign.length / 2;
    const newZ = ((mouseY - dragOffset.y) - offsetY) / scale - activeDesign.width / 2;
    
    // Update furniture position
    const item = activeDesign.furniture.find(item => item.id === dragging);
    if (item) {
      updateFurniture(item.id, {
        position: [newX, item.position[1], newZ],
      });
    }
  };
  
  const handleCanvasMouseUp = () => {
    setDragging(null);
    setIsDrawing(false);
  };
  
  const saveCustomShape = () => {
    if (drawPoints.length < 3) return; // Need at least 3 points for a shape
    
    // Calculate approximate dimensions from the drawn shape
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    
    drawPoints.forEach(point => {
      minX = Math.min(minX, point.x);
      maxX = Math.max(maxX, point.x);
      minY = Math.min(minY, point.y);
      maxY = Math.max(maxY, point.y);
    });
    
    const estimatedLength = (maxX - minX) / scale;
    const estimatedWidth = (maxY - minY) / scale;
    
    // Update the active design with custom shape
    if (activeDesign) {
      updateDesign({
        ...activeDesign,
        shape: 'custom' as any, // We'll need to update the type definition later
        length: estimatedLength,
        width: estimatedWidth,
        // Save the normalized points for later rendering
        customPoints: drawPoints.map(point => ({
          x: (point.x - minX) / (maxX - minX),
          y: (point.y - minY) / (maxY - minY)
        }))
      });
    }
    
    setMode('move');
    setDrawPoints([]);
  };
  
  const cancelDrawing = () => {
    setMode('move');
    setDrawPoints([]);
    setIsDrawing(false);
  };
  
  return (
    <div className="w-full h-full flex flex-col">
      <div className="p-2 bg-white border-b flex items-center justify-between">
        <div className="flex items-center gap-4">
          <label className="text-sm flex items-center gap-2">
            <span>Zoom:</span>
            <input 
              type="range" 
              min="10" 
              max="50" 
              value={scale} 
              onChange={(e) => setScale(Number(e.target.value))}
              className="w-32" 
            />
          </label>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant={mode === 'move' ? "default" : "outline"}
            size="sm"
            onClick={() => setMode('move')}
            className="flex items-center gap-1"
          >
            <Move className="w-4 h-4" />
            <span>Move</span>
          </Button>
          <Button 
            variant={mode === 'draw' ? "default" : "outline"}
            size="sm"
            onClick={() => setMode('draw')}
            className="flex items-center gap-1"
          >
            <Pencil className="w-4 h-4" />
            <span>Draw Room</span>
          </Button>
          
          {mode === 'draw' && drawPoints.length > 0 && (
            <>
              <Button 
                variant="default" 
                size="sm"
                onClick={saveCustomShape}
              >
                Save Shape
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={cancelDrawing}
              >
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-hidden bg-neutral-light flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={1200}
          height={800}
          className="border"
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
        />
      </div>
    </div>
  );
};

export default Room2D;