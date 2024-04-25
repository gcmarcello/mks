import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsStrongPassword, MinLength } from 'class-validator';

export class CreateUserDto {
  @MinLength(3)
  @ApiProperty({ example: 'John Doe' })
  name: string;
  @ApiProperty({ example: 'john@doe.com' })
  @IsEmail()
  email: string;
  @ApiProperty({ example: 'ABC1234*d' })
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;
}
