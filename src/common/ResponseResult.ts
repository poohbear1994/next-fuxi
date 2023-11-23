type ResponseResultParams<T> = Partial<{
  code: number;
  msg: string;
  data: T;
}>;

class ResponseResult<T = any> {
  code: number;
  msg: string;
  data?: T;
  constructor({ code = 0, msg = '请求成功', data }: ResponseResultParams<T>) {
    this.code = code;
    this.msg = msg;
    if (data) this.data = data;
  }
}

export default ResponseResult;
