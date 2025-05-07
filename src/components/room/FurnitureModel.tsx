import { useEffect, useState, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useRoomStore, FurnitureItem } from "@/store/roomStore";
import { Object3D, Mesh, MeshStandardMaterial, MeshPhongMaterial, Group, Box3, Vector3 } from "three";
import { getFurnitureById } from "@/models/furniture";
//@ts-ignore
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { Html } from "@react-three/drei";

interface FurnitureModelProps {
  item: FurnitureItem;
  isSelected: boolean;
  onClick: () => void;
  roomDimensions?: [number, number];
}

const FurnitureModel = ({ item, isSelected, onClick, roomDimensions = [10, 10] }: FurnitureModelProps) => {
  const [model, setModel] = useState<Group | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [autoScaleFactor, setAutoScaleFactor] = useState<number>(1);
  const modelRef = useRef<Group>(null);
  const furnitureData = getFurnitureById(item.type);
  
  // Helper function to calculate automatic scale for models
  const calculateAutoScale = (loadedModel: Group): number => {
    // Create a bounding box to get model dimensions
    const box = new Box3().setFromObject(loadedModel);
    const size = new Vector3();
    box.getSize(size);
    
    // Get the largest dimension of the model
    const maxDimension = Math.max(size.x, size.y, size.z);
    
    // If the model is too large (> 2 meters in any dimension), scale it down
    // For OBJ models specifically, scale down more aggressively
    const fileExtension = furnitureData?.model?.split('.').pop()?.toLowerCase();
    
    if (fileExtension === 'obj') {
      // Many OBJ models are too large, scale them down to a reasonable size
      // Target size of 1 meter (adjust this value as needed)
      const targetSize = 1; 
      return targetSize / maxDimension;
    }
    
    // For other formats, use more conservative scaling
    if (maxDimension > 2) {
      return 2 / maxDimension;
    }
    
    return 1; // No auto-scaling needed
  };
  
  // Load the appropriate model based on file extension
  useEffect(() => {
    if (!furnitureData?.model) return;
    
    setIsLoading(true);
    setLoadError(null);
    
    const modelPath = furnitureData.model;
    const fileExtension = modelPath.split('.').pop()?.toLowerCase();
    
    try {
      // Different loaders based on file extension
      if (fileExtension === 'obj') {
        // For OBJ models
        const objLoader = new OBJLoader();
        objLoader.load(
          modelPath,
          (loadedModel) => {
            // Calculate appropriate auto-scale for this model
            const scaleFactor = calculateAutoScale(loadedModel);
            setAutoScaleFactor(scaleFactor);
            
            console.log(`Auto-scaling OBJ model by factor: ${scaleFactor}`);
            
            // Apply materials and colors to the OBJ model
            loadedModel.traverse((object) => {
              if (object instanceof Mesh) {
                // Create a new standard material with exact color from the color picker
                const material = new MeshStandardMaterial({
                  color: item.color,
                  roughness: 0.5,         // Reduce roughness for more accurate color
                  metalness: 0.0,         // Remove metalness which can tint colors
                  emissive: '#000000',    // No emission by default
                  emissiveIntensity: 0,
                  transparent: false,
                  opacity: 1.0,
                  side: 2                 // Double-sided rendering
                });
                
                // Apply the new material
                object.material = material;
                
                // Make sure it casts and receives shadows
                object.castShadow = true;
                object.receiveShadow = true;
              }
            });
            
            // Important: Set the model first so it's available
            setModel(loadedModel);
            setIsLoading(false);
          },
          undefined,
          (error) => {
            console.error('Error loading OBJ model:', error);
            setLoadError('Failed to load OBJ model');
            setIsLoading(false);
          }
        );
      } else if (fileExtension === 'glb' || fileExtension === 'gltf') {
        // For GLTF/GLB models
        try {
          const { scene } = useGLTF(modelPath);
          const clonedModel = scene.clone();
          
          // Calculate appropriate auto-scale for this model
          const scaleFactor = calculateAutoScale(clonedModel);
          setAutoScaleFactor(scaleFactor);
          
          // Apply materials and colors
          clonedModel.traverse((object) => {
            if (object instanceof Mesh) {
              if (object.material) {
                if (Array.isArray(object.material)) {
                  object.material = object.material.map(mat => {
                    const newMat = mat.clone();
                    newMat.color.set(item.color);
                    
                    // Adjust material properties for more accurate color
                    if ('roughness' in newMat) newMat.roughness = 0.5;
                    if ('metalness' in newMat) newMat.metalness = 0.0;
                    
                    return newMat;
                  });
                } else {
                  object.material = object.material.clone();
                  object.material.color.set(item.color);
                  
                  // Adjust material properties for more accurate color
                  if ('roughness' in object.material) object.material.roughness = 0.5;
                  if ('metalness' in object.material) object.material.metalness = 0.0;
                }
              }
              object.castShadow = true;
              object.receiveShadow = true;
            }
          });
          
          setModel(clonedModel);
          setIsLoading(false);
        } catch (error) {
          console.error('Error loading GLTF/GLB model:', error);
          setLoadError('Failed to load GLTF/GLB model');
          setIsLoading(false);
        }
      } else {
        setLoadError(`Unsupported file format: ${fileExtension}`);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error in model loading:', error);
      setLoadError('Failed to load model');
      setIsLoading(false);
    }
  }, [furnitureData?.model]);

  // Update model when selected state changes
  useEffect(() => {
    if (!model) return;
    
    model.traverse((object) => {
      if (object instanceof Mesh && object.material) {
        // Handle both array materials and single materials
        if (Array.isArray(object.material)) {
          object.material.forEach(material => {
            if ('emissive' in material) {
              material.emissive.set(isSelected ? '#9b87f5' : '#000000');
              material.emissiveIntensity = isSelected ? 0.2 : 0;
            }
          });
        } else if ('emissive' in object.material) {
          object.material.emissive.set(isSelected ? '#9b87f5' : '#000000');
          object.material.emissiveIntensity = isSelected ? 0.2 : 0;
        }
      }
    });
  }, [isSelected, model]);

  // Update model when color changes
  useEffect(() => {
    if (!model) return;
    
    console.log("Applying color:", item.color); // Debug log
    
    model.traverse((object) => {
      if (object instanceof Mesh && object.material) {
        // Handle both array materials and single materials
        if (Array.isArray(object.material)) {
          object.material.forEach(material => {
            if (material.color) {
              // Set color directly from hex string to ensure accuracy
              material.color.set(item.color);
              
              // Ensure lighting parameters don't distort the color
              if ('roughness' in material) {
                material.roughness = 0.5;
              }
              if ('metalness' in material) {
                material.metalness = 0.0;
              }
            }
          });
        } else if (object.material.color) {
          // Set color directly from hex string to ensure accuracy
          object.material.color.set(item.color);
          
          // Ensure lighting parameters don't distort the color
          if ('roughness' in object.material) {
            object.material.roughness = 0.5;
          }
          if ('metalness' in object.material) {
            object.material.metalness = 0.0;
          }
        }
      }
    });
  }, [item.color, model]);
  
  // Calculate the final scale considering both the auto-scale and user scale
  const finalScale = [
    item.scale[0] * autoScaleFactor,
    item.scale[1] * autoScaleFactor,
    item.scale[2] * autoScaleFactor
  ];
  
  // Fallback if model is still loading or couldn't be loaded
  if (isLoading || loadError || !model) {
    return (
      <mesh
        position={item.position}
        rotation={item.rotation}
        scale={item.scale}
        onClick={onClick}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          color={item.color} 
          emissive={isSelected ? "#9b87f5" : "#000000"}
          emissiveIntensity={isSelected ? 0.2 : 0}
          roughness={0.5}
          metalness={0.0}
        />
        {loadError && (
          <Html center>
            <div className="bg-red-100 text-red-700 px-2 py-1 text-xs rounded-md whitespace-nowrap">
              {loadError}
            </div>
          </Html>
        )}
      </mesh>
    );
  }
  
  // Return the 3D model with the correct properties
  return (
    <group
      position={item.position}
      rotation={item.rotation}
      scale={finalScale as [number, number, number]} // Apply both auto-scaling and user scaling
      onClick={onClick}
      castShadow
      receiveShadow
      ref={modelRef}
    >
      <primitive object={model} />
    </group>
  );
};

export default FurnitureModel;