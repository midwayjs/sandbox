import { providerWrapper, IApplicationContext } from 'midway-web';
import * as Sequelize from 'sequelize';
import { CoreDBDataSource } from '../../dataSource/core';

export class UiKeyMetricsModel extends Sequelize.Model {}

export async function factory(context: IApplicationContext) {
  const name = 'uiKeyMetrics';
  const dataSource = await context.getAsync<CoreDBDataSource>('coreDB');
  const instance = dataSource.getInstance();

  UiKeyMetricsModel.init({
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
      type: Sequelize.INTEGER({
        length: 4,
        unsigned: true,
      }),
      allowNull: true,
      defaultValue: 0,
    },
  }, {
    sequelize: instance,
    modelName: name,
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
