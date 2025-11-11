import React from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminOrders from './AdminOrders';
import AdminProducts from './AdminProducts';
import AdminSettings from './AdminSettings';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <h3>Admin Menu</h3>
        <ul>
          <li>
            <NavLink to="/admin/orders">Orders</NavLink>
          </li>
          <li>
            <NavLink to="/admin/products">Products</NavLink>
          </li>
          <li>
            <NavLink to="/admin/settings">Settings</NavLink>
          </li>
        </ul>
        <button onClick={handleLogout} className="btn btn-danger">
          Logout
        </button>
      </aside>

      <main className="admin-content">
        <Routes>
          <Route path="/" element={<AdminOrders />} /> {/* Default page */}
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="settings" element={<AdminSettings />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;