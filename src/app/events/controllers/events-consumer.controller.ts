import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { EventPayload, EventAck } from '../types/event.types';

@Controller()
export class EventsConsumerController {
  @MessagePattern('test.event')
  handleTestEvent(@Payload() data: EventPayload): EventAck {
    console.log('Received test event:', data);
    // Process the event here

    return {
      id: data.id,
      success: true,
      timestamp: Date.now(),
    };
  }

  @EventPattern('notification.event')
  handleNotificationEvent(@Payload() data: EventPayload) {
    console.log('Received notification event:', data);
    // Process the notification event here
  }
}
