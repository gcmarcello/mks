import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UuidValidationPipe } from '../../pipes/uuid-validation.pipe';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role, Roles } from '@/decorators/roles.decorator';
import { RolesGuard } from '@/guards/role.guard';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  create(@Body() createMovieDto: CreateUserDto) {
    return this.usersService.create(createMovieDto);
  }

  @ApiBearerAuth()
  @Get()
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  findAll() {
    return this.usersService.findMany({});
  }

  @ApiBearerAuth()
  @Get(':id')
  @Roles(Role.Self)
  @UseGuards(RolesGuard)
  findOne(@Param('id', UuidValidationPipe) id: string) {
    return this.usersService.findOne({ where: { id } });
  }

  @ApiBearerAuth()
  @Patch(':id')
  @Roles(Role.Self)
  @UseGuards(RolesGuard)
  update(
    @Param('id', UuidValidationPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @Roles(Role.Self)
  @UseGuards(RolesGuard)
  remove(@Param('id', UuidValidationPipe) id: string) {
    return this.usersService.remove(id);
  }
}
