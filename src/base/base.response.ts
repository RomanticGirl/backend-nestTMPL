import {ApiProperty} from '@nestjs/swagger';

export class BaseResponseLoad<TEntity> {
    @ApiProperty()
    offset: number;

    @ApiProperty()
    count: number;

    @ApiProperty()
    items: TEntity[];
}