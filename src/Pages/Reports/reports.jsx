// src/Pages/Reports/Reports.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../Components/Navbar/navbar';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { FaHome, FaCog, FaUser, FaChartPie } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import './reports.css';

const BASE_URL =
  import.meta.env.VITE_BACKEND_URL ||
  'https://aslibackend.onrender.com/api/funds';

const Reports = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const menuItems = [
    { title: 'Dashboard', icon: <FaHome />, path: '/' },
    { title: 'Categories', icon: <FaHome />, path: '/Category-page' },
    { title: 'Clients', icon: <FaUser />, path: '/clientdetails' },
  
    { title: 'Reports', icon: <FaChartPie />, path: '/reports' },
  ];

  useEffect(() => {
    axios
      .get(`${BASE_URL}/categories/details`)
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, []);

  const filterByDate = items => {
    if (!fromDate && !toDate) return items;
    return items.filter(item => {
      const itemDate = new Date(item.date);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;
      if (from && itemDate < from) return false;
      if (to && itemDate > to) return false;
      return true;
    });
  };

  const getCategorySummary = category => {
    const filteredPersons = filterByDate(category.persons || []);
    const filteredExpenses = filterByDate(category.expenses || []);
    const totalFund = filteredPersons.reduce(
      (sum, p) => sum + (p.amount || 0),
      0
    );
    const totalExpenses = filteredExpenses.reduce(
      (sum, e) => sum + (e.amount || 0),
      0
    );
    const balance = totalFund - totalExpenses;
    return {
      totalFund,
      totalExpenses,
      balance,
      filteredPersons,
      filteredExpenses,
    };
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

        {/* Main Reports Container */}
        <div className="reports-container">
          <h2 style={{backgroundColor:' background: linear-gradient(135deg, #6a11cb, #2575fc);'}}>Reports</h2>

          <div className="reports-categories">
            {/* <h3>Categories</h3> */}
            <ul>
              {categories.map(cat => (
                <li
                  key={cat._id}
                  className={selectedCategory?._id === cat._id ? 'active' : ''}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat.name}
                </li>
              ))}
            </ul>
          </div>

          {selectedCategory && (
            <div className="reports-details">
              <h3>{selectedCategory.name}</h3>

              {/* Date Filter */}
              <div style={{ paddingTop: '40px' }} className="reports-filter">
                <label>From:</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={e => setFromDate(e.target.value)}
                />
                <label>To:</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={e => setToDate(e.target.value)}
                />
                <button onClick={() => {}}>Apply</button>
              </div>

              {/* Summary */}
              <div style={{ paddingTop: '40px' }} className="reports-summary">
                {(() => {
                  const { totalFund, totalExpenses, balance } =
                    getCategorySummary(selectedCategory);
                  return (
                    <div className="summary-cards">
                      <div className="card income">
                        <h3>Total Fund</h3>
                        <p>₹{totalFund.toLocaleString()}</p>
                      </div>

                      <div className="card expense">
                        <h3>Total Expenses</h3>
                        <p>₹{totalExpenses.toLocaleString()}</p>
                      </div>

                      <div className="card balance">
                        <h3>Balance</h3>
                        <p>₹{balance.toLocaleString()}</p>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Graph */}
              <div style={{ paddingTop: '40px' }} className="reports-graph">
                <h4>Funds vs Expenses</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[
                      {
                        name: selectedCategory.name,
                        Fund: getCategorySummary(selectedCategory).totalFund,
                        Expenses:
                          getCategorySummary(selectedCategory).totalExpenses,
                      },
                    ]}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  >
                    {/* <XAxis dataKey="name" /> */}
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Fund" fill="#0d6efd" />
                    <Bar dataKey="Expenses" fill="#dc3545" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Reports;
