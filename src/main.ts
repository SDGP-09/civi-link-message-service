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

  await app.listen(process.env.PORT ?? 3050);
  
 
  
    const port = process.env.PORT || '3050';

    const eurekaHost = process.env.EUREKA_HOST || 'civilink-eureka-server-api-service.development.svc.cluster.local';
    const eurekaPort = parseInt(process.env.EUREKA_PORT || '8761', 10);

    registerWithEureka(eurekaHost, eurekaPort, port);

}
bootstrap();
