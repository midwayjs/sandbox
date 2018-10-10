import { providerWrapper, IApplicationContext } from 'midway-mirror';
import * as Sequelize from 'sequelize';
import { DWDataSource } from '../../dataSource/dw';

export async function factory(context: IApplicationContext) {
  const name = 'slsErrors';
  const dataSource = await context.getAsync<DWDataSource>('dw');
  const instance = dataSource.instance;

  /* tslint:disable:variable-name */
  const SLSErrorModel = instance.define(name, {
    timestamp: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    scope: {
      type: Sequelize.STRING(128),
      allowNull: false,
    },
    scopeName: {
      type: Sequelize.STRING(256),
      allowNull: false,
      field: 'scope_name',
    },
    env: {
      type: Sequelize.STRING(128),
      allowNull: false,
    },
    hostname: {
      type: Sequelize.STRING(512),
      allowNull: false,
    },
    ip: {
      type: Sequelize.STRING(512),
      allowNull: false,
    },
    pid: {
      type: Sequelize.STRING(256),
    },
    errorType: {
      type: Sequelize.STRING(512),
      field: 'error_type',
    },
    errorMessage: {
      type: Sequelize.TEXT,
      field: 'error_message',
    },
    errorStack: {
      type: Sequelize.TEXT,
      field: 'error_stack',
    },
    traceId: {
      type: Sequelize.STRING(256),
      field: 'trace_id',
    },
    unixTimestamp: {
      type: Sequelize.BIGINT,
      field: 'unix_timestamp',
    },
    version: {
      type: Sequelize.INTEGER,
    },
    uuid: {
      type: Sequelize.STRING(256),
      allowNull: false,
    },
    logPath: {
      type: Sequelize.TEXT,
      field: 'log_path',
    },
  }, {
    timestamps: false,
    underscored: false,
    freezeTableName: true,
    tableName: 'sandbox_galaxy_sls_errors',
  });

  SLSErrorModel.removeAttribute('id');

  return SLSErrorModel;
}

providerWrapper([
  {
    id: 'errorModel',
    provider: factory,
  },
]);
