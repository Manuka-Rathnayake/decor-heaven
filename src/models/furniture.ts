
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
  
  export const furnitureModels: FurnitureModel[] = [
    {
      id: 'sofa-1',
      name: 'Modern Sofa',
      type: 'sofa',
      thumbnail: '/furniture/thumbnails/sofa-1.png',
      model: '/furniture/models/modern chair 11 obj.obj',
      defaultColor: '#8E9196',
      defaultPosition: [0, 0, 0],
      defaultRotation: [0, 0, 0],
      defaultScale: [1, 1, 1],
    },
    {
      id: 'chair-1',
      name: 'Lounge Chair',
      type: 'chair',
      thumbnail: '/furniture/thumbnails/chair-1.png',
      model: '/furniture/models/the chair modeling.obj',
      defaultColor: '#8E9196',
      defaultPosition: [0, 0, 0],
      defaultRotation: [0, 0, 0],
      defaultScale: [1, 1, 1],
    },
    {
      id: 'table-1',
      name: 'Coffee Table',
      type: 'table',
      thumbnail: '/furniture/thumbnails/table-1.png',
      model: '/furniture/models/table-1.glb',
      defaultColor: '#A67C52',
      defaultPosition: [0, 0, 0],
      defaultRotation: [0, 0, 0],
      defaultScale: [1, 1, 1],
    },
    {
      id: 'bed-1',
      name: 'Queen Bed',
      type: 'bed',
      thumbnail: '/furniture/thumbnails/bed-1.png',
      model: '/furniture/models/modern chair 11 obj.obj',
      defaultColor: '#8E9196',
      defaultPosition: [0, 0, 0],
      defaultRotation: [0, 0, 0],
      defaultScale: [1, 1, 1],
    },
    {
      id: 'shelf-1',
      name: 'Bookshelf',
      type: 'shelf',
      thumbnail: '/furniture/thumbnails/shelf-1.png',
      model: '/furniture/models/shelf-1.glb',
      defaultColor: '#A67C52',
      defaultPosition: [0, 0, 0],
      defaultRotation: [0, 0, 0],
      defaultScale: [1, 1, 1],
    }
  ];
  
  export const getFurnitureById = (id: string): FurnitureModel | undefined => {
    return furnitureModels.find(item => item.id === id);
  };
  