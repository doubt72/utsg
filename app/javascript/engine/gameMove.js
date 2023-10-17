const GameMove = class {
  constructor(data) {
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
        return "Game created"
      case "join":
        return `${this.user} joined as player ${this.player}`
      default:
        return "I don't even know"
    }
  }
}

export { GameMove }
