import React, { useEffect, useState } from "react";
import "../styles/Trees.css";  

function Trees() {
  const [trees, setTrees] = useState([]);
  const [treeName, setTreeName] = useState("");
  const [showPlantAnimation, setShowPlantAnimation] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3001/tree/all")
      .then((res) => res.json())
      .then((data) => setTrees(data))
      .catch((error) => console.error("Error fetching trees:", error));
  }, []);

  const handleAddTree = (e) => {
    e.preventDefault();
    
    const currentDate = new Date().toISOString().split('T')[0];

    fetch("http://localhost:3001/tree/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: treeName, date: currentDate }), 
    })
      .then((res) => res.json())
      .then(() => {
        setTreeName("");
        setShowPlantAnimation(true);  // 🌱 Show animation for 3 seconds
        setTimeout(() => setShowPlantAnimation(false), 3000);
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

      {showPlantAnimation && (
        <div className="plant-animation">
          <img src="/images/plant-growing.gif" alt="Plant Growing" />
        </div>
      )}

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
            <span>🌱 <strong>{tree.name || tree.plant_name}</strong> - Planted on: {new Date(tree.date).toLocaleDateString()}</span>
            <button className="btn-delete" onClick={() => handleDeleteTree(tree.id)}>❌ Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Trees;
