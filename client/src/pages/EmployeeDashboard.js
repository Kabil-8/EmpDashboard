import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Progress, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './EmployeeDashboard.css';
import { Switch } from 'antd';
export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme : 'dark';
  });

  // Apply theme on load and whenever it changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: 'easeOut' }
  };

  return (
    <motion.div className="employee-dashboard" initial="initial" animate="animate">
      <div className="dashboard-header">
        <div className="header-section-left" style={{ position: 'absolute', top: 20, left: 40, zIndex: 1000 }}>
  <Switch
    checked={theme === 'dark'}
    onChange={toggleTheme}
    checkedChildren="🌙"
    unCheckedChildren="🌞"
  />
</div>

        <div className="header-section center">
         <motion.h2
  className="dashboard-title"
  initial={{ opacity: 0, x: -30 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.6 }}
><span className="username-gradient">Welcome,{user?.name}</span></motion.h2>
        </div>
        <div className="header-section right">
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="dashboard-content">
        <motion.div {...fadeInUp}>
          <Card className="employee-card">
            <div className="profile-section">
              <motion.img
                src={`https://ui-avatars.com/api/?name=${user?.name}&background=random`}
                alt="avatar"
                className="profile-avatar"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
              <div className="profile-info">
                <h3>{user?.name}</h3>
                <p>{user?.role?.toUpperCase()} | {user?.department}</p>
                <p>📞 {user?.phone}</p>
                <p>📧 {user?.email}</p>
                <p>📍 {user?.mode?.toUpperCase()}</p>
              </div>
            </div>

            <Descriptions title="Employee Details" bordered column={1} className="emp-desc">
              <Descriptions.Item label="Gender">{user?.gender}</Descriptions.Item>
              <Descriptions.Item label="Salary">₹ {user?.salary?.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="Performance Score">
                <Progress
                  percent={user?.score}
                  size="small"
                  strokeColor={{ '0%': '#7f00ff', '100%': '#e100ff' }}
                  format={(percent) => `${percent}%`}
                />
                <Tag color="purple" style={{ marginTop: 8 }}>
                  {user?.score >= 85
                    ? 'Excellent'
                    : user?.score >= 60
                    ? 'Good'
                    : 'Needs Improvement'}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
