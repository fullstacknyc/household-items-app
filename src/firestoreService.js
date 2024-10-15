// src/firestoreService.js

import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc} from 'firebase/firestore';
import { db } from './firebaseConfig';

// Function to add an item to Firestore
export const addItem = async (item) => {
  try {
    const docRef = await addDoc(collection(db, 'items'), item);
    console.log('Document written with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

// Function to get all items from Firestore
export const getItems = async () => {
  const querySnapshot = await getDocs(collection(db, 'items'));
  const itemsList = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
  return itemsList;
};

//Function to update an item in Firestore
export const updateItem = async (itemId, updatedData) => {
  const itemRef = doc(db, 'items', itemId);
  await updateDoc(itemRef, updatedData);
}

//Function to delete an item from Firestore
export const deleteItem = async (itemId) => {
  const itemRef = doc(db, 'items', itemId);
  await deleteDoc(itemRef);
}