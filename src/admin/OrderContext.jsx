import { createContext, useContext, useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc, Timestamp, getDocs, query, orderBy } from "firebase/firestore";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, "orders"), orderBy("orderDate", "desc"));
            const snapshot = await getDocs(q);
            const ordersData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setOrders(ordersData);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const addOrder = async (orderData) => {
        try {
            const docRef = await addDoc(collection(db, "orders"), {
                ...orderData,
                orderDate: Timestamp.now(),
                paymentStatus: "PENDING",
                orderStatus: "NEW_WHATSAPP",
                deliveryDate: null,
            });
            console.log("Order saved to Firestore with ID: ", docRef.id);
            // Refresh orders after adding
            fetchOrders();
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error("Error saving order to Firestore:", error);
            return { success: false, error: error.message };
        }
    };

    return (
        <OrderContext.Provider value={{ orders, loading, fetchOrders, addOrder }}>
            {children}
        </OrderContext.Provider>
    );
};

export const useOrders = () => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error("useOrders must be used within an OrderProvider");
    }
    return context;
};