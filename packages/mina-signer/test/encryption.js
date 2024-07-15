
const react_private_keys = `
-----BEGIN PRIVATE KEY-----

-----END PRIVATE KEY-----
`

const node_public_keys = `
-----BEGIN PUBLIC KEY-----
-----END PUBLIC KEY-----
`


async function testForeEncryptAndDecrypt() {
  const buildTokenData = {
    sender: "B62qqe37skfzHW6phkxPyGoKZCK3E9r74H5V6nFParoJYBLfG5eksoH",
    receiver: "B62qo8iCPaSBYza7t2cDXB7Ab26HQweuVPXvoYmgpKzA3Nc7H1xREnW",
    tokenAddress: "B62qjhbD7ibGhFHoGyA4h7BedWxU4GoxLymUeWEoKLV8L4Y6oY1HW6n",
    amount: 0,
    gqlUrl: "",
  };
  const encrypted = await webEncryption.encryptData({
    targetData:buildTokenData, 
    pubKey:node_public_keys
  });
  console.log("encrypted==0", encrypted);

  const decryptedData = await webEncryption.decryptData(
    encrypted.encryptedData,
    encrypted.encryptedAESKey,
    encrypted.iv,
    node_private_keys
  );
  console.log("Decrypted data:", decryptedData);
}

window.testForeEncryptAndDecrypt = testForeEncryptAndDecrypt;