import { useNavigate, useParams } from 'react-router-dom';
import { DrawingCanvas } from '../components/DrawingCanvas'
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { Player, Room, socket, Stage } from '../utils/roomUtils';

export default function Game() {
  const { roomCode } = useParams<{ roomCode: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('');
  const [players, setPlayers] = useState<Player[]>([])
  const [room, setRoom] = useState(new Room())
  const [canvasData, setCanvasData] = useState('');
  const [guess, setGuess] = useState('');

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
      const room = Room.fromObject(response.room)
      setRoom(room)
      setPlayers(Object.values(response.room.players))
      setCanvasData(room.canvas);
    });
  }, [user, roomCode, navigate])

  if (!user || !roomCode) return null;

  const handleUpdateCanvas = (canvasData: string) => {
    console.log(canvasData.length);
    socket.emit('updateRoomCanvas', { room: room.toPlain(), canvas: canvasData, playerId: user._id });
  };

  const handleLeave = () => {
    socket.emit('leaveRoom', { code: room.code, player: user }, () => {
      navigate('/join-room');
    });
  }

  const handleAdvanceStage = () => {
    socket.emit('advanceStage', { code: room.code, guess });
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      <h1 className="text-4xl font-bold text-center mb-8 text-primary">Draw Your Sketch! {room.name}</h1>
      <div className="grid grid-cols-4">
        <div className="col-span-3">
          {room.currentStage()?.stage == Stage.Draw ? (
            <h3>Word to draw: {room.currentStage()?.word}</h3>
          ) : (
            <h3>Guess the drawing</h3>
          )}
          <DrawingCanvas handleUpdateCanvas={handleUpdateCanvas} canvasData={canvasData} allowedToDraw={room.currentStage()?.stage == Stage.Draw && room.currentStage()?.player._id == user._id} />
          {room.currentStage()?.stage == Stage.Guess && (
            <input type="text" value={guess} onChange={(e) => setGuess(e.currentTarget.value)} placeholder="What do you think the drawing represents?" />
          )}
        </div>
        <div>
          <h3 className='card-title'>Players</h3>
          <hr />
          <ul>
            {players.map((player, key) => (
              <li key={key}>
                {player.firstName} {player.lastName}
                {player._id === user._id && (
                  <>
                    <span>(You)</span>
                    <button onClick={() => handleLeave()} className="btn btn-danger">
                      Leave room
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
          <pre>{JSON.stringify(room, null, 2)}</pre>
          <button type="button" className="btn btn-primary" disabled={!room.nextStage()} onClick={handleAdvanceStage}>Advance stage</button>
        </div>
      </div>
    </div>
  )
}

