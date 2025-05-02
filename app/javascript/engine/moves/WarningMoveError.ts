export default class WarningMoveError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "IllegalMoveError"
    Object.setPrototypeOf(this, WarningMoveError.prototype)
  }
}