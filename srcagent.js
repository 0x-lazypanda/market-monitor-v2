import fetch from "node-fetch";

export class CryptoSignalAgent {
  constructor(config = {}) {
    this.coins = config.coins || ["bitcoin", "ethereum"];
    this.vsCurrency = config.vsCurrency || "usd";
    this.interval = config.interval || 300000;
    this.timer = null;
  }

  async fetchMarket() {
    const url =
      `https://api.coingecko.com/api/v3/coins/markets` +
      `?vs_currency=${this.vsCurrency}` +
      `&ids=${this.coins.join(",")}` +
      `&price_change_percentage=24h`;

    const res = await fetch(url);
    return res.json();
  }

  generateSignal(coin) {
    const change = coin.price_change_percentage_24h;

    if (change > 5) return "BULLISH";
    if (change < -5) return "BEARISH";
    return "NEUTRAL";
  }

  async run() {
    const data = await this.fetchMarket();

    return data.map((coin) => ({
      asset: coin.symbol.toUpperCase(),
      price: coin.current_price,
      change_24h: coin.price_change_percentage_24h,
      volume_24h: coin.total_volume,
      signal: this.generateSignal(coin),
      timestamp: new Date().toISOString()
    }));
  }

  start(onEmit) {
    this.timer = setInterval(async () => {
      const payload = await this.run();
      onEmit?.(payload);
    }, this.interval);
  }

  stop() {
    clearInterval(this.timer);
  }
}
