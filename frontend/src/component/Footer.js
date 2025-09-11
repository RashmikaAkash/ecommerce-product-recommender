import React, { useState } from 'react';
import { ArrowRight, Linkedin, Twitter, Facebook, Instagram } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      console.log('Subscribing email:', email);
      // Add your subscription logic here
      setEmail('');
      alert('Thank you for subscribing!');
    }
  };

  const footerStyles = {
    footer: {
      backgroundColor: '#2a2a2a',
      color: '#e5e5e5',
      padding: '80px 0 40px 0',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      position: 'relative',
      overflow: 'hidden'
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px',
      position: 'relative',
      zIndex: 2
    },
    mainContent: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr 2fr',
      gap: '60px',
      marginBottom: '60px'
    },
    '@media (max-width: 768px)': {
      mainContent: {
        gridTemplateColumns: '1fr',
        gap: '40px'
      }
    },
    brandSection: {
      display: 'flex',
      flexDirection: 'column'
    },
    logo: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#ffffff',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    logoIcon: {
      width: '32px',
      height: '32px',
      backgroundColor: '#6b7280',
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#ffffff',
      fontWeight: 'bold',
      fontSize: '18px'
    },
    description: {
      fontSize: '16px',
      lineHeight: '1.6',
      color: '#9ca3af',
      maxWidth: '280px'
    },
    column: {
      display: 'flex',
      flexDirection: 'column'
    },
    columnTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#ffffff',
      marginBottom: '24px'
    },
    linkList: {
      listStyle: 'none',
      padding: 0,
      margin: 0
    },
    linkItem: {
      marginBottom: '16px'
    },
    link: {
      color: '#9ca3af',
      textDecoration: 'none',
      fontSize: '15px',
      transition: 'color 0.3s ease',
      cursor: 'pointer'
    },
    linkHover: {
      color: '#ffffff'
    },
    demoSection: {
      backgroundColor: '#374151',
      borderRadius: '16px',
      padding: '40px',
      position: 'relative',
      overflow: 'hidden'
    },
    demoTitle: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#ffffff',
      marginBottom: '8px',
      lineHeight: '1.2'
    },
    demoSubtitle: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#ffffff',
      marginBottom: '24px',
      lineHeight: '1.2'
    },
    emailForm: {
      display: 'flex',
      gap: '12px',
      marginBottom: '20px'
    },
    emailInput: {
      flex: 1,
      padding: '14px 16px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '15px',
      backgroundColor: '#ffffff',
      color: '#374151',
      outline: 'none'
    },
    submitButton: {
      padding: '14px 20px',
      backgroundColor: '#f97316',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background-color 0.3s ease',
      minWidth: '50px'
    },
    submitButtonHover: {
      backgroundColor: '#ea580c'
    },
    illustration: {
      position: 'absolute',
      right: '20px',
      bottom: '0',
      width: '200px',
      height: '200px',
      opacity: '0.8'
    },
    person: {
      position: 'absolute',
      right: '40px',
      bottom: '40px',
      width: '120px',
      height: '140px',
      backgroundColor: '#f97316',
      borderRadius: '60px 60px 20px 20px',
      zIndex: 3
    },
    personHead: {
      position: 'absolute',
      top: '-20px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '50px',
      height: '50px',
      backgroundColor: '#fbbf24',
      borderRadius: '50%'
    },
    personHair: {
      position: 'absolute',
      top: '-25px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '55px',
      height: '40px',
      backgroundColor: '#92400e',
      borderRadius: '30px 30px 10px 10px'
    },
    personLaptop: {
      position: 'absolute',
      bottom: '30px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '60px',
      height: '35px',
      backgroundColor: '#374151',
      borderRadius: '4px'
    },
    laptopScreen: {
      position: 'absolute',
      top: '2px',
      left: '2px',
      right: '2px',
      height: '20px',
      backgroundColor: '#1f2937',
      borderRadius: '2px'
    },
    bottomSection: {
      borderTop: '1px solid #4b5563',
      paddingTop: '40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '20px'
    },
    copyright: {
      fontSize: '14px',
      color: '#9ca3af'
    },
    socialLinks: {
      display: 'flex',
      gap: '20px',
      alignItems: 'center'
    },
    socialLink: {
      color: '#9ca3af',
      transition: 'color 0.3s ease',
      cursor: 'pointer'
    },
    socialLinkHover: {
      color: '#ffffff'
    },
    legalLinks: {
      display: 'flex',
      gap: '30px',
      alignItems: 'center'
    },
    legalLink: {
      color: '#9ca3af',
      textDecoration: 'none',
      fontSize: '14px',
      transition: 'color 0.3s ease',
      cursor: 'pointer'
    },
    decorativeElements: {
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      pointerEvents: 'none',
      overflow: 'hidden'
    },
    leaf1: {
      position: 'absolute',
      bottom: '20px',
      left: '20px',
      width: '80px',
      height: '120px',
      background: 'linear-gradient(45deg, #10b981, #065f46)',
      borderRadius: '50px 10px',
      transform: 'rotate(-15deg)',
      opacity: '0.3'
    },
    leaf2: {
      position: 'absolute',
      top: '40px',
      right: '300px',
      width: '60px',
      height: '90px',
      background: 'linear-gradient(45deg, #10b981, #065f46)',
      borderRadius: '40px 8px',
      transform: 'rotate(25deg)',
      opacity: '0.2'
    },
    // Mobile responsive styles (note: CSS-in-JS doesn't support media queries directly)
    mobileMainContent: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '40px',
      marginBottom: '60px'
    },
    mobileBottomSection: {
      borderTop: '1px solid #4b5563',
      paddingTop: '40px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
      textAlign: 'center'
    },
    mobileLegalLinks: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
      alignItems: 'center'
    }
  };

  const [hoveredLink, setHoveredLink] = useState(null);
  const [hoveredSocial, setHoveredSocial] = useState(null);
  const [isSubmitHovered, setIsSubmitHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Handle window resize for responsive design
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <footer style={footerStyles.footer}>

      {/* Add keyframe animations with a style tag */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
      `}</style>

      <div style={footerStyles.container}>
        <div style={isMobile ? footerStyles.mobileMainContent : footerStyles.mainContent}>
          {/* Brand Section */}
          <div style={footerStyles.brandSection}>
            <div style={footerStyles.logo}>
              <div style={footerStyles.logoIcon}>OS</div>
              OFFICESPACE
            </div>
            <p style={footerStyles.description}>
              Revolutionize your workspace with our cutting-edge office solutions. Elevate productivity and inspire innovation.
            </p>
          </div>

          {/* Resources Column */}
          <div style={footerStyles.column}>
            <h3 style={footerStyles.columnTitle}>Resources</h3>
            <ul style={footerStyles.linkList}>
              {['Why OfficeSpace?', 'Customer Stories', 'Blog', 'Help Center', 'Webinars', 'Workplace Management', 'Glossary'].map((item, index) => (
                <li key={index} style={footerStyles.linkItem}>
                  <a 
                    href=" " 
                    style={{
                      ...footerStyles.link,
                      ...(hoveredLink === `resources-${index}` ? footerStyles.linkHover : {})
                    }}
                    onMouseEnter={() => setHoveredLink(`resources-${index}`)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div style={footerStyles.column}>
            <h3 style={footerStyles.columnTitle}>Company</h3>
            <ul style={footerStyles.linkList}>
              {['About Us', 'Careers', 'Leadership', 'News', 'Partners', 'Events', 'Contact Us'].map((item, index) => (
                <li key={index} style={footerStyles.linkItem}>
                  <a 
                    href=" " 
                    style={{
                      ...footerStyles.link,
                      ...(hoveredLink === `company-${index}` ? footerStyles.linkHover : {})
                    }}
                    onMouseEnter={() => setHoveredLink(`company-${index}`)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Demo Section */}
          <div style={footerStyles.demoSection}>

            <h2 style={footerStyles.demoTitle}>Request a</h2>
            <h2 style={footerStyles.demoSubtitle}>Demo</h2>
            
            <div style={footerStyles.emailForm}>
              <input
                type="email"
                placeholder="Enter your email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={footerStyles.emailInput}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSubscribe(e);
                  }
                }}
              />
              <button 
                onClick={handleSubscribe}
                style={{
                  ...footerStyles.submitButton,
                  ...(isSubmitHovered ? footerStyles.submitButtonHover : {})
                }}
                onMouseEnter={() => setIsSubmitHovered(true)}
                onMouseLeave={() => setIsSubmitHovered(false)}
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div style={isMobile ? footerStyles.mobileBottomSection : footerStyles.bottomSection}>
          <div style={footerStyles.copyright}>
            © 2024 OfficeSpace Software Inc. All rights reserved.
          </div>
          
          <div style={footerStyles.socialLinks}>
            {[
              { Icon: Linkedin, name: 'linkedin' },
              { Icon: Twitter, name: 'twitter' },
              { Icon: Facebook, name: 'facebook' },
              { Icon: Instagram, name: 'instagram' }
            ].map(({ Icon, name }) => (
              <Icon
                key={name}
                size={20}
                style={{
                  ...footerStyles.socialLink,
                  ...(hoveredSocial === name ? footerStyles.socialLinkHover : {})
                }}
                onMouseEnter={() => setHoveredSocial(name)}
                onMouseLeave={() => setHoveredSocial(null)}
              />
            ))}
          </div>

          <div style={isMobile ? footerStyles.mobileLegalLinks : footerStyles.legalLinks}>
            {['Support', 'Privacy Policy', 'Terms of Use', 'Cookie Policy'].map((item, index) => (
              <a
                key={index}
                href=" "
                style={{
                  ...footerStyles.legalLink,
                  ...(hoveredLink === `legal-${index}` ? footerStyles.linkHover : {})
                }}
                onMouseEnter={() => setHoveredLink(`legal-${index}`)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;