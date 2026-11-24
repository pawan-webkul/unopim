const { test, expect } = require('../../utils/fixtures');
const { generateUid } = require('../../utils/helpers');
const {
  BASE_URL, HIDE_OVERLAYS, createRole, setRolePermissions, createUserWithRole, loginAs, removeRecord,
} = require('../../utils/acl-helpers');
const { expand } = require('../../utils/admin-routes');
const path = require('path');

/**
 * A dashboard-only admin must be denied (403/401) on every admin GET route that
 * is not part of the always-available shell (dashboard, account, notifications,
 * datagrid/select helpers, help, logout). Hidden menu items are not enough: the
 * server must reject a direct request, and must never answer 5xx.
 */
const ALWAYS_ALLOWED = [
  /^admin$/, /^admin\/dashboard/, /^admin\/account/, /^admin\/logout/, /^admin\/notifications/,
  /^admin\/viewed-notifications/, /^admin\/read-all-notifications/, /^admin\/datagrid/,
  /^admin\/vue-js-select/, /^admin\/help/, /^admin\/tinymce/, /^admin\/media/, /^admin\/avatar/,
  /^admin\/acl-version/, /^admin\/login/, /^admin\/forget-password/, /^admin\/reset-password/,
  /^admin\/completeness(?!-)/, /^admin\/get-notifications/,
  // Form helper lookups (attribute/option/unit pickers) are served to any signed-in admin by design.
  /^admin\/catalog\/ajax-options\/fetch-options/, /^admin\/measurement\/attribute-units/,
  /^admin\/measurement\/measurement\/attribute\//,
];

test.describe('Dashboard-only role is denied on every module route', () => {
  test.setTimeout(10 * 60 * 1000);

  const ADMIN_STATE = path.resolve(__dirname, '../..', process.env.PW_STATE_DIR || '.state', 'admin-auth.json');

  test('direct GET on all non-shell admin routes returns 403/401, never 200 or 5xx', async ({ browser }) => {
    const uid = generateUid();
    const roleName = `SweepDashOnly${uid}`;
    const email = `sweep-dash-only-${uid}@example.com`;
    const password = 'Test@12345';

    const adminContext = await browser.newContext({ storageState: ADMIN_STATE });
    await adminContext.addInitScript(HIDE_OVERLAYS);
    const adminPage = await adminContext.newPage();

    await createRole(adminPage, roleName);
    const roleId = await setRolePermissions(adminPage, roleName, ['dashboard']);
    await createUserWithRole(adminPage, { name: `Sweep Operator ${uid}`, email, password, roleId });

    const userContext = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    await userContext.addInitScript(HIDE_OVERLAYS);
    const userPage = await userContext.newPage();

    try {
      await loginAs(userPage, email, password);

      const targets = expand({ methods: ['GET'] })
        .filter((r) => !r.public && !ALWAYS_ALLOWED.some((re) => re.test(r.uri)));

      expect(targets.length).toBeGreaterThan(80);

      const offenders = await userPage.evaluate(async ({ base, urls }) => {
        const bad = [];

        for (const url of urls) {
          const res = await fetch(base + url, {
            headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' },
            redirect: 'manual',
          });
          // 401/403 = denied. Opaque redirect (status 0) and 404 are tolerated: nothing was served.
          if (![401, 403, 404, 0].includes(res.status)) bad.push(`${res.status} ${url}`);
        }

        return bad;
      }, { base: BASE_URL, urls: targets.map((t) => t.url) });

      expect(offenders, `restricted user was served:\n${offenders.join('\n')}`).toEqual([]);
    } finally {
      await userContext.close();
      await removeRecord(adminPage, 'users', email).catch(() => {});
      await removeRecord(adminPage, 'roles', roleName).catch(() => {});
      await adminContext.close();
    }
  });
});
