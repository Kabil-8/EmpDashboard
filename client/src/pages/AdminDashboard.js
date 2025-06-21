import React, { useEffect, useState } from 'react';
import {
  Card, Row, Col, Statistic, Button, Table, Modal, Input, Space, Popconfirm, Progress
} from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import {
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip
} from 'recharts';
import { UserOutlined, ManOutlined, WomanOutlined, WifiOutlined, HomeOutlined } from '@ant-design/icons';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formValues, setFormValues] = useState({
    name: '', email: '', password: '', phone: '', department: '',
    role: '', gender: '', mode: '', salary: '', score: ''
  });

  const navigate = useNavigate();
  const COLORS = ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1'];

  useEffect(() => {
    axios.get('http://localhost:5000/api/user/admin/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error('Failed to load stats', err));

    axios.get('http://localhost:5000/api/user/employees')
      .then(res => setEmployees(res.data))
      .catch(err => console.error('Failed to load employees', err));
  }, []);

  const handleAdd = () => {
    setEditingEmployee(null);
    setFormValues({
      name: '', email: '', password: '', phone: '', department: '',
      role: '', gender: '', mode: '', salary: '', score: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingEmployee(record);
    setFormValues(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/user/employees/${id}`);
      setEmployees(prev => prev.filter(emp => emp._id !== id));
    } catch (err) {
      console.error('Failed to delete employee', err);
    }
  };

  const handleSave = async () => {
    try {
      if (editingEmployee) {
        const res = await axios.put(
          `http://localhost:5000/api/user/employees/${editingEmployee._id}`,
          formValues
        );
        setEmployees(prev =>
          prev.map(emp => emp._id === res.data._id ? res.data : emp)
        );
      } else {
        const res = await axios.post(`http://localhost:5000/api/user/employees`, formValues);
        setEmployees(prev => [...prev, res.data]);
      }
      setIsModalOpen(false);
      setEditingEmployee(null);
    } catch (err) {
      console.error('Failed to save employee', err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  if (!stats) return <p>Loading dashboard...</p>;

  const departmentData = Object.entries(stats.departments).map(([name, value]) => ({ name, value }));

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h2 className="dashboard-title">👑 Admin Dashboard</h2>
        <Button onClick={handleLogout} className="logout-button">Logout</Button>
      </div>
      <div className="dashboard-scroll-area">
        <div className="dashboard-content">
          <Button onClick={handleAdd} className="mb">🧑‍💼 Manage Employees</Button>

          {/* Stat Cards */}
          <div className="stat-row">
            <Card className="stat-card">
              <div className="icon-box blue"><UserOutlined /></div>
              <Statistic title="Total Employees" value={stats.total} />
              <p className="stat-growth">+12%</p>
            </Card>
            <Card className="stat-card">
              <div className="icon-box green"><ManOutlined /></div>
              <Statistic title="Male Employees" value={stats.male} />
              <p className="stat-growth">+8%</p>
            </Card>
            <Card className="stat-card">
              <div className="icon-box purple"><WomanOutlined /></div>
              <Statistic title="Female Employees" value={stats.female} />
              <p className="stat-growth">+15%</p>
            </Card>
            <Card className="stat-card">
              <div className="icon-box orange"><WifiOutlined /></div>
              <Statistic title="Remote Workers" value={stats.remote} />
              <p className="stat-growth">+25%</p>
            </Card>
            <Card className="stat-card">
              <div className="icon-box teal"><HomeOutlined /></div>
              <Statistic title="On-site Workers" value={stats.onsite} />
              <p className="stat-growth">+5%</p>
            </Card>
          </div>

          {/* Table */}
          <Card style={{ marginTop: 24 }}>
            <Table
              dataSource={employees}
              rowKey="_id"
              pagination={{ pageSize: 5 }}
              columns={[
                { title: 'Name', dataIndex: 'name', className: 'table-col-name' },
                { title: 'Email', dataIndex: 'email', className: 'table-col-email' },
                { title: 'Department', dataIndex: 'department', className: 'table-col-dept' },
                {
                  title: 'Actions',
                  className: 'table-col-actions',
                  render: (_, record) => (
                    <Space>
                      <Button onClick={() => handleEdit(record)}>✏️ Edit</Button>
                      <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record._id)}>
                        <Button danger>🗑️ Delete</Button>
                      </Popconfirm>
                    </Space>
                  ),
                }
              ]}
            />
          </Card>

          {/* Modal */}
          <Modal
            title={editingEmployee ? "Edit Employee" : "Add Employee"}
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            onOk={handleSave}
          >
            {Object.entries(formValues).map(([key, val]) => (
              <Input
                key={key}
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                value={val}
                onChange={(e) => setFormValues({ ...formValues, [key]: e.target.value })}
                style={{ marginBottom: 10 }}
                type={key === 'salary' || key === 'score' ? 'number' : 'text'}
              />
            ))}
          </Modal>

          {/* Department Chart */}
          <Row gutter={16} style={{ marginTop: 24 }}>
           <Col span={12}>
  <Card title="Department Distribution" className="chart-card">
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={departmentData}
          dataKey="value"
          nameKey="name"
          outerRadius={100}
          label
        >
          {departmentData.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </Card>
</Col>


            {/* Top Performers */}
           <Col span={12}>
  <Card title="🏆 Top 5 Performers" className="chart-card">
    {stats.topEmployees
      .sort((a, b) => b.score - a.score)  // sort descending by score (optional if already sorted)
      .slice(0, 5)                        // limit to top 5
      .map((emp, idx) => (
        <div key={idx} style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontWeight: 600, color: '#2c3e50' }}>
              #{idx + 1} — {emp.name}
            </span>
            <span style={{ fontSize: 14, color: '#555' }}>{emp.score}%</span>
          </div>
          <Progress
            percent={emp.score}
            strokeColor={idx === 0 ? '#52c41a' : '#1890ff'}
            trailColor="#f0f2f5"
            showInfo={false}
          />
        </div>
      ))}
  </Card>
</Col>

          </Row>

          {/* Salary Trend */}
          <Row style={{ marginTop: 20 }}>
            <Col span={24}>
              <Card title="Salary Trend" className="chart-card">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={stats.salaryTrend}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="salary" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}
