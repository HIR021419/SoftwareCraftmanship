import { readFileSync } from 'fs';
import { join } from 'path';
import * as yaml from 'js-yaml';
import { SwaggerThemeNameEnum } from 'swagger-themes';

const YAML_CONFIG_FILENAME = 'config.yaml';

export default () => {
  return yaml.load(
    readFileSync(join('.', YAML_CONFIG_FILENAME), 'utf8'),
  ) as Record<string, any>;
};

export interface AppConfig {
  port: number;
  api_prefix: string;
  swagger_theme: SwaggerThemeNameEnum;
}

export interface AlgorithmConfig {
  ticks: number;
  max_states: number;
  max_index: number;
}

export interface FilesConfig {
  input_path: string;
  output_path: string;
}
