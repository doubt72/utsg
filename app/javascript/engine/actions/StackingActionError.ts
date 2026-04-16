export default class StackingActionError extends Error {
  extra?: string;

  constructor(message: string, extra?: string) {
    super(message)
    this.name = "StackingActionError"
    this.extra = extra
    Object.setPrototypeOf(this, StackingActionError.prototype)
  }
}