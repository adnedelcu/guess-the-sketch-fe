import { useRef, useState, useEffect, TouchEvent, MouseEvent } from 'react'
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

export function DrawingCanvas({ handleUpdateCanvas, handleAdvanceStage, allowedToDraw }: any) {
  handleUpdateCanvas = handleUpdateCanvas !== undefined ? handleUpdateCanvas : (() => {});
  allowedToDraw = allowedToDraw !== undefined ? allowedToDraw :  true;
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
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

        handleUpdateCanvas(canvas.toDataURL());
      }
    }

    socket.on('updateRoomCanvas', (response) => {
      console.log(response.playerId, user?._id);
      if (response.playerId === user?._id) {
        return;
      }
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          const img = new Image();
          img.src = response.canvas;
          img.onload = () => {
            ctx.drawImage(img, 0, 0);
          }
        }
      }
    })
  }, [])

  const startDrawing = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!allowedToDraw) return;
    setIsDrawing(true)
    setIsNewLine(true)
    const rect = canvasRef.current?.getBoundingClientRect()
    const x = e.clientX - (rect?.left ?? 0)
    const y = e.clientY - (rect?.top ?? 0)

    draw(x, y)
  }

  const handleDraw = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!allowedToDraw) return;
    const rect = canvasRef.current?.getBoundingClientRect()
    const x = e.clientX - (rect?.left ?? 0)
    const y = e.clientY - (rect?.top ?? 0)

    draw(x, y)
  }

  const stopDrawing = () => {
    if (!allowedToDraw) return;
    if (isDrawing) {
      setIsDrawing(false)
      setIsNewLine(true)
    }
  }

  const startDrawingTouch = (e: TouchEvent<HTMLCanvasElement>) => {
    if (!allowedToDraw) return;
    setIsDrawing(true)
    setIsNewLine(true)
    const rect = canvasRef.current?.getBoundingClientRect()
    const x = e.touches.item(0).clientX - (rect?.left ?? 0);
    const y = e.touches.item(0).clientY - (rect?.top ?? 0);

    draw(x, y)
  }

  const handleDrawTouch = (e: TouchEvent<HTMLCanvasElement>): void => {
    if (!allowedToDraw) return;
    const rect = canvasRef.current?.getBoundingClientRect()
    const x = e.touches.item(0).clientX - (rect?.left ?? 0);
    const y = e.touches.item(0).clientY - (rect?.top ?? 0);

    draw(x, y)
  }

  const stopDrawingTouch = () => {
    if (!allowedToDraw) return;
    if (isDrawing) {
      setIsDrawing(false)
      setIsNewLine(true)
    }
  }

  const draw = (x: number, y: number) => {
    if (!allowedToDraw) return;
    if (!isDrawing) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (ctx) {
      ctx.strokeStyle = currentColor
      ctx.lineWidth = 2
      ctx.lineCap = 'round'

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
    if (!allowedToDraw) return;
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (ctx) {
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
        onMouseMove={handleDraw}
        onTouchStart={startDrawingTouch}
        onTouchMove={handleDrawTouch}
        onTouchEnd={stopDrawingTouch}
        className="border-2 border-accent rounded-lg cursor-crosshair bg-base-100"
        aria-label="Drawing canvas"
      />
      <button onClick={clearCanvas} disabled={!allowedToDraw} className="btn btn-primary mt-4">
        Clear Canvas
      </button>
      {handleAdvanceStage && <button type="button" className="btn btn-primary" disabled={!allowedToDraw} onClick={handleAdvanceStage}>Advance stage</button>}
    </div>
  )
}

