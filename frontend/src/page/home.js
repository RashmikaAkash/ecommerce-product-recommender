// src/page/home.js
import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "../component/Header";
import Footer from "../component/Footer";
import Men from "../assest/men.jpeg";
import Kids from "../assest/kids.jpeg";
import Assest from "../assest/assest.jpeg";
import Woman from "../assest/woman.jpg";
import Model from "../assest/model2.jpg";
import Modelhero from "../assest/modelhero.jpeg";
import Modelleft from "../assest/modelleft.jpeg";

/* Robust API base getter */
function getApiBase() {
  try {
    if (typeof process !== "undefined" && process.env && process.env.REACT_APP_API_URL) {
      return String(process.env.REACT_APP_API_URL).replace(/\/$/, "");
    }
  } catch (e) { }

  if (typeof window !== "undefined" && window.location && window.location.hostname) {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      return "http://localhost:5000";
    }
    return window.location.origin;
  }

  return "";
}

/* category matcher */
function matchesTabCategory(tab, category) {
  if (!tab || tab === "All") return true;
  if (!category) return false;
  const cat = String(category).toLowerCase().trim();

  const buckets = {
    Mens: ["Mens"],
    Womans: ["Womans"],
    Kids: ["Kids"],
    Accessories: ["Accessories"],
  };

  const allowed = buckets[tab] || [];
  for (const token of allowed) {
    if (cat === token || cat.includes(token)) return true;
  }
  if (cat === tab.toLowerCase()) return true;
  return false;
}

