import type { ArgumentsHost, ExceptionFilter } from "@nestjs/common";
import { Catch, HttpException } from "@nestjs/common";
import type { Response } from "express";
import { ValidationError } from "class-validator";

@Catch(HttpException)
export class HttpErrorFilter implements ExceptionFilter {
  async catch(exception: Error, host: ArgumentsHost): Promise<void> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    try {
      if (exception instanceof HttpException) {
        const { statusCode, message } = this.extractErrorDetails(exception);
        response.status(statusCode).json({ statusCode, message });
      } else {
        response
          .status(500)
          .json({ statusCode: 500, message: "Internal server error" });
      }
    } catch (error) {
      response
        .status(500)
        .json({ statusCode: 500, message: "Error while processing exception" });
    }
  }

  private extractErrorDetails(exception: HttpException): {
    statusCode: number;
    message: string;
  } {
    const httpResponse = exception.getResponse();
    const statusCode =
      typeof httpResponse === "object" ? httpResponse["statusCode"] : 500;

    const message =
      Array.isArray(httpResponse["message"]) &&
      httpResponse["message"][0] instanceof ValidationError
        ? Object.values(httpResponse["message"][0].constraints)[0]
        : httpResponse["message"];

    return { statusCode, message: message || "An unexpected error occurred" };
  }
}
