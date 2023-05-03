varying vec3 vColor;

void main(){
  // particle 원으로 만들기
  // float strength = distance(gl_PointCoord, vec2(0.5)); // center(0.5)부터 particle 까지 거리 계산
  // strength = step(0.5, strength); // 0.5까지 거리 자르기
  // strength = 1.0 - strength; // 반전

  // Diffuse point
//   float strength = distance(gl_PointCoord, vec2(0.5));
//   strength *= 2.0;
//   strength = 1.0 - strength;

  // Light point
  float strength = distance(gl_PointCoord, vec2(0.5));
  strength = 1.0 - strength;
  strength = pow(strength, 3.0);

  // 색상 설정
  vec3 color = mix(vec3(0.0), vColor, strength);

  gl_FragColor = vec4(color, 1.0);
}