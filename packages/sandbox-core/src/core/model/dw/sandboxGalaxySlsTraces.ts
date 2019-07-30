import { providerWrapper, IApplicationContext } from 'midway-web';
import * as Sequelize from 'sequelize';
import { DWDataSource } from '../../dataSource/dw';

export class SLSTraceModel extends Sequelize.Model {}

export async function factory(context: IApplicationContext) {
  const name = 'slsTraces';
  const dataSource = await context.getAsync<DWDataSource>('dw');
  const instance = dataSource.getInstance();

  SLSTraceModel.init({
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
    traceName: {
      type: Sequelize.TEXT,
      field: 'trace_name',
    },
    traceSpans: {
      type: Sequelize.TEXT,
      field: 'trace_spans',
    },
    traceId: {
      type: Sequelize.STRING(256),
      field: 'trace_id',
    },
    traceDuration: {
      type: Sequelize.INTEGER,
      field: 'trace_duration',
    },
    traceStatus: {
      type: Sequelize.INTEGER,
      field: 'trace_status',
      defaultValue: 1,
    },
    uuid: {
      type: Sequelize.STRING(256),
      allowNull: false,
    },
    unixTimestamp: {
      type: Sequelize.BIGINT,
      field: 'unix_timestamp',
    },
    version: {
      type: Sequelize.INTEGER,
    },
  }, {
    sequelize: instance,
    modelName: name,
    timestamps: false,
    underscored: false,
    freezeTableName: true,
    tableName: 'sandbox_galaxy_sls_traces',
  });

  SLSTraceModel.removeAttribute('id');

  return SLSTraceModel;
}

providerWrapper([
  {
    id: 'traceModel',
    provider: factory,
  },
]);
