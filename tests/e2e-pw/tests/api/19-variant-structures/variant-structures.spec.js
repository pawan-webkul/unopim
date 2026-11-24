/**
 * Variant Structures API — /families/{code}/variant-structures CRUD, immutability, guards.
 * Uses the seeded `default` family and its select attributes (color, size) as axes.
 * Every created structure is reaped in afterAll.
 */
'use strict';

const { test, expect } = require('../../../fixtures/api-fixtures');
const { RESPONSE_TIME, REST_ROOT } = require('../../../utils/api/config');
const { get, post, put, patch, delete: del, deleteIfExists } = require('../../../utils/api/throttle-safe');
const {
  expectOk, expectStatus, expectResponseTimeUnder, expectSuccessEnvelope, expectUnauthorized, expectNotFound,
} = require('../../../utils/api/response-validator');

const FAMILY = 'default';
const base = (f = FAMILY) => `/families/${f}/variant-structures`;

test.describe('Variant Structures API', () => {
  const created = new Set();

  const body = (code, extra = {}) => ({
    code, name: `QA ${code}`, levels: 1, axes: { level_1: ['color'] }, ...extra,
  });

  test.afterAll(async ({ apiToken, playwright }) => {
    if (!apiToken) return;
    const ctx = await playwright.request.newContext({ baseURL: REST_ROOT });
    for (const code of created) await deleteIfExists(ctx, apiToken, `${base()}/${code}`);
    await ctx.dispose();
  });

  const make = async (api, code, extra) => {
    const r = await post(api, base(), { data: body(code, extra) });
    if (r.status === 201 || r.status === 200) created.add(code);
    return r;
  };

  test('19.1 - GET list returns 200 for a known family', async ({ api }) => {
    const r = await get(api, base());
    expectOk(r);
    expectResponseTimeUnder(r, RESPONSE_TIME.list);
  });

  test('19.2 - GET list for an unknown family returns 404', async ({ api }) => {
    expectNotFound(await get(api, base('no_such_family_xyz')));
  });

  test('19.3 - POST creates a 1-level structure and returns 201', async ({ api, uid }) => {
    const code = `vs_${uid}`;
    const r = await make(api, code);
    expectStatus(r, 201);
    expectSuccessEnvelope(r.body);
  });

  test('19.4 - GET detail returns the created structure', async ({ api, uid }) => {
    const code = `vs_${uid}`;
    expectStatus(await make(api, code), 201);
    const r = await get(api, `${base()}/${code}`);
    expectOk(r);
    expect(JSON.stringify(r.body)).toContain(code);
  });

  test('19.5 - GET detail of an unknown structure returns 404', async ({ api }) => {
    expectNotFound(await get(api, `${base()}/missing_structure_xyz`));
  });

  test('19.6 - POST with a duplicate code returns 422', async ({ api, uid }) => {
    const code = `vs_${uid}`;
    expectStatus(await make(api, code), 201);
    expectStatus(await post(api, base(), { data: body(code) }), 422);
  });

  test('19.7 - POST without required fields returns 422', async ({ api }) => {
    expectStatus(await post(api, base(), { data: {} }), 422);
  });

  test('19.8 - POST with levels outside 1..2 returns 422', async ({ api, uid }) => {
    expectStatus(await post(api, base(), { data: body(`vs_${uid}`, { levels: 3 }) }), 422);
  });

  test('19.9 - POST with an axis that is not a configurable attribute returns 422', async ({ api, uid }) => {
    const r = await post(api, base(), { data: body(`vs_${uid}`, { axes: { level_1: ['sku'] } }) });
    expectStatus(r, 422);
  });

  test('19.10 - POST with an unknown axis attribute returns 422', async ({ api, uid }) => {
    expectStatus(await post(api, base(), { data: body(`vs_${uid}`, { axes: { level_1: ['nope_xyz'] } }) }), 422);
  });

  test('19.11 - POST with level_2 axes on a 1-level structure returns 422', async ({ api, uid }) => {
    const r = await post(api, base(), { data: body(`vs_${uid}`, { axes: { level_1: ['color'], level_2: ['size'] } }) });
    expectStatus(r, 422);
  });

  test('19.12 - POST with the same axis on both levels returns 422', async ({ api, uid }) => {
    const r = await post(api, base(), { data: body(`vs_${uid}`, { levels: 2, axes: { level_1: ['color'], level_2: ['color'] } }) });
    expectStatus(r, 422);
  });

  test('19.13 - POST with an invalid code returns 422', async ({ api }) => {
    expectStatus(await post(api, base(), { data: body('Bad Code!') }), 422);
  });

  test('19.14 - POST with unknown axes keys returns 422', async ({ api, uid }) => {
    const r = await post(api, base(), { data: body(`vs_${uid}`, { axes: { level_1: ['color'], level_9: ['size'] } }) });
    expectStatus(r, 422);
  });

  test('19.15 - POST on an unknown family returns 404', async ({ api, uid }) => {
    expectNotFound(await post(api, base('no_such_family_xyz'), { data: body(`vs_${uid}`) }));
  });

  test('19.16 - PUT replaces the name', async ({ api, uid }) => {
    const code = `vs_${uid}`;
    expectStatus(await make(api, code), 201);
    const r = await put(api, `${base()}/${code}`, { data: { name: 'Renamed QA' } });
    expectOk(r);
    const d = await get(api, `${base()}/${code}`);
    expect(JSON.stringify(d.body)).toContain('Renamed QA');
  });

  test('19.17 - PATCH updates the name and keeps the axes', async ({ api, uid }) => {
    const code = `vs_${uid}`;
    expectStatus(await make(api, code), 201);
    expectOk(await patch(api, `${base()}/${code}`, { data: { name: 'Patched QA' } }));
    const d = await get(api, `${base()}/${code}`);
    expect(JSON.stringify(d.body)).toContain('Patched QA');
    expect(JSON.stringify(d.body)).toContain('color');
  });

  test('19.18 - PATCH changing the axes is rejected (immutable)', async ({ api, uid }) => {
    const code = `vs_${uid}`;
    expectStatus(await make(api, code), 201);
    const r = await patch(api, `${base()}/${code}`, { data: { axes: { level_1: ['size'] } } });
    expectStatus(r, 422);
  });

  test('19.19 - PATCH changing the levels is rejected (immutable)', async ({ api, uid }) => {
    const code = `vs_${uid}`;
    expectStatus(await make(api, code), 201);
    expectStatus(await patch(api, `${base()}/${code}`, { data: { levels: 2 } }), 422);
  });

  test('19.20 - PATCH echoing identical levels and axes is accepted', async ({ api, uid }) => {
    const code = `vs_${uid}`;
    expectStatus(await make(api, code), 201);
    expectOk(await patch(api, `${base()}/${code}`, { data: { levels: 1, axes: { level_1: ['color'] } } }));
  });

  test('19.21 - PATCH on an unknown structure returns 404', async ({ api }) => {
    expectNotFound(await patch(api, `${base()}/missing_structure_xyz`, { data: { name: 'x' } }));
  });

  test('19.22 - PUT with placements naming an unknown attribute returns 422', async ({ api, uid }) => {
    const code = `vs_${uid}`;
    expectStatus(await make(api, code), 201);
    const r = await put(api, `${base()}/${code}`, { data: { placements: { parent: ['nope_xyz'] } } });
    expectStatus(r, 422);
  });

  test('19.23 - PUT with placements using an axis attribute returns 422', async ({ api, uid }) => {
    const code = `vs_${uid}`;
    expectStatus(await make(api, code), 201);
    const r = await put(api, `${base()}/${code}`, { data: { placements: { parent: ['color'] } } });
    expectStatus(r, 422);
  });

  test('19.24 - DELETE removes the structure, then GET returns 404', async ({ api, uid }) => {
    const code = `vs_${uid}`;
    expectStatus(await make(api, code), 201);
    expectOk(await del(api, `${base()}/${code}`));
    created.delete(code);
    expectNotFound(await get(api, `${base()}/${code}`));
  });

  test('19.25 - DELETE an unknown structure returns 404', async ({ api }) => {
    expectNotFound(await del(api, `${base()}/missing_structure_xyz`));
  });

  test('19.26 - Same code may exist under another family is not blocked here (code scoped per family)', async ({ api, uid }) => {
    const code = `vs_${uid}`;
    expectStatus(await make(api, code), 201);
    // Different family does not see it
    const r = await get(api, `${base('no_such_family_xyz')}/${code}`);
    expectNotFound(r);
  });

  test('19.27 - Unauthenticated list/detail/create return 401', async ({ unauthedApi }) => {
    expectUnauthorized(await get(unauthedApi, base()));
    expectUnauthorized(await get(unauthedApi, `${base()}/any_code`));
    expectUnauthorized(await post(unauthedApi, base(), { data: body('vs_unauth') }));
  });
});
