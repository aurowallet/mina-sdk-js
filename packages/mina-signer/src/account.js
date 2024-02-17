import Client from "mina-signer";
import * as bip39 from "bip39";
import * as bip32 from "bip32";
import { Buffer } from "safe-buffer";
import bs58check from "bs58check";
import BigNumber from "bignumber.js";
const decimals = 9;
function reverse(bytes) {
  const reversed = new Buffer(bytes.length);
  for (let i = bytes.length; i > 0; i--) {
    reversed[bytes.length - i] = bytes[i - 1];
  }
  return reversed;
}

export default {
  async generateMnemonic() {
    const mnemonic = bip39.generateMnemonic();
    return {
      mnemonic,
    };
  },
  async isAddressValid({ address }) {
    try {
      const decodedAddress = bs58check.decode(address).toString("hex");
      return !!decodedAddress && decodedAddress.length === 72;
    } catch (ex) {
      return false;
    }
  },
  async decodeAddress({ address }) {
    try {
      const decodedAddress = bs58check.decode(address).toString("hex");
      return decodedAddress;
    } catch (ex) {
      return null;
    }
  },
  async importWalletByMnemonic({
    mnemonic,
    accountIndex = 0,
    needPrivateKey = false,
  }) {
    const seed = await bip39.mnemonicToSeedSync(mnemonic);
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
  async importWalletByPrivateKey({ privateKey }) {
    console.log("privateKey", privateKey);
    const client = new Client({ network: "mainnet" });
    const minaPublicKey = client.derivePublicKey(privateKey);
    console.log("minaPublicKey", minaPublicKey);
    return {
      priKey: privateKey,
      pubKey: minaPublicKey,
    };
  },
  async importWallet({ key: mnemonicOrPrivateKey, keyType }) {
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

  /**
   * 
   * @param {*} privateKey
   * @param {*} fromAddress
   * @param {*} toAddress
   * @param {*} amount
   * @param {*} fee
   * @param {*} nonce
   * @param {*} memo
   */
  async signPayment({
    privateKey,
    fromAddress,
    toAddress,
    amount,
    fee,
    nonce,
    memo,
  }) {
    let signedPayment;
    try {
      let keys = {
        privateKey: privateKey,
        publicKey: fromAddress,
      };
      let decimal = new BigNumber(10).pow(decimals);
      let sendFee = new BigNumber(fee).multipliedBy(decimal).toNumber();
      let sendAmount = new BigNumber(amount).multipliedBy(decimal).toNumber();
      const client = new Client({ network: "mainnet" });
      signedPayment = client.signPayment(
        {
          to: toAddress,
          from: keys.publicKey,
          amount: sendAmount,
          fee: sendFee,
          nonce: +nonce,
          memo,
          validUntil: 4294967295,
        },
        keys
      );
    } catch (error) {
      signedPayment = { error: { message: "buildFailed" } };
    }
    return signedPayment;
  },
  async signStakeDelegation({
    privateKey,
    fromAddress,
    toAddress,
    fee,
    nonce,
    memo,
  }) {
    let signedStakingPayment;
    try {
      let keys = {
        privateKey: privateKey,
        publicKey: fromAddress,
      };
      let decimal = new BigNumber(10).pow(decimals);
      let sendFee = new BigNumber(fee).multipliedBy(decimal).toNumber();
      const client = new Client({ network: "mainnet" });
      signedStakingPayment = client.signStakeDelegation(
        {
          to: toAddress,
          from: keys.publicKey,
          fee: sendFee,
          nonce: nonce,
          memo,
        },
        keys
      );
    } catch (error) {
      signedStakingPayment = { error: { message: "buildFailed" } };
    }
    return signedStakingPayment;
  },
};
