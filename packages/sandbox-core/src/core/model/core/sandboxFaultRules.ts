import { providerWrapper, IApplicationContext } from 'midway-web';
import * as Sequelize from 'sequelize';
import { CoreDBDataSource } from '../../dataSource/core';

export class FaultRuleModel extends Sequelize.Model {}

export async function factory(context: IApplicationContext) {
  const name = 'faultRules';
  const dataSource = await context.getAsync<CoreDBDataSource>('coreDB');
  const instance = dataSource.getInstance();

  FaultRuleModel.init({
    scope: {
      type: Sequelize.STRING(128),
      allowNull: false,
    },
    scopeName: {
      type: Sequelize.STRING(256),
      allowNull: false,
      field: 'scope_name',
    },
    relatedModule: {
      type: Sequelize.STRING(256),
      allowNull: false,
      field: 'related_module',
    },
    filterRule: {
      type: Sequelize.TEXT,
      allowNull: false,
      field: 'filter_rule',
    },
    faultRule: {
      type: Sequelize.TEXT,
      allowNull: false,
      field: 'fault_rule',
    },
    disabled: {
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
    tableName: 'sandbox_fault_rules',
  });

  return FaultRuleModel;
}

providerWrapper([
  {
    id: 'faultRuleModel',
    provider: factory,
  },
]);
