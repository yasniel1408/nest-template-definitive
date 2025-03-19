import { NestMicroserviceOptions } from '@nestjs/common/interfaces/microservices/nest-microservice-options.interface';
import { AppModule } from './app/app.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

export const setupMicroservice = async () => {
  const micro1 = await NestFactory.createMicroservice<NestMicroserviceOptions>(
    AppModule,
    // {
    //   transport: Transport.RMQ,
    //   options: {
    //     urls: [
    //       'amqps://rorhsacz:riM7HCSK2vdvcINZ0b74zwy15dvCxcKH@jaragua.lmq.cloudamqp.com/rorhsacz',
    //     ],
    //     queue: 'products_queue',
    //     queueOptions: {
    //       durable: false,
    //     },
    //   },
    // },
  );

  const micro2 = await NestFactory.createMicroservice<NestMicroserviceOptions>(
    AppModule,
    {
      // transport: Transport.REDIS,
      // options: {
      // host: 'localhost',
      // port: 6379,
      // },
    },
  );

  // Config validation
  //   app.useGlobalPipes(
  //     new ValidationPipe({
  //       transform: true,
  //       whitelist: true,
  //       forbidNonWhitelisted: true,
  //     }),
  //   );
};
