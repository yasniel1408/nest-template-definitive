# Módulo de Logging

## Propósito
Centralizar la configuración de logging con soporte para múltiples transportes y formatos.

## Configuración
```typescript
// app.module.ts
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [LoggerModule],
})
```

## Variables de Entorno
```bash
LOG_LEVEL=info # error, warn, info, debug
LOG_FORMAT=json # text, json
```

## Uso en Servicios
```typescript
import { Logger } from '@nestjs/common';

@Injectable()
export class MyService {
  private readonly logger = new Logger(MyService.name);

  processData() {
    this.logger.log('Procesando datos');
    this.logger.debug('Detalles de depuración');
  }
}
```