import Client from "mina-signer";

const networkIDMap = {
  mainnet: "mina:mainnet",
  testnet: "mina:devnet",
  zekomainnet: "zeko:mainnet",
  zekotestnet: "zeko:testnet",
};

export default function getSignClient(networkID = "mainnet", options = {}) {
  if (networkID && typeof networkID === "object") {
    return new Client({ network: networkID, ...options });
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

  return new Client({ network: clientNetwork, ...options });
}
