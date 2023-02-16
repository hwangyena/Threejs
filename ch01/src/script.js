import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

/**
 * Threejs
 */

// Scene
const scene = new THREE.Scene();

// Size
const sizes = {
  width: 800,
  height: 600,
};

// Objects
const group = new THREE.Group();
scene.add(group);

const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);

group.add(mesh);

// Axes Helper
const axesHelper = new THREE.AxesHelper(2); //길이 설정 가능
scene.add(axesHelper);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  1,
  1000
);

// const aspectRatio = sizes.width / sizes.height;
// const camera = new THREE.OrthographicCamera(
//   -1 * aspectRatio,
//   1 * aspectRatio,
//   1,
//   -1
// );

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
renderer.render(scene, camera);

/**
 * Cursor
 */
const cursor = { x: 0, y: 0 };

window.addEventListener('mousemove', (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = -(event.clientY / sizes.height - 0.5);
});

/**
 * Animation
 */
const loop = () => {
  // camera.position.x = cursor.x * 10;
  // camera.position.y = cursor.y * 10;
  // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
  // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
  // camera.position.y = cursor.y * 5;
  // camera.lookAt(mesh.position);

  renderer.render(scene, camera);

  controls.update();

  window.requestAnimationFrame(loop);
};

loop();
