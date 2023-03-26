import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';
import CANNON from 'cannon';

/**
 * Debug
 */
const gui = new dat.GUI();

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMapTexture = cubeTextureLoader.load([
  '/textures/environmentMaps/0/px.png',
  '/textures/environmentMaps/0/nx.png',
  '/textures/environmentMaps/0/py.png',
  '/textures/environmentMaps/0/ny.png',
  '/textures/environmentMaps/0/pz.png',
  '/textures/environmentMaps/0/nz.png',
]);

/**
 * Physics
 */
// World
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0); //Vec3 classs

// Materials
const concreteMaterial = new CANNON.Material('concrete'); // params: (name) - 바닥(floorBody)에 부여할 material
const plasticMaterial = new CANNON.Material('plastic'); // params: (name) - 공(sphere)에 부여할 material

const defaultMaterial = new CANNON.Material('default'); // 만나는 body 모두에 적용해줄 기본 material

//// 방법 1. ContactMaterial - concreate + plastic Material
// const concreatePlasticContactMaterial = new CANNON.ContactMaterial(
//   concreteMaterial,
//   plasticMaterial,
//   {
//     friction: 0.1, // 마찰력
//     restitution: 0.7, //번환(default: 0.3)
//   }
// );
// world.addContactMaterial(concreatePlasticContactMaterial);

//// 방법 2. 동일한 Material 사용하기
const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0.1, // 마찰력
    restitution: 0.7, //번환(default: 0.3)
  }
);
world.addContactMaterial(defaultContactMaterial);

// 방법3. wordl 전체에 동일한 Material 사용하기
world.defaultContactMaterial = defaultContactMaterial;

// Sphere
const sphereShape = new CANNON.Sphere(0.5);
const sphereBody = new CANNON.Body({
  mass: 1, // mass가 높은게 더 중량이 크게 작용
  position: new CANNON.Vec3(0, 3, 0),
  shape: sphereShape,
  // material: plasticMaterial, // 방법1
  // material: defaultMaterial, // 방법2
});

world.addBody(sphereBody);

// Floor
const floorShape = new CANNON.Plane(); // infinite plane (이 밖에 있으면 object 관찰 불가능)
const floorBody = new CANNON.Body({
  mass: 0, // 움직이지 않는 물체
  // material: concreteMaterial, // 방법1
  // material: defaultMaterial, // 방법2
});

floorBody.addShape(floorShape);
// floorBody.addShape(floorShape); // Body에 여러개의 shape를 넣을 수 있다.
floorBody.quaternion.setFromAxisAngle(
  new CANNON.Vec3(-1, 0, 0), //axios (축) 위치 지정 - 어느 축으로 회전시킬지?
  Math.PI * 0.5
); // floorBody 회전

world.addBody(floorBody);

/**
 * Test sphere
 */
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5,
  })
);
sphere.castShadow = true;
sphere.position.y = 0.5;
scene.add(sphere);

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: '#777777',
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5,
  })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5; //기존 floor는 | 위치에 있다
scene.add(floor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

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
camera.position.set(-3, 3, 3);
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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // 물리 적용
  world.step(1 / 60, deltaTime, 3); // timestamp | delta(이전으로부터 시간 얼마나 지났는지) | 함수 호출당 수행할 최대 고정 단계 수(????)

  sphere.position.copy(sphereBody.position); // Mesh에 물리엔진 적용

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
