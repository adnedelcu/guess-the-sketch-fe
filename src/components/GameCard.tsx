interface GameCardProps {
  title: string
  description: string
  action: string
  onClick?: () => void
}

export function GameCard({ title, description, action, onClick }: GameCardProps) {
  return (
    <div className="card w-full bg-base-100 shadow-xl border-2 border-accent">
      <div className="card-body">
        <h2 className="card-title text-2xl font-bold text-center text-primary justify-center">{title}</h2>
        <p className="text-center text-base-content/70">{description}</p>
        <div className="card-actions justify-center">
          <button className="btn btn-primary" onClick={onClick}>{action}</button>
        </div>
      </div>
    </div>
  )
}

