import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import ProductList from './pages/shop/ProductList';
import ProductDetail from './pages/shop/ProductDetail';
import Cart from './pages/cart/Cart';
import Checkout from './pages/checkout/Checkout';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="products" element={<ProductList />} />
              <Route path="products/:id" element={<ProductDetail />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="*" element={<div className="container" style={{ padding: '5rem' }}><h1>404 - Page Not Found</h1></div>} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
