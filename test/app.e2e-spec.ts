import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UploadsModule } from '../src/uploads/uploads.module';

describe('FileUploadController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UploadsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /file-upload', () => {
    it('should return 201 CREATED and have the correct properties in the response body', () => {
      request(app.getHttpServer())
        .post('/file-upload')
        .attach('file', './test/fixtures/sample.mp3')
        .expect(201)
        .expect({ frameCount: 1792 });
    });

    it('should return 400 BAD REQUEST for any other file types besides mp3', () => {
      const fileNames: string[] = ['image.webp', 'cat.jpg'];

      for (const fileName of fileNames) {
        request(app.getHttpServer())
          .post('/file-upload')
          .attach('file', `./test/fixtures/${fileName}`)
          .expect(400);
      }
    });
  });
});
