import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ChatEntry, Player, Room, socket } from '../utils/roomUtils'
import { formatDateTime } from '../utils/dateUtils'

export default function Lobby() {
  const { roomCode } = useParams<{ roomCode: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('');
  const [animatePhone, setAnimatePhone] = useState(false)
  const [room, setRoom] = useState<Room>(new Room())
  const [players, setPlayers] = useState<Player[]>([])
  const [chatHistory, setChatHistory] = useState<ChatEntry[]>([])
  const [message, setMessage] = useState('')
  const [allowedToBuzz, setAllowedToBuzz] = useState(true)

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
      setChatHistory(room.chatHistory)

      if (room.hasStarted) {
        navigate(`/draw/${roomCode}`)
      }
    });

    socket.on('updateRoom', (response: any) => {
      const room = Room.fromObject(response.room);
      console.log(response.room, room);
      setRoom(room)
      setPlayers(Object.values(response.room.players))
      setChatHistory(room.chatHistory)

      if (room.hasStarted) {
        navigate(`/draw/${roomCode}`);
      }
    })

    socket.on('updateChatHistory', (response: any) => {
      const room = Room.fromObject(response.room);
      console.log(response.room, room);
      setChatHistory(room.chatHistory);

      if (room.chatHistory[room.chatHistory.length-1].buzz) {
        const buzz = new Audio('/buzz.mp3');
        buzz.play();
        setAnimatePhone(true)
        setTimeout(() => setAnimatePhone(false), 500)
      }
      try {
        const buffer = document.getElementById("chatHistory") || { scrollTop: 0, scrollHeight: 0 };
        console.log(buffer.scrollTop, buffer.scrollHeight);
        buffer.scrollTop += 100;
        console.log(buffer.scrollTop, buffer.scrollHeight);
      } catch (err) {
        console.log(err);
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

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send an invitation to the provided email
    setMessage('')

    socket.emit('sendMessage', { code: room.code, player: user, message });
  }

  const sendBuzz = () => {
    setAllowedToBuzz(false);
    setTimeout(() => setAllowedToBuzz(true), 1000);
    socket.emit('sendMessage', { code: room.code, player: user, buzz: true });
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

      <div className="card bg-base-100 shadow-xl mx-auto">
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
          <div className="space-y-6 grid grid-cols-2">
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
                        Leave room
                      </button>
                    </div>
                  ) : (
                    <label>{player.ready ? "Ready" : "Not Ready"}</label>
                  )}
                </div>
              ))}
            </div>
            <div className={`mockup-phone mx-auto ${animatePhone ? 'animate-wiggle' : ''}`}>
              <div className="camera"></div>
              <div className="display">
                <div className="artboard artboard-demo phone-3">
                  <div className="h-full w-full chats overflow-auto content-end" id="chatHistory">
                    {chatHistory.map((entry, key) => {
                      const player = players.find(player => player._id == entry.playerId) || new Player('', 'Unknown', 'Player', 'unknown.player@guess-the-sketch.io');

                      return (
                        <div className={`chat ${entry.playerId === user._id ? 'chat-end' : 'chat-start'}`} key={key}>
                          <div className="chat-image avatar">
                            <div className="w-10 rounded-full">
                              <img src={`https://www.gravatar.com/avatar/${player.email}`} alt="" />
                            </div>
                          </div>
                          <div className="chat-header">
                            {player.firstName} {player.lastName}
                            <time className="text-xs opacity-50">{formatDateTime(entry.date)}</time>
                          </div>
                          {entry.message && <div className="chat-bubble">{entry.message}</div>}
                          {entry.buzz && <div className="chat-bubble chat-bubble-error">!!!BUZZ!!!</div>}
                          <div className="chat-footer opacity-50">{entry.delivered}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className="pb-6 w-full self-end form-control">
                  <div className="input-group">
                    <input type="text" placeholder="Type here" className="input input-bordered max-w-xs" disabled={!socket} value={message} onChange={(event) => setMessage(event.target.value)} />
                    <button type="button" className="btn btn-primary" disabled={!socket || message.trim().length === 0} onClick={sendMessage}>Submit✨</button>
                    <button type="button" className="btn btn-primary" disabled={!socket || !allowedToBuzz} onClick={sendBuzz}>🐝</button>
                  </div>
                </div>
              </div>
            </div>
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

