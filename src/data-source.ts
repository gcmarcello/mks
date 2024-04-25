import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config();
const configService = new ConfigService();

const AppDataSource = new DataSource({
  type: 'postgres',
  url: configService.get('DIRECT_URL'),
  entities: [
    './src/resources/genres/entities/genre.entity',
    './src/resources/movies/entities/movie.entity',
    './src/resources/user/entities/user.entity',
  ],
  migrations: [`${__dirname}/src/database/migrations/**/*{.js,.ts}`],
  migrationsTableName: '_migrations',
});

AppDataSource.initialize()
  .then(() => {
    console.log('cnn initialized');
  })
  .catch((err) => {
    console.log('cnn error', err);
  });

export default AppDataSource;
