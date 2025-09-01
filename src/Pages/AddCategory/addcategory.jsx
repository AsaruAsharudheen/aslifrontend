// src/Pages/AddCategory/AddCategory.jsx
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './addcategory.css';
import { FaHome, FaCog, FaUser, FaChartPie } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const BASE_URL =
  import.meta.env.VITE_BACKEND_URL ||
  'https://aslibackend.onrender.com/api/funds';

const AddCategory = () => {
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState('');
  const menuItems = [
    { title: 'Dashboard', icon: <FaHome />, path: '/' },
    { title: 'Categories', icon: <FaHome />, path: '/Category-page' },
    { title: 'Clients', icon: <FaUser />, path: '/clientdetails' },

    { title: 'Reports', icon: <FaChartPie />, path: '/reports' },
  ];
  const handleAddCategory = () => {
    if (!categoryName.trim()) return alert('Enter category name');

    axios
      .post(`${BASE_URL}/categories`, { name: categoryName.trim() })
      .then(() => {
        alert('Category added successfully ✅');
        setCategoryName('');
        navigate('/'); // redirect back to fund page
      })
      .catch(() => alert('Failed to add category ❌'));
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
        <div className="addcategory-container" style={{ marginTop: '90px' }}>
          <h1>Add Category</h1>

          <input
            type="text"
            placeholder="Enter Category Name"
            value={categoryName}
            onChange={e => setCategoryName(e.target.value)}
          />

          <button onClick={handleAddCategory}>+ Add Category</button>
        </div>
      </div>
    </>
  );
};

export default AddCategory;
