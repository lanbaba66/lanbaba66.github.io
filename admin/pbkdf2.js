/**
 * PBKDF2 密码验证模块
 * 使用浏览器原生 Web Crypto API，不依赖第三方库
 *
 * 凭证初始化：打开 /admin/hash-gen.html 生成盐和哈希
 */

// === 管理员凭证（由 hash-gen.html 生成，替换为实际值） ===
const ADMIN_AUTH = {
  username: "wang",
  salt: "bab5eed2e0b7d3a8d6bf9c83502f034f62b24cb133b093aefdca5ca3530b0c99",
  hash: "77dacde5b90b696de04ddbedbd3153bb5100badb46f0576ba01a15f94d622e4d",
  iterations: 210000
};

// === 十六进制转换工具 ===
function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

function bytesToHex(bytes) {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

// === 验证函数 ===
async function verifyPassword(username, password) {
  if (username !== ADMIN_AUTH.username) return false;

  try {
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      'PBKDF2',
      false,
      ['deriveBits']
    );

    const derived = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: hexToBytes(ADMIN_AUTH.salt),
        iterations: ADMIN_AUTH.iterations,
        hash: 'SHA-256'
      },
      keyMaterial,
      256
    );

    const hashHex = bytesToHex(new Uint8Array(derived));
    // 常量时间比较（防时序攻击）
    if (hashHex.length !== ADMIN_AUTH.hash.length) return false;
    let diff = 0;
    for (let i = 0; i < hashHex.length; i++) {
      diff |= hashHex.charCodeAt(i) ^ ADMIN_AUTH.hash.charCodeAt(i);
    }
    return diff === 0;
  } catch (e) {
    console.error('PBKDF2 验证失败:', e);
    return false;
  }
}

export { verifyPassword };
