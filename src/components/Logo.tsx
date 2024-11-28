import { Pen } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Logo() {
  return (
    <Link to="/" className="flex items-center space-x-2 no-underline">
      <div className="relative">
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
          <Pen className="w-6 h-6 text-primary-content" />
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full" />
      </div>
      <span className="text-2xl font-bold text-primary">Guess the Sketch</span>
    </Link>
  )
}

