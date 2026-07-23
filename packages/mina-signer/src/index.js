import "core-js/stable";
import "regenerator-runtime/runtime";

import account from "./account";
import utils from "./utils";
import auroSignLib from "./lib";
import webEncryption from "./encryption";
import zkAppSigner from "./zkAppSigner";

const root = typeof globalThis !== "undefined" ? globalThis : window;

// send message to JSChannel: MinaWallet
function send(path, data) {
  //  sendMessage('MinaWallet', JSON.stringify({ path, data }))
  if (window.location.href === "about:blank") {
    try {
      MinaWallet.postMessage(JSON.stringify({ path, data }));
    } catch (e) {
      console.warn("send failed:", e);
    }
  } else {
    console.log(path, data);
  }
}

send("log", "bridge js loaded");
root.send = send;

root.account = account;
root.utils = utils;

root.auroSignLib = auroSignLib;
root.webEncryption = webEncryption;
root.zkAppSigner = zkAppSigner;

const minaSignerVersion = async () => {
  return "4.1.0-1001";
};
root.minaSignerVersion = minaSignerVersion;
