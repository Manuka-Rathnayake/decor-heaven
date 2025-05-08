
import { useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";

interface ProductViewer3DProps {
  modelUrl: string | null;
}

const ProductViewer3D = ({ modelUrl }: ProductViewer3DProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
 
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
  
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    
 
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (modelUrl) {
  
      ctx.fillStyle = '#333';
      ctx.font = '18px Arial';
      ctx.fillText('3D Model Loaded (Placeholder)', 100, 200);
      ctx.font = '14px Arial';
      ctx.fillText('Model URL: ' + modelUrl.substring(0, 50) + '...', 100, 230);
    } else {

      ctx.strokeStyle = '#9b87f5';
      ctx.lineWidth = 2;
      
     
      ctx.beginPath();
      ctx.moveTo(100, 100);
      ctx.lineTo(200, 100);
      ctx.lineTo(200, 200);
      ctx.lineTo(100, 200);
      ctx.closePath();
      ctx.stroke();
      

      ctx.beginPath();
      ctx.moveTo(150, 150);
      ctx.lineTo(250, 150);
      ctx.lineTo(250, 250);
      ctx.lineTo(150, 250);
      ctx.closePath();
      ctx.stroke();
      
 
      ctx.beginPath();
      ctx.moveTo(100, 100);
      ctx.lineTo(150, 150);
      ctx.moveTo(200, 100);
      ctx.lineTo(250, 150);
      ctx.moveTo(200, 200);
      ctx.lineTo(250, 250);
      ctx.moveTo(100, 200);
      ctx.lineTo(150, 250);
      ctx.stroke();
      

      ctx.fillStyle = '#333';
      ctx.font = '18px Arial';
      ctx.fillText('3D Viewer (Placeholder)', 100, 300);
      ctx.font = '14px Arial';
      ctx.fillText('In a real app, this would use Three.js', 100, 330);
    }
  }, [modelUrl]);

  return (
    <div className="w-full h-full">
      <h2 className="text-xl font-semibold mb-6">3D Furniture Viewer</h2>
      <Card className="p-4 h-[500px] bg-white">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full"
          style={{ display: 'block' }}
        ></canvas>
      </Card>
      <div className="mt-4">
        {modelUrl ? (
          <p className="text-sm text-muted-foreground">
            Model loaded. This is a placeholder for a full 3D viewer. In production, 
            you would integrate a library like Three.js to render interactive 3D models.
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            No model loaded. Upload a 3D model in the Upload tab or select a product 
            with an associated 3D model.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductViewer3D;
