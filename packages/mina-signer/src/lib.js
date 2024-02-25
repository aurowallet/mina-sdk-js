/**
 * sign & verify
 */
import BigNumber from "bignumber.js";
import Client from "mina-signer";
import utils from "./utils";
const decimals = 9;
export default {
  signTransaction({
    network = "mainnet", // | "testnet", 
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
    if(!privateKey){
      throw("must have private key")
    }
    const signClient = new Client({ network: network });
    let signResult;
    try {
      let signBody = {};
      if (type === "message") {
        signBody = message;
      } else if (type === "zk") {
        let decimal = new BigNumber(10).pow(decimals);
        let sendFee = new BigNumber(fee).multipliedBy(decimal).toNumber();

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
        let sendFee = new BigNumber(fee).multipliedBy(decimal).toNumber();
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
            .toNumber();
          signBody.amount = sendAmount;
        }
      }
      signResult = signClient.signTransaction(signBody, privateKey);
    } catch (err) {
      let errorMessage = utils.getRealErrorMsg(err) || i18n.t("buildFailed");
      signResult = { error: { message: errorMessage } };
    } finally {
      return signResult;
    }
  },
  signFields({
    network = "mainnet", //| "testnet",
    privateKey,
    message,
  }) {
    if(!privateKey){
      throw("must have private key")
    }
    let signResult;
    try {
      let fields = message;
      const nextFields = fields.map(BigInt);
      const signClient = new Client({ network: network });
      signResult = signClient.signFields(nextFields, privateKey);
      signResult.data = fields;
    } catch (err) {
      let errorMessage = utils.getRealErrorMsg(err) || i18n.t("buildFailed");
      signResult = { error: { message: errorMessage } };
    }
    return signResult;
  },
  verifyMessage({
    network = "mainnet", // | "testnet",
    publicKey,
    signature,
    verifyMessage,
  }) {
    let verifyResult;
    try {
      const nextSignature =
        typeof signature === "string" ? JSON.parse(signature) : signature;
      const signClient = new Client({ network: network });
      const verifyBody = {
        data: verifyMessage,
        publicKey: publicKey,
        signature: nextSignature,
      };
      verifyResult = signClient.verifyMessage(verifyBody);
    } catch (error) {
      verifyResult = {
        message: "Verify failed.",
        code: 20002,
      };
    }
    return verifyResult;
  },

  verifyFieldsMessage({
    network = "mainnet", //| "testnet",
    publicKey,
    signature,
    fields,
  }) {
    let verifyResult;
    try {
      const signClient = new Client({ network: network });

      const nextFields = fields.map(BigInt);
      const verifyBody = {
        data: nextFields,
        publicKey: publicKey,
        signature: signature,
      };
      verifyResult = signClient.verifyFields(verifyBody);
    } catch (error) {
      verifyResult = {
        message: "Verify failed.",
        code: 20002,
      };
    }
    return verifyResult;
  },
  createNullifier({
    network = "mainnet", //| "testnet",
    privateKey,
    message,
  }) {
    if(!privateKey){
      throw("must have private key")
    }
    let createResult;
    try {
      let fields = message;
      const nextFields = fields.map(BigInt);
      const signClient = new Client({ network: network });
      createResult = signClient.createNullifier(nextFields, privateKey);
      createResult.data = fields;
    } catch (err) {
      let errorMessage = utils.getRealErrorMsg(err) || i18n.t("buildFailed");
      createResult = { error: { message: errorMessage } };
    }
    return createResult;
  },
};
