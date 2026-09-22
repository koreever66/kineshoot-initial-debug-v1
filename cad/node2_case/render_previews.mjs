import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { existsSync } from 'node:fs'
import { chromium } from 'playwright-core'
import { startServer } from './serve.mjs'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const outDir = join(__dirname, 'out')
const candidateChrome = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].filter(Boolean)
const executablePath = candidateChrome.find((candidate) => existsSync(candidate))

if (!executablePath) throw new Error('No Chrome or Edge executable found')
await mkdir(outDir, { recursive: true })

const server = await startServer(0)
const browser = await chromium.launch({ executablePath, headless: true })
try {
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 })
  for (const view of ['iso', 'top', 'side']) {
    await page.goto(`${server.url}/viewer.html?view=${view}`, { waitUntil: 'networkidle' })
    await page.waitForFunction(() => window.__viewerReady === true, null, { timeout: 15000 })
    await page.waitForTimeout(600)
    const file = join(outDir, `node2_open_top_v1_preview_${view}.png`)
    await page.screenshot({ path: file })
    console.log(`Generated ${file}`)
  }
} finally {
  await browser.close()
  await server.close()
}
