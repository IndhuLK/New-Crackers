import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import EditProductClient from './EditProductClient';

export async function generateStaticParams() {
  try {
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);
    
    const ids = snapshot.docs.map(doc => ({ id: doc.id }));
    return [...ids, { id: 'fallback' }];
  } catch (error) {
    console.error("Error generating static params:", error);
    return [{ id: 'fallback' }];
  }
}

export default function Page() {
  return <EditProductClient />;
}
