import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  if (!user) return null

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="card bg-base-100 shadow-xl max-w-md mx-auto">
      <div className="card-body">
        <h2 className="card-title text-2xl font-bold text-center text-primary justify-center">User Profile</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-base-content/70">Username</p>
            <p className="text-lg">{user.username}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-base-content/70">Email</p>
            <p className="text-lg">{user.email}</p>
          </div>
          <button onClick={handleLogout} className="btn btn-outline w-full">Logout</button>
        </div>
      </div>
    </div>
  )
}

