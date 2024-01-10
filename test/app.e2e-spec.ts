import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('FileUploadController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /file-upload', () => {
    it('should return 201 CREATED and have the correct properties in the response body', async () => {
      const response = await request(app.getHttpServer())
        .post('/file-upload')
        .attach('file', './test/fixtures/sample.mp3');
      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({ frameCount: 1792 });
    });

    it('should return 400 BAD REQUEST for any other file types besides mp3', async () => {
      const fileNames: string[] = ['image.webp', 'cat.jpg'];

      for (const fileName of fileNames) {
        const response = await request(app.getHttpServer())
          .post('/file-upload')
          .attach('file', `./test/fixtures/${fileName}`);
        expect(response.statusCode).toBe(400);
      }
    });
  });
});
