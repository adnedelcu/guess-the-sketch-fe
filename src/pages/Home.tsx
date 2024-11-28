import { useNavigate } from 'react-router-dom'
import { GameCard } from '../components/GameCard'
import { useAuth } from '../contexts/AuthContext'

export default function Home() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleAction = (path: string) => {
    if (!user) {
      navigate('/login')
    } else {
      navigate(path)
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-primary">Welcome to Guess the Sketch!</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <GameCard
          title="Join Room"
          description="Join a room and play with your friends"
          action="Join Room"
          onClick={() => handleAction('/join-room')}
        />
        <GameCard
          title="Create Room"
          description="Set up a new game room and invite your friends."
          action="Create Room"
          onClick={() => handleAction('/create-room')}
        />
        <GameCard
          title="Practice"
          description="Practice your drawing skills in single-player mode."
          action="Start Practice"
          onClick={() => handleAction('/draw')}
        />
      </div>
    </div>
  )
}

