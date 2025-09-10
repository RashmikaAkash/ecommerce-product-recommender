import React from 'react';
import { Search, Heart, ShoppingCart, User, Menu } from 'lucide-react';

const Header = () => {
  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Add Product', path: '/add-product' },
    { label: 'Shop', path: '/shop' },
    { label: 'Pages', path: '/pages' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' }
  ];

  return (
    <header style={{
      background: 'white',
      padding: '1rem 2rem',
      borderBottom: '1px solid #eee',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        
        {/* Logo */}
        <div style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          letterSpacing: '2px',
          color: '#000'
        }}>
          OLIVIA GREY.
        </div>
        
        {/* Navigation */}
        <nav style={{ display: 'flex', gap: '2rem' }}>
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.path}
              style={{
                color: '#666',
                textDecoration: 'none',
                fontSize: '0.95rem',
                fontWeight: '400',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = '#000'}
              onMouseLeave={(e) => e.target.style.color = '#666'}
            >
              {link.label}
            </a>
          ))}
        </nav>
        
        {/* Icons */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Search size={20} style={{ color: '#666', cursor: 'pointer' }} />
          <Heart size={20} style={{ color: '#666', cursor: 'pointer' }} />
          <ShoppingCart size={20} style={{ color: '#666', cursor: 'pointer' }} />
          <User size={20} style={{ color: '#666', cursor: 'pointer' }} />
          <Menu size={20} style={{ color: '#666', cursor: 'pointer' }} />
        </div>
      </div>
    </header>
  );
};

export default Header;
