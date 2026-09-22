import jscad from '@jscad/modeling'
import { CONFIG } from './config.mjs'

const { primitives, booleans, transforms, extrusions } = jscad
const { cuboid } = primitives
const { union, subtract } = booleans
const { translate, rotateY, rotateZ } = transforms
const { extrudeLinear } = extrusions

function curvedBaseProfile() {
  const halfW = CONFIG.case.curveHalfWidth
  const base = CONFIG.case.baseSlabThickness
  const sagitta = CONFIG.case.bottomSagitta
  const points = []
  const steps = 32

  points.push([-halfW, 0])
  points.push([halfW, 0])

  for (let i = steps; i >= 0; i -= 1) {
    const x = -halfW + (2 * halfW * i) / steps
    const t = x / halfW
    const z = -base - sagitta * (1 - t * t)
    points.push([x, z])
  }

  return points
}

function createCurvedBase() {
  const profile = primitives.polygon({ points: curvedBaseProfile().reverse() })
  const extruded = extrudeLinear({ height: CONFIG.case.length }, profile)
  // Local (width, depth, length) -> world (length, width, depth)
  return translate([-CONFIG.case.length / 2, 0, 0], rotateY(Math.PI / 2, rotateZ(Math.PI / 2, extruded)))
}

function createFence() {
  const { length, width, wallThickness: t, fenceTopZ: h } = CONFIG.case
  const overlap = 1
  const sideWalls = [
    cuboid({ size: [length, t, h + overlap], center: [0, width / 2 - t / 2, h / 2 - overlap / 2] }),
    cuboid({ size: [length, t, h + overlap], center: [0, -width / 2 + t / 2, h / 2 - overlap / 2] }),
  ]
  const endWalls = [
    cuboid({ size: [t, width, h + overlap], center: [length / 2 - t / 2, 0, h / 2 - overlap / 2] }),
    cuboid({ size: [t, width, h + overlap], center: [-length / 2 + t / 2, 0, h / 2 - overlap / 2] }),
  ]
  return union(sideWalls, endWalls, createIcmPartition())
}

function createIcmPartition() {
  const { fenceTopZ: h, icmPartition: p } = CONFIG.case
  const overlap = 1
  return cuboid({
    size: [p.thickness, p.maxY - p.minY, h + overlap],
    center: [p.x, (p.minY + p.maxY) / 2, h / 2 - overlap / 2],
  })
}

export function internalObstacles() {
  const { icmPartition: p } = CONFIG.case
  return [
    {
      id: 'icm-partition',
      bounds: {
        minX: p.x - p.thickness / 2,
        maxX: p.x + p.thickness / 2,
        minY: p.minY,
        maxY: p.maxY,
      },
    },
  ]
}

function createEarHook(x, side) {
  const { width, wallThickness: t } = CONFIG.case
  const { slotLength, earDepth, railThickness, railHeight, postHeight, zCenter } = CONFIG.ears
  const outerY = side * (width / 2 + earDepth / 2 - t * 0.25)
  const rail = cuboid({
    size: [slotLength, earDepth, railHeight],
    center: [x, outerY, zCenter],
  })
  const leftPost = cuboid({
    size: [railThickness, earDepth, postHeight],
    center: [x - slotLength / 2 + railThickness / 2, outerY, zCenter + postHeight / 2],
  })
  const rightPost = cuboid({
    size: [railThickness, earDepth, postHeight],
    center: [x + slotLength / 2 - railThickness / 2, outerY, zCenter + postHeight / 2],
  })
  return union(rail, leftPost, rightPost)
}

function createEars() {
  const ears = []
  for (const x of CONFIG.ears.xPositions) {
    ears.push(createEarHook(x, 1))
    ears.push(createEarHook(x, -1))
  }
  return union(ears)
}

function createPortCuts() {
  const cuts = []
  const esp = CONFIG.ports.espCom
  cuts.push(
    cuboid({
      size: [esp.size[0] + 4, esp.size[1], esp.size[2]],
      center: [esp.x, esp.y, esp.z],
    }),
  )

  const tp = CONFIG.ports.tp4057Charge
  cuts.push(
    cuboid({
      size: [tp.size[0], tp.size[1] + 4, tp.size[2]],
      center: [tp.x, tp.y, tp.z],
    }),
  )
  return union(cuts)
}

export function buildShell() {
  const shell = union(createCurvedBase(), createFence(), createEars())
  return subtract(shell, createPortCuts())
}

export function debugParts() {
  return {
    base: createCurvedBase(),
    fence: createFence(),
    ears: createEars(),
    ports: createPortCuts(),
  }
}

export function modulePlaceholders() {
  return CONFIG.modules.map((module) => ({
    ...module,
    box: cuboid({
      size: module.size,
      center: [module.center[0], module.center[1], module.size[2] / 2],
    }),
  }))
}

export function enclosureReport() {
  const { case: c } = CONFIG
  return {
    model: CONFIG.name,
    revision: CONFIG.revision,
    units: CONFIG.units,
    outerNominal: [c.length, c.width, c.height],
    outerDeepestZ: -(c.baseSlabThickness + c.bottomSagitta),
    fenceTopZ: c.fenceTopZ,
    internalNominal: [c.length - 2 * c.wallThickness, c.width - 2 * c.wallThickness, c.fenceTopZ],
    topStyle: 'open-fence-no-lid',
    armCircumferenceMm: CONFIG.measuredInputs.arm.flexedCircumferenceMm,
    bottomCurve: { chordMm: c.width, sagittaMm: c.bottomSagitta, style: 'shallow-arm-cradle' },
  }
}
