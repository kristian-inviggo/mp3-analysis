import { Environment } from './interfaces/Environment';

export const configuration = (): Environment => {
  const nodeEnv = process.env.NODE_ENV || 'development';

  if (nodeEnv === 'production') {
    const keys = [
      'DB_NAME',
      'DB_PORT',
      'DB_USERNAME',
      'DB_PASSWORD',
      'DB_HOST',
    ];
    const existingVariables = Object.keys(process.env);
    if (!keys.every((key) => existingVariables.includes(key))) {
      throw new Error('Some environment variables are missing');
    }
  }

  return {
    NODE_ENV: nodeEnv,
    database: {
      host: process.env.DB_HOST || 'localhost',
      name: process.env.DB_NAME || 'mp3Analytics',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
    },
    logging: !!process.env.LOGGING,
  };
};
