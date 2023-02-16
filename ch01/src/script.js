import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';

/**
 * Debug
 */
const gui = new GUI();

/**
 * Textures
 */
//// 방법 1.
// const image = new Image();
// const texture = new THREE.Texture(image);

// image.onload = () => {
//   texture.needsUpdate = true;
// };

// image.src = '/door/color.jpg';

//// loadingManager
const loadingManager = new THREE.LoadingManager();

// loadingManager.onStart = () => {
//   console.log('onStart')
// };
// loadingManager.onLoad = () => {
//   console.log('onLoad');
// };
// loadingManager.onProgress = () => {
//   console.log('onProgress');
// };

//// 방법 2.
const textureLoader = new THREE.TextureLoader(loadingManager);
const colorTexture = textureLoader.load('/door/color.jpg');
const alphaTexture = textureLoader.load('/door/alpha.jpg');
const heightTexture = textureLoader.load('/door/height.jpg');
const normalTexture = textureLoader.load('/door/normal.jpg');
const ambientOcclusionTexture = textureLoader.load(
  '/door/ambientOcclusion.jpg'
);
const metalnessTexture = textureLoader.load('/door/metalness.jpg');
const roughnessTexture = textureLoader.load('/door/roughness.jpg');
const checkerboard = textureLoader.load('/checkerboard-8x8.png');

//// repeat
// colorTexture.repeat.x = 2;
// colorTexture.repeat.y = 3;
// colorTexture.wrapS = THREE.RepeatWrapping;
// colorTexture.wrapT = THREE.RepeatWrapping;
// colorTexture.offset.x = 0.5;

// colorTexture.rotation = Math.PI / 4;
// colorTexture.center.set(0.5, 0.5);

checkerboard.generateMipmaps = false;
checkerboard.minFilter = THREE.NearestFilter;
checkerboard.magFilter = THREE.NearestFilter;

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ map: checkerboard });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Debug
gui.add(mesh.position, 'x', -3, 3, 0.5);
gui.add(mesh.position, 'y', -3, 3, 0.5);
gui.add(mesh.position, 'z').min(-3).max(3).step(0.5).name('z position');

gui.add(mesh, 'visible');
gui.add(material, 'wireframe');

gui.addColor(material, 'color');

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

camera.position.set(1, 1, 4);
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

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
