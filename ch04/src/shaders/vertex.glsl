uniform float uSize;
uniform float uTime;

attribute float scale; // attribute로 설정해준 scale
attribute vec3 randomness; // attribute로 설정해준 randomness

varying vec3 vColor;

void main(){
  // 위치
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // spin 애니메이션
  float angle = atan(modelPosition.x, modelPosition.z);
  float distanceToCenter = length(modelPosition.xz); // particle 중앙으로부터 위치
  float angleOffset = (1.0 / distanceToCenter) * uTime * 0.2; // 중앙에서 멀어져도 동일한 속도 유지

  angle += angleOffset; // angle 변화
  modelPosition.x = cos(angle) * distanceToCenter; // 1.0(sin,cos)에서만 돌지않고, 중앙 ~ particle 위치에서 돌 수 있도록 distance 곱해주기
  modelPosition.z = sin(angle) * distanceToCenter;

  // Randomness
  // modelPosition.x += randomness.x;
  // modelPosition.y += randomness.y;
  // modelPosition.z += randomness.z;
  modelPosition.xyz += randomness;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  // 크기
  gl_PointSize = uSize * scale;
  gl_PointSize *= (1.0 / - viewPosition.z);

  // 색상
  vColor = color; // fragment에 js에서 설정해준 색상 전달
}