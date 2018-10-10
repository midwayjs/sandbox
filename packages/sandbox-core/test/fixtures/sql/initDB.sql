CREATE DATABASE IF NOT EXISTS sandbox;

CREATE TABLE `sandbox`.`sandbox_galaxy_sls_traces` (
`timestamp` datetime NOT NULL COMMENT '时间分表字段',
`scope` varchar(128) NOT NULL COMMENT '应用域 lookup',
`scope_name` varchar(256) NOT NULL COMMENT '应用名称 lookup',
`env` varchar(128) NOT NULL COMMENT '环境 lookup',
`hostname` varchar(512) NOT NULL COMMENT '机器名 filter',
`ip` varchar(512) NOT NULL COMMENT 'IP filter',
`uuid` varchar(256) NOT NULL COMMENT '链路唯一 ID filter',
`trace_id` varchar(256) DEFAULT NULL COMMENT '?? ID filter',
`version` int(11) DEFAULT NULL COMMENT '??????',
`trace_spans` mediumtext,
`unix_timestamp` bigint(20) DEFAULT NULL,
`trace_duration` int(11) DEFAULT NULL,
`pid` varchar(256) DEFAULT NULL,
`trace_name` text,
`trace_status` int(11) DEFAULT '1'
) ENGINE=innoDB DEFAULT CHARSET=utf8mb4 COMMENT='sls 采集的 trace log';


CREATE TABLE `sandbox`.`sandbox_galaxy_sls_trace_nodes` (
  `timestamp` datetime NOT NULL COMMENT '时间分表字段',
  `scope` varchar(128) NOT NULL COMMENT '应用域 lookup',
  `scope_name` varchar(256) NOT NULL COMMENT '应用名称 lookup',
  `env` varchar(128) NOT NULL COMMENT '环境 lookup',
  `hostname` varchar(512) NOT NULL COMMENT '机器名 filter',
  `ip` varchar(512) NOT NULL COMMENT 'ip filter',
  `uuid` varchar(256) NOT NULL COMMENT '链路唯一 ID filter',
  `span_name` varchar(512) DEFAULT NULL COMMENT '???? filter',
  `span_duration` int(11) DEFAULT NULL COMMENT '???? ms',
  `span_type` int(11) DEFAULT NULL COMMENT '?? RPC ??',
  `span_tags` mediumtext COMMENT '?? tags filter',
  `span_id` varchar(128) DEFAULT NULL COMMENT '?? ID filter',
  `span_rpcid` varchar(128) DEFAULT NULL COMMENT '?? RPC ID filter',
  `span_code` varchar(128) DEFAULT NULL,
  `span_error` tinyint(4) DEFAULT '0',
  `span_method` varchar(128) DEFAULT NULL,
  `span_timestamp` varchar(128) DEFAULT NULL,
  `pid` varchar(256) DEFAULT NULL,
  `trace_id` varchar(256) DEFAULT NULL,
  `trace_name` text,
  `span_target` mediumtext
) ENGINE=innoDB DEFAULT CHARSET=utf8mb4 COMMENT='sls 采集的链路数据，分结点后';

CREATE TABLE `sandbox`.`sandbox_galaxy_sls_errors` (
`timestamp` datetime NOT NULL COMMENT '时间分表字段',
`scope` varchar(128) NOT NULL COMMENT '应用域 lookup',
`scope_name` varchar(256) NOT NULL COMMENT '应用名称 lookup',
`env` varchar(128) NOT NULL COMMENT '应用环境 lookup',
`hostname` varchar(512) NOT NULL COMMENT '机器名 filter',
`ip` varchar(512) NOT NULL COMMENT 'ip filter',
`uuid` varchar(256) NOT NULL COMMENT '日志唯一ID filter',
`error_type` varchar(512) DEFAULT NULL COMMENT '???? filter',
`error_stack` mediumtext COMMENT '???? filter',
`unix_timestamp` bigint(20) DEFAULT NULL COMMENT 'unix?????',
`log_path` mediumtext COMMENT '???? filter',
`error_message` mediumtext,
`version` int(11) DEFAULT NULL,
`trace_id` varchar(256) DEFAULT NULL,
`pid` varchar(256) DEFAULT NULL
) ENGINE=innoDB DEFAULT CHARSET=utf8mb4 COMMENT='sls 采集的错误日志';

