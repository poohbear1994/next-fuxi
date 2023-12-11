/**
 * @Description: typeORM配置
 */

import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import * as yaml from 'js-yaml';
import { readFileSync } from 'fs';
import * as _ from 'lodash';
import { DataSource, DataSourceOptions } from 'typeorm';

const entitiesDir =
  process.env.NODE_ === 'test'
    ? [__dirname + '/**/*.entity.ts']
    : [__dirname + '/**/*.entity{.js,.ts}'];

/**
 * @description: 解析出config的环境配置参数
 */
function paarseEnvObj() {
  const commonPath = join(__dirname, '../', 'config', 'config.yml');

  const envPath = join(
    __dirname,
    '../',
    'config',
    `config.${process.env.NODE_ENV || 'development'}.yml`,
  );

  const commonConfig = yaml.load(readFileSync(commonPath, 'utf8'));
  const envConfig = yaml.load(readFileSync(envPath, 'utf8'));
  return _.merge(commonConfig, envConfig);
}

const envObj = paarseEnvObj() as any;

// nest连接数据库配置
export const connectionParams: TypeOrmModuleOptions = {
  type: envObj['db']['type'],
  host: envObj['db']['host'],
  port: envObj['db']['port'],
  username: envObj['db']['username'],
  password: envObj['db']['password'],
  database: envObj['db']['database'],
  entities: entitiesDir,
  // 同步本地的schema与数据库 => 初始化的时候使用
  synchronize: true,
  logging: false,
};

// typeORM数据库配置
const dataSourceOptions = {
  ...connectionParams,
  migrations: ['src/migrations/**'],
  subscribers: [],
} as DataSourceOptions;

export default new DataSource(dataSourceOptions);

console.log('connection', connectionParams);
