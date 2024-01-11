import { TestApplicationStarter } from './helpers/test-application-starter';

describe('FileUploadController (e2e)', () => {
  const app = new TestApplicationStarter();

  beforeAll(async () => {
    await app.init();
  });

  afterAll(async () => {
    await app.stop();
  });

  describe('POST /file-upload', () => {
    it('should return 201 CREATED and have the correct properties in the response body', async () => {
      const response = await app.request
        .post('/file-upload')
        .attach('file', './test/fixtures/sample.mp3');
      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({ frameCount: 1610 });
    });

    it('should return 400 BAD REQUEST for any other file types besides mp3', async () => {
      const fileNames: string[] = ['image.webp', 'cat.jpg'];

      for (const fileName of fileNames) {
        const response = await app.request
          .post('/file-upload')
          .attach('file', `./test/fixtures/${fileName}`);
        expect(response.statusCode).toBe(400);
      }
    });
  });
});
