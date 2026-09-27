import { db } from './lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

async function addMockClient() {
  const clientsRef = collection(db, 'clients');
  const mockClient = {
    name: 'João Silva Teste',
    avatar: 'https://picsum.photos/100/100?random=42',
    plan: 'Premium Transformation',
    status: 'active',
    lastActive: '1m atrás',
    contact: '+351 900 000 000',
    progress: 75,
    evaluationStatus: 'pendente',
    isNew: true,
    paymentStatus: 'pago',
    birthday: '12-05',
    age: 30,
    paymentExpiryDate: '2027-01-01',
    isPaying: true,
    hasSubscription: true,
    nextEvaluationDate: '2026-10-01'
  };
  await addDoc(clientsRef, mockClient);
  console.log('Cliente fictício adicionado com sucesso!');
  process.exit(0);
}

addMockClient().catch(console.error);
