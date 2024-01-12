import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swaggerInitializer } from './swagger/swagger-initializer';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { abortOnError: false });

  swaggerInitializer(app); // generally this should not be here on production

  app.useLogger(app.get(Logger));
  await app.listen(3000);
}
bootstrap();
