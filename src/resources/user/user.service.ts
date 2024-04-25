import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { hashString } from '../../utils/bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingEmail = await this.findOne({
      where: { email: createUserDto.email },
    });
    if (existingEmail) throw new ConflictException('Email já existente.');
    return this.userRepository.save({
      ...createUserDto,
      password: await hashString(createUserDto.password),
    });
  }

  findOne(params: FindOneOptions<User>) {
    return this.userRepository.findOne(params);
  }

  findMany(params: FindManyOptions<User>) {
    return this.userRepository.find(params);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const existingEmail = await this.findOne({
      where: { email: updateUserDto.email },
    });
    if (existingEmail && existingEmail.id !== id)
      throw new ConflictException('Email já existente.');

    return this.userRepository.update(id, {
      ...updateUserDto,
      password: await hashString(updateUserDto.password),
    });
  }

  async remove(id: string) {
    const user = await this.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado.');
    return this.userRepository.delete(id);
  }
}
