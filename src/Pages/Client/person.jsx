// src/Pages/Client/Client.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import './person.css';
import Navbar from '../../Components/Navbar/navbar';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaCog, FaUser, FaChartPie } from 'react-icons/fa';

const BASE_URL =
  import.meta.env.VITE_BACKEND_URL ||
  'https://aslibackend.onrender.com/api/funds';

const Client = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const navigate = useNavigate();

  const menuItems = [
    { title: 'Dashboard', icon: <FaHome />, path: '/' },
    { title: 'Categories', icon: <FaHome />, path: '/Category-page' },
    { title: 'Clients', icon: <FaUser />, path: '/clientdetails' },
    
    { title: 'Reports', icon: <FaChartPie />, path: '/reports' },
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/categories/details`);
      setCategories(res.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  return (
    <>
      <Navbar />
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

        <div className="client-container">
          {/* Category List */}
          {!selectedCategory && (
            <div className="categories-list">
              <div className="categories-grid">
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    className="category-card"
                    onClick={() => setSelectedCategory(cat)}
                  >
                    📂 {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Persons List */}
          {selectedCategory && (
            <div className="persons-list">
              <div className="list-header">
                <h2>{selectedCategory.name} - Clients</h2>
                <div className="actions">
                         <button
                    className="back-btn"
                    onClick={() => setSelectedCategory(null)}
                  >
                    ⬅ Back
                  </button>
                  <button
                    className="add-btn"
                    onClick={() =>
                      navigate('/addperson', {
                        state: { categoryId: selectedCategory._id },
                      })
                    }
                  >
                    ➕ Add Person
                  </button>
           
                </div>
              </div>

              {selectedCategory.persons.length === 0 ? (
                <p>No persons in this category.</p>
              ) : (
                <div className="persons-grid">
                  {selectedCategory.persons.map((person) => (
                    <div
                      key={person._id}
                      className="person-card"
                      onClick={() => setSelectedPerson(person)}
                    >
                      <h3>{person.name}</h3>
                      <p>₹{person.amount?.toLocaleString() || '0'}</p>
                      <span className={`status ${person.status}`}>
                        {person.status || 'pending'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Person Details Modal */}
          {selectedPerson && (
            <div
              className="modal-overlay"
              onClick={() => setSelectedPerson(null)}
            >
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button
                  className="close-btn"
                  onClick={() => setSelectedPerson(null)}
                >
                  ✖
                </button>
                <h2>{selectedPerson.name}</h2>
                <p>
                  <strong>Service:</strong> {selectedPerson.service || '-'}
                </p>
                <p>
                  <strong>Amount:</strong> ₹
                  {selectedPerson.amount?.toLocaleString() || '0'}
                </p>
                <p>
                  <strong>Status:</strong> {selectedPerson.status || 'pending'}
                </p>
                <p>
                  <strong>Date:</strong>{' '}
                  {selectedPerson.date
                    ? new Date(selectedPerson.date).toLocaleDateString()
                    : '-'}
                </p>
                <p>
                  <strong>Notes:</strong> {selectedPerson.notes || '-'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Client;
