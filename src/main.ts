import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import {registerWithEureka} from "./eureka.registration";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      })
  );

  const port = parseInt(process.env.PORT || '3000', 10);
  await app.listen(port);


    const eurekaHost = process.env.EUREKA_HOST || 'localhost';
    const eurekaPort = parseInt(process.env.EUREKA_PORT || '8761', 10);

    registerWithEureka(eurekaHost, eurekaPort, port);
}
bootstrap();
