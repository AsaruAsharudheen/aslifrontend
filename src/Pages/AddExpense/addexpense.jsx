// src/Pages/AddExpense/AddExpense.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import './addexpense.css';
import { FaHome, FaCog, FaUser, FaChartPie } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const BASE_URL =
  import.meta.env.VITE_BACKEND_URL ||
  'https://aslibackend.onrender.com/api/funds';

const AddExpense = () => {
  const [categories, setCategories] = useState([]);
  const [expenseCategoryId, setExpenseCategoryId] = useState('');
  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState('');
  const menuItems = [
    { title: 'Dashboard', icon: <FaHome />, path: '/' },
    { title: 'Categories', icon: <FaHome />, path: '/Category-page' },
    { title: 'Clients', icon: <FaUser />, path: '/clientdetails' },

    { title: 'Reports', icon: <FaChartPie />, path: '/reports' },
  ];
  // Fetch categories on mount
  useEffect(() => {
    axios
      .get(`${BASE_URL}/categories`)
      .then(res => setCategories(res.data))
      .catch(err => console.error('Error fetching categories:', err));
  }, []);

  // Add expense handler
  const handleAddExpense = () => {
    if (!expenseCategoryId) return alert('Select category');
    if (!expenseDesc.trim() || !expenseAmount || !expenseDate)
      return alert('Fill all expense fields');

    axios
      .post(`${BASE_URL}/categories/${expenseCategoryId}/expenses`, {
        description: expenseDesc.trim(),
        amount: Number(expenseAmount),
        date: expenseDate,
      })
      .then(() => {
        alert('Expense added successfully');
        setExpenseDesc('');
        setExpenseAmount('');
        setExpenseDate('');
      })
      .catch(() => alert('Failed to add expense'));
  };

  return (
    <>
      <div className="main-home">
        {/* Sidebar */}
        <div className="sidebar">
          <h2 className="sidebar-header">DEXO</h2>
          <div className="sidebar-menu">
            {menuItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-item ${isActive ? 'active' : ''}`
                }
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-text">{item.title}</span>
              </NavLink>
            ))}
          </div>
        </div>
        <div style={{ marginTop: '90px' }} className="addexpense-container">
          <h1>Add Expense</h1>

          <select
            value={expenseCategoryId}
            onChange={e => setExpenseCategoryId(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Expense Description"
            value={expenseDesc}
            onChange={e => setExpenseDesc(e.target.value)}
          />
          <input
            type="number"
            placeholder="Expense Amount"
            value={expenseAmount}
            onChange={e => setExpenseAmount(e.target.value)}
          />
          <input
            type="date"
            value={expenseDate}
            onChange={e => setExpenseDate(e.target.value)}
          />
          <button onClick={handleAddExpense}>Add Expense</button>
        </div>
      </div>
    </>
  );
};

export default AddExpense;
