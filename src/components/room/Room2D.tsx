
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
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const roomWidthPx = width * scale;
    const roomLengthPx = length * scale;
    
    // Center room in canvas
    const offsetX = (canvas.width - roomLengthPx) / 2;
    const offsetY = (canvas.height - roomWidthPx) / 2;
    
    if (mode === 'draw' && drawPoints.length > 0) {
      
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
      
      
      drawPoints.forEach(point => {
        ctx.fillStyle = '#9b87f5';
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
        ctx.fill();
      });
    } else {

      ctx.fillStyle = floorColor;
      ctx.strokeStyle = wallColor;
      ctx.lineWidth = 4;
      
      if (shape === 'rectangular') {
        ctx.fillRect(offsetX, offsetY, roomLengthPx, roomWidthPx);
        ctx.strokeRect(offsetX, offsetY, roomLengthPx, roomWidthPx);
      } else {

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
    
    const posX = offsetX + (x + activeDesign.length / 2) * scale;
    const posY = offsetY + (z + activeDesign.width / 2) * scale;
    
    const sizeX = 0.8 * scale * scaleX;
    const sizeY = 0.8 * scale * scaleZ;
    

    ctx.save();
    
    ctx.translate(posX, posY);
    ctx.rotate(rotY); 
    

    if (item.id === selectedFurniture) {
      ctx.shadowColor = '#9b87f5';
      ctx.shadowBlur = 10;
    }
    
    ctx.fillStyle = item.color;
    ctx.fillRect(-sizeX/2, -sizeY/2, sizeX, sizeY);
    
    ctx.strokeStyle = item.id === selectedFurniture ? '#7E69AB' : '#000000';
    ctx.lineWidth = item.id === selectedFurniture ? 2 : 1;
    ctx.strokeRect(-sizeX/2, -sizeY/2, sizeX, sizeY);
    
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
      setDrawPoints([...drawPoints, { x: mouseX, y: mouseY }]);
      return;
    }
    
    const roomWidthPx = activeDesign.width * scale;
    const roomLengthPx = activeDesign.length * scale;
    const offsetX = (canvas.width - roomLengthPx) / 2;
    const offsetY = (canvas.height - roomWidthPx) / 2;
    
    for (let i = activeDesign.furniture.length - 1; i >= 0; i--) {
      const item = activeDesign.furniture[i];
      const [x, y, z] = item.position;
      
      const posX = offsetX + (x + activeDesign.length / 2) * scale;
      const posY = offsetY + (z + activeDesign.width / 2) * scale;

      const sizeX = 0.8 * scale * item.scale[0];
      const sizeY = 0.8 * scale * item.scale[2];
      
      const rotY = item.rotation[1];
      
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
   
      const updatedPoints = [...drawPoints];
      updatedPoints[updatedPoints.length - 1] = { x: mouseX, y: mouseY };
      setDrawPoints(updatedPoints);
      return;
    }
    
    if (!dragging || mode !== 'move') return;
    
    
    const roomWidthPx = activeDesign.width * scale;
    const roomLengthPx = activeDesign.length * scale;
    const offsetX = (canvas.width - roomLengthPx) / 2;
    const offsetY = (canvas.height - roomWidthPx) / 2;
    
   
    const newX = ((mouseX - dragOffset.x) - offsetX) / scale - activeDesign.length / 2;
    const newZ = ((mouseY - dragOffset.y) - offsetY) / scale - activeDesign.width / 2;
    
   
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
    if (drawPoints.length < 3) return; 
    
   
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
    
   
    if (activeDesign) {
      updateDesign({
        ...activeDesign,
        shape: 'custom' as any, 
        length: estimatedLength,
        width: estimatedWidth,
        
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