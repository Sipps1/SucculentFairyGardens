import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { cartItems } = useCart();
  const { userInfo, logout } = useAuth();

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <header className="header">
      <nav className="header-nav">
        <Link to="/" className="header-logo">
          🌿 Succulent Fairy Gardens
        </Link>
        <ul className="header-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/shop">Shop</Link>
          </li>
          <li>
            <Link to="/cart">Cart {cartCount > 0 && `(${cartCount})`}</Link>
          </li>
          {userInfo && userInfo.isAdmin && (
            <li>
              <Link to="/admin">Admin</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;