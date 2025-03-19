import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as compression from 'compression';
import helmet from 'helmet';

export const setupApp = (app: NestExpressApplication) => {
  const packageJson = require(path.resolve('package.json'));
  process.env.API_VERSION = packageJson.version;
  process.env.API_NAME = packageJson.name;

  app.setGlobalPrefix('api');

  app.use(
    compression({
      threshold: 0, // compress all responses
      level: 6, // compression level (0-9)
      filter: (req, res) => {
        if (req.headers['x-no-compression']) {
          // don't compress responses with this request header
          return false;
        }
        // fallback to standard filter function
        return compression.filter(req, res);
      },
    }),
  );

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
