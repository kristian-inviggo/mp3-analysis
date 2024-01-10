import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { File } from 'src/uploads/entities/file.entity';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config({ path: '../../src/config/e2e.env' });

export class PostgresTestContainer {
  public container: StartedPostgreSqlContainer;
  public port: number;

  public async init(): Promise<void> {
    this.container = await new PostgreSqlContainer('postgres:16-alpine')
      .withDatabase(process.env.DB_NAME!)
      .withUsername(process.env.DB_USERNAME!)
      .withPassword(process.env.DB_PASSWORD!)
      .withExposedPorts(parseInt(process.env.DB_PORT!, 10!))
      .start();

    this.port = this.container.getMappedPort(5433);
  }

  public async sync(): Promise<void> {
    const dataSource = new DataSource({
      type: 'postgres',
      host: 'localhost',
      port: this.port,
      username: 'postgres',
      password: 'postgres',
      database: 'test',
      synchronize: true,
      entities: [File],
    });

    await dataSource.initialize();
  }

  public async stop(): Promise<void> {
    await this.container.stop();
  }
}
