import { providerWrapper, IApplicationContext } from 'midway-web';
import * as Sequelize from 'sequelize';
import { CoreDBDataSource } from '../../dataSource/core';

export async function factory(context: IApplicationContext) {
  const name = 'applications';
  const dataSource = await context.getAsync<CoreDBDataSource>('coreDB');
  const instance = dataSource.getInstance();

  /* tslint:disable:variable-name */
  const ApplicationModel = instance.define(name, {
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
      type: Sequelize.INTEGER(4).UNSIGNED,
      allowNull: true,
      defaultValue: 0,
    },
    state: {
      type: Sequelize.INTEGER(4).UNSIGNED,
      allowNull: false,
    },
  }, {
    timestamps: true,
    createdAt: 'gmt_create',
    updatedAt: 'gmt_modified',
    freezeTableName: true,
    tableName: 'sandbox_applications',
  });

  return ApplicationModel;
}

providerWrapper([
  {
    id: 'applicationModel',
    provider: factory,
  },
]);
