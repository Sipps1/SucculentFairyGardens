import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useAuth();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get('http://localhost:5001/api/admin/orders', config);
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [userInfo]);

  const statusChangeHandler = async (orderId, newStatus) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.put(
        `http://localhost:5001/api/admin/orders/${orderId}`,
        { orderStatus: newStatus },
        config
      );
      // Refresh the orders list
      fetchOrders();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  return (
    <div>
      <h2>Manage Orders</h2>
      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>{order.customer.name}</td>
                <td>R{order.totalPrice.toFixed(2)}</td>
                <td>{order.orderStatus}</td>
                <td>
                  <select
                    value={order.orderStatus}
                    onChange={(e) => statusChangeHandler(order._id, e.target.value)}
                  >
                    <option value="Pending Payment">Pending Payment</option>
                    <option value="Payment Received">Payment Received</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminOrders;