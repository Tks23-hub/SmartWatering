import React, { useEffect, useState } from "react";
import "../styles/Trees.css";  // ✅ Import the fixed CSS

function Trees() {
  const [trees, setTrees] = useState([]);
  const [treeName, setTreeName] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/tree/all")
      .then((res) => res.json())
      .then((data) => setTrees(data))
      .catch((error) => console.error("Error fetching trees:", error));
  }, []);

  const handleAddTree = (e) => {
    e.preventDefault();
    
    // Get the current date in YYYY-MM-DD format
    const currentDate = new Date().toISOString().split('T')[0];

    fetch("http://localhost:3001/tree/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: treeName, date: currentDate }), // Include date
    })
      .then((res) => res.json())
      .then(() => {
        setTreeName("");
        return fetch("http://localhost:3001/tree/all");
      })
      .then((res) => res.json())
      .then((data) => setTrees(data))
      .catch((error) => console.error("Error adding tree:", error));
  };

  const handleDeleteTree = (id) => {
    fetch(`http://localhost:3001/tree/${id}`, {
      method: "DELETE",
    })
      .then(() => fetch("http://localhost:3001/tree/all"))
      .then((res) => res.json())
      .then((data) => setTrees(data))
      .catch((error) => console.error("Error deleting tree:", error));
  };

  return (
    <div className="trees-container">
      <h1>🌳 Trees List</h1>

      <form className="trees-form" onSubmit={handleAddTree}>
        <input
          type="text"
          placeholder="Enter tree name"
          value={treeName}
          onChange={(e) => setTreeName(e.target.value)}
          required
        />
        <button type="submit" className="btn-add">Add Tree</button>
      </form>

      <ul className="tree-list">
        {trees.map((tree) => (
          <li key={tree.id} className="tree-item">
            <span>🌱 <strong>{tree.plant_name}</strong> - Planted on: {new Date(tree.date).toLocaleDateString()}</span>
            <button className="btn-delete" onClick={() => handleDeleteTree(tree.id)}>❌ Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Trees;
