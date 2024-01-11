import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { DatabaseEnvironment } from 'src/config/interfaces/DatabaseEnvironment';

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
      .start();
  }

  public async stop(): Promise<void> {
    await this.container.stop();
  }
}
