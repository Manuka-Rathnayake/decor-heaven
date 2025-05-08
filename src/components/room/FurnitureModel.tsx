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
 
  const calculateAutoScale = (loadedModel: Group): number => {
 
    const box = new Box3().setFromObject(loadedModel);
    const size = new Vector3();
    box.getSize(size);
    
 
    const maxDimension = Math.max(size.x, size.y, size.z);
    
    const modelUrl = item.model || furnitureData?.model || "";
    const fileExtension = getFileExtension(modelUrl);
    
    if (fileExtension === 'obj') {

      const targetSize = 1; 
      return targetSize / maxDimension;
    }
    
    if (maxDimension > 2) {
      return 2 / maxDimension;
    }
    
    return 1; 
  };
  
 
  const getFileExtension = (url: string): string => {
    // Check if URL exists
    if (!url) return '';
    
    const urlWithoutParams = url.split('?')[0];
    
    const extension = urlWithoutParams.split('.').pop()?.toLowerCase() || '';
    return extension;
  };
  

  const createProxyUrl = (url: string): string => {
   
    if (process.env.NODE_ENV === 'development') {

      return url; 
    }
    return url;
  };
  
 
  useEffect(() => {
   
    const modelUrl = item.model || furnitureData?.model;
    
    if (!modelUrl) {
      console.warn("No model URL available for this furniture", item);
      setLoadError("Missing model URL");
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setLoadError(null);
    
    const fileExtension = getFileExtension(modelUrl);
    
    console.log(`Loading model: ${modelUrl}`);
    console.log(`Detected file extension: ${fileExtension}`);
    
    try {

      if (fileExtension === 'obj') {

        const objLoader = new OBJLoader();
        
  
        const onProgress = (event: ProgressEvent) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            console.log(`Loading progress: ${percentComplete}%`);
          }
        };
        
        const proxiedUrl = createProxyUrl(modelUrl);
        console.log(`Attempting to load OBJ from: ${proxiedUrl}`);
        
        objLoader.load(
          proxiedUrl,
          (loadedModel) => {
            console.log("OBJ model loaded successfully:", loadedModel);
            
   
            const scaleFactor = calculateAutoScale(loadedModel);
            setAutoScaleFactor(scaleFactor);
            
            console.log(`Auto-scaling OBJ model by factor: ${scaleFactor}`);
            
   
            loadedModel.traverse((object) => {
              if (object instanceof Mesh) {

                const material = new MeshStandardMaterial({
                  color: item.color,
                  roughness: 0.5,      
                  metalness: 0.0,        
                  emissive: '#000000',    
                  emissiveIntensity: 0,
                  transparent: false,
                  opacity: 1.0,
                  side: 2            
                });
                
                object.material = material;

                object.castShadow = true;
                object.receiveShadow = true;
              }
            });
            

            setModel(loadedModel);
            setIsLoading(false);
          },
          onProgress,
          (error) => {
            console.error('Error loading OBJ model:', error);

            let errorMessage = 'Failed to load OBJ model';
            if (error.message) {
              errorMessage += `: ${error.message}`;
            } else if (typeof error === 'string') {
              errorMessage += `: ${error}`;
            }
            
            if (error.message && error.message.includes('Cross-Origin')) {
              errorMessage += ' (Possible CORS issue)';
            }
            
            fetch(proxiedUrl, { method: 'HEAD' })
              .then(response => {
                if (!response.ok) {
                  console.error(`URL returned ${response.status}: ${response.statusText}`);
                  errorMessage += ` (HTTP ${response.status})`;
                }
                setLoadError(errorMessage);
                setIsLoading(false);
              })
              .catch(fetchErr => {
                console.error('Fetch test failed:', fetchErr);
                errorMessage += ' (URL not accessible)';
                setLoadError(errorMessage);
                setIsLoading(false);
              });
          }
        );
      } else if (fileExtension === 'glb' || fileExtension === 'gltf') {
        try {
          const { scene } = useGLTF(modelUrl);
          const clonedModel = scene.clone();
          
          const scaleFactor = calculateAutoScale(clonedModel);
          setAutoScaleFactor(scaleFactor);
          
          clonedModel.traverse((object) => {
            if (object instanceof Mesh) {
              if (object.material) {
                if (Array.isArray(object.material)) {
                  object.material = object.material.map(mat => {
                    const newMat = mat.clone();
                    newMat.color.set(item.color);

                    if ('roughness' in newMat) newMat.roughness = 0.5;
                    if ('metalness' in newMat) newMat.metalness = 0.0;
                    
                    return newMat;
                  });
                } else {
                  object.material = object.material.clone();
                  object.material.color.set(item.color);

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
          setLoadError(`Failed to load GLTF/GLB model: ${error instanceof Error ? error.message : 'Unknown error'}`);
          setIsLoading(false);
        }
      } else {
        setLoadError(`Unsupported file format: ${fileExtension}`);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error in model loading:', error);
      setLoadError(`Failed to load model: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsLoading(false);
    }
  }, [item.model, furnitureData?.model]);

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

  useEffect(() => {
    if (!model) return;
    
    console.log("Applying color:", item.color); 
    
    model.traverse((object) => {
      if (object instanceof Mesh && object.material) {

        if (Array.isArray(object.material)) {
          object.material.forEach(material => {
            if (material.color) {
       
              material.color.set(item.color);
              
              if ('roughness' in material) {
                material.roughness = 0.5;
              }
              if ('metalness' in material) {
                material.metalness = 0.0;
              }
            }
          });
        } else if (object.material.color) {
          object.material.color.set(item.color);

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
  
  const finalScale = [
    item.scale[0] * autoScaleFactor,
    item.scale[1] * autoScaleFactor,
    item.scale[2] * autoScaleFactor
  ];
  
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
        {isLoading && (
          <Html center>
            <div className="bg-blue-100 text-blue-700 px-2 py-1 text-xs rounded-md whitespace-nowrap">
              Loading model...
            </div>
          </Html>
        )}
      </mesh>
    );
  }
  
  return (
    <group
      position={item.position}
      rotation={item.rotation}
      scale={finalScale as [number, number, number]} 
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