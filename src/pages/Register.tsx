import dayjs from 'dayjs'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'

export default function Register() {
  const API_URL = import.meta.env.VITE_API_URL
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [birthday, setBirthday] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()
  const maxDate = dayjs().subtract(18, 'year').toDate().toJSON().split('T')[0]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const registerDto = { firstName, lastName, email, password, birthday }
    const response = await axios.post(`${API_URL}/auth/register`, registerDto).catch(err => {
      setError(err.response?.data?.message || err.message)
    })
    if (response) {
      const token = response.data?.token
      const user = JSON.parse(atob(token?.split('.')[1]))
      login(token, user)
      navigate('/profile')
    }
  }

  return (
    <div className="card bg-base-100 shadow-xl max-w-md mx-auto">
      <div className="card-body">
        <h2 className="card-title text-2xl font-bold text-center text-primary justify-center">Register</h2>
        <p className="text-center text-base-content/70">Create your account to start playing!</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">First name</span>
            </label>
            <input
              type="text"
              placeholder="Enter your first name"
              className="input input-bordered"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Last name</span>
            </label>
            <input
              type="text"
              placeholder="Enter your last name"
              className="input input-bordered"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Birthday</span>
            </label>
            <input
              type="date"
              placeholder="Enter your birthday"
              className="input input-bordered"
              value={birthday}
              max={maxDate}
              onChange={(e) => setBirthday(e.target.value)}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="input input-bordered"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="Create a password"
              className="input input-bordered"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}

          <button type="submit" className="btn btn-primary w-full">
            Register
          </button>
        </form>
        <p className="text-center text-sm text-base-content/70">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  )
}

