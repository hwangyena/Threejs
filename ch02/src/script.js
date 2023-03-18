import * as THREE from 'three';
import * as dat from 'lil-gui';
import gsap from 'gsap';

/**
 * Debug
 */
const gui = new dat.GUI();

const parameters = {
  materialColor: '#E96479',
};

gui.addColor(parameters, 'materialColor').onChange(() => {
  material.color.set(parameters.materialColor);
});

const textureLoader = new THREE.TextureLoader();
const gradientTexture = textureLoader.load('/gradients/3.jpg');
gradientTexture.magFilter = THREE.NearestFilter; // gradient 단계별 섀딩 선택 가능, 없으면 스무스하게 적용됨

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

const material = new THREE.MeshToonMaterial({
  color: parameters.materialColor,
  gradientMap: gradientTexture,
});

const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);
const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);
const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material
);

scene.add(mesh1, mesh2, mesh3);

const objectsDistance = 4;

mesh1.position.y = -objectsDistance * 0;
mesh2.position.y = -objectsDistance * 1;
mesh3.position.y = -objectsDistance * 2;

mesh1.position.x = 2;
mesh2.position.x = -2;
mesh3.position.x = 2;

const sectionMeshes = [mesh1, mesh2, mesh3];

/**
 * Particles
 */
const count = 200;

const positions = new Float32Array(count * 3); //x,y,z를 가지므로
for (let i = 0; i < count; i++) {
  positions[i * 3 + 0] = (Math.random() - 0.5) * 10; //x
  positions[i * 3 + 1] =
    objectsDistance / 2 -
    Math.random() * objectsDistance * sectionMeshes.length; //y - 위(현재 화면 distance 1/2)부터 아래(objectDistance)까지
  positions[i * 3 + 2] = (Math.random() - 0.5) * 10; //z
}

const bufferGeometry = new THREE.BufferGeometry();
bufferGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(positions, 3)
);

const bufferMaterial = new THREE.PointsMaterial({
  size: 0.02,
  sizeAttenuation: true, // 크기가 카메라 위치에 따라 변하는지
});

const buffer = new THREE.Points(bufferGeometry, bufferMaterial);

scene.add(buffer);

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 1);
directionalLight.position.set(1, 1, 0);
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
// Group
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

// Base camera
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 6;
cameraGroup.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true, //캔버스를 HTML 뒤에 나둘 때 사용 (검정 배경색 없애줌)
});

// renderer.setClearAlpha(1); //0:흰 ~ 1:검 알파 설정 가능
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * 스크롤
 */

let currentSection = 0;

window.addEventListener('scroll', () => {
  const newSection = Math.round(window.scrollY / sizes.height); // 스크롤위치 / 현재 viewport

  if (newSection !== currentSection) {
    currentSection = newSection;

    gsap.to(sectionMeshes[currentSection].rotation, {
      duration: 1.5,
      x: '+=3',
      y: '+=5',
      z: '+=1.5',
    });
  }
});

/**
 * Cursor
 */
const cursor = {
  x: 0,
  y: 0,
};

window.addEventListener('mousemove', (e) => {
  cursor.x = (e.clientX / sizes.width) * 0.2 - 0.5; //-0.5 ~ 0.5
  cursor.y = (e.clientY / sizes.height) * 0.2 - 0.5; //-0.5 ~ 0.5
});

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0; // 1 frame별로 걸리는 시간을 정확히 계산하기 위함 (그냥 elapsedTime 사용하면 계속 증가하므로)

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Camera Animation
  // const scrollHeight = document.documentElement.scrollHeight;
  // const maxCamera = objectsDistance * 2;
  // camera.position.y =
  //   -maxCamera / ((scrollHeight - window.innerHeight) / window.scrollY); //max: objectDistance*2
  // 또는...
  camera.position.y = (-window.scrollY / sizes.height) * objectsDistance;

  // Cursor Animation
  const parallaxX = cursor.x * 0.5;
  const parallaxY = -cursor.y * 0.5;
  cameraGroup.position.x +=
    (parallaxX - cameraGroup.position.x) * 10 * deltaTime; //cursor:목적지, cameraGroup position: 현재 위치, 0.1: 10%만큼만 이동
  cameraGroup.position.y +=
    (parallaxY - cameraGroup.position.y) * 10 * deltaTime;

  // Mesh Animation
  for (const mesh of sectionMeshes) {
    mesh.rotation.x += deltaTime * 0.1; // gsap 애니메이션에도 적용가능 하도록 frame마다 rotation 플러스
    mesh.rotation.z += deltaTime * 0.2;
  }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
