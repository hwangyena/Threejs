import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 300 });

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Galaxy
 */
const parameters = {
    count: 10000,
    size: 0.02,
    radius: 3,
    branches: 3,
    spin: 1,
    randomness: 0.1,
    randomnessPower: 3,
    insideColor: '#ff6030',
    outsideColor: '#1b3984',
};

let geometry = null;
let material = null;
let points = null;

const generateGalaxy = () => {
    // 이전 내용 삭제
    if (points !== null) {
        geometry.dispose(); // 메모리 해제
        material.dispose();
        scene.remove(points);
    }

    // Geometry
    geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(parameters.count * 3); // xyz
    const colors = new Float32Array(parameters.count * 3); // RGB

    const colorInside = new THREE.Color(parameters.insideColor);
    const colorOutside = new THREE.Color(parameters.outsideColor);

    for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3;

        // Position
        const radius = Math.random() * parameters.radius; // 0 ~ 반지름까지 랜덤 값
        const spinAngle = radius * parameters.spin; // radius에서 멀어질수록 더 큰 spin 필요
        const branchAngle =
            ((i % parameters.branches) / parameters.branches) * Math.PI * 2; // 0 ~ 1까지의 값 * 1바퀴 돌때 위치

        // 균일하게 퍼져있는 나선형
        // const [randomX, randomY, randomZ] = [
        //     (Math.random() - 0.5) * parameters.randomness,
        //     (Math.random() - 0.5) * parameters.randomness,
        //     (Math.random() - 0.5) * parameters.randomness,
        // ];

        // 가운데로 집중되어 있는 나선형
        const [randomX, randomY, randomZ] = [
            Math.pow(Math.random(), parameters.randomnessPower) *
                (Math.random() < 0.5 ? 1 : -1),
            Math.pow(Math.random(), parameters.randomnessPower) *
                (Math.random() < 0.5 ? 1 : -1),
            Math.pow(Math.random(), parameters.randomnessPower) *
                (Math.random() < 0.5 ? 1 : -1),
        ];

        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX; //x
        positions[i3 + 1] = 0 + randomY; //y
        positions[i3 + 2] =
            Math.sin(branchAngle + spinAngle) * radius + randomZ; //z

        // Color
        const mixedColor = colorInside.clone();
        mixedColor.lerp(colorOutside, radius / parameters.radius); //mixedColor(0) + colorOutside(1) 색상 섞은 정도 (0~1 정도)

        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Material
    material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
    });

    // Points
    points = new THREE.Points(geometry, material);
    scene.add(points);
};

generateGalaxy();

gui.add(parameters, 'count')
    .min(10)
    .max(100000)
    .step(100)
    .onFinishChange(generateGalaxy);
gui.add(parameters, 'size')
    .min(0.001)
    .max(0.1)
    .step(0.001)
    .onFinishChange(generateGalaxy);
gui.add(parameters, 'radius')
    .min(0.01)
    .max(20)
    .step(0.01)
    .onFinishChange(generateGalaxy);
gui.add(parameters, 'branches')
    .min(2)
    .max(20)
    .step(1)
    .onFinishChange(generateGalaxy);
gui.add(parameters, 'spin')
    .min(-5)
    .max(5)
    .step(0.01)
    .onFinishChange(generateGalaxy);
gui.add(parameters, 'randomness')
    .min(0)
    .max(2)
    .step(0.01)
    .onFinishChange(generateGalaxy);
gui.add(parameters, 'randomnessPower')
    .min(1)
    .max(10)
    .step(0.1)
    .onFinishChange(generateGalaxy);
gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy);
gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy);
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
camera.position.x = 3;
camera.position.y = 3;
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

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
