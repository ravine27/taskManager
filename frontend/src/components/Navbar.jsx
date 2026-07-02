import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiLogOut, FiCheckSquare } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-logo">
          <FiCheckSquare className="logo-icon" />
          <span>TaskManager</span>
        </Link>
        {user && (
          <div className="navbar-menu">
            <span className="navbar-user">Welcome, <strong>{user.name}</strong></span>
            <button className="logout-btn" onClick={handleLogout} title="Logout">
              <FiLogOut />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
