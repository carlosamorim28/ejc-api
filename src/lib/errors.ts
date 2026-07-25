export type ErrorDetail = {
  path: string;
  message: string;
};

export class AppError extends Error {
  readonly statusCode: number;
  readonly details?: ErrorDetail[];

  constructor(statusCode: number, message: string, details?: ErrorDetail[]) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.details = details;
  }
}
