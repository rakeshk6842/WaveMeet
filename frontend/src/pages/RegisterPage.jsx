import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store'
import { authAPI } from '../api'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { setUser, setToken } = useAuthStore()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setIsLoading(true)

    try {
      const response = await authAPI.register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      })
      const { user, token } = response.data

      setUser(user)
      setToken(token)
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('token', token)

      toast.success('Registration successful!')
      navigate('/chat')
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-wavemeet-green to-green-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-wavemeet-green mb-2">WaveMeet</h1>
          <p className="text-gray-600">Create a new account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-wavemeet-green"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
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
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter a password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-wavemeet-green"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-wavemeet-green"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-wavemeet-green text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-wavemeet-green font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
