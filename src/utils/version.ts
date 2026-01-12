// @ts-nocheck
export const getCurrentVersion = () => {
  const packageJson = require('../../package.json');
  return packageJson.version;
};