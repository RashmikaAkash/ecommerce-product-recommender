// src/App.js
import './App.css';
import Home from './page/home';
import AddProduct from './page/addProduct';
import Product from './page/product';
import Productcart from './page/productcart';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />

          {/* keep existing add / product list routes */}
          <Route path="/add-product" element={<AddProduct />} />

          {/* product list (if you use it) */}
          <Route path="/product" element={<Product />} />

          {/* product detail route: /product/:id */}
          <Route path="/product/:id" element={<Product />} />

          <Route path="/productcart" element={<Productcart />} />

          {/* optional fallback */}
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
