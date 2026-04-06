export default class StackingActionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "StackingActionError"
    Object.setPrototypeOf(this, StackingActionError.prototype)
  }
}