import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { roomExists, joinRoom, Player } from '../utils/roomUtils'

export default function JoinRoom() {
  const [roomCode, setRoomCode] = useState('')
  const [error, setError] = useState('')
  const [isJoining, setIsJoining] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      navigate('/login')
      return
    }

    setIsJoining(true)
    setError('')

    try {
      const formattedCode = roomCode.toUpperCase().trim()
      if (!roomExists(formattedCode)) {
        setError('Room not found. Please check the code and try again.')
        return
      }

      const joined = joinRoom(formattedCode, Player.createFromUser(user))
      if (joined) {
        navigate(`/lobby/${formattedCode}`)
      } else {
        setError('Unable to join room. It might be full or no longer available.')
      }
    } catch (error) {
      console.error('Failed to join room:', error)
      setError('An error occurred while joining the room.')
    } finally {
      setIsJoining(false)
    }
  }

  return (
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
  )
}

