import { User } from "../contexts/AuthContext";

export class Player {
  _id: string = '';
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  birthday: Date = new Date();
  ready: boolean = false;

  constructor(
    _id: string = '',
    firstName: string = '',
    lastName: string = '',
    email: string = '',
    birthday: Date = new Date(),
    ready: boolean = false
  ) {
    this._id = _id
    this.firstName = firstName
    this.lastName = lastName
    this.email = email
    this.birthday = birthday
    this.ready = ready
  }

  static createFromUser(user: User): Player {
    return new Player(
      user._id,
      user.firstName,
      user.lastName,
      user.email,
      user.birthday,
      false
    )
  }
}

export class Room {
  owner: Player = new Player()
  maxPlayers: number = 0
  players: Player[] = []

  constructor(owner: Player = new Player(), maxPlayers: number = 0, players: Player[] = []) {
    this.owner = owner
    this.maxPlayers = maxPlayers
    this.players = players
  }
}

export function generateRoomCode(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

// Simulate a database of rooms
const rooms = new Map<string, Room>()

export function createRoom(roomCode: string, maxPlayers: number, player: Player): void {
  rooms.set(roomCode, new Room(player, maxPlayers, [player]))
  console.log(roomCode, rooms);
}

export function roomExists(roomCode: string): boolean {
  console.log(rooms, roomCode)
  if (!rooms.has(roomCode)) {
    return false;
  }

  const room = rooms.get(roomCode) || new Room();
  return room.maxPlayers > room.players.length;
}

export function joinRoom(roomCode: string, player: Player): boolean {
  const room = rooms.get(roomCode)
  if (room && !room.players.includes(player)) {
    room.players.push(player)
    return true
  }
  return false
}

export function getRoom(roomCode: string): Room|undefined {
  return rooms.get(roomCode);
}

