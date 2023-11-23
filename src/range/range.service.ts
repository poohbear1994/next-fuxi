import { Injectable } from '@nestjs/common';
import ResponseResult from '../common/ResponseResult';

@Injectable()
export class RangeService {
  getRange(range: string): ResponseResult<Array<string>> {
    // 类型转换
    const realRange: number = +range;
    if (isNaN(realRange)) {
      return new ResponseResult({
        code: 1,
        msg: 'range参数请填写数字字符串',
      });
    }

    // 判断是否越界
    if (realRange < 0) {
      return new ResponseResult({
        code: 2,
        msg: 'range参数请填写一个>= 0的数字字符串',
      });
    }

    // 参数正确
    const arr: Array<string> = [];
    if (realRange > 0) {
      for (let i = 1; i <= realRange; i++) {
        arr.push(`${i}`);
      }
    }

    return new ResponseResult({
      data: arr,
    });
  }
}
