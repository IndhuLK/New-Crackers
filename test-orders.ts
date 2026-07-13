import { db } from './src/lib/firebase';
import { collection, getDocs, limit, query } from 'firebase/firestore';

async function main() {
  try {
    const snap = await getDocs(query(collection(db, 'orders'), limit(1)));
    snap.forEach(doc => console.log('Doc ID:', doc.id, '\nData:', doc.data()));
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
}

main();
