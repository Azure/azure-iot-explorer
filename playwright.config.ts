import { defineConfig } from '@playwright/test';

// Accessibility snapshots can expose values from masked credential fields in failure artifacts.
process.env.PLAYWRIGHT_NO_COPY_PROMPT = '1';

export default defineConfig({
    expect: {
        timeout: 30_000,
    },
    fullyParallel: false,
    outputDir: 'test-results/playwright',
    reporter: [
        ['list'],
        ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ],
    retries: 0,
    testDir: './e2e/specs',
    timeout: 120_000,
    use: {
        screenshot: 'off',
        trace: 'off',
        video: 'off',
    },
    workers: 1,
});
