// src/Pages/EditPerson/EditPerson.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../Components/Navbar/navbar";
import "./editperson.css";

const BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:9999/api/funds";

const EditPerson = () => {
  const { id } = useParams(); // 👈 must match route param
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    service: "",
    amount: "",
    status: "pending",
    date: "",
  });

  // ✅ Fetch person details
  useEffect(() => {
    if (id) {
      axios
        .get(`${BASE_URL}/persons/${id}`)
        .then((res) => {
          const person = res.data;
          setFormData({
            name: person.name || "",
            service: person.service || "",
            amount: person.amount || "",
            status: person.status || "pending",
            date: person.date ? person.date.split("T")[0] : "",
          });
        })
        .catch((err) => console.error("Error fetching person:", err));
    }
  }, [id]);

  // ✅ Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${BASE_URL}/persons/${id}`, formData);
      alert("Person updated successfully!");
      navigate("/");
    } catch (err) {
      console.error("Error updating person:", err);
      alert("Failed to update person.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="edit-person-container">
        <h2>Edit Person</h2>
        <form onSubmit={handleSubmit} className="edit-person-form">
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Service:</label>
            <input
              type="text"
              name="service"
              value={formData.service}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Amount (₹):</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Status:</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          <div className="form-group">
            <label>Date:</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="save-btn">
            Save Changes
          </button>
        </form>
      </div>
    </>
  );
};

export default EditPerson;
