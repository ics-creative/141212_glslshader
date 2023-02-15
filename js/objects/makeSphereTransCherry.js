import * as THREE from "three";

export function makeSphereTransCherry() {
  const material = new THREE.MeshToonMaterial({
    color: 0xdc102c,
  });

  const split = 30;

  const sphereGeometry = new THREE.SphereGeometry(2, split, split);
  const sphere = new THREE.Mesh(sphereGeometry, material);

  for (let i = 0; i < sphere.geometry.vertices.length; i++) {
    const pos = sphere.geometry.vertices[i];
    const len = pos.x * pos.x + pos.z * pos.z;
    if (pos.y >= 0 && len < 0.4 * 0.4) {
      sphere.geometry.vertices[i].y = len;
    } else if (len < 1.0 * 1.0) {
      sphere.geometry.vertices[i].y = pos.y * 0.9;
    }
  }

  return sphere;
}
