import * as THREE from "three";
import { shaderVertex } from "../shaders/shaderVertex.js";
import { shaderFragment } from "../shaders/shaderFragment.js";

export function createShaderMaterial() {
  // URLからテクスチャオブジェクトを取得
  const texture = new THREE.TextureLoader().load("data/texture/pudding.png");

  const uniformsPudding = {
    frame: {
      type: "f",
      value: 0.0,
    },
    amplitude: {
      type: "f", // float型
      value: 1.0,
    },
    texture: {
      type: "t", // テクスチャ型
      value: texture,
    },
    lightPosition: {
      type: "v3", // Vector3型
      value: new THREE.Vector3(),
    },
    modelHeight: {
      type: "f",
      value: 11.2,
    },
    swingVec: {
      type: "v3", // Vector3型
      value: new THREE.Vector3(),
    },
    swingStrength: {
      type: "f", // Vector3型
      value: 0,
    },
  };

  // ShaderMaterialの作成
  return new THREE.ShaderMaterial({
    uniforms: uniformsPudding,
    // シェーダーを割り当てる
    vertexShader: shaderVertex,
    fragmentShader: shaderFragment,
  });
}
