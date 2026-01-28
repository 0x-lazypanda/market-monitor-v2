import { createAgent } from "@teneo/crypto-signal-sdk";

const agent = createAgent({
  coins: ["bitcoin", "ethereum"],
  interval: 300000
});

agent.start((signals) => {
  console.log("Teneo Event:", signals);
});
