import "@babel/polyfill";
import account from "./account";

// send message to JSChannel: MinaWallet
function send(path, data) {
//  sendMessage('MinaWallet', JSON.stringify({ path, data }))
  if (window.location.href === "about:blank") {
    MinaWallet.postMessage(JSON.stringify({ path, data }));
  } else {
    console.log(path, data);
  }
}

send("log", "main js loaded");
global.send = send;

global.account = account;
