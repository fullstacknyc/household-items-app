import React, { useState, useEffect } from 'react';
import { addItem, getItems, updateItem, deleteItem } from './firestoreService'; // Make sure to import the new functions

function App() {
  const [itemName, setItemName] = useState('');
  const [items, setItems] = useState([]);

  // Fetch items when the app loads
  useEffect(() => {
    const fetchItems = async () => {
      const itemsList = await getItems();
      setItems(itemsList);
    };
    fetchItems();
  }, []);

  // Handle adding a new item
  const handleAddItem = async () => {
    if (itemName) {
      await addItem({ name: itemName, status: 'In Stock' });
      setItemName(''); // Clear the input
      const updatedItems = await getItems(); // Refresh item list
      setItems(updatedItems);
    }
  };

  // Update item status
  const handleUpdateStatus = async (itemId, newStatus) => {
    await updateItem(itemId, { status: newStatus }); // Ensure updateItem is defined in firestoreService
    const updatedItems = await getItems();
    setItems(updatedItems);
  };

  // Delete item
  const handleDeleteItem = async (itemId) => {
    await deleteItem(itemId); // Ensure deleteItem is defined in firestoreService
    const updatedItems = await getItems();
    setItems(updatedItems);
  };

  return (
    <div className="App">
      <h1>Household Items</h1>
      <input
        type="text"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        placeholder="Enter item name"
      />
      <button onClick={handleAddItem}>Add Item</button>

      <h2>Items in Stock</h2>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.name} - {item.status}
            <button onClick={() => handleUpdateStatus(item.id, 'Low')}>Set Low</button>
            <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
