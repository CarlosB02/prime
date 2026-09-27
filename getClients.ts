import { db } from './lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

async function getClients() {
  const clientsRef = collection(db, 'clients');
  const snapshot = await getDocs(clientsRef);
  const clients = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  console.log('Clients in DB:', JSON.stringify(clients, null, 2));
  process.exit(0);
}

getClients().catch(console.error);
