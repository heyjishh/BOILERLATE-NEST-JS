import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class HttpResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest();
        const response = httpContext.getResponse();
        const { method, url } = request;
        const statusCode = response.statusCode || 200;
        // Customize message based on the method or route
        let message = data?.message ? data.message : "Operation successful";
        if (!data?.message) {
          if (method === "POST") {
            message = "Resource created successfully";
          } else if (method === "PUT" || method === "PATCH") {
            message = "Resource updated successfully";
          } else if (method === "DELETE") {
            message = "Resource deleted successfully";
          }
        }
        // You can manipulate the response data here before sending it
        return {
          statusCode,
          timestamp: new Date().toISOString(),
          path: url,
          method,
          message,
          data,
        };
      }),
    );
  }
}
