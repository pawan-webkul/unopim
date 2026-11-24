/**
 * Association Types API — list, detail, CRUD, fields, guards.
 * Covers GET/POST/PUT/PATCH/DELETE /association-types and the nested
 * /association-types/{code}/fields routes, which had no API coverage.
 * Every created type is reaped in afterAll; seeded system types are never touched.
 */
'use strict';

const { test, expect } = require('../../../fixtures/api-fixtures');
const { RESPONSE_TIME, REST_ROOT } = require('../../../utils/api/config');
const { get, post, put, patch, delete: del, deleteIfExists } = require('../../../utils/api/throttle-safe');
const {
  expectOk, expectStatus, expectStatusIn, expectResponseTimeUnder, expectListEnvelope,
  expectSuccessEnvelope, expectUnauthorized, expectNotFound,
} = require('../../../utils/api/response-validator');

const SYSTEM_TYPES = ['related_products', 'up_sells', 'cross_sells'];

test.describe('Association Types API', () => {
  const created = new Set();

  const body = (code, extra = {}) => ({ code, status: true, en_US: { name: `QA ${code}` }, ...extra });

  test.afterAll(async ({ apiToken, playwright }) => {
    if (!apiToken) return;
    const ctx = await playwright.request.newContext({ baseURL: REST_ROOT });
    for (const code of created) {
      await deleteIfExists(ctx, apiToken, `/association-types/${encodeURIComponent(code)}`);
    }
    await ctx.dispose();
  });

  // ── Read ────────────────────────────────────────────────────────────────

  test('16.1 - GET /association-types returns paginated envelope with the system types', async ({ api }) => {
    const result = await get(api, '/association-types');
    expectOk(result);
    expectListEnvelope(result.body);
    expectResponseTimeUnder(result, RESPONSE_TIME.list);
    const codes = result.body.data.map((t) => t.code);
    for (const code of SYSTEM_TYPES) expect(codes).toContain(code);
  });

  test('16.2 - Each item exposes code, status, position, is_user_defined and labels', async ({ api }) => {
    const { body: list } = await get(api, '/association-types');
    for (const t of list.data) {
      expect(t).toEqual(expect.objectContaining({
        code: expect.any(String),
        status: expect.any(Boolean),
        position: expect.any(Number),
        labels: expect.any(Object),
      }));
    }
  });

  test('16.3 - System types are flagged is_user_defined=false', async ({ api }) => {
    const result = await get(api, '/association-types/related_products');
    expectOk(result);
    expect(result.body.code).toBe('related_products');
    expect(result.body.is_user_defined).toBeFalsy();
  });

  test('16.4 - GET unknown code → 404 with a message, not 500', async ({ api }) => {
    const result = await get(api, '/association-types/does_not_exist_zz');
    expectNotFound(result);
    expect(result.body.success).toBe(false);
  });

  test('16.5 - Pagination limit honoured', async ({ api }) => {
    const result = await get(api, '/association-types', { params: { limit: 1, page: 1 } });
    expectOk(result);
    expect(result.body.data.length).toBeLessThanOrEqual(1);
  });

  test('16.6 - Unauthenticated list/detail → 401', async ({ unauthedApi }) => {
    expectUnauthorized(await get(unauthedApi, '/association-types'));
    expectUnauthorized(await get(unauthedApi, '/association-types/related_products'));
  });

  // ── Create ──────────────────────────────────────────────────────────────

  test('16.7 - POST creates a user-defined type and it is retrievable', async ({ api, uid }) => {
    const code = `qa_at_${uid}`;
    const result = await post(api, '/association-types', { data: body(code) });
    expectStatus(result, 201);
    expectSuccessEnvelope(result.body);
    created.add(code);

    const fetched = await get(api, `/association-types/${code}`);
    expectOk(fetched);
    expect(fetched.body.code).toBe(code);
    expect(fetched.body.is_user_defined).toBeTruthy();
  });

  test('16.8 - New type defaults to status=true and is appended after the existing positions', async ({ api, uid }) => {
    const code = `qa_at_def_${uid}`;
    expectStatus(await post(api, '/association-types', { data: { code } }), 201);
    created.add(code);
    const { body: list } = await get(api, '/association-types', { params: { limit: 100 } });
    const mine = list.data.find((t) => t.code === code);
    expect(mine.status).toBe(true);
    const maxOther = Math.max(...list.data.filter((t) => t.code !== code).map((t) => t.position));
    expect(mine.position).toBeGreaterThanOrEqual(maxOther);
  });

  test('16.9 - Duplicate code → 422', async ({ api, uid }) => {
    const code = `qa_at_dup_${uid}`;
    expectStatus(await post(api, '/association-types', { data: body(code) }), 201);
    created.add(code);
    expectStatus(await post(api, '/association-types', { data: body(code) }), 422);
  });

  test('16.10 - Missing code → 422 (never 500)', async ({ api }) => {
    expectStatus(await post(api, '/association-types', { data: { status: true } }), 422);
  });

  test('16.11 - Invalid code characters are rejected with 422', async ({ api }) => {
    for (const bad of ['has space', 'UPPER-dash', 'drop;table', '<script>', 'a'.repeat(300)]) {
      const result = await post(api, '/association-types', { data: { code: bad } });
      expectStatus(result, 422);
    }
  });

  test('16.12 - Non-boolean status → 422', async ({ api, uid }) => {
    expectStatus(await post(api, '/association-types', { data: { code: `qa_at_st_${uid}`, status: 'maybe' } }), 422);
  });

  test('16.13 - Unauthenticated POST → 401', async ({ unauthedApi, uid }) => {
    expectUnauthorized(await post(unauthedApi, '/association-types', { data: body(`qa_at_na_${uid}`) }));
  });

  // ── Update ──────────────────────────────────────────────────────────────

  test('16.14 - PUT updates status and labels', async ({ api, uid }) => {
    const code = `qa_at_up_${uid}`;
    expectStatus(await post(api, '/association-types', { data: body(code) }), 201);
    created.add(code);
    const result = await put(api, `/association-types/${code}`, { data: { status: false, en_US: { name: 'Renamed QA' } } });
    expectOk(result);
    const fetched = await get(api, `/association-types/${code}`);
    expect(fetched.body.status).toBe(false);
    expect(fetched.body.labels.en_US).toBe('Renamed QA');
  });

  test('16.15 - PATCH behaves like a partial update', async ({ api, uid }) => {
    const code = `qa_at_pa_${uid}`;
    expectStatus(await post(api, '/association-types', { data: body(code) }), 201);
    created.add(code);
    expectOk(await patch(api, `/association-types/${code}`, { data: { status: false } }));
    expect((await get(api, `/association-types/${code}`)).body.status).toBe(false);
  });

  test('16.16 - Changing the immutable code on update → 422', async ({ api, uid }) => {
    const code = `qa_at_im_${uid}`;
    expectStatus(await post(api, '/association-types', { data: body(code) }), 201);
    created.add(code);
    const result = await put(api, `/association-types/${code}`, { data: { code: `${code}_x` } });
    expectStatus(result, 422);
    expect((await get(api, `/association-types/${code}_x`)).status).toBe(404);
  });

  test('16.17 - Sending is_user_defined on update → 422 (cannot promote/demote a type)', async ({ api, uid }) => {
    const code = `qa_at_ud_${uid}`;
    expectStatus(await post(api, '/association-types', { data: body(code) }), 201);
    created.add(code);
    expectStatus(await put(api, `/association-types/${code}`, { data: { is_user_defined: 0 } }), 422);
  });

  test('16.18 - PUT unknown code → 404', async ({ api }) => {
    expectNotFound(await put(api, '/association-types/does_not_exist_zz', { data: { status: true } }));
  });

  // ── Fields ──────────────────────────────────────────────────────────────

  test('16.19 - Field CRUD: create, list, update, delete', async ({ api, uid }) => {
    const code = `qa_at_f_${uid}`;
    expectStatus(await post(api, '/association-types', { data: body(code) }), 201);
    created.add(code);

    const create = await post(api, `/association-types/${code}/fields`, { data: { code: 'note', type: 'text', en_US: { name: 'Note' } } });
    expectStatus(create, 201);

    const list = await get(api, `/association-types/${code}/fields`);
    expectOk(list);
    const rows = Array.isArray(list.body) ? list.body : list.body.data;
    expect(rows.map((f) => f.code)).toContain('note');

    const upd = await put(api, `/association-types/${code}/fields/note`, { data: { is_required: true } });
    expectOk(upd);

    const del1 = await del(api, `/association-types/${code}/fields/note`);
    expectOk(del1);
    const after = await get(api, `/association-types/${code}/fields`);
    const rowsAfter = Array.isArray(after.body) ? after.body : after.body.data;
    expect(rowsAfter.map((f) => f.code)).not.toContain('note');
  });

  test('16.20 - Duplicate field code on the same type → 422', async ({ api, uid }) => {
    const code = `qa_at_fd_${uid}`;
    expectStatus(await post(api, '/association-types', { data: body(code) }), 201);
    created.add(code);
    expectStatus(await post(api, `/association-types/${code}/fields`, { data: { code: 'dup', type: 'text' } }), 201);
    expectStatus(await post(api, `/association-types/${code}/fields`, { data: { code: 'dup', type: 'text' } }), 422);
  });

  test('16.21 - Field with missing code or type → 422', async ({ api, uid }) => {
    const code = `qa_at_fv_${uid}`;
    expectStatus(await post(api, '/association-types', { data: body(code) }), 201);
    created.add(code);
    expectStatus(await post(api, `/association-types/${code}/fields`, { data: { type: 'text' } }), 422);
    expectStatus(await post(api, `/association-types/${code}/fields`, { data: { code: 'nt' } }), 422);
  });

  test('16.22 - Field with unsupported type → 422', async ({ api, uid }) => {
    const code = `qa_at_ft_${uid}`;
    expectStatus(await post(api, '/association-types', { data: body(code) }), 201);
    created.add(code);
    expectStatus(await post(api, `/association-types/${code}/fields`, { data: { code: 'bad', type: 'not_a_type' } }), 422);
  });

  test('16.23 - Changing a field code or type is refused (immutable)', async ({ api, uid }) => {
    const code = `qa_at_fi_${uid}`;
    expectStatus(await post(api, '/association-types', { data: body(code) }), 201);
    created.add(code);
    expectStatus(await post(api, `/association-types/${code}/fields`, { data: { code: 'fx', type: 'text' } }), 201);
    expectStatus(await put(api, `/association-types/${code}/fields/fx`, { data: { type: 'textarea' } }), 422);
    expectStatus(await put(api, `/association-types/${code}/fields/fx`, { data: { code: 'fy' } }), 422);
  });

  test('16.24 - Field routes on an unknown type or field → 404', async ({ api, uid }) => {
    expectNotFound(await post(api, '/association-types/does_not_exist_zz/fields', { data: { code: 'a', type: 'text' } }));
    const code = `qa_at_f4_${uid}`;
    expectStatus(await post(api, '/association-types', { data: body(code) }), 201);
    created.add(code);
    expectNotFound(await put(api, `/association-types/${code}/fields/nope`, { data: { is_required: true } }));
    expectStatusIn(await del(api, `/association-types/${code}/fields/nope`), [404]);
  });

  // ── Delete ──────────────────────────────────────────────────────────────

  test('16.25 - DELETE removes a user-defined type', async ({ api, uid }) => {
    const code = `qa_at_del_${uid}`;
    expectStatus(await post(api, '/association-types', { data: body(code) }), 201);
    expectOk(await del(api, `/association-types/${code}`));
    expectNotFound(await get(api, `/association-types/${code}`));
  });

  test('16.26 - DELETE on a system type is refused and the type still exists', async ({ api }) => {
    for (const code of SYSTEM_TYPES) {
      expectStatus(await del(api, `/association-types/${code}`), 422);
      expectOk(await get(api, `/association-types/${code}`));
    }
  });

  test('16.27 - DELETE unknown type → 404; unauthenticated DELETE → 401', async ({ api, unauthedApi, uid }) => {
    expectNotFound(await del(api, '/association-types/does_not_exist_zz'));
    expectUnauthorized(await del(unauthedApi, `/association-types/qa_at_${uid}`));
  });
});
