var shaderMaterial;
var lightRotate = 0.0;
var HARF_PI = Math.PI / 2;

// マウスを押した状態かどうかを判別するフラグ
var isMouseDown = false;

var swingVec = new THREE.Vector3(0, 1, 0);
var swingStrength = 0.0;
var infall = true;


function toRad(degree) {
    return degree * Math.PI / 180;
}

function dropPudding() {
    dy = 0.1;
    pudding.position.y = 30;

    swingVec.x = 0;
    swingVec.y = 1;
    swingVec.z = 0;

    frame = 0;

    swingStrength = 3.0;
    infall = true;
}

function checkSpMode() {

    if ((navigator.userAgent.indexOf('iPhone') > 0 &&
            navigator.userAgent.indexOf('iPad') == -1) ||
        navigator.userAgent.indexOf('iPod') > 0 ||
        navigator.userAgent.indexOf('Android') > 0) {
        spMode = true;
    } else {
        spMode = false;
    }

}

// 2. JavaScriptにてロード処理を行う
function preload() {

    if(!!window.WebGLRenderingContext == false) {
        $("#drop_pudding").hide();
        $("body").append("WebGL未対応です");
        return;
    }

    // シェーダーファイルのプリロード
    SHADER_LOADER.load(

        // ロード完了後のコールバック関数
        function(data) {

            $("#drop_pudding").click(function() {
                isMouseDown = false;
                dropPudding();
            });

            // 頂点シェーダー
            var vs = data.myShader.vertex;
            // フラグメントシェーダー
            var fs = data.myShader.fragment;

            // Three.jsの初期化処理を行う
            setUp(vs, fs);
        }
    );
}

function makeCherry(scene) {
    var group = new THREE.Group();

    var path = new THREE.SplineCurve3([
        new THREE.Vector3(0, 0, 4),
        new THREE.Vector3(0, 3, 1.5),
        new THREE.Vector3(0, 5, 1.0),
        new THREE.Vector3(-0.2, 7, 1.5),
        new THREE.Vector3(0, 5, 0.5),
        new THREE.Vector3(0, 3, 0),
        new THREE.Vector3(0, 0.5, 0)
    ]);
    var geometry = new THREE.TubeGeometry(
        path, //path
        20, //segments
        0.1, //radius
        8, //radiusSegments
        false //closed
    );

    var tubematerial = new THREE.MeshPhongMaterial({
        ambient: 0x2e5925,
        color: 0x2e5925,
        specular: 0x009900,
        shininess: 1000,
        shading: THREE.SmoothShading
    });

    var tube = new THREE.Mesh(
        geometry, tubematerial);

    group.add(tube);

    var cherry1 = shpereTransCherry();
    group.add(cherry1);

    var cherry2 = shpereTransCherry();
    group.add(cherry2);
    cherry2.position.set(0, 0.5, 4);
    cherry2.rotation.x = toRad(-50);

    group.position.set(13, 3, 0);
    scene.add(group);
}

function shpereTransCherry() {
    var material = new THREE.MeshPhongMaterial({
        ambient: 0xdc102c,
        color: 0xdc102c,
        specular: 0xffffff,
        shininess: 10,
        shading: THREE.SmoothShading
    });

    var split = 30;
    if(spMode){
        split = 10;
    }

    var sphereGeometry = new THREE.SphereGeometry(2, split, split);
    var sphere = new THREE.Mesh(sphereGeometry, material);

    for (var i = 0; i < sphere.geometry.vertices.length; i++) {
        var pos = sphere.geometry.vertices[i];
        var len = (pos.x * pos.x) + (pos.z * pos.z);
        if (pos.y >= 0 && len < 0.4 * 0.4) {
            sphere.geometry.vertices[i].y = len;
        } else if (len < 1.0 * 1.0) {
            sphere.geometry.vertices[i].y = pos.y * 0.9;
        }
    }

    return sphere;
}

function makeDish(scene) {
    var material = new THREE.MeshPhongMaterial({
        ambient: 0xf0f0f0,
        color: 0xf0f0f0,
        specular: 0x666666,
        shininess: 200.0,
        side: THREE.DoubleSide,

        shading: THREE.SmoothShading
    });

    var circleSplit = 100;
    var heightSplit = 30;
    if (spMode) {
        circleSplit /= 10;
        heightSplit /= 10;
    }
    cylinderGeometry = new THREE.CylinderGeometry(25, 18.0, 3, circleSplit, heightSplit);
    cylinder = new THREE.Mesh(
        cylinderGeometry, material);

    cylinder.position.set(0, 0, 0);

    scene.add(cylinder);

    for (var i = 0; i < cylinder.geometry.vertices.length; i++) {
        pos = cylinder.geometry.vertices[i];
        if ((pos.x * pos.x) + (pos.z * pos.z) < 20 * 20) {
            cylinder.geometry.vertices[i].y -= 1;
        }
    }
}

