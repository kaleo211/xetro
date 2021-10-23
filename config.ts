import { IAppConfig, IConfig, IDatabaseConfig, IDellConfig } from "types/config";
import YAML from 'yaml';
import fs from 'fs';

export class Config implements IConfig {
  private static config: IConfig;

  dell: IDellConfig
  app: IAppConfig
  database: IDatabaseConfig

  private constructor() {
    const env = process.env.NODE_ENV;
    if (!env) {
      console.error('NODE_ENV was not set');
      process.exit(1);
    }

    const configPath = `./config/${env}.yml`;
    try {
      const configContent = fs.readFileSync(configPath, 'utf8');
      const config: IConfig = YAML.parse(configContent);
      return config;
    } catch (err) {
      console.error('failed to read config file:', err);
      process.exit(1);
    }
  }

  public static get(): IConfig {
    if (!Config.config) {
      Config.config = new Config();
    }
    return Config.config;
  }
}
