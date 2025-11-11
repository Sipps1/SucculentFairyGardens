import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const CATEGORIES = [
  'small-containers', 'medium-containers', 'large-containers',
  'small-figurines', 'medium-figurines', 'large-figurines',
  'accessories', 'decorative-stones',
];

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useAuth();
  
  // Form state for new/edit product
  const [form, setForm] = useState({
    _id: null,
    name: '',
    price: '',
    description: '',
    image: '',
    category: 'accessories',
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/products');
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      _id: null, name: '', price: '', description: '', image: '', category: 'accessories',
    });
  };

  const handleEditClick = (product) => {
    setForm({
      _id: product._id,
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image,
      category: product.category,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    
    const productData = {
      name: form.name,
      price: Number(form.price),
      description: form.description,
      image: form.image, // In a real app, you'd use file upload here
      category: form.category,
    };

    try {
      if (form._id) {
        // Update
        await axios.put(
          `/api/admin/products/${form._id}`,
          productData,
          config
        );
      } else {
        // Create
        await axios.post(
          `/api/admin/products`,
          productData,
          config
        );
      }
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`/api/admin/products/${id}`, config);
        fetchProducts();
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  return (
    <div>
      <h2>Manage Products</h2>
      
      {/* Product Form */}
      <form onSubmit={handleSubmit} className="checkout-form" style={{ marginBottom: '2rem' }}>
        <h3>{form._id ? 'Edit Product' : 'Add New Product'}</h3>
        <div className="form-group">
          <label>Name</label>
          <input type="text" name="name" value={form.name} onChange={handleFormChange} className="form-control" required />
        </div>
        <div className="form-group">
          <label>Price (R)</label>
          <input type="number" name="price" value={form.price} onChange={handleFormChange} className="form-control" required />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={handleFormChange} className="form-control" required></textarea>
        </div>
        <div className="form-group">
          <label>Image URL</label>
          <input type="text" name="image" value={form.image} onChange={handleFormChange} className="form-control" placeholder="https://... or /images/my-image.jpg" required />
        </div>
        <div className="form-group">
          <label>Category</label>
          <select name="category" value={form.category} onChange={handleFormChange} className="form-control">
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <button type="submit" className="btn">{form._id ? 'Update' : 'Create'}</button>
        {form._id && <button type="button" className="btn btn-secondary" onClick={resetForm} style={{ marginLeft: '1rem' }}>Cancel Edit</button>}
      </form>

      {/* Products Table */}
      <h3>Existing Products</h3>
      {loading ? <p>Loading...</p> : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>R{product.price.toFixed(2)}</td>
                <td>{product.category}</td>
                <td>
                  <button className="btn btn-secondary" onClick={() => handleEditClick(product)} style={{ marginRight: '10px' }}>Edit</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(product._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminProducts;