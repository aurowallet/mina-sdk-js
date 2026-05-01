/**
 * utils
 */
import bs58check from "bs58check";

export default {
  async isAddressValid({ address }) {
    try {
      if (!address.startsWith("B62")) {
        return false;
      }
      const decodedAddress = bs58check.decode(address).toString("hex");
      return !!decodedAddress && decodedAddress.length === 72;
    } catch (ex) {
      return false;
    }
  },
  async getRealErrorMsg(error) {
    let errorMessage = "";
    try {
      if (error.message) {
        errorMessage = error.message;
      }
      if (Array.isArray(error) && error.length > 0) {
        // postError
        errorMessage = error[0].message;
        // buildError
        if (!errorMessage && error.length > 1) {
          errorMessage = error[1]?.c || error[1]?.message || String(error[1]);
        }
      }
      if (typeof error === "string") {
        let lastErrorIndex = error.lastIndexOf("Error:");
        if (lastErrorIndex !== -1) {
          errorMessage = error.slice(lastErrorIndex);
        } else {
          errorMessage = error;
        }
      }
    } catch (parseError) {
      console.warn("getRealErrorMsg: failed to parse error", parseError);
    }
    return errorMessage;
  },
};
