import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FaHome, FaCog, FaUser, FaChartPie } from 'react-icons/fa';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Navbar from '../../Components/Navbar/navbar';
import './home.css';

const BASE_URL =
  import.meta.env.VITE_BACKEND_URL ||
  'https://aslibackend.onrender.com/api/funds';

const Fund = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpenses: 0 });
  const [monthlyExpenses, setMonthlyExpenses] = useState([]);
  const [monthlyIncome, setMonthlyIncome] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  const menuItems = [
    { title: 'Dashboard', icon: <FaHome />, path: '/' },
    { title: 'Categories', icon: <FaHome />, path: '/Category-page' },
    { title: 'Clients', icon: <FaUser />, path: '/clientdetails' },
   
    { title: 'Reports', icon: <FaChartPie />, path: '/reports' },
  ];

  // Fetch categories & build summary + transactions
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/categories/details`);
        setCategories(data);

        // Income transactions
        const incomeTransactions = data.flatMap(cat =>
          cat.persons.map(p => ({
            _id: p._id,
            type: 'income',
            name: p.name,
            description: p.service,
            amount: p.amount,
            date: p.date,
          }))
        );

        // Expense transactions
        const expenseTransactions = data.flatMap(cat =>
          cat.expenses.map(e => ({
            _id: e._id,
            type: 'expense',
            description: e.description,
            amount: e.amount,
            date: e.date,
          }))
        );

        // Merge & sort
        const allTx = [...incomeTransactions, ...expenseTransactions].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setAllTransactions(allTx);

        // Summary
        const totalIncome = incomeTransactions.reduce(
          (sum, p) => sum + p.amount,
          0
        );
        const totalExpenses = expenseTransactions.reduce(
          (sum, e) => sum + e.amount,
          0
        );
        setSummary({ totalIncome, totalExpenses });

        // Monthly expenses
        const monthlyExpenseMap = {};
        expenseTransactions.forEach(e => {
          const month = new Date(e.date).toLocaleString('default', {
            month: 'short',
            year: 'numeric',
          });
          monthlyExpenseMap[month] = (monthlyExpenseMap[month] || 0) + e.amount;
        });
        setMonthlyExpenses(
          Object.entries(monthlyExpenseMap).map(([month, total]) => ({
            month,
            total,
          }))
        );

        // Monthly income
        const monthlyIncomeMap = {};
        incomeTransactions.forEach(p => {
          const month = new Date(p.date).toLocaleString('default', {
            month: 'short',
            year: 'numeric',
          });
          monthlyIncomeMap[month] = (monthlyIncomeMap[month] || 0) + p.amount;
        });
        setMonthlyIncome(
          Object.entries(monthlyIncomeMap).map(([month, total]) => ({
            month,
            total,
          }))
        );
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  // PDF Export
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Funds Report', 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [['Total Income (₹)', 'Total Expenses (₹)']],
      body: [[summary.totalIncome, summary.totalExpenses]],
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Description', 'Name', 'Amount', 'Date']],
      body: allTransactions.map(tx => [
        tx.description || '-',
        tx.name || '-',
        tx.type === 'income' ? `+₹${tx.amount}` : `-₹${tx.amount}`,
        tx.date ? new Date(tx.date).toLocaleDateString() : '-',
      ]),
    });

    doc.save('funds_report.pdf');
  };

  // Get filtered transactions based only on tab
  const filteredTransactions = allTransactions.filter(
    tx => activeTab === 'all' || tx.type === activeTab
  );

  // Calculate totals
  const filteredIncome = allTransactions
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const filteredExpenses = allTransactions
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const filteredBalance = filteredIncome - filteredExpenses;

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

        {/* Main Content */}
        <div className="fund-page">
          <h1>Funds Dashboard</h1>

          {/* Summary */}
          <div style={{ marginTop: '70px' }} className="summary-cards">
            <div className="card income">
              <h3>Total Income</h3>
              <p>₹{filteredIncome}</p>
            </div>
            <div className="card expense">
              <h3>Total Expenses</h3>
              <p>₹{filteredExpenses}</p>
            </div>
            <div className="card balance">
              <h3>Total Balance</h3>
              <p>₹{filteredBalance}</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="chart-wrapper">
            {/* Income Chart */}
            <div
              style={{ maxWidth: '700px', height: '400px' }}
              className="chart-section"
            >
              <h2>Monthly Income</h2>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={monthlyIncome} barSize={40}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e5e7eb"
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: '#555' }}
                  />
                  <YAxis tick={{ fontSize: 12, fill: '#555' }} />
                  <Tooltip
                    contentStyle={{
                      background: '#fff',
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                      fontSize: '13px',
                    }}
                  />
                  <Bar dataKey="total" fill="#22c55e" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Expenses Chart */}
            <div style={{ maxWidth: '700px' }} className="chart-section">
              <h2>Monthly Expenses</h2>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={monthlyExpenses} barSize={40}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e5e7eb"
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: '#555' }}
                  />
                  <YAxis tick={{ fontSize: 12, fill: '#555' }} />
                  <Tooltip
                    contentStyle={{
                      background: '#fff',
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                      fontSize: '13px',
                    }}
                  />
                  <Bar dataKey="total" fill="#ef4444" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Transactions Section */}
          <div style={{ marginTop: '120px' }} className="transactions-page">
            <div className="transactions-header">
              <h2>Transactions</h2>
              <div className="fund-action-buttons">
                <button
                  onClick={() => navigate('/addperson')}
                  className="add-fund-btn"
                >
                  + Add Income
                </button>
                <button
                  onClick={() => navigate('/addexpense')}
                  className="add-expense-btn"
                >
                  + Add Expense
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="tabs">
              {['all', 'income', 'expense'].map(tab => (
                <button
                  key={tab}
                  className={activeTab === tab ? 'active' : ''}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Table */}
            <table className="transactions-table">
              <thead>
                <tr>
                  {activeTab === 'income' ? (
                    <>
                      <th>Name</th>
                      <th>Amount (₹)</th>
                      <th>Date</th>
                    </>
                  ) : activeTab === 'expense' ? (
                    <>
                      <th>Description</th>
                      <th>Amount (₹)</th>
                      <th>Date</th>
                    </>
                  ) : (
                    <>
                      <th>Description</th>
                      <th>Name</th>
                      <th>Amount (₹)</th>
                      <th>Date</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map(tx => (
                  <tr key={tx._id}>
                    {activeTab === 'income' ? (
                      <>
                        <td>{tx.name}</td>
                        <td style={{ color: 'green', fontWeight: 'bold' }}>
                          +₹{tx.amount}
                        </td>
                        <td>{new Date(tx.date).toLocaleDateString()}</td>
                      </>
                    ) : activeTab === 'expense' ? (
                      <>
                        <td>{tx.description}</td>
                        <td style={{ color: 'red', fontWeight: 'bold' }}>
                          -₹{tx.amount}
                        </td>
                        <td>{new Date(tx.date).toLocaleDateString()}</td>
                      </>
                    ) : (
                      <>
                        <td>{tx.description}</td>
                        <td>{tx.name || '-'}</td>
                        <td
                          style={{
                            color: tx.type === 'income' ? 'green' : 'red',
                            fontWeight: 'bold',
                          }}
                        >
                          {tx.type === 'income'
                            ? `+₹${tx.amount}`
                            : `-₹${tx.amount}`}
                        </td>
                        <td>{new Date(tx.date).toLocaleDateString()}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Export */}
          <div className="pdf-export">
            <button onClick={generatePDF}>Export as PDF</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Fund;
