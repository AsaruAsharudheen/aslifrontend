import './navbar.css';
import { FaTelegramPlane, FaCog } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
const Navbar = () => {
  const navigate = useNavigate();
  return (
    <div className="navbar">
      <div className="logo-section">
        <h1 style={{paddingLeft:'260px'}} className="logo">AccountsDetails</h1>
        <div className="icons">
          <FaTelegramPlane className="nav-icon" title="Telegram" />
          <FaCog className="nav-icon" title="Settings" />
        </div>
      </div>

      <div className="two-section">
        <button
          onClick={() => {
            navigate('/');
          }}
        >
          Transaction Details
        </button>
        <button
          onClick={() => {
            navigate('/clientdetails');
          }}
        >
          Client Details
        </button>{' '}
  
      </div>
    </div>
  );
};

export default Navbar;
