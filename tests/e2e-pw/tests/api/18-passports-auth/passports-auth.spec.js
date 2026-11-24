/**
 * Product Passport API — auth and input guards only.
 * The publish flow needs a licensed/configured passport setup, so these specs
 * assert what must hold on every install: the routes are protected, and bad
 * identifiers never produce a 5xx.
 */
'use strict';

const { test, expect } = require('../../../fixtures/api-fixtures');
const { get, post } = require('../../../utils/api/throttle-safe');
const { expectUnauthorized } = require('../../../utils/api/response-validator');

test.describe('Passports API — guards', () => {
  test('18.1 - Every passport route rejects unauthenticated calls with 401', async ({ unauthedApi }) => {
    expectUnauthorized(await get(unauthedApi, '/passports'));
    expectUnauthorized(await get(unauthedApi, '/passports/SKU-1'));
    expectUnauthorized(await post(unauthedApi, '/passports/publish/SKU-1'));
    expectUnauthorized(await post(unauthedApi, '/passports/withdraw/1'));
    expectUnauthorized(await post(unauthedApi, '/passports/reinstate/1'));
    expectUnauthorized(await post(unauthedApi, '/passports/redact/1'));
  });

  test('18.2 - Unknown SKU/ids never return 5xx', async ({ api }) => {
    for (const result of [
      await get(api, '/passports/does-not-exist-zz'),
      await post(api, '/passports/publish/does-not-exist-zz'),
      await post(api, '/passports/withdraw/99999999'),
      await post(api, '/passports/reinstate/99999999'),
      await post(api, '/passports/redact/99999999'),
    ]) {
      expect(result.status, `${result.method} ${result.url}`).toBeGreaterThanOrEqual(400);
      expect(result.status, `${result.method} ${result.url}`).toBeLessThan(500);
    }
  });

  test('18.3 - Non-numeric id on withdraw/reinstate/redact is not routed (404, not 500)', async ({ api }) => {
    for (const action of ['withdraw', 'reinstate', 'redact']) {
      const result = await post(api, `/passports/${action}/abc`);
      expect(result.status, action).toBe(404);
    }
  });

  test('18.4 - Error responses do not leak server paths or stack traces', async ({ api }) => {
    // Laravel returns traces by design when APP_DEBUG=true. Only meaningful against a production-mode target.
    test.skip(process.env.PW_APP_DEBUG_OFF !== '1', 'Set PW_APP_DEBUG_OFF=1 when the target runs with APP_DEBUG=false');
    const result = await get(api, '/passports/does-not-exist-zz');
    const text = typeof result.body === 'string' ? result.body : JSON.stringify(result.body);
    expect(text).not.toContain('/vendor/laravel');
    expect(text).not.toContain('"trace"');
  });
});
