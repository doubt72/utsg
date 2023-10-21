const GameMove = class {
  constructor(data) {
    this.id = data.id
    this.user = data.user
    this.player = data.player
    this.created_at = data.created_at

    this.action = data.data.action
  }

  get formattedDate() {
    const date = new Date(this.created_at)
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

export { GameMove }
