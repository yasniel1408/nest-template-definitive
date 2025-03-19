# Circuit Breaker

Este módulo implementa el patrón Circuit Breaker para manejar fallos en llamadas a servicios externos de manera resiliente.

## Descripción

El Circuit Breaker actúa como un interruptor automático que protege tu aplicación contra fallos en cascada cuando los servicios externos fallan. Opera en tres estados:

- **Cerrado (Closed)**: Estado normal, las peticiones pasan normalmente
- **Abierto (Open)**: Estado de fallo, las peticiones son rechazadas inmediatamente
- **Semi-abierto (Half-Open)**: Estado de prueba, permite un número limitado de peticiones

## Uso

### Decorador

Puedes usar el decorador `@CircuitBreaker()` en tus controladores o servicios:

```typescript
@CircuitBreaker({
  failureThreshold: 5,      // Número de fallos antes de abrir el circuito
  resetTimeout: 60000,      // Tiempo en ms antes de intentar cerrar el circuito
  halfOpenTimeout: 30000    // Tiempo en ms en estado semi-abierto
})
@Get('/external-service')
async getExternalData() {
  return await this.externalService.getData();
}
```

### Opciones de Configuración

| Opción | Descripción | Valor por defecto |
|--------|-------------|-------------------||
| `failureThreshold` | Número de fallos consecutivos antes de abrir el circuito | 5 |
| `resetTimeout` | Tiempo en milisegundos antes de intentar cerrar un circuito abierto | 60000 |
| `halfOpenTimeout` | Tiempo en milisegundos que el circuito permanece en estado semi-abierto | 30000 |

### Diagrama de Estados

```
[Cerrado] ---(fallos > threshold)---> [Abierto]
   ^
   |                                     |
   |                                     |
   |                                     v
   +---(petición exitosa)---- [Semi-abierto]
```

## Ejemplos de Uso

### Ejemplo Básico

```typescript
@Controller('api')
export class ExternalServiceController {
  constructor(private readonly externalService: ExternalService) {}

  @CircuitBreaker()
  @Get('/data')
  async getData() {
    return await this.externalService.fetchData();
  }
}
```

### Ejemplo con Configuración Personalizada

```typescript
@CircuitBreaker({
  failureThreshold: 3,
  resetTimeout: 30000,
  halfOpenTimeout: 15000
})
@Get('/sensitive-endpoint')
async getSensitiveData() {
  return await this.externalService.getSensitiveData();
}
```

## Mejores Prácticas

1. Ajusta los timeouts según las características de tu servicio externo
2. Implementa fallbacks para manejar casos cuando el circuito está abierto
3. Monitorea el estado del circuit breaker para detectar problemas
4. Considera usar diferentes configuraciones para diferentes endpoints

## Integración con Módulos

El Circuit Breaker se integra perfectamente con otros módulos de la aplicación:

```typescript
@Module({
  imports: [
    CircuitBreakerModule.register({
      // Configuración global
      failureThreshold: 5,
      resetTimeout: 60000,
      halfOpenTimeout: 30000
    })
  ]
})
export class AppModule {}
```