import { User } from "../contexts/AuthContext";
import { io } from 'socket.io-client';

const WS_URL = import.meta.env.VITE_API_URL;
export const socket = io(WS_URL);

socket.on('connect', function () {
  console.log('Connected');

  socket.emit('events', { test: 'test' });
  socket.emit('identity', 0, (response: any) =>
    console.log('Identity:', response),
  );
});
socket.on('createRoom', function (data) {
  console.log('createRoom', data);
});
socket.on('joinRoom', function (data) {
  console.log('joinRoom', data);
});
socket.on('leaveRoom', function (data) {
  console.log('leaveRoom', data);
});
socket.on('events', function (data) {
  console.log('event', data);
});
socket.on('exception', function (data) {
  console.log('event', data);
});
socket.on('disconnect', function() {
  console.log('Disconnected');
  socket.off('createRoom');
  socket.off('joinRoom');
  socket.off('toggleReady');
  socket.off('updateRoom');
  socket.off('updateRoomCanvas');
  socket.off('updateChatHistory');
});

export enum Stage {
  Draw = 'draw',
  Guess = 'guess',
}

export class Game {
  stages: Map<string, GameStage>;
  activeStage: string;

  constructor(
    stages: Map<string, GameStage> = new Map(),
    activeStage: string = '',
  ) {
    this.stages = stages;
    this.activeStage = activeStage;
  }

  static fromObject(gameObj: any): Game {
    const game = new Game();
    for (const stageId in gameObj.stages) {
      game.stages.set(stageId, GameStage.fromObject(gameObj.stages[stageId]));
    }
    game.activeStage = game.activeStage;

    return game;
  }

  toPlain() {
    return {
      activeStage: this.activeStage,
      stages: Object.fromEntries(this.stages.entries()),
    }
  }
}

export class GameStage {
  stage: Stage;
  player: Player;
  word: string;
  canvas: string;
  nextStage?: string;

  constructor(
    stage: Stage,
    player: Player,
    word: string = '',
    canvas: string = '',
    nextStage: string|undefined = undefined,
  ) {
    this.stage = stage;
    this.player = player;
    this.word = word;
    this.canvas = canvas;
    this.nextStage = nextStage;
  }

  static fromObject(gameStage: any): GameStage {
    return new GameStage(
      gameStage.stage,
      gameStage.player instanceof Player ? gameStage.player : Player.fromObject(gameStage.player),
      gameStage.word,
      gameStage.canvas,
      gameStage.nextStage,
    );
  }
}

export class ChatEntry {
  playerId: string = '';
  message: string = '';
  date: Date = new Date();
  delivered: boolean = false;
  buzz: boolean = false;
}

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

  static fromObject(player: any): Player {
    return new Player(
      player._id,
      player.firstName,
      player.lastName,
      player.email,
      player.birthday,
      player.ready,
    )
  }
}

export class Room {
  code: string = ''
  name: string = ''
  isPrivate: boolean = false
  hasStarted: boolean = false
  owner: Player = new Player()
  maxPlayers: number = 0
  canvas: string = ''
  players: Map<string, Player> = new Map()
  chatHistory: ChatEntry[] = []
  game: Game = new Game()

  constructor(
    code: string = '',
    name: string = '',
    isPrivate: boolean = false,
    hasStarted: boolean = false,
    owner: Player = new Player(),
    maxPlayers: number = 0,
    canvas: string = '',
    players: Map<string, Player> = new Map(),
    chatHistory: ChatEntry[] = [],
    game: Game = new Game(),
  ) {
    this.code = code
    this.name = name
    this.isPrivate = isPrivate
    this.hasStarted = hasStarted
    this.owner = owner
    this.maxPlayers = maxPlayers
    this.canvas = canvas
    this.players = players
    this.chatHistory = chatHistory
    this.game = game
  }

  static fromObject(room: any): Room {
    const players = new Map();
    for (let playerId in room.players) {
      players.set(playerId, room.players[playerId]);
    }

    return new Room(
      room.code,
      room.name,
      room.isPrivate,
      room.hasStarted,
      room.owner,
      room.maxPlayers,
      room.canvas,
      players,
      room.chatHistory,
      Game.fromObject(room.game)
    );
  }

  currentStage(): GameStage|undefined {
    return this.game.stages.get(this.game.activeStage);
  }

  nextStage(): GameStage|undefined {
    if (!this.currentStage()?.nextStage) {
      return;
    }
    return this.game.stages.get(this.currentStage()?.nextStage!);
  }

  toPlain(): object {
    return {
      ...this,
      players: Object.fromEntries(this.players.entries()),
      game: this.game.toPlain(),
    }
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

export function createRoom(
  roomCode: string,
  roomName: string,
  isPrivate: boolean,
  maxPlayers: number,
  player: Player
): void {
  const room = new Room(
    roomCode,
    roomName,
    isPrivate,
    false,
    player,
    maxPlayers,
    '',
    new Map<string, Player>().set(player._id, player),
  );
  socket.emit('createRoom', { code: roomCode, room: room.toPlain() })
}
