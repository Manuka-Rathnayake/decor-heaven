import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FurnitureItem {
  id: string;
  type: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
  model: string;
}

export interface Point2D {
  x: number;
  y: number;
}

export interface RoomDesign {
  id: string;
  name: string;
  length: number;
  width: number;
  height: number;
  shape: 'rectangular' | 'L-shaped' | 'custom';
  customPoints?: Point2D[];
  wallColor: string;
  floorColor: string;
  ceilingColor: string;
  furniture: FurnitureItem[];
  createdAt: string;
  updatedAt: string;
}

interface RoomState {
  designs: RoomDesign[];
  activeDesign: RoomDesign | null;
  viewMode: '2d' | '3d';
  selectedFurniture: string | null;
  createDesign: (design: Omit<RoomDesign, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDesign: (design: RoomDesign) => void;
  deleteDesign: (id: string) => void;
  setActiveDesign: (id: string | null) => void;
  setViewMode: (mode: '2d' | '3d') => void;
  addFurniture: (furniture: Omit<FurnitureItem, 'id'>) => void;
  updateFurniture: (id: string, updates: Partial<FurnitureItem>) => void;
  removeFurniture: (id: string) => void;
  setSelectedFurniture: (id: string | null) => void;
  importLocalModels: (models: {id: string, name: string, path: string}[]) => void;
  exportDesignAsOBJ: () => string; // New function for OBJ export
  localModels: {id: string, name: string, path: string}[];
}

export const useRoomStore = create<RoomState>()(
  persist(
    (set, get) => ({
      designs: [],
      activeDesign: null,
      viewMode: '3d',
      selectedFurniture: null,
      localModels: [],

      importLocalModels: (models) => set({ localModels: models }),
      
      // New function to export the design as OBJ format
      exportDesignAsOBJ: () => {
        const { activeDesign } = get();
        if (!activeDesign) return '';
        
        // This is a simplified representation - in a real app you'd use a proper OBJ exporter
        const { length, width, height, wallColor, floorColor } = activeDesign;
        
        // Generate a basic OBJ string (this is a simplified example)
        let objContent = `# Room Design OBJ Export\n`;
        objContent += `# Name: ${activeDesign.name}\n`;
        objContent += `# Dimensions: ${length} x ${width} x ${height}\n\n`;
        
        // Add room vertices
        objContent += `# Room Vertices\n`;
        objContent += `v ${-length/2} 0 ${-width/2}\n`; // Bottom left
        objContent += `v ${length/2} 0 ${-width/2}\n`;  // Bottom right
        objContent += `v ${length/2} 0 ${width/2}\n`;   // Top right
        objContent += `v ${-length/2} 0 ${width/2}\n`;  // Top left
        objContent += `v ${-length/2} ${height} ${-width/2}\n`; // Top bottom left
        objContent += `v ${length/2} ${height} ${-width/2}\n`;  // Top bottom right
        objContent += `v ${length/2} ${height} ${width/2}\n`;   // Top top right
        objContent += `v ${-length/2} ${height} ${width/2}\n`;  // Top top left
        
        // Add faces for the room
        objContent += `\n# Room Faces\n`;
        objContent += `g Floor\n`;
        objContent += `usemtl ${floorColor.replace('#', 'color_')}\n`;
        objContent += `f 1 2 3 4\n`; // Floor
        
        objContent += `\ng Walls\n`;
        objContent += `usemtl ${wallColor.replace('#', 'color_')}\n`;
        objContent += `f 1 2 6 5\n`; // Wall 1
        objContent += `f 2 3 7 6\n`; // Wall 2
        objContent += `f 3 4 8 7\n`; // Wall 3
        objContent += `f 4 1 5 8\n`; // Wall 4
        
        objContent += `\ng Ceiling\n`;
        objContent += `f 5 6 7 8\n`; // Ceiling
        
        // Add furniture items
        objContent += `\n# Furniture Items\n`;
        activeDesign.furniture.forEach((item, index) => {
          const baseIndex = 8 + index * 8; // Each item adds 8 vertices
          const [px, py, pz] = item.position;
          const [rx, ry, rz] = item.rotation;
          const [sx, sy, sz] = item.scale;
          
          objContent += `\n# Furniture Item: ${item.type}\n`;
          objContent += `# Position: ${px} ${py} ${pz}\n`;
          objContent += `# Rotation: ${rx} ${ry} ${rz}\n`;
          objContent += `# Scale: ${sx} ${sy} ${sz}\n`;
          
          // Add basic cube vertices for the furniture item
          // In a real exporter, you'd reference the actual model
          objContent += `v ${px-sx/2} ${py-sy/2} ${pz-sz/2}\n`;
          objContent += `v ${px+sx/2} ${py-sy/2} ${pz-sz/2}\n`;
          objContent += `v ${px+sx/2} ${py-sy/2} ${pz+sz/2}\n`;
          objContent += `v ${px-sx/2} ${py-sy/2} ${pz+sz/2}\n`;
          objContent += `v ${px-sx/2} ${py+sy/2} ${pz-sz/2}\n`;
          objContent += `v ${px+sx/2} ${py+sy/2} ${pz-sz/2}\n`;
          objContent += `v ${px+sx/2} ${py+sy/2} ${pz+sz/2}\n`;
          objContent += `v ${px-sx/2} ${py+sy/2} ${pz+sz/2}\n`;
          
          // Add faces for the furniture item
          objContent += `\ng Furniture_${index}\n`;
          objContent += `usemtl ${item.color.replace('#', 'color_')}\n`;
          objContent += `f ${baseIndex+1} ${baseIndex+2} ${baseIndex+3} ${baseIndex+4}\n`; // Bottom
          objContent += `f ${baseIndex+1} ${baseIndex+2} ${baseIndex+6} ${baseIndex+5}\n`; // Side 1
          objContent += `f ${baseIndex+2} ${baseIndex+3} ${baseIndex+7} ${baseIndex+6}\n`; // Side 2
          objContent += `f ${baseIndex+3} ${baseIndex+4} ${baseIndex+8} ${baseIndex+7}\n`; // Side 3
          objContent += `f ${baseIndex+4} ${baseIndex+1} ${baseIndex+5} ${baseIndex+8}\n`; // Side 4
          objContent += `f ${baseIndex+5} ${baseIndex+6} ${baseIndex+7} ${baseIndex+8}\n`; // Top
        });
        
        return objContent;
      },

      createDesign: (designData) => set((state) => {
        const newDesign: RoomDesign = {
          ...designData,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return {
          designs: [...state.designs, newDesign],
          activeDesign: newDesign,
        };
      }),

      updateDesign: (design) => set((state) => ({
        designs: state.designs.map((d) => (d.id === design.id ? { ...design, updatedAt: new Date().toISOString() } : d)),
        activeDesign: state.activeDesign?.id === design.id ? { ...design, updatedAt: new Date().toISOString() } : state.activeDesign,
      })),

      deleteDesign: (id) => set((state) => ({
        designs: state.designs.filter((d) => d.id !== id),
        activeDesign: state.activeDesign?.id === id ? null : state.activeDesign,
      })),

      setActiveDesign: (id) => set((state) => ({
        activeDesign: id ? state.designs.find((d) => d.id === id) || null : null,
      })),

      setViewMode: (mode) => set({ viewMode: mode }),

      addFurniture: (furnitureData) => set((state) => {
        if (!state.activeDesign) return state;
        
        const newFurniture: FurnitureItem = {
          ...furnitureData,
          id: crypto.randomUUID(),
        };
        
        const updatedDesign = {
          ...state.activeDesign,
          furniture: [...state.activeDesign.furniture, newFurniture],
          updatedAt: new Date().toISOString(),
        };
        
        return {
          designs: state.designs.map((d) => (d.id === updatedDesign.id ? updatedDesign : d)),
          activeDesign: updatedDesign,
          selectedFurniture: newFurniture.id,
        };
      }),

      updateFurniture: (id, updates) => set((state) => {
        if (!state.activeDesign) return state;
        
        const updatedFurniture = state.activeDesign.furniture.map((item) =>
          item.id === id ? { ...item, ...updates } : item
        );
        
        const updatedDesign = {
          ...state.activeDesign,
          furniture: updatedFurniture,
          updatedAt: new Date().toISOString(),
        };
        
        return {
          designs: state.designs.map((d) => (d.id === updatedDesign.id ? updatedDesign : d)),
          activeDesign: updatedDesign,
        };
      }),

      removeFurniture: (id) => set((state) => {
        if (!state.activeDesign) return state;
        
        const updatedFurniture = state.activeDesign.furniture.filter((item) => item.id !== id);
        
        const updatedDesign = {
          ...state.activeDesign,
          furniture: updatedFurniture,
          updatedAt: new Date().toISOString(),
        };
        
        return {
          designs: state.designs.map((d) => (d.id === updatedDesign.id ? updatedDesign : d)),
          activeDesign: updatedDesign,
          selectedFurniture: state.selectedFurniture === id ? null : state.selectedFurniture,
        };
      }),

      setSelectedFurniture: (id) => set({ selectedFurniture: id }),
    }),
    {
      name: 'room-designs-storage',
    }
  )
);