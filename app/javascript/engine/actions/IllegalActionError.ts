export default class IllegalActionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "IllegalActionError"
    Object.setPrototypeOf(this, IllegalActionError.prototype)
  }
}