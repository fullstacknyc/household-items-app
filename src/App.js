import React, { useState, useEffect, useMemo } from 'react';
import { addItem, getItems, updateItem, deleteItem } from './firestoreService';
import './App.css';

function App() {
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState(0);
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      const itemsList = await getItems();
      setItems(itemsList);
      setLoading(false);
    };
    fetchItems();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleAddItem = async () => {
    if (itemName && itemQuantity >= 0) {
      await addItem({ name: itemName, quantity: itemQuantity });
      setItemName('');
      setItemQuantity(0);
      const updatedItems = await getItems();
      setItems(updatedItems);
      setMessage('Item added successfully!');
      setMessageType('success');
    } else {
      setMessage('Please enter a valid item name and quantity.');
      setMessageType('error');
    }
  };

  const handleDeleteItem = async (itemId) => {
    await deleteItem(itemId);
    const updatedItems = await getItems();
    setItems(updatedItems);
    setMessage('Item deleted successfully.');
    setMessageType('success');
  };

  const toggleItemStatus = async (itemId) => {
    const item = items.find((item) => item.id === itemId);
    if (item) {
      const newStatus = item.status === 'In Stock' ? 'Missing' : 'In Stock';
      await updateItem(itemId, { status: newStatus });
      const updatedItems = await getItems();
      setItems(updatedItems);
      setMessage(`Item status updated to ${newStatus}`);
      setMessageType('success');
    }
  };

  const sortedItems = useMemo(() => {
    return items
      .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (!statusFilter || item.status === statusFilter))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [items, searchTerm, statusFilter]);

  return (
    <div className="App">
      <h1>Household Items</h1>
      {message && <p className={`message message-${messageType}`}>{message}</p>}
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
            <option value="Missing">Missing</option> {/* Added Missing option */}
          </select>

          <h2>Items</h2>
          <ul>
            {sortedItems.map(item => (
              <li key={item.id}>
                <h3>{item.name}</h3>
                <p>Quantity: {item.quantity}</p>
                <p>Status: {item.status}</p>
                <button onClick={() => toggleItemStatus(item.id)}>
                  Mark as {item.status === 'In Stock' ? 'Missing' : 'In Stock'}
                </button>
                <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
              </li>
            ))}
          </ul>

          <h2>Grocery List (Missing Items)</h2>
          <ul>
            {items.filter(item => item.status === 'Missing').map(item => (
              <li key={item.id}>
                <h3>{item.name}</h3>
                <p>Quantity: {item.quantity}</p>
                <button onClick={() => toggleItemStatus(item.id)}>Mark as In Stock</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
