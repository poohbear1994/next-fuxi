import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  LoggerService,
} from '@nestjs/common';

/**
 * @description: http请求异常过滤器
 * @see{@link https://docs.nestjs.cn/10/exceptionfilters}
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private logger: LoggerService) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();

    // 结合winston，记录错误日志
    this.logger.error(exception.message, exception.stack);

    // 返回响应
    response.status(status).json({
      code: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: exception.message || HttpException.name,
    });
  }
}
