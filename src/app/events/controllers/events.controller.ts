import { Body, Controller, Post } from '@nestjs/common';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

class EventDto {
  eventName: string;
  data: any;
}

@Controller('events')
export class EventsController {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  @Post('publish')
  async publishEvent(@Body() eventDto: EventDto) {
    return this.rabbitMQService.publishEvent(eventDto.eventName, eventDto.data);
  }

  @Post('emit')
  async emitEvent(@Body() eventDto: EventDto) {
    await this.rabbitMQService.emitEvent(eventDto.eventName, eventDto.data);
    return { success: true };
  }
}
