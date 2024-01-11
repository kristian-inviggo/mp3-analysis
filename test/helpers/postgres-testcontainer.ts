import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { DatabaseEnvironment } from 'src/config/interfaces/DatabaseEnvironment';
import { File } from '../../src/uploads/entities/file.entity';
import { DataSource } from 'typeorm';

export class PostgresTestContainer {
  public container: StartedPostgreSqlContainer;

  get port(): number {
    return this.container.getFirstMappedPort();
  }

  public async init(
    dbConfig: Omit<DatabaseEnvironment, 'host'>,
  ): Promise<void> {
    this.container = await new PostgreSqlContainer('postgres:16-alpine')
      .withDatabase(dbConfig.name)
      .withUsername(dbConfig.username)
      .withPassword(dbConfig.password)
      // .withExposedPorts(dbConfig.port)
      .start();
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
