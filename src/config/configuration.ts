import { Environment } from './interfaces/Environment';

export const configuration = (): Environment => {
  const nodeEnv = process.env.NODE_ENV || 'development';

  if (nodeEnv === 'production') {
    const keys = ['LOGGER'];
    const existingVariables = Object.keys(process.env);
    if (!keys.every((key) => existingVariables.includes(key))) {
      throw new Error('Some environment variables are missing');
    }
  }

  return {
    NODE_ENV: nodeEnv,
    logging: !!process.env.LOGGING,
  };
};
