// src/Pages/AddExpense/AddExpense.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import "./addexpense.css";

const BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:9999/api/funds";

const AddExpense = () => {
  const [categories, setCategories] = useState([]);
  const [expenseCategoryId, setExpenseCategoryId] = useState("");
  const [expenseDesc, setExpenseDesc] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState("");

  useEffect(() => {
    axios
      .get(`${BASE_URL}/categories`)
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const handleAddExpense = () => {
    if (!expenseCategoryId) return alert("Select category");
    if (!expenseDesc.trim() || !expenseAmount || !expenseDate)
      return alert("Fill all expense fields");

    axios
      .post(`${BASE_URL}/categories/${expenseCategoryId}/expenses`, {
        description: expenseDesc.trim(),
        amount: Number(expenseAmount),
        date: expenseDate,
      })
      .then(() => {
        alert("Expense added");
        setExpenseDesc("");
        setExpenseAmount("");
        setExpenseDate("");
      })
      .catch(() => alert("Failed to add expense"));
  };

  return (
    <div style={{ marginTop: "90px" }} className="addexpense-container">
      <h1>Add Expense</h1>

      <select
        value={expenseCategoryId}
        onChange={(e) => setExpenseCategoryId(e.target.value)}
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Expense Description"
        value={expenseDesc}
        onChange={(e) => setExpenseDesc(e.target.value)}
      />
      <input
        type="number"
        placeholder="Expense Amount"
        value={expenseAmount}
        onChange={(e) => setExpenseAmount(e.target.value)}
      />
      <input
        type="date"
        value={expenseDate}
        onChange={(e) => setExpenseDate(e.target.value)}
      />
      <button onClick={handleAddExpense}>Add Expense</button>
    </div>
  );
};

export default AddExpense;
