import MinaProvider, { getSiteIcon } from "@aurowallet/mina-provider";
import "@babel/polyfill";
import "./message";

window.mina = new MinaProvider();
window.getSiteIcon = getSiteIcon;

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
