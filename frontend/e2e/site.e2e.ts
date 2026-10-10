import { expect, test } from '@playwright/test';
import { PARTY_TIMES_ENTITY } from '../src/lib/party-times/entity';
import { isPending } from '../src/lib/shared/legal';

const ROUTES = [
	'/',
	'/privacy',
	'/terms',
	'/party-times',
	'/party-times/privacy',
	'/party-times/terms'
];

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

test.describe('the landing', () => {
	test('sends the CTA to the bakery’s WhatsApp', async ({ page }) => {
		// Written out rather than imported from the bakery's brand, like `30 días` below: a
		// published contact number should change only on purpose, and an import
		// would let this test follow a wrong number silently.
		await page.goto('/');
		await expect(page.getByRole('link', { name: /pedí por whatsapp/i })).toHaveAttribute(
			'href',
			'https://wa.me/59892007806'
		);
	});

	test('sends the nav’s Pedidos to the same WhatsApp', async ({ page }) => {
		// Hard-coded for the same reason as above. The nav is the one link every
		// reader passes, so a wrong number here would cost the most orders.
		await page.goto('/');
		const nav = page.getByRole('navigation', { name: 'Principal' });
		await expect(nav.getByRole('link', { name: 'Pedidos' })).toHaveAttribute(
			'href',
			'https://wa.me/59892007806'
		);
	});

	test('describes every photo', async ({ page }) => {
		await page.goto('/');

		// Every <img> states an alt — without one a screen reader reads the
		// file name. Decoration inside an aria-hidden block (the stickers' ear)
		// states it empty, which is the correct way to say "skip me"; every
		// image a reader can reach must describe itself.
		const images = page.locator('img');
		await expect(images).not.toHaveCount(0);
		for (const img of await images.all()) {
			await expect(img).toHaveAttribute('alt');
		}

		const reachable = page.locator('img:not([aria-hidden="true"] img)');
		await expect(reachable).not.toHaveCount(0);
		for (const img of await reachable.all()) {
			await expect(img).toHaveAttribute('alt', /\S/);
		}
	});

	test('loads without a console error', async ({ page }) => {
		// The CSP turns a lot of innocent-looking markup into a console error —
		// an inline `onload` that Svelte adds to an <img> fed by a spread, for
		// one — and nothing else would notice: the page still looks right.
		const errors: string[] = [];
		page.on('console', (message) => {
			if (message.type() === 'error') errors.push(message.text());
		});

		await page.goto('/');
		await page.waitForLoadState('networkidle');
		expect(errors).toEqual([]);
	});
});

test.describe('sticker parallax', () => {
	// Reads the inline `translate` the parallax writes. Empty means untouched.
	async function translateAfterPointerMove(page: import('@playwright/test').Page) {
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		await page.mouse.move(100, 100);
		await page.mouse.move(1200, 700, { steps: 5 });
		await page.waitForTimeout(500);
		return page
			.locator('.sticker')
			.first()
			.evaluate((node) => node.style.translate);
	}

	test('follows the pointer', async ({ page }) => {
		expect(await translateAfterPointerMove(page)).not.toBe('');
	});

	test.describe('under reduced motion', () => {
		test.use({ reducedMotion: 'reduce' });

		test('stays still', async ({ page }) => {
			// Spec §9: everything respects the reader's motion preference — and a
			// sticker drifting under the cursor is exactly what that setting asks
			// to stop.
			expect(await translateAfterPointerMove(page)).toBe('');
		});
	});

	test.describe('on a touch screen', () => {
		test.use({ hasTouch: true, isMobile: true, viewport: { width: 400, height: 860 } });

		test('stays still', async ({ page }) => {
			// A coarse pointer has no cursor to follow; the listener and the
			// animation frame should never start.
			expect(await translateAfterPointerMove(page)).toBe('');
		});
	});
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

test.describe('the party venue', () => {
	// A separate company with the same owners. Its pages share the legal frame,
	// so what must hold is that the frame names the right company on each side.
	for (const path of ['/party-times/privacy', '/party-times/terms']) {
		test(`${path} is framed as the venue’s, not the bakery’s`, async ({ page }) => {
			await page.goto(path);

			const footer = page.locator('footer');
			await expect(footer).toContainText(PARTY_TIMES_ENTITY.name);
			await expect(footer).not.toContainText('GERALNA');
			await expect(page.getByRole('link', { name: 'Volver a Party Times' })).toHaveAttribute(
				'href',
				/party-times$/
			);
		});
	}

	test('stays unlisted while its legal facts are placeholders', async ({ page }) => {
		// A legal page naming "[razón social del salón]" as the party responsible
		// for someone's data must not be found: out of search, and no link from
		// the bakery. Once the facts are in, both open up by themselves.
		const pending = isPending(PARTY_TIMES_ENTITY);

		for (const path of ['/party-times', '/party-times/privacy', '/party-times/terms']) {
			await page.goto(path);
			await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(
				pending ? 1 : 0
			);
		}

		await page.goto('/');
		await expect(page.getByRole('link', { name: /salón de fiestas/i })).toHaveCount(
			pending ? 0 : 1
		);
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
