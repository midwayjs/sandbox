import { providerWrapper, IApplicationContext } from 'midway-web';
import * as Sequelize from 'sequelize';
import { CoreDBDataSource } from '../../dataSource/core';

export async function factory(context: IApplicationContext) {
  const name = 'uiKeyTraces';
  const dataSource = await context.getAsync<CoreDBDataSource>('coreDB');
  const instance = dataSource.getInstance();

  /* tslint:disable:variable-name */
  const UiKeyTraceModel = instance.define(name, {
    scope: {
      type: Sequelize.STRING(128),
      allowNull: false,
    },
    scopeName: {
      type: Sequelize.STRING(256),
      allowNull: false,
      field: 'scope_name',
    },
    traceName: {
      type: Sequelize.STRING(1024),
      allowNull: false,
      field: 'trace_name',
    },
    focus: {
      type: Sequelize.INTEGER(4).UNSIGNED,
      allowNull: true,
      defaultValue: 1,
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
    tableName: 'sandbox_ui_key_traces',
    indexes: [
      {
        unique: true,
        fields: ['hash'],
      },
    ],
  });

  return UiKeyTraceModel;
}

providerWrapper([
  {
    id: 'keyTraceModel',
    provider: factory,
  },
]);
