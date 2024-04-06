import { MessageChannel } from "@aurowallet/mina-provider";

const contentScript = {
  init() {
    this.channel = new MessageChannel("AuroApp");
    this.registerListeners();
    this.exposeMethods();
  },
  registerListeners() {
    this.channel.on("messageFromWeb", async (data) => {
      try {
        AppProvider.postMessage(JSON.stringify(data));
      } catch (error) {
        window.postMessage(JSON.stringify(data));
      }
    });
  },
  onAppResponse(data) {
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
