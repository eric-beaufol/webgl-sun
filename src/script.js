import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import sunFragment from './shaders/sun/fragment.glsl'
import sunVertex from './shaders/sun/vertex.glsl'
import gradientFragment from './shaders/gradient/fragment.glsl'
import gradientVertex from './shaders/gradient/vertex.glsl'
import sunCrownFragment from './shaders/sunCrown/fragment.glsl'
import sunCrownVertex from './shaders/sunCrown/vertex.glsl'

/**
 * Base
 */

// Debug
const gui = new dat.GUI()
const params = {
  scale: 30,
  speed: 1,
  noiseOffset: .6,
  color1: new THREE.Color(0xfcd6a1),
  color2: new THREE.Color(0xffbb00),
  color3: new THREE.Color(0xff6600),
  color4: new THREE.Color(0x662400),
  fresnelPower: .8
}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

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
      uScale: { value: params.scale },
      uSpeed: { value: params.speed },
      uNoiseOffset: { value: params.noiseOffset },
      uColor1: { value: params.color1 },
      uColor2: { value: params.color2 },
      uColor3: { value: params.color3 },
      uColor4: { value: params.color4 }
    },
    wireframe: false
  })
  sun = new THREE.Mesh(geometry, material)

  scene.add(sun)

  gui.add(params, 'scale', 0, 100, .001)
  gui.add(params, 'speed', 0, 10, .001)
  gui.add(params, 'noiseOffset', 0, 1, .001)
  gui.addColor(params, 'color1')
  gui.addColor(params, 'color2')
  gui.addColor(params, 'color3')
  gui.addColor(params, 'color4')
}

/**
 * Sun crown
 */

let sunCrown

{
  const geometry = new THREE.SphereGeometry(2.2, 40, 40)
  const material = new THREE.ShaderMaterial({
    fragmentShader: sunCrownFragment,
    vertexShader: sunCrownVertex,
    uniforms: {
      uFresnelPower: { value: 8 }
    },
    transparent: true,
    side: THREE.BackSide
  })
  sunCrown = new THREE.Mesh(geometry, material)

  scene.add(sunCrown)

  gui.add(params, 'fresnelPower', 0, 10, .001)
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
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

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
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 4.5)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0, 0)
controls.enableDamping = true

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

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - previousTime
  previousTime = elapsedTime

  // Update controls
  controls.update()

  // uniforms update
  sun.material.uniforms.uTime.value = elapsedTime
  sun.material.uniforms.uScale.value = params.scale
  sun.material.uniforms.uSpeed.value = params.speed
  sun.material.uniforms.uNoiseOffset.value = params.noiseOffset
  sun.material.uniforms.uColor1.value = params.color1
  sun.material.uniforms.uColor2.value = params.color2
  sun.material.uniforms.uColor3.value = params.color3
  sun.material.uniforms.uColor4.value = params.color4

  sunCrown.material.uniforms.uFresnelPower.value = params.fresnelPower

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()