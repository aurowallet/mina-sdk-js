import MinaProvider, { getSiteIcon } from "@aurowallet/mina-provider";
import "@babel/polyfill";
import "./message";

window.getSiteIcon = getSiteIcon;

const provider = new MinaProvider();
window.mina = provider;

const info = {
  slug: "aurowallet",
  name: "Auro Wallet",
  icon: "https://www.aurowallet.com/imgs/auro.png",
  rdns: "com.aurowallet",
};
const announceProvider = () => {
  window.dispatchEvent(
    new CustomEvent("mina:announceProvider", {
      detail: Object.freeze({ info, provider }),
    }),
  );
};
window.addEventListener("mina:requestProvider", (event) => {
  announceProvider();
});
console.log('Auro Wallet initialized.');
announceProvider();

function initWebInfo() {
  try {
    let messageBody = {
      action: "auro_wallet_init",
      payload: {
        site: {
          origin: window.location.origin,
          webIcon: getSiteIcon(window),
        },
      },
    };
    AppProvider.postMessage(JSON.stringify(messageBody));
  } catch (error) {}
}

initWebInfo();
