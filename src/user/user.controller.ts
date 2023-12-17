import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseFilters,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import User from './user.entity';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import type { getUserDTO } from './dto/getUser.dto';
import { TypeormFilter } from 'src/filters/typeorm.filter';

@Controller('user')
@UseFilters(new HttpExceptionFilter(Logger))
@UseFilters(new TypeormFilter())
export class UserController {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private logger: Logger,
  ) {
    this.logger.log(`UserController init`);
  }

  /**
   * @description: 获取全部用户
   */
  // GET请求
  @Get()
  getUsers(@Query() query: getUserDTO): any {
    return this.userService.findAll(query);
  }

  /**
   * @description: 根据Id查询用户
   */
  @Get('byId')
  getUserById(@Query('id') id: string): any {
    return this.userService.findById(+id);
  }

  /**
   * @description: 根据用户名查询用户
   */
  // GET请求
  @Get('byName')
  getUserByName(@Query('username') username: string): any {
    return this.userService.find(username);
  }

  /**
   * @description: 添加用户
   */
  @Post()
  adduser(
    @Body() params: { user: Partial<User>; roleIds: Array<number> },
  ): any {
    // 使用@Body从req对象中提取整个body对象
    return this.userService.create(params.user, params.roleIds);
  }

  /**
   * @description: 更新用户信息
   */
  @Patch('/:id')
  updateUser(
    @Param('id') id: string,
    @Body() user: Partial<User>,
    @Headers('Authorization') headers: any,
  ): any {
    // todo
    // 判断用户是否是自己？
    // 判断用户是否有更新user的权限？
    // 返回数据：不能包含敏感信息
    if (id === headers) {
      return this.userService.update(+id, user);
    } else {
      throw new UnauthorizedException('无权限更新用户');
    }
  }

  // 1. controller名 vs service名 vs repository名应该怎么取？
  // 2. typeorm里面delete与remove的区别是什么？
  /**
   * @description: 删除用户信息
   */
  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  /**
   * @description: 查询用户操作日志
   */
  @Get('/logs/:id')
  getUserLogs(@Param('id') id: string) {
    return this.userService.findLogs(+id);
  }

  /**
   * @description: 查询用户角色列表
   */
  @Get('roles')
  getUserRoles(@Query('id') id: string) {
    return this.userService.findRoles(+id);
  }

  /**
   * @description: 查询用户文件
   */
  @Get('profile')
  getUserContainProfile(@Query('id') id: string) {
    return this.userService.findUserContainProfile(+id);
  }

  /**
   * @description: 根据结果分类获取指定用户操作日志
   */
  @Get('logsByGroup')
  getUserLogsByGroup(@Query('id') id: string) {
    return this.userService.findLogsByGroup(+id);
  }
}
