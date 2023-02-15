import * as THREE from "three";

export function makeSkybox(scene) {
  const urlPrefix = "data/texture/";
  const urls = [
    "bottom.png",
    "bottom.png",
    "bottom.png",
    "bottom.png",
    "bottom.png",
    "bottom.png",
  ];

  const cubemap = new THREE.CubeTextureLoader().setPath(urlPrefix).load(urls); // load textures

  // create shader material
  const skyBoxMaterial = new THREE.MeshBasicMaterial({
    envMap: cubemap,
    side: THREE.BackSide,
  });

  // create skybox mesh
  const skybox = new THREE.Mesh(
    new THREE.BoxGeometry(1000, 1000, 1000),
    skyBoxMaterial
  );

  return skybox;
}
