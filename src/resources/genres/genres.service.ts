import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Genre } from './entities/genre.entity';
import { Repository } from 'typeorm';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class GenresService {
  constructor(
    @InjectRepository(Genre)
    private genreRepository: Repository<Genre>,
    private redisService: RedisService,
  ) {}

  async create(createGenreDto: CreateGenreDto) {
    return this.genreRepository.save(createGenreDto);
  }

  async findAll() {
    const cachedGenres = await this.redisService.get('genres', 'all');
    if (cachedGenres) {
      return JSON.parse(cachedGenres);
    }
    const genres = await this.genreRepository.find();
    await this.redisService.setWithExpiry(
      'genres',
      'all',
      JSON.stringify(genres),
      600,
    );
    return this.genreRepository.find();
  }

  async findOne(id: string) {
    const cachedGenre = await this.redisService.get('genre', id);
    if (cachedGenre) {
      return JSON.parse(cachedGenre);
    }
    const genre = await this.genreRepository.findOne({
      where: { id },
    });
    if (genre)
      await this.redisService.setWithExpiry(
        'genre',
        id,
        JSON.stringify(genre),
        600,
      );
    return;
  }

  async findAllMoviesFrom(id: string) {
    const genre = await this.findOne(id);
    if (!genre) throw new NotFoundException('Gênero não encontrado.');
    return this.genreRepository.findOne({
      where: { id },
      relations: ['movies'],
    });
  }

  async update(id: string, updateGenreDto: UpdateGenreDto) {
    const genre = await this.findOne(id);
    if (!genre) throw new NotFoundException('Gênero não encontrado.');
    await this.redisService.delete('genres', 'all');
    await this.redisService.delete('genre', id);
    return this.genreRepository.update(id, updateGenreDto);
  }

  async remove(id: string) {
    const genre = await this.findOne(id);
    if (!genre) throw new NotFoundException('Gênero não encontrado.');
    await this.redisService.delete('genre', id);
    return this.genreRepository.delete(id);
  }
}
