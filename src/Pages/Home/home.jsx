// src/Pages/Fund/Fund.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Navbar from '../../Components/Navbar/navbar';
import './home.css';

const BASE_URL =
  import.meta.env.VITE_BACKEND_URL || 'https://aslibackend.onrender.com/api/funds';

const Fund = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

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

  const totalFund = filteredPersons.reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const balance = totalFund - totalExpenses;

  // PDF download reflecting filter and removing actions
  const downloadCategoryPDF = () => {
    if (!selectedCategory) return;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Category: ${selectedCategory.name}`, 14, 15);

    if (fromDate || toDate) {
      doc.setFontSize(12);
      const rangeText = `Date Range: ${fromDate || '-'} to ${toDate || '-'}`;
      doc.text(rangeText, 14, 23);
    }

    let startY = 30;

    // Summary Table
    autoTable(doc, {
      startY,
      head: [['Total Fund', 'Total Expenses', 'Balance']],
      body: [[
        totalFund.toLocaleString(),
        totalExpenses.toLocaleString(),
        balance.toLocaleString(),
      ]],
      theme: 'grid',
      headStyles: { fillColor: [0, 123, 255], textColor: 255 },
      styles: { fontSize: 12, cellPadding: 4 },
    });

    startY = doc.lastAutoTable.finalY + 10;

    // Persons Table
    if (filteredPersons.length > 0) {
      doc.setFontSize(14);
      doc.text('Persons', 14, startY);
      startY += 6;

      autoTable(doc, {
        startY,
        head: [['Name', 'Service', 'Amount (₹)', 'Status', 'Date']],
        body: filteredPersons.map(p => [
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
    if (filteredExpenses.length > 0) {
      doc.setFontSize(14);
      doc.text('Expenses', 14, startY);
      startY += 6;

      autoTable(doc, {
        startY,
        head: [['Description', 'Amount (₹)', 'Date']],
        body: filteredExpenses.map(e => [
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

  const handleDeletePerson = async personId => {
    if (!window.confirm('Are you sure you want to delete this person?')) return;
    try {
      await axios.delete(`${BASE_URL}/persons/${personId}`);
      fetchCategories();
    } catch (err) {
      console.error('Error deleting person:', err);
      alert('Failed to delete person.');
    }
  };

  const handleDeleteExpense = async expenseId => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    try {
      await axios.delete(`${BASE_URL}/expenses/${expenseId}`);
      fetchCategories();
    } catch (err) {
      console.error('Error deleting expense:', err);
      alert('Failed to delete expense.');
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ marginTop: '150px' }} className="home-fund-container">
        {/* Category Selection */}
        <div className="categories-section">
          <h2 className="categories-heading">Categories</h2>
          <div className="fund-categories">
            {categories.map(cat => (
              <button
                key={cat._id}
                className={`category-card ${selectedCategoryId === cat._id ? 'active' : ''}`}
                onClick={() => setSelectedCategoryId(cat._id)}
              >
                <span className="category-icon">📂</span>
                <span className="category-name">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Add Category Button */}
        <div className="fund-header">
          <button className="add-category-btn" onClick={() => navigate('/addcategory')}>
            + Add Category
          </button>
        </div>

        {/* Details Section */}
        {selectedCategory && (
          <div className="fund-details">
            <h2>{selectedCategory.name}</h2>

            {/* Date Filter */}
            <div className="filter-section">
              <label>From:</label>
              <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
              <label>To:</label>
              <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
              <button onClick={() => {}}>Apply Filter</button>
            </div>

            {/* Summary Table */}
            <div className="fund-summary top-summary">
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
            <h3>Persons</h3>
            {filteredPersons.length === 0 ? (
              <p>No persons found for selected date range.</p>
            ) : (
              <table className="persons-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Service</th>
                    <th>Amount (₹)</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th className="actions-header">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPersons.map(person => (
                    <tr key={person._id}>
                      <td>{person.name || '-'}</td>
                      <td>{person.service || '-'}</td>
                      <td>{person.amount?.toLocaleString() || '0'}</td>
                      <td style={{ color: person.status === 'paid' ? 'green' : 'red', fontWeight: 'bold' }}>
                        {person.status || 'pending'}
                      </td>
                      <td>{person.date ? new Date(person.date).toLocaleDateString() : '-'}</td>
                      <td className="actions-cell">
                        <button className="edit-btn" onClick={() => navigate(`/editperson/${person._id}`)}>
                          Edit
                        </button>
                        <button className="delete-btn" onClick={() => handleDeletePerson(person._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Expenses Table */}
            <h3>Expenses</h3>
            {filteredExpenses.length === 0 ? (
              <p>No expenses found for selected date range.</p>
            ) : (
              <table className="expenses-table">
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
                      <td>{expense.date ? new Date(expense.date).toLocaleDateString() : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Action Buttons */}
            <div className="fund-action-buttons">
              <button className="add-fund-btn" onClick={downloadCategoryPDF}>
                Download PDF
              </button>
              <button className="add-expense-btn" onClick={() => navigate('/addexpense')}>
                + Add Expense
              </button>
              <button className="add-fund-btn" onClick={() => navigate('/addperson')}>
                + Add Person
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Fund;
