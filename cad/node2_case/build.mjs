import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import jscad from '@jscad/modeling'
import stlSerializer from '@jscad/stl-serializer'
import threeMfSerializer from '@jscad/3mf-serializer'
import { CONFIG } from './config.mjs'
import { buildShell, enclosureReport } from './model.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, 'out')
const shell = buildShell()

function rectangleBounds(module) {
  const [width, depth] = module.size
  const [x, y] = module.center
  return {
    minX: x - width / 2,
    maxX: x + width / 2,
    minY: y - depth / 2,
    maxY: y + depth / 2,
  }
}

function overlaps(a, b) {
  return a.minX < b.maxX && a.maxX > b.minX && a.minY < b.maxY && a.maxY > b.minY
}

function validateLayout() {
  const errors = []
  const innerLength = CONFIG.case.length - CONFIG.case.wallThickness * 2
  const innerWidth = CONFIG.case.width - CONFIG.case.wallThickness * 2
  const modules = CONFIG.modules.map((module) => ({ module, bounds: rectangleBounds(module) }))

  for (const { module, bounds } of modules) {
    if (bounds.minX < -innerLength / 2 || bounds.maxX > innerLength / 2) {
      errors.push(`${module.id} exceeds inner length`)
    }
    if (bounds.minY < -innerWidth / 2 || bounds.maxY > innerWidth / 2) {
      errors.push(`${module.id} exceeds inner width`)
    }
    if (module.size[2] > CONFIG.case.fenceTopZ) {
      errors.push(`${module.id} exceeds fence height`)
    }
  }

  for (let i = 0; i < modules.length; i += 1) {
    for (let j = i + 1; j < modules.length; j += 1) {
      if (overlaps(modules[i].bounds, modules[j].bounds)) {
        errors.push(`${modules[i].module.id} overlaps ${modules[j].module.id}`)
      }
    }
  }

  return { passed: errors.length === 0, errors, modulesChecked: modules.length }
}

function asBuffer(value) {
  if (Array.isArray(value)) return Buffer.concat(value.map(asBuffer))
  if (Buffer.isBuffer(value)) return value
  if (value instanceof Uint8Array) return Buffer.from(value)
  if (value instanceof ArrayBuffer) return Buffer.from(value)
  if (typeof value === 'string') return Buffer.from(value, 'utf8')
  throw new Error(`Unsupported serializer result: ${typeof value}`)
}

await mkdir(outDir, { recursive: true })

const stlData = stlSerializer.serialize({ binary: true }, shell)
const stlBuffer = asBuffer(stlData)
await writeFile(join(outDir, 'node2_open_top_v1.stl'), stlBuffer)

const threeMfData = threeMfSerializer.serialize(
  {
    unit: 'millimeter',
    metadata: true,
    compress: true,
    defaultcolor: [0.85, 0.88, 0.92, 1],
  },
  shell,
)
const threeMfBuffer = asBuffer(threeMfData)
await writeFile(join(outDir, 'node2_open_top_v1.3mf'), threeMfBuffer)

const bounds = jscad.measurements.measureBoundingBox(shell)
const validation = validateLayout()
const report = {
  generatedAt: new Date().toISOString(),
  config: CONFIG,
  enclosure: enclosureReport(),
  shellBoundingBox: bounds,
  validation,
  files: {
    stl: 'node2_open_top_v1.stl',
    threeMf: 'node2_open_top_v1.3mf',
  },
}
await writeFile(join(outDir, 'node2_open_top_v1_manifest.json'), `${JSON.stringify(report, null, 2)}\n`)

if (!validation.passed) {
  throw new Error(`Layout validation failed: ${validation.errors.join('; ')}`)
}

console.log(`Generated ${join(outDir, 'node2_open_top_v1.stl')}`)
console.log(`Generated ${join(outDir, 'node2_open_top_v1.3mf')}`)
console.log(`Bounding box: ${JSON.stringify(bounds)}`)
console.log(`Layout validation: ${validation.passed ? 'PASS' : 'FAIL'} (${validation.modulesChecked} modules)`)