CREATE TABLE `sandbox`.`sandbox_applications` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `gmt_create` datetime NOT NULL COMMENT '创建时间',
  `gmt_modified` datetime NOT NULL COMMENT '修改时间',
  `scope` varchar(128) NOT NULL COMMENT '应用域',
  `scope_name` varchar(256) NOT NULL COMMENT '应用名称',
  `scope_id` bigint(20) unsigned DEFAULT NULL COMMENT '应用 ID',
  `description` text COMMENT '应用描述',
  `bu` varchar(256) DEFAULT NULL COMMENT '应用所属 BU',
  `owner` varchar(128) NOT NULL COMMENT '应用负责人',
  `appops` text COMMENT '应用相关人员',
  `alinode_id` varchar(256) DEFAULT NULL COMMENT 'alinode 应用 id',
  `alinode_token` varchar(256) DEFAULT NULL COMMENT 'alinode 应用 token',
  `flag` int(10) unsigned DEFAULT '0' COMMENT '状态标识',
  `deleted` tinyint(3) unsigned DEFAULT '0' COMMENT '是否删除',
  `state` int(10) unsigned DEFAULT NULL COMMENT '状态记录',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1985 DEFAULT CHARSET=utf8mb4 COMMENT='sandbox v2 应用表';

CREATE TABLE `sandbox`.`sandbox_groups` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `gmt_create` datetime NOT NULL COMMENT '创建时间',
  `gmt_modified` datetime NOT NULL COMMENT '修改时间',
  `scope` varchar(128) NOT NULL COMMENT '应用域',
  `scope_name` varchar(256) NOT NULL COMMENT '应用名称',
  `group_name` varchar(128) NOT NULL COMMENT '分组名称',
  `host_list` text COMMENT '机器列表, ip, hostname',
  `deleted` tinyint(3) unsigned DEFAULT '0' COMMENT '是否删除',
  `hash` varchar(128) NOT NULL COMMENT 'md5(scope|scope_name|group_name) 标识唯一',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_hash` (`hash`(36)) COMMENT 'hash 唯一'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='sandbox v2 应用自定义分组';


CREATE TABLE `sandbox`.`sandbox_ui_key_traces` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `gmt_create` datetime NOT NULL COMMENT '创建时间',
  `gmt_modified` datetime NOT NULL COMMENT '修改时间',
  `scope` varchar(128) NOT NULL COMMENT '应用域',
  `scope_name` varchar(256) NOT NULL COMMENT '应用名称',
  `trace_name` varchar(2048) NOT NULL COMMENT '链路名称',
  `focus` tinyint(3) unsigned DEFAULT '1' COMMENT '是否置顶',
  `deleted` tinyint(3) unsigned DEFAULT '0' COMMENT '是否删除',
  `hash` varchar(128) NOT NULL COMMENT 'md5(scope|scope_name|trace_name) 标识唯一',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_md5` (`hash`(36)) COMMENT 'md5 标识链路唯一'
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8mb4 COMMENT='sandbox v2 关键链路';

CREATE TABLE `sandbox`.`sandbox_ui_key_metrics` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `gmt_create` datetime NOT NULL COMMENT '创建时间',
  `gmt_modified` datetime NOT NULL COMMENT '修改时间',
  `scope` varchar(128) NOT NULL COMMENT '应用域',
  `scope_name` varchar(256) NOT NULL COMMENT '应用名称',
  `config` text NOT NULL COMMENT '配置',
  `deleted` tinyint(3) unsigned DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='sandbox v2 应用关键指标';

CREATE TABLE `sandbox`.`sandbox_ui_dashboards` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `gmt_create` datetime NOT NULL COMMENT '创建时间',
  `gmt_modified` datetime NOT NULL COMMENT '修改时间',
  `scope` varchar(128) NOT NULL COMMENT '应用域',
  `scope_name` varchar(256) NOT NULL COMMENT '应用名称',
  `dashboard_name` varchar(256) NOT NULL COMMENT '大盘名称',
  `target` tinyint(3) unsigned DEFAULT '1' COMMENT '大盘适配目标，集群：1，机器：2',
  `config` text NOT NULL COMMENT '大盘配置',
  `deleted` tinyint(3) unsigned DEFAULT '0' COMMENT '是否删除',
  `focus` tinyint(3) unsigned DEFAULT '0' COMMENT '是否置顶',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='sandbox v2 大盘';

CREATE TABLE `sandbox`.`sandbox_fault_rules` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `gmt_create` datetime NOT NULL COMMENT '创建时间',
  `gmt_modified` datetime NOT NULL COMMENT '修改时间',
  `scope` varchar(128) NOT NULL COMMENT '应用域',
  `scope_name` varchar(256) NOT NULL COMMENT '应用名称',
  `related_module` varchar(256) NOT NULL COMMENT '相关模块',
  `filter_rule` text NOT NULL COMMENT '过滤规则',
  `fault_rule` text NOT NULL COMMENT '故障逻辑，包含故障类型和值',
  `disabled` tinyint(3) unsigned DEFAULT '0' COMMENT '是否禁用',
  `deleted` tinyint(3) unsigned DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='sandbox v2 故障规则';