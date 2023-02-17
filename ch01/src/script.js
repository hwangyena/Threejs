import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';

/**
 * Debugger
 */
const gui = new GUI();

/**
 * Textures
 */
const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMapTexture = cubeTextureLoader.load([
  '/environmentMaps/0/px.jpg',
  '/environmentMaps/0/nx.jpg',
  '/environmentMaps/0/py.jpg',
  '/environmentMaps/0/ny.jpg',
  '/environmentMaps/0/pz.jpg',
  '/environmentMaps/0/nz.jpg',
]);

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(1, 1, 1);
scene.add(pointLight);

/**
 * Objects
 */
const group = new THREE.Group();

//// MeshStandardMaterial
const material = new THREE.MeshStandardMaterial({
  metalness: 0.7,
  roughness: 0.2,
  envMap: environmentMapTexture,
});

gui.add(material, 'metalness', 0, 1, 0.1);
gui.add(material, 'roughness', 0, 1, 0.1);

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 20, 20), material);
sphere.position.x = -1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 60, 60), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 16, 30),
  material
);
torus.position.x = 1.5;

group.add(sphere).add(plane).add(torus);
scene.add(group);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);

camera.position.set(1, 1, 2);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const loop = () => {
  const elapsedTime = clock.getElapsedTime();

  sphere.rotation.y = 0.2 * elapsedTime;
  plane.rotation.y = 0.2 * elapsedTime;
  torus.rotation.y = 0.2 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  plane.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(loop);
};

loop();
