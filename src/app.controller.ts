import { Body, Controller, Get, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { BaseServiceCRUD } from './base/base.service';
import { ApiResponse } from '@nestjs/swagger';
import { SafeHttp } from './decorators';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { BaseResponseLoad } from './base/base.response';
import { QueryFindOptions } from './base/dto/QueryFindOptions';
import { Repository } from 'typeorm';

@Controller()
export class AppController {

    constructor(
        protected readonly service: BaseServiceCRUD,
    ) {
    }

    @ApiResponse({ status: HttpStatus.CREATED, type: Number })
    @Post(':schema/:table/create')
    @SafeHttp()
    async create(
        @Param('table') table: string,
        @Param('schema') schema: string,
        @Body() dto: QueryDeepPartialEntity<any>,
    ) {
        return this.service.createItem(schema, table, dto);
    }

    @ApiResponse({ status: HttpStatus.OK, type: BaseResponseLoad<any> })
    @Get(':schema/:table/load')
    @SafeHttp()
    async loadList(
        @Param('table') table: string,
        @Param('schema') schema: string,
        @Query() query: QueryFindOptions,
    ) {
        return this.service.findList(schema, table, query);
    }

    @ApiResponse({ status: HttpStatus.OK, type: Repository<any> })
    @Get(':schema/:table/view/:id')
    @SafeHttp()
    async view(
        @Param('table') table: string,
        @Param('schema') schema: string,
        @Param('id') id: number,
    ) {
        return this.service.getById(schema, table, id);
    }

    @ApiResponse({ status: HttpStatus.CREATED, type: undefined })
    @Post(':schema/:table/update/:id')
    @SafeHttp()
    async update(
        @Param('table') table: string,
        @Param('schema') schema: string,
        @Param('id') id: number,
        @Body() dto: QueryDeepPartialEntity<any>,
    ) {
        return await this.service.updateItem(schema, table, id, dto);
    }

    @ApiResponse({ status: HttpStatus.CREATED })
    @Post(':schema/:table/remove/:id')
    @SafeHttp()
    async removeItem(
        @Param('table') table: string,
        @Param('schema') schema: string,
        @Param('id') id: number,
    ) {
        // return await this.service.remove(id);
    }

    @ApiResponse({ status: HttpStatus.OK, type: Repository<any> })
    @Get('schemaList')
    @SafeHttp()
    async schemaList(
    ) {
        return this.service.getSchemas();
    }

    @ApiResponse({ status: HttpStatus.OK, type: Repository<any> })
    @Get('schemaList/:schema')
    @SafeHttp()
    async schemaFilesType(
        @Param('schema') schema: string,
        // @Query('type') type: string
    ) {
        return this.service.getSchemaFilesType(schema);
    }

    @ApiResponse({ status: HttpStatus.OK, type: Repository<any> })
    @Get('fileByType/:schema')
    @SafeHttp()
    async filesByType(
        @Param('schema') schema: string,
        @Query('type') type: string
    ) {
        return this.service.getFilesByType(schema, type);
    }

    @ApiResponse({ status: HttpStatus.OK, type: Repository<any> })
    @Get('tablesByType/:schema')
    @SafeHttp()
    async tablesByType(
        @Param('schema') schema: string,
        @Query('file') file: string
    ) {
        return this.service.getTablesByType(schema, file);
    }
}
