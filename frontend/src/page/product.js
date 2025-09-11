// frontend/src/pages/ClothingPage.jsx
import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, X, Upload, Check } from "lucide-react";
import Header from "../component/Header";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

const ClothingPage = () => {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    designers: false,
    priceRange: false,
    sizes: false,
    print: false,
    materials: false,
  });

  const toggleSection = (sectionKey) =>
    setExpandedSections((p) => ({ ...p, [sectionKey]: !p[sectionKey] }));

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // modal state
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const categories = ["Shirts", "T-Shirts", "Pants", "Suits", "Jackets", "Accessories"];
  
  // Available colors with better visual representation
  const availableColors = [
    { name: "black", hex: "#000000", label: "Black" },
    { name: "white", hex: "#ffffff", label: "White" },
    { name: "gray", hex: "#6b7280", label: "Gray" },
    { name: "cream", hex: "#f5f5dc", label: "Cream" },
    { name: "brown", hex: "#8b4513", label: "Brown" },
    { name: "sage", hex: "#9caf88", label: "Sage" },
    { name: "navy", hex: "#1e3a8a", label: "Navy" },
    { name: "red", hex: "#dc2626", label: "Red" },
    { name: "blue", hex: "#2563eb", label: "Blue" },
    { name: "green", hex: "#16a34a", label: "Green" },
    { name: "multicolor", hex: "linear-gradient(45deg,#ff6b6b,#4ecdc4,#45b7d1,#f9ca24)", label: "Multicolor" },
  ];

  // fetch
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/products`);
      const ct = res.headers.get("content-type") || "";
      const text = await res.text();
      if (!ct.includes("application/json")) {
        console.error("Non-JSON:", text.slice(0, 400));
        throw new Error(`Expected JSON but server returned ${ct}`);
      }
      const data = JSON.parse(text);
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Fetch error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // open edit modal
  const openEdit = (product) => {
    setEditingProduct({
      ...product,
      colors: product.colors || [],
    });
    setSelectedFile(null);
    setPreviewSrc(product.image || null);
    setIsEditing(true);
  };

  // handle file select & preview
  const onFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) {
      setSelectedFile(null);
      setPreviewSrc(editingProduct ? editingProduct.image || null : null);
      return;
    }
    setSelectedFile(f);
    const reader = new FileReader();
    reader.onload = (ev) => setPreviewSrc(ev.target.result);
    reader.readAsDataURL(f);
  };

  // toggle color selection
  const toggleColor = (colorName) => {
    setEditingProduct(prev => {
      const colors = prev.colors || [];
      const hasColor = colors.includes(colorName);
      const newColors = hasColor 
        ? colors.filter(c => c !== colorName)
        : [...colors, colorName];
      return { ...prev, colors: newColors };
    });
  };

  // submit update
  const submitUpdate = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    setSubmitting(true);

    try {
      const id = editingProduct._id || editingProduct.id;
      const fd = new FormData();

      // fields
      fd.append("name", editingProduct.name || "");
      fd.append("price", String(editingProduct.price ?? ""));
      fd.append("category", editingProduct.category || "");
      fd.append("description", editingProduct.description || "");
      // send colors as comma-separated string
      fd.append("colors", (editingProduct.colors || []).join(","));

      // file if selected
      if (selectedFile) fd.append("image", selectedFile);

      const res = await fetch(`${API_BASE}/api/products/${id}`, {
        method: "PUT",
        body: fd,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Update failed");
      }


      // show success, then reload page after short delay so user sees updated listing
      Swal.fire({ icon: "success", title: "Saved", toast: true, position: "top-end", timer: 1200, showConfirmButton: false });
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Update failed", text: err.message || "" });
    } finally {
      setSubmitting(false);
    }
  };

  // delete
  const removeProduct = async (id) => {
    const result = await Swal.fire({
      title: "Delete product?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    });
    if (!result.isConfirmed) return;
    try {
      const res = await fetch(`${API_BASE}/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      Swal.fire({ icon: "success", title: "Deleted", toast: true, position: "top-end", timer: 1000, showConfirmButton: false });
      setTimeout(() => window.location.reload(), 900);
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message || "" });
    }
  };

  // UI helpers for editing inputs
  const setEditField = (field, value) => {
    setEditingProduct((p) => ({ ...p, [field]: value }));
  };

  const ColorDot = ({ color }) => {
    const map = {
      black: "#000000",
      white: "#ffffff",
      gray: "#6b7280",
      cream: "#f5f5dc",
      brown: "#8b4513",
      sage: "#9caf88",
      multicolor: "linear-gradient(45deg,#ff6b6b,#4ecdc4,#45b7d1,#f9ca24)",
    };
    const bg = map[color] || "#ccc";
    const isGrad = String(bg).startsWith("linear-gradient");
    return <div title={color} style={{ width: 14, height: 14, borderRadius: "50%", background: isGrad ? bg : bg, border: color === "white" ? "1px solid #ddd" : "none", marginRight: 8 }} />;
  };

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", lineHeight: 1.6, color: "#333", backgroundColor: "#fafafa" }}>
      <Header />
      <div style={styles.container}>
        <aside style={styles.sidebar}>
          <div style={styles.filterSection}>
            <div style={styles.filterHeader} onClick={() => toggleSection("categories")}>
              <span style={styles.filterTitle}>CATEGORIES</span>
              {expandedSections.categories ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            {expandedSections.categories && <div style={styles.filterContent}>{categories.map((c, i) => <div key={i} className="filter-item" style={styles.filterItem}>{c}</div>)}</div>}
          </div>

          {["designers", "priceRange", "sizes", "print", "materials"].map((k) => (
            <div key={k} style={styles.filterSection}>
              <div style={styles.filterHeader} onClick={() => toggleSection(k)}>
                <span style={styles.filterTitle}>{k.toUpperCase().replace(/([A-Z])/g, " $1")}</span>
                {expandedSections[k] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
              {expandedSections[k] && <div style={styles.filterContent}><div className="filter-item" style={styles.filterItem}>Coming Soon</div></div>}
            </div>
          ))}
        </aside>

        <main style={styles.mainContent}>
          <div style={styles.header}>
            <h1 style={styles.title}>MEN'S LATEST CLOTHING</h1>
            <div style={styles.resultCount}>
              <span>MEN'S FASHION</span>
              <span>{products.length} RESULTS</span>
            </div>
          </div>

          {loading && <div>Loading products...</div>}
          {error && <div style={{ color: "red" }}>{error}</div>}

          <div style={styles.productGrid}>
            {products.length === 0 && !loading ? <div style={{ color: "#667788" }}>No products yet.</div> : null}
            {products.map((product) => {
              const id = product._id || product.id;
              const colors = product.colors || [];
              return (
                <div key={id} className="product-card" style={styles.productCard}>
                  <div style={styles.productImageContainer}>
                    {product.image ? <img src={product.image} alt={product.name} style={{ width: "100%", height: 350, objectFit: "cover" }} /> : <div style={styles.productImage}><div style={styles.placeholderImage}><span style={styles.placeholderText}>Product Image</span></div></div>}
                  </div>
                  <div style={styles.productInfo}>
                    <h3 style={styles.productName}>{product.name ? product.name.toUpperCase() : "Unnamed Product"}</h3>
                    <div style={styles.colorOptions}>
                      {colors.length > 0 ? colors.map((c, i) => <ColorDot key={i} color={c} />) : <span style={{ fontSize: 12, color: "#9aa3ad" }}>No color info</span>}
                    </div>
                    <p style={styles.productPrice}>{product.price != null ? `LKR ${product.price}` : "Price N/A"}</p>
                    <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                      <button onClick={() => openEdit(product)} style={styles.updateBtn}>Update</button>
                      <button onClick={() => removeProduct(id)} style={styles.deleteBtn}>Remove</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* Enhanced Edit Modal */}
      {isEditing && editingProduct && (
        <div style={modalStyles.overlay} onClick={(e) => e.target === e.currentTarget && setIsEditing(false)}>
          <div style={modalStyles.modal}>
            <div style={modalStyles.header}>
              <h2 style={modalStyles.title}>Edit Product</h2>
              <button 
                onClick={() => setIsEditing(false)} 
                style={modalStyles.closeBtn}
                disabled={submitting}
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={submitUpdate} style={modalStyles.form}>
              <div style={modalStyles.formGrid}>
                <div style={modalStyles.leftColumn}>
                  <div style={modalStyles.inputGroup}>
                    <label style={modalStyles.label}>Product Name *</label>
                    <input 
                      value={editingProduct.name || ""} 
                      onChange={(e) => setEditField("name", e.target.value)} 
                      required 
                      style={modalStyles.input}
                      placeholder="Enter product name"
                    />
                  </div>

                  <div style={modalStyles.inputRow}>
                    <div style={{...modalStyles.inputGroup, flex: 1}}>
                      <label style={modalStyles.label}>Price (LKR) *</label>
                      <input 
                        type="number" 
                        value={editingProduct.price ?? ""} 
                        onChange={(e) => setEditField("price", e.target.value)} 
                        required 
                        style={modalStyles.input}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    
                    <div style={{...modalStyles.inputGroup, flex: 1}}>
                      <label style={modalStyles.label}>Category</label>
                      <select 
                        value={editingProduct.category || ""} 
                        onChange={(e) => setEditField("category", e.target.value)} 
                        style={modalStyles.select}
                      >
                        <option value="">Select category</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={modalStyles.inputGroup}>
                    <label style={modalStyles.label}>Description</label>
                    <textarea 
                      value={editingProduct.description || ""} 
                      onChange={(e) => setEditField("description", e.target.value)} 
                      rows={4} 
                      style={modalStyles.textarea}
                      placeholder="Describe the product features, materials, fit, etc."
                    />
                  </div>

                  <div style={modalStyles.inputGroup}>
                    <label style={modalStyles.label}>Available Colors</label>
                    <div style={modalStyles.colorGrid}>
                      {availableColors.map((color) => {
                        const isSelected = (editingProduct.colors || []).includes(color.name);
                        
                        return (
                          <div 
                            key={color.name}
                            onClick={() => toggleColor(color.name)}
                            style={{
                              ...modalStyles.colorOption,
                              ...(isSelected ? modalStyles.colorOptionSelected : {})
                            }}
                          >
                            <div 
                              style={{
                                ...modalStyles.colorSwatch,
                                background: color.hex,
                                border: color.name === 'white' ? '2px solid #e5e7eb' : '2px solid transparent'
                              }}
                            >
                              {isSelected && (
                                <Check size={12} color={color.name === 'white' ? '#374151' : '#ffffff'} />
                              )}
                            </div>
                            <span style={modalStyles.colorLabel}>{color.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div style={modalStyles.rightColumn}>
                  <div style={modalStyles.inputGroup}>
                    <label style={modalStyles.label}>Product Image</label>
                    <div style={modalStyles.imageUploadContainer}>
                      <div style={modalStyles.imagePreview}>
                        {previewSrc ? (
                          <img src={previewSrc} alt="Preview" style={modalStyles.previewImage} />
                        ) : (
                          <div style={modalStyles.imagePlaceholder}>
                            <Upload size={32} color="#9ca3af" />
                            <span style={modalStyles.placeholderText}>No image selected</span>
                          </div>
                        )}
                      </div>
                      
                      <div style={modalStyles.uploadActions}>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={onFileChange}
                          style={{ display: 'none' }}
                          id="image-upload"
                        />
                        <label htmlFor="image-upload" style={modalStyles.uploadBtn}>
                          <Upload size={16} />
                          Choose Image
                        </label>
                        {previewSrc && (
                          <button 
                            type="button"
                            onClick={() => {
                              setSelectedFile(null);
                              setPreviewSrc(null);
                            }}
                            style={modalStyles.removeBtn}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <p style={modalStyles.uploadHint}>
                        Recommended: Square image, min 400x400px, max 5MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div style={modalStyles.footer}>
                <div style={modalStyles.selectedColors}>
                  {editingProduct.colors && editingProduct.colors.length > 0 && (
                    <>
                      <span style={modalStyles.selectedLabel}>Selected colors:</span>
                      <div style={modalStyles.selectedColorsList}>
                        {editingProduct.colors.map((colorName, i) => {
                          const colorData = availableColors.find(c => c.name === colorName);
                          return (
                            <span key={i} style={modalStyles.selectedColorTag}>
                              <div 
                                style={{
                                  ...modalStyles.selectedColorDot,
                                  background: colorData?.hex || '#ccc',
                                  border: colorName === 'white' ? '1px solid #d1d5db' : 'none'
                                }}
                              />
                              {colorData?.label || colorName}
                            </span>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
                
                <div style={modalStyles.actions}>
                  <button 
                    type="button" 
                    onClick={() => setIsEditing(false)} 
                    style={modalStyles.cancelBtn}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    style={{
                      ...modalStyles.saveBtn,
                      ...(submitting ? modalStyles.saveBtnDisabled : {})
                    }}
                    disabled={submitting}
                  >
                    {submitting ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* inject hover styles */}
      <HoverStyles />
    </div>
  );
};

// Hover styles injector
const HoverStyles = () => {
  useEffect(() => {
    if (document.getElementById("clothing-hover")) return;
    const s = document.createElement("style");
    s.id = "clothing-hover";
    s.innerText = `
      .product-card:hover{transform:translateY(-4px);box-shadow:0 8px 24px rgba(0,0,0,0.12)}
      .filter-item:hover{color:#4a5568 !important;border-left-color:#cbd5e0}
    `;
    document.head.appendChild(s);
    return () => {};
  }, []);
  return null;
};

const styles = {
  container: { display: "flex", backgroundColor: "#f8f9fa", minHeight: "100vh", color: "#2d3748" },
  sidebar: { width: 280, backgroundColor: "#fff", padding: 20, borderRight: "1px solid #e2e8f0", position: "sticky", top: 0, height: "fit-content" },
  filterSection: { marginBottom: 20, borderBottom: "1px solid #e2e8f0", paddingBottom: 15 },
  filterHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", padding: "8px 0", userSelect: "none" },
  filterTitle: { fontSize: 14, fontWeight: 600, letterSpacing: "0.5px", color: "#4a5568" },
  filterContent: { marginTop: 10 },
  filterItem: { padding: "8px 0", fontSize: 13, color: "#718096", cursor: "pointer", transition: "color 0.2s ease", borderLeft: "2px solid transparent", paddingLeft: 10 },
  mainContent: { flex: 1, padding: "20px 30px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 40 },
  title: { fontSize: 32, fontWeight: 300, margin: 0, color: "#2d3748" },
  resultCount: { display: "flex", flexDirection: "column", alignItems: "flex-end", fontSize: 12, color: "#a0aec0" },
  productGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 30, marginTop: 20 },
  productCard: { backgroundColor: "#fff", borderRadius: 8, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", transition: "transform .2s ease, box-shadow .2s ease", cursor: "pointer", display: "flex", flexDirection: "column" },
  productImageContainer: { position: "relative", overflow: "hidden" },
  productImage: { width: "100%", height: 350, backgroundColor: "#f1f5f9" },
  placeholderImage: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#e2e8f0", color: "#94a3b8" },
  placeholderText: { fontSize: 14, fontWeight: 500 },
  productInfo: { padding: 20, display: "flex", flexDirection: "column", gap: 6 },
  productName: { fontSize: 14, fontWeight: 500, margin: "0 0 6px 0", letterSpacing: "0.5px", color: "#2d3748", textTransform: "uppercase" },
  colorOptions: { display: "flex", alignItems: "center", marginBottom: 6 },
  productPrice: { fontSize: 14, color: "#4a5568", margin: 0, fontWeight: 500 },
  updateBtn: { padding: "8px 12px", borderRadius: 6, border: "1px solid #2b6cb0", background: "#fff", color: "#2b6cb0", cursor: "pointer" },
  deleteBtn: { padding: "8px 12px", borderRadius: 6, border: "none", background: "#e53e3e", color: "#fff", cursor: "pointer" },
};

// Enhanced modal styles
const modalStyles = {
  overlay: { 
    position: "fixed", 
    inset: 0, 
    background: "rgba(0,0,0,0.6)", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    zIndex: 2000,
    backdropFilter: "blur(4px)"
  },
  modal: { 
    width: "90%",
    maxWidth: 900, 
    maxHeight: "90vh",
    background: "#fff", 
    borderRadius: 16, 
    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.4)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "24px 32px",
    borderBottom: "1px solid #e5e7eb",
    background: "linear-gradient(135deg, #4b5563 0%, #6b7280 100%)",
    color: "#fff"
  },
  title: {
    margin: 0,
    fontSize: 24,
    fontWeight: 600,
    letterSpacing: "-0.025em"
  },
  closeBtn: {
    background: "rgba(255,255,255,0.2)",
    border: "none",
    borderRadius: 8,
    padding: 8,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.2s",
    color: "#fff"
  },
  form: {
    flex: 1,
    overflow: "auto",
    padding: "32px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 300px",
    gap: 32,
    marginBottom: 24
  },
  leftColumn: {
    display: "flex",
    flexDirection: "column",
    gap: 24
  },
  rightColumn: {
    display: "flex",
    flexDirection: "column"
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 8
  },
  inputRow: {
    display: "flex",
    gap: 16
  },
  label: {
    fontSize: 14,
    fontWeight: 600,
    color: "#374151",
    letterSpacing: "0.025em"
  },
  input: {
    padding: "12px 16px",
    borderRadius: 12,
    border: "2px solid #e5e7eb",
    fontSize: 14,
    transition: "border-color 0.2s, box-shadow 0.2s",
    background: "#fff",
    ":focus": {
      borderColor: "#374151",
      boxShadow: "0 0 0 3px rgba(102,126,234,0.1)",
      outline: "none"
    }
  },
  select: {
    padding: "12px 16px",
    borderRadius: 12,
    border: "2px solid #e5e7eb",
    fontSize: 14,
    background: "#fff",
    cursor: "pointer"
  },
  textarea: {
    padding: "12px 16px",
    borderRadius: 12,
    border: "2px solid #e5e7eb",
    fontSize: 14,
    resize: "vertical",
    minHeight: 100,
    fontFamily: "inherit"
  },
  colorGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
    gap: 12
  },
  colorOption: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 12px",
    borderRadius: 10,
    border: "2px solid #e5e7eb",
    cursor: "pointer",
    transition: "all 0.2s",
    background: "#fafafa"
  },
  colorOptionSelected: {
    borderColor: "#374151",
    background: "#f0f4ff",
    transform: "scale(1.02)"
  },
  colorSwatch: {
    width: 24,
    height: 24,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0
  },
  colorLabel: {
    fontSize: 12,
    fontWeight: 500,
    color: "#374151"
  },
  imageUploadContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 16
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    border: "2px dashed #d1d5db",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f9fafb"
  },
  previewImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },
  imagePlaceholder: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    color: "#9ca3af"
  },
  uploadActions: {
    display: "flex",
    gap: 8
  },
  uploadBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 16px",
    borderRadius: 10,
    border: "2px solid #374151",
    background: "#374151",
    color: "#fff",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    transition: "background-color 0.2s",
    textDecoration: "none"
  },
  removeBtn: {
    padding: "10px 16px",
    borderRadius: 10,
    border: "2px solid #ef4444",
    background: "transparent",
    color: "#ef4444",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer"
  },
  uploadHint: {
    fontSize: 12,
    color: "#6b7280",
    margin: 0
  },
  footer: {
    borderTop: "1px solid #e5e7eb",
    padding: "24px 32px",
    background: "#fafbfc"
  },
  selectedColors: {
    marginBottom: 20
  },
  selectedLabel: {
    fontSize: 14,
    fontWeight: 500,
    color: "#374151",
    display: "block",
    marginBottom: 8
  },
  selectedColorsList: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8
  },
  selectedColorTag: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "4px 10px",
    borderRadius: 20,
    background: "#e0e7ff",
    color: "#374151",
    fontSize: 12,
    fontWeight: 500
  },
  selectedColorDot: {
    width: 12,
    height: 12,
    borderRadius: "50%"
  },
  actions: {
    display: "flex",
    gap: 12,
    justifyContent: "flex-end"
  },
  cancelBtn: {
    padding: "12px 24px",
    borderRadius: 10,
    border: "2px solid #d1d5db",
    background: "#fff",
    color: "#374151",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s"
  },
  saveBtn: {
    padding: "12px 24px",
    borderRadius: 10,
    border: "none",
    background: "linear-gradient(135deg, #4b5563 0%, #6b7280 100%)",
    color: "#fff",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
    boxShadow: "0 4px 12px rgba(75,85,99,0.3)"
  },
  saveBtnDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
    transform: "none",
    boxShadow: "none"
  }
};

export default ClothingPage;