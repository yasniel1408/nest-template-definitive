import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as compression from '@fastify/compress';
import helmet from 'helmet';

export const setupApp = (app) => {
  const packageJson = require(path.resolve('package.json'));
  process.env.API_VERSION = packageJson.version;
  process.env.API_NAME = packageJson.name;

  app.setGlobalPrefix('api');

  app.register(compression, { encodings: ['gzip', 'deflate'] });

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'img-src': ["'self'", 'data:', 'validator.swagger.io'],
          'script-src': ["'self'", "https: 'unsafe-inline'"],
        },
      },
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  const configService = app.get(ConfigService);
  app.enableCors({
    origin: configService.getOrThrow('CORS_ALLOWED_ORIGIN'),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
};
