import { setupApp } from './setup-app';
import { Logger } from '@nestjs/common';
import { App } from './app';
import { swaggerConfig } from './app/swagger/swagger.config';
import { getRabbitMQConfig } from './app/events/rabbitmq/rabbitmq.config';

async function bootstrap() {
  // Config App
  const { app, configService } = await App();
  setupApp(app);

  // Config Microservices
  getRabbitMQConfig(configService);

  // Config Swagger
  swaggerConfig(app);

  // Run Microservices and Apps
  await app.listen(configService.getOrThrow<number>('PORT'));
  await app.startAllMicroservices();
  return app;
}
bootstrap().then(async app => {
  const logger = app.get(Logger);
  logger.log(`Application is running on: ${await app.getUrl()}`);
  logger.log(`Check health route at: ${await app.getUrl()}/api/health`);
  logger.log(`Check api documentation at: ${await app.getUrl()}/docs`);
});
