import { Body, Controller, Post, Get } from '@nestjs/common';
import { RolesService } from './roles.service';
import Roles from './roles.entity';

@Controller('roles')
export class RolesController {
  constructor(private roleService: RolesService) {}

  /**
   * @description: 新建角色
   */
  @Post()
  addRole(@Body() params: Partial<Roles>): any {
    return this.roleService.create(params);
  }

  /**
   * @description: 查询角色列表
   */
  @Get()
  getRoles(): any {
    return this.roleService.findAll();
  }

  /**
   * @description: 根据id批量查询角色
   */
  @Post('findByIds')
  getRolesByIds(@Body() params: { ids: Array<number> }) {
    return this.roleService.findByIds(params.ids);
  }
}
