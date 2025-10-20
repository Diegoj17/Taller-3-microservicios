import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login'
import Register from './components/Register';
import MainPage from './pages/MainPage';
// Render dashboard/shipping via MainPage to keep a single source of customerData


function App() {

  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/main" element={<MainPage />} />
          <Route path="/dashboard" element={<MainPage initialView="dashboard" />} />
          <Route path="/shipping" element={<MainPage initialView="shipping" />} />

        </Routes>
      </BrowserRouter>
  )
}

export default App
