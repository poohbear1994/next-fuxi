import { readFileSync } from 'fs';
import { join } from 'path';
import * as yaml from 'js-yaml';
import * as _ from 'lodash';

const YAML_CONFIG_FILENAME = 'config.yml';
const commonPath = join(__dirname, '../', 'config', YAML_CONFIG_FILENAME);

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
  return _.merge(commonConfig, envConfig);
};
