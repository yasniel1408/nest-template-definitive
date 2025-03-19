# Módulo Rate Limiting

## Propósito
Controlar la frecuencia de peticiones para prevenir abusos y sobrecargas.

## Configuración
```typescript
// app.module.ts
import { RateLimitingModule } from './rate-limiting/rate-limiting.module';

@Module({
  imports: [RateLimitingModule.register({
    windowMs: 60000,
    max: 100
  })],
})
```

## Variables de Entorno
```bash
RATE_LIMIT_WINDOW=60000 # Milisegundos
RATE_LIMIT_MAX=100
```

## Uso en Controladores
```typescript
@Controller()
@UseGuards(RateLimiterGuard)
export class AuthController {
  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async login() {
    // Lógica de autenticación
  }
}
```