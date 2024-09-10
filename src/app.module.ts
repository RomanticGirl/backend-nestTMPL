import {ClassSerializerInterceptor, Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ConfigModule} from '@nestjs/config';
import * as process from 'process';
import {APP_GUARD, APP_INTERCEPTOR, APP_PIPE} from '@nestjs/core';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ValidationPipe} from './pipe/validation.pipe';
import {ApiAuthGuard} from './guard/api-auth.guard';
import {BaseServiceCRUD} from './base/base.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['.env'],
        }),
        TypeOrmModule.forRootAsync({
            useFactory: () => ({
                type: 'postgres',
                host: process.env.PG_HOST,
                port: +process.env.PG_PORT,
                username: process.env.PG_USER,
                password: process.env.PG_PASSWORD,
                database: process.env.PG_DATABASE,
                entities: [],
            }),
        }),
    ],
    controllers: [AppController],
    providers: [
        AppService,
        BaseServiceCRUD,
        {
            provide: APP_GUARD,
            useClass: ApiAuthGuard,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: ClassSerializerInterceptor,
        },
        {
            provide: APP_PIPE,
            useClass: ValidationPipe,
        },
    ],
})
export class AppModule {
}
