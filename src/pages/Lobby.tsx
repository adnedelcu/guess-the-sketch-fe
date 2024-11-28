import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { roomExists } from '../utils/roomUtils'

type Player = {
  id: string
  username: string
  ready: boolean
}

export default function Lobby() {
  const { roomCode } = useParams<{ roomCode: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', username: 'Player 1', ready: false },
    { id: '2', username: 'Player 2', ready: false },
    { id: '3', username: 'Player 3', ready: false },
  ])
  const [inviteEmail, setInviteEmail] = useState('')

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    if (!roomCode || !roomExists(roomCode)) {
      navigate('/join-room')
      return
    }
  }, [user, roomCode, navigate])

  if (!user || !roomCode) return null

  const handleReady = (id: string) => {
    setPlayers(players.map(player =>
      player.id === id ? { ...player, ready: !player.ready } : player
    ))
  }

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send an invitation to the provided email
    console.log(`Invited ${inviteEmail} to room ${roomCode}`)
    setInviteEmail('')
  }

  const handleStartGame = () => {
    if (players.every(player => player.ready)) {
      console.log('Starting the game!')
      // Here you would navigate to the game page or start the game logic
    }
  }

  const isOwner = user.id === '1' // Assume the first player is the owner for this example

  return (
    <div className="card bg-base-100 shadow-xl max-w-2xl mx-auto">
      <div className="card-body">
        <h2 className="card-title text-2xl font-bold text-center text-primary justify-center">Game Lobby</h2>
        <div className="text-center mb-4">
          <p className="text-sm text-base-content/70">Room Code:</p>
          <p className="text-2xl font-mono font-bold tracking-wider">{roomCode}</p>
        </div>
        <div className="space-y-6">
          <div className="space-y-4">
            {players.map(player => (
              <div key={player.id} className="flex justify-between items-center">
                <span>{player.username}</span>
                <button
                  onClick={() => handleReady(player.id)}
                  className={`btn ${player.ready ? 'btn-primary' : 'btn-outline'}`}
                >
                  {player.ready ? "Ready" : "Not Ready"}
                </button>
              </div>
            ))}
          </div>
          <form onSubmit={handleInvite} className="flex gap-2">
            <input
              type="email"
              placeholder="Invite player by email"
              className="input input-bordered flex-1"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Invite</button>
          </form>
          {isOwner && (
            <button
              onClick={handleStartGame}
              disabled={!players.every(player => player.ready)}
              className="btn btn-primary w-full"
            >
              Start Game
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

