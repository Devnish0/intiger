class ApiResponse {
  statusCode: number;
  success: boolean;
  data: unknown;
  message: string;

  constructor(statusCode: number, data: unknown = null, message: string = "Success") {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.data = data;
    this.message = message;
  }
}

export { ApiResponse };
