import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import useAuthStore from './store/authStore';
import Login from './pages/Login';
import Register from './pages/Register';
import Main from './pages/Main';
import Stocks from './pages/Stocks';
import News from './pages/News';
import './App.css';

// 로그인한 사용자만 접근 가능한 라우트
function PrivateRoute({ children }) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// 비로그인 사용자만 접근 가능한 라우트
function PublicRoute({ children }) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  
  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Main />
            </PrivateRoute>
          }
        />
        <Route
          path="/stocks"
          element={
            <PrivateRoute>
              <Stocks />
            </PrivateRoute>
          }
        />
        <Route
          path="/news"
          element={
            <PrivateRoute>
              <News />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;