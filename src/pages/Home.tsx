import { useNavigate } from 'react-router-dom'
import { GameCard } from '../components/GameCard'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-primary">Welcome to Guess the Sketch!</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <GameCard
          title="Join Room"
          description="Join a room and play with your friends"
          action="Join Room"
          onClick={() => navigate('/join-room')}
        />
        <GameCard
          title="Create Room"
          description="Set up a new game room and invite your friends."
          action="Create Room"
          onClick={() => navigate('/create-room')}
        />
        <GameCard
          title="Practice"
          description="Practice your drawing skills in single-player mode."
          action="Start Practice"
          onClick={() => navigate('/draw/practice')}
        />
      </div>
    </div>
  )
}

