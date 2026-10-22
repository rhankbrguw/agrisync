import { APP_STRINGS } from '../constants/strings';

type ErrorCode =
  | 'UNAUTHENTICATED'
  | 'UNAUTHORIZED'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'VALIDATION_ERROR'
  | 'INTERNAL_ERROR';

export class AppError extends Error {
  readonly code: ErrorCode;

  constructor(code: ErrorCode, message: string) {
    super(message);
    this.name = 'AppError';
    this.code = code;
  }
}

export function toAppError(error: unknown): AppError {
  if (error instanceof AppError) return error;
  const message = error instanceof Error ? error.message : APP_STRINGS.ERRORS.GENERIC;
  return new AppError('INTERNAL_ERROR', message);
}
