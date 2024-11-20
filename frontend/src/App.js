import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Homepage from './pages/Homepage';
import CourtDetails from './pages/CourtDetails';
import Profile from './pages/Profile';
import BookingPage from './pages/BookingPage';
import ConfirmationPage from './pages/ConfirmationPage';
import Navbar from './components/Navbar';

// 路由保护组件
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} />
      <Routes>
        {/* 首页 */}
        <Route path="/home" element={<Homepage />} />

        {/* 球场详情页 */}
        <Route path="/court/:id" element={<CourtDetails />} />

        {/* 登录页 */}
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />}
        />

        {/* 注册页 */}
        <Route path="/register" element={<Register />} />

        {/* 预订页面 */}
        <Route path="/bookings/:courtId/:userId" element={<BookingPage />} />

        {/* 确认页面 */}
        <Route path="/confirmation" element={<ConfirmationPage />} />

        {/* 受保护的用户资料页 */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile user={user} />
            </PrivateRoute>
          }
        />

        {/* 根路由重定向 */}
        <Route path="/" element={<Navigate to="/home" />} />
      </Routes>
    </>
  );
}

export default App;