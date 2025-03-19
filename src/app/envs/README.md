# Módulo de Configuración de Entornos

## Propósito
Centralizar la gestión de variables de entorno y configuraciones de la aplicación.

## Configuración
```typescript
// app.module.ts
import { ConfigModule } from './envs/config.module';

@Module({
  imports: [ConfigModule],
})
```

## Variables de Entorno
```bash
# Archivo .env
NODE_ENV=development
PORT=3000
```

## Uso en Servicios
```typescript
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private config: ConfigService) {}

  getPort() {
    return this.config.get<number>('PORT');
  }
}
```