# Módulo de Health Check

## Propósito
Proveer endpoints de salud para monitorear el estado de la aplicación.

## Configuración
```typescript
// app.module.ts
import { HealthModule } from './health/health.module';

@Module({
  imports: [HealthModule],
})
```

## Uso
```typescript
// app.controller.ts
@Controller()
export class AppController {
  @Get('/health')
  getHealth() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}

// app.service.ts
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
```