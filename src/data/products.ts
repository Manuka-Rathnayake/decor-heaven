
import { Product, Category } from "../types";

export const products: Product[] = [
  {
    id: "1",
    name: "Beaumont Sofa",
    price: 1299,
    description: "A modern sofa with clean lines and comfortable cushions. Perfect for contemporary living spaces.",
    category: "sofas",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    rating: 4.8,
    stock: 15,
    featured: true,
    colors: ["beige", "gray", "blue"],
    materials: ["fabric", "wood"],
    dimensions: {
      width: 220,
      height: 85,
      depth: 95
    }
  },
  {
    id: "2",
    name: "Oakridge Dining Table",
    price: 899,
    description: "Solid oak dining table with a natural finish. Seats up to 6 people comfortably.",
    category: "tables",
    image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    rating: 4.7,
    stock: 8,
    featured: true,
    colors: ["oak", "walnut"],
    materials: ["solid wood"],
    dimensions: {
      width: 180,
      height: 75,
      depth: 90
    }
  },
  {
    id: "3",
    name: "Aspen Lounge Chair",
    price: 599,
    description: "Comfortable lounge chair with a sturdy frame and soft cushioning. Perfect for relaxing.",
    category: "chairs",
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    rating: 4.5,
    stock: 20,
    colors: ["beige", "gray", "green"],
    materials: ["fabric", "wood"],
    dimensions: {
      width: 80,
      height: 90,
      depth: 85
    }
  },
  {
    id: "4",
    name: "Midnight Bookshelf",
    price: 349,
    description: "Modern bookshelf with plenty of storage space for your favorite books and decorative items.",
    category: "storage",
    image: "https://images.unsplash.com/photo-1588200908342-23b585c03e26?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    rating: 4.3,
    stock: 12,
    colors: ["black", "white", "oak"],
    materials: ["engineered wood", "metal"],
    dimensions: {
      width: 120,
      height: 200,
      depth: 40
    }
  },
  {
    id: "5",
    name: "Camden Bed Frame",
    price: 799,
    description: "Sturdy bed frame with a sleek design. Available in multiple sizes.",
    category: "beds",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    rating: 4.6,
    stock: 10,
    featured: true,
    colors: ["oak", "walnut", "white"],
    materials: ["wood", "metal"],
    dimensions: {
      width: 160,
      height: 120,
      depth: 210
    }
  },
  {
    id: "6",
    name: "Oslo Coffee Table",
    price: 299,
    description: "Minimalist coffee table with clean lines and a sleek finish.",
    category: "tables",
    image: "https://images.unsplash.com/photo-1611486212355-d276af4581c0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    rating: 4.4,
    stock: 18,
    colors: ["oak", "walnut", "black"],
    materials: ["wood", "glass"],
    dimensions: {
      width: 120,
      height: 45,
      depth: 60
    }
  },
  {
    id: "7",
    name: "Willow Dining Chair",
    price: 149,
    description: "Comfortable dining chair with a beautiful design. Sold as a set of 2.",
    category: "chairs",
    image: "https://images.unsplash.com/photo-1519947486511-46149fa0a254?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    rating: 4.2,
    stock: 24,
    colors: ["beige", "gray", "black"],
    materials: ["fabric", "wood"],
    dimensions: {
      width: 50,
      height: 85,
      depth: 55
    }
  },
  {
    id: "8",
    name: "Montauk Sectional Sofa",
    price: 1899,
    description: "Large sectional sofa with plenty of space for the whole family. Customizable configuration.",
    category: "sofas",
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    rating: 4.9,
    stock: 5,
    featured: true,
    colors: ["gray", "beige", "blue"],
    materials: ["fabric", "wood"],
    dimensions: {
      width: 300,
      height: 85,
      depth: 200
    }
  },
  {
    id: "9",
    name: "Hazel Nightstand",
    price: 199,
    description: "Compact nightstand with a drawer and open shelf for storage.",
    category: "storage",
    image: "https://images.unsplash.com/photo-1551298370-9d3d53740c72?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1773&q=80",
    rating: 4.3,
    stock: 15,
    colors: ["oak", "walnut", "white"],
    materials: ["wood"],
    dimensions: {
      width: 45,
      height: 60,
      depth: 45
    }
  },
  {
    id: "10",
    name: "Loft Desk",
    price: 399,
    description: "Modern desk with clean lines and ample workspace. Perfect for a home office.",
    category: "tables",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1735&q=80",
    rating: 4.5,
    stock: 10,
    colors: ["white", "black", "oak"],
    materials: ["engineered wood", "metal"],
    dimensions: {
      width: 140,
      height: 75,
      depth: 70
    }
  },
];

export const categories: Category[] = [
  { id: "sofas", name: "Sofas", count: 2 },
  { id: "tables", name: "Tables", count: 3 },
  { id: "chairs", name: "Chairs", count: 2 },
  { id: "storage", name: "Storage", count: 2 },
  { id: "beds", name: "Beds", count: 1 }
];

export const priceRanges = [
  { min: 0, max: 300, label: "Under $300" },
  { min: 300, max: 600, label: "$300 - $600" },
  { min: 600, max: 1000, label: "$600 - $1000" },
  { min: 1000, max: 2000, label: "$1000 - $2000" },
  { min: 2000, max: 10000, label: "$2000+" }
];

export const materialOptions = [
  "fabric",
  "wood",
  "metal",
  "glass",
  "leather",
  "engineered wood",
  "solid wood"
];

export const colorOptions = [
  "beige",
  "gray",
  "blue",
  "green",
  "black",
  "white",
  "oak",
  "walnut"
];
