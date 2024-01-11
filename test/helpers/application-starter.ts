import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import * as request from 'supertest';
import * as dotenv from 'dotenv';
import { DatabaseEnvironment } from '../../src/config/interfaces/DatabaseEnvironment';
import { PostgresTestContainer } from './postgres-testcontainer';
import { INestApplication } from '@nestjs/common';
import { instance, mock, when } from 'ts-mockito';
import TestAgent from 'supertest/lib/agent';
import * as path from 'path';
import { DataSource } from 'typeorm';

dotenv.config({
  path: path.resolve(__dirname, '../../src/config/env/e2e.env'),
});

export class ApplicationStarter {
  private readonly postgresTestContainer = new PostgresTestContainer();
  private app: INestApplication;
  private dataSource: DataSource;

  private getDatabaseEnvironmentVariables(): DatabaseEnvironment {
    return {
      host: process.env.DB_HOST || 'localhost',
      name: process.env.DB_NAME!,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5433,
      username: process.env.DB_USERNAME!,
      password: process.env.DB_PASSWORD!,
    };
  }

  private async syncDatabase(): Promise<void> {
    const dbConfig = this.getDatabaseEnvironmentVariables();
    this.dataSource = new DataSource({
      type: 'postgres',
      host: dbConfig.host,
      port: this.postgresTestContainer.port,
      username: dbConfig.username,
      password: dbConfig.password,
      database: dbConfig.name,
      synchronize: true,
      entities: [File],
    });

    await (await this.dataSource.initialize()).synchronize();
  }

  public async init(): Promise<void> {
    await this.postgresTestContainer.init(
      this.getDatabaseEnvironmentVariables(),
    );
    await this.syncDatabase();

    const mockConfigService = mock(ConfigService);

    when(mockConfigService.get('database')).thenReturn({
      ...this.getDatabaseEnvironmentVariables(),
      port: this.postgresTestContainer.port,
    });

    when(mockConfigService.get('logging')).thenReturn(false);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ConfigService)
      .useValue(instance(mockConfigService))
      .compile();

    this.app = moduleFixture.createNestApplication();
    await this.app.init();
  }

  public async stop(): Promise<void> {
    await this.app.close();
    await this.dataSource.destroy();
    await this.postgresTestContainer.stop();
  }

  get request(): TestAgent {
    return request(this.app.getHttpServer());
  }
}
