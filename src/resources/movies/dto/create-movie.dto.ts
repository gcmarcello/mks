import { IsNumber, IsUUID, Length } from 'class-validator';

export class CreateMovieDto {
  @Length(3)
  title: string;
  @IsNumber({ maxDecimalPlaces: 0 })
  year: number;
  @IsUUID(undefined, { each: true })
  genres: string[];
}
