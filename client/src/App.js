import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import { ThemeProvider } from './pages/ThemeContext';
function App() {
  return (
    <ThemeProvider>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/employee" element={<EmployeeDashboard />} />
      <Route path="/superadmin" element={<SuperAdminDashboard />} />
    </Routes>
    </ThemeProvider>
  );
}

export default App;
