const { PERCY_TOKEN } = process.env;

let percySnapshot;
if (PERCY_TOKEN) {
  const { percySnapshot: pSnapshot } = require('@percy/playwright');
  percySnapshot = pSnapshot;
} else {
  percySnapshot = async () => {};
}

module.exports = { percySnapshot };
