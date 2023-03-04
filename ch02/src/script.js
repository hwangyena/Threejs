import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Fog
const fog = new THREE.Fog('#262837', 2, 10);
scene.fog = fog;

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const doorTexture = textureLoader.load('/door/color.jpg');
const doorAlphaTexture = textureLoader.load('/door/alpha.jpg');
const doorAmbientOcclusionTexture = textureLoader.load(
    '/door/ambientOcclusion.jpg'
);
const doorHeightTexture = textureLoader.load('/door/height.jpg');
const doorNormalTexture = textureLoader.load('/door/normal.jpg');
const doorMetalnessTexture = textureLoader.load('/door/metalness.jpg');
const doorRoughnessTexture = textureLoader.load('/door/roughness.jpg');

const bricksTexture = textureLoader.load('/bricks/color.jpg');
const bricksNormalTexture = textureLoader.load('/bricks/normal.jpg');
const bricksRoughnessTexture = textureLoader.load('/bricks/roughness.jpg');
const bricksAmbientOcclusionTexture = textureLoader.load(
    '/bricks/ambientOcclusion.jpg'
);

const grassTexture = textureLoader.load('/grass/color.jpg');
const grassNormalTexture = textureLoader.load('/grass/normal.jpg');
const grassRoughnessTexture = textureLoader.load('/grass/roughness.jpg');
const grassAmbientOcclusionTexture = textureLoader.load(
    '/grass/ambientOcclusion.jpg'
);

grassTexture.repeat.set(8, 8);
grassTexture.wrapS = THREE.RepeatWrapping;
grassTexture.wrapT = THREE.RepeatWrapping;
grassNormalTexture.repeat.set(8, 8);
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassRoughnessTexture.repeat.set(8, 8);
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.repeat.set(8, 8);
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;

/**
 * House
 */
const house = new THREE.Group();

// Door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial({
        map: doorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.2,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture,
    })
);

door.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);
door.position.set(0, 1, 2 + 0.01);
house.add(door);

// Bricks
const bricks = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
        map: bricksTexture,
        aoMap: bricksAmbientOcclusionTexture,
        normalMap: bricksNormalTexture,
        roughnessMap: bricksRoughnessTexture,
    })
);

bricks.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(bricks.geometry.attributes.uv.array, 2)
);
bricks.position.set(0, 1.25);
house.add(bricks);

// roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial({ color: '#b35f45' })
);
roof.rotation.y = Math.PI * 0.25;
roof.position.y = 2.5 + 1 / 2;
house.add(roof);

// bushes
const bushGeometry = new THREE.SphereGeometry(0.5, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: '#89c854' });

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.position.set(1, 0.3, 2.5);
const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.position.set(1.6, 0.2, 2.5);
bush2.scale.set(0.5, 0.6, 0.6);
const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.position.set(-1, 0.3, 2.5);
bush3.scale.set(0.8, 0.8, 0.8);

house.add(bush1);
house.add(bush2);
house.add(bush3);

scene.add(house);

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        map: grassTexture,
        aoMap: grassAmbientOcclusionTexture,
        normalMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture,
    })
);

floor.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
);
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
scene.add(floor);

// Graves
const graves = new THREE.Group();

const graveGrometry = new THREE.BoxGeometry(0.5, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: '#b2b6b1' });

for (let i = 0; i < 30; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 4 + Math.random() * 6;

    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;

    const grave = new THREE.Mesh(graveGrometry, graveMaterial);
    grave.position.set(x, 0.4, z);
    grave.rotation.y = (Math.random() - 0.5) * 0.4;
    grave.rotation.z = (Math.random() - 0.5) * 0.3;
    graves.add(grave);
}

scene.add(graves);

// ghost
const ghost = new THREE.PointLight('#ff7d46', 2, 3);
scene.add(ghost);
const ghost2 = new THREE.PointLight('#00ffdd', 2, 3);
scene.add(ghost2);
const ghost3 = new THREE.PointLight('#aaddff', 2, 3);
scene.add(ghost3);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.3);
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.3);
moonLight.position.set(4, 5, -2);
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001);
gui.add(moonLight.position, 'x').min(-5).max(5).step(0.001);
gui.add(moonLight.position, 'y').min(-5).max(5).step(0.001);
gui.add(moonLight.position, 'z').min(-5).max(5).step(0.001);
scene.add(moonLight);

// Door light
const doorLight = new THREE.PointLight('#ff7d46', 1, 7);
doorLight.position.set(0, 2.2, 2.7);
house.add(doorLight);

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
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
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
renderer.setClearColor('#262837');

// Shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

moonLight.castShadow = true;
doorLight.castShadow = true;
ghost.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;
bricks.castShadow = true;
bush1.castShadow = true;
bush2.castShadow = true;
bush3.castShadow = true;

floor.receiveShadow = true;

doorLight.shadow.mapSize.width = 256;
doorLight.shadow.mapSize.height = 256;
doorLight.shadow.camera.far = 7;
ghost.shadow.mapSize.width = 256;
ghost.shadow.mapSize.height = 256;
ghost.shadow.camera.far = 7;
ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 7;
ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 7;

/**
 * Helper
 */
const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update Ghost
    const ghostAngle = elapsedTime;
    ghost.position.x = Math.cos(ghostAngle) * 5;
    ghost.position.z = Math.sin(ghostAngle) * 5;
    ghost.position.y = Math.sin(elapsedTime * 5);

    const ghostAngle2 = elapsedTime * 0.3;
    ghost2.position.x = Math.cos(ghostAngle2) * 3;
    ghost2.position.z = Math.sin(ghostAngle2) * 3;
    ghost2.position.y = Math.sin(elapsedTime * 4);

    const ghostAngle3 = elapsedTime * 1.2;
    ghost3.position.x =
        Math.cos(ghostAngle3) * (7 + Math.sin(elapsedTime * 0.2)); //7은 거리
    ghost3.position.z =
        Math.sin(ghostAngle3) * (7 + Math.sin(elapsedTime * 0.5));
    ghost3.position.y = Math.sin(elapsedTime * 3) + Math.sin(elapsedTime * 2);

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
