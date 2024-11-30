import { useRef, useState, useEffect } from 'react'
import { socket } from '../utils/roomUtils'
import { useAuth } from '../contexts/AuthContext'

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 600

const COLORS = [
  '#000000', // Black
  '#FFFFFF', // White
  '#FF0000', // Red
  '#00FF00', // Green
  '#0000FF', // Blue
  '#FFFF00', // Yellow
  '#FF00FF', // Magenta
  '#00FFFF', // Cyan
  '#FFA500', // Orange
  '#800080', // Purple
]

export function DrawingCanvas({ handleUpdateCanvas }: any) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [isNewLine, setIsNewLine] = useState(true)
  const [currentColor, setCurrentColor] = useState('#000000')
  const { user } = useAuth()

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        console.error('initialising canvas');
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      }
    }

    socket.on('updateRoomCanvas', (response) => {
      if (response.playerId === user?._id) {
        return;
      }
      console.log(response.room.canvas.length);
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          console.error('updating canvas with new image');
          const img = new Image();
          img.src = response.room.canvas;
          img.onload = () => {
            ctx.drawImage(img, 0, 0);
          }
        }
      }
    })
  }, [])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    setIsNewLine(true)
    draw(e)
  }

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false)
      setIsNewLine(true)
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (ctx) {
      ctx.strokeStyle = currentColor
      ctx.lineWidth = 2
      ctx.lineCap = 'round'

      const rect = canvas?.getBoundingClientRect()
      const x = e.clientX - (rect?.left ?? 0)
      const y = e.clientY - (rect?.top ?? 0)

      if (isNewLine) {
        ctx.beginPath()
        ctx.moveTo(x, y)
        setIsNewLine(false)
      } else {
        ctx.lineTo(x, y)
        ctx.stroke()
      }
      handleUpdateCanvas(canvas?.toDataURL());
    }
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (ctx) {
      console.error('clearing canvas');
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      handleUpdateCanvas(canvas?.toDataURL());
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 flex space-x-2">
        {COLORS.map((color) => (
          <button
            key={color}
            className={`w-8 h-8 rounded-full ${
              color === currentColor ? 'ring-2 ring-primary ring-offset-2' : ''
            }`}
            style={{ backgroundColor: color }}
            onClick={() => setCurrentColor(color)}
            aria-label={`Select ${color} color`}
          />
        ))}
      </div>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onMouseMove={draw}
        className="border-2 border-accent rounded-lg cursor-crosshair bg-base-100"
        aria-label="Drawing canvas"
      />
      <button onClick={clearCanvas} className="btn btn-primary mt-4">
        Clear Canvas
      </button>
    </div>
  )
}

