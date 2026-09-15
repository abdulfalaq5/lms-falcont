import * as dotenv from 'dotenv';
import * as path from 'path';
import type { Knex } from 'knex';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const config: Knex.Config = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'lms_user',
    password: process.env.DB_PASSWORD || 'lms_password',
    database: process.env.DB_NAME || 'lms_db',
  },
  migrations: {
    directory: './migrations',
    extension: 'ts',
    tableName: 'knex_migrations',
  },
  seeds: {
    directory: './seeds',
    extension: 'ts',
  },
  pool: { min: 2, max: 10 },
};

export default config;
