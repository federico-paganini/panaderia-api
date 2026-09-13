import { expect, test } from '@playwright/test';

const ROUTES = ['/', '/privacy', '/terms'];

test.describe('every page renders', () => {
	for (const path of ROUTES) {
		test(`${path} responds and has a title`, async ({ page }) => {
			const response = await page.goto(path);

			expect(response?.status()).toBe(200);
			await expect(page).toHaveTitle(/Las Delicias/);
			await expect(page.locator('h1')).toBeVisible();
		});
	}
});

test.describe('the legal pages', () => {
	test('print the registered entity and its RUT', async ({ page }) => {
		// Meta's reviewer looks for exactly this. If the footer ever stops
		// rendering, the bot's app review is what breaks, silently.
		await page.goto('/privacy');

		// `toContainText` on the body, not `getByText`: the entity deliberately
		// appears more than once (section 1, the contact block, the footer), and
		// a strict locator would fail on the duplication rather than on a defect.
		await expect(page.locator('body')).toContainText('GERALNA LTDA.');
		await expect(page.locator('body')).toContainText('080097130018');
	});

	test('link back to the landing', async ({ page }) => {
		await page.goto('/terms');
		await page.getByRole('link', { name: /Volver a Las Delicias/ }).click();

		await expect(page).toHaveURL('http://localhost:4173/');
	});
});

test.describe('responsive floor', () => {
	// Spec §10: the body must never scroll horizontally, and the gutter never
	// drops below 16px. Both are invisible in a desktop review and obvious on a
	// phone, which is where most of this site's traffic will be.
	test.use({ viewport: { width: 400, height: 800 } });

	for (const path of ROUTES) {
		test(`${path} does not scroll sideways at 400px`, async ({ page }) => {
			await page.goto(path);

			const { scrollWidth, clientWidth } = await page.evaluate(() => ({
				scrollWidth: document.documentElement.scrollWidth,
				clientWidth: document.documentElement.clientWidth
			}));
			expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
		});
	}
});

test.describe('theme', () => {
	async function canvasOf(page: import('@playwright/test').Page) {
		await page.goto('/privacy');
		return page.evaluate(() => getComputedStyle(document.body).backgroundColor);
	}

	test('light follows the cream canvas token', async ({ page }) => {
		expect(await canvasOf(page)).toBe('rgb(247, 241, 228)'); // #f7f1e4
	});

	test.describe('dark', () => {
		test.use({ colorScheme: 'dark' });

		test('repaints from prefers-color-scheme alone', async ({ page }) => {
			// The whole point of the token split: no toggle, no script, no flash
			// — the reader's OS preference repaints the page by itself.
			expect(await canvasOf(page)).toBe('rgb(25, 21, 16)'); // #191510
		});
	});
});

test.describe('las páginas legales sin JavaScript', () => {
	// The audience for /privacy is Meta's app reviewer, and it is the single
	// blocker on publishing the WhatsApp bot. If their crawler does not run JS,
	// the page that unblocks everything has to already be in the HTML. These
	// pages are prerendered, so this must hold — this is what proves it still
	// does after any change to the layout or the build.
	test.use({ javaScriptEnabled: false });

	test('/privacy carries the whole disclosure in the HTML', async ({ page }) => {
		await page.goto('/privacy');
		const body = page.locator('body');

		// Who is responsible, as Meta's verification will match it.
		await expect(body).toContainText('GERALNA LTDA.');
		await expect(body).toContainText('080097130018');
		await expect(body).toContainText('privacidad@lasdeliciaslp.com');

		// Every processor the data actually reaches. A recipient dropped from
		// this page while it still receives data is the failure that matters.
		await expect(body).toContainText('Meta Platforms');
		await expect(body).toContainText('Anthropic PBC');
		await expect(body).toContainText('Vercel Inc.');

		// The commitments. `30 días` is written out rather than imported from
		// RETENTION_DAYS on purpose: importing it would make the test FOLLOW a change
		// to a published legal commitment silently. Hard-coded, changing the constant
		// breaks this test and forces someone to confirm the change was intended.
		await expect(body).toContainText('30 días');
		await expect(body).toContainText('18.331');
		await expect(body).toContainText('URCDP');
	});

	test('/terms keeps the clause that protects the business', async ({ page }) => {
		await page.goto('/terms');

		// The bot writes answers with a language model and can get a price or a
		// date wrong. This sentence is the whole reason the page exists.
		await expect(page.locator('body')).toContainText(
			'quedan confirmados únicamente cuando los confirma una persona del negocio'
		);
	});

	test('the two legal pages link to each other', async ({ page }) => {
		// Assert the link WORKS, not what its href says: the prerenderer emits
		// relative paths (`./terms`) so the output stays portable, and matching
		// the literal `/terms` would test the build's spelling instead of the
		// navigation. Clicking also proves it works with JS off.
		await page.goto('/privacy');
		await page.getByRole('link', { name: /términos y condiciones/i }).click();
		await expect(page).toHaveURL(/\/terms$/);

		await page.getByRole('link', { name: /política de privacidad/i }).click();
		await expect(page).toHaveURL(/\/privacy$/);
	});
});
