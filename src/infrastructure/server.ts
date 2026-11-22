import type { Server } from "node:http";
import express from "express";

import type { Logger } from "@/utils/logger/index.js";

export function createServer(port: number, logger: Logger): Promise<Server> {
  const app = express();

  app.get("/", (req, res) => {
    res.redirect("https://mf-3d.github.io/");
  });

  return new Promise<Server>((resolve, reject) => {
    const server = app.listen(port, () => {
      logger.info(`🎧 Server listening on port ${port}.`);
      resolve(server);
    });

    server.once("error", reject);
  });
}
