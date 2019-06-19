import { providerWrapper, IApplicationContext } from 'midway-web';
import * as Sequelize from 'sequelize';
import { CoreDBDataSource } from '../../dataSource/core';

export class UiDashboardModel extends Sequelize.Model {}

export async function factory(context: IApplicationContext) {
  const name = 'uiDashboards';
  const dataSource = await context.getAsync<CoreDBDataSource>('coreDB');
  const instance = dataSource.getInstance();

  UiDashboardModel.init({
    scope: {
      type: Sequelize.STRING(128),
      allowNull: false,
    },
    scopeName: {
      type: Sequelize.STRING(256),
      allowNull: false,
      field: 'scope_name',
    },
    dashboardName: {
      type: Sequelize.STRING(256),
      allowNull: false,
      field: 'dashboard_name',
    },
    target: {
      type: Sequelize.INTEGER({
        length: 4,
        unsigned: true,
      }),
      allowNull: true,
      defaultValue: 1,
    },
    config: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    focus: {
      type: Sequelize.INTEGER({
        length: 4,
        unsigned: true,
      }),
      allowNull: true,
      defaultValue: 0,
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
    tableName: 'sandbox_ui_dashboards',
  });

  return UiDashboardModel;
}

providerWrapper([
  {
    id: 'uiDashboardModel',
    provider: factory,
  },
]);
