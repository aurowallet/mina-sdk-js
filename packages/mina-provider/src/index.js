import MinaProvider, { getSiteIcon } from "@aurowallet/mina-provider";
import "./message";

window.getSiteIcon = getSiteIcon;

const provider = new MinaProvider();

// Mirrors MetaMask's `setGlobalProvider`: a plain assignment guarded by
// try/catch, so if another wallet has locked `window.mina` non-writable we
// log and continue rather than crashing the page.
// https://github.com/MetaMask/providers/blob/main/src/initializeInpageProvider.ts
try {
  window.mina = provider;
} catch (error) {
  console.error(
    "Auro Wallet encountered an error setting the global Mina provider - this is likely due to another wallet extension also setting the global provider:",
    error,
  );
}

const info = {
  slug: "aurowallet",
  name: "Auro Wallet",
  icon: "https://www.aurowallet.com/imgs/auro.png",
  rdns: "com.aurowallet",
};

// Mirrors MetaMask's EIP-6963 announce: spread `{ ...info }` into each event
// detail so dApps cannot mutate a shared `info` reference and pollute later
// announcements; freeze the wrapper as recommended by EIP-6963.
// https://github.com/MetaMask/providers/blob/main/src/EIP6963.ts
const announceProvider = () =>
  window.dispatchEvent(
    new CustomEvent("mina:announceProvider", {
      detail: Object.freeze({ info: { ...info }, provider }),
    }),
  );
window.addEventListener("mina:requestProvider", () => {
  announceProvider();
});
console.log("Auro Wallet initialized.");
announceProvider();

function initWebInfo() {
  try {
    const messageBody = {
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
