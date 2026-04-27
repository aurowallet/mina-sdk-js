import "core-js/stable";
import "regenerator-runtime/runtime";

import account from "./account";
import utils from "./utils";
import auroSignLib from "./lib";
import webEncryption from "./encryption";

const root = typeof globalThis !== "undefined" ? globalThis : window;

// send message to JSChannel: MinaWallet
function send(path, data) {
  //  sendMessage('MinaWallet', JSON.stringify({ path, data }))
  if (window.location.href === "about:blank") {
    MinaWallet.postMessage(JSON.stringify({ path, data }));
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

const minaSignerVersion = async () => {
  return "3.1.0-1007";
};
root.minaSignerVersion = minaSignerVersion;
