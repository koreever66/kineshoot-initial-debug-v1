import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { STLLoader } from 'three/addons/loaders/STLLoader.js'

const app = document.querySelector('#app')
const stats = document.querySelector('#stats')
const legend = document.querySelector('#legend')
const params = new URLSearchParams(location.search)
const requestedView = params.get('view') || 'iso'

const scene = new THREE.Scene()
scene.background = new THREE.Color('#0f172a')

const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true })
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
app.appendChild(renderer.domElement)

const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 2000)
camera.up.set(0, 0, 1)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.target.set(0, 0, 2)

scene.add(new THREE.HemisphereLight(0xffffff, 0x1e293b, 2.2))
const keyLight = new THREE.DirectionalLight(0xffffff, 4)
keyLight.position.set(140, -180, 220)
scene.add(keyLight)
const fillLight = new THREE.DirectionalLight(0x93c5fd, 2)
fillLight.position.set(-160, 120, 120)
scene.add(fillLight)

const grid = new THREE.GridHelper(300, 30, 0x334155, 0x1e293b)
grid.rotation.x = Math.PI / 2
grid.position.z = -11
scene.add(grid)

let shellMesh = null
let moduleGroup = null
let shellOpaque = false

function setView(name) {
  if (name === 'top') camera.position.set(0, 0, 250)
  else if (name === 'side') camera.position.set(0, -250, 65)
  else camera.position.set(190, -170, 145)
  controls.target.set(0, 0, 2)
  controls.update()
}

function addLegend(manifest) {
  const rows = manifest.config.modules.map((module) => `
    <div class=legend-row><span class=swatch style=background:${module.color}></span><span>${module.label}</span></div>
  `)
  legend.innerHTML = rows.join('')
  stats.textContent = [
    `outer: ${manifest.enclosure.outerNominal.join(' x ')} mm`,
    `internal: ${manifest.enclosure.internalNominal.map((v) => v.toFixed(1)).join(' x ')} mm`,
    `top: ${manifest.enclosure.topStyle}`,
    `arm circumference: ${manifest.enclosure.armCircumferenceMm} mm`,
  ].join('\n')
}

function addModules(manifest) {
  moduleGroup = new THREE.Group()
  for (const module of manifest.config.modules) {
    const [sx, sy, sz] = module.size
    const geometry = new THREE.BoxGeometry(sx, sy, sz)
    const material = new THREE.MeshStandardMaterial({
      color: module.color,
      roughness: 0.55,
      metalness: 0.05,
      transparent: true,
      opacity: 0.92,
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(module.center[0], module.center[1], sz / 2 + 0.3)
    mesh.castShadow = true
    mesh.receiveShadow = true
    moduleGroup.add(mesh)
  }
  for (const channel of manifest.config.wireChannels) {
    const [sx, sy] = channel.size
    const sz = channel.z
    const geometry = new THREE.BoxGeometry(sx, sy, sz)
    const material = new THREE.MeshStandardMaterial({
      color: channel.color,
      transparent: true,
      opacity: 0.24,
      roughness: 0.6,
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(channel.center[0], channel.center[1], channel.z / 2 + 0.2)
    moduleGroup.add(mesh)
  }
  scene.add(moduleGroup)
}

function applyShellMaterial() {
  if (!shellMesh) return
  shellMesh.material.transparent = !shellOpaque
  shellMesh.material.opacity = shellOpaque ? 1 : 0.58
  shellMesh.material.depthWrite = shellOpaque
  shellMesh.material.needsUpdate = true
}

async function loadModel() {
  const manifest = await fetch('./out/node2_open_top_v1_manifest.json').then((r) => r.json())
  addLegend(manifest)
  addModules(manifest)

  const stl = await new STLLoader().loadAsync('./out/node2_open_top_v1.stl')
  stl.computeVertexNormals()
  const material = new THREE.MeshStandardMaterial({
    color: 0xdbeafe,
    roughness: 0.72,
    metalness: 0.02,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.58,
  })
  shellMesh = new THREE.Mesh(stl, material)
  shellMesh.castShadow = true
  shellMesh.receiveShadow = true
  scene.add(shellMesh)
  applyShellMaterial()
  setView(requestedView)
  window.__viewerReady = true
}

document.querySelectorAll('[data-view]').forEach((button) => {
  button.addEventListener('click', () => setView(button.dataset.view))
})
document.querySelector('#toggleModules').addEventListener('click', () => {
  if (moduleGroup) moduleGroup.visible = !moduleGroup.visible
})
document.querySelector('#toggleShell').addEventListener('click', () => {
  shellOpaque = !shellOpaque
  applyShellMaterial()
})

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}
animate()
loadModel().catch((error) => {
  console.error(error)
  stats.textContent = `load error: ${error.message}`
})
