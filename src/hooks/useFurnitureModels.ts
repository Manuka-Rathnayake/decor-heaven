import { useState, useEffect } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { firestore } from '@/config/firebase';

interface Furniture {
  id: string;
  name: string;
  type: string;
  model: string;
  defaultPosition: [number, number, number];
  defaultRotation: [number, number, number];
  defaultScale: [number, number, number];
}

const inferType = (category: string): string => {
  const lowerCaseCategory = category.toLowerCase();
  if (lowerCaseCategory === 'chairs') {
    return 'chair'
  } else if (lowerCaseCategory === 'tables') {
      return 'table'
  } else if (lowerCaseCategory === 'sofas') {
    return 'sofa'
  } else if (lowerCaseCategory === 'storage') {
    return 'storage'
  } else if (lowerCaseCategory === 'beds') {
    return 'bed'
  }else {
    return 'other';
  }
};

const useFurnitureModels = (): Furniture[] => {
  const [furniture, setFurniture] = useState<Furniture[]>([]);

  useEffect(() => {
    const fetchFurniture = async () => {
      const q = query(collection(firestore, 'products'));
      const productsSnapshot = await getDocs(q);
      const furnitureData: Furniture[] = [];
      productsSnapshot.forEach((doc) => {
        const data = doc.data();
        // now we check if it has modelUrl1
        if (data.modelUrl) {
          // now we can create the object
          furnitureData.push({
            id: doc.id,
            name: data.name,
            type: inferType(data.category),
            model: data.modelUrl,
            defaultPosition: [0, 0, 0],
            defaultRotation: [0, 0, 0],
            defaultScale: [1, 1, 1],
          });
        }
      });
      setFurniture(furnitureData);
    };

    fetchFurniture();
  }, []);

  return furniture;
};

export default useFurnitureModels;