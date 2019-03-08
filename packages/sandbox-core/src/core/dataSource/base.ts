import { init } from 'midway-web';
import * as Sequelize from 'sequelize';
import { Options as SequelizeOptions, Sequelize as SequelizeInstance } from 'sequelize';

export class BaseDataSource {
  protected instance: SequelizeInstance;

  protected config;
  protected logger;
  protected name: string;

  @init()
  async connection() {
    const password = await this.getPassword();
    const options: SequelizeOptions = this.getOptions();
    const database: string = this.config.database;
    const username: string = this.config.username;

    this.instance = new Sequelize(database, username, password, options);

    try {
      await this.instance.authenticate();
      await this.prepare();
    } catch (error) {
      error.message = `[DataSource-${this.name}] connection error：${error.message}`;
      throw error;
    }
  }

  getInstance(): SequelizeInstance {
    return this.instance;
  }

  async prepare() {
    // something before use
  }

  async getPassword(): Promise<string> {
    return this.config.password;
  }

  getOptions(): SequelizeOptions {

    return {
      host: this.config.host,
      port: this.config.port,
      logging: (data) => { this.logger.info(data); },
      dialect: 'mysql',
      define: { charset: 'utf8' },
      timezone: '+08:00',
      operatorsAliases : false,
    };
  }
}
