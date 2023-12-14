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
} from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import User from './user.entity';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';

// 这里可以理解为我们routePath的pref，前缀为user时，走这个controller，'/user/xxxxx'
@Controller('user')
@UseFilters(new HttpExceptionFilter(Logger))
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
  getUsers(): any {
    this.logger.log(`请求getUsers成功`);
    return this.userService.findAll();
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
  updateUser(@Param('id') id: string, @Body() user: Partial<User>): any {
    return this.userService.update(+id, user);
  }

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
  getUserProfile(@Query('id') id: string) {
    return this.userService.findProfile(+id);
  }

  /**
   * @description: 根据结果分类获取指定用户操作日志
   */
  @Get('logsByGroup')
  getUserLogsByGroup(@Query('id') id: string) {
    return this.userService.findLogsByGroup(+id);
  }
}
