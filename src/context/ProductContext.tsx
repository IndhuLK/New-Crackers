"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  img?: string;
  sortOrder: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  mrp?: number | null;
  category: string;
  categorySlug?: string;
  stock?: number | null;
  outOfStock?: boolean;
  image?: string;
  images?: string[];
  description?: string;
  highlights?: string;
  safety?: string;
  slug?: string;
  sortOrder?: number;
  tag?: string;
  productCode?: string;
  rating?: string;
  reviewCount?: number;
  unit?: string;
  isHidden?: boolean;
  videoUrl?: string;
  isBestSeller?: boolean;
  isFreshArrival?: boolean;
}

interface ProductContextType {
  products: Product[];
  categories: Category[];
  loading: boolean;
  updateCategoryOrder: (newOrder: Category[]) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addCategory: (cat: Omit<Category, "id">) => Promise<void>;
  updateCategory: (id: string, data: Partial<Category>) => Promise<void>;
  addProduct: (product: Omit<Product, "id">) => Promise<void>;
  updateProductOrder: (newOrder: Product[]) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<void>;
}

const ProductContext = createContext<ProductContextType>({
  products: [],
  categories: [],
  loading: true,
  updateCategoryOrder: async () => {},
  deleteCategory: async () => {},
  addCategory: async () => {},
  updateCategory: async () => {},
  addProduct: async () => {},
  updateProductOrder: async () => {},
  deleteProduct: async () => {},
  updateProduct: async () => {},
});

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let productsLoaded = false;
    let categoriesLoaded = false;

    const checkLoading = () => {
      if (productsLoaded && categoriesLoaded) setLoading(false);
    };

    const qProducts = query(collection(db, "products"));
    const unsubProducts = onSnapshot(qProducts, (snapshot) => {
      const prods: Product[] = [];
      snapshot.forEach((doc) => {
        prods.push({ id: doc.id, ...doc.data() } as Product);
      });
      // Sort logic from chunk
      prods.sort((a, b) => (Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0));
      setProducts(prods);
      productsLoaded = true;
      checkLoading();
    }, (error) => {
      console.error("Error fetching products:", error);
      productsLoaded = true;
      checkLoading();
    });

    const qCategories = query(collection(db, "categories"));
    const unsubCategories = onSnapshot(qCategories, (snapshot) => {
      const cats: Category[] = [];
      snapshot.forEach((doc) => {
        cats.push({ id: doc.id, ...doc.data() } as Category);
      });
      cats.sort((a, b) => (Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0));
      setCategories(cats);
      categoriesLoaded = true;
      checkLoading();
    }, (error) => {
      console.error("Error fetching categories:", error);
      categoriesLoaded = true;
      checkLoading();
    });

    return () => {
      unsubProducts();
      unsubCategories();
    };
  }, []);

  const updateCategoryOrder = async (newOrder: Category[]) => {
    try {
      const promises = newOrder.map((cat, index) => {
        return updateDoc(doc(db, "categories", cat.id), { sortOrder: index });
      });
      await Promise.all(promises);
    } catch (error) {
      console.error("Error updating category order:", error);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await deleteDoc(doc(db, "categories", id));
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const addCategory = async (cat: Omit<Category, "id">) => {
    try {
      await addDoc(collection(db, "categories"), cat);
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const updateCategory = async (id: string, data: Partial<Category>) => {
    try {
      await updateDoc(doc(db, "categories", id), data);
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const addProduct = async (product: Omit<Product, "id">) => {
    try {
      await addDoc(collection(db, "products"), product);
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  };

  const updateProductOrder = async (newOrder: Product[]) => {
    try {
      const promises = newOrder.map((prod, index) => {
        return updateDoc(doc(db, "products", prod.id), { sortOrder: index });
      });
      await Promise.all(promises);
    } catch (error) {
      console.error("Error updating product order:", error);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, "products", id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const updateProduct = async (id: string, data: Partial<Product>) => {
    try {
      await updateDoc(doc(db, "products", id), data);
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  };

  return (
    <ProductContext.Provider value={{ 
      products, 
      categories, 
      loading, 
      updateCategoryOrder,
      deleteCategory,
      addCategory,
      updateCategory,
      addProduct,
      updateProductOrder,
      deleteProduct,
      updateProduct
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);
