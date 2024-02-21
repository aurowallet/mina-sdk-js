/**
 * utils
 */
import bs58check from "bs58check";

export default {
  isAddressValid({ address }) {
    try {
      if (!address.toLowerCase().startsWith("b62")) {
        return false;
      }
      const decodedAddress = bs58check.decode(address).toString("hex");
      return !!decodedAddress && decodedAddress.length === 72;
    } catch (ex) {
      return false;
    }
  },
};
