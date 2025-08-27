// src/Pages/AddCategory/AddCategory.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./addcategory.css";

const BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:9999/api/funds";

const AddCategory = () => {
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState("");

  const handleAddCategory = () => {
    if (!categoryName.trim()) return alert("Enter category name");

    axios
      .post(`${BASE_URL}/categories`, { name: categoryName.trim() })
      .then(() => {
        alert("Category added successfully ✅");
        setCategoryName("");
        navigate("/"); // redirect back to fund page
      })
      .catch(() => alert("Failed to add category ❌"));
  };

  return (
    <div className="addcategory-container">
      <h1>Add Category</h1>

      <input
        type="text"
        placeholder="Enter Category Name"
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
      />

      <button onClick={handleAddCategory}>+ Add Category</button>
    </div>
  );
};

export default AddCategory;
