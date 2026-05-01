import { MessageChannel } from "@aurowallet/mina-provider";

const contentScript = {
  init() {
    this.channel = new MessageChannel("AuroApp");
    this.registerListeners();
    this.exposeMethods();
  },
  registerListeners() {
    this.channel.on("messageFromWeb", async (data) => {
      if (
        typeof AppProvider !== "undefined" &&
        AppProvider &&
        typeof AppProvider.postMessage === "function"
      ) {
        try {
          AppProvider.postMessage(JSON.stringify(data));
        } catch (error) {}
      }
    });
  },
  onAppResponse(data) {
    if (!data || typeof data !== "object") return;
    if (data.id) {
      this.channel.send("messageFromWallet", data);
    } else {
      // for event
      this.channel.send(data?.action, data?.result);
    }
  },
  exposeMethods() {
    window.onAppResponse = this.onAppResponse.bind(this);
  },
};
contentScript.init();
