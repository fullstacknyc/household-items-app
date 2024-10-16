import React, { useState, useEffect } from 'react';
import { addItem, getItems, updateItem, deleteItem } from './firestoreService';
import './App.css';

function App() {
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState(0);
  const [itemStatus, setItemStatus] = useState('In Stock');
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [editingItemId, setEditingItemId] = useState(null); // New state for editing

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
      const statusToSet = itemQuantity === 0 ? 'Depleted' : itemStatus;
      if (editingItemId) {
        // Editing existing item
        await updateItem(editingItemId, { name: itemName, quantity: itemQuantity, status: statusToSet });
        setMessage('Item updated successfully!');
        setEditingItemId(null); // Exit editing mode
      } else {
        // Adding new item
        await addItem({ name: itemName, quantity: itemQuantity, status: statusToSet });
        setMessage('Item added successfully!');
      }
      setItemName('');
      setItemQuantity(0);
      setItemStatus('In Stock');
      const updatedItems = await getItems();
      setItems(updatedItems);
    } else {
      setMessage('Please enter a valid item name and quantity.');
    }
  };

  const handleEditItem = (item) => {
    setItemName(item.name);
    setItemQuantity(item.quantity);
    setItemStatus(item.status);
    setEditingItemId(item.id); // Set the item ID being edited
  };

  const handleDeleteItem = async (itemId) => {
    await deleteItem(itemId);
    const updatedItems = await getItems();
    setItems(updatedItems);
    setMessage('Item deleted successfully.');
  };

  return (
    <div className="App">
      <h1>Household Items</h1>
      {message && <p className="message">{message}</p>}
      <input
        type="text"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        placeholder="Enter item name"
      />
      <input
        type="number"
        value={itemQuantity}
        onChange={(e) => setItemQuantity(e.target.value)}
        placeholder="Enter item quantity"
      />
      <select
        value={itemStatus}
        onChange={(e) => setItemStatus(e.target.value)}
      >
        <option value="In Stock">In Stock</option>
        <option value="Low">Low</option>
        <option value="Depleted">Depleted</option>
      </select>
      <button onClick={handleAddItem}>
        {editingItemId ? 'Save Changes' : 'Add Item'}
      </button>

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
            {items
              .filter(item =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                (!statusFilter || item.status === statusFilter)
              )
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(item => (
                <div key={item.id}>
                  <h3>{item.name}</h3>
                  <p>Quantity: {item.quantity}</p>
                  <p>Status: {item.status}</p>
                  <button onClick={() => handleEditItem(item)}>Edit</button>
                  <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
                </div>
              ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;