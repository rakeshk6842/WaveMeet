import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store'
import { useEffect } from 'react'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ChatPage from './pages/ChatPage'
import './App.css'

function App() {
  const { user, setUser, setToken } = useAuthStore()

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('user')
    const savedToken = localStorage.getItem('token')
    
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser))
      setToken(savedToken)
    }
  }, [setUser, setToken])

  return (
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/chat" /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/chat" /> : <RegisterPage />} />
        <Route path="/chat" element={user ? <ChatPage /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={user ? "/chat" : "/login"} />} />
      </Routes>
    </Router>
  )
}

export default App
