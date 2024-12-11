import { Link } from 'react-router-dom'
import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'
import { useAuth } from '../contexts/AuthContext'

export default function Header() {
  const { user } = useAuth()

  return (
    <header className="bg-base-100 border-b border-base-300">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Logo />
        <nav className="flex items-center space-x-4 gap-3">
          <Link to="/how-to-play" className="btn btn-ghost">
            How to Play
          </Link>
          <Link to="/leaderboard" className="btn btn-ghost">
            Leaderboard
          </Link>
          {user ? (
            <>
              <Link to="/create-room" className="btn btn-ghost">
                Create Room
              </Link>
              <Link to="/join-room" className="btn btn-ghost">
                Join Room
              </Link>
              <Link to="/profile" className="btn btn-ghost">
                Profile
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">
                Login
              </Link>
              <Link to="/register" className="btn btn-ghost">
                Register
              </Link>
            </>
          )}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}

