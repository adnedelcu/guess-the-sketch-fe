import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Player, Room, socket } from '../utils/roomUtils'

export default function Lobby() {
  const { roomCode } = useParams<{ roomCode: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('');
  const [players, setPlayers] = useState<Player[]>([])
  const [inviteEmail, setInviteEmail] = useState('')
  const [room, setRoom] = useState<Room>(new Room())

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    if (!roomCode) {
      navigate('/join-room')
      return
    }

    socket.emit('getRoom', { code: roomCode }, (response: any) => {
      if (response.error) {
        setError(response.message);
        setTimeout(() => {
          navigate('/join-room');
        }, 500)
        return;
      }
      const room = Room.fromObject(response.room);
      setRoom(room)
      setPlayers(Object.values(response.room.players))

      if (room.hasStarted) {
        navigate(`/draw/${roomCode}`)
      }
    });

    socket.on('updateRoom', (response: any) => {
      const room = Room.fromObject(response.room);
      console.log(response.room, room);
      setRoom(room)
      setPlayers(Object.values(response.room.players))

      if (room.hasStarted) {
        navigate(`/draw/${roomCode}`);
      }
    })
  }, [user, roomCode, navigate])

  if (!user || !roomCode) return null

  const handleReady = () => {
    socket.emit('toggleReady', { room, player: user }, (response: any) => {
      if (response.error) {
        // navigate('/join-room')

        return;
      }

      setPlayers(players.map(player =>
        player._id === user._id ? { ...player, ready: !player.ready } : player
      ))
    });
  }

  const handleLeave = () => {
    socket.emit('leaveRoom', { code: room.code, player: user }, () => {
      navigate('/join-room');
    });
  }

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send an invitation to the provided email
    setInviteEmail('')
  }

  const handleStartGame = () => {
    if (players.every(player => player.ready)) {
      socket.emit('startGame', { code: roomCode }, () => {
        navigate(`/draw/${roomCode}`)
      });
      // Here you would navigate to the game page or start the game logic
    }
  }

  const isOwner = user._id === room.owner._id // Assume the first player is the owner for this example

  return (
    <>
      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      <div className="card bg-base-100 shadow-xl max-w-2xl mx-auto">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold text-center text-primary justify-center">Game Lobby "{room.name}"</h2>
          <div className="grid grid-cols-2">
            <div className="text-center mb-4">
              <p className="text-sm text-base-content/70">Room Code:</p>
              <p className="text-2xl font-mono font-bold tracking-wider">{roomCode}</p>
            </div>
            <div className="text-center mb-4">
              <p className="text-sm text-base-content/70">Owner:</p>
              <p className="text-2xl font-mono font-bold tracking-wider">{room.owner.firstName} {room.owner.lastName}</p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="space-y-4">
              {players.map(player => (
                <div key={player._id} className="flex justify-between items-center">
                  <span>{player.firstName} {player.lastName}{player._id === user._id ? ' (You)' : ''}</span>
                  {player._id === user._id ? (
                    <div className="actions">
                      <button
                        onClick={() => handleReady()}
                        className={`btn ${player.ready ? 'btn-primary' : 'btn-outline'}`}
                      >
                        {player.ready ? "Ready" : "Not Ready"}
                      </button>
                      <button
                        onClick={() => handleLeave()}
                        className="btn btn-danger"
                      >
                        LeaveRoom
                      </button>
                    </div>
                  ) : (
                    <label>{player.ready ? "Ready" : "Not Ready"}</label>
                  )}
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
    </>
  )
}

