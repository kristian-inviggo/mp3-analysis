import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

export function swaggerInitializer(app: INestApplication): OpenAPIObject {
  const config = new DocumentBuilder()
    .setTitle('NestJS Web API for MP3Analysis')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  return document;
}
