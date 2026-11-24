/**
 * Media Files API — GET/DELETE verbs and 404/auth guards for /media-files/{product,category,swatch}.
 * Upload happy paths live in 15-media-upload; this covers the read/delete side.
 * Created products are reaped in afterAll.
 */
'use strict';

const { test, expect } = require('../../../fixtures/api-fixtures');
const { REST_ROOT } = require('../../../utils/api/config');
const { get, post, delete: del, deleteIfExists } = require('../../../utils/api/throttle-safe');
const { expectOk, expectStatus, expectNotFound, expectUnauthorized } = require('../../../utils/api/response-validator');
const { uniqueCode } = require('../../../utils/api');
const payloads = require('../../../payloads');

test.describe('Media Files API — read/delete', () => {
  const createdProducts = new Set();
  let sku;

  test.beforeAll(async ({ apiToken, playwright }) => {
    if (!apiToken) return;
    const ctx = await playwright.request.newContext({
      baseURL: REST_ROOT,
      extraHTTPHeaders: { Authorization: `Bearer ${apiToken}`, Accept: 'application/json', 'Content-Type': 'application/json' },
    });
    sku = uniqueCode('media_vb');
    const p = await post(ctx, '/products', { data: payloads.products.build({ sku }) });
    if (p.ok) createdProducts.add(sku); else sku = null;
    await ctx.dispose();
  });

  test.afterAll(async ({ apiToken, playwright }) => {
    if (!apiToken) return;
    const ctx = await playwright.request.newContext({ baseURL: REST_ROOT });
    for (const s of createdProducts) await deleteIfExists(ctx, apiToken, `/products/${encodeURIComponent(s)}`);
    await ctx.dispose();
  });

  test('20.1 - GET product media for an unknown sku returns 404', async ({ api }) => {
    expectNotFound(await get(api, '/media-files/product', { params: { sku: 'no_such_sku_xyz', attribute: 'image' } }));
  });

  test('20.2 - GET product media without a sku returns 404', async ({ api }) => {
    expectNotFound(await get(api, '/media-files/product'));
  });

  test('20.3 - DELETE product media for an unknown sku returns 404', async ({ api }) => {
    expectNotFound(await del(api, '/media-files/product', { params: { sku: 'no_such_sku_xyz', attribute: 'image' } }));
  });

  test('20.4 - GET category media for an unknown code returns 404', async ({ api }) => {
    expectNotFound(await get(api, '/media-files/category', { params: { code: 'no_such_cat_xyz', category_field: 'x' } }));
  });

  test('20.5 - DELETE category media for an unknown code returns 404', async ({ api }) => {
    expectNotFound(await del(api, '/media-files/category', { params: { code: 'no_such_cat_xyz', category_field: 'x' } }));
  });

  test('20.6 - GET swatch media for an unknown attribute returns 404', async ({ api }) => {
    expectNotFound(await get(api, '/media-files/swatch', { params: { attribute_code: 'no_such_attr_xyz', code: 'x' } }));
  });

  test('20.7 - GET swatch media for an unknown option returns 404', async ({ api }) => {
    expectNotFound(await get(api, '/media-files/swatch', { params: { attribute_code: 'color', code: 'no_such_opt_xyz' } }));
  });

  test('20.8 - DELETE swatch media for an unknown option returns 404', async ({ api }) => {
    expectNotFound(await del(api, '/media-files/swatch', { params: { attribute_code: 'color', code: 'no_such_opt_xyz' } }));
  });

  test('20.9 - GET product media with nothing stored returns an empty list', async ({ api }) => {
    test.skip(!sku, 'Seed product not created');
    const r = await get(api, '/media-files/product', { params: { sku, attribute: 'image' } });
    expectOk(r);
    expect(r.body.data).toEqual([]);
  });

  test('20.10 - DELETE product media with nothing stored returns 404', async ({ api }) => {
    test.skip(!sku, 'Seed product not created');
    expectNotFound(await del(api, '/media-files/product', { params: { sku, attribute: 'image' } }));
  });

  test('20.11 - Product media round trip: upload, GET lists it, DELETE clears it', async ({ api }) => {
    test.skip(!sku, 'Seed product not created');
    const payload = payloads.media.buildProductUpload({ sku });
    const up = await post(api, '/media-files/product', {
      multipart: { sku: payload.sku, attribute: payload.attribute, file: payload.file },
    });
    expectOk(up);
    const listed = await get(api, '/media-files/product', { params: { sku, attribute: payload.attribute } });
    expectOk(listed);
    expect(listed.body.data.length).toBeGreaterThan(0);
    expectOk(await del(api, '/media-files/product', { params: { sku, attribute: payload.attribute } }));
    const after = await get(api, '/media-files/product', { params: { sku, attribute: payload.attribute } });
    expectOk(after);
    expect(after.body.data).toEqual([]);
  });

  test('20.12 - Upload to an unknown swatch attribute is rejected by validation (422)', async ({ api }) => {
    const payload = payloads.media.buildProductUpload({ sku: 'x' });
    const r = await post(api, '/media-files/swatch', {
      multipart: { attribute_code: 'no_such_attr_xyz', code: 'x', file: payload.file },
    });
    expectStatus(r, 422);
  });

  test('20.13 - Upload swatch without a file returns 422', async ({ api }) => {
    expectStatus(await post(api, '/media-files/swatch', { multipart: { attribute_code: 'color', code: 'x' } }), 422);
  });

  test('20.14 - Unauthenticated GET/DELETE return 401 on every media kind', async ({ unauthedApi }) => {
    for (const kind of ['product', 'category', 'swatch']) {
      expectUnauthorized(await get(unauthedApi, `/media-files/${kind}`));
      expectUnauthorized(await del(unauthedApi, `/media-files/${kind}`));
    }
  });
});
