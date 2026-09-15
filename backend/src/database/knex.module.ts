import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import knex, { Knex } from 'knex';

export const KNEX_CONNECTION = 'KNEX_CONNECTION';

@Global()
@Module({
  providers: [
    {
      provide: KNEX_CONNECTION,
      inject: [ConfigService],
      useFactory: (config: ConfigService): Knex => {
        return knex({
          client: 'pg',
          connection: {
            host: config.get<string>('DB_HOST', 'localhost'),
            port: config.get<number>('DB_PORT', 5432),
            user: config.get<string>('DB_USER', 'lms_user'),
            password: config.get<string>('DB_PASSWORD', 'lms_password'),
            database: config.get<string>('DB_NAME', 'lms_db'),
          },
          pool: { min: 2, max: 10 },
        });
      },
    },
  ],
  exports: [KNEX_CONNECTION],
})
export class KnexModule {}
