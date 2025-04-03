export class UserConflictError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "UserConflictError";
    this.statusCode = 409;
  }
}