function setMaterial(node, material) {
    node.material = material;
    if (node.children) {
        for (var i = 0; i < node.children.length; i++) {
            setMaterial(node.children[i], material);
        }
    }
}

var light, directionalLight; //グローバル変数の宣言                                                
function initLight(scene) {
    //環境光オブジェクト(light)の設定　

    //  モバイルではスポットライトないので環境光を強くする
    if( spMode ) {
        light = new THREE.AmbientLight(0xffffff);
    } else {
        light = new THREE.AmbientLight(0xf0f0f0);
    }
    //sceneに環境光オブジェクト(light2)を追加                
    scene.add(light);

    var radius = 30; //半径
    var rad = toRad(22.0);

    //SpotLight(hex, intensity, distance, angle, exponent)
    spotLight = new THREE.SpotLight(0xffffff, 1.0);
    spotLight.position.set(10, 5, 40);

    //  ライトの計算はモバイルには重い
    if( !spMode) {
        scene.add(spotLight);
    }
}

function setupSkybox(scene) {

    var urlPrefix = "data/texture/";
    var urls = [urlPrefix + "bottom.png", urlPrefix + "bottom.png",
        urlPrefix + "bottom.png", urlPrefix + "bottom.png",
        urlPrefix + "bottom.png", urlPrefix + "bottom.png"
    ];

    var cubemap = THREE.ImageUtils.loadTextureCube(urls); // load textures
    cubemap.format = THREE.RGBFormat;

    var shader = THREE.ShaderLib['cube']; // init cube shader from built-in lib
    shader.uniforms['tCube'].value = cubemap; // apply textures to shader

    // create shader material
    var skyBoxMaterial = new THREE.ShaderMaterial({
        fragmentShader: shader.fragmentShader,
        vertexShader: shader.vertexShader,
        uniforms: shader.uniforms,
        depthWrite: false,
        side: THREE.BackSide
    });

    // create skybox mesh
    var skybox = new THREE.Mesh(
        new THREE.CubeGeometry(1000, 1000, 1000),
        skyBoxMaterial
    );

    scene.add(skybox);
}

function initText(group) {

    var stringGroup1 = new THREE.Group();
    var str1 = 'three.js+GLSL';
    // T  h   r  e  e  .  j  s +   G L  S   L
    var str1W = [0, 12, 16, 12, 14, 14, 10, 12, 12, 18, 18, 14, 15, 15];
    var total1W = 0;
    //	チョコレート開始角度
    var startR = -55;

    for (var i = 0; i < str1.length; i++) {
        var textGeometry1 = new THREE.TextGeometry(str1.charAt(i), {
            size: 15,
            height: 0,
            curveSegments: 3,
            font: "optimer",
            weight: "bold",
            style: "normal",
            bevelThickness: 1,
            bevelSize: 0.5,
            bevelEnabled: true
        });

        var text1 = new THREE.Mesh(
            textGeometry1,
            new THREE.MeshPhongMaterial({
                ambient: 0x8B4513,
                color: 0x8B4513,
                specular: 0xffffff,
                shininess: 200,
                shading: THREE.SmoothShading
            }));
        stringGroup1.add(text1);

        total1W += str1W[i];

        var rad = toRad(startR + total1W / 1.5);

        text1.position.x = Math.sin(rad) * 135.0;
        text1.position.z = Math.cos(rad) * 135.0;

        text1.rotation.z = rad;
        text1.rotation.x = toRad(-90);

    }
    group.add(stringGroup1);

    //stringGroup1.position.y = 10;
    stringGroup1.position.x = 0.0;
    stringGroup1.position.z = 0.0;
    stringGroup1.position.y = 1.2;

    stringGroup1.scale.x = stringGroup1.scale.y = stringGroup1.scale.z = 0.15;
}

