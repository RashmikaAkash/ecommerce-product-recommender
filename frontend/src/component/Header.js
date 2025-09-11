import React from 'react';

const Header = () => {
  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Add Product', path: '/add-product' },
    { label: 'Manage Product', path: '/product' }
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
      </div>
    </header>
  );
};

export default Header;
