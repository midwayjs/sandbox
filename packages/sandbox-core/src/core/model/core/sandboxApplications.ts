import { providerWrapper, IApplicationContext } from 'midway-web';
import * as Sequelize from 'sequelize';
import { CoreDBDataSource } from '../../dataSource/core';

export class ApplicationModel extends Sequelize.Model {}

export async function factory(context: IApplicationContext) {
  const name = 'applications';
  const dataSource = await context.getAsync<CoreDBDataSource>('coreDB');
  const instance = dataSource.getInstance();

  ApplicationModel.init({
    scope: {
      type: Sequelize.STRING(128),
      allowNull: false,
    },
    scopeName: {
      type: Sequelize.STRING(256),
      allowNull: false,
      field: 'scope_name',
    },
    scopeId: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'scope_id',
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    bu: {
      type: Sequelize.STRING(256),
      allowNull: true,
    },
    owner: {
      type: Sequelize.STRING(128),
      allowNull: false,
    },
    appops: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    alinodeId: {
      type: Sequelize.STRING(256),
      allowNull: true,
      field: 'alinode_id',
    },
    alinodeToken: {
      type: Sequelize.STRING(256),
      allowNull: true,
      field: 'alinode_token',
    },
    flag: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
    },
    deleted: {
      type: Sequelize.INTEGER({
        length: 4,
        unsigned: true,
      }),
      allowNull: true,
      defaultValue: 0,
    },
    state: {
      type: Sequelize.INTEGER({
        length: 4,
        unsigned: true,
      }),
      allowNull: false,
    },
  }, {
    sequelize: instance,
    timestamps: true,
    createdAt: 'gmt_create',
    updatedAt: 'gmt_modified',
    freezeTableName: true,
    tableName: 'sandbox_applications',
    modelName: name,
  });

  return ApplicationModel;
}

providerWrapper([
  {
    id: 'applicationModel',
    provider: factory,
  },
]);
