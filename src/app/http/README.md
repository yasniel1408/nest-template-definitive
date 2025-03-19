# Módulo HTTP

## Propósito
Centralizar la configuración de cliente HTTP para llamadas a APIs externas.

## Configuración
```typescript
// app.module.ts
import { HttpModule } from './http/http.module';

@Module({
  imports: [HttpModule],
})
```

## Variables de Entorno
```bash
HTTP_TIMEOUT=5000 # Tiempo máximo en milisegundos
HTTP_MAX_REDIRECTS=3
```

## Uso en Servicios
```typescript
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ExternalApiService {
  constructor(private readonly http: HttpService) {}

  async fetchData() {
    const { data } = await this.http.get('https://api.externa.com/data').toPromise();
    return data;
  }
}
```