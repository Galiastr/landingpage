import { chromium } from 'playwright'
import { mkdir, readFile } from 'node:fs/promises'

const browser = await chromium.launch({ headless: true })
const errors = []
await mkdir('artifacts', { recursive: true })
const rewriteRules = await readFile('dist/.htaccess', 'utf8')
if (!rewriteRules.includes('RewriteRule . /index.html [L]')) errors.push('SPA fallback rewrite is missing')
for (const [name, viewport] of Object.entries({ desktop: { width: 1440, height: 1000 }, mobile: { width: 390, height: 844 } })) {
  const page = await browser.newPage({ viewport })
  page.on('console', msg => { if (msg.type() === 'error') errors.push(`${name}: console: ${msg.text()}`) })
  page.on('pageerror', err => errors.push(`${name}: pageerror: ${err.message}`))
  await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' })
  const title = await page.title()
  const cards = await page.locator('.project-grid .project-card').count()
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
  if (!title.includes('Stanislav Sorokin')) errors.push(`${name}: bad title ${title}`)
  if (!await page.locator('link[rel="canonical"]').count()) errors.push(`${name}: canonical link is missing`)
  if (!await page.locator('link[rel="icon"]').count()) errors.push(`${name}: favicon link is missing`)
  if (await page.locator('.featured .project-card').count() !== 3) errors.push(`${name}: expected 3 featured case studies`)
  if (name === 'desktop') {
    const featuredBoxes = await page.locator('.featured .project-card').evaluateAll(cards => cards.map(card => {
      const cardBox = card.getBoundingClientRect()
      const visualBox = card.querySelector('.project-card__visual')?.getBoundingClientRect()
      return { width: cardBox.width, height: cardBox.height, visualHeight: visualBox?.height ?? 0 }
    }))
    const spread = key => Math.max(...featuredBoxes.map(box => box[key])) - Math.min(...featuredBoxes.map(box => box[key]))
    if (spread('width') > 2 || spread('height') > 2 || spread('visualHeight') > 2) errors.push(`desktop: featured cards are not equal-sized: ${JSON.stringify(featuredBoxes)}`)
  }
  if (!await page.getByRole('heading', { name: 'Selected filtered case studies' }).count()) errors.push(`${name}: featured section heading is missing`)
  if (cards !== 47) errors.push(`${name}: expected 47 project cards, got ${cards}`)
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
    if (filtered !== 12) errors.push(`filter: expected 12 porting projects, got ${filtered}`)
    const trigger = page.locator('.project-grid .project-card button').first()
    await trigger.focus()
    await trigger.click()
    if (!await page.locator('[role="dialog"]').isVisible()) errors.push('dialog did not open')
    if (!await page.locator('[aria-live="polite"]').filter({ hasText: 'Showing image 1 of' }).count()) errors.push('dialog gallery status is missing')
    if (await page.getByRole('link', { name: 'Project source' }).count()) errors.push('dialog exposes a Project source link')
    if (await page.getByText('Media', { exact: true }).count()) errors.push('dialog still exposes media-count metadata')
    if (!await page.getByText('Focus', { exact: true }).count()) errors.push('dialog focus metadata is missing')
    if (!await page.locator('.project-navigation').count()) errors.push('project previous/next navigation is missing')
    const dialogLayout = await page.locator('.project-dialog').evaluate(dialog => {
      const dialogBox = dialog.getBoundingClientRect()
      const gallery = dialog.querySelector('.dialog-gallery')
      const galleryBox = gallery?.getBoundingClientRect()
      const thumbnailsBox = gallery?.querySelector('.dialog-thumbnails')?.getBoundingClientRect()
      const navigation = dialog.querySelector('.project-navigation')
      const buttons = navigation ? [...navigation.querySelectorAll('button')].map(button => button.getBoundingClientRect()) : []
      return {
        galleryFillsHeight: !!galleryBox && Math.abs(galleryBox.bottom - dialogBox.bottom) <= 2,
        galleryTailGap: galleryBox && thumbnailsBox ? galleryBox.bottom - thumbnailsBox.bottom : 0,
        navigationOutsideGallery: !!navigation && !!gallery && !gallery.contains(navigation),
        previousOutsideLeft: buttons.length === 2 && buttons[0].right <= dialogBox.left + 2,
        nextOutsideRight: buttons.length === 2 && buttons[1].left >= dialogBox.right - 2,
        thumbnailsCentered: !!galleryBox && !!thumbnailsBox && (
          thumbnailsBox.width >= galleryBox.width - 4 || Math.abs((thumbnailsBox.left + thumbnailsBox.width / 2) - (galleryBox.left + galleryBox.width / 2)) <= 4
        ),
      }
    })
    if (!dialogLayout.galleryFillsHeight || dialogLayout.galleryTailGap > 2) errors.push(`dialog gallery has unused space: ${JSON.stringify(dialogLayout)}`)
    if (!dialogLayout.thumbnailsCentered) errors.push(`dialog thumbnails are not centered horizontally: ${JSON.stringify(dialogLayout)}`)
    if (!dialogLayout.navigationOutsideGallery || !dialogLayout.previousOutsideLeft || !dialogLayout.nextOutsideRight) errors.push(`project navigation is not positioned outside the modal sides: ${JSON.stringify(dialogLayout)}`)
    if (!new URL(page.url()).pathname.startsWith('/project/')) errors.push(`dialog permalink was not reflected in URL: ${page.url()}`)
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

{
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
  page.on('pageerror', err => errors.push(`routing pageerror: ${err.message}`))
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' })
  await page.evaluate(() => { history.pushState({}, '', '/porting'); dispatchEvent(new PopStateEvent('popstate')) })
  if (!await page.getByRole('heading', { name: 'Console & PC porting' }).count()) errors.push('/porting: targeted heading is missing')
  const portingTitles = await page.locator('.featured .project-card__title-row strong').allTextContents()
  const expectedPortingTitles = ['Manic Miner', 'Schoolboy Escape', 'Car Dealership Manager 2026']
  if (JSON.stringify(portingTitles) !== JSON.stringify(expectedPortingTitles)) errors.push(`/porting: wrong featured projects: ${portingTitles.join(', ')}`)
  await page.waitForFunction(() => document.querySelectorAll('select')[0]?.value === 'Porting')
  if (await page.locator('select').nth(0).inputValue() !== 'Porting') errors.push('/porting: archive engagement filter was not selected automatically')
  if (await page.locator('.project-grid .project-card').count() !== 12) errors.push('/porting: archive was not filtered to all 12 porting projects')
  const manicCover = await page.locator('.featured .project-card', { hasText: 'Manic Miner' }).locator('img').getAttribute('src')
  if (manicCover !== '/projects/manic-miner/image-6.jpg') errors.push(`/porting: Manic Miner cover is not the selected colorful level: ${manicCover}`)
  await page.locator('.featured .project-card button').first().click()
  await page.getByRole('button', { name: 'Close case study' }).click()
  if (new URL(page.url()).pathname !== '/porting') errors.push(`/porting: closing project lost preset route: ${page.url()}`)
  if (!await page.getByRole('heading', { name: 'Console & PC porting' }).count()) errors.push('/porting: closing project lost targeted view')

  await page.getByRole('button', { name: 'Open Manic Miner case study' }).last().click()
  await page.locator('.project-navigation button').last().click()
  await page.getByRole('button', { name: 'Close case study' }).click()
  await page.goBack()
  if (await page.locator('[role="dialog"]').count()) {
    errors.push('project navigation polluted browser history and reopened a stale dialog on Back')
    await page.getByRole('button', { name: 'Close case study' }).click()
  }
  if (new URL(page.url()).pathname !== '/porting') errors.push(`project navigation Back did not remain on return route: ${page.url()}`)

  const verifiedBbgStores = {
    'Boulder Dash 40th Anniversary': ['Steam', 'Xbox', 'PlayStation', 'Nintendo Switch'],
    'Dynablaster': ['Steam', 'Xbox', 'Nintendo Switch'],
    'Boulder Dash Deluxe': ['Steam', 'Xbox', 'PlayStation', 'Nintendo Switch'],
    'Astrosmash': ['Steam', 'Xbox', 'Nintendo Switch'],
    'Shark! Shark!': ['Steam', 'Xbox', 'Nintendo Switch'],
  }
  for (const [title, platforms] of Object.entries(verifiedBbgStores)) {
    await page.getByRole('button', { name: `Open ${title} case study` }).last().click()
    const labels = await page.locator('.store-links a').allTextContents()
    for (const platform of platforms) if (!labels.includes(platform)) errors.push(`${title}: missing verified ${platform} store link`)
    const status = await page.locator('.release-status strong').textContent()
    if (status !== 'Released') errors.push(`${title}: expected Released status, got ${status}`)
    await page.getByRole('button', { name: 'Close case study' }).click()
  }

  await page.goto('http://127.0.0.1:4173/#arcades', { waitUntil: 'networkidle' })
  if (!await page.getByRole('heading', { name: 'Arcade games & classic franchises' }).count()) errors.push('#arcades: targeted heading is missing')
  await page.evaluate(() => { history.pushState({}, '', '/project/manic-miner'); dispatchEvent(new PopStateEvent('popstate')) })
  if (!await page.getByRole('dialog', { name: 'Manic Miner' }).count()) errors.push('direct project permalink did not open dialog')
  await page.getByRole('button', { name: 'Close case study' }).click()
  await page.evaluate(() => { history.pushState({}, '', '/project/%E0%A4%A'); dispatchEvent(new PopStateEvent('popstate')) })
  if (!await page.getByRole('heading', { name: /Senior Unity Developer and Technical Lead/ }).count()) errors.push('malformed project permalink crashed instead of falling back safely')
  if (await page.locator('[role="dialog"]').count()) errors.push('malformed project permalink opened a dialog')

  const refreshedCases = {
    'fast-food-master-2025': { title: 'Fast Food Master 2025', links: ['Epic Games Store', 'Xbox'], engagement: 'Porting' },
    'digging-a-hole-simulator': { title: 'Digging A Hole Simulator', links: ['Nintendo Switch'], engagement: 'Co-development' },
    'schoolboy-escape': { title: 'Schoolboy Escape', links: ['Nintendo Switch', 'Xbox'], engagement: 'Porting' },
    'cyberpunk-hacker': { title: 'Cyberpunk Hacker', links: ['Nintendo Switch', 'Epic Games Store', 'Xbox'], engagement: 'Co-development' },
    'contraband-patrol-simulator': { title: 'Contraband Patrol Simulator', links: ['Nintendo Switch'], engagement: 'Porting' },
    'car-dealership-manager-2026': { title: 'Car Dealership Manager 2026', links: ['Nintendo Switch'], engagement: 'Porting' },
    'punch-monkey-revenge': { title: 'Punch Monkey Revenge', links: ['Xbox'], engagement: 'Porting' },
  }
  for (const [slug, expected] of Object.entries(refreshedCases)) {
    await page.goto(`http://127.0.0.1:4173/project/${slug}`, { waitUntil: 'networkidle' })
    if (!await page.getByRole('dialog', { name: expected.title }).count()) errors.push(`${expected.title}: direct project route did not open`)
    const galleryImages = page.locator('.dialog-thumbnails img')
    if (await galleryImages.count() < 4) errors.push(`${expected.title}: expected at least four gallery images`)
    await page.waitForFunction(() => [...document.querySelectorAll('.dialog-thumbnails img')].every(image => image.complete))
    const brokenGalleryImages = await galleryImages.evaluateAll(images => images.filter(image => image.naturalWidth === 0).map(image => image.getAttribute('src')))
    if (brokenGalleryImages.length) errors.push(`${expected.title}: broken gallery images: ${brokenGalleryImages.join(', ')}`)
    const labels = await page.locator('.store-links a').allTextContents()
    for (const label of expected.links) if (!labels.includes(label)) errors.push(`${expected.title}: missing ${label} store link`)
    const engagement = await page.locator('.dialog-meta div').first().locator('strong').textContent()
    if (engagement !== expected.engagement) errors.push(`${expected.title}: expected ${expected.engagement} engagement, got ${engagement}`)
    const status = await page.locator('.release-status strong').textContent()
    if (status !== 'Released') errors.push(`${expected.title}: expected Released status, got ${status}`)
  }

  await page.goto('http://127.0.0.1:4173/project/esport-ido', { waitUntil: 'networkidle' })
  if (!await page.getByRole('dialog', { name: 'esport.ido' }).count()) errors.push('esport.ido direct permalink did not open the renamed case study')
  const esportSite = page.getByRole('link', { name: 'Official site' })
  if (await esportSite.getAttribute('href') !== 'https://idostarzn.com/esportido') errors.push('esport.ido official site link is missing or incorrect')
  if (!await page.getByText(/white-label SaaS platform/i).count()) errors.push('esport.ido SaaS product description is missing')
  for (const src of [
    '/projects/esport-ido/training-with-alex-freitag.png',
    '/projects/esport-ido/worlds-selection.png',
    '/projects/esport-ido/training-results.jpg',
  ]) {
    if (!await page.locator(`.dialog-thumbnails [src="${src}"]`).count()) errors.push(`esport.ido media is missing: ${src}`)
  }
  await page.getByRole('button', { name: /Show video/ }).click()
  if (await page.locator('.dialog-media video').getAttribute('src') !== '/projects/esport-ido/esport-ido-demo.mp4') errors.push('esport.ido demo video is missing or not playable from the gallery')
  await page.getByRole('button', { name: 'Close case study' }).click()

  await page.goto('http://127.0.0.1:4173/cv/index.html', { waitUntil: 'networkidle' })
  if (!await page.getByRole('heading', { name: 'Stanislav Sorokin' }).count()) errors.push('/cv: heading missing')
  const cvLink = page.locator('a[download]')
  if (await cvLink.getAttribute('href') !== '/cv/Stanislav_Sorokin_CV.pdf') errors.push('/cv: download link points to the wrong PDF')
  await page.close()
}
await browser.close()
if (errors.length) { console.error(errors.join('\n')); process.exit(1) }
console.log('QA passed: desktop/mobile render, 47 cards, preset/archive filters, project galleries, dialog accessibility, routing and no overflow')
