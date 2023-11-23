import { Injectable } from '@nestjs/common';

type AddUserParams = {
  name: string;
  age: number;
};

@Injectable()
export class UserService {
  getUsers(): any {
    return {
      code: 0,
      data: [],
      msg: '请求用户列表成功',
    };
  }

  addUser({ name, age }: AddUserParams): any {
    return {
      code: 0,
      data: {
        name,
        age,
      },
      msg: '用户新增成功',
    };
  }
}
