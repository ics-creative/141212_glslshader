// フラグメントシェーダー
// language=GLSL
export const shaderFragment = `#version 300 es
    precision highp float;
    
    // Three.jsから提供される変数を明示的に宣言
    uniform mat4 viewMatrix;
    
    // バーテックスシェーダーから送られた値
    in vec3 vNormal;
    in vec3 mvPosition;
    in vec2 vUv;
    
    // 出力カラーの定義
    out vec4 fragColor;

    // CPUから送られたuniform変数
    uniform vec3 lightPosition;
    uniform sampler2D textureSampler;

    // 光源ベクトル
    vec3 light = vec3(0, 0, 1);
    // 反射色(RGB)
    vec3 lightColor = vec3(1.0, 1.0, 1.0);
    // 反射のシャープネス
    float sharpness = 10.0;

    void main() {
        // 拡散光の計算 ---------------------------------------
        // 視点座標系の光線ベクトル
        vec4 lightPosVec4 = viewMatrix * vec4(lightPosition, 0.0);
        // 光源ベクトルを正規化
        vec3 lightPos = normalize(lightPosVec4.xyz);

        // 法線ベクトルを正規化
        vec3 n = normalize(vNormal);
        // 光源と法線の内積(ratio)を求める
        float ratio = dot(n, lightPos);
        // ※閾値を設定しておく
        ratio = max(1.0, ratio);
        // テクスチャ
        vec4 textureColor = texture(textureSampler, vUv);

        // 反射光の計算 ---------------------------------------
        // 反射ベクトル(reflection)を求める
        vec3 reflection = reflect(-lightPos, n);
        // カメラ位置から各頂点への視線ベクトル
        vec3 cameraVec = - normalize(mvPosition);
        // 反射ベクトルと視線ベクトルの内積(ratio2)を求める
        float ratio2 = dot(reflection, cameraVec);
        // 反射色の計算
        vec3 specular = lightColor * pow(max(ratio2, 0.0), sharpness);

        // 描画色 = テクスチャーカラー(拡散色)✕拡散強度 + 反射光
        fragColor = vec4(textureColor.xyz * ratio + specular, 1.0);
    }
`;
