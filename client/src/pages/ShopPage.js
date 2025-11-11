import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Product from '../components/Product';

const CATEGORIES = [
  'small-containers',
  'medium-containers',
  'large-containers',
  'small-figurines',
  'medium-figurines',
  'large-figurines',
  'accessories',
  'decorative-stones',
];

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('http://localhost:5001/api/products');
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div>
      <h2>Shop All Products</h2>
      
      <div className="shop-categories">
        <label htmlFor="category-select">Filter by Category: </label>
        <select 
          id="category-select"
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat.replace('-', ' ')}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div className="product-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Product key={product._id} product={product} />
            ))
          ) : (
            <p>No products found in this category.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ShopPage;