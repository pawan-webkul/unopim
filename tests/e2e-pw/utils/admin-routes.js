'use strict';

/**
 * Helpers over fixtures/admin-routes.json (a snapshot of `php artisan route:list`
 * restricted to /admin). Regenerate the fixture when routes are added:
 *   php artisan route:list --json | jq '[.[]|select(.uri|startswith("admin"))
 *     |{methods:(.method|split("|")|map(select(.!="HEAD"))),uri,name,
 *       public:(.uri|test("^admin/(login|forget-password|reset-password|avatar|acl-version|logout)"))}]'
 */
const routes = require('../fixtures/admin-routes.json');

const NUMERIC_PARAM = /^(id|.*Id|.*_id|attempt|publication|product|structure|entity_id)$/;

/** Replace `{param}` segments with a value that cannot exist; drop optional `{param?}` segments. */
function fill(uri) {
  return `/${uri}`
    .replace(/\/\{[^}]+\?\}/g, '')
    .replace(/\{([^}]+)\}/g, (_, name) => (NUMERIC_PARAM.test(name) ? '999999999' : 'zz-nope'));
}

const hasParams = (uri) => /\{[^}]+\}/.test(uri.replace(/\/\{[^}]+\?\}/g, ''));

/** @returns {{method:string, uri:string, url:string, name:string, parameterised:boolean, public:boolean}[]} */
function expand({ methods } = {}) {
  const out = [];
  for (const r of routes) {
    for (const method of r.methods) {
      if (methods && !methods.includes(method)) continue;
      out.push({
        method,
        uri: r.uri,
        url: fill(r.uri),
        name: r.name,
        parameterised: hasParams(r.uri),
        public: r.public,
      });
    }
  }
  return out;
}

module.exports = { expand, fill };
