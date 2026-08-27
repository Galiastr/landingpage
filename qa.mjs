import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const browser = await chromium.launch({ headless: true })
const errors = []
await mkdir('artifacts', { recursive: true })
for (const [name, viewport] of Object.entries({ desktop: { width: 1440, height: 1000 }, mobile: { width: 390, height: 844 } })) {
  const page = await browser.newPage({ viewport })
  page.on('console', msg => { if (msg.type() === 'error') errors.push(`${name}: console: ${msg.text()}`) })
  page.on('pageerror', err => errors.push(`${name}: pageerror: ${err.message}`))
  await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' })
  const title = await page.title()
  const cards = await page.locator('.project-grid .project-card').count()
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
  if (!title.includes('Stanislav Sorokin')) errors.push(`${name}: bad title ${title}`)
  if (cards !== 41) errors.push(`${name}: expected 41 project cards, got ${cards}`)
  if (overflow) errors.push(`${name}: horizontal overflow`)
  if (name === 'mobile' && !await page.locator('.availability__compact').isVisible()) errors.push('mobile: compact availability label is not visible')
  const cardImages = page.locator('.project-card img')
  for (let index = 0; index < await cardImages.count(); index += 1) {
    await cardImages.nth(index).scrollIntoViewIfNeeded()
  }
  await page.waitForFunction(() => [...document.querySelectorAll('.project-card img')].every(image => image.complete))
  await page.evaluate(() => window.scrollTo(0, 0))
  const brokenImages = await cardImages.evaluateAll(images => images.filter(image => image.naturalWidth === 0).map(image => image.getAttribute('src')))
  if (brokenImages.length) errors.push(`${name}: broken images: ${brokenImages.join(', ')}`)
  await page.screenshot({ path: `artifacts/${name}.png` })
  if (name === 'desktop') {
    await page.locator('select').nth(0).selectOption('Porting')
    const filtered = await page.locator('.project-grid .project-card').count()
    if (filtered !== 7) errors.push(`filter: expected 7 porting projects, got ${filtered}`)
    const trigger = page.locator('.project-grid .project-card button').first()
    await trigger.focus()
    await trigger.click()
    if (!await page.locator('[role="dialog"]').isVisible()) errors.push('dialog did not open')
    if (!await page.locator('[aria-live="polite"]').filter({ hasText: 'Showing image 1 of' }).count()) errors.push('dialog gallery status is missing')
    if (!await page.getByRole('link', { name: 'Project source' }).count()) errors.push('dialog project source link is missing')
    if (!await page.locator('.dialog-close').evaluate(element => element === document.activeElement)) errors.push('dialog did not focus close control')
    await page.keyboard.press('Shift+Tab')
    const backwardInsideDialog = await page.locator('[role="dialog"]').evaluate(dialog => dialog.contains(document.activeElement))
    if (!backwardInsideDialog || await page.locator('.dialog-close').evaluate(element => element === document.activeElement)) errors.push('dialog focus trap did not wrap backward')
    await page.keyboard.press('Tab')
    if (!await page.locator('.dialog-close').evaluate(element => element === document.activeElement)) errors.push('dialog focus trap did not wrap forward')
    await page.keyboard.press('Escape')
    if (await page.locator('[role="dialog"]').count()) errors.push('dialog did not close on Escape')
    if (!await trigger.evaluate(element => element === document.activeElement)) errors.push('dialog did not restore trigger focus')
  }
  await page.close()
}
await browser.close()
if (errors.length) { console.error(errors.join('\n')); process.exit(1) }
console.log('QA passed: desktop/mobile render, 41 cards, filters, gallery dialog, focus trap, Escape, no overflow or console errors')
