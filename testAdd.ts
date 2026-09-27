import { db } from './lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth } from './lib/firebase';

async function testAdd() {
  const clientsRef = collection(db, 'clients');
  const mockClient = {
    name: 'Cliente Teste Fictício',
    ownerId: "mock-uid", // Just using mock since we are not authenticated in node, wait this will fail isSignedIn
    createdAt: serverTimestamp()
  };
  try {
    await addDoc(clientsRef, mockClient);
    console.log('Success');
  } catch (e) {
    console.error('Error:', e);
  }
  process.exit(0);
}

testAdd();
