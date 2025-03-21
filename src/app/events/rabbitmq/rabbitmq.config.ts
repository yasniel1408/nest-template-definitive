import { ConfigService } from '@nestjs/config';
import {
  ClientProviderOptions,
  RmqOptions,
  Transport,
} from '@nestjs/microservices';

export const getRabbitMQConfig = (configService: ConfigService): RmqOptions => {
  return {
    transport: Transport.RMQ,
    options: {
      urls: [
        configService.get<string>('RABBITMQ_URL') || 'amqp://localhost:5672',
      ],
      queue: configService.get<string>('RABBITMQ_QUEUE') || 'events_queue',
      queueOptions: {
        durable: true,
      },
      prefetchCount: 1,
    },
  };
};

export const getRabbitMQClientOptions = (
  configService: ConfigService,
): ClientProviderOptions => {
  return {
    name: 'EVENTS_SERVICE',
    transport: Transport.RMQ,
    options: {
      urls: [
        configService.get<string>('RABBITMQ_URL') || 'amqp://localhost:5672',
      ],
      queue: configService.get<string>('RABBITMQ_QUEUE') || 'events_queue',
      queueOptions: {
        durable: true,
      },
    },
  };
};
