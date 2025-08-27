// src/Pages/AddFund/AddFund.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import "./addfund.css";

const BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "https://aslibackend.onrender.com/api/funds";

const AddFund = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");

  // Person states
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [personName, setPersonName] = useState("");
  const [personAmount, setPersonAmount] = useState("");
  const [personDate, setPersonDate] = useState("");
  const [personService, setPersonService] = useState("");
  const [personStatus, setPersonStatus] = useState("pending");

  // Expense states
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

  // --- Add Category ---
  const handleAddCategory = () => {
    if (!categoryName.trim()) return alert("Enter category name");
    axios
      .post(`${BASE_URL}/categories`, { name: categoryName.trim() })
      .then((res) => {
        setCategories((prev) => [...prev, res.data]);
        setCategoryName("");
        alert("Category added");
      })
      .catch(() => alert("Failed to add category"));
  };

  // --- Add Person ---
  const handleAddPerson = () => {
    if (!selectedCategoryId) return alert("Select category");
    if (!personName.trim() || !personAmount || !personDate || !personService)
      return alert("Fill all person fields");

    axios
      .post(`${BASE_URL}/categories/${selectedCategoryId}/persons`, {
        name: personName.trim(),
        amount: Number(personAmount),
        date: personDate,
        service: personService.trim(),
        status: personStatus,
      })
      .then((res) => {
        const newPerson = res.data;
        setCategories((prevCategories) =>
          prevCategories.map((cat) =>
            cat._id === selectedCategoryId
              ? {
                  ...cat,
                  persons: Array.isArray(cat.persons)
                    ? [...cat.persons, newPerson]
                    : [newPerson],
                }
              : cat
          )
        );
        alert("Person added");
        setPersonName("");
        setPersonAmount("");
        setPersonDate("");
        setPersonService("");
        setPersonStatus("pending");
      })
      .catch(() => alert("Failed to add person"));
  };

  // --- Add Expense ---
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
    <div style={{ marginTop: "90px" }} className="addfund-container">
      <h1>Add Fund Details</h1>

      {/* Add Category */}
      <section>
        <h2>Add Category</h2>
        <input
          type="text"
          placeholder="Category Name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
        <button onClick={handleAddCategory}>Add Category</button>
      </section>

      {/* Add Person */}
      <section>
        <h2>Add Person</h2>
        <select
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
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
          placeholder="Person Name"
          value={personName}
          onChange={(e) => setPersonName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          value={personAmount}
          onChange={(e) => setPersonAmount(e.target.value)}
        />
        <input
          type="date"
          value={personDate}
          onChange={(e) => setPersonDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="Service"
          value={personService}
          onChange={(e) => setPersonService(e.target.value)}
        />
        <select
          value={personStatus}
          onChange={(e) => setPersonStatus(e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
        </select>

        <button onClick={handleAddPerson}>Add Person</button>
      </section>

      {/* Add Expense */}
      <section>
        <h2>Add Expense</h2>
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
      </section>
    </div>
  );
};

export default AddFund;
