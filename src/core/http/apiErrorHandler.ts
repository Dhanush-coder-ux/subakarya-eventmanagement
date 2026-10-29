export interface ApiError {
  message: string;
  statusCode?: number;
  code?: string;
  details?: Record<string, unknown>;
}

export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'CLIENT_ERROR',
    };
  }
  if (typeof error === 'string') {
    return {
      message: error,
      code: 'UNKNOWN_STRING_ERROR',
    };
  }
  return {
    message: 'An unexpected network error occurred. Please try again.',
    code: 'UNKNOWN_ERROR',
  };
};
