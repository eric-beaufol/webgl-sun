import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import sunFragment from './shaders/sun/fragment.glsl'
import sunVertex from './shaders/sun/vertex.glsl'
import sunTextureFragment from './shaders/sunTexture/fragment.glsl'
import sunTextureVertex from './shaders/sunTexture/vertex.glsl'
import gradientFragment from './shaders/gradient/fragment.glsl'
import gradientVertex from './shaders/gradient/vertex.glsl'
import sunCrownFragment from './shaders/sunCrown/fragment.glsl'
import sunCrownVertex from './shaders/sunCrown/vertex.glsl'
import starFieldFragment from './shaders/starField/fragment.glsl'
import starFieldVertex from './shaders/starField/vertex.glsl'
import protuberanceFragment from './shaders/protuberance/fragment.glsl'
import protuberanceVertex from './shaders/protuberance/vertex.glsl'
import Stats from 'stats.js'

/**
 * Base
 */

// Debug
const gui = new dat.GUI()
const params = {
  scale: 30,
  speed: 1,
  noiseOffset: .77,
  color1: new THREE.Color(0xfcd6a1),
  color2: new THREE.Color(0xffbb00),
  color3: new THREE.Color(0xff6600),
  color4: new THREE.Color(0x662400),
  hotness: 2,
  useColor: false,
  fresnel: 2,
  crownFresnel: 2,
  a: 30,
  b: 19,
}

// Stats
const stats = new Stats()
document.body.appendChild(stats.dom)

// canvas
const canvas = document.querySelector('canvas.webgl')

// Scenes
const scene = new THREE.Scene()
const cubeScene = new THREE.Scene()

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

/**
 * Render target
 */

const renderTargetResolution = innerWidth > 728
  ? 1024
  : 256

const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(renderTargetResolution)
cubeRenderTarget.texture.type = THREE.HalfFloatType
cubeRenderTarget.texture.minFilter = THREE.LinearMipmapLinearFilter
cubeRenderTarget.texture.magFilter = THREE.LinearFilter
cubeRenderTarget.texture.generateMipmaps = true

/**
 * Camera
 */
// Base camera
const cameraZ = innerWidth > 728
  ? 4.5
  : 6
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 20)
camera.position.set(0, 0, cameraZ)
scene.add(camera)

// Cube camera
const cubeCamera = new THREE.CubeCamera(0.1, 20, cubeRenderTarget)
cubeScene.add(cubeCamera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0, 0)
controls.enableDamping = true
controls.autoRotateSpeed = 0.5
// controls.autoRotate = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Sun texture
 */

let sunTexture

{
  const geometry = new THREE.SphereGeometry(2, 40, 40)
  const material = new THREE.ShaderMaterial({
    fragmentShader: sunTextureFragment,
    vertexShader: sunTextureVertex,
    uniforms: {
      uTime: { value: 0 },
      uScale: { value: params.scale },
      uSpeed: { value: params.speed },
      uNoiseOffset: { value: params.noiseOffset },
      uColor1: { value: params.color1 },
      uColor2: { value: params.color2 },
      uColor3: { value: params.color3 },
      uColor4: { value: params.color4 },
      uHotnessA: { value: params.hotness },
      uUseColor: { value: params.useColor },
    },
    side: THREE.DoubleSide
  })

  sunTexture = new THREE.Mesh(geometry, material)
  cubeScene.add(sunTexture)

  const sunFolder = gui.addFolder('sun')
  sunFolder.add(params, 'scale', 0, 100, .001)
  sunFolder.add(params, 'speed', 0, 10, .001)
  sunFolder.add(params, 'noiseOffset', -1, 2, .001)
  sunFolder.add(params, 'fresnel', 0, 4, .001)
  sunFolder.addColor(params, 'color1')
  sunFolder.addColor(params, 'color2')
  sunFolder.addColor(params, 'color3')
  sunFolder.addColor(params, 'color4')
  sunFolder.add(params, 'hotness', 1, 6, .001)
  sunFolder.add(params, 'useColor', 0.1, 4, .001)
  sunFolder.close()
}

/**
 * Sun
 */

let sun

{
  const geometry = new THREE.SphereGeometry(2, 40, 40)
  const material = new THREE.ShaderMaterial({
    fragmentShader: sunFragment,
    vertexShader: sunVertex,
    uniforms: {
      uTime: { value: 0 },
      uCubemap: { value: null },
      uFresnelPower: { value: params.fresnelPower },
    },
  })

  sun = new THREE.Mesh(geometry, material)
  scene.add(sun)
}

