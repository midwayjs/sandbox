import { provide, inject, init, async, config, logger, scope, ScopeEnum } from 'midway-mirror';
import * as Sequelize from 'sequelize';
import { Options as SequelizeOptions, Sequelize as SequelizeInstance } from 'sequelize';

@scope(ScopeEnum.Singleton)
@async()
@provide('coreDB')
export class CoreDBDataSource {
  @inject()
  keycenter;

  @config('coreDB')
  config;

  @logger('coreDBLogger')
  logger;

  instance: SequelizeInstance;

  @init()
  async connection() {
    let password = this.config.password;
    if (this.config.encrypt) {
      password = await this.keycenter.decrypt(password, this.config.secretKey);
    }

    const options: SequelizeOptions = {
      host: this.config.host,
      port: this.config.port,
      logging: (data) => { this.logger.info(data); },
      dialect: 'mysql',
      define: { charset: 'utf8' },
      timezone: '+08:00',
      operatorsAliases : false,
    };
    const database: string = this.config.database;
    const username: string = this.config.username;
    this.instance = new Sequelize(database, username, password, options);

    try {
      await this.instance.authenticate();
      await this.prepare();
    } catch (error) {
      error.message = `[DataSource-coreDB] connection error：${error.message}`;
      throw error;
    }
  }

  async prepare() {
    // something before use
  }
}
