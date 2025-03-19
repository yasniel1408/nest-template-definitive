# Módulo Swagger

## Propósito
Configurar documentación API automática usando OpenAPI Specification.

## Configuración
```typescript
// main.ts
const config = new DocumentBuilder()
  .setTitle('API Documentation')
  .setDescription('Descripción de la API')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);
```

## Uso en Controladores
```typescript
@ApiTags('Users')
@Controller('users')
export class UsersController {
  @Get()
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de usuarios',
    type: [UserDto]
  })
  getUsers() {
    // Lógica del endpoint
  }
}
```

## Decoradores Comunes
```typescript
@ApiProperty({ description: 'Nombre del usuario' })
name: string;

@ApiQuery({ name: 'page', required: false })
@ApiHeader({ name: 'X-Custom-Header' })
```