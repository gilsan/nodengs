// cryptoHelper.js
const crypto = require('crypto');

require('dotenv').config();

// 32바이트 키 (256비트)와 16바이트 IV (초기화 벡터)
const algorithm = 'aes-256-cbc';
const secretKey = crypto.createHash('sha256').update(process.env.SECRET_KEY).digest('base64').substr(0, 32);
const iv = crypto.randomBytes(16); // 보안상 매번 랜덤으로 생성

function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  // IV는 암호문과 함께 반환되어야 복호화가 가능함
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(encryptedData) {
  const [ivHex, encryptedText] = encryptedData.split(':');
  const ivBuffer = Buffer.from(ivHex, 'hex');
  const encryptedBuffer = Buffer.from(encryptedText, 'hex');

  const decipher = crypto.createDecipheriv(algorithm, secretKey, ivBuffer);
  const decrypted = Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);

  return decrypted.toString('utf8');
}

module.exports = { encrypt, decrypt };