function createPudding() {
    var circleSplit = 100;
    var heightSplit = 30;
    if (spMode) {
        circleSplit /= 10;
        heightSplit /= 10;
    }

    cylinderGeometry = new THREE.CylinderGeometry(8.4, 11.2, 11.2, circleSplit, heightSplit);
    cylinder = new THREE.Mesh(cylinderGeometry, shaderMaterialPudding);

    cylinder.position.set(0, 21, 0);
    return cylinder;
}

function initEventListener(renderer){

    // イベントの設定
    renderer.domElement.addEventListener("mousedown", function(event) {
        isMouseDown = true;
    });

    renderer.domElement.addEventListener("mouseup", function(event) {
        isMouseDown = false;
    });

    renderer.domElement.addEventListener("touchstart", function(event) {
        isMouseDown = true;
    });

    renderer.domElement.addEventListener("touchend", function(event) {
        isMouseDown = false;
    });
}

function setUp(vs, fs) {

    var group = new THREE.Group();

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 3000);

    var renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('canvas-wrapper').appendChild(renderer.domElement);

    initEventListener(renderer);

    setupSkybox(group);

    makeCherry(group);
    makeDish(group);

    // URLからテクスチャオブジェクトを取得
    var texture = THREE.ImageUtils.loadTexture("data/texture/pudding.png");
    // 光源の位置
    lightPos = new THREE.Vector3();

    var uniformsPudding = {
        frame: {
            type: 'f',
            value: 0.0
        },
        amplitude: {
            type: "f", // float型
            value: 1.0
        },
        texture: {
            type: "t", // テクスチャ型
            value: texture
        },
        lightPosition: {
            type: "v3", // Vector3型
            value: lightPos
        },
        modelHeight: {
            type: "f",
            value: 11.2
        },
        swingVec: {
            type: "v3", // Vector3型
            value: swingVec
        },
        swingStrength: {
            type: "f", // Vector3型
            value: swingStrength
        }
    };

    // ShaderMaterialの作成
    shaderMaterialPudding = new THREE.ShaderMaterial({
        uniforms: uniformsPudding,
        // シェーダーを割り当てる
        vertexShader: vs,
        fragmentShader: fs,
    });

    initLight(scene);

    {//if (!spMode) {
        initText(group);
    }

    frame = 0;

    pudding = createPudding();

    group.add(pudding);
    scene.add(group);


    lightRotate = 0.0;
    var radius = 50; //半径
    var rad = toRad(22.0);

    lightPos.x = radius * Math.cos(rad);
    lightPos.z = radius * Math.sin(rad);
    lightPos.y = 15;

    frame = 0.0;
    startCalc = true;

    controller = new RoundCameraController(camera, renderer.domElement);

    if( spMode ){
        controller.radius = 140;
    } else {
        controller.radius = 70;
    }
    controller.rotate(0, -30);

    dropPudding();

    function render() {

        var swing = frame;

        requestAnimationFrame(render);

        uniformsPudding.frame.value = swing;

        lightRotate += 0.01;

        //-------------------
        // ループ関数内
        //-------------------
        // 光源位置の移動 (三角関数を使って円周上を移動)

        uniformsPudding.lightPosition.value = lightPos;

        lightPos.x = radius * Math.cos(-lightRotate);
        lightPos.z = radius * Math.sin(-lightRotate);
        lightPos.y = -100;

        uniformsPudding.lightPosition.value = lightPos;
        spotLight.position.set(lightPos.x, 59, lightPos.z);

        if (pudding.position.y > 7) {
            pudding.position.y -= dy;
            dy *= 1.05;
            swingStrength = 4;

        } else {
            if (infall) {
                frame = Math.PI / 2;
            }
            infall = false;
            pudding.position.y = 7;

            if (startCalc) {
                uniformsPudding.swingVec.value = swingVec;
            } else {
                uniformsPudding.swingStrength.value = 0;
            }
        }

        if (swingStrength <= 0.01) {
            startCalc = false;
            swingStrength = 0;
        }

        if (!infall) {

            frame += 0.1;
            swingStrength *= 0.95;

            if (isMouseDown) {
                isMouseDown = false;
                startCalc = true;
                swingStrength = 5.0;

                var z = Math.sin(HARF_PI + frame) * 1;
                var x = Math.cos(HARF_PI + frame) * 1;
                swingVec.x = x;
                swingVec.z = z;
                swingVec.y = 0;
            }
            uniformsPudding.swingStrength.value = swingStrength
        }
        renderer.render(scene, camera);


        controller.upDate();
    }

    render(renderer);
}