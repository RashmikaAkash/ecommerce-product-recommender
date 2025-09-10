import React, { useState } from 'react';
import { Heart, Star } from 'lucide-react';
import Header from '../component/Header';

export default function FashionEcommerce() {
  const [activeTab, setActiveTab] = useState('Best Seller');
  const [favorites, setFavorites] = useState(new Set());

  const toggleFavorite = (id) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  const products = [
    {
      id: 1,
      name: 'Silk Shorts For Sexy',
      price: '$29.00',
      originalPrice: '$35.00',
      rating: 4.5,
      reviews: 128,
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop&crop=center',
      category: 'Best Seller'
    },
    {
      id: 2,
      name: 'Women Black Shirt',
      price: '$45.99',
      rating: 4.8,
      reviews: 95,
      image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400&h=500&fit=crop&crop=center',
      category: 'New Arrival'
    },
    {
      id: 3,
      name: 'Women t-shirt',
      price: '$35.00',
      originalPrice: '$42.00',
      rating: 4.3,
      reviews: 67,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop&crop=center',
      category: 'Trending'
    },
    {
      id: 4,
      name: 'Women White t-shirt',
      price: '$50.00',
      originalPrice: '$60.00',
      rating: 4.6,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1583743814966-8936f37f4678?w=400&h=500&fit=crop&crop=center',
      category: 'Hot Collection'
    },
    {
      id: 5,
      name: 'Winter Jackets',
      price: '$85.00',
      rating: 4.7,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop&crop=center',
      category: 'Best Seller'
    },
    {
      id: 6,
      name: 'Men White t-shirts',
      price: '$49.99',
      originalPrice: '$55.99',
      rating: 4.4,
      reviews: 78,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop&crop=center',
      category: 'New Arrival'
    },
    {
      id: 7,
      name: 'Men Shirt',
      price: '$130.00',
      originalPrice: '$150.00',
      rating: 4.5,
      reviews: 112,
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop&crop=center',
      category: 'Trending'
    },
    {
      id: 8,
      name: 'Men t-shirt',
      price: '$60.00',
      originalPrice: '$75.00',
      rating: 4.2,
      reviews: 45,
      image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&h=500&fit=crop&crop=center',
      category: 'Hot Collection'
    }
  ];

  const collections = [
    {
      title: 'Woman Collection',
      image: 'https://images.unsplash.com/photo-1494790108755-2616c88f3fd6?w=600&h=700&fit=crop&crop=face',
      overlay: 'dark'
    },
    {
      title: 'Accessories Collection',
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=350&fit=crop&crop=center',
      overlay: 'light'
    },
    {
      title: 'Kids Collection',
      image: 'https://images.unsplash.com/photo-1503919005314-30d93d07d823?w=300&h=350&fit=crop&crop=center',
      overlay: 'dark'
    },
    {
      title: 'Man Collection',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=700&fit=crop&crop=face',
      overlay: 'dark'
    }
  ];

  const tabs = ['Best Seller', 'New Arrival', 'Trending', 'Hot Collection'];

  return (
    <div style={{
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      lineHeight: 1.6,
      color: '#333',
      backgroundColor: '#fafafa'
    }}>

      <Header />

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4rem',
          alignItems: 'center',
          width: '100%'
        }}>
          <div style={{ zIndex: 2 }}>
            <h1 style={{
              fontSize: '3.5rem',
              fontWeight: '700',
              lineHeight: 1.1,
              marginBottom: '1rem',
              color: '#000'
            }}>
              NEW SUMMER<br />
              COLLECTION
            </h1>
            
            <div style={{
              fontSize: '2rem',
              fontWeight: '300',
              color: '#666',
              marginBottom: '2rem'
            }}>
              30% OFF 2022
            </div>
            
            <p style={{
              color: '#777',
              marginBottom: '2rem',
              fontSize: '1.1rem',
              maxWidth: '400px'
            }}>
              The standard chunk of Lorem Ipsum used since the 16 reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum"
            </p>
            
            <button style={{
              background: '#000',
              color: 'white',
              padding: '1rem 2rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
              letterSpacing: '1px',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#333';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#000';
              e.target.style.transform = 'translateY(0)';
            }}
            >
              Shop Now
            </button>
          </div>
          
          <div style={{
            position: 'relative',
            height: '600px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <img 
              src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&h=600&fit=crop&crop=face"
              alt="Model"
              style={{
                width: '400px',
                height: '500px',
                objectFit: 'cover',
                borderRadius: '0',
                filter: 'grayscale(100%)',
                transition: 'filter 0.3s ease'
              }}
            />
          </div>
        </div>
        
        <div style={{
          position: 'absolute',
          right: '2rem',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div style={{ width: '2px', height: '40px', background: '#ccc' }}></div>
          <div style={{ width: '8px', height: '8px', background: '#000', borderRadius: '50%' }}></div>
          <div style={{ width: '8px', height: '8px', background: '#ccc', borderRadius: '50%' }}></div>
          <div style={{ width: '8px', height: '8px', background: '#ccc', borderRadius: '50%' }}></div>
        </div>
      </section>

      {/* Collections Grid */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '4rem 2rem',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 2fr',
          gridTemplateRows: '1fr 1fr',
          gap: '1rem',
          height: '600px'
        }}>
          {collections.map((collection, index) => (
            <div 
              key={collection.title}
              style={{
                position: 'relative',
                gridColumn: index === 0 ? 'span 2' : index === 3 ? 'span 2' : '1',
                gridRow: index === 0 ? '1 / 3' : index === 3 ? '1 / 3' : '1',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              <img 
                src={collection.image}
                alt={collection.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'grayscale(100%)'
                }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: collection.overlay === 'dark' 
                  ? 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)'
                  : 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.3) 100%)',
                display: 'flex',
                alignItems: 'flex-end',
                padding: '2rem'
              }}>
                <h3 style={{
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  margin: 0,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                }}>
                  {collection.title} →
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '4rem 2rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '600',
            marginBottom: '2rem',
            letterSpacing: '2px',
            textTransform: 'uppercase'
          }}>
            PRODUCTS OF THE WEEK
          </h2>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  color: activeTab === tab ? '#000' : '#666',
                  fontWeight: activeTab === tab ? '600' : '400',
                  borderBottom: activeTab === tab ? '2px solid #000' : '2px solid transparent',
                  transition: 'all 0.3s ease'
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {products.slice(0, 8).map((product) => (
            <div key={product.id} style={{
              background: 'white',
              borderRadius: '0',
              overflow: 'hidden',
              position: 'relative',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.05)';
            }}
            >
              <div style={{ position: 'relative', overflow: 'hidden' }}>
                <img 
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '320px',
                    objectFit: 'cover',
                    filter: 'grayscale(100%)',
                    transition: 'filter 0.3s ease, transform 0.3s ease'
                  }}
                />
                
                <button
                  onClick={() => toggleFavorite(product.id)}
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Heart 
                    size={18} 
                    fill={favorites.has(product.id) ? '#ff4757' : 'none'}
                    color={favorites.has(product.id) ? '#ff4757' : '#666'}
                  />
                </button>

                <div style={{
                  position: 'absolute',
                  bottom: '1rem',
                  left: '1rem',
                  right: '1rem',
                  display: 'flex',
                  gap: '0.5rem',
                  opacity: 0,
                  transition: 'opacity 0.3s ease'
                }} className="product-actions">
                  <button style={{
                    flex: 1,
                    background: '#000',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                  }}>
                    Add to Cart
                  </button>
                </div>
              </div>
              
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{
                  fontSize: '1.1rem',
                  fontWeight: '500',
                  marginBottom: '0.5rem',
                  color: '#333'
                }}>
                  {product.name}
                </h3>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Star size={14} fill="#ffd700" color="#ffd700" />
                    <span style={{ fontSize: '0.9rem', color: '#666' }}>{product.rating}</span>
                  </div>
                  <span style={{ fontSize: '0.9rem', color: '#999' }}>({product.reviews} reviews)</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    color: '#000'
                  }}>
                    {product.price}
                  </span>
                  {product.originalPrice && (
                    <span style={{
                      fontSize: '1rem',
                      color: '#999',
                      textDecoration: 'line-through'
                    }}>
                      {product.originalPrice}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <button style={{
            background: 'white',
            color: '#000',
            border: '2px solid #000',
            padding: '1rem 2rem',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500',
            letterSpacing: '1px',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#000';
            e.target.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'white';
            e.target.style.color = '#000';
          }}
          >
            View All
          </button>
        </div>
      </section>

      {/* Sale Banner */}
      <section style={{
        background: 'linear-gradient(135deg, #f8f8f8 0%, #e0e0e0 100%)',
        padding: '4rem 2rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 2fr 1fr',
          gap: '2rem',
          alignItems: 'center'
        }}>
          <div>
            <img 
              src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=500&fit=crop&crop=face"
              alt="Sale Model Left"
              style={{
                width: '100%',
                maxWidth: '300px',
                height: '400px',
                objectFit: 'cover',
                filter: 'grayscale(100%)'
              }}
            />
          </div>

          <div style={{ padding: '2rem' }}>
            <div style={{
              fontSize: '0.9rem',
              color: '#666',
              marginBottom: '1rem',
              letterSpacing: '2px',
              textTransform: 'uppercase'
            }}>
              Deal of the Day
            </div>
            
            <h2 style={{
              fontSize: '4rem',
              fontWeight: '700',
              margin: '1rem 0',
              color: '#000'
            }}>
              SALE UP TO<br />
              <span style={{ fontSize: '5rem' }}>50%</span>
            </h2>
            
            <p style={{
              color: '#777',
              marginBottom: '2rem',
              maxWidth: '400px',
              margin: '0 auto 2rem auto'
            }}>
              Women's end-of-season sale now on. Save from 50% off RRP. Plus free delivery and free returns on qualifying orders of $180 or more.
            </p>
            
            <button style={{
              background: '#000',
              color: 'white',
              padding: '1rem 2rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
              letterSpacing: '1px',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#333';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#000';
              e.target.style.transform = 'translateY(0)';
            }}
            >
              Shop Now
            </button>
          </div>

          <div>
            <img 
              src="https://images.unsplash.com/photo-1506629905332-b2f0529a9eda?w=400&h=500&fit=crop&crop=face"
              alt="Sale Model Right"
              style={{
                width: '100%',
                maxWidth: '300px',
                height: '400px',
                objectFit: 'cover',
                filter: 'grayscale(100%)'
              }}
            />
          </div>
        </div>
      </section>

      <style jsx>{`
        .product-actions {
          opacity: 0 !important;
        }
        
        div:hover .product-actions {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}