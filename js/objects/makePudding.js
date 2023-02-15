import * as THREE from "three";

export function makePudding(shaderMaterialPudding) {
  const geometry = new THREE.CylinderGeometry(
    8.4, // 天盤
    11.2, // 底面
    11.2, // 高さ
    100, // 円柱状の分割
    30, // 縦方向の分割
  );
  const cylinder = new THREE.Mesh(geometry, shaderMaterialPudding);

  cylinder.position.set(0, 21, 0);
  return cylinder;
}
