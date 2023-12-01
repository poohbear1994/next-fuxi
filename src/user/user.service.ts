import { Injectable } from '@nestjs/common';
import User from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import Profile from './profile.entity';
import Logs from 'src/logs/logs.entity';

@Injectable()
export class UserService {
  constructor(
    // 注入User的存储库
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(Logs) private readonly logsRepository: Repository<Logs>,
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
   * @description: 根据id查询用户
   * @param {number} id
   */
  findById(id: number) {
    return this.userRepository.findOne({ where: { id } });
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

  /**
   * @description: 查询用户需要关联到用户文件
   * @param {number} id
   */
  findProfile(id: number) {
    return this.userRepository.findOne({
      where: {
        id,
      },
      relations: {
        profile: true,
      },
    });
  }

  /**
   * @description: 查询用户日志
   * @param {number} id
   */
  async findLogs(id: number) {
    const user = await this.findById(id);
    return this.logsRepository.find({
      where: {
        user,
      },
      relations: {
        user: true,
      },
    });
  }
}
