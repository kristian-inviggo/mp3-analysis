import { DatabaseEnvironment } from './DatabaseEnvironment';

export interface Environment {
  NODE_ENV: string;
  database: DatabaseEnvironment;
  logging?: boolean;
}
