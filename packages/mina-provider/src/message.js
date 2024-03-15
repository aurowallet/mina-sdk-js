import { MessageChannel } from "@aurowallet/mina-provider";

const contentScript = {
  init() {
    this.channel = new MessageChannel("AuroApp");
    this.registerListeners();
  },
  replaceNonAlphaNumChars(str) {
    return str.replace(/[^a-zA-Z0-9]/g, "_");
  },
  registerListeners() {
    this.channel.on("messageFromWeb", async (data) => {
      let id = data?.payload?.id;
      if (id) {
        id = this.replaceNonAlphaNumChars(id);
        const callbackName = `callback_${id}`;
        window[callbackName] = (data) => {
          if (data.id) {
            this.channel.send("messageFromWallet", data);
          }
          delete window[callbackName];
        };
        AppProvider.postMessage(
          JSON.stringify({ ...data, callback: `window.${callbackName}` })
        );
      }
    });
  },
};
contentScript.init();
