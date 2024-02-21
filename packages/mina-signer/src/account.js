import * as bip32 from "bip32";
import * as bip39 from "bip39";
import bs58check from "bs58check";
import Client from "mina-signer";
import { Buffer } from "safe-buffer";

function reverse(bytes) {
  const reversed = new Buffer(bytes.length);
  for (let i = bytes.length; i > 0; i--) {
    reversed[bytes.length - i] = bytes[i - 1];
  }
  return reversed;
}

export default {
  generateMnemonic() {
    const mnemonic = bip39.generateMnemonic();
    return {
      mnemonic,
    };
  },
  importWalletByMnemonic({
    mnemonic,
    accountIndex = 0,
    needPrivateKey = false,
  }) {
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const masterNode = bip32.fromSeed(seed);
    let hdPath = "m/44'/12586'/" + accountIndex + "'/0/0";
    const child0 = masterNode.derivePath(hdPath);
    child0.privateKey[0] &= 0x3f;
    const childPrivateKey = reverse(child0.privateKey);
    const minaPrivateKeyHex = `5a01${childPrivateKey.toString("hex")}`;
    const minaPrivateKey = bs58check.encode(
      Buffer.from(minaPrivateKeyHex, "hex")
    );
    const client = new Client({ network: "mainnet" });
    const minaPublicKey = client.derivePublicKey(minaPrivateKey);
    let res = {
      mnemonic: mnemonic,
      pubKey: minaPublicKey,
      hdIndex: accountIndex,
    };
    if (needPrivateKey) {
      res.priKey = minaPrivateKey;
    }
    return res;
  },
  importWalletByPrivateKey({ privateKey }) {
    console.log("privateKey", privateKey);
    const client = new Client({ network: "mainnet" });
    const minaPublicKey = client.derivePublicKey(privateKey);
    console.log("minaPublicKey", minaPublicKey);
    return {
      priKey: privateKey,
      pubKey: minaPublicKey,
    };
  },
  importWallet({ key: mnemonicOrPrivateKey, keyType }) {
    switch (keyType) {
      case "priKey":
        return this.importWalletByPrivateKey({
          privateKey: mnemonicOrPrivateKey,
        });
      case "mnemonic":
      default:
        return this.importWalletByMnemonic({ mnemonic: mnemonicOrPrivateKey });
    }
  },
};
