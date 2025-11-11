import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    shippingFee: 120,
    notificationEmail: 'info@succulentfairygardens.co.za',
    bankName: '',
    accountHolder: '',
    accountNumber: '',
    branchCode: '',
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const { userInfo } = useAuth();

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get('http://localhost:5001/api/admin/settings');
        setSettings(data);
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.put(
        'http://localhost:5001/api/admin/settings',
        settings,
        config
      );
      setMessage('Settings updated successfully!');
    } catch (error) {
      console.error('Failed to update settings:', error);
      setMessage('Failed to update settings.');
    }
    setLoading(false);
  };

  if (loading && !settings.bankName) { // Check if settings are loaded
    return <p>Loading settings...</p>;
  }

  return (
    <div>
      <h2>Site Settings</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <form onSubmit={handleSubmit} className="checkout-form">
        <h3>Store Settings</h3>
        <div className="form-group">
          <label>Shipping Fee (R)</label>
          <input
            type="number"
            name="shippingFee"
            value={settings.shippingFee}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Order Notification Email</label>
          <input
            type="email"
            name="notificationEmail"
            value={settings.notificationEmail}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <h3>EFT Banking Details</h3>
        <div className="form-group">
          <label>Bank Name</label>
          <input
            type="text"
            name="bankName"
            value={settings.bankName}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Account Holder</label>
          <input
            type="text"
            name="accountHolder"
            value={settings.accountHolder}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Account Number</label>
          <input
            type="text"
            name="accountNumber"
            value={settings.accountNumber}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Branch Code</label>
          <input
            type="text"
            name="branchCode"
            value={settings.branchCode}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
};

export default AdminSettings;