import { providerWrapper, IApplicationContext } from 'midway-mirror';
import * as Sequelize from 'sequelize';
import { CoreDBDataSource } from '../../dataSource/core';

export async function factory(context: IApplicationContext) {
  const name = 'groups';
  const dataSource = await context.getAsync<CoreDBDataSource>('coreDB');
  const instance = dataSource.getInstance();

  /* tslint:disable:variable-name */
  const GroupModel = instance.define(name, {
    scope: {
      type: Sequelize.STRING(128),
      allowNull: false,
    },
    scopeName: {
      type: Sequelize.STRING(256),
      allowNull: false,
      field: 'scope_name',
    },
    groupName: {
      type: Sequelize.STRING(128),
      allowNull: false,
      field: 'group_name',
    },
    hostList: {
      type: Sequelize.TEXT,
      allowNull: true,
      field: 'host_list',
    },
    deleted: {
      type: Sequelize.INTEGER(4).UNSIGNED,
      allowNull: true,
      defaultValue: 0,
    },
    gmtCreate: {
      type: Sequelize.DATE,
      allowNull: true,
      field: 'gmt_create',
    },
    gmtModified: {
      type: Sequelize.DATE,
      allowNull: true,
      field: 'gmt_modified',
    },
    hash: {
      type: Sequelize.STRING(128),
      allowNull: false,
    },
  }, {
    timestamps: true,
    createdAt: 'gmt_create',
    updatedAt: 'gmt_modified',
    freezeTableName: true,
    tableName: 'sandbox_groups',
    indexes: [
      {
        unique: true,
        fields: ['hash'],
      },
    ],
  });

  return GroupModel;
}

providerWrapper([
  {
    id: 'groupModel',
    provider: factory,
  },
]);
