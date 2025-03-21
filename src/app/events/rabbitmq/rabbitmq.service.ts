import { Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { EventPayload, EventAck } from '../types/event.types';
import { v4 as uuidv4 } from 'uuid';
import { lastValueFrom } from 'rxjs';
import { RMQ_SERVICE } from './constants';

@Injectable()
export class RabbitMQService {
  constructor(@Inject(RMQ_SERVICE) private client: ClientProxy) {}

  async onModuleInit() {
    await this.client.connect();
  }

  async publishEvent<T>(pattern: string, data: T): Promise<EventAck> {
    const eventPayload: EventPayload = {
      id: uuidv4(),
      data,
      timestamp: Date.now(),
    };

    try {
      const result = await lastValueFrom(
        this.client.send<EventAck>(pattern, eventPayload),
      );
      return result;
    } catch (error: unknown) {
      return {
        id: eventPayload.id,
        success: false,
        error: (error as Error).message,
        timestamp: Date.now(),
      };
    }
  }

  async emitEvent<T>(pattern: string, data: T): Promise<void> {
    const eventPayload: EventPayload = {
      id: uuidv4(),
      data,
      timestamp: Date.now(),
    };

    try {
      await new Promise<void>(resolve => {
        this.client.emit(pattern, eventPayload);
        resolve();
      });
    } catch (error) {
      console.error(`Error emitting event ${pattern}:`, error);
      throw error;
    }
  }
}
