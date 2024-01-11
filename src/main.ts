import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { swaggerInitializer } from './swagger/swagger-initializer';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { abortOnError: false });

  if (process.env.NODE_ENV !== 'production') {
    swaggerInitializer(app);
  }

  app.useLogger(app.get(Logger));
  await app.listen(3000);
}
bootstrap();
