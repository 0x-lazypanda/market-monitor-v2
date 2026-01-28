import { CryptoSignalAgent } from "./agent.js";

export function createAgent(config) {
  return new CryptoSignalAgent(config);
}
