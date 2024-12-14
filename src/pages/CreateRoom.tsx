import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { generateRoomCode, createRoom, Player } from '../utils/roomUtils'
import toast from 'react-hot-toast'

export default function CreateRoom() {
  const [roomName, setRoomName] = useState('')
  const [maxPlayers, setMaxPlayers] = useState(4)
  const [timeForDrawing, setTimeForDrawing] = useState(60)
  const [timeForGuessing, setTimeForGuessing] = useState(10)
  const [isPrivate, setIsPrivate] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      navigate('/login')
      return
    }

    setIsCreating(true)
    try {
      const roomCode = generateRoomCode()
      createRoom(roomCode, roomName, isPrivate, maxPlayers, timeForDrawing, timeForGuessing, Player.createFromUser(user))
      navigate(`/lobby/${roomCode}`)
    } catch (error) {
      toast.error(`Failed to create room: ${error}`);
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="card bg-base-100 shadow-xl max-w-md mx-auto">
      <div className="card-body">
        <h2 className="card-title text-2xl font-bold text-center text-primary justify-center">Create a Room</h2>
        <p className="text-center text-base-content/70">Set up your game room and invite friends!</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Room Name</span>
            </label>
            <input
              type="text"
              placeholder="Enter room name"
              className="input input-bordered"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Maximum Players</span>
            </label>
            <input
              type="number"
              className="input input-bordered"
              min={0}
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(parseInt(e.currentTarget.value))}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Time allocated for drawing stage (seconds)</span>
            </label>
            <div className="join">
              <input
                type="number"
                placeholder="0"
                className="input input-bordered"
                min={0}
                max={120}
                value={timeForDrawing}
                onChange={(e) => setTimeForDrawing(parseInt(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Time allocated for guessing stage (seconds)</span>
            </label>
            <div className="join">
              <input
                type="number"
                placeholder="0"
                className="input input-bordered"
                min={0}
                max={60}
                value={timeForGuessing}
                onChange={(e) => setTimeForGuessing(parseInt(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Private Room</span>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
              />
            </label>
          </div>

          <button
            type="submit"
            className={`btn btn-primary w-full ${isCreating ? 'loading' : ''}`}
            disabled={isCreating}
          >
            {isCreating ? 'Creating Room...' : 'Create Room'}
          </button>
        </form>
      </div>
    </div>
  )
}

