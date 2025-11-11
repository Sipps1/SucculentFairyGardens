import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const CheckoutPage = () => {
  const { cartItems, itemsPrice, shippingFee, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    shippingAddress: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { name, email, phone, shippingAddress } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !shippingAddress) {
      setError('Please fill in all fields.');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const order = {
        orderItems: cartItems,
        customer: {
          name,
          email,
          phone,
          shippingAddress,
        },
        itemsPrice,
        shippingPrice: shippingFee,
        totalPrice,
      };

      const { data: createdOrder } = await axios.post(
        'http://localhost:5001/api/orders',
        order
      );

      setLoading(false);
      clearCart();
      // Redirect to confirmation page, passing the new order details
      navigate('/order-confirmation', { state: { order: createdOrder } });

    } catch (err) {
      console.error('Order creation failed:', err);
      setError('Failed to place order. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Checkout</h2>
      <div className="checkout-page">
        <form className="checkout-form" onSubmit={submitHandler}>
          <h3>Your Details</h3>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={onChange}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={phone}
              onChange={onChange}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label>Shipping Address</label>
            <textarea
              name="shippingAddress"
              value={shippingAddress}
              onChange={onChange}
              className="form-control"
              rows="4"
              required
            ></textarea>
          </div>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Placing Order...' : 'Place Order (Pay via EFT)'}
          </button>
        </form>

        <aside className="order-summary">
          <h3>Your Order</h3>
          {cartItems.map((item) => (
            <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>{item.name} (x{item.qty})</span>
              <span>R{(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
          <hr />
          <ul>
            <li>
              <span>Subtotal</span>
              <span>R{itemsPrice.toFixed(2)}</span>
            </li>
            <li>
              <span>Shipping</span>
              <span>R{shippingFee.toFixed(2)}</span>
            </li>
            <li className="total">
              <span>Total</span>
              <span>R{totalPrice.toFixed(2)}</span>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default CheckoutPage;