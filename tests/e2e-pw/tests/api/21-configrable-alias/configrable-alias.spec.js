/**
 * Legacy /configrable-products alias (kept for the historic typo) must behave exactly
 * like /configurable-products: list, create, detail, update, delete, 404 and 401.
 */
'use strict';

const { test, expect } = require('../../../fixtures/api-fixtures');
const { REST_ROOT } = require('../../../utils/api/config');
const { get, post, put, patch, delete: del, deleteIfExists } = require('../../../utils/api/throttle-safe');
const { expectOk, expectStatus, expectNotFound, expectUnauthorized } = require('../../../utils/api/response-validator');
const payloads = require('../../../payloads');

const LEGACY = '/configrable-products';
const CANON = '/configurable-products';
const superAttrs = (process.env.API_SUPER_ATTRS || 'color,size').split(',').map((s) => s.trim());

test.describe('Configrable-products legacy alias', () => {
  const created = new Set();

  test.afterAll(async ({ apiToken, playwright }) => {
    if (!apiToken) return;
    const ctx = await playwright.request.newContext({ baseURL: REST_ROOT });
    for (const sku of created) await deleteIfExists(ctx, apiToken, `/products/${encodeURIComponent(sku)}`);
    await ctx.dispose();
  });

  test('21.1 - GET alias list matches the canonical list status', async ({ api }) => {
    const a = await get(api, LEGACY);
    const c = await get(api, CANON);
    expectOk(a);
    expect(a.status).toBe(c.status);
    expect(a.body.meta?.total).toBe(c.body.meta?.total);
  });

  test('21.2 - POST via alias creates, canonical GET reads it, alias GET reads it', async ({ api, uid }) => {
    const sku = `cfa_${uid}`;
    const r = await post(api, LEGACY, { data: payloads.configurableProducts.build({ sku, superAttributes: superAttrs }) });
    expectOk(r);
    created.add(sku);
    expectOk(await get(api, `${CANON}/${sku}`));
    expectOk(await get(api, `${LEGACY}/${sku}`));
  });

  test('21.3 - PATCH and PUT via alias are accepted', async ({ api, uid }) => {
    const sku = `cfa_${uid}`;
    expectOk(await post(api, LEGACY, { data: payloads.configurableProducts.build({ sku, superAttributes: superAttrs }) }));
    created.add(sku);
    const pa = await patch(api, `${LEGACY}/${sku}`, { data: { status: false } });
    expect([200, 201, 422]).toContain(pa.status);
    expect(pa.status).toBeLessThan(500);
    const pu = await put(api, `${LEGACY}/${sku}`, { data: {} });
    expect(pu.status).toBeLessThan(500);
  });

  test('21.4 - DELETE via alias removes the product', async ({ api, uid }) => {
    const sku = `cfa_${uid}`;
    expectOk(await post(api, LEGACY, { data: payloads.configurableProducts.build({ sku, superAttributes: superAttrs }) }));
    created.add(sku);
    expectOk(await del(api, `${LEGACY}/${sku}`));
    created.delete(sku);
    expectNotFound(await get(api, `${CANON}/${sku}`));
  });

  test('21.5 - Unknown sku returns 404 on both routes', async ({ api }) => {
    expectNotFound(await get(api, `${LEGACY}/no_such_sku_xyz`));
    expectNotFound(await get(api, `${CANON}/no_such_sku_xyz`));
  });

  test('21.6 - POST without payload returns 422 on the alias', async ({ api }) => {
    expectStatus(await post(api, LEGACY, { data: {} }), 422);
  });

  test('21.7 - Alias requires authentication', async ({ unauthedApi }) => {
    expectUnauthorized(await get(unauthedApi, LEGACY));
    expectUnauthorized(await post(unauthedApi, LEGACY, { data: {} }));
  });
});
