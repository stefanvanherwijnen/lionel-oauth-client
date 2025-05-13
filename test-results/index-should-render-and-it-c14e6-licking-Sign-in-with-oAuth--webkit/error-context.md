# Test info

- Name: should render and it goes to oauth page when clicking "Sign in with oAuth"
- Location: /home/stefan/Projects/lionel-oauth-client/test/e2e/index.spec.ts:33:1

# Error details

```
Error: browserType.launch: 
╔══════════════════════════════════════════════════════╗
║ Host system is missing dependencies to run browsers. ║
║ Please install them with the following command:      ║
║                                                      ║
║     sudo pnpm exec playwright install-deps           ║
║                                                      ║
║ Alternatively, use apt:                              ║
║     sudo apt-get install libxml2                     ║
║                                                      ║
║ <3 Playwright Team                                   ║
╚══════════════════════════════════════════════════════╝
```

# Test source

```ts
   1 | import { test as base, expect } from '@playwright/test'
   2 | import { OauthClientConfig } from '../../src/createOauthClient'
   3 | import 'dotenv/config'
   4 |
   5 | declare global {
   6 |   interface Window {
   7 |     config: any // eslint-disable-line @typescript-eslint/no-explicit-any,
   8 |   }
   9 | }
  10 |
  11 | /** Preload bundled lionel source code */
  12 | const test = base.extend({
  13 |   page: async ({ page }, use) => {
  14 |     const config: Partial<OauthClientConfig> = {
  15 |       issuer: process.env.ISSUER || 'https://demo.duendesoftware.com',
  16 |       authorizationEndpoint:
  17 |         process.env.AUTHORIZATION_ENDPOINT || '/connect/authorize',
  18 |       tokenEndpoint: process.env.TOKEN_ENDPOINT || '/connect/token',
  19 |       clientId: process.env.CLIENT_ID || 'interactive.public'
  20 |     }
  21 |     await page.addInitScript((config: Partial<OauthClientConfig>) => {
  22 |       window.config = {
  23 |         issuer: config.issuer,
  24 |         authorizationEndpoint: config.authorizationEndpoint,
  25 |         tokenEndpoint: config.tokenEndpoint,
  26 |         clientId: config.clientId
  27 |       }
  28 |     }, config)
  29 |     await use(page)
  30 |   }
  31 | })
  32 |
> 33 | test('should render and it goes to oauth page when clicking "Sign in with oAuth"', async ({
     | ^ Error: browserType.launch: 
  34 |   page
  35 | }) => {
  36 |   await page.goto('')
  37 |
  38 |   // Expect a title "to contain" a substring.
  39 |   await expect(page).toHaveTitle(/Lionel/)
  40 |
  41 |   await page.click('text=Sign in with oAuth')
  42 |   // Expect some text to be visible on the page.
  43 |   await expect(page.locator('h2').first()).toContainText(
  44 |     'Using Lionel OAuth Client'
  45 |   )
  46 | })
  47 |
  48 | test('should render and it goes to oidc page when clicking "Sign in with OpenID Connect"', async ({
  49 |   page
  50 | }) => {
  51 |   await page.goto('')
  52 |
  53 |   // Expect a title "to contain" a substring.
  54 |   await expect(page).toHaveTitle(/Lionel/)
  55 |
  56 |   await page.click('text=Sign in with OpenID Connect')
  57 |   // Expect some text to be visible on the page.
  58 |   await expect(page.locator('h2').first()).toContainText(
  59 |     'Using Lionel Oidc Client'
  60 |   )
  61 | })
  62 |
```