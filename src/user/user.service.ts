import { Injectable } from '@nestjs/common';
import User from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    // 注入User的存储库
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  /**
   * @description: 查询全部用户
   */
  findAll() {
    return this.userRepository.find();
  }

  /**
   * @description: 根据用户名查询用户
   * @param {string} username
   */
  find(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }

  /**
   * @description: 创建用户
   */
  async create(user: Partial<User>) {
    const temp = await this.userRepository.create(user);
    return this.userRepository.save(temp);
  }

  /**
   * @description: 更新用户信息
   * @param {number} id
   * @param {Partial<User>} user
   */
  update(id: number, user: Partial<User>) {
    return this.userRepository.update(id, user);
  }

  /**
   * @description: 移除用户
   * @param {number} id
   */
  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
