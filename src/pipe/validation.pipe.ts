import {ArgumentMetadata, Injectable, PipeTransform} from '@nestjs/common';
import {plainToClass} from 'class-transformer';
import {validate} from 'class-validator';
import {ValidationException} from '../exception/validation.exception';

@Injectable()
export class ValidationPipe implements PipeTransform {
    async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
        const obj = plainToClass(metadata.metatype, value);
        if (typeof obj === 'string') {
            return value;
        }
        const errors = await validate(obj);

        if (errors.length) {
            let messages = errors.reduce((acc, err) => {
                acc[err.property] = Object.values(err.constraints)[0];
                return acc;
            }, {});
            throw new ValidationException(messages);
        }
        return value;
    }
}
