import { Length } from 'class-validator';

export class CreateGenreDto {
  @Length(3)
  name: string;
}
