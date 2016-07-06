// バーテックスシェーダーから送られた値
varying vec3 vNormal;
varying vec3 mvPosition;
varying vec2 vUv;

// CPUから送られたuniform変数
uniform vec3 lightPosition;
uniform sampler2D texture;

// 光源ベクトル
vec3 light = vec3(0, 0, 1);
// 反射色(RGB)
vec3 lightColor = vec3(1.0, 1.0, 1.0);
// 反射のシャープネス
float specular = 10.0;

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
    vec4 textureColor = texture2D(texture, vUv);

    // 反射光の計算 ---------------------------------------
    // 反射ベクトル(reflection)を求める
    vec3 reflection = reflect(-lightPos, n);
    // カメラ位置から各頂点への視線ベクトル
    vec3 cameraVec = -normalize(mvPosition);
    // 反射ベクトルと視線ベクトルの内積(ratio2)を求める
    float ratio2 = dot(reflection, cameraVec);
    // 反射色の計算
    vec3 specular = lightColor * pow(max(ratio2, 0.0), specular);

    // 描画色 = テクスチャーカラー(拡散色)✕拡散強度 + 反射光
    gl_FragColor = vec4(textureColor.xyz * ratio + specular, 1.0);
}