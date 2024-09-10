import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import * as process from 'process';
import {FastifyAdapter} from '@nestjs/platform-fastify';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, new FastifyAdapter({logger: process.env.IS_LOGGER === 'true'}));
    const config = new DocumentBuilder()
        .setTitle('base backend example')
        .setDescription('The base backend API description')
        .setVersion('1.0')
        .addTag('api')
        .addTag('default')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);

    await app.listen(process.env.PORT || '3005', process.env.HOST || '0.0.0.0', () => {
        console.log(`Server listen ${process.env.PORT || '3005'}`);
    });
}

bootstrap();
