// src/admin/ProductContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
    db, 
    collection, 
    addDoc, 
    getDocs 
} from '../firebaseConfig'; // ⚠️ Path-ஐ உறுதிப்படுத்தவும்

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const productsCollectionRef = collection(db, "products"); // "products" collection-ஐ குறிக்கிறது

    // 1. Fetch Products (Read operation - ProductsList-க்கு தேவை)
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await getDocs(productsCollectionRef);
            const productList = data.docs.map((doc) => ({ 
                ...doc.data(), 
                id: doc.id // Firestore document ID
            }));
            setProducts(productList);
        } catch (error) {
            console.error("Error fetching products:", error);
            // Error handling here
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // App load ஆனதும் product data-வை fetch செய்யும்
        fetchProducts();
    }, []);

    // 2. Add Product (Create operation - AddProduct-லிருந்து அழைக்கப்படுகிறது)
    const addProduct = async (productData) => {
        try {
            // Price மற்றும் MRP-ஐ Number-ஆக மாற்றுதல் (optional but recommended)
            const dataToSave = {
                ...productData,
                price: Number(productData.price),
                mrp: Number(productData.mrp),
                sortOrder: Number(productData.sortOrder),
                createdAt: new Date(), // Timestamp
            };
            
            // 🚀 Add data to Firestore collection "products"
            const docRef = await addDoc(productsCollectionRef, dataToSave);
            
            // Local state-ஐ update செய்யும், இதனால் ProductsList உடனே update ஆகும்
            setProducts((prevProducts) => [
                ...prevProducts, 
                { ...dataToSave, id: docRef.id }
            ]);

            return { success: true, message: "Product successfully saved to Firebase!" };

        } catch (error) {
            console.error("Error adding product to Firestore:", error);
            return { success: false, message: `Error adding product: ${error.message}` };
        }
    };

    return (
        <ProductContext.Provider value={{ products, addProduct, loading, fetchProducts }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error("useProducts must be used within a ProductProvider");
    }
    return context;
};