import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { Genre } from '../genres/entities/genre.entity';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
    @InjectRepository(Genre)
    private genreRepository: Repository<Genre>,
    private redisService: RedisService,
  ) {}

  async create(createMovieDto: CreateMovieDto) {
    const { genres, title, year } = createMovieDto;
    const movie = this.moviesRepository.create({ title, year });
    const genreEntities = await this.genreRepository.find({
      where: { id: In(genres) },
    });

    movie.genres = genreEntities;
    await this.redisService.delete('movies', 'all');
    return this.moviesRepository.save(movie);
  }

  async findAll() {
    const cachedMovies = await this.redisService.get('movies', 'all');
    if (cachedMovies) {
      return JSON.parse(cachedMovies);
    }
    const movies = await this.moviesRepository.find({ relations: ['genres'] });

    await this.redisService.setWithExpiry(
      'movies',
      'all',
      JSON.stringify(movies),
      600,
    );
    return this.moviesRepository.find();
  }

  async findOne(id: string) {
    const cachedMovie = await this.redisService.get('movie', id);
    if (cachedMovie) {
      return JSON.parse(cachedMovie);
    }
    const movie = await this.moviesRepository.findOne({
      where: { id },
      relations: ['genres'],
    });
    if (movie)
      await this.redisService.setWithExpiry(
        'movie',
        id,
        JSON.stringify(movie),
        600,
      );
    return movie;
  }

  async update(id: string, updateMovieDto: UpdateMovieDto) {
    const findMovie = await this.findOne(id);
    if (!findMovie) throw new NotFoundException('Filme não encontrado.');

    const { genres, title, year } = updateMovieDto;
    const movie = this.moviesRepository.create({ title, year });
    if (genres && genres.length > 0) {
      const genreEntities = await this.genreRepository.find({
        where: { id: In(genres) },
      });
      movie.genres = genreEntities;
    }

    await this.redisService.delete('movies', 'all');
    await this.redisService.delete('movie', id);
    return this.moviesRepository.update(id, movie);
  }

  async remove(id: string) {
    const movie = await this.findOne(id);
    if (!movie) throw new NotFoundException('Filme não encontrado.');
    await this.redisService.delete('movie', id);
    return this.moviesRepository.delete(id);
  }
}
