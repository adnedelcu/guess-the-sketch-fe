export function generateRoomCode(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

// Simulate a database of rooms
const rooms = new Map<string, { owner: string; players: string[] }>()

export function createRoom(roomCode: string, ownerId: string): void {
  rooms.set(roomCode, { owner: ownerId, players: [ownerId] })
  console.log(roomCode, rooms);
}

export function roomExists(roomCode: string): boolean {
  return rooms.has(roomCode)
}

export function joinRoom(roomCode: string, playerId: string): boolean {
  const room = rooms.get(roomCode)
  if (room && !room.players.includes(playerId)) {
    room.players.push(playerId)
    return true
  }
  return false
}

