const { test, expect } = require('@playwright/test');

/**
 * Reset-password endpoint: the page for an unknown token must render, and the
 * POST must validate input, refuse bad tokens with the same message for every
 * email (no account enumeration), and enforce CSRF — never answering 5xx.
 */
test.describe('Admin reset password', () => {
  let anon;
  let csrf;

  test.beforeEach(async ({ playwright, baseURL }) => {
    anon = await playwright.request.newContext({ baseURL, storageState: { cookies: [], origins: [] } });
    const page = await anon.get('/admin/reset-password/zz-nope-token');
    const html = await page.text();
    csrf = html.match(/name="_token"\s+value="([^"]+)"/)?.[1];
  });

  test.afterEach(async () => { await anon?.dispose(); });

  const post = (data, headers = {}) => anon.post('/admin/reset-password', {
    data,
    headers: { Accept: 'application/json', 'X-CSRF-TOKEN': csrf, ...headers },
    failOnStatusCode: false,
    maxRedirects: 0,
  });

  test('page for an unknown token renders without a server error', async () => {
    const res = await anon.get('/admin/reset-password/zz-nope-token', { failOnStatusCode: false });
    expect(res.status()).toBeLessThan(500);
    expect(csrf, 'CSRF token present on the form').toBeTruthy();
  });

  test('missing token, email and password → 422 with field errors', async () => {
    const res = await post({});
    expect(res.status()).toBe(422);
    const { errors } = await res.json();
    expect(Object.keys(errors)).toEqual(expect.arrayContaining(['token', 'email', 'password']));
  });

  test('malformed email → 422', async () => {
    const res = await post({ token: 'zz', email: 'not-an-email', password: 'Valid@12345', password_confirmation: 'Valid@12345' });
    expect(res.status()).toBe(422);
    expect((await res.json()).errors).toHaveProperty('email');
  });

  test('password confirmation mismatch → 422', async () => {
    const res = await post({ token: 'zz', email: 'qa@example.com', password: 'Valid@12345', password_confirmation: 'Different@123' });
    expect(res.status()).toBe(422);
    expect((await res.json()).errors).toHaveProperty('password');
  });

  test('too-short password → 422', async () => {
    const res = await post({ token: 'zz', email: 'qa@example.com', password: 'a1', password_confirmation: 'a1' });
    expect(res.status()).toBe(422);
  });

  test('password with leading/trailing whitespace → 422', async () => {
    const res = await post({ token: 'zz', email: 'qa@example.com', password: ' Valid@12345', password_confirmation: ' Valid@12345' });
    expect(res.status()).toBe(422);
  });

  test('invalid token is refused with the same message for any email (no account enumeration)', async () => {
    const body = (email) => ({ token: 'zz-invalid-token', email, password: 'Valid@12345', password_confirmation: 'Valid@12345' });
    const known = await post(body(process.env.ADMIN_EMAIL || 'admin@example.com'));
    const unknown = await post(body('nobody-here-qa@example.com'));

    expect(known.status()).toBe(422);
    expect(unknown.status()).toBe(422);
    expect((await known.json()).errors.email).toEqual((await unknown.json()).errors.email);
  });

  test('POST without a CSRF token is rejected (419), not processed', async () => {
    const res = await anon.post('/admin/reset-password', {
      data: { token: 'zz', email: 'qa@example.com', password: 'Valid@12345', password_confirmation: 'Valid@12345' },
      headers: { Accept: 'application/json' },
      failOnStatusCode: false,
      maxRedirects: 0,
    });
    expect([419, 302, 403]).toContain(res.status());
  });

  test('SQL/HTML in token and email never causes a 5xx', async () => {
    for (const token of ["' OR 1=1 --", '<script>alert(1)</script>', 'a'.repeat(5000)]) {
      const res = await post({ token, email: "x'@example.com", password: 'Valid@12345', password_confirmation: 'Valid@12345' });
      expect(res.status(), token.slice(0, 20)).toBeLessThan(500);
    }
  });
});
