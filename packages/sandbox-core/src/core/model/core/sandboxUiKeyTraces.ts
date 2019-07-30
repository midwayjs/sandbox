import { providerWrapper, IApplicationContext } from 'midway-web';
import * as Sequelize from 'sequelize';
import { CoreDBDataSource } from '../../dataSource/core';

export class UiKeyTraceModel extends Sequelize.Model {}

export async function factory(context: IApplicationContext) {
  const name = 'uiKeyTraces';
  const dataSource = await context.getAsync<CoreDBDataSource>('coreDB');
  const instance = dataSource.getInstance();

  UiKeyTraceModel.init({
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
      type: Sequelize.INTEGER({
        length: 4,
        unsigned: true,
      }),
      allowNull: true,
      defaultValue: 1,
    },
    deleted: {
      type: Sequelize.INTEGER({
        length: 4,
        unsigned: true,
      }),
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
    sequelize: instance,
    modelName: name,
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
