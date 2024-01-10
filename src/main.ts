import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swaggerInitializer } from './swagger/swagger-initializer';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { abortOnError: true });
  app.setGlobalPrefix('api/v1');

  if (process.env.NODE_ENV !== 'production') {
    swaggerInitializer(app);
  }

  app.useLogger(app.get(Logger));
  await app.listen(3000);
}
bootstrap();
