import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-socials">
        <a
          href="https://www.instagram.com/succulentfairygardens/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Instagram
        </a>
        {/* Add more social links here */}
      </div>
      <div className="footer-contact">
        <p>Contact Us: info@succulentfairygardens.co.za</p>
      </div>
      <p style={{ marginTop: '1rem', color: '#ccc', fontSize: '0.9rem' }}>
        &copy; {new Date().getFullYear()} Succulent Fairy Gardens
      </p>
    </footer>
  );
};

export default Footer;