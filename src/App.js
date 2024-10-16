import React, { useState, useEffect, useMemo } from 'react';
import { addItem, getItems, updateItem, deleteItem } from './firestoreService';
import './App.css'; // Add CSS for styling

function App() {
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState(0);
  const [itemStatus, setItemStatus] = useState('In Stock');
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const [message, setMessage] = useState(''); // Feedback message
  const [messageType, setMessageType] = useState(''); // Feedback message type (success, error)

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true); // Start loading
      const itemsList = await getItems();
      setItems(itemsList);
      setLoading(false); // End loading
    };
    fetchItems();
  }, []);

  // Clear feedback message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [message]);

  const handleAddItem = async () => {
    if (itemName && itemQuantity >= 0) {
      const statusToSet = itemQuantity === 0 ? 'Depleted' : itemStatus;
      await addItem({ name: itemName, quantity: itemQuantity, status: statusToSet });
      setItemName('');
      setItemQuantity(0);
      setItemStatus('In Stock');
      const updatedItems = await getItems();
      setItems(updatedItems);
      setMessage('Item added successfully!');
      setMessageType('success'); // Success message
    } else {
      setMessage('Please enter a valid item name and quantity.');
      setMessageType('error'); // Error message
    }
  };

  const handleDeleteItem = async (itemId) => {
    await deleteItem(itemId);
    const updatedItems = await getItems();
    setItems(updatedItems);
    setMessage('Item deleted successfully.');
    setMessageType('success');
  };

  // Debounced search for optimization
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // Firestore query or filter logic here after delay
      // fetchItems(); (if fetching items again)
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const sortedItems = useMemo(() => {
    return items
      .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (!statusFilter || item.status === statusFilter)) // Apply status filter if selected
      .sort((a, b) => a.name.localeCompare(b.name)); // Sort items alphabetically
  }, [items, searchTerm, statusFilter]);

  return (
    <div className="App">
      <h1>Household Items</h1>
      {message && (
        <p className={`message message-${messageType}`}>{message}</p>
      )} {/* Display feedback messages */}
      <label htmlFor="itemName">Item Name:</label>
      <input
        id="itemName"
        type="text"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        placeholder="Enter item name"
      />
      <label htmlFor="itemQuantity">Item Quantity:</label>
      <input
        id="itemQuantity"
        type="number"
        value={itemQuantity}
        onChange={(e) => setItemQuantity(e.target.value)}
        placeholder="Enter item quantity"
      />
      <label htmlFor="itemStatus">Item Status:</label>
      <select
        id="itemStatus"
        value={itemStatus}
        onChange={(e) => setItemStatus(e.target.value)} // Allow user to change status
      >
        <option value="In Stock">In Stock</option>
        <option value="Low">Low</option>
        <option value="Depleted">Depleted</option>
      </select>
      <button onClick={handleAddItem}>Add Item</button>

      {loading ? (
        <p>Loading items...</p>
      ) : (
        <>
          <h2>Search for an item</h2>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for an item"
          />
          
          <h2>Filter by Status</h2>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="In Stock">In Stock</option>
            <option value="Low">Low</option>
            <option value="Depleted">Depleted</option>
          </select>

          <h2>Items</h2>
          <ul>
            {sortedItems.map(item => (
              <li key={item.id}>
                <h3>{item.name}</h3>
                <p>Quantity: {item.quantity}</p>
                <p>Status: {item.status}</p>
                <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;