import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GenresService } from './genres.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UuidValidationPipe } from '../../pipes/uuid-validation.pipe';

@ApiTags('Genres')
@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @ApiBearerAuth()
  @Post()
  async create(@Body() createGenreDto: CreateGenreDto) {
    return await this.genresService.create(createGenreDto);
  }

  @ApiBearerAuth()
  @Get()
  findAll() {
    return this.genresService.findAll();
  }

  @ApiBearerAuth()
  @Get(':id/movies')
  findAllFrom(@Param('id', UuidValidationPipe) id: string) {
    return this.genresService.findAllMoviesFrom(id);
  }

  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id', UuidValidationPipe) id: string) {
    return this.genresService.findOne(id);
  }

  @ApiBearerAuth()
  @Patch(':id')
  update(
    @Param('id', UuidValidationPipe) id: string,
    @Body() updateGenreDto: UpdateGenreDto,
  ) {
    return this.genresService.update(id, updateGenreDto);
  }

  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id', UuidValidationPipe) id: string) {
    return this.genresService.remove(id);
  }
}
