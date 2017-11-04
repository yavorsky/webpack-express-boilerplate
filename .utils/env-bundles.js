const fs = require('fs');
const path = require('path');

const BROWSERS_CONFIG_NAME = '.browsers.json';

const readTargetsFromConfig = (root) => {
  if (!root) root = process.cwd();
  const pathname = path.join(root, BROWSERS_CONFIG_NAME);
  const config = fs.readFileSync(pathname);
  const targets = JSON.parse(config);
  return targets;
};

const mapConfigToTargets = (fn, opts = {}) => {
  const parsedTargets = readTargetsFromConfig(opts.root || process.cwd());
  return parsedTargets.map((browsers, id) => {
    return fn({ browsers, id: id.toString() });
  });
};

module.exports.mapConfigToTargets = mapConfigToTargets;
module.exports.readTargetsFromConfig = readTargetsFromConfig;
