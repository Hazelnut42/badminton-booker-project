import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Homepage from './pages/Homepage';
import CourtDetails from './pages/CourtDetails';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  return (
    <Router>
      {/* 导航栏组件 */}
      <Navbar isLoggedIn={isLoggedIn} />
      <Routes>
        {/* 首页 */}
        <Route path="/" element={<Homepage />} />
        {/* 球场详情页 */}
        <Route path="/court/:id" element={<CourtDetails />} />
        {/* 登录页 */}
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />}
        />
        {/* 注册页 */}
        <Route path="/register" element={<Register />} />
        {/* 用户资料页 */}
        <Route path="/profile" element={<Profile user={user} />} />
      </Routes>
    </Router>
  );
}

export default App;