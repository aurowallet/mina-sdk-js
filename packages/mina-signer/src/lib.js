/**
 * sign & verify
 */
import BigNumber from "bignumber.js";
import Client from "mina-signer";
import utils from "./utils";
const decimals = 9;
const fallbackErrorMessage = "buildFailed";

const networkIDMap = {
  mainnet: "mina:mainnet",
  testnet: "mina:devnet",
  zekomainnet: "zeko:mainnet",
  zekotestnet: "zeko:testnet",
};

function getSignClient(networkID = "mainnet") {
  if (networkID && typeof networkID === "object") {
    return new Client({ network: networkID });
  }

  let clientNetwork;
  if (networkID === "mainnet" || networkID === networkIDMap.mainnet) {
    clientNetwork = "mainnet";
  } else if (
    networkID === "zeko-mainnet" ||
    networkID === networkIDMap.zekomainnet
  ) {
    clientNetwork = { custom: "zeko-mainnet" };
  } else {
    clientNetwork = "testnet";
  }

  return new Client({ network: clientNetwork });
}

export default {
  async signTransaction({
    network = "mainnet", // | "testnet" | "zeko-mainnet" | NetworkID
    type = "payment", // | "delegation" | "zk" | "message",
    privateKey,

    fromAddress,
    toAddress,
    amount,
    fee,
    nonce,
    memo,

    transaction,
    message,
  }) {
    if (!privateKey) {
      return { error: { message: "must have private key" } };
    }
    try {
      const signClient = getSignClient(network);
      let signBody = {};
      if (type === "message") {
        signBody = message;
      } else if (type === "zk") {
        let decimal = new BigNumber(10).pow(decimals);
        let sendFee = new BigNumber(fee).multipliedBy(decimal).toFixed(0);

        signBody = {
          zkappCommand: JSON.parse(transaction),
          feePayer: {
            feePayer: fromAddress,
            fee: sendFee,
            nonce: nonce,
            memo: memo || "",
          },
        };
      } else {
        let decimal = new BigNumber(10).pow(decimals);
        let sendFee = new BigNumber(fee).multipliedBy(decimal).toFixed(0);
        signBody = {
          to: toAddress,
          from: fromAddress,
          fee: sendFee,
          nonce: nonce,
          memo: memo || "",
        };
        if (type === "payment") {
          let sendAmount = new BigNumber(amount)
            .multipliedBy(decimal)
            .toFixed(0);
          signBody.amount = sendAmount;
        }
      }
      return signClient.signTransaction(signBody, privateKey);
    } catch (err) {
      let errorMessage =
        (await utils.getRealErrorMsg(err)) || fallbackErrorMessage;
      return { error: { message: errorMessage } };
    }
  },
  async signFields({
    network = "mainnet", //| "testnet" | "zeko-mainnet" | NetworkID
    privateKey,
    message,
  }) {
    if (!privateKey) {
      return { error: { message: "must have private key" } };
    }
    try {
      let fields = message;
      const nextFields = fields.map(BigInt);
      const signClient = getSignClient(network);
      let signResult = signClient.signFields(nextFields, privateKey);
      signResult.data = fields;
      return signResult;
    } catch (err) {
      let errorMessage =
        (await utils.getRealErrorMsg(err)) || fallbackErrorMessage;
      return { error: { message: errorMessage } };
    }
  },
  verifyMessage({
    network = "mainnet", // | "testnet" | "zeko-mainnet" | NetworkID
    publicKey,
    signature,
    verifyMessage,
  }) {
    return new Promise((resolve) => {
      let verifyResult;
      try {
        const nextSignature =
          typeof signature === "string" ? JSON.parse(signature) : signature;
        const signClient = getSignClient(network);
        const verifyBody = {
          data: verifyMessage,
          publicKey: publicKey,
          signature: nextSignature,
        };
        verifyResult = signClient.verifyMessage(verifyBody);
      } catch (error) {
        verifyResult = false;
      } finally {
        resolve(verifyResult);
      }
    });
  },

  verifyFieldsMessage({
    network = "mainnet", //| "testnet" | "zeko-mainnet" | NetworkID
    publicKey,
    signature,
    fields,
  }) {
    return new Promise((resolve) => {
      let verifyResult;
      try {
        const signClient = getSignClient(network);

        const nextFields = fields.map(BigInt);
        const verifyBody = {
          data: nextFields,
          publicKey: publicKey,
          signature: signature,
        };
        verifyResult = signClient.verifyFields(verifyBody);
      } catch (error) {
        verifyResult = false;
      } finally {
        resolve(verifyResult);
      }
    });
  },
  async createNullifier({
    network = "mainnet", //| "testnet" | "zeko-mainnet" | NetworkID
    privateKey,
    message,
  }) {
    if (!privateKey) {
      return { error: { message: "must have private key" } };
    }
    try {
      let fields = message;
      const nextFields = fields.map(BigInt);
      const signClient = getSignClient(network);
      let createResult = signClient.createNullifier(nextFields, privateKey);
      createResult.data = fields;
      return createResult;
    } catch (err) {
      let errorMessage =
        (await utils.getRealErrorMsg(err)) || fallbackErrorMessage;
      return { error: { message: errorMessage } };
    }
  },
};
