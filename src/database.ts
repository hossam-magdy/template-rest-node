import { Connection, ConnectionOptions, createConnection } from 'typeorm';

const connectionOpts: ConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'postgres',
  entities: [`${__dirname}/models/*.ts`],
  synchronize: true,
};

export const dbConnection: Promise<Connection> =
  createConnection(connectionOpts);
