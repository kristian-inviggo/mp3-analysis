import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { instance, mock, when } from 'ts-mockito';
import { UploadsModule } from '../src/modules/uploads/uploads.module';
import { ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { SharedModule } from '../src/modules/shared/shared.module';
import { CacheService } from '../src/modules/shared/cache/cache.service';
import { HashFileService } from '../src/modules/uploads/services/hash-file/hash-file.service';
import { Mp3FrameCounterService } from '../src/modules/uploads/services/mp3-frame-counter/mp3-frame-counter.service';
import { FileHandlerService } from '../src/modules/uploads/services/file-handler/file-handler.service';
import { HealthModule } from '../src/modules/health/health.module';

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

  describe('GET /healt', () => {
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

    it('should return 400 BAD REQUEST for any other file types besides mp3', async () => {
      const fileNames: string[] = ['image.webp', 'cat.jpg', 'sample3.mp4'];

      for (const fileName of fileNames) {
        const response = await request(app.getHttpServer())
          .post('/file-upload')
          .attach('file', `./test/fixtures/${fileName}`);
        expect(response.statusCode).toBe(400);
      }
    });
  });
});
