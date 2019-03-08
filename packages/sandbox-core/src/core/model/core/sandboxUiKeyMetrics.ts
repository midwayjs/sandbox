import { providerWrapper, IApplicationContext } from 'midway-web';
import * as Sequelize from 'sequelize';
import { CoreDBDataSource } from '../../dataSource/core';

export async function factory(context: IApplicationContext) {
  const name = 'uiKeyMetrics';
  const dataSource = await context.getAsync<CoreDBDataSource>('coreDB');
  const instance = dataSource.getInstance();

  /* tslint:disable:variable-name */
  const UiKeyMetricsModel = instance.define(name, {
    scope: {
      type: Sequelize.STRING(128),
      allowNull: false,
    },
    scopeName: {
      type: Sequelize.STRING(256),
      allowNull: false,
      field: 'scope_name',
    },
    config: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    deleted: {
      type: Sequelize.INTEGER(4).UNSIGNED,
      allowNull: true,
      defaultValue: 0,
    },
  }, {
    timestamps: true,
    createdAt: 'gmt_create',
    updatedAt: 'gmt_modified',
    freezeTableName: true,
    tableName: 'sandbox_ui_key_metrics',
  });

  return UiKeyMetricsModel;
}

providerWrapper([
  {
    id: 'uiKeyMetricsModel',
    provider: factory,
  },
]);