// countdown helpers
function calcRemaining(ms) {
  if (ms <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const total = Math.floor(ms / 1000);
  const days = Math.floor(total / (24 * 3600));
  const hours = Math.floor((total % (24 * 3600)) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return { days, hours, minutes, seconds };
}
const two = (n) => String(n).padStart(2, "0");

function FlashCountdown({ endISO, onExpired }) {
  const [remainingMs, setRemainingMs] = useState(() => {
    const end = Date.parse(endISO);
    if (Number.isNaN(end)) return 0;
    return Math.max(0, end - Date.now());
  });

  useEffect(() => {
    const end = Date.parse(endISO);
    if (Number.isNaN(end)) return undefined;

    const tick = () => setRemainingMs(Math.max(0, end - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endISO]);

  useEffect(() => {
    if (remainingMs <= 0 && typeof onExpired === "function") onExpired();
  }, [remainingMs, onExpired]);

  const parts = calcRemaining(remainingMs);
  const end = Date.parse(endISO);
  const windowMs = (() => {
    const defaultWindow = 9 * 24 * 3600 * 1000;
    const start = isNaN(end) ? Date.now() - defaultWindow : end - defaultWindow;
    const total = Math.max(1, end - start);
    const used = Math.max(0, Math.min(total, total - remainingMs));
    return Math.round((used / total) * 100);
  })();

  return (
    <div className="flash-countdown" role="group" aria-label="Flash sale countdown">
      <div className="flash-header">
        <div className="flash-badge">FLASH SALE</div>
        <div className="flash-copy">Ends in</div>
      </div>

      <div className="timer-row" aria-live="polite">
        <div className="time-box">
          <div className="time-value">{String(parts.days)}</div>
          <div className="time-label">Days</div>
        </div>

        <div className="time-box">
          <div className="time-value">{two(parts.hours)}</div>
          <div className="time-label">Hours</div>
        </div>

        <div className="time-box">
          <div className="time-value">{two(parts.minutes)}</div>
          <div className="time-label">Minutes</div>
        </div>

        <div className="time-box">
          <div className="time-value">{two(parts.seconds)}</div>
          <div className="time-label">Seconds</div>
        </div>
      </div>

      <div className="progress-wrap" aria-hidden>
        <div className="progress-bar" style={{ width: `${windowMs}%` }} />
      </div>

      <style>{`
        .flash-countdown {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          background: linear-gradient(135deg, #111827 0%, #1f2937 100%);
          color: white;
          padding: 18px 20px;
          border-radius: 14px;
          box-shadow: 0 8px 30px rgba(17,24,39,0.45);
          max-width: 520px;
          margin: 0 auto;
        }
        .flash-header { display:flex; align-items:center; gap:12px; }
        .flash-badge {
          background: linear-gradient(90deg,#ff7a7a,#ff4757);
          padding: 6px 10px;
          border-radius: 999px;
          font-weight: 700;
          font-size: 0.85rem;
          letter-spacing: 0.6px;
        }
        .flash-copy { font-size: 0.95rem; color: #e5e7eb; font-weight:600; }
        .timer-row { display:flex; gap: 10px; width:100%; justify-content:center; align-items:center; }
        .time-box { min-width: 76px; background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02)); padding:10px 8px; border-radius:10px; text-align:center; box-shadow: inset 0 -4px 10px rgba(0,0,0,0.25); border:1px solid rgba(255,255,255,0.04); }
        .time-value { font-size:1.4rem; font-weight:800; letter-spacing:-1px; color:#fff; }
        .time-label { font-size:0.72rem; color:#cbd5e1; margin-top:6px; }
        .progress-wrap { width:100%; background: rgba(255,255,255,0.04); height:8px; border-radius:999px; overflow:hidden; }
        .progress-bar { height:100%; background: linear-gradient(90deg,#ff7a7a,#ff4757); transition: width 1s linear; }
        @media (max-width:640px){ .time-box { min-width:64px; } .time-value { font-size:1.1rem } }
      `}</style>
    </div>
  );
}

export default function FashionEcommerce() {
  const API_BASE = getApiBase();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("All");
  const [favorites, setFavorites] = useState(() => {
    try {
      const raw = localStorage.getItem("favorites");
      if (!raw) return new Set();
      const arr = JSON.parse(raw);
      return new Set(Array.isArray(arr) ? arr.map((id) => String(id)) : []);
    } catch {
      return new Set();
    }
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [showWishlistOnly, setShowWishlistOnly] = useState(false);

  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try {
      const raw = localStorage.getItem("recentlyViewed");
      if (!raw) return [];
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  });

  const DEFAULT_SALE_END = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 9);
    d.setHours(23, 59, 59, 0);
    return d.toISOString();
  })();

  let FLASH_SALE_END = DEFAULT_SALE_END;
  try {
    if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_FLASH_SALE_END) {
      FLASH_SALE_END = process.env.REACT_APP_FLASH_SALE_END;
    }
  } catch (e) { }

  // fetch products
  useEffect(() => {
    const controller = new AbortController();
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      try {
        const url = `${API_BASE}/api/products`;
        const res = await fetch(url, {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`Failed to fetch products: ${res.status} ${txt}`);
        }
        const data = await res.json();
        const normalized = Array.isArray(data)
          ? data.map((p, i) => {
            const rawId = p._id || p.id || `${String(p.name || 'product')}-${i}`;
            return { ...p, id: String(rawId) };
          })
          : [];
        setProducts(normalized);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
    return () => controller.abort();
  }, [API_BASE]);

  useEffect(() => {
    try {
      localStorage.setItem("favorites", JSON.stringify(Array.from(favorites)));
    } catch { }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewed));
    } catch { }
  }, [recentlyViewed]);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 300);
    return () => clearTimeout(id);
  }, [searchTerm]);

  const toggleFavorite = (productId) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      const idStr = String(productId);
      if (next.has(idStr)) next.delete(idStr);
      else next.add(idStr);
      return next;
    });
  };

  const isFavorited = (productId) => favorites.has(String(productId));

  const formatPrice = (value) => {
    if (value == null || Number.isNaN(Number(value))) return "-";
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      }).format(Number(value));
    } catch {
      return String(value);
    }
  };

  const fallbackImage =
    "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&q=60&auto=format&fit=crop";

  const collections = [
    { title: "Woman Collection", image: Woman, overlay: "dark" },
    { title: "Accessories Collection", image: Assest, overlay: "light" },
    { title: "Kids Collection", image: Kids, overlay: "dark" },
    { title: "Man Collection", image: Men, overlay: "dark" },
  ];

  const tabs = ["All", "Mens", "Womans", "Kids", "Accessories"];

  function matchesSearch(product, term) {
    if (!term) return true;
    const t = String(term).toLowerCase();
    const name = String(product.name ?? "").toLowerCase();
    const desc = String(product.description ?? "").toLowerCase();
    const cat = String(product.category ?? "").toLowerCase();

    return name.includes(t) || desc.includes(t) || cat.includes(t);
  }

  let filteredProducts = products
    .filter((p) => {
      if (activeTab === 'Wishlist') return isFavorited(p.id);
      return matchesTabCategory(activeTab, p.category);
    })
    .filter((p) => matchesSearch(p, debouncedSearch));

  if (showWishlistOnly) filteredProducts = filteredProducts.filter((p) => isFavorited(p.id));

  const addRecentlyViewed = (product) => {
    if (!product || !product.id) return;
    const snap = {
      id: String(product.id),
      name: product.name ?? "",
      image: product.image ?? fallbackImage,
      price: product.price ?? null,
    };

    setRecentlyViewed((prev) => {
      const filtered = prev.filter((r) => r.id !== snap.id);
      const next = [snap, ...filtered].slice(0, 8);
      return next;
    });
  };

  // --- NAVIGATION: clicking a product opens Productcart (with id passed) ---
  const onProductClick = (product) => {
    addRecentlyViewed(product);
    const id = String(product.id);
    // navigate to /productcart, pass id in state and query param (both)
    navigate(`/productcart?id=${encodeURIComponent(id)}`, { state: { productId: id } });
  };

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        lineHeight: 1.6,
        color: "#333",
        backgroundColor: "#fafafa",
      }}
    >
      <Header />

      {/* Hero Section */}
      <section
        style={{
          background: "linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)",
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 2rem",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4rem",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div style={{ zIndex: 2 }}>
            <h1 style={{ fontSize: "3.5rem", fontWeight: "700", lineHeight: 1.1, marginBottom: "1rem", color: "#000" }}>
              NEW SUMMER
              <br />
              COLLECTION
            </h1>

            <div style={{ fontSize: "2rem", fontWeight: "300", color: "#666", marginBottom: "2rem" }}>30% OFF 2022</div>

            <p style={{ color: "#777", marginBottom: "2rem", fontSize: "1.1rem", maxWidth: "400px" }}>
              The standard chunk of Lorem Ipsum used since the 16 reproduced below for those interested.
            </p>

            <button
              style={{
                background: "#000",
                color: "white",
                padding: "1rem 2rem",
                border: "none",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "500",
                letterSpacing: "1px",
                transition: "all 0.3s ease",
                textTransform: "uppercase",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#333";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "#000";
                e.target.style.transform = "translateY(0)";
              }}
            >
              Shop Now
            </button>
          </div>

          <div style={{ position: "relative", height: "600px", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <img
              src={Modelhero}
              alt="Model"
              style={{ width: "400px", height: "500px", objectFit: "cover", borderRadius: "0", filter: "grayscale(100%)", transition: "filter 0.3s ease" }}
            />
          </div>
        </div>

        <div style={{ position: "absolute", right: "2rem", top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ width: "2px", height: "40px", background: "#ccc" }} />
          <div style={{ width: "8px", height: "8px", background: "#000", borderRadius: "50%" }} />
          <div style={{ width: "8px", height: "8px", background: "#ccc", borderRadius: "50%" }} />
          <div style={{ width: "8px", height: "8px", background: "#ccc", borderRadius: "50%" }} />
        </div>
      </section>

      {/* Collections Grid */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "4rem 2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 2fr", gridTemplateRows: "1fr 1fr", gap: "1rem", height: "600px" }}>
          {collections.map((collection, index) => (
            <div
              key={collection.title}
              style={{
                position: "relative",
                gridColumn: index === 0 ? "span 2" : index === 2 ? "span 2" : "1",
                gridRow: index === 0 ? "1 / 3" : index === 3 ? "1 / 3" : "1",
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <img src={collection.image} alt={collection.title} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(100%)" }} />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    collection.overlay === "dark"
                      ? "linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)"
                      : "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.3) 100%)",
                  display: "flex",
                  alignItems: "flex-end",
                  padding: "2rem",
                }}
              >
                <h3 style={{ color: "white", fontSize: "1.5rem", fontWeight: "600", margin: 0, textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}>
                  {collection.title} →
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "4rem 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: "600", marginBottom: "2rem", letterSpacing: "2px", textTransform: "uppercase" }}>PRODUCTS OF THE WEEK</h2>

          <div style={{ display: "flex", justifyContent: "center", gap: "2rem", marginBottom: "2rem", alignItems: "center" }}>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setShowWishlistOnly(false); }}
                style={{
                  background: "none",
                  border: "none",
                  padding: "0.5rem 1rem",
                  cursor: "pointer",
                  fontSize: "1rem",
                  color: activeTab === tab ? "#000" : "#666",
                  fontWeight: activeTab === tab ? "600" : "400",
                  borderBottom: activeTab === tab ? "2px solid #000" : "2px solid transparent",
                  transition: "all 0.3s ease",
                }}
              >
                {tab}
              </button>
            ))}

            {/* Search input */}
            <div style={{ marginLeft: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products, categories, descriptions..."
                aria-label="Search products"
                style={{
                  padding: "0.5rem 0.75rem",
                  borderRadius: "6px",
                  border: "1px solid #ddd",
                  minWidth: "260px",
                  fontSize: "0.95rem",
                }}
              />

              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.95rem",
                    color: "#666",
                  }}
                >
                  Clear
                </button>
              )}

              <button
                onClick={() => setShowWishlistOnly((s) => !s)}
                aria-pressed={showWishlistOnly}
                style={{
                  marginLeft: "0.5rem",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "6px",
                  border: "1px solid #ddd",
                  background: showWishlistOnly ? '#000' : 'white',
                  color: showWishlistOnly ? 'white' : '#333',
                  cursor: 'pointer'
                }}
                title="Toggle wishlist-only view"
              >
                Wishlist ({Array.from(favorites).length})
              </button>
            </div>
          </div>

          <div style={{ color: "#666", fontSize: "0.95rem" }}>{loading ? "" : `${filteredProducts.length} products`}</div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>Loading products…</div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "crimson" }}>Error: {error}</div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>No products found for this category.</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", marginBottom: "3rem" }}>
            {filteredProducts.slice(0, 100).map((product) => {
              const pid = String(product.id);
              const isFav = isFavorited(pid);
              const imgSrc = product.image ? product.image : fallbackImage;

              return (
                <div
                  key={pid}
                  className="product-card"
                  style={{
                    background: "white",
                    borderRadius: "0",
                    overflow: "hidden",
                    position: "relative",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 5px 15px rgba(0,0,0,0.05)";
                  }}
                >
                  <div style={{ position: "relative", overflow: "hidden" }}>
                    <img
                      src={imgSrc}
                      alt={product.name || "Product image"}
                      onError={(e) => {
                        if (e.currentTarget.src !== fallbackImage) e.currentTarget.src = fallbackImage;
                      }}
                      style={{ width: "100%", height: "320px", objectFit: "cover", transition: "filter 0.3s ease, transform 0.3s ease" }}
                      onClick={() => onProductClick(product)}
                    />

                    <button
                      type="button"
                      onClick={(ev) => {
                        ev.stopPropagation();
                        toggleFavorite(pid);
                      }}
                      aria-label={isFav ? "Remove favorite" : "Add favorite"}
                      style={{
                        position: "absolute",
                        top: "1rem",
                        right: "1rem",
                        background: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <Heart size={18} fill={isFav ? "#ff4757" : "none"} color={isFav ? "#ff4757" : "#666"} />
                    </button>

                    <div style={{ position: "absolute", bottom: "1rem", left: "1rem", right: "1rem", display: "flex", gap: "0.5rem", opacity: 0, transition: "opacity 0.3s ease" }} className="product-actions">
                      <button
                        onClick={() => onProductClick(product)}
                        style={{ flex: 1, background: "#000", color: "white", border: "none", padding: "0.75rem", cursor: "pointer", fontSize: "0.9rem", fontWeight: "500" }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>

                  <div style={{ padding: "1.5rem" }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: "500", marginBottom: "0.5rem", color: "#333" }}>{product.name ?? "Unnamed product"}</h3>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontSize: "1.2rem", fontWeight: "600", color: "#000" }}>{formatPrice(product.price)}</span>
                      {product.originalPrice && (
                        <span style={{ fontSize: "1rem", color: "#999", textDecoration: "line-through" }}>{formatPrice(product.originalPrice)}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Recently viewed */}
      {recentlyViewed && recentlyViewed.length > 0 && (
        <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
          <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem" }}>Recently viewed</h3>
          <div style={{ display: "flex", gap: "1rem", overflowX: "auto", paddingBottom: "0.5rem" }}>
            {recentlyViewed.map((rv) => (
              <div key={rv.id} style={{ minWidth: "180px", background: "white", borderRadius: "6px", overflow: "hidden", boxShadow: "0 6px 18px rgba(0,0,0,0.06)", cursor: "pointer" }} onClick={() => {
                const p = products.find((x) => String(x.id) === rv.id);
                if (p) onProductClick(p);
                else navigate(`/productcart?id=${encodeURIComponent(rv.id)}`, { state: { productId: String(rv.id) } });
              }}>
                <img src={rv.image || fallbackImage} alt={rv.name || 'Viewed product'} style={{ width: "100%", height: "120px", objectFit: "cover" }} />
                <div style={{ padding: "0.75rem" }}>
                  <div style={{ fontSize: "0.95rem", fontWeight: "500", color: "#333", marginBottom: "0.25rem" }}>{rv.name || 'Product'}</div>
                  <div style={{ fontSize: "0.9rem", color: "#666" }}>{rv.price != null ? formatPrice(rv.price) : ''}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Sale Banner */}
      <section style={{ background: "linear-gradient(135deg, #f8f8f8 0%, #e0e0e0 100%)", padding: "4rem 2rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 2fr 1fr", gap: "2rem", alignItems: "center" }}>
          <div>
            <img src={Modelleft} alt="Sale Model Left" style={{ width: "100%", maxWidth: "300px", height: "400px", objectFit: "cover", filter: "grayscale(100%)" }} />
          </div>

          <div style={{ padding: "2rem", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <FlashCountdown endISO={FLASH_SALE_END} onExpired={() => console.log('flash sale expired')} />

            <div style={{ fontSize: "0.9rem", color: "#666", marginTop: '1rem', letterSpacing: "2px", textTransform: "uppercase" }}>Deal of the Day</div>

            <h2 style={{ fontSize: "4rem", fontWeight: "700", margin: "1rem 0", color: "#000" }}>
              SALE UP TO
              <br />
              <span style={{ fontSize: "5rem" }}>50%</span>
            </h2>

            <p style={{ color: "#777", marginBottom: "2rem", maxWidth: "400px", margin: "0 auto 2rem auto" }}>
              Women's end-of-season sale now on. Save from 50% off RRP. Plus free delivery and free returns on qualifying orders of $180 or more.
            </p>

            <button
              style={{ background: "#000", color: "white", padding: "1rem 2rem", border: "none", cursor: "pointer", fontSize: "1rem", fontWeight: "500", letterSpacing: "1px", transition: "all 0.3s ease", textTransform: "uppercase" }}
              onMouseEnter={(e) => {
                e.target.style.background = "#333";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "#000";
                e.target.style.transform = "translateY(0)";
              }}
              onClick={() => navigate('/sale')}
            >
              Shop Now
            </button>
          </div>

          <div>
            <img src={Model} alt="Sale Model Right" style={{ width: "100%", maxWidth: "300px", height: "400px", objectFit: "cover", filter: "grayscale(100%)" }} />
          </div>
        </div>
      </section>

      <style>{` 
        .product-actions {
          opacity: 0 !important;
        }
        .product-card:hover .product-actions {
          opacity: 1 !important;
        }
      `}</style>
      <Footer />
    </div>
  );
}
