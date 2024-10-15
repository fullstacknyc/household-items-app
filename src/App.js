
import React, { useState, useEffect } from 'react';
import { addItem, getItems, updateItem, deleteItem } from './firestoreService'; // Make sure to import the new functions

function App() {
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState(0);
  const [itemStatus, setItemStatus] = useState('In Stock');
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // ('') no filter by default

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
    if (itemName && itemQuantity >= 0) {
      // Automatically set status to depleted if quantity is 0
      const statusToSet = itemQuantity === 0 ? 'Depleted' : itemStatus;
      await addItem({ name: itemName, quantity: itemQuantity, status: itemStatus });
      setItemName(''); // Clear the input
      setItemQuantity(0); // Clear the Quantity
      setItemStatus('In Stock'); // Set to In Stock
      const updatedItems = await getItems(); // Refresh item list
      setItems(updatedItems);
    }
  };

  // Update item status based on quantity
  const handleUpdateStatus = async (itemId, newQuantity) => {
    // Automatically  update status to depleted if quantity is 0.
    const newStatus = newQuantity === 0 'Depleted : 'In Stock';
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
  
  const  handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    };
  
  //Update status filter for user
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value)
    };
    
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
        onChange={ (e) => setItemQuantity(e.target.value)}
        placeholder="Enter item quantity"
      />
      
      <button onClick={handleAddItem}>Add Item</button>
      
      <h2>Search for an item </h2>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search for an item"
        />
        
      <h2>Filter by Status </h2>
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
            {/* Edit and Delete Buttons */}
            <button onClick={() => handleUpdateStatus(item.id, 'Low')}>Set Low</button>
            <button onClick={() => handleUpdateStatus(item.id, 'Depleted')}>Set Depleted</button>
            <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default App;
