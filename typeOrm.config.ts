import { DataSource } from 'typeorm';
import { Genre } from './src/resources/genres/entities/genre.entity';
import { Movie } from './src/resources/movies/entities/movie.entity';
import { User } from './src/resources/user/entities/user.entity';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';

config();
const configService = new ConfigService();

const cnn = new DataSource({
  type: 'postgres',
  url: configService.get('DIRECT_URL'),
  entities: [Genre, Movie, User],
  migrations: [`${__dirname}/src/database/migrations/**/*{.js,.ts}`],
  migrationsTableName: '_migrations',
});

cnn
  .initialize()
  .then(() => {
    console.log('cnn initialized');
  })
  .catch((err) => {
    console.log(configService.get('DB_HOST'));
    console.log('cnn error', err);
  });

export default cnn;
