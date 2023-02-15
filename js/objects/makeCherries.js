import * as THREE from "three";
import {makeSphereTransCherry} from "./makeSphereTransCherry.js";
import {toRad} from "../utils/toRad.js";
export function makeCherries() {
  const group = new THREE.Group();

  const path = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 4),
    new THREE.Vector3(0, 3, 1.5),
    new THREE.Vector3(0, 5, 1.0),
    new THREE.Vector3(-0.2, 7, 1.5),
    new THREE.Vector3(0, 5, 0.5),
    new THREE.Vector3(0, 3, 0),
    new THREE.Vector3(0, 0.5, 0)
  ]);
  const geometry = new THREE.TubeGeometry(
    path, //path
    20, //segments
    0.1, //radius
    8, //radiusSegments
    false //closed
  );

  const tubeMaterial = new THREE.MeshToonMaterial({
    color: 0x2e5925,
  });

  const tube = new THREE.Mesh(
    geometry, tubeMaterial);

  group.add(tube);

  const cherry1 = makeSphereTransCherry();
  group.add(cherry1);

  const cherry2 = makeSphereTransCherry();
  group.add(cherry2);
  cherry2.position.set(0, 0.5, 4);
  cherry2.rotation.x = toRad(-50);

  group.position.set(13, 3, 0);

  return group;
}
