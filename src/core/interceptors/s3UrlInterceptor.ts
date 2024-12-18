import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ConfigService } from "@nestjs/config"; // Import ConfigService

@Injectable()
export class AppendS3UrlsInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {} // Inject ConfigService

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => this.appendS3Urls(data)));
  }

  private appendS3Urls(data: any): any {
    if (Array.isArray(data)) {
      return data.map((item) => this.appendS3Urls(item));
    } else if (typeof data === "object" && data !== null) {
      const newData: any = {};
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          if (["imageUrl", "image", "avatar"].includes(key)) {
            newData[key] = this.constructS3Url(data[key]);
          } else {
            newData[key] = this.appendS3Urls(data[key]);
          }
        }
      }
      return newData;
    }
    return data;
  }

  private constructS3Url(imageId: string): string {
    const baseUrl = this.configService.get<string>("S3_BASE_URL");
    return `${baseUrl}${imageId}`;
  }
}
