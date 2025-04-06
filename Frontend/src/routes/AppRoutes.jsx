import React from 'react'
import { Routes, BrowserRouter , Route } from 'react-router-dom';
import Login from '../screens/login.jsx';
import Home from '../screens/home.jsx';
import Register from '../screens/register.jsx';
import Project from '../screens/project.jsx';
import UserAuth from '../auth/UserAuth.jsx';

const AppRoutes = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UserAuth> <Home /> </UserAuth>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<div>Profile</div>} />
          <Route path="/project" element={<UserAuth> <Project /> </UserAuth>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default AppRoutes
