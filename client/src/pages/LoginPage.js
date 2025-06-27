import React, { useState, useEffect } from 'react';
import './LoginPage.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.jpeg';

export default function LoginPage() {
  const [role, setRole] = useState('employee');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const navigate = useNavigate();

useEffect(() => {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  setTheme(savedTheme);
}, []);

const toggleTheme = () => {
  const newTheme = theme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
        role,
      });

      const { token, user } = res.data;
      if (user.role !== role) {
        alert(`You are not authorized to login as ${role}`);
        return;
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setWelcomeMessage(`Welcome, ${user.name}!`);

      setTimeout(() => {
        navigate(`/${role}`);
      }, 1500);
    } catch (err) {
      alert('Login failed. Check credentials.');
    }
  };

  return (
    <div className="login-container">
      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>

      {welcomeMessage && (
        <div className="welcome-popup">
          <p>{welcomeMessage}</p>
        </div>
      )}

      <div className="login-card">
        <div className="left-panel">
          <h2 className="slide-up delay-1">GenHub</h2>
          <p className="login-title slide-up delay-2">Login to your respective portal</p>

          <div className="role-buttons slide-up delay-3">
            {['employee', 'admin'].map((r) => (
              <button
                key={r}
                type="button"
                className={role === r ? 'active' : ''}
                onClick={() => setRole(r)}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <input
              className="slide-up delay-4"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="slide-up delay-5"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="login-btn slide-up delay-6">
              Sign In as {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          </form>

          <p className="footer-text slide-up delay-7">© 2025 GenHub. All Rights Reserved.</p>
        </div>

        <div className="right-panel">
          <img src={logo} alt="Rotating Logo" className="rotating-logo" />
        </div>
      </div>
    </div>
  );
}
