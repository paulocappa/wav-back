class FieldError {
  public readonly fieldWithError: string;

  public readonly message: string;

  public readonly statusCode: number;

  constructor(fieldWithError: string, message: string, statusCode = 400) {
    this.fieldWithError = fieldWithError;
    this.message = message;
    this.statusCode = statusCode;
  }
}

export default FieldError;
