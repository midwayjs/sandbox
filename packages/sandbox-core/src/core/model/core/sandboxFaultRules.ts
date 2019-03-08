import { providerWrapper, IApplicationContext } from 'midway-web';
import * as Sequelize from 'sequelize';
import { CoreDBDataSource } from '../../dataSource/core';

export async function factory(context: IApplicationContext) {
  const name = 'faultRules';
  const dataSource = await context.getAsync<CoreDBDataSource>('coreDB');
  const instance = dataSource.getInstance();

  /* tslint:disable:variable-name */
  const FaultRuleModel = instance.define(name, {
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
      type: Sequelize.INTEGER(4).UNSIGNED,
      allowNull: true,
      defaultValue: 0,
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
