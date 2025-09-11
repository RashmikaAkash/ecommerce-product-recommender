// src/page/productcart.js
import React, { useEffect, useState, useRef } from "react";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../component/Header";
import Footer from "../component/Footer";

function getApiBase() {
  try {
    if (typeof process !== "undefined" && process.env && process.env.REACT_APP_API_URL) {
      return String(process.env.REACT_APP_API_URL).replace(/\/$/, "");
    }
  } catch (e) {}
  if (typeof window !== "undefined" && window.location && window.location.hostname) {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      return "http://localhost:5000";
    }
    return window.location.origin;
  }
  return "";
}

const fallbackImage = "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&q=60&auto=format&fit=crop";

export default function ProductCartPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const API_BASE = getApiBase();

  // read id from location.state or query param
  const stateId = location.state && location.state.productId;
  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const queryId = searchParams ? searchParams.get("id") : null;
  const id = stateId || queryId;

  const mainImageRef = useRef(null);
  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recLoading, setRecLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (!id) {
      setError("No product selected.");
      setLoading(false);
      return;
    }
    let mounted = true;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/products/${encodeURIComponent(id)}`, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`Failed to fetch product: ${res.status} ${txt}`);
        }
        const data = await res.json();
        if (!mounted) return;
        setProduct(data);
      } catch (err) {
        if (!mounted) return;
        setError(err.message || "Failed to fetch product");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [API_BASE, id]);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    setRecLoading(true);
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/products/${encodeURIComponent(id)}/recommendations`, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`Failed to fetch recommendations: ${res.status} ${txt}`);
        }
        const data = await res.json();
        if (!mounted) return;
        const recs = Array.isArray(data) ? data.map(r => ({ ...r, id: String(r._id || r.id || r) })) : [];
        setRecommendations(recs);
      } catch (err) {
        console.warn(err);
      } finally {
        if (mounted) setRecLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [API_BASE, id]);

  const addToCart = () => {
    setCartCount(prev => prev + 1);
    alert(`Added "${product?.name ?? 'product'}" to cart`);
  };

  const formatPrice = (value) => {
    if (value == null || Number.isNaN(Number(value))) return "-";
    try {
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(Number(value));
    } catch {
      return String(value);
    }
  };

  if (loading) return (
    <>
      <Header />
      <div style={{ padding: 80, textAlign: "center" }}>Loading product…</div>
      <Footer />
    </>
  );

  if (error) return (
    <>
      <Header />
      <div style={{ padding: 80, textAlign: "center", color: "crimson" }}>Error: {error}</div>
      <Footer />
    </>
  );

  if (!product) return (
    <>
      <Header />
      <div style={{ padding: 80, textAlign: "center" }}>Product not found.</div>
      <Footer />
    </>
  );

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", lineHeight: 1.6, color: "#333", backgroundColor: "#fafafa" }}>
      <Header />
      <main style={{ maxWidth: 1200, margin: "40px auto", padding: "0 16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
          <div style={{ background: "white", padding: 12, borderRadius: 12 }}>
            <img ref={mainImageRef} src={product.image || fallbackImage} alt={product.name} style={{ width: "100%", height: 500, objectFit: "cover", borderRadius: 8 }} />
          </div>

          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800 }}>{product.name}</h1>
            <p style={{ color: "#64748b" }}>{product.description}</p>

            <div style={{ marginTop: 12, marginBottom: 16 }}>
              <div style={{ fontSize: 28, fontWeight: 900 }}>{formatPrice(product.price)}</div>
              {product.originalPrice && <div style={{ textDecoration: "line-through", color: "#94a3b8" }}>{formatPrice(product.originalPrice)}</div>}
            </div>

            {product.colors && product.colors.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>Colors</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {product.colors.map(c => <div key={c} style={{ padding: 8, borderRadius: 8, border: "1px solid #eee" }}>{c}</div>)}
                </div>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div style={{ marginBottom: 22 }}>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>Sizes</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {product.sizes.map(s => <div key={s} style={{ padding: 8, borderRadius: 8, border: "1px solid #eee" }}>{s}</div>)}
                </div>
              </div>
            )}

            <div>
              <button onClick={addToCart} style={{ padding: "14px 20px", borderRadius: 10, background: "#111827", color: "#fff", border: "none", fontWeight: 800, cursor: "pointer" }}>
                <ShoppingCart size={16} /> Add to cart
              </button>
              {cartCount > 0 && <div style={{ marginTop: 12, color: "#10b981" }}>{cartCount} item{cartCount > 1 ? "s" : ""} added</div>}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <section style={{ marginTop: 36 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800 }}>Recommended for you</h2>
            <div style={{ color: "#64748b" }}>{recLoading ? "Loading…" : `${recommendations.length} items`}</div>
          </div>

          {recommendations.length === 0 ? (
            <div style={{ color: "#64748b" }}>No recommendations available.</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
              {recommendations.map(rec => (
                <div key={rec.id} style={{ background: "white", padding: 12, borderRadius: 10, cursor: "pointer" }} onClick={() => navigate(`/productcart?id=${encodeURIComponent(rec.id)}`, { state: { productId: String(rec.id) } })}>
                  <div style={{ height: 120, overflow: "hidden", borderRadius: 8 }}>
                    <img src={rec.image || fallbackImage} alt={rec.name || rec.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ marginTop: 8, fontWeight: 700 }}>{rec.name || rec.title}</div>
                  <div style={{ marginTop: 6 }}>{formatPrice(rec.price)}</div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
