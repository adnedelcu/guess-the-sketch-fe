import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import Header from './components/Header'
import Home from './pages/Home'
import Game from './pages/Game'
import HowToPlay from './pages/HowToPlay'
import Leaderboard from './pages/Leaderboard'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Lobby from './pages/Lobby'
import CreateRoom from './pages/CreateRoom'
import JoinRoom from './pages/JoinRoom'

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <div className="min-h-screen bg-base-100 flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/game/:roomCode" element={<Game />} />
                <Route path="/how-to-play" element={<HowToPlay />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/create-room" element={<CreateRoom />} />
                <Route path="/join-room" element={<JoinRoom />} />
                <Route path="/lobby/:roomCode" element={<Lobby />} />
              </Routes>
              <Toaster />
            </main>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  )
}

export default App

