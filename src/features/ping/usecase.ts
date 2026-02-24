export class PingUseCase {
  ping(interactionLatency: number, wsPing: number): string {
    const lines = [
      "**🏓 Pong!**",
      `Interaction: **${interactionLatency}ms**`,
      `WebSocket: **${wsPing}ms**`
    ];

    if (interactionLatency > 200) lines.push("⚠️ ちょっと遅くない？");
    
    return lines.filter(Boolean).join("\n");
  }
}