import { Module } from '@nestjs/common';
import { EventsController } from './controllers/events.controller';
import { EventsConsumerController } from './controllers/events-consumer.controller';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';

@Module({
  imports: [RabbitMQModule],
  controllers: [EventsController, EventsConsumerController],
  exports: [RabbitMQModule],
})
export class EventsModule {}
