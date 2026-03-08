import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loadUser } from './redux/authSlice';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LiveChat from './components/LiveChat';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import Wishlist from './pages/Wishlist';
import WalletPage from './pages/WalletPage';
import LoyaltyPage from './pages/LoyaltyPage';
import ReferralPage from './pages/ReferralPage';
import ReturnsPage from './pages/ReturnsPage';
import ComparePage from './pages/ComparePage';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  const dispatch = useDispatch();
  useEffect(() => { if (localStorage.getItem('token')) dispatch(loadUser()); }, [dispatch]);

  return (
    <BrowserRouter>
      <Toaster position="top-center" toastOptions={{ style: { fontFamily:'Outfit,sans-serif', fontWeight:600, borderRadius:14, fontSize:14 } }} />
      <Navbar />
      <main style={{ minHeight: '80vh' }}>
        <Routes>
          <Route path="/"                 element={<Home />} />
          <Route path="/products"         element={<Products />} />
          <Route path="/products/:id"     element={<ProductDetail />} />
          <Route path="/cart"             element={<Cart />} />
          <Route path="/compare"          element={<ComparePage />} />
          <Route path="/login"            element={<Login />} />
          <Route path="/register"         element={<Register />} />
          <Route path="/forgot-password"  element={<ForgotPassword />} />
          <Route path="/checkout"         element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/orders"           element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/profile"          element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/wishlist"         element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
          <Route path="/wallet"           element={<ProtectedRoute><WalletPage /></ProtectedRoute>} />
          <Route path="/loyalty"          element={<ProtectedRoute><LoyaltyPage /></ProtectedRoute>} />
          <Route path="/referral"         element={<ProtectedRoute><ReferralPage /></ProtectedRoute>} />
          <Route path="/returns"          element={<ProtectedRoute><ReturnsPage /></ProtectedRoute>} />
          <Route path="/admin"            element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
      <LiveChat />
    </BrowserRouter>
  );
}
