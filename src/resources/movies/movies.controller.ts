import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UuidValidationPipe } from '../../pipes/uuid-validation.pipe';

@ApiTags('Movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @ApiBearerAuth()
  @Post()
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @ApiBearerAuth()
  @Get()
  findAll() {
    return this.moviesService.findAll();
  }

  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id', UuidValidationPipe) id: string) {
    return this.moviesService.findOne(id);
  }

  @ApiBearerAuth()
  @Patch(':id')
  update(
    @Param('id', UuidValidationPipe) id: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    return this.moviesService.update(id, updateMovieDto);
  }

  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id', UuidValidationPipe) id: string) {
    return this.moviesService.remove(id);
  }
}
