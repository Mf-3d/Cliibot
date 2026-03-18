import express from "express";

import type { Logger } from "@/utils/logger";


export function createServer(port: number, logger: Logger): Promise<void> {
  const app = express();

  app.get("/", (req, res) => {
    res.redirect("https://mf-3d.github.io/");
  });

  return new Promise((resolve) => {
    app.listen(port, () => {
      logger.info(`🎧 Server listening on port ${port}.`);
      resolve();
    });
  });
}