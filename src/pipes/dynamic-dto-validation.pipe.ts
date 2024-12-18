import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";

@Injectable()
export class DynamicDtoValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    let dto: any;

    // Validate the DTO
    const object = plainToClass(dto, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      throw new BadRequestException("Validation failed");
    }

    return object;
  }
}
