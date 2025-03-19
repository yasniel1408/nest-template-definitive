import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app/app.module';
import { setupApp } from './setup-app';

async function bootstrap() {
  // Config App
  const app: NestExpressApplication =
    await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  setupApp(app);

  // Config Microservices

  // Run Microservices and Apps
  await app.listen(configService.getOrThrow<number>('PORT'));
  await app.startAllMicroservices();
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap().then((r) => {
  console.log(`Application is running, check routes at: /api/health`);
});
