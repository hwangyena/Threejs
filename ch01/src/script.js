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
const textureLoader = new THREE.TextureLoader();

const doorTexture = textureLoader.load('/door/color.jpg');
const alphaTexture = textureLoader.load('/door/alpha.jpg');
const mapcapsTexture = textureLoader.load('/matcaps/3.png');
const gradientTexture = textureLoader.load('/gradients/3.jpg');
const ambientOcclusionTexture = textureLoader.load(
  '/door/ambientOcclusion.jpg'
);
const heightTexture = textureLoader.load('/door/height.jpg');
const metalnessTexture = textureLoader.load('/door/metalness.jpg');
const roughnessTexture = textureLoader.load('/door/roughness.jpg');
const normalTexture = textureLoader.load('/door/normal.jpg');

gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;
gradientTexture.generateMipmaps = false;

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
// const material = new THREE.MeshBasicMaterial({
//   color: 'green',
//   map: doorTexture,
//   opacity: 0.7,
//   transparent: true,
//   alphaMap: doorAlphaTexture,
//   side: THREE.BackSide,
// });

//// MeshNormalMaterial
// const material = new THREE.MeshNormalMaterial({
//   flatShading: true,
// });

//// MeshMatcapMaterial
// const material = new THREE.MeshMatcapMaterial({
//   matcap: mapcapsTexture,
// });

//// MeshDepthMaterial
// const material = new THREE.MeshDepthMaterial();

//// MeshLambertMaterial
// const material = new THREE.MeshLambertMaterial();

//// MeshPhongMaterial
// const material = new THREE.MeshPhongMaterial({
//   shininess: 100,
//   specular: new THREE.Color(0xff0000),
// });

//// MeshToonMaterial
// const material = new THREE.MeshToonMaterial({ gradientMap: gradientTexture });

//// MeshStandardMaterial
const material = new THREE.MeshStandardMaterial({
  // metalness: 0.5,
  // roughness: 0.5,
  map: doorTexture,
  aoMap: ambientOcclusionTexture,
  aoMapIntensity: 2,
  displacementMap: heightTexture,
  displacementScale: 0.1,
  metalnessMap: metalnessTexture,
  roughnessMap: roughnessTexture,
  normalMap: normalTexture,
  normalScale: new THREE.Vector2(0.5, 0.5),
  alphaMap: alphaTexture,
  transparent: true,
});

gui.add(material, 'metalness', 0, 1, 0.1);
gui.add(material, 'roughness', 0, 1, 0.1);
gui.add(material, 'aoMapIntensity', 0, 10, 1);
gui.add(material, 'displacementScale', 0, 1, 0.1);
gui.add(material.normalScale, 'x', 0, 1, 0.1);
gui.add(material.normalScale, 'y', 0, 1, 0.1);

// material.color.set('pink');
// material.color = new THREE.Color('pink');

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 20, 20), material);
sphere.position.x = -1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 60, 60), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 16, 30),
  material
);
torus.position.x = 1.5;

// aoMap 예제
sphere.geometry.setAttribute(
  'uv2',
  new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
);
plane.geometry.setAttribute(
  'uv2',
  new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
);
torus.geometry.setAttribute(
  'uv2',
  new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
);

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
