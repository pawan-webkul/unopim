const { test, expect } = require('../../utils/fixtures');
const { expand } = require('../../utils/admin-routes');

/**
 * 500 guard: an authenticated admin hitting any parameterised admin GET route
 * with an id/slug that does not exist must get a clean 404/403/302/422 — never a
 * 5xx exception page. Read-only (GET) so it is safe on any environment.
 */
test.describe('Admin routes with non-existent ids never 500', () => {
  test.setTimeout(10 * 60 * 1000);

  test('GET with bad ids returns < 500 on every parameterised admin route', async ({ adminPage }) => {
    const offenders = [];
    const routes = expand({ methods: ['GET'] }).filter((r) => r.parameterised && !r.public);

    expect(routes.length).toBeGreaterThan(30);

    for (const r of routes) {
      for (const accept of ['text/html', 'application/json']) {
        const res = await adminPage.request.get(r.url, {
          maxRedirects: 0,
          failOnStatusCode: false,
          headers: { Accept: accept, 'X-Requested-With': 'XMLHttpRequest' },
          timeout: 60_000,
        });

        if (res.status() >= 500) offenders.push(`${res.status()} GET ${r.url} (Accept: ${accept})`);
      }
    }

    expect(offenders, `server errors on bad ids:\n${offenders.join('\n')}`).toEqual([]);
  });

  test('GET with a malformed (non-numeric / traversal / oversized) id never 500s', async ({ adminPage }) => {
    const offenders = [];
    const bad = ['abc', '-1', '0', '1e999', '%00', '..%2f..%2fetc%2fpasswd', 'a'.repeat(2000)];
    const routes = expand({ methods: ['GET'] })
      .filter((r) => r.parameterised && !r.public && /\/\{(id|[a-z]*_?id)\}/i.test(r.uri))
      .slice(0, 60);

    for (const r of routes) {
      for (const value of bad) {
        const url = r.uri.startsWith('admin') ? `/${r.uri}`.replace(/\{[^}]+\?\}/g, '').replace(/\{[^}]+\}/g, value) : r.url;
        const res = await adminPage.request.get(url, { maxRedirects: 0, failOnStatusCode: false, timeout: 60_000 }).catch(() => null);

        if (res && res.status() >= 500) offenders.push(`${res.status()} GET ${url.slice(0, 120)}`);
      }
    }

    expect(offenders, `server errors on malformed ids:\n${offenders.join('\n')}`).toEqual([]);
  });
});
