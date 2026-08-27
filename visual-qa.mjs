import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

await mkdir('artifacts', { recursive: true })
const browser = await chromium.launch({ headless: true })

const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
await desktop.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' })
await desktop.locator('#featured-work').screenshot({ path: 'artifacts/featured-desktop.png' })
await desktop.locator('.featured .project-card button').first().click()
await desktop.locator('[role="dialog"]').screenshot({ path: 'artifacts/dialog-desktop.png' })

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } })
await mobile.goto('http://127.0.0.1:4173/#arcades', { waitUntil: 'networkidle' })
await mobile.locator('#featured-work').screenshot({ path: 'artifacts/featured-mobile.png' })
await mobile.locator('.featured .project-card button').first().click()
await mobile.locator('[role="dialog"]').screenshot({ path: 'artifacts/dialog-mobile.png' })

await browser.close()
console.log('Visual QA screenshots written to artifacts/')
