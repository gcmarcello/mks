// uuid-validation.pipe.ts
import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { isUUID } from 'class-validator';

@Injectable()
export class UuidValidationPipe implements PipeTransform {
  transform(value: string) {
    if (!isUUID(value)) {
      throw new BadRequestException('Invalid UUID');
    }
    return value;
  }
}
