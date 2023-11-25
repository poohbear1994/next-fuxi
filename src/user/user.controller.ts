import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
// import { ConfigEnum } from '../enum/config.enum';

type AddUserParams = {
  name: string;
  age: number;
};

// 这里可以理解为我们routePath的pref，前缀为user时，走这个controller，'/user/xxxxx'
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {
    // 等效于： this.userService = UserService
  }

  // GET请求
  @Get()
  getUsers(): any {
    const db = this.configService.get('db');
    console.log(db);
    return this.userService.getUsers();
  }

  // POST请求
  @Post()
  adduser(@Body() params: AddUserParams): any {
    // 使用@Body从req对象中提取整个body对象
    return this.userService.addUser(params);
  }
}
