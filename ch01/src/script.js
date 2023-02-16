import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

/**
 * Threejs
 */

// Scene
const scene = new THREE.Scene();

// Size
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

// Objects
// const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);

//// Triangle Geometry
// const positionArray = new Float32Array([
//   0, 0, 0, // vertex 1 - x, y, z
//   0, 1, 0,
//   1, 0, 0,
// ]);

// const positionAttribute = new THREE.BufferAttribute(positionArray, 3);

const geometry = new THREE.BufferGeometry();

const count = 50;
const positionArray = new Float32Array(count * 3 * 3); // 각 삼각형은 3개의 vertex, 3개의 x,y,z position을 가짐

for (let i = 0; i < count * 3 * 3; i++) {
  positionArray[i] = Math.random() - 0.5; // -0.5 ~ 0.5 사이에 위치
}

const positionAttribute = new THREE.BufferAttribute(positionArray, 3);
geometry.setAttribute('position', positionAttribute);

const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true,
});

const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

// Axes Helper
const axesHelper = new THREE.AxesHelper(2); //길이 설정 가능
scene.add(axesHelper);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);

camera.position.z = 3;
scene.add(camera);

camera.lookAt(mesh.position);

// Renderer
const canvas = document.querySelector('.webgl');

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({
  canvas,
});

renderer.setSize(sizes.width, sizes.height); // renderer(canvas) 크기 설정
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animation
 */
const loop = () => {
  renderer.render(scene, camera);

  controls.update();

  window.requestAnimationFrame(loop);
};

loop();
