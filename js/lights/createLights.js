import * as THREE from "three";

export function createLights() {
  //環境光オブジェクト(light)の設定

  //  モバイルではスポットライトないので環境光を強くする
  const ambientLight = new THREE.AmbientLight(0x444444);

  //SpotLight(hex, intensity, distance, angle, exponent)
  const spotLight = new THREE.PointLight(0xffffff, 1, 1000);


  return [ambientLight, spotLight];
}
