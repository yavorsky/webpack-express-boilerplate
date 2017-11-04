const browserslist = require('browserslist');
const path = require('path');
const fs = require('fs');
const { readTargetsFromConfig } = require('./env-bundles');

const getBundleStatistics = (root, browsers) => {
  if (!root) root = process.cwd();
  return browsers.map((query, id) => {
    const bundlesPath = path.join(root, 'dist', id.toString(), 'main.js');
    return fs.statSync(bundlesPath).size;
  });
};

const config = readTargetsFromConfig();
const stats = getBundleStatistics(null, config);

const readTargets = query => {
  const parsed = browserslist(query);
  return parsed.reduce((total, target) => {
    const [browser, version] = target.split(' ');
    total[browser] = parseFloat(version);
    return total;
  }, {});
};

const getBundleIdByUseragent = (useragent) => {
  const browser = useragent.browser.toLowerCase();
  const version = parseFloat(useragent.version);
  const bestBundle = config.reduce((best, current, id)  => {
    const bestSize = best ? best[1] : 0;
    const targets = readTargets(current);
    if (targets[browser] && (targets[browser] <= version || targets[browser] === 'all')) {
      const currBundleSize = stats[id];
      if (!bestSize || currBundleSize < bestSize) return [id, currBundleSize];
    }
    return best;
  }, null);
  if (bestBundle) {
    const bestBundleId = bestBundle[0];
    const bestBundleSize = bestBundle[1];
    console.log('FOUND BEST BUNDLE FOR', browser, version, 'with id: ', bestBundleId, 'and size: ', bestBundleSize);
    return bestBundleId.toString();
  }
  return null;
};

module.exports = {
  getBundleIdByUseragent
};
