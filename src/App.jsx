import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import Login from './components/Login'
import Register from './components/Register';
import MainPage from './pages/MainPage';
import ProtectedRoute from './components/ProtectedRoute.jsx';




function App() {

  return (
    <BrowserRouter>
      <AuthProvider>

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/main" element={
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <MainPage initialView="dashboard" />
            </ProtectedRoute>
          } />
          <Route path="/shipping" element={
            <ProtectedRoute>
              <MainPage initialView="shipping" />
            </ProtectedRoute>
          } />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
