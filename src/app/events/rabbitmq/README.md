# RabbitMQ Integration

Este módulo proporciona integración con RabbitMQ para el sistema de eventos de la aplicación.

## Configuración

La configuración de RabbitMQ se realiza a través de variables de entorno:

- `RABBITMQ_URL`: URL de conexión a RabbitMQ (por defecto: `amqp://localhost:5672`)
- `RABBITMQ_QUEUE`: Nombre de la cola de eventos (por defecto: `events_queue`)

## Uso

### Publicar eventos

Para publicar eventos que requieren una respuesta (patrón request-response):

```typescript
// Inyectar el servicio
constructor(private readonly rabbitMQService: RabbitMQService) {}

// Publicar un evento y esperar respuesta
const response = await this.rabbitMQService.publishEvent('event.name', { key: 'value' });
```

Para emitir eventos sin esperar respuesta (patrón pub-sub):

```typescript
// Emitir un evento sin esperar respuesta
await this.rabbitMQService.emitEvent('notification.event', { message: 'Hello' });
```

### Consumir eventos

Para consumir eventos, se utilizan los decoradores `@MessagePattern` y `@EventPattern` en los controladores:

```typescript
// Para eventos que requieren respuesta (request-response)
@MessagePattern('event.name')
handleEvent(@Payload() data: EventPayload): EventAck {
  // Procesar el evento
  return {
    id: data.id,
    success: true,
    timestamp: Date.now(),
  };
}

// Para eventos sin respuesta (pub-sub)
@EventPattern('notification.event')
handleNotification(@Payload() data: EventPayload) {
  // Procesar la notificación
}
```