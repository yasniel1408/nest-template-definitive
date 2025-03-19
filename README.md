# NestJS Template Definitivo

Este es un template robusto para aplicaciones NestJS que incluye configuraciones y módulos esenciales para construir aplicaciones escalables y resilientes.

## Características Principales

- **Circuit Breaker**: Implementación de patrón Circuit Breaker para manejar fallos en llamadas a servicios externos
- **Rate Limiting**: Control de tasa de solicitudes para proteger tus APIs
- **Cache**: Sistema de caché integrado para optimizar el rendimiento
- **Monitoreo de Salud**: Endpoints de health check para supervisión
- **Swagger**: Documentación de API automática
- **Logging**: Sistema de logging configurable

## Instalación

```bash
npm install
```

## Configuración

Copia el archivo `dev.env` a `.env` y ajusta las variables de entorno según tus necesidades:

```bash
cp dev.env .env
```

## Uso del Circuit Breaker

El Circuit Breaker protege tu aplicación contra fallos en cascada cuando los servicios externos fallan. Aquí un ejemplo de uso:

```typescript
@CircuitBreaker({
  failureThreshold: 5,      // Número de fallos antes de abrir el circuito
  resetTimeout: 60000,      // Tiempo en ms antes de intentar cerrar el circuito
  halfOpenTimeout: 30000    // Tiempo en ms en estado semi-abierto
})
@Get('/external-service')
async getExternalData() {
  // Tu lógica aquí
  return await this.externalService.getData();
}
```

### Opciones del Circuit Breaker

- `failureThreshold`: Número de fallos consecutivos antes de abrir el circuito
- `resetTimeout`: Tiempo en milisegundos antes de intentar cerrar un circuito abierto
- `halfOpenTimeout`: Tiempo en milisegundos que el circuito permanece en estado semi-abierto

## Pruebas de Rendimiento

El proyecto incluye pruebas de rendimiento usando k6:

```bash
k6 run k6/health.test.js
```

## Docker

Para ejecutar la aplicación en Docker:

```bash
docker-compose up -d
```

## Contribución

Si deseas contribuir al proyecto, por favor:

1. Haz fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.