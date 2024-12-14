import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Player, Room, socket } from '../utils/roomUtils'
import { ErrorCodes } from '../utils/errorCodes'
import toast from 'react-hot-toast'

export default function JoinRoom() {
  const [rooms, setRooms] = useState([])
  const [roomCode, setRoomCode] = useState('')
  const [error, setError] = useState('')
  const [isJoining, setIsJoining] = useState(false)
  const [canRefresh, setCanRefresh] = useState(false)
  const navigate = useNavigate()
  const { user, setUser } = useAuth()

  useEffect(() => {
    getRooms()
  }, [])

  const getRooms = () => {
    setCanRefresh(false);
    socket.emit('getRooms', {}, (response: any) => {
      if (response.error) {
        setError(response.message);

        return;
      }

      // console.log(response.rooms);

      setRooms(response.rooms.map((room: object) => Room.fromObject(room)))
    });
    setTimeout(() => {
      setCanRefresh(true);
    }, 1000);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsJoining(true)
    setError('')

    const formData = new FormData(e.target as HTMLFormElement);
    const code = formData.get('code')?.toString() || roomCode;

    try {
      const formattedCode = code.toUpperCase().trim()
      let player;
      if (!user) {
        player = Player.generateRandom();
        setUser(player);
      } else {
        player = Player.createFromUser(user);
      }
      socket.emit('joinRoom', { code: formattedCode, player: player }, (response: any) => {
        if (response.error) {
          if (response.errorCode == ErrorCodes.PlayerAlreadyInRoom) {
            navigate(`/lobby/${formattedCode}`)

            return;
          }

          setError(response.message)

          return;
        }

        navigate(`/lobby/${formattedCode}`)
      })
    } catch (error) {
      toast.error(`Failed to join room: ${error}`)
      setError('An error occurred while joining the room.')
    } finally {
      setIsJoining(false)
    }
  }

  return (
    <>
      <div className="grid grid-cols-2">
        <div className="card bg-base-100 shadow-xl max-w-md mx-auto">
          <div className="card-body">
            <h2 className="card-title text-2xl font-bold text-center text-primary justify-center">Public rooms</h2>
            <p className="text-center text-base-content/70">Join one of these public rooms</p>

            {rooms.map((room: Room, key: any) => (
              <form onSubmit={handleSubmit} className="room grid grid-cols-4" key={key}>
                <input type="hidden" name="code" value={room.code} />
                <div className="col-span-2">{room.name}{room.isFinished && ' (ended)'}</div>
                <div className="playerCount">{room.players.size} / {room.maxPlayers}</div>
                <div className="actions"><button className="btn btn-info">Join room</button></div>
              </form>
            ))}
            <button className="btn" type="button" onClick={getRooms} disabled={!canRefresh}>Refresh</button>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl max-w-md mx-auto">
          <div className="card-body">
            <h2 className="card-title text-2xl font-bold text-center text-primary justify-center">Join a Room</h2>
            <p className="text-center text-base-content/70">Enter the room code to join a game!</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Room Code</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter 6-digit code"
                  className="input input-bordered text-center text-2xl tracking-wider"
                  value={roomCode}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase()
                    if (value.length <= 6 && /^[A-Z0-9]*$/.test(value)) {
                      setRoomCode(value)
                      setError('')
                    }
                  }}
                  maxLength={6}
                  required
                />
              </div>

              {error && (
                <div className="alert alert-error">
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className={`btn btn-primary w-full ${isJoining ? 'loading' : ''}`}
                disabled={isJoining || roomCode.length !== 6}
              >
                {isJoining ? 'Joining Room...' : 'Join Room'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

