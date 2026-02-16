import { useState } from 'react'
impo    <div className="min-h-screen bg-gradient-to-br from-wavemeet-green to-green-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-wavemeet-green mb-2">WaveMeet</h1> useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store'
import { authAPI } from '../api'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { setUser, setToken } = useAuthStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await authAPI.login({ email, password })
      const { user, token } = response.data

      // Save to store and localStorage
      setUser(user)
      setToken(token)
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('token', token)

      toast.success('Login successful!')
      navigate('/chat')
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-wavemeet-green to-green-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-wavemeet-green mb-2">WaveMeet</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-wavemeet-green"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-wavemeet-green"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-wavemeet-green text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-wavemeet-green font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Demo credentials: email@example.com / password123
          </p>
        </div>
      </div>
    </div>
  )
}
