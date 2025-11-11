import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    itemsPrice,
    shippingFee,
    totalPrice,
    loadingSettings,
  } = useCart();
  const navigate = useNavigate();

  return (
    <div>
      <h2>Your Magical Cart</h2>
      {cartItems.length === 0 ? (
        <p>
          Your cart is empty. <Link to="/shop">Go Shopping!</Link>
        </p>
      ) : (
        <div className="cart-page">
          <div className="cart-items-list">
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item">
                <img
                  src={item.image || 'https://via.placeholder.com/100'}
                  alt={item.name}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <Link to={`/shop`}> {/* Update later if product pages exist */}
                    <strong>{item.name}</strong>
                  </Link>
                  <p>R{item.price.toFixed(2)}</p>
                </div>
                <input
                  type="number"
                  min="1"
                  value={item.qty}
                  onChange={(e) => updateQuantity(item._id, e.target.value)}
                  className="form-control cart-item-qty"
                />
                <button
                  className="btn btn-danger"
                  onClick={() => removeFromCart(item._id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <aside className="order-summary">
            <h3>Order Summary</h3>
            {loadingSettings ? (
              <p>Loading summary...</p>
            ) : (
              <>
                <ul>
                  <li>
                    <span>Subtotal</span>
                    <span>R{itemsPrice.toFixed(2)}</span>
                  </li>
                  <li>
                    <span>Shipping Fee</span>
                    <span>R{shippingFee.toFixed(2)}</span>
                  </li>
                  <li className="total">
                    <span>Total</span>
                    <span>R{totalPrice.toFixed(2)}</span>
                  </li>
                </ul>
                <button
                  className="btn"
                  style={{ width: '100%' }}
                  onClick={() => navigate('/checkout')}
                >
                  Proceed to Checkout
                </button>
              </>
            )}
          </aside>
        </div>
      )}
    </div>
  );
};

export default CartPage;