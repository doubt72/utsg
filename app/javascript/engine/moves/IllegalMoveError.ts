export default class IllegalMoveError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "IllegalMoveError"
    Object.setPrototypeOf(this, IllegalMoveError.prototype)
  }
}