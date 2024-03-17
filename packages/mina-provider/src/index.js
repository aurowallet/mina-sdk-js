import MinaProvider, { getSiteIcon } from "@aurowallet/mina-provider";
import "@babel/polyfill";
import "./message";

window.mina = new MinaProvider();
window.getSiteIcon = getSiteIcon;
