import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { userInfo } = useAuth();

  return userInfo && userInfo.isAdmin ? (
    children
  ) : (
    <Navigate to="/admin/login" replace />
  );
};

export default AdminRoute;