import { DrawingCanvas } from '../components/DrawingCanvas'

export default function Draw() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-primary">Draw Your Sketch!</h1>
      <div className="grid grid-cols-4">
        <div className="col-span-3">
          <DrawingCanvas />
        </div>
      </div>
    </div>
  )
}

