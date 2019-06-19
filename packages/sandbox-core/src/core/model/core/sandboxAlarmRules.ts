import { providerWrapper, IApplicationContext } from 'midway-web';
import * as Sequelize from 'sequelize';
import { CoreDBDataSource } from '../../dataSource/core';

export class AlarmRuleModel extends Sequelize.Model {}

export async function factory(context: IApplicationContext) {
  const name = 'alarmRules';
  const dataSource = await context.getAsync<CoreDBDataSource>('coreDB');
  const instance = dataSource.getInstance();

  AlarmRuleModel.init({
    scope: {
      type: Sequelize.STRING(128),
      allowNull: false,
    },
    scopeName: {
      type: Sequelize.STRING(256),
      allowNull: false,
      field: 'scope_name',
    },
    ruleName: {
      type: Sequelize.STRING(256),
      allowNull: false,
      field: 'rule_name',
    },
    ruleType: {
      type: Sequelize.INTEGER({
        length: 4,
        unsigned: true,
      }),
      allowNull: true,
      defaultValue: 1,
      field: 'rule_type',
    },
    follower: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    creator: {
      type: Sequelize.STRING(128),
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    executeRule: {
      type: Sequelize.TEXT,
      allowNull: false,
      field: 'execute_rule',
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
    action: {
      type: Sequelize.STRING(128),
      allowNull: false,
    },
    actionParams: {
      type: Sequelize.TEXT,
      allowNull: true,
      field: 'action_params',
    },
  }, {
    sequelize: instance,
    timestamps: true,
    createdAt: 'gmt_create',
    updatedAt: 'gmt_modified',
    freezeTableName: true,
    tableName: 'sandbox_alarm_rules',
    modelName: name,
  });

  return AlarmRuleModel;
}

providerWrapper([
  {
    id: 'alarmRuleModel',
    provider: factory,
  },
]);
