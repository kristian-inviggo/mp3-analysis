import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

// This file can be replaced during build by using webpack plugin.
// `nest build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `webpack.config.js`.

export function swaggerInitializer(app: INestApplication): OpenAPIObject {
  const config = new DocumentBuilder()
    .setTitle('NestJS Web API for MP3Analysis')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  return document;
}
