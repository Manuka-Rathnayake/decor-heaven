import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { app } from "@/config/firebase";
import { Product } from "@/types";

const db = getFirestore(app);

export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const productsCollection = collection(db, "products");
    const productsSnapshot = await getDocs(productsCollection);
    const productList = productsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];

    return productList;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
    try {
    const allProducts = await getAllProducts();
    // If there are fewer than 4 products, return them all
    if (allProducts.length <= 4) {
      return allProducts;
    }
    // Shuffle the array randomly
    const shuffled = allProducts.sort(() => 0.5 - Math.random());
    // Return the first 4 products
    return shuffled.slice(0, 4);

    } catch (error) {
      console.error("Error fetching featured products:", error);
      return [];
    }
  };