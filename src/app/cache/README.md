# Módulo de Caching

## Propósito
Proveer un sistema de caching con Redis como almacenamiento principal y memoria como fallback.

## Configuración
```typescript
// app.module.ts
import { CacheModule } from './cache/cache.module';

@Module({
  imports: [CacheModule],
})
```

## Variables de Entorno
```bash
REDIS_HOST=localhost
REDIS_PORT=6379
CACHE_TTL=60 # Segundos
CACHE_MAX_ITEMS=1000
```

## Uso en Servicios
```typescript
import { CacheService } from './cache.service';

@Injectable()
export class MyService {
  constructor(private readonly cache: CacheService) {}

  async getData(key: string) {
    const cached = await this.cache.get(key);
    if (!cached) {
      const data = await fetchNewData();
      await this.cache.set(key, data);
      return data;
    }
    return cached;
  }
}
```