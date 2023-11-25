import { readFileSync } from 'fs';
import { join } from 'path';
import * as yaml from 'js-yaml';
import * as _ from 'lodash';
import * as Joi from 'joi';

// 1. 定义环境参数类型
const schema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production')
    .default('development'),
  db: Joi.object({
    mysql1: Joi.object({
      host: Joi.string().ip(),
    }),
  }),
});

const commonPath = join(__dirname, '../', 'config', 'config.yml');

const envPath = join(
  __dirname,
  '../',
  'config',
  `config.${process.env.NODE_ENV || 'development'}.yml`,
);

const commonConfig = yaml.load(readFileSync(commonPath, 'utf8'));
const envConfig = yaml.load(readFileSync(envPath, 'utf8'));

// 因为ConfigModule有load方法，因此这里导出一个函数
export default () => {
  const values = _.merge(commonConfig, envConfig);

  // 2.对环境参数进行校验
  const { error } = schema.validate(values, {
    allowUnknown: true,
    abortEarly: false,
  });
  if (error) {
    throw new Error(`环境参数校验错误-${error.message}`);
  }

  return values;
};
