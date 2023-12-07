import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import Roles from './roles.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
  ) {}

  /**
   * @description: 新建角色
   */
  async create(role: Partial<Roles>) {
    const temp = await this.rolesRepository.create(role);
    return this.rolesRepository.save(temp);
  }

  /**
   * @description: 查询角色列表
   */
  findAll() {
    return this.rolesRepository.find();
  }

  /**
   * @description: 根据Id批量查询
   * @param {Array} ids
   */
  findByIds(ids: Array<number>) {
    this.rolesRepository.find;
    return this.rolesRepository.findBy({
      id: In(ids),
    });
  }
}
