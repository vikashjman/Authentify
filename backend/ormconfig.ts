import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const dbConfig: TypeOrmModuleOptions = {
    synchronize: true,
    type: 'sqlite', // default to sqlite, you can change this as per your needs
    entities: ['**/*.entity.ts'], // default to .ts entities, you can change this as per your needs
};

switch (process.env.NODE_ENV) {
    case 'development':
        Object.assign(dbConfig, {
            database: 'db.sqlite',
            entities: ['dist/**/*.entity{.ts,.js}'],
        });
        break;
    case 'test':
        Object.assign(dbConfig, {
            database: 'test.sqlite',
            entities: ['**/*.entity.ts'],
        });
        break;
    case 'production':
        Object.assign(dbConfig, {
            type: 'postgres',
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            entities: ['dist/**/*.entity{.ts,.js}'],
            migrations: ['dist/db/migrations/*{.ts,.js}'],
            logging: false,
            synchronize: false,
        })
        break;
    default:
        throw new Error('unknown environment');
}

export default dbConfig;