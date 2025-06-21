import React, { useState } from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // ✅ import axios
import skyBackground from '../assets/sky.png'; // ✅ relative path
import './LoginPage.css';

export default function LoginPage() {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const goBack = () => setRole(null);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        ...values,
        role, // ✅ include role in request body
      });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      message.success(`Welcome ${user.name}`);
      navigate(user.role === 'admin' ? '/admin' : '/employee');
    } catch (err) {
      message.error('Login failed. Please try again.');
    }
    setLoading(false);
  };

  const backgroundStyle = {
    backgroundImage: `url(${skyBackground})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '60px',
  };

  return (
    <div style={backgroundStyle}>
      <div className="login-header">
        <img src="/logo.jpeg" alt="GenHub Logo" className="genhub-logo" />
        <h1 className="portal-title">GenHub Portal</h1>
        <p className="portal-subtext">Choose your role to sign in</p>
      </div>

      {!role ? (
        <div className="role-cards-center">
          <div className="role-card" onClick={() => setRole('admin')}>
            👑 <span>Admin</span>
          </div>
          <div className="role-card" onClick={() => setRole('employee')}>
            👔 <span>Employee</span>
          </div>
        </div>
      ) : (
        <Card className="login-card" title={`Login as ${role}`}>
          <Form onFinish={onFinish} layout="vertical">
            <Form.Item name="email" label="Email" rules={[{ required: true }]}>
              <Input placeholder="e.g. user@example.com" />
            </Form.Item>
            <Form.Item name="password" label="Password" rules={[{ required: true }]}>
              <Input.Password placeholder="Your password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Login
              </Button>
            </Form.Item>
            <Button type="link" onClick={goBack}>← Back</Button>
          </Form>
        </Card>
      )}
    </div>
  );
}
