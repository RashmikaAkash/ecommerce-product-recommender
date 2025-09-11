// src/page/home.js  (or src/pages/FashionEcommerce.jsx — replace whichever file you changed)
import React, { useEffect, useState } from "react";
import { Heart, Star } from "lucide-react";
import Header from "../component/Header";
import Men from "../assest/men.jpeg"
import Kids from "../assest/kids.jpeg"
import Assest from "../assest/assest.jpeg"
import Woman from "../assest/woman.jpg"
import Model from "../assest/model2.jpg"
import Modelhero from "../assest/modelhero.jpeg"
import Modelleft from "../assest/modelleft.jpeg"

/**
 * Full fixed component — uses REACT_APP_API_URL (CRA) or same-origin fallback.
 *
 * If you run frontend on localhost:3000 and backend on localhost:5000:
 *  - Option 1 (recommended for CRA): add "REACT_APP_API_URL=http://localhost:5000" to frontend/.env and restart dev server.
 *  - Option 2: add "proxy": "http://localhost:5000" to frontend/package.json (CRA) and restart dev server.
 *
 * If you use Vite, let me know and I can give a Vite-specific version.
 */

function getApiBase() {
  try {
    // CRA replacement: process.env.REACT_APP_API_URL
    if (typeof process !== "undefined" && process.env && process.env.REACT_APP_API_URL) {
      return String(process.env.REACT_APP_API_URL).replace(/\/$/, "");
    }
  } catch (e) {
    // ignore
  }

  // fallback to same-origin
  if (typeof window !== "undefined" && window.location && window.location.origin) {
    return window.location.origin;
  }

  return "";
}

