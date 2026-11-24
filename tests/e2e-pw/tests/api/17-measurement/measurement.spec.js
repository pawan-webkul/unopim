/**
 * Measurement API — families, units and attribute-measurement lookups.
 * /measurement, /units/{family}, /attribute-measurement/* had no API coverage.
 * Test families are created with a unique code and removed in afterAll.
 */
'use strict';

const { test, expect } = require('../../../fixtures/api-fixtures');
const { RESPONSE_TIME, REST_ROOT } = require('../../../utils/api/config');
const { get, post, put, delete: del, deleteIfExists } = require('../../../utils/api/throttle-safe');
const {
  expectOk, expectStatus, expectResponseTimeUnder, expectUnauthorized, expectNotFound,
} = require('../../../utils/api/response-validator');

test.describe('Measurement API', () => {
  const created = new Set();

  const family = (code, over = {}) => ({
    code,
    name: `QA ${code}`,
    labels: { en_US: `QA ${code}` },
    standard_unit: 'QA_BASE',
    symbol: 'qb',
    units: [
      { code: 'QA_BASE', labels: { en_US: 'Base' }, symbol: 'qb' },
      { code: 'QA_DOUBLE', labels: { en_US: 'Double' }, symbol: 'qd', convert_from_standard: [{ operator: 'div', value: '2' }] },
    ],
    ...over,
  });

  test.afterAll(async ({ apiToken, playwright }) => {
    if (!apiToken) return;
    const ctx = await playwright.request.newContext({ baseURL: REST_ROOT });
    for (const code of created) await deleteIfExists(ctx, apiToken, `/measurement/${encodeURIComponent(code)}`);
    await ctx.dispose();
  });

  // ── Families: read ──────────────────────────────────────────────────────

  test('17.1 - GET /measurement lists families with units', async ({ api }) => {
    const result = await get(api, '/measurement');
    expectOk(result);
    expectResponseTimeUnder(result, RESPONSE_TIME.heavy);
    expect(result.body.success).toBe(true);
    expect(result.body.count).toBe(result.body.data.length);
    for (const f of result.body.data) {
      expect(f).toEqual(expect.objectContaining({
        code: expect.any(String), standard_unit: expect.any(String), units: expect.any(Array),
      }));
      expect(f.units.map((u) => u.code)).toContain(f.standard_unit);
    }
  });

  test('17.2 - GET /measurement/{code} returns one family', async ({ api }) => {
    const result = await get(api, '/measurement/Area');
    expectOk(result);
    expect(result.body.data.code).toBe('Area');
  });

  test('17.3 - Unknown family → 404 with success=false', async ({ api }) => {
    const result = await get(api, '/measurement/Nope_Zz');
    expectNotFound(result);
    expect(result.body.success).toBe(false);
  });

  test('17.4 - Unauthenticated access → 401 on every measurement route', async ({ unauthedApi }) => {
    expectUnauthorized(await get(unauthedApi, '/measurement'));
    expectUnauthorized(await get(unauthedApi, '/units/Area'));
    expectUnauthorized(await get(unauthedApi, '/attribute-measurement/Area'));
    expectUnauthorized(await post(unauthedApi, '/measurement', { data: family('qa_noauth') }));
  });

  // ── Families: write ─────────────────────────────────────────────────────

  test('17.5 - POST creates a family and the standard unit gets a 1:1 conversion', async ({ api, uid }) => {
    const code = `QA_${uid.replace(/[^A-Za-z0-9]/g, '')}`;
    const result = await post(api, '/measurement', { data: family(code) });
    expectStatus(result, 201);
    expect(result.body.success).toBe(true);
    created.add(code);

    const fetched = await get(api, `/measurement/${code}`);
    expectOk(fetched);
    const base = fetched.body.data.units.find((u) => u.code === 'QA_BASE');
    expect(Number(base.convert_from_standard[0].value)).toBe(1);
  });

  test('17.6 - Duplicate family code → 422', async ({ api, uid }) => {
    const code = `QA_${uid.replace(/[^A-Za-z0-9]/g, '')}`;
    expectStatus(await post(api, '/measurement', { data: family(code) }), 201);
    created.add(code);
    expectStatus(await post(api, '/measurement', { data: family(code) }), 422);
  });

  test('17.7 - Required fields enforced (empty body → 422, never 500)', async ({ api }) => {
    expectStatus(await post(api, '/measurement', { data: {} }), 422);
  });

  test('17.8 - standard_unit must be one of the supplied units → 422', async ({ api, uid }) => {
    const code = `QA_${uid.replace(/[^A-Za-z0-9]/g, '')}`;
    const result = await post(api, '/measurement', { data: family(code, { standard_unit: 'NOT_A_UNIT' }) });
    expectStatus(result, 422);
    expect((await get(api, `/measurement/${code}`)).status).toBe(404);
  });

  test('17.9 - Invalid code characters are rejected', async ({ api }) => {
    for (const bad of ['has space', 'semi;colon', '<b>x</b>', 'a-b']) {
      expectStatus(await post(api, '/measurement', { data: family(bad, { standard_unit: 'QA_BASE' }) }), 422);
    }
  });

  test('17.10 - Empty units array → 422', async ({ api, uid }) => {
    expectStatus(await post(api, '/measurement', { data: family(`QA_${uid.replace(/[^A-Za-z0-9]/g, '')}`, { units: [] }) }), 422);
  });

  test('17.11 - PUT updates the family name', async ({ api, uid }) => {
    const code = `QA_${uid.replace(/[^A-Za-z0-9]/g, '')}`;
    expectStatus(await post(api, '/measurement', { data: family(code) }), 201);
    created.add(code);
    expectOk(await put(api, `/measurement/${code}`, { data: { name: 'Renamed QA', labels: { en_US: 'Renamed QA' } } }));
    expect((await get(api, `/measurement/${code}`)).body.data.name).toBe('Renamed QA');
  });

  test('17.12 - PUT unknown family → 404; DELETE unknown family → 404', async ({ api }) => {
    expectNotFound(await put(api, '/measurement/Nope_Zz', { data: { name: 'x' } }));
    expectNotFound(await del(api, '/measurement/Nope_Zz'));
  });

  test('17.13 - DELETE removes a family', async ({ api, uid }) => {
    const code = `QA_${uid.replace(/[^A-Za-z0-9]/g, '')}`;
    expectStatus(await post(api, '/measurement', { data: family(code) }), 201);
    expectOk(await del(api, `/measurement/${code}`));
    expectNotFound(await get(api, `/measurement/${code}`));
  });

  // ── Units ───────────────────────────────────────────────────────────────

  test('17.14 - GET /units/{family} lists units with conversion data', async ({ api }) => {
    const result = await get(api, '/units/Area');
    expectOk(result);
    expect(result.body.count).toBe(result.body.data.length);
    for (const u of result.body.data) {
      expect(u).toEqual(expect.objectContaining({ code: expect.any(String), labels: expect.any(Object) }));
    }
  });

  test('17.15 - GET /units on an unknown family → 404', async ({ api }) => {
    expectNotFound(await get(api, '/units/Nope_Zz'));
  });

  test('17.16 - Unit CRUD inside a test family', async ({ api, uid }) => {
    const code = `QA_${uid.replace(/[^A-Za-z0-9]/g, '')}`;
    expectStatus(await post(api, '/measurement', { data: family(code) }), 201);
    created.add(code);

    const add = await post(api, `/units/${code}`, {
      data: { code: 'QA_TRIPLE', labels: { en_US: 'Triple' }, symbol: 'qt', convert_from_standard: ['div'], convert_value: ['3'] },
    });
    expect(add.status).toBeLessThan(300);

    const one = await get(api, `/units/${code}/QA_TRIPLE`);
    expectOk(one);
    expect(one.body.data.code).toBe('QA_TRIPLE');

    expectOk(await put(api, `/units/${code}/QA_TRIPLE`, { data: { symbol: 'q3', labels: { en_US: 'Triple' } } }));
    expect((await get(api, `/units/${code}/QA_TRIPLE`)).body.data.symbol).toBe('q3');

    expectOk(await del(api, `/units/${code}/QA_TRIPLE`));
    expectNotFound(await get(api, `/units/${code}/QA_TRIPLE`));
  });

  test('17.17 - Unit validation: bad operator, non-numeric value, bad code → 422', async ({ api, uid }) => {
    const code = `QA_${uid.replace(/[^A-Za-z0-9]/g, '')}`;
    expectStatus(await post(api, '/measurement', { data: family(code) }), 201);
    created.add(code);
    expectStatus(await post(api, `/units/${code}`, { data: { code: 'U1', labels: { en_US: 'x' }, convert_from_standard: ['pow'], convert_value: ['2'] } }), 422);
    expectStatus(await post(api, `/units/${code}`, { data: { code: 'U2', labels: { en_US: 'x' }, convert_from_standard: ['mul'], convert_value: ['abc'] } }), 422);
    expectStatus(await post(api, `/units/${code}`, { data: { code: 'bad code!', labels: { en_US: 'x' } } }), 422);
  });

  test('17.18 - Unit routes on unknown family/unit → 404', async ({ api }) => {
    expectNotFound(await get(api, '/units/Area/NOPE_UNIT'));
    expectNotFound(await put(api, '/units/Area/NOPE_UNIT', { data: { symbol: 'x' } }));
    expectNotFound(await del(api, '/units/Nope_Zz/NOPE_UNIT'));
  });

  // ── Attribute measurement ───────────────────────────────────────────────

  test('17.19 - GET /attribute-measurement/{family} returns that family\'s units', async ({ api }) => {
    const result = await get(api, '/attribute-measurement/Area');
    expectOk(result);
    expect(result.body.success).toBe(true);
    expect(result.body.data.length).toBeGreaterThan(0);
  });

  test('17.20 - Unknown family on attribute-measurement returns an empty list, not 500', async ({ api }) => {
    const result = await get(api, '/attribute-measurement/Nope_Zz');
    expectOk(result);
    expect(result.body.count).toBe(0);
  });

  test('17.21 - GET /attribute-measurement/config/{attribute} unknown attribute → 404', async ({ api }) => {
    const result = await get(api, '/attribute-measurement/config/does_not_exist_zz');
    expectNotFound(result);
    expect(result.body.success).toBe(false);
  });
});
