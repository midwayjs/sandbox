import { providerWrapper, IApplicationContext } from 'midway-web';
import * as Sequelize from 'sequelize';
import { DWDataSource } from '../../dataSource/dw';

export async function factory(context: IApplicationContext) {
  const name = 'slsTraceNodes';
  const dataSource = await context.getAsync<DWDataSource>('dw');
  const instance = dataSource.getInstance();

  /* tslint:disable:variable-name */
  const SLSTraceNodeModel = instance.define(name, {
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
    traceId: {
      type: Sequelize.STRING(256),
      field: 'trace_id',
    },
    uuid: {
      type: Sequelize.STRING(256),
      allowNull: false,
    },
    spanName: {
      type: Sequelize.STRING(512),
      field: 'span_name',
    },
    spanTimestamp: {
      type: Sequelize.STRING(128),
      field: 'span_timestamp',
    },
    spanDuration: {
      type: Sequelize.INTEGER,
      field: 'span_duration',
    },
    spanError: {
      type: Sequelize.INTEGER(4),
      allowNull: true,
      defaultValue: 0,
      field: 'span_error',
    },
    spanType: {
      type: Sequelize.INTEGER,
      field: 'span_type',
    },
    spanMethod: {
      type: Sequelize.STRING(128),
      field: 'span_method',
    },
    spanTarget: {
      type: Sequelize.TEXT,
      field: 'span_target',
    },
    spanCode: {
      type: Sequelize.STRING(128),
      field: 'span_code',
    },
    spanTags: {
      type: Sequelize.TEXT,
      field: 'span_tags',
    },
    spanId: {
      type: Sequelize.STRING(128),
      field: 'span_id',
    },
    spanRpcId: {
      type: Sequelize.STRING(128),
      field: 'span_rpcid',
    },
  }, {
    timestamps: false,
    underscored: false,
    freezeTableName: true,
    tableName: 'sandbox_galaxy_sls_trace_nodes',
  });

  SLSTraceNodeModel.removeAttribute('id');

  return SLSTraceNodeModel;
}

providerWrapper([
  {
    id: 'traceNodeModel',
    provider: factory,
  },
]);
