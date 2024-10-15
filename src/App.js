import React, { useState, useEffect } from 'react';
import { addItem, getItems, updateItem, deleteItem } from './firestoreService'; // Import functions for Firestore operations

function App() {
  const [itemName, setItemName] = useState(''); // State for item name
  const [itemQuantity, setItemQuantity] = useState(0); // State for item quantity
  const [itemStatus, setItemStatus] = useState('In Stock'); // State for item status
  const [items, setItems] = useState([]); // State for items list
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [statusFilter, setStatusFilter] = useState(''); // State for status filter

  // Fetch items when the app loads
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const itemsList = await getItems();
        setItems(itemsList);
      } catch (error) {
        console.error("Error fetching items:", error); // Error handling for fetching items
      }
    };
    fetchItems();
  }, []);

  // Handle adding a new item
  const handleAddItem = async () => {
    // Ensure item name is not empty
    if (!itemName) {
      alert("Item name cannot be empty!"); // Alert for empty item name
      return;
    }

    // Set status based on quantity
    const statusToSet = itemQuantity === 0 ? 'Depleted' : itemStatus;

    try {
      await addItem({ name: itemName, quantity: itemQuantity, status: statusToSet });
      setItemName(''); // Clear the input
      setItemQuantity(0); // Reset quantity
      setItemStatus('In Stock'); // Reset status
      const updatedItems = await getItems(); // Refresh item list
      setItems(updatedItems);
    } catch (error) {
      console.error("Error adding item:", error); // Error handling for adding item
    }
  };

  // Update item status and quantity
  const handleUpdateStatus = async (itemId, newQuantity) => {
    const newStatus = newQuantity === 0 ? 'Depleted' : 'In Stock';
    try {
      await updateItem(itemId, { quantity: newQuantity, status: newStatus });
      const updatedItems = await getItems();
      setItems(updatedItems);
    } catch (error) {
      console.error("Error updating item:", error); // Error handling for updating item
    }
  };

  // Delete item
  const handleDeleteItem = async (itemId) => {
    try {
      await deleteItem(itemId); // Delete the item
      const updatedItems = await getItems();
      setItems(updatedItems);
    } catch (error) {
      console.error("Error deleting item:", error); // Error handling for deleting item
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Update status filter for user
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  // Filter items based on search term and status filter
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter === '' || item.status === statusFilter)
  );

  return (
    <div className="App">
      <h1>Household Items</h1>
      <input
        type="text"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        placeholder="Enter item name"
      />
      <input
        type="number"
        value={itemQuantity}
        onChange={(e) => setItemQuantity(Number(e.target.value))} // Ensure it's a number
        placeholder="Enter item quantity"
      />
      
      <button onClick={handleAddItem}>Add Item</button>
      
      <h2>Search for an item</h2>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search for an item"
      />

      <h2>Filter by Status</h2>
      <select value={statusFilter} onChange={handleStatusFilterChange}>
        <option value="">All</option>
        <option value="In Stock">In Stock</option>
        <option value="Low">Low</option>
        <option value="Depleted">Depleted</option>
      </select>

      <h2>Items in Stock</h2>
      <ul>
        {filteredItems.map(item => (
          <div key={item.id}>
            <h3>{item.name}</h3>
            <p>Quantity: {item.quantity}</p>
            <p>Status: {item.status}</p>
            <input
              type="number"
              value={item.quantity}
              onChange={(e) => handleUpdateStatus(item.id, Number(e.target.value))}
              placeholder="Update quantity"
            />
            <button onClick={() => handleUpdateStatus(item.id, item.quantity)}>Update</button>
            <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default App;