import { db } from './src/lib/firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

async function main() {
  try {
    const snap = await getDocs(collection(db, 'categories'));
    let index = 0;
    for (const d of snap.docs) {
      const data = d.data();
      if (data.sortOrder === undefined) {
        await updateDoc(doc(db, 'categories', d.id), { sortOrder: index });
        console.log(`Updated ${d.id} with sortOrder ${index}`);
      }
      index++;
    }
    console.log('Done!');
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
}

main();
