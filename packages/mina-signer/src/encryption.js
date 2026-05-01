import forge from "node-forge";
/**
 * encrypt and decrypt data 
 */
export default {
  encryptAESKeyWithRSA(aesKey, publicKey) {
    const rsaPublicKey = forge.pki.publicKeyFromPem(publicKey);
    const encryptedAESKey = rsaPublicKey.encrypt(aesKey, "RSA-OAEP", {
      md: forge.md.sha256.create(),
    });
    return forge.util.encode64(encryptedAESKey);
  },
  encryptDataWithAES(data, aesKey, iv) {
    const cipher = forge.cipher.createCipher("AES-CBC", aesKey);
    cipher.start({ iv: forge.util.createBuffer(iv) });
    cipher.update(forge.util.createBuffer(JSON.stringify(data), "utf8"));
    cipher.finish();
    return forge.util.encode64(cipher.output.getBytes());
  },
  async encryptData({ targetData, pubKey }) {
    try {
      const aesKey = forge.random.getBytesSync(32); // 256-bit key
      const iv = forge.random.getBytesSync(16); // 16-byte IV
      const encryptedData = this.encryptDataWithAES(targetData, aesKey, iv);
      const encryptedAESKey = this.encryptAESKeyWithRSA(aesKey, pubKey);
      return {
        encryptedData,
        encryptedAESKey,
        iv: forge.util.encode64(iv),
      };
    } catch (error) {
      return { error: { message: String(error) } };
    }
  },

  decryptAESKeyWithRSA(encryptedAESKey, privateKeyPEM) {
    const privateKey = forge.pki.privateKeyFromPem(privateKeyPEM);
    const encryptedKeyBuffer = forge.util.decode64(encryptedAESKey);
    const decryptedKey = privateKey.decrypt(encryptedKeyBuffer, "RSA-OAEP", {
      md: forge.md.sha256.create(),
    });
    return decryptedKey;
  },

  decryptDataWithAES(encryptedData, aesKey, iv) {
    const decipher = forge.cipher.createDecipher("AES-CBC", aesKey);
    decipher.start({ iv: forge.util.createBuffer(iv) });
    decipher.update(
      forge.util.createBuffer(forge.util.decode64(encryptedData))
    );
    const success = decipher.finish();
    if (!success) {
      throw new Error("AES-CBC decryption failed: invalid padding");
    }
    return JSON.parse(decipher.output.toString("utf8"));
  },

  async decryptData({ targetData, privateKey }) {
    const { encryptedData, encryptedAESKey, iv } = targetData;
    try {
      const aesKey = this.decryptAESKeyWithRSA(encryptedAESKey, privateKey);
      const data = this.decryptDataWithAES(
        encryptedData,
        aesKey,
        forge.util.decode64(iv)
      );
      return data;
    } catch (error) {
      return { error: { message: String(error) } };
    }
  },
};
