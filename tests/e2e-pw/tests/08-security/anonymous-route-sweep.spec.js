const { test, expect } = require('@playwright/test');
const { expand } = require('../../utils/admin-routes');

/**
 * Every admin route (GET and state-changing) must refuse an anonymous caller:
 * a redirect to the login page or 401/403/404/405/419 — never a 200 page or a
 * 5xx. Route list: fixtures/admin-routes.json.
 */
const REFUSED = [301, 302, 303, 307, 308, 401, 403, 404, 405, 419];

test.describe('Anonymous access to admin routes', () => {
  test.setTimeout(10 * 60 * 1000);

  let anon;

  test.beforeAll(async ({ playwright, baseURL }) => {
    anon = await playwright.request.newContext({ baseURL, storageState: { cookies: [], origins: [] } });
  });

  test.afterAll(async () => { await anon?.dispose(); });

  async function sweep(method) {
    const offenders = [];
    const routes = expand({ methods: [method] }).filter((r) => !r.public);

    for (const r of routes) {
      const res = await anon.fetch(r.url, {
        method,
        maxRedirects: 0,
        failOnStatusCode: false,
        headers: { Accept: 'text/html' },
        data: method === 'GET' ? undefined : {},
        timeout: 60_000,
      });
      const status = res.status();
      const location = res.headers().location || '';
      const ok = REFUSED.includes(status) && (status < 300 || status >= 400 || /login/i.test(location));

      if (!ok) offenders.push(`${status} ${method} ${r.url}${location ? ` -> ${location}` : ''}`);
    }

    return { count: routes.length, offenders };
  }

  test('GET: anonymous callers are redirected to login or refused on every admin route', async () => {
    const { count, offenders } = await sweep('GET');
    expect(count).toBeGreaterThan(100);
    expect(offenders, `anonymous GET reached:\n${offenders.join('\n')}`).toEqual([]);
  });

  test('POST/PUT/PATCH/DELETE: anonymous writes are refused on every admin route', async () => {
    const offenders = [];
    let count = 0;

    for (const method of ['POST', 'PUT', 'PATCH', 'DELETE']) {
      const r = await sweep(method);
      count += r.count;
      offenders.push(...r.offenders);
    }

    expect(count).toBeGreaterThan(50);
    expect(offenders, `anonymous writes reached:\n${offenders.join('\n')}`).toEqual([]);
  });

  test('public auth pages stay reachable and never 5xx', async () => {
    for (const url of ['/admin/login', '/admin/forget-password', '/admin/reset-password/zz-nope']) {
      const res = await anon.get(url, { maxRedirects: 0, failOnStatusCode: false });
      expect(res.status(), url).toBeLessThan(500);
    }
  });
});
