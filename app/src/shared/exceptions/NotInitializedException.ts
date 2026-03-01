export class NotInitializedException extends Error {
  constructor(subject: string) {
    super(`${subject} is not initialized`);
  }
}
