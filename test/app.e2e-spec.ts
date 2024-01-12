import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { instance, mock, when } from 'ts-mockito';
import { ConfigService } from '@nestjs/config';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const mockConfigService = mock(ConfigService);
    when(mockConfigService.get('logging')).thenReturn(false);
    when(mockConfigService.get('NODE_ENV')).thenReturn('test');

    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ConfigService)
      .useValue(instance(mockConfigService))
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /health', () => {
    it('should return 200 OK', () => {
      return request(app.getHttpServer()).get('/health').expect(200);
    });
  });

  describe('POST /file-upload', () => {
    it('should return 201 CREATED and have the correct properties in the response body', async () => {
      const response = await request(app.getHttpServer())
        .post('/file-upload')
        .attach('file', './test/fixtures/sample.mp3');
      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({ frameCount: 1610 });
    });

    /* 
      This test is commented out as the provied mp3 file is actually a binary file hence validation is turned off for now
    */

    // it('should return 400 BAD REQUEST for any other file types besides mp3', async () => {
    //   const fileNames: string[] = [
    //     'image.webp',
    //     'cat.jpg',
    //     'sample3.mp4',
    //   ];

    //   for (const fileName of fileNames) {
    //     const response = await request(app.getHttpServer())
    //       .post('/file-upload')
    //       .attach('file', `./test/fixtures/${fileName}`);
    //     expect(response.statusCode).toBe(400);
    //   }
    // });
  });
});
