import * as THREE from "three";
import { makeDish } from "./objects/makeDish.js";

import { makePudding } from "./objects/makePudding.js";
import { makeCherries } from "./objects/makeCherries.js";
import { makeSkybox } from "./objects/makeSkybox.js";
import { createShaderMaterial } from "./materials/createShaderMaterial.js";
import { createLights } from "./lights/createLights.js";

const animationObj = {
  positionY: 0,
  swingX: 0,
  swingY: 0,
  swingZ: 0,
  swingStrength: 0,
  frame: 0,
};

document.querySelector("#drop_pudding").addEventListener("click", () => {
  dropPudding();
});

// Three.jsの初期化処理を行う
setUp();

function dropPudding() {
  gsap
    .timeline()
    // 落下開始前
    .set(animationObj, {
      positionY: 20,
      swingX: 0,
      swingY: 1,
      swingZ: 0,
      swingStrength: 0,
    })
    // 落下アニメーション
    .to(
      animationObj,
      {
        positionY: 7,
        duration: 0.5,
        ease: "cubic.in",
      },
      "<"
    )
    // 落下した瞬間
    .set(animationObj, {
      swingStrength: 5,
      frame: Math.PI / 2,
      duration: 0,
    })
    // 揺れのフレームを進める
    .to(animationObj, {
      frame: Math.PI * 12,
      duration: 6,
      ease: "linear",
    })
    // 揺れの振幅を小さくする
    .to(
      animationObj,
      {
        swingStrength: 0,
        duration: 6,
        ease: "expo.out",
      },
      "<"
    );
}

function setUp() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    30,
    window.innerWidth / window.innerHeight,
    0.1,
    3000
  );
  camera.position.set(0, 50, 50);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  const renderer = new THREE.WebGLRenderer({ antialias: devicePixelRatio < 2 });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(devicePixelRatio);
  document.getElementById("canvas-wrapper").appendChild(renderer.domElement);

  scene.add(makeSkybox());
  scene.add(makeCherries());
  scene.add(makeDish());

  // 光源
  const [amb, spotLight] = createLights();
  scene.add(amb);
  scene.add(spotLight);

  const material = createShaderMaterial();
  const pudding = makePudding(material);
  scene.add(pudding);

  dropPudding();

  //-------------------
  // ループ関数内
  //-------------------
  function tick() {
    requestAnimationFrame(tick);

    const uniforms = material.uniforms;

    // 光源位置の移動 (三角関数を使って円周上を移動)

    const lightRotate = Date.now() * 0.0005;
    const lightPos = new THREE.Vector3();
    const radius = 20; //半径
    lightPos.x = radius * Math.cos(-lightRotate);
    lightPos.z = radius * Math.sin(-lightRotate);
    lightPos.y = -100;

    uniforms.lightPosition.value = lightPos;
    spotLight.position.set(lightPos.x, 10, lightPos.z);
    // spotLight.target.position.set(0, 0, 0);

    pudding.position.y = animationObj.positionY;
    uniforms.frame.value = animationObj.frame;
    uniforms.swingStrength.value = animationObj.swingStrength;
    uniforms.swingVec.value = new THREE.Vector3(
      animationObj.swingX,
      animationObj.swingY,
      animationObj.swingZ
    );

    renderer.render(scene, camera);
  }

  tick();
}
