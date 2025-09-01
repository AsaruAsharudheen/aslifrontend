// src/Pages/Fund/Fund.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Navbar from '../../Components/Navbar/navbar';
import './category.css';
import { FaHome, FaCog, FaUser, FaChartPie } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const BASE_URL =
  import.meta.env.VITE_BACKEND_URL ||
  'https://aslibackend.onrender.com/api/funds';

const Category = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const menuItems = [
    { title: 'Dashboard', icon: <FaHome />, path: '/' },
    { title: 'Categories', icon: <FaHome />, path: '/Category-page' },
    { title: 'Clients', icon: <FaUser />, path: '/clientdetails' },
  
    { title: 'Reports', icon: <FaChartPie />, path: '/reports' },
  ];
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    axios
      .get(`${BASE_URL}/categories/details`)
      .then(res => setCategories(res.data))
      .catch(err => console.error('Error fetching categories:', err));
  };

  const selectedCategory =
    categories.find(c => c._id === selectedCategoryId) || null;

  const filterByDate = (items, dateField) => {
    return items.filter(item => {
      if (!item[dateField]) return false;
      const itemDate = new Date(item[dateField]);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;
      if (from && itemDate < from) return false;
      if (to && itemDate > to) return false;
      return true;
    });
  };

  const filteredPersons = selectedCategory
    ? filterByDate(selectedCategory.persons, 'date')
    : [];

  const filteredExpenses = selectedCategory
    ? filterByDate(selectedCategory.expenses, 'date')
    : [];

  const totalFund = filteredPersons.reduce(
    (sum, p) => sum + (p.amount || 0),
    0
  );
  const totalExpenses = filteredExpenses.reduce(
    (sum, e) => sum + (e.amount || 0),
    0
  );
  const balance = totalFund - totalExpenses;

  

  const downloadCategoryPDF = () => {
    if (!selectedCategory) return;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Category: ${selectedCategory.name}`, 14, 15);

    let startY = 25;

    const personsToUse = filteredData.persons.length
      ? filteredData.persons
      : selectedCategory.persons;
    const expensesToUse = filteredData.expenses.length
      ? filteredData.expenses
      : selectedCategory.expenses;

    const totalFund = personsToUse.reduce((sum, p) => sum + (p.amount || 0), 0);
    const totalExpenses = expensesToUse.reduce(
      (sum, e) => sum + (e.amount || 0),
      0
    );
    const balance = totalFund - totalExpenses;

    // Summary table
    autoTable(doc, {
      startY,
      head: [['Total Fund', 'Total Expenses', 'Balance']],
      body: [
        [
          `₹${totalFund.toLocaleString()}`,
          `₹${totalExpenses.toLocaleString()}`,
          `₹${balance.toLocaleString()}`,
        ],
      ],
      theme: 'grid',
      headStyles: { fillColor: [0, 123, 255], textColor: 255 },
      styles: { fontSize: 12, cellPadding: 4 },
    });

    startY = doc.lastAutoTable.finalY + 10;

    // Persons Table
    if (personsToUse.length > 0) {
      doc.setFontSize(14);
      doc.text('Persons', 14, startY);
      startY += 6;

      autoTable(doc, {
        startY,
        head: [['Name', 'Service', 'Amount (₹)', 'Status', 'Date']],
        body: personsToUse.map(p => [
          p.name || '-',
          p.service || '-',
          p.amount?.toLocaleString() || '0',
          p.status || 'pending',
          p.date ? new Date(p.date).toLocaleDateString() : '-',
        ]),
        theme: 'grid',
        headStyles: { fillColor: [0, 123, 255], textColor: 255 },
        styles: { fontSize: 10, cellPadding: 3 },
      });

      startY = doc.lastAutoTable.finalY + 10;
    }

    // Expenses Table
    if (expensesToUse.length > 0) {
      doc.setFontSize(14);
      doc.text('Expenses', 14, startY);
      startY += 6;

      autoTable(doc, {
        startY,
        head: [['Description', 'Amount', 'Date']],
        body: expensesToUse.map(e => [
          e.description || '-',
          e.amount?.toLocaleString() || '0',
          e.date ? new Date(e.date).toLocaleDateString() : '-',
        ]),
        theme: 'grid',
        headStyles: { fillColor: [220, 53, 69], textColor: 255 },
        styles: { fontSize: 10, cellPadding: 3 },
      });
    }

    doc.save(`${selectedCategory.name}.pdf`);
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
        <div style={{ marginTop: '150px' }} className="category-page-container">
          {/* Category Selection */}
          <div className="category-page-categories-section">
            {/* <h2 className="category-page-categories-heading">Categories</h2> */}
            <div className="category-page-fund-categories">
              {categories.map(cat => (
                <button
                  key={cat._id}
                  className={`category-page-category-card ${
                    selectedCategoryId === cat._id ? 'active' : ''
                  }`}
                  onClick={() => setSelectedCategoryId(cat._id)}
                >
                  <span className="category-page-category-icon">📂</span>
                  <span className="category-page-category-name">
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Add Category Button */}
       

          {/* Details Section */}
          {selectedCategory && (
            <div className="category-page-fund-details">
              <h2>{selectedCategory.name}</h2>

              {/* Date Filter */}
              <div className="category-page-filter-section">
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
                <button onClick={() => {}}>Apply Filter</button>
              </div>

              {/* Summary Table */}
              <div className="category-page-fund-summary category-page-top-summary">
                <table>
                  <thead>
                    <tr>
                      <th>Total Fund</th>
                      <th>Total Expenses</th>
                      <th>Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>₹{totalFund.toLocaleString()}</td>
                      <td>₹{totalExpenses.toLocaleString()}</td>
                      <td>₹{balance.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Persons Table */}
              <h3 style={{ paddingBottom: '20px', fontSize: '25px' }}>
                Persons
              </h3>
              {filteredPersons.length === 0 ? (
                <p>No persons found for selected date range.</p>
              ) : (
                <table className="category-page-persons-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Service</th>
                      <th>Amount (₹)</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPersons.map(person => (
                      <tr key={person._id}>
                        <td>{person.name || '-'}</td>
                        <td>{person.service || '-'}</td>
                        <td>{person.amount?.toLocaleString() || '0'}</td>
                        <td
                          style={{
                            color: person.status === 'paid' ? 'green' : 'red',
                            fontWeight: 'bold',
                          }}
                        >
                          {person.status || 'pending'}
                        </td>
                        <td>
                          {person.date
                            ? new Date(person.date).toLocaleDateString()
                            : '-'}
                        </td>
                        <td>
                          <button
                            className="category-page-edit-btn"
                            onClick={() =>
                              navigate(`/editperson/${person._id}`)
                            }
                          >
                            ✏️ Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* Expenses Table */}
              <h3 style={{ paddingBottom: '20px', fontSize: '25px' }}>
                Expenses
              </h3>
              {filteredExpenses.length === 0 ? (
                <p>No expenses found for selected date range.</p>
              ) : (
                <table className="category-page-expenses-table">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Amount (₹)</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExpenses.map(expense => (
                      <tr key={expense._id}>
                        <td>{expense.description || '-'}</td>
                        <td>{expense.amount?.toLocaleString() || '0'}</td>
                        <td>
                          {expense.date
                            ? new Date(expense.date).toLocaleDateString()
                            : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* Action Buttons */}
              <div
                style={{
                  marginTop: '15px',
                  display: 'flex',
                  gap: '10px',
                  flexWrap: 'wrap',
                }}
              >
                <button
                  className="category-page-add-fund-btn"
                  onClick={downloadCategoryPDF}
                >
                  Download PDF
                </button>
                <button
                  className="category-page-add-expense-btn"
                  onClick={() => navigate('/addexpense')}
                >
                  + Add Expense
                </button>
                <button
                  className="category-page-add-fund-btn"
                  onClick={() => navigate('/addperson')}
                >
                  + Add Person
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Category;
