import * as THREE from "three";

export function createLights() {
  //環境光オブジェクト(light)の設定

  // モバイルではスポットライトがないので環境光を強くする
  const ambientLight = new THREE.AmbientLight(0xffffff, 2.5);

  // SpotLight(色, 強度, 距離, 減衰)
  const spotLight = new THREE.PointLight(0xFFFFFF, 100, 30, 0.8);

  return [ambientLight, spotLight];
}
