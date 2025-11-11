import React, { useState, useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import axios from 'axios';

const OrderConfirmationPage = () => {
  const { state } = useLocation();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get the order data passed from the checkout page
  const order = state?.order;

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get('/api/admin/settings');
        setSettings(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch settings:', error);
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // If user lands here without placing an order, redirect them
  if (!order) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="order-confirmation">
      <h2>✨ Thank You, {order.customer.name}!</h2>
      <p>Your order has been received. Please make an EFT payment to complete your purchase.</p>
      <p>
        <strong>Your Order Number: {order._id}</strong>
      </p>

      {loading || !settings ? (
        <p>Loading payment details...</p>
      ) : (
        <div className="banking-details">
          <h3>Payment Instructions (EFT)</h3>
          <p style={{ textAlign: 'center', marginBottom: '1rem' }}>
            Please use your <strong>Order Number</strong> as the payment reference.
          </p>
          <ul>
            <li>
              <strong>Bank:</strong> {settings.bankName}
            </li>
            <li>
              <strong>Account Holder:</strong> {settings.accountHolder}
            </li>
            <li>
              <strong>Account Number:</strong> {settings.accountNumber}
            </li>
            <li>
              <strong>Branch Code:</strong> {settings.branchCode}
            </li>
            <li>
              <strong>Amount:</strong> R{order.totalPrice.toFixed(2)}
            </li>
            <li>
              <strong>Reference:</strong> {order._id}
            </li>
          </ul>
        </div>
      )}
      
      <div className="order-summary" style={{ marginTop: '2rem', textAlign: 'left' }}>
        <h3>Order Summary</h3>
        {order.orderItems.map((item) => (
          <div key={item.product} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{item.name} (x{item.qty})</span>
            <span>R{(item.price * item.qty).toFixed(2)}</span>
          </div>
        ))}
        <hr />
        <p>Subtotal: R{order.itemsPrice.toFixed(2)}</p>
        <p>Shipping: R{order.shippingPrice.toFixed(2)}</p>
        <p><strong>Total: R{order.totalPrice.toFixed(2)}</strong></p>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;