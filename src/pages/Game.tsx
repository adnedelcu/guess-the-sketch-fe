import { useNavigate, useParams } from 'react-router-dom';
import { DrawingCanvas } from '../components/DrawingCanvas'
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { GameStage, Player, Room, socket, Stage } from '../utils/roomUtils';

export default function Game() {
  const { roomCode } = useParams<{ roomCode: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('');
  const [players, setPlayers] = useState<Player[]>([])
  const [room, setRoom] = useState(new Room())
  const [canvasData, setCanvasData] = useState('');
  const [guess, setGuess] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(0);

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
      setTimeRemaining(room.currentStage()?.ttl!);
      setPlayers([...room.players.values()])
      setCanvasData(room.currentStage()?.canvas!)
    });

    socket.on('updateRoom', (response: any) => {
      const room = Room.fromObject(response.room);
      // console.log('updateRoom', room);
      setRoom(room)
      setTimeRemaining(room.currentStage()?.ttl!);
      setPlayers([...room.players.values()])
      setCanvasData(room.currentStage()?.canvas!)
    });

    return () => {
      socket.off('updateRoom');
    }
  }, [user, roomCode, navigate])

  useEffect(() => {
    if (!user) {
      return
    }

    setTimeRemaining(room.currentStage()?.ttl!);
    setPlayers([...room.players.values()])
    setCanvasData(room.currentStage()?.canvas!)
    // console.log('room.isFinished', room.isFinished);
    // console.log('room: ', room);
    // console.log('Time left: ', room.currentStage()?.ttl);
    if (room.isFinished) {
      socket.off('updateRoom');
      return;
    }
    if (room.currentStage()?.ttl === 0) {
      // console.log('Timer expired');

      // console.log('room.currentStage()?.player._id === user._id', room.currentStage()?.player._id === user._id);
      if (room.currentStage()?.player._id === user._id) {
        handleAdvanceStage()
      }
    }
  }, [room]);

  useEffect(() => {
    // console.log(canvasData?.length);
  }, [canvasData])

  if (!user || !roomCode) return null;

  const handleUpdateCanvas = (canvasData: string) => {
    setCanvasData(canvasData);
    socket.emit('updateRoomCanvas', { code: roomCode, canvas: canvasData, playerId: user._id });
  };

  const handleLeave = () => {
    socket.emit('leaveRoom', { code: roomCode, player: user }, () => {
      navigate('/join-room');
    });
  }

  const handleAdvanceStage = () => {
    // console.log('handleAdvanceStage', room, canvasData.length);
    if (room.currentStage()?.stage == Stage.Draw) {
      socket.emit('advanceStage', { code: roomCode, canvas: canvasData });
    } else {
      socket.emit('advanceStage', { code: roomCode, guess });
    }
    setTimeRemaining(0);
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      <h1 className="text-4xl font-bold text-center mb-8 text-primary">Draw Your Sketch! {room.name}</h1>
      {room.isFinished ? (
        <div className="grid grid-cols-4">
          <div className="col-span-3">
            {Array.from(room.game.stages.values()).map((stage: GameStage, key: number) => (
              <div className="card" key={key}>
                <div className="card-title">
                  {stage.player.firstName} {stage.player.lastName} thought this drawing {stage.stage == Stage.Draw ? `best represents "${stage.word}"` : `looks like "${stage.word}"`}
                </div>
                <div className="card-body">
                  <img src={stage.canvas} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-4">
          <div className="col-span-3">
            {room.currentStage()?.stage == Stage.Draw ? (
              <h3 className="card-title">Word to draw: {room.currentStage()?.player._id === user._id ? room.currentStage()?.word : '?????????????'}</h3>
            ) : (
              <h3>Guess the drawing</h3>
            )}
            {timeRemaining && <p>Time left: {timeRemaining}</p>}
            <DrawingCanvas handleUpdateCanvas={handleUpdateCanvas} canvasData={canvasData} handleAdvanceStage={handleAdvanceStage} allowedToDraw={room.currentStage()?.stage == Stage.Draw && room.currentStage()?.player._id == user._id} />
            {room.currentStage()?.stage == Stage.Guess && room.currentStage()?.player._id == user._id && (
              <>
                <input type="text" value={guess} onChange={(e) => setGuess(e.currentTarget.value)} placeholder="What do you think the drawing represents?" />
                <button type="button" className='btn btn-primary' onClick={handleAdvanceStage}>Guess</button>
              </>
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
            {/* <pre>{JSON.stringify(room.nextStage(), null, 2)}</pre> */}
            {/* <button type="button" className="btn btn-primary" disabled={!room.nextStage()} onClick={handleAdvanceStage}>Advance stage</button> */}
          </div>
        </div>
      )}
    </div>
  )
}

