// 頂点シェーダー
// language=GLSL
export const shaderVertex = `
    // 頂点属性
    in vec3 position;
    in vec3 normal;
    
    // フラグメントシェーダーに送る値
    out vec3 vNormal;
    out vec3 mvPosition;
    out vec2 vUv;

    // Three.jsから提供される変数を宣言
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform mat3 normalMatrix;
    
    // CPUから送られたuniform変数
    // main.jsのtick()関数内から変更される
    uniform float frame;
    uniform float modelHeight;
    uniform vec3 swingVec;
    uniform vec3 lightPosition;
    uniform float swingStrength;

    void main() {
        // PIは定義されていないので自分で定義
        const float PI = 3.14159265359;
        float waveNum = 0.5;

        // 1.位置を0〜1.0の位置に合わせる
        float fit0Position = position.y + modelHeight / 2.0;
        float positionNormalized = fit0Position / modelHeight;

        // 2.揺れ幅の調整を行う
        float strength = swingStrength * positionNormalized;

        // 3.揺れの早さ(frame) 4.3Dモデル内の揺れの個数を指定する(positionNormalized * waveNum * PI * 2.0) 
        float wave = sin(frame + positionNormalized * waveNum * PI * 2.0) * strength;

        // 5.新しい頂点位置の生成
        vec3 newPosition = position + (swingVec * wave);

        if (newPosition.y <= position.y) {
            newPosition.x = newPosition.x * (1.00 + (newPosition.y - position.y) / 10.5 * -positionNormalized * 0.5);
            newPosition.z = newPosition.z * (1.00 + (newPosition.y - position.y) / 10.5 * -positionNormalized * 0.5);
        }

        // 頂点位置の出力
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

        vec4 mvPosition4 = modelViewMatrix * vec4(position, 1.0);

        // xyzプロパティを使って3次元ベクトルにセットする
        mvPosition = mvPosition4.xyz;

        vNormal = normalMatrix * normal;

        //  uvの指定
        float u = 0.0;
        float v = positionNormalized;

        // 頂点のUV座標をフラグメントシェーダ―に送る
        vUv = vec2(u, v);

    }
`;
