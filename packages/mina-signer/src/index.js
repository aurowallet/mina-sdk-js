import "@babel/polyfill";
import account from "./account";
import utils from "./utils";
import auroSignLib from "./lib";
import webEncryption from "./encryption";

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
global.send = send;

global.account = account;
global.utils = utils;

global.auroSignLib = auroSignLib;
global.webEncryption = webEncryption;

const minaSignerVersion = async () => {
  return "3.0.7-1004";
};
global.minaSignerVersion = minaSignerVersion;
