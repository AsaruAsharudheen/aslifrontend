// src/Pages/AddPerson/AddPerson.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import "./addperson.css";

const BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:9999/api/funds";

const AddPerson = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [personName, setPersonName] = useState("");
  const [personAmount, setPersonAmount] = useState("");
  const [personDate, setPersonDate] = useState(""); // ✅ stays empty until user selects
  const [personService, setPersonService] = useState("");
  const [personStatus, setPersonStatus] = useState("pending");

  useEffect(() => {
    axios
      .get(`${BASE_URL}/categories`)
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const handleAddPerson = () => {
    if (!selectedCategoryId) return alert("Select category");
    if (!personName.trim() || !personAmount || !personDate || !personService)
      return alert("Fill all person fields");

    axios
      .post(`${BASE_URL}/categories/${selectedCategoryId}/persons`, {
        name: personName.trim(),
        amount: Number(personAmount),
        date: personDate, // ✅ correctly sends selected date
        service: personService.trim(),
        status: personStatus,
      })
      .then(() => {
        alert("Person added successfully");
        setPersonName("");
        setPersonAmount("");
        setPersonDate(""); // ✅ reset
        setPersonService("");
        setPersonStatus("pending");
      })
      .catch(() => alert("Failed to add person"));
  };

  return (
    <div style={{ marginTop: "90px" }} className="addperson-container">
      <h1>Add Person</h1>

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

      {/* ✅ Date Input */}
      <input
        type="date"
        value={personDate}
        onChange={(e) => setPersonDate(e.target.value)}
        max={new Date().toISOString().split("T")[0]} // allow only today or past
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
    </div>
  );
};

export default AddPerson;
