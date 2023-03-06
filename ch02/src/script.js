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

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const particleTexture = textureLoader.load('/particles/2.png');

/**
 * Particles
 */
// const particlesGeometry = new THREE.SphereGeometry(1, 32, 32);
// const particlesMaterial = new THREE.PointsMaterial({
//     size: 0.02,
//     sizeAttenuation: true, // 카메라 거리에 따른 particle 크기
// });
// const particles = new THREE.Points(particlesGeometry, particlesMaterial);
// scene.add(particles);

const particleCount = 5000;

const positions = new Float32Array(particleCount * 3); //x,y,z를 가지므로
const colors = new Float32Array(particleCount * 3); //RGB 이므로

for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 7; //각 vertex의 랜덤 위치 생성
    colors[i] = Math.random();
}
const positionAttribute = new THREE.BufferAttribute(positions, 3); //1 vertex - x,y,z
const colorAttribute = new THREE.BufferAttribute(colors, 3);

const bufferGeometry = new THREE.BufferGeometry();
bufferGeometry.setAttribute('position', positionAttribute);
bufferGeometry.setAttribute('color', colorAttribute);

const bufferMaterial = new THREE.PointsMaterial({
    size: 0.1,
    sizeAttenuation: true,
    // color: '#ff88cc',
    map: particleTexture,
    transparent: true,
    alphaMap: particleTexture,
    // alphaTest: 0.001,
    // depthTest: false,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
});
const buffer = new THREE.Points(bufferGeometry, bufferMaterial);

scene.add(buffer);

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
camera.position.z = 3;
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
    //particle 전체 애니메이션
    // buffer.rotation.y = elapsedTime * 0.1;

    //particle 각각 애니메이션
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3; // x,y,z로 3 곱해줬으므로 => [0,1,2]*i3

        const x = bufferGeometry.attributes.position.array[i3];
        bufferGeometry.attributes.position.array[i3 + 1] = Math.sin(
            elapsedTime + x
        ); //y
        bufferGeometry.attributes.position.needsUpdate = true; //attribute 업데이트를 말해줘야함
    }

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
