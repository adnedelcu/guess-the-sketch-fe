import { useState } from 'react'
import { DrawingCanvas } from '../components/DrawingCanvas'
import { randomAnimal, randomObject, randomSentence } from '../utils/roomUtils'

export default function Draw() {
  const [toDraw, setToDraw] = useState(randomAnimal());

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-primary">Draw Your Sketch!</h1>
      <div className="join">
        <button className="btn btn-ghost" type="button" onClick={() => setToDraw(randomAnimal())}>Random animal</button>
        <button className="btn btn-ghost" type="button" onClick={() => setToDraw(randomObject())}>Random object</button>
        <button className="btn btn-ghost" type="button" onClick={() => setToDraw(randomSentence())}>Random sentence</button>
      </div>
      <h3 className="card-title">Draw: {toDraw}</h3>
      <div className="grid grid-cols-4">
        <div className="col-span-3">
          <DrawingCanvas />
        </div>
      </div>
    </div>
  )
}

