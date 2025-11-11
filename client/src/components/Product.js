import React from 'react';
import { useCart } from '../context/CartContext';

const Product = ({ product }) => {
  const { addToCart } = useCart();

  const imageUrl =
    product.image || 'https://via.placeholder.com/300x250.png?text=No+Image';

  return (
    // We replace 'product-card' with 'clay-soft'
    <div className="clay-soft">
      <img
        src={imageUrl}
        alt={product.name}
        className="product-card-image"
      />
      <div className="product-card-body">
        <h3 className="product-card-title">{product.name}</h3>
        <p className="product-card-desc">{product.description}</p>
        <p className="product-card-price">R{product.price.toFixed(2)}</p>
      </div>
      <div className="product-card-footer">
        <button className="btn" onClick={() => addToCart(product)}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default Product;