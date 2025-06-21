import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';


export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <Button className="logout-button" type="primary" danger onClick={handleLogout}>
      Logout
    </Button>
  );
}
