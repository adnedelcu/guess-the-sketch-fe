import { LeaderboardTable } from '../components/LeaderboardTable'

export default function Leaderboard() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-primary">Leaderboard</h1>
      <LeaderboardTable />
    </div>
  )
}

