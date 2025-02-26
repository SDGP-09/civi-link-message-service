import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { registerWithEureka } from './eureka.registration';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
        })
    );

    // Ensure PORT is always a number
    const port = Number(process.env.PORT) || 3050;
    await app.listen(port);

    // Ensure Eureka config values are correctly parsed
    const eurekaHost = process.env.EUREKA_HOST || 'civilink-eureka-server-api-service.development.svc.cluster.local';
    const eurekaPort = process.env.EUREKA_PORT ? parseInt(process.env.EUREKA_PORT, 10) : 8761;

    registerWithEureka(eurekaHost, eurekaPort, port);
}

bootstrap();
