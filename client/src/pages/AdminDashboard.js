// AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import {
  Card, Row, Col, Statistic, Button, Table, Modal, Input, Space, Popconfirm, Progress, Switch
} from 'antd';
import {
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip
} from 'recharts';
import {
  UserOutlined, ManOutlined, WomanOutlined,
  WifiOutlined, HomeOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [theme, setTheme] = useState('light');
  const [stats, setStats] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formValues, setFormValues] = useState({
    name: '', email: '', password: '', phone: '', department: '',
    role: '', gender: '', mode: '', salary: '', score: ''
  });

  const navigate = useNavigate();
 const COLORS = ['#ff4c4c', '#ffbd44', '#00e676', '#2196f3', '#e91e63'];

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-mode' : '';
  }, [theme]);

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

  if (!stats) return <p style={{ color: 'white' }}>Loading dashboard...</p>;

  const departmentData = Object.entries(stats.departments).map(([name, value]) => ({ name, value }));

  return (
    <motion.div className="dashboard-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="db">
        <h2 className="dashboard-title">👑 Admin Dashboard</h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Switch
            checkedChildren="🌙"
            unCheckedChildren="☀️"
            checked={theme === 'dark'}
            onChange={(checked) => setTheme(checked ? 'dark' : 'light')}
          />
          <Button onClick={handleLogout} className="logout-button">Logout</Button>
        </div>
</div>
      <div className="dashboard-content">
        <Button onClick={handleAdd} className="mb">+ Add Employee</Button>

        {/* Stat Cards */}
        <div className="stat-row">
          {[{
            icon: <UserOutlined />, title: "Total Employees", value: stats.total, color: 'blue'
          }, {
            icon: <ManOutlined />, title: "Male Employees", value: stats.male, color: 'green'
          }, {
            icon: <WomanOutlined />, title: "Female Employees", value: stats.female, color: 'purple'
          }, {
            icon: <WifiOutlined />, title: "Remote", value: stats.remote, color: 'teal'
          }, {
            icon: <HomeOutlined />, title: "On-site", value: stats.onsite, color: 'orange'
          }].map((item, i) => (
            <motion.div whileHover={{ scale: 1.05 }} key={i}>
              <Card className="stat-card">
                <div className={`icon-box ${item.color}`}>{item.icon}</div>
                <Statistic title={item.title} value={item.value} />
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Employee Table */}
        <Card className="table-card" title="👥 Employee Table">
          <Table
            dataSource={employees}
            rowKey="_id"
            pagination={{ pageSize: 5 }}
            columns={[
              { title: 'Name', dataIndex: 'name' },
              { title: 'Email', dataIndex: 'email' },
              { title: 'Department', dataIndex: 'department' },
              {
                title: 'Actions',
                render: (_, record) => (
                  <Space>
                    <Button onClick={() => handleEdit(record)}>Edit</Button>
                    <Popconfirm title="Delete?" onConfirm={() => handleDelete(record._id)}>
                      <Button danger>Delete</Button>
                    </Popconfirm>
                  </Space>
                )
              }
            ]}
          />
        </Card>

        {/* Charts */}
        <Row gutter={16} style={{ marginTop: 32 }}>
          <Col span={12}>
            <Card className="chart-card" title="📊 Department Chart">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
  data={departmentData}
  dataKey="value"
  nameKey="name"
  outerRadius={90}
  label
  isAnimationActive={true}
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
          <Col span={12}>
            <Card className="chart-card" title="🏆 Top Performers">
              {stats.topEmployees.slice(0, 5).map((emp, i) => (
                <div key={i} style={{ marginBottom: 16 }}>
                  <div className="top-row">
                    <span className="top-name">#{i + 1} {emp.name}</span>
                    <span className="top-score">{emp.score}%</span>
                  </div>
                <Progress
  percent={emp.score}
  showInfo={false}
  strokeColor={{
    '0%': '#00ffe0',
    '100%': '#7f00ff'
  }}
/></div>
              ))}
            </Card>
          </Col>
        </Row>

        {/* Salary Chart */}
        <Row style={{ marginTop: 20 }}>
          <Col span={24}>
            <Card className="chart-card" title="📈 Salary Trend">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={stats.salaryTrend}>
                  <XAxis dataKey="name" stroke="#aaa" />
                  <YAxis stroke="#aaa" />
                  <Tooltip />
                  <Line type="monotone" dataKey="salary" stroke="#00ffcc" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Modal */}
      <Modal
        title={editingEmployee ? 'Edit Employee' : 'Add Employee'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSave}
      >
        {Object.entries(formValues).map(([key, value]) => (
          <Input
            key={key}
            placeholder={key}
            value={value}
            onChange={(e) => setFormValues({ ...formValues, [key]: e.target.value })}
            style={{ marginBottom: 10 }}
            type={(key === 'salary' || key === 'score') ? 'number' : 'text'}
          />
        ))}
      </Modal>
    </motion.div>
  );
}
