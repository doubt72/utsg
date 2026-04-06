export default class WarningActionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "WarningActionError"
    Object.setPrototypeOf(this, WarningActionError.prototype)
  }
}