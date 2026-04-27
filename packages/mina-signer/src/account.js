import { Buffer } from "buffer";
import { HDKey } from "@scure/bip32";
import * as bip39 from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english";
import bs58check from "bs58check";
import Client from "mina-signer";

function reverse(bytes) {
  const reversed = Buffer.alloc(bytes.length);
  for (let i = bytes.length; i > 0; i--) {
    reversed[bytes.length - i] = bytes[i - 1];
  }
  return reversed;
}

function getHDPath(accountIndex = 0) {
  const purpose = 44;
  const coinType = 12586;
  const charge = 0;
  const index = 0;
  return (
    "m/" +
    purpose +
    "'/" +
    coinType +
    "'/" +
    accountIndex +
    "'/" +
    charge +
    "/" +
    index
  );
}

export default {
  generateMnemonic() {
    return new Promise((resolve) => {
      const mnemonic = bip39.generateMnemonic(wordlist, 128);
      resolve({
        mnemonic,
      });
    });
  },
  importWalletByMnemonic({
    mnemonic,
    accountIndex = 0,
    needPrivateKey = false,
  }) {
    return new Promise((resolve) => {
      try {
        const seed = bip39.mnemonicToSeedSync(mnemonic);
        const masterNode = HDKey.fromMasterSeed(seed);
        const hdPath = getHDPath(accountIndex);
        const child0 = masterNode.derive(hdPath);
        if (!child0.privateKey) {
          throw new Error("Failed to derive private key from mnemonic");
        }
        const child0PrivateKey = Buffer.from(child0.privateKey);
        child0PrivateKey[0] &= 0x3f;
        const childPrivateKey = reverse(child0PrivateKey);
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
        resolve(res);
      } catch (error) {
        resolve({ error: { message: String(error) } });
      }
    });
  },
  importWalletByPrivateKey({ privateKey }) {
    return new Promise((resolve) => {
      try {
        const client = new Client({ network: "mainnet" });
        const minaPublicKey = client.derivePublicKey(privateKey);
        resolve({
          priKey: privateKey,
          pubKey: minaPublicKey,
        });
      } catch (error) {
        resolve({ error: { message: String(error) } });
      }
    });
  },
  async importWallet({ key: mnemonicOrPrivateKey, keyType }) {
    switch (keyType) {
      case "priKey":
        return await this.importWalletByPrivateKey({
          privateKey: mnemonicOrPrivateKey,
        });
      case "mnemonic":
      default:
        return await this.importWalletByMnemonic({
          mnemonic: mnemonicOrPrivateKey,
        });
    }
  },
};
