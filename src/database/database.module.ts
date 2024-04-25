import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '@/resources/user/entities/user.entity';
import { Movie } from '@/resources/movies/entities/movie.entity';
import { Genre } from '@/resources/genres/entities/genre.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'postgres',
          url: configService.get('DIRECT_URL'),
          entities: [User, Movie, Genre],
        };
      },
    }),
  ],
})
export class DatabaseModule {}
