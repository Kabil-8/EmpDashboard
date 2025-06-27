import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DashboardLayout.css';

export default function DashboardLayout({ children, userRole = "Admin", userName = "John Doe" }) {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/employees'); // Make sure this route exists
        setEmployees(res.data);
      } catch (err) {
        console.error('Failed to fetch employees:', err);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="logo">GenHub</h2>
        <ul className="nav-links">
          <li>Dashboard</li>
          <li>Users</li>
          <li>Analytics</li>
          <li>Reports</li>
          <li>Settings</li>
        </ul>
        <div className="user-info">
          <p>{userName}</p>
          <span>{userRole}</span>
        </div>
      </aside>

      <main className="main-panel">
        {children}

        {/* Show Employees Only for Super Admin */}
        {userRole === 'Super Admin' && (
          <div className="employee-list">
            <h2>All Employees</h2>
            <ul>
              {employees.map((emp) => (
                <li key={emp._id}>
                  <strong>{emp.name}</strong> - {emp.email}
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
