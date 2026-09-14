export interface ApiResponse<T> {
  success: boolean;
  code: string;
  message: string;
  data: T;
  meta: {
    timestamp: string;
    request_id?: string;
  };
}

export function createSuccessResponse<T>(data: T, message = 'Success', code = 'OK'): ApiResponse<T> {
  return {
    success: true,
    code,
    message,
    data,
    meta: {
      timestamp: new Date().toISOString(),
    },
  };
}
