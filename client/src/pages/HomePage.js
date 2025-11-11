import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Product from '../components/Product';

// --- Inline SVGs for Icons (like lucide-react) ---
const ShoppingBag = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="icon"
  >
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <path d="M16 10a4 4 0 0 1-8 0"></path>
  </svg>
);

const ArrowRight = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="icon"
  >
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);
// --- End Icons ---

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await axios.get('/api/products');
        // Feature 4 products
        setFeatured(data.slice(0, 4));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="homepage-hero clay-soft">
        {/* Floating decorative elements */}
        <img
          src="https://images.unsplash.com/photo-1459156212016-c812468e2115?w=150&h=150&fit=crop"
          alt="succulent"
          className="float-element"
          style={{
            position: 'absolute',
            top: '20px',
            left: '30px',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            opacity: 0.4,
            zIndex: 0,
          }}
        />
        <img
          src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=100&h=100&fit=crop"
          alt="flower"
          className="sway-element"
          style={{
            position: 'absolute',
            top: '50px',
            right: '40px',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            opacity: 0.4,
            zIndex: 0,
          }}
        />

        <h1>
          Create Your Own
          <br />
          <span className="text-green">Miniature Fairy Garden</span>
        </h1>
        <p className="hero-text">
          Discover enchanting succulents, whimsical figurines, and magical
          accessories to build your perfect miniature world. Every garden tells
          its own story.
        </p>

        <Link to="/shop" className="fairy-button">
          <ShoppingBag />
          Explore Our Collection
          <ArrowRight />
        </Link>

        <div className="decorative-dots">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="dot" />
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products" style={{ marginTop: '4rem' }}>
        <h2 style={{ textAlign: 'center', color: 'var(--color-secondary)' }}>
          Featured Collection
        </h2>
        <p style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
          Handpicked treasures to start your fairy garden journey
        </p>
        
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="product-grid">
            {featured.map((product) => (
              <Product key={product._id} product={product} />
            ))}
          </div>
        )}
         <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link to="/shop" className="fairy-button btn-secondary">
            <ArrowRight />
            View All Products
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;