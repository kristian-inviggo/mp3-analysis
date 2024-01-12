## Description

You can check out the assignment details in `docs/Techical Task.pdf`
I have used [Nest](https://github.com/nestjs/nest) framework TypeScript application for mp3 frame counting.

The API exposes one endpoint `file-uploads` to return the number of frames in an mp3 file. (We only support version 1 layer 3 as stated in the assignment)

- [Installation](#installation)
- [Running the app](#running-the-app)
  - [Development](#development)
  - [Production](#production)
- [Tests](#tests)
  - [Unit](#unit)
- [Swagger](#swagger)
- [Optimization](#optimization)
- [Deployed app](#deployed-app)

## Installation

```bash
$ npm install
```

## Running the app

### Developmment

You can start the app in development with either of the commands below

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

### Production

For production please create `src/config/env/production.env` based on the .env's for the rest of the environments
You can start the application in production mode with

```bash
$ npm run start:prod
```

You need to make sure that the migrations for the databse have been executed before this. This should be handled with CI/CD. (No migrations are included yet in this example project).

## Tests

### Unit

Unit tests can be runned with

```bash
$ npm run test
```

### E2E

E2E tests can be runned with

```bash
$ npm run test:e2e
```

## Swagger

Swagger can be accessed through `/docs` to view the API documentation.
[Swagger link](https://mp3-analysis-ot41mvurl-kristians-projects-804adfc5.vercel.app/docs)

## Optimization

At the moment we need to parse the whole stream before we can evaluate the file, we can optimize this with overriding the express parser that waits for the stream. Esentially as soon as the stream arrives we can check the file so we don't have to iterate over it twice after we have received it.

Additionally we could also try to read the XING header which exits in SOME mp3 files. This header contains the frameCount information already so we would not have to go through the whole file.

## Deployed app

The app is deployed here: https://mp3-analysis-ot41mvurl-kristians-projects-804adfc5.vercel.app/
Two endpoints are exposed

1. File upload endpoint: https://mp3-analysis-ot41mvurl-kristians-projects-804adfc5.vercel.app/file-upload
2. Health check: https://mp3-analysis-ot41mvurl-kristians-projects-804adfc5.vercel.app/health
