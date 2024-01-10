import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swaggerInitializer } from './swagger/swagger-initializer';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { abortOnError: true });
  app.setGlobalPrefix('api/v1');
  if (process.env.NODE_ENV !== 'production') {
    swaggerInitializer(app);
  }
  await app.listen(3000);
}
bootstrap();
