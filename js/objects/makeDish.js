import * as THREE from "three";
export function makeDish() {
  const material = new THREE.MeshToonMaterial({
    color: 0xFFFFFF,
  });

  const circleSplit = 100;
  const heightSplit = 30;
  const cylinderGeometry = new THREE.CylinderGeometry(
    25,
    18.0,
    10,
    circleSplit,
    heightSplit
  );
  const cylinder = new THREE.Mesh(cylinderGeometry, material);

  cylinder.position.set(0, -5, 0);

  return cylinder;
}
