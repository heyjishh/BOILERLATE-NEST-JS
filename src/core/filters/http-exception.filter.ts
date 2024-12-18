import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
  HttpStatus,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const { method, url } = request;

    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse: any = exception.getResponse();

    let message = exception.message;
    let error = exception.name;

    // Handle DTO validation errors (BadRequestException)
    if (
      exception instanceof BadRequestException &&
      exceptionResponse.message instanceof Array
    ) {
      // If it's a validation error, extract the message array from the response
      message = exceptionResponse.message;
      error = exceptionResponse.error || "Bad Request";
    }

    const errorResponse = {
      code: status,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: url,
      method,
    };

    return response.status(status).json(errorResponse);
  }
}
