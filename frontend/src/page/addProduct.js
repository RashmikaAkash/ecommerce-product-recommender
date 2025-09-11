// src/pages/ProductManagement.jsx
import React, { useState, useEffect } from 'react';
import { Plus, X, Upload, Package, Save, Check, Palette } from 'lucide-react';
import Header from '../component/Header';
import Footer from "../component/Footer";

export default function ProductManagement() {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    tags: [],
    colors: [],
    description: '',
    images: [] // we'll keep this for compatibility, but send single image as `image`
  });

  const [tagInput, setTagInput] = useState('');
  const [colorInput, setColorInput] = useState('');
  const [colorPickerValue, setColorPickerValue] = useState('#000000');
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = [
    "Mens", "Womans", "Kids", "Accessories"
  ];

  // Predefined color options for quick selection
  const popularColors = [
    { name: 'Red', value: '#ef4444' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Green', value: '#10b981' },
    { name: 'Yellow', value: '#f59e0b' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Gray', value: '#6b7280' },
    { name: 'Black', value: '#000000' },
    { name: 'White', value: '#ffffff' },
    { name: 'Navy', value: '#1e40af' },
    { name: 'Brown', value: '#92400e' }
  ];

  useEffect(() => {
    // load draft if exists
    const draft = localStorage.getItem('productDraft');
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        setFormData(prev => ({ ...prev, ...parsed }));
        if (parsed.imagePreview) setImagePreview(parsed.imagePreview);
      } catch (err) {
        // ignore parse errors
      }
    }
  }, []);

  // Helper: clean price input string but keep as string for editing
  const cleanPriceInput = (value) => {
    if (value == null) return '';
    let cleaned = String(value).replace(/[^0-9.-]/g, "");
    const parts = cleaned.split(".");
    if (parts.length > 2) cleaned = parts[0] + "." + parts.slice(1).join("");
    return cleaned;
  };

  const handleInputChange = (field, value) => {
    if (field === "price") {
      const cleaned = cleanPriceInput(value);
      setFormData(prev => ({ ...prev, price: cleaned }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (!tag) return;
    if (!formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
    setTagInput('');
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Enhanced color handlers
  const addColor = () => {
    const color = colorInput.trim();
    if (!color) return;
    if (!formData.colors.includes(color)) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, color]
      }));
    }
    setColorInput('');
  };

  const addColorFromPicker = () => {
    if (!formData.colors.includes(colorPickerValue)) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, colorPickerValue]
      }));
    }
  };

  const addPopularColor = (colorName, colorValue) => {
    if (!formData.colors.includes(colorValue) && !formData.colors.includes(colorName)) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, colorName]
      }));
    }
  };

  const removeColor = (colorToRemove) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter(c => c !== colorToRemove)
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target.result;
        setImagePreview(dataUrl);
        setFormData(prev => ({
          ...prev,
          images: [dataUrl]
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveDraft = () => {
    // Save form to localStorage (including image preview)
    const draft = {
      ...formData,
      imagePreview
    };
    localStorage.setItem('productDraft', JSON.stringify(draft));
    alert('Draft saved locally.');
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Product name is required.';
    if (!String(formData.price).trim()) return 'Price is required.';
    const p = Number(String(formData.price).trim());
    if (!Number.isFinite(p)) return 'Price must be a number.';
    if (!formData.category) return 'Category is required.';
    return null;
  };

  // Helper: parse numeric price and round to 2 decimals
  const normalizePriceForSend = (raw) => {
    if (raw == null) return 0;
    const cleaned = cleanPriceInput(raw);
    const num = Number(cleaned);
    if (!Number.isFinite(num)) return 0;
    return Math.round(num * 100) / 100;
  };

  const handleAddProduct = async () => {
    const err = validateForm();
    if (err) {
      alert(err);
      return;
    }

    setLoading(true);

    const payload = {
      name: formData.name.trim(),
      price: normalizePriceForSend(formData.price),
      category: formData.category,
      tags: formData.tags,
      colors: formData.colors,
      description: formData.description.trim(),
      image: imagePreview || (formData.images && formData.images[0]) || ''
    };

    try {
      const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_BASE}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server responded ${res.status}: ${text}`);
      }

      const result = await res.json();
      // success: clear form and local draft
      setFormData({
        name: '',
        price: '',
        category: '',
        tags: [],
        colors: [],
        description: '',
        images: []
      });
      setImagePreview(null);
      setColorInput('');
      setColorPickerValue('#000000');
      localStorage.removeItem('productDraft');

      alert('Product added successfully!');
      console.log('Added product:', result);
    } catch (error) {
      console.error('Add product error:', error);
      alert(`Failed to add product: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get color display properties
  const getColorDisplay = (colorValue) => {
    if (colorValue.startsWith('#')) {
      return { backgroundColor: colorValue, border: '1px solid #d1d5db' };
    }
    // For named colors, try to find matching popular color
    const popularColor = popularColors.find(pc => 
      pc.name.toLowerCase() === colorValue.toLowerCase()
    );
    if (popularColor) {
      return { backgroundColor: popularColor.value, border: '1px solid #d1d5db' };
    }
    // Fallback for CSS color names or unknown colors
    return { backgroundColor: colorValue, border: '1px solid #d1d5db' };
  };

  return (
    <div style={{
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      lineHeight: 1.6,
      color: '#333',
      backgroundColor: '#fafafa'
    }}>
      <Header />
      <div style={{
        minHeight: '100vh',
        padding: '2rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <Package size={24} style={{ color: '#374151' }} />
              <h1 style={{
                fontSize: '1.75rem',
                fontWeight: '700',
                color: '#111827',
                margin: 0
              }}>
                Add New Product
              </h1>
            </div>

            <div style={{
              display: 'flex',
              gap: '0.75rem'
            }}>
              <button
                onClick={handleSaveDraft}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'white',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  color: '#374151',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}>
                <Save size={16} />
                Save Draft
              </button>

              <button
                onClick={handleAddProduct}
                disabled={loading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: loading ? '#6ee7b7' : '#10b981',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease'
                }}>
                <Check size={16} />
                {loading ? 'Adding...' : 'Add Product'}
              </button>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '2rem'
          }}>
            {/* Left Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* General Information */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '0.75rem',
                padding: '2rem',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
              }}>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '1.5rem',
                  margin: '0 0 1.5rem 0'
                }}>
                  General Information
                </h2>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter product name"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#10b981'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Product Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter product description"
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      resize: 'vertical',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#10b981'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>
              </div>

              {/* Pricing */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '0.75rem',
                padding: '2rem',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
              }}>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '1.5rem',
                  margin: '0 0 1.5rem 0'
                }}>
                  Pricing
                </h2>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Base Price *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{
                      position: 'absolute',
                      left: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#6b7280',
                      fontSize: '0.875rem'
                    }}>
                      $
                    </span>
                    <input
                      type="text"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="0.00"
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.75rem 0.75rem 1.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.2s ease'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#10b981'}
                      onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                    />
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '0.75rem',
                padding: '2rem',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
              }}>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '1.5rem',
                  margin: '0 0 1.5rem 0'
                }}>
                  Product Tags
                </h2>

                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                      placeholder="Add a tag"
                      style={{
                        flex: 1,
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        transition: 'border-color 0.2s ease'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#10b981'}
                      onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                    />
                    <button
                      onClick={addTag}
                      style={{
                        padding: '0.75rem',
                        backgroundColor: '#10b981',
                        border: 'none',
                        borderRadius: '0.5rem',
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s ease'
                      }}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  marginBottom: '1rem'
                }}>
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        backgroundColor: '#e5f3f0',
                        color: '#047857',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.375rem',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}
                    >
                      {tag}
                      <X
                        size={12}
                        style={{ cursor: 'pointer' }}
                        onClick={() => removeTag(tag)}
                      />
                    </span>
                  ))}
                </div>

                {/* Enhanced Colors UI */}
                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '1rem'
                  }}>
                    <Palette size={20} style={{ color: '#6b7280' }} />
                    <label style={{
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#374151'
                    }}>
                      Product Colors
                    </label>
                  </div>

                  {/* Color Picker Section */}
                  <div style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.75rem',
                    padding: '1rem',
                    marginBottom: '1rem'
                  }}>
                    <div style={{
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      color: '#475569',
                      marginBottom: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.025em'
                    }}>
                      Color Picker
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '0.75rem'
                    }}>
                      <input
                        type="color"
                        value={colorPickerValue}
                        onChange={(e) => setColorPickerValue(e.target.value)}
                        style={{
                          width: '50px',
                          height: '40px',
                          border: '2px solid #e2e8f0',
                          borderRadius: '0.5rem',
                          cursor: 'pointer'
                        }}
                      />
                      <div style={{
                        flex: 1,
                        fontSize: '0.875rem',
                        color: '#64748b',
                        fontFamily: 'monospace',
                        backgroundColor: 'white',
                        padding: '0.5rem 0.75rem',
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.375rem'
                      }}>
                        {colorPickerValue}
                      </div>
                      <button
                        onClick={addColorFromPicker}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#5b5b5bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.375rem',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s ease'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#6a6a6aff'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#5b5b5bff'}
                      >
                        Add Color
                      </button>
                    </div>
                  </div>

                  {/* Popular Colors Section */}
                  <div style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.75rem',
                    padding: '1rem',
                    marginBottom: '1rem'
                  }}>
                    <div style={{
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      color: '#475569',
                      marginBottom: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.025em'
                    }}>
                      Popular Colors
                    </div>
                    
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
                      gap: '0.5rem'
                    }}>
                      {popularColors.map((color) => (
                        <button
                          key={color.name}
                          onClick={() => addPopularColor(color.name, color.value)}
                          disabled={formData.colors.includes(color.name) || formData.colors.includes(color.value)}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.25rem',
                            padding: '0.5rem',
                            backgroundColor: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '0.5rem',
                            cursor: formData.colors.includes(color.name) || formData.colors.includes(color.value) ? 'not-allowed' : 'pointer',
                            opacity: formData.colors.includes(color.name) || formData.colors.includes(color.value) ? 0.5 : 1,
                            transition: 'all 0.2s ease'
                          }}
                          onMouseOver={(e) => {
                            if (!e.target.disabled) {
                              e.target.style.borderColor = '#10b981';
                              e.target.style.transform = 'translateY(-1px)';
                            }
                          }}
                          onMouseOut={(e) => {
                            e.target.style.borderColor = '#e2e8f0';
                            e.target.style.transform = 'translateY(0)';
                          }}
                        >
                          <div
                            style={{
                              width: '24px',
                              height: '24px',
                              backgroundColor: color.value,
                              border: color.value === '#ffffff' ? '1px solid #e2e8f0' : '1px solid rgba(0,0,0,0.1)',
                              borderRadius: '50%'
                            }}
                          />
                          <span style={{
                            fontSize: '0.625rem',
                            fontWeight: '500',
                            color: '#64748b'
                          }}>
                            {color.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Color Input */}
                  <div style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.75rem',
                    padding: '1rem',
                    marginBottom: '1rem'
                  }}>
                    <div style={{
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      color: '#475569',
                      marginBottom: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.025em'
                    }}>
                      Custom Color
                    </div>
                    
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="text"
                        value={colorInput}
                        onChange={(e) => setColorInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addColor();
                          }
                        }}
                        placeholder="Enter color name or hex code (e.g., Burgundy, #800020)"
                        style={{
                          flex: 1,
                          padding: '0.75rem',
                          border: '1px solid #e2e8f0',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                          transition: 'border-color 0.2s ease'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#10b981'}
                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                      />
                      <button
                        onClick={addColor}
                        style={{
                          padding: '0.75rem',
                          backgroundColor: '#10b981',
                          border: 'none',
                          borderRadius: '0.5rem',
                          color: 'white',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s ease'
                        }}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Selected Colors Display */}
                  {formData.colors.length > 0 && (
                    <div>
                      <div style={{
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        color: '#475569',
                        marginBottom: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.025em'
                      }}>
                        Selected Colors ({formData.colors.length})
                      </div>
                      
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {formData.colors.map((c, idx) => (
                          <span
                            key={idx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              backgroundColor: 'white',
                              padding: '0.5rem 0.75rem',
                              borderRadius: '0.5rem',
                              fontSize: '0.75rem',
                              fontWeight: '500',
                              border: '1px solid #e5e7eb',
                              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                            }}
                          >
                            <div
                              style={{
                                width: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                flexShrink: 0,
                                ...getColorDisplay(c)
                              }}
                            />
                            <span style={{ color: '#374151' }}>{c}</span>
                            <X
                              size={14}
                              style={{ 
                                cursor: 'pointer',
                                color: '#9ca3af',
                                marginLeft: '0.25rem'
                              }}
                              onClick={() => removeColor(c)}
                              onMouseOver={(e) => e.target.style.color = '#ef4444'}
                              onMouseOut={(e) => e.target.style.color = '#9ca3af'}
                            />
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {/* end Colors */}
              </div>
            </div>

            {/* Right Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Upload Image */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '0.75rem',
                padding: '2rem',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
              }}>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '1.5rem',
                  margin: '0 0 1.5rem 0'
                }}>
                  Upload Image
                </h2>

                <div style={{
                  border: '2px dashed #d1d5db',
                  borderRadius: '0.75rem',
                  padding: '2rem',
                  textAlign: 'center',
                  backgroundColor: '#f9fafb',
                  marginBottom: '1rem',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s ease'
                }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.style.borderColor = '#10b981';
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.style.borderColor = '#d1d5db';
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" style={{ cursor: 'pointer' }}>
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Product preview"
                        style={{
                          width: '100%',
                          maxWidth: '200px',
                          height: '200px',
                          objectFit: 'cover',
                          borderRadius: '0.5rem',
                          marginBottom: '1rem'
                        }}
                      />
                    ) : (
                      <Upload size={48} style={{ color: '#9ca3af', marginBottom: '1rem' }} />
                    )}
                    <div style={{
                      color: '#374151',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      marginBottom: '0.5rem'
                    }}>
                      {imagePreview ? 'Click to change image' : 'Click to upload or drag and drop'}
                    </div>
                    <div style={{
                      color: '#6b7280',
                      fontSize: '0.75rem'
                    }}>
                      SVG, PNG, JPG or GIF (max. 800x400px)
                    </div>
                  </label>
                </div>
              </div>

              {/* Category */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '0.75rem',
                padding: '2rem',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
              }}>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '1.5rem',
                  margin: '0 0 1.5rem 0'
                }}>
                  Category
                </h2>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Product Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      backgroundColor: 'white',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#10b981'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#6b7280',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease'
                  }}>
                  <Plus size={16} />
                  Add Category
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}