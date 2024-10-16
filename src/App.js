import React, { useState, useEffect } from 'react';
import { addItem, getItems, updateItem, deleteItem } from './firestoreService';
import './App.css';

function App() {
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState(0);
  const [itemStatus, setItemStatus] = useState('In Stock');
  const [items, setItems] = useState([]);
  const [editingItemId, setEditingItemId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false); // Loading for actions
  const [message, setMessage] = useState('');

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

  const handleAddOrEditItem = async () => {
    if (itemName && itemQuantity >= 0) {
      setActionLoading(true);
      const statusToSet = itemQuantity === 0 ? 'Depleted' : itemStatus;
      let updatedItems = [...items];

      if (editingItemId) {
        await updateItem(editingItemId, { name: itemName, quantity: itemQuantity, status: statusToSet });
        updatedItems = updatedItems.map(item =>
          item.id === editingItemId ? { ...item, name: itemName, quantity: itemQuantity, status: statusToSet } : item
        );
        setMessage('Item updated successfully!');
        setEditingItemId(null);
      } else {
        const newItem = await addItem({ name: itemName, quantity: itemQuantity, status: statusToSet });
        updatedItems = [...updatedItems, newItem];
        setMessage('Item added successfully!');
      }

      setItems(updatedItems);
      setItemName('');
      setItemQuantity(0);
      setItemStatus('In Stock');
      setActionLoading(false);
    } else {
      setMessage('Please enter a valid item name and quantity.');
    }
  };

  const handleDeleteItem = async (itemId) => {
    const confirmDeletion = window.confirm('Are you sure you want to delete this item?');
    if (confirmDeletion) {
      await deleteItem(itemId);
      setItems(items.filter(item => item.id !== itemId));
      setMessage('Item deleted successfully.');
    }
  };

  const handleEditItem = (item) => {
    setItemName(item.name);
    setItemQuantity(item.quantity);
    setItemStatus(item.status);
    setEditingItemId(item.id);
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
      <button onClick={handleAddOrEditItem} disabled={actionLoading}>
        {actionLoading ? 'Processing...' : editingItemId ? 'Save Changes' : 'Add Item'}
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