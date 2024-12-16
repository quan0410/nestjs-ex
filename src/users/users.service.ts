import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findAll() {
    return this.userRepository.find();
  }

  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  update(id: string, createUserDto: CreateUserDto) {
    return this.userRepository.update(id, createUserDto);
  }

  async remove(_id: string) {
    const user = await this.userRepository.findOneBy({ _id });
    if (!user) {
      throw new NotFoundException(`User with ID ${_id} not found`);
    }
    return await this.userRepository.delete(_id);
  }
}
