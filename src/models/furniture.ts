import { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '@/config/firebase';

export interface FurnitureModel {
  id: string;
  name: string;
  type: string;
  thumbnail: string;
  model: string;
  defaultColor: string;
  defaultPosition: [number, number, number];
  defaultRotation: [number, number, number];
  defaultScale: [number, number, number];
}

// Default array to store furniture models for static imports
export const furnitureModels: FurnitureModel[] = [];

// Default colors for different furniture types
const getDefaultColor = (type: string): string => {
  const typeColors: Record<string, string> = {
    'table': '#A67C52',
    'desk': '#A67C52',
    'shelf': '#A67C52',
    'storage': '#A67C52',
    'wooden': '#A67C52',
    // Default color for other types
    'default': '#8E9196'
  };
  
  return typeColors[type] || typeColors.default;
};

// Hook to fetch furniture models from Firestore
export function useFurnitureModels() {
  const [models, setModels] = useState<FurnitureModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const db = getFirestore(app);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        
        // FIXED: Correct path to the products collection
        // Based on your screenshot, it should be just 'products', not 'products/models'
        const productsRef = collection(db, 'products');
        
        // Add some debugging to see if we're connecting properly
        console.log('Attempting to fetch from Firestore...');
        
        const querySnapshot = await getDocs(productsRef);
        
        console.log('Query snapshot size:', querySnapshot.size);
        
        const loadedModels: FurnitureModel[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          console.log('Document ID:', doc.id);
          console.log('Fetched data:', data);
          
          // Only add products that have model URLs
          if (!data.modelUrl) {
            console.log('Skipping document - no modelUrl:', doc.id);
            return;
          }
          
          // Get furniture type from category or default to 'furniture'
          const type = data.category?.toLowerCase() || 'furniture';
          
          // Create furniture model object
          const furnitureModel: FurnitureModel = {
            id: doc.id,
            name: data.name || 'Unnamed Furniture',
            type: data.category || type,
            thumbnail: data.image || `/furniture/thumbnails/${type}.png`,
            model: data.modelUrl,
            defaultColor: data.colors?.[0] || getDefaultColor(type),
            defaultPosition: [0, 0, 0],
            defaultRotation: [0, 0, 0],
            defaultScale: [1, 1, 1],
          };
          
          loadedModels.push(furnitureModel);
        });
        
        if (loadedModels.length > 0) {
          setModels(loadedModels);
          
          // Update the exported array for static imports
          furnitureModels.length = 0;
          furnitureModels.push(...loadedModels);
          
          console.log('Loaded furniture models:', loadedModels);
        } else {
          console.warn('No furniture models found in Firestore');
        }
      } catch (err) {
        console.error('Error loading models from Firestore:', err, (err as Error).stack);
        setError('Failed to load furniture models');
      } finally {
        setLoading(false);
      }
    };
    
    fetchModels();
  }, [db]);
  
  return { furnitureModels: models, loading, error };
}

// Function to get a specific furniture model by ID
export const getFurnitureById = (id: string): FurnitureModel | undefined => {
  return furnitureModels.find(item => item.id === id);
};