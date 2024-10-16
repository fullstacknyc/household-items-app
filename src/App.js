import React, { useState, useEffect } from 'react';
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
      setMessage('Item added successfully!'); // Success message
    } else {
      setMessage('Please enter a valid item name and quantity.');
    }
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
      {message && <p className="message">{message}</p>} {/* Display feedback messages */}
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
            {items
  .filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (!statusFilter || item.status === statusFilter) // Apply status filter if selected
  )
  .sort((a, b) => a.name.localeCompare(b.name))
  .map(item => (
    <div key={item.id}>
      <h3>{item.name}</h3>
      <p>Quantity: {item.quantity}</p>
      <p>Status: {item.status}</p>
      <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
    </div>
  ))}
                  <h3>{item.name}</h3>
                  <p>Quantity: {item.quantity}</p>
                  <p>Status: {item.status}</p>
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