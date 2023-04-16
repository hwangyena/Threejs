precision mediump float;

uniform vec3 uColor;
uniform sampler2D uTexture;

varying vec2 vUv;
varying float vElevation;

void main(){
    vec4 textureColor = texture2D(uTexture, vUv); // uv coordinate 설정 (위치 맞춰주기)
    textureColor.rgb *= vElevation * 2.0 + 0.6; // alpha 값은 변경하지 않음, 값이 커질수록 밝게 보임

    gl_FragColor = textureColor;
}