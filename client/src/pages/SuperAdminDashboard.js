import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SuperAdminDashboard.css';

export default function SuperAdminDashboard() {
  const [employees, setEmployees] = useState([]);
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    // Fetch employees
    axios.get('http://localhost:5000/api/employees')
      .then(res => setEmployees(res.data))
      .catch(err => console.error('Failed to fetch employees:', err));

    // Fetch admins
    axios.get('http://localhost:5000/api/admins')
      .then(res => setAdmins(res.data))
      .catch(err => console.error('Failed to fetch admins:', err));
  }, []);

  return (
    <div className="superadmin-dashboard">
      <aside className="sidebar">
        <h2 className="logo">⚡ GenHub</h2>
        <nav className="nav-links">
          <ul>
            <li className="active">Dashboard</li>
            <li>Admins</li>
            <li>Employees</li>
            <li>Reports</li>
            <li>Settings</li>
          </ul>
        </nav>
        <div className="superadmin-info">
          <p>Super Admin</p>
          <span>Logged In</span>
        </div>
      </aside>

      <main className="main-content">
        <h1>👑 Super Admin Panel</h1>

        <div className="stats-cards">
          <div className="card purple">
            <h3>Total Admins</h3>
            <p>{admins.length}</p>
          </div>
          <div className="card blue">
            <h3>Total Employees</h3>
            <p>{employees.length}</p>
          </div>
        </div>

        <div className="list-section">
          <h2>All Employees</h2>
          <ul className="list">
            {employees.map((emp) => (
              <li key={emp._id}>
                <strong>{emp.name}</strong> — {emp.email}
              </li>
            ))}
          </ul>
        </div>

        <div className="list-section">
          <h2>All Admins</h2>
          <ul className="list">
            {admins.map((admin) => (
              <li key={admin._id}>
                <strong>{admin.name}</strong> — {admin.email}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
