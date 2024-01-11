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

Note: Unit tests mock the repositories so they don't require starting up a real database

## Swagger

Swagger can be accessed through `/docs` to view the API documentation.
This works only in development mode
