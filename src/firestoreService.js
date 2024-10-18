// src/firestoreService.js

import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc} from 'firebase/firestore';
import { db } from './firebaseConfig';

// Function to add an item to Firestore
export const addItem = async (item) => {
  try {
    // Ensure the item has a status property
    const statusToSet = item.quantity === 0 ? 'Missing' : 'In Stock';
    const docRef = await addDoc(collection(db, 'items'), { ...item, status: statusToSet });
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
  try {
  const itemRef = doc(db, 'items', itemId);
  await updateDoc(itemRef, updatedData);
  console.log("Item updated successfully");
  } catch (error) {
    console.error("Error updating item: ", error);
  }
}

//Function to delete an item from Firestore
export const deleteItem = async (itemId) => {
  try {
  const itemRef = doc(db, 'items', itemId);
  await deleteDoc(itemRef);
  console.log("Item deleted successfully");
} catch (error) {
  console.error("Error deleting item: ", error);
}
}