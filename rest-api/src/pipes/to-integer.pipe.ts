import {ArgumentMetadata, BadRequestException, PipeTransform} from '@nestjs/common';

export class ToIntegerPipe implements PipeTransform<string> {
    transform(value: string, metadata: ArgumentMetadata): number {
        // tslint:disable-next-line:radix
        const val = parseInt(value);
        if (isNaN(val)) {
            throw  new BadRequestException('conversation to number failed' + value);
        }

        return val;
    }
}
