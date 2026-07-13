import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ProductDetailClient from './ProductDetailClient';

export async function generateStaticParams() {
  try {
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);
    
    // Support both ID and slug routes if necessary
    const ids = snapshot.docs.map(doc => ({ id: doc.id }));
    const slugs = snapshot.docs
      .filter(doc => doc.data().slug)
      .map(doc => ({ id: doc.data().slug }));
      
    // Add a generic fallback parameter just in case
    return [...ids, ...slugs, { id: 'fallback' }];
  } catch (error) {
    console.error("Error generating static params:", error);
    return [{ id: 'fallback' }];
  }
}

export default function Page() {
  return <ProductDetailClient />;
}
