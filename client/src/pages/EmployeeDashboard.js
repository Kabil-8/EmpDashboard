import React from 'react';
import { Card, Descriptions, Progress, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import './EmployeeDashboard.css';

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="employee-dashboard">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Welcome, {user?.name}</h2>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>

      <div className="dashboard-content">
        <Card className="employee-card">
          <div className="profile-section">
            <img
              src={`https://ui-avatars.com/api/?name=${user?.name}&background=random`}
              alt="avatar"
              className="profile-avatar"
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
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
                format={percent => `${percent}%`}
              />
              <Tag color="blue" style={{ marginTop: 8 }}>
                {user?.score >= 85 ? 'Excellent' : user?.score >= 60 ? 'Good' : 'Needs Improvement'}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>
    </div>
  );
}
