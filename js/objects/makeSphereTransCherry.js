import * as THREE from "three";

export function makeSphereTransCherry() {
  const material = new THREE.MeshPhongMaterial({
    color: 0xdc102c,
    colorSpace: THREE.SRGBColorSpace,
    shininess: 80,
    specular: 0xffffff,
  });

  const split = 30;

  const sphereGeometry = new THREE.SphereGeometry(2, split, split);
  const sphere = new THREE.Mesh(sphereGeometry, material);

  // BufferGeometryの頂点位置データを取得
  const positionAttribute = sphere.geometry.getAttribute('position');
  
  // 頂点ごとに処理
  for (let i = 0; i < positionAttribute.count; i++) {
    // 頂点の座標を取得
    const x = positionAttribute.getX(i);
    const y = positionAttribute.getY(i);
    const z = positionAttribute.getZ(i);
    const len = x * x + z * z;
    
    let newY = y;
    if (y >= 0 && len < 0.4 * 0.4) {
      newY = len;
    } else if (len < 1.0 * 1.0) {
      newY = y * 0.9;
    }
    
    // 新しい座標を設定
    positionAttribute.setY(i, newY);
  }
  
  // 変更を適用
  positionAttribute.needsUpdate = true;

  return sphere;
}
