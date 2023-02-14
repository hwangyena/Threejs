import * as THREE from 'three';

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

const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 })
);
const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x0000ff })
);

cube2.position.x = 2;
cube3.position.y = 2;

group.rotation.z = 2;

group.add(cube1);
group.add(cube2);
group.add(cube3);

// Axes Helper
const axesHelper = new THREE.AxesHelper(2); //길이 설정 가능
scene.add(axesHelper);

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);

camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 3;
scene.add(camera);

// camera.lookAt(new THREE.Vector3(0, 0, 0));

// Renderer
const canvas = document.querySelector('.webgl');

const renderer = new THREE.WebGLRenderer({
  canvas,
});

renderer.setSize(sizes.width, sizes.height); // renderer(canvas) 크기 설정
renderer.render(scene, camera);
