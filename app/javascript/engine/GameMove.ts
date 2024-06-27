export type GameMoveData = {
  id: number; // TODO: not sure this is a number?
  user: number;
  player: number;
  created_at: string;
  data: {
    action: string;
  };
}

export default class GameMove {
  id: number;
  user: number;
  player: number;
  createdAt: string;
  action: string;

  constructor(data: GameMoveData) {
    this.id = data.id
    this.user = data.user
    this.player = data.player
    this.createdAt = data.created_at

    this.action = data.data.action
  }

  get formattedDate() {
    const date = new Date(this.createdAt)
    return `${("0" + (date.getMonth() + 1)).slice (-2)}/` +
           `${("0" + date.getDate()).slice (-2)} ` +
           `${("0" + date.getHours()).slice (-2)}:` +
           `${("0" + date.getMinutes()).slice (-2)}`
  }

  get description() {
    switch(this.action) {
      case "create":
        return "game created"
      case "start":
        return "game started"
      case "join":
        return `joined as player ${this.player}`
      case "leave":
        return `left game`
      default:
        return "i don't even know"
    }
  }
}

