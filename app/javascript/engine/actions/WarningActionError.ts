export default class WarningActionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "IllegalActionError"
    Object.setPrototypeOf(this, WarningActionError.prototype)
  }
}