/**
 * Sun crown
 */

let sunCrown

{
  const geometry = new THREE.SphereGeometry(3, 100, 100)
  const material = new THREE.ShaderMaterial({
    fragmentShader: sunCrownFragment,
    vertexShader: sunCrownVertex,
    uniforms: {
      uFresnelPower: { value: params.crownFresnel },
      uA: { value: params.a },
      uB: { value: params.b },
      uHotnessA: { value: params.hotness }
    },
    transparent: true,
    side: THREE.BackSide,
    depthWrite: false
  })
  sunCrown = new THREE.Mesh(geometry, material)

  scene.add(sunCrown)

  const crownFolder = gui.addFolder('crown')
  crownFolder.add(params, 'crownFresnel', 0, 10, .001)
  crownFolder.add(params, 'a', 0, 30, .001)
  crownFolder.add(params, 'b', 0, 20, .001)
  crownFolder.close()
}

/**
 * Gradient test
 */
{
  const geometry = new THREE.PlaneGeometry(6, 2)

  const material = new THREE.ShaderMaterial({
    fragmentShader: gradientFragment,
    vertexShader: gradientVertex
  })
  const mesh = new THREE.Mesh(geometry, material)

  // scene.add(mesh)
}

/**
 * Star field
 */
let starField
{

  const skySize = 20
  const starLength = 10000
  const vertices = []

  const getStarFieldPosition = () => {
    const position = new THREE.Vector3(
      THREE.MathUtils.randFloatSpread(skySize),
      THREE.MathUtils.randFloatSpread(skySize),
      THREE.MathUtils.randFloatSpread(skySize)
    )

    if (position.length() <= camera.position.length()) {
      return getStarFieldPosition()
    }

    return position
  }

  for (let i = 0; i < starLength; i+=3) {
    const {x, y, z } = getStarFieldPosition()

    vertices.push(x, y, z)
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  // const material = new THREE.PointsMaterial({ color: 0xffffff, size: .01 })
  const material = new THREE.ShaderMaterial({
    vertexShader: starFieldVertex,
    fragmentShader: starFieldFragment,
    transparent: true
  })
  starField = new THREE.Points(geometry, material)

  scene.add(starField)
}

/**
 * Protuberance
 */
let protuberance
{
  const geometry = new THREE.PlaneGeometry(.2, 1, 50, 50)
  const material = new THREE.ShaderMaterial({
    vertexShader: protuberanceVertex,
    fragmentShader: protuberanceFragment,
    side: THREE.DoubleSide,
    transparent: true,
    uniforms: {
      uTime: { value: 0 }
    }
  })
  protuberance = new THREE.Mesh(geometry, material)
  protuberance.position.set(0, 0, 2)

  scene.add(protuberance)
}

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {
  stats.begin()

  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - previousTime
  previousTime = elapsedTime

  // Update controls
  controls.update(elapsedTime)

  // Render target
  cubeCamera.update(renderer, cubeScene)

  // uniforms update
  sun.material.uniforms.uCubemap.value = cubeRenderTarget.texture
  sun.material.uniforms.uTime.value = elapsedTime
  sun.material.uniforms.uFresnelPower.value = params.fresnel

  sunTexture.material.uniforms.uTime.value = elapsedTime
  sunTexture.material.uniforms.uScale.value = params.scale
  sunTexture.material.uniforms.uSpeed.value = params.speed
  sunTexture.material.uniforms.uNoiseOffset.value = params.noiseOffset
  sunTexture.material.uniforms.uColor1.value = params.color1
  sunTexture.material.uniforms.uColor2.value = params.color2
  sunTexture.material.uniforms.uColor3.value = params.color3
  sunTexture.material.uniforms.uColor4.value = params.color4
  sunTexture.material.uniforms.uHotnessA.value = params.hotness
  sunTexture.material.uniforms.uUseColor.value = params.useColor

  sunCrown.material.uniforms.uFresnelPower.value = params.crownFresnel
  sunCrown.material.uniforms.uA.value = params.a
  sunCrown.material.uniforms.uB.value = params.b
  sunCrown.material.uniforms.uHotnessA.value = params.hotness

  protuberance.material.uniforms.uTime.value = elapsedTime

  // Render
  renderer.render(scene, camera)

  stats.end()

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()