import { Injectable } from '@nestjs/common';
import User from './user.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import Profile from './profile.entity';
import Logs from 'src/logs/logs.entity';
import Roles from 'src/roles/roles.entity';
import { getUserDTO } from './dto/getUser.dto';

@Injectable()
export class UserService {
  constructor(
    // 注入User的存储库
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(Logs)
    private readonly logsRepository: Repository<Logs>,
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
  ) {}

  /**
   * @description: 查询全部用户
   */
  findAll(query: getUserDTO) {
    const { limit = 10, page = 1, username, gender, roleId } = query;
    // 1. find方式查询
    // return this.userRepository.find({
    //   // 返回哪几列数据
    //   select: {
    //     username: true,
    //     id: true,
    //     profile: {
    //       gender: true,
    //       address: true,
    //       photo: true,
    //     },
    //   },
    //   // 表关联关系
    //   relations: {
    //     profile: true,
    //     roles: true,
    //   },
    //   // 查询条件
    //   where: {
    //     username,
    //     profile: {
    //       gender,
    //     },
    //     roles: {
    //       id: role,
    //     },
    //   },
    //   // 查询数据数量
    //   take: limit,
    //   // 跳过多少条数据
    //   skip: (page - 1) * limit,
    // });

    // 2. queryBuilder方式查询
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('user.roles', 'roles')
      .where(username ? 'user.username=:username' : '1=1', { username })
      .andWhere(gender ? 'profile.gender=:gender' : '1=1', { gender })
      .andWhere(roleId ? 'roles.id=:role' : '1=1', { roleId })
      .take(limit)
      .skip((page - 1) * limit)
      .getMany();
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
    return this.userRepository.findOne({
      where: { id },
      relations: {
        profile: true,
        logs: true,
        roles: true,
      },
    });
  }

  /**
   * @description: 创建用户
   */
  async create(user: Partial<User>, roleIds: Array<number>) {
    const roleList = await this.rolesRepository.findBy({
      id: In(roleIds),
    });
    user.roles = roleList;
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

  /**
   * @description: 查询用户角色
   * @param {number} id
   */
  async findRoles(id: number) {
    const user = await this.findById(id);
    return this.rolesRepository.find({
      where: {
        users: user,
      },
    });
  }

  /**
   * @description: 聚合查询日志
   * @param {number} id
   */
  findLogsByGroup(id: number) {
    // 方式1使用sql语句
    // return this.logsRepository.query(
    //   `SELECT logs.result as result, COUNT(logs.result) as count FROM logs
    //   JOIN user ON user.id = logs.userId
    //   WHERE user.id = ${id}
    //   GROUP BY logs.result
    //   `,
    // );
    // 方式2：使用typeORM封装的链式API
    return (
      this.logsRepository
        .createQueryBuilder('logs')
        // 选择logs表的result列，生成数据字段指定为result
        .select('logs.result', 'result')
        // 选择logs表的result列，生成数据字段指定为count
        .addSelect('COUNT("logs.result")', 'count')
        .innerJoin('logs.user', 'user', 'user.id = logs.userId')
        // 仅获取指定的用户的数据
        .where('user.id = :id', { id })
        // 根据logs的result进行数据的划分
        .groupBy('logs.result')
        // 获取查询结果
        .getRawMany()
    );
  }
}
