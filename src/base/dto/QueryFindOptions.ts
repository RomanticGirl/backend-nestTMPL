import {ApiPropertyOptional} from '@nestjs/swagger';

export class QueryFindOptions {
    @ApiPropertyOptional()
    page?: string | number;
    @ApiPropertyOptional()
    offset?: string | number;
    @ApiPropertyOptional()
    order?: string | number;
}