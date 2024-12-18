import { Catch, ExceptionFilter, ArgumentsHost } from "@nestjs/common";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const status = exception.status || 500;
    response.status(status).json({
      statusCode: status,
      message: exception.message || "Internal server error",
    });
  }
}
