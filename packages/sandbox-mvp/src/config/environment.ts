const dev = {
  name: 'dev',
  humanReadableName: '开发环境'
};
const prod = {
  name: 'prod',
  humanReadableName: '生产环境'
};
export const defaultEnv = dev;
export const envSchemas = {
  dev,
  prod
};
export const envSchemasOrderly = [
  dev,
  prod
];
