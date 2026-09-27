import { db } from './lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth } from './lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

async function run() {
  try {
    await signInWithEmailAndPassword(auth, 'Carlosbernardo.2002@gmail.com', 'password'); // we don't have password. Can't test auth easily.
  } catch(e) {}
}
