import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RabbitMQService } from './rabbitmq.service';
import { getRabbitMQClientOptions } from './rabbitmq.config';
import { RMQ_SERVICE } from './constants';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: RMQ_SERVICE,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          return getRabbitMQClientOptions(configService);
        },
      },
    ]),
  ],
  providers: [RabbitMQService],
  exports: [RabbitMQService],
})
export class RabbitMQModule {}
