import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { generateRoomCode, createRoom, Player } from '../utils/roomUtils'
import toast from 'react-hot-toast'

export default function CreateRoom() {
  const [roomName, setRoomName] = useState('')
  const [maxPlayers, setMaxPlayers] = useState(4)
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
      createRoom(roomCode, roomName, isPrivate, maxPlayers, Player.createFromUser(user))
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
            <select
              className="select select-bordered"
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
            >
              <option value="2">2 Players</option>
              <option value="3">3 Players</option>
              <option value="4">4 Players</option>
              <option value="5">5 Players</option>
              <option value="6">6 Players</option>
            </select>
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

