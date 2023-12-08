import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  LoggerService,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import * as requestIp from 'request-ip';

// 不传参数，会捕获所有异常
/**
 * @description: 全异常过滤器
 * @see{@link https://docs.nestjs.cn/10/exceptionfilters}
 */
@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logger: LoggerService,
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // ts类型守卫：处理unknown，收窄状态类型
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      headers: request.headers,
      query: request.query,
      body: request.body,
      params: request.params,
      timestamp: new Date().toISOString(),
      ip: requestIp.getClientIp(request),
      exception: exception['name'],
      error: exception['response'] || '服务器错误',
    };

    // 结合winston，记录错误日志
    this.logger.error('[公司名]', responseBody);

    // 返回响应
    this.httpAdapterHost.httpAdapter.reply(response, responseBody, httpStatus);
  }
}