export default function FashionEcommerce() {
  const API_BASE = getApiBase();

  const [activeTab, setActiveTab] = useState("All");
  const [favorites, setFavorites] = useState(() => {
    try {
      const raw = localStorage.getItem("favorite");
      if (!raw) return new Set();
      return new Set(JSON.parse(raw));
    } catch {
      return new Set();
    }
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // fetch products
  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      setLoading(true);
      setError(null);
      try {
        const url = `http://localhost:5000/api/products?limit=50`;
        const res = await fetch(url, {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`Failed to fetch products: ${res.status} ${txt}`);
        }
        const data = await res.json();
        const normalized = Array.isArray(data) ? data.map((p) => ({ ...p, id: p._id || p.id })) : [];
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

  // persist favorites
  useEffect(() => {
    try {
      localStorage.setItem("favorites", JSON.stringify(Array.from(favorites)));
    } catch {
      // ignore
    }
  }, [favorites]);

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

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

  const handleAddToCart = (product) => {
    alert(`Add to cart: ${product.name || "Product"}`);
  };

  const fallbackImage =
    "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&q=60&auto=format&fit=crop";

  const collections = [
    {
      title: "Woman Collection",
      image:
        Woman,
      overlay: "dark",
    },
    {
      title: "Accessories Collection",
      image:
        Assest,
      overlay: "light",
    },
    {
      title: "Kids Collection",
      image:
        Kids,
      overlay: "dark",
    },
    {
      title: "Man Collection",
      image:
        Men,
      overlay: "dark",
    },
  ];

  const tabs = ["All","Mens", "Womans", "Kids", "Accessories"];

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
            <h1
              style={{
                fontSize: "3.5rem",
                fontWeight: "700",
                lineHeight: 1.1,
                marginBottom: "1rem",
                color: "#000",
              }}
            >
              NEW SUMMER
              <br />
              COLLECTION
            </h1>

            <div
              style={{
                fontSize: "2rem",
                fontWeight: "300",
                color: "#666",
                marginBottom: "2rem",
              }}
            >
              30% OFF 2022
            </div>

            <p
              style={{
                color: "#777",
                marginBottom: "2rem",
                fontSize: "1.1rem",
                maxWidth: "400px",
              }}
            >
              The standard chunk of Lorem Ipsum used since the 16 reproduced below for those
              interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum"
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

          <div
            style={{
              position: "relative",
              height: "600px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src= {Modelhero}
              alt="Model"
              style={{
                width: "400px",
                height: "500px",
                objectFit: "cover",
                borderRadius: "0",
                filter: "grayscale(100%)",
                transition: "filter 0.3s ease",
              }}
            />
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            right: "2rem",
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div style={{ width: "2px", height: "40px", background: "#ccc" }}></div>
          <div style={{ width: "8px", height: "8px", background: "#000", borderRadius: "50%" }}></div>
          <div style={{ width: "8px", height: "8px", background: "#ccc", borderRadius: "50%" }}></div>
          <div style={{ width: "8px", height: "8px", background: "#ccc", borderRadius: "50%" }}></div>
        </div>
      </section>

      {/* Collections Grid */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "4rem 2rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 2fr",
            gridTemplateRows: "1fr 1fr",
            gap: "1rem",
            height: "600px",
          }}
        >
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
              <img
                src={collection.image}
                alt={collection.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: "grayscale(100%)",
                }}
              />
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
                <h3
                  style={{
                    color: "white",
                    fontSize: "1.5rem",
                    fontWeight: "600",
                    margin: 0,
                    textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                  }}
                >
                  {collection.title} →
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "4rem 2rem",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: "600",
              marginBottom: "2rem",
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            PRODUCTS OF THE WEEK
          </h2>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "2rem",
              marginBottom: "2rem",
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
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
          </div>
        </div>

        {/* Loading / Error */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>Loading products…</div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "crimson" }}>
            Error: {error}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>No products found.</div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "2rem",
              marginBottom: "3rem",
            }}
          >
            {products.slice(0, 8).map((product) => {
              const pid = product.id || product._id || String(Math.random());
              const isFav = favorites.has(pid);
              const imgSrc = product.image ? product.image : fallbackImage;
              const rating = product.rating ?? 4.6;
              const reviews = product.reviews ?? Math.floor(Math.random() * 200 + 1);

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
                      style={{
                        width: "100%",
                        height: "320px",
                        objectFit: "cover",
                        transition: "filter 0.3s ease, transform 0.3s ease",
                      }}
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

                    <div
                      style={{
                        position: "absolute",
                        bottom: "1rem",
                        left: "1rem",
                        right: "1rem",
                        display: "flex",
                        gap: "0.5rem",
                        opacity: 0,
                        transition: "opacity 0.3s ease",
                      }}
                      className="product-actions"
                    >
                      <button
                        onClick={(ev) => {
                          ev.stopPropagation();
                          handleAddToCart(product);
                        }}
                        style={{
                          flex: 1,
                          background: "#000",
                          color: "white",
                          border: "none",
                          padding: "0.75rem",
                          cursor: "pointer",
                          fontSize: "0.9rem",
                          fontWeight: "500",
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>

                  <div style={{ padding: "1.5rem" }}>
                    <h3
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: "500",
                        marginBottom: "0.5rem",
                        color: "#333",
                      }}
                    >
                      {product.name ?? "Unnamed product"}
                    </h3>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                        <Star size={14} fill="#ffd700" color="#ffd700" />
                        <span style={{ fontSize: "0.9rem", color: "#666" }}>{rating}</span>
                      </div>
                      <span style={{ fontSize: "0.9rem", color: "#999" }}>({reviews} reviews)</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span
                        style={{
                          fontSize: "1.2rem",
                          fontWeight: "600",
                          color: "#000",
                        }}
                      >
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span
                          style={{
                            fontSize: "1rem",
                            color: "#999",
                            textDecoration: "line-through",
                          }}
                        >
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
       
      </section>

      {/* Sale Banner */}
      <section
        style={{
          background: "linear-gradient(135deg, #f8f8f8 0%, #e0e0e0 100%)",
          padding: "4rem 2rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 2fr 1fr",
            gap: "2rem",
            alignItems: "center",
          }}
        >
          <div>
            <img
              src={Modelleft}
              alt="Sale Model Left"
              style={{
                width: "100%",
                maxWidth: "300px",
                height: "400px",
                objectFit: "cover",
                filter: "grayscale(100%)",
              }}
            />
          </div>

          <div style={{ padding: "2rem" }}>
            <div
              style={{
                fontSize: "0.9rem",
                color: "#666",
                marginBottom: "1rem",
                letterSpacing: "2px",
                textTransform: "uppercase",
              }}
            >
              Deal of the Day
            </div>

            <h2
              style={{
                fontSize: "4rem",
                fontWeight: "700",
                margin: "1rem 0",
                color: "#000",
              }}
            >
              SALE UP TO
              <br />
              <span style={{ fontSize: "5rem" }}>50%</span>
            </h2>

            <p
              style={{
                color: "#777",
                marginBottom: "2rem",
                maxWidth: "400px",
                margin: "0 auto 2rem auto",
              }}
            >
              Women's end-of-season sale now on. Save from 50% off RRP. Plus free delivery and free
              returns on qualifying orders of $180 or more.
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
              onClick={() => (window.location.href = "/sale")}
            >
              Shop Now
            </button>
          </div>

          <div>
            <img
              src={Model}
              alt="Sale Model Right"
              style={{
                width: "100%",
                maxWidth: "300px",
                height: "400px",
                objectFit: "cover",
                filter: "grayscale(100%)",
              }}
            />
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
    </div>
  );
}
