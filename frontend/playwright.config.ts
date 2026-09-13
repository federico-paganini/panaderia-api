import { defineConfig } from '@playwright/test';

export default defineConfig({
	webServer: {
		// CI already ran `pnpm build` as its own gate step, so rebuilding here
		// would just pay for it twice and hide which of the two failed.
		command: process.env.CI ? 'pnpm preview' : 'pnpm build && pnpm preview',
		port: 4173,
		reuseExistingServer: !process.env.CI
	},
	testMatch: '**/*.e2e.{ts,js}',
	use: { baseURL: 'http://localhost:4173' }
});
