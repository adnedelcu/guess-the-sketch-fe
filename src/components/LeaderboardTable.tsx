import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Generate random player data
const generatePlayers = (count: number) => {
  const names = ['Alice', 'Bob', 'Charlie', 'David', 'Eva', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack', 'Kate', 'Liam', 'Mia', 'Noah', 'Olivia', 'Paul', 'Quinn', 'Rachel', 'Sam', 'Tina']
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: names[Math.floor(Math.random() * names.length)],
    score: Math.floor(Math.random() * 1000),
  }))
}

const players = generatePlayers(50) // Generate 50 players for multiple pages

export function LeaderboardTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const playersPerPage = 10
  const totalPages = Math.ceil(players.length / playersPerPage)

  const currentPlayers = players.slice(
    (currentPage - 1) * playersPerPage,
    currentPage * playersPerPage
  )

  // Assume the current user's name is 'You'
  const currentUserName = 'David'

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th className="text-right">Score</th>
          </tr>
        </thead>
        <tbody>
          {currentPlayers.map((player, index) => (
            <tr 
              key={player.id} 
              className={player.name === currentUserName ? "bg-accent bg-opacity-20" : ""}
            >
              <td className="font-medium">{(currentPage - 1) * playersPerPage + index + 1}</td>
              <td>{player.name === currentUserName ? "You" : player.name}</td>
              <td className="text-right">{player.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="btn btn-outline btn-sm"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </button>
        <span className="text-sm text-base-content/70">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="btn btn-outline btn-sm"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </button>
      </div>
    </div>
  )
}

