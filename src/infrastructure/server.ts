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
      // Remove the startup error listener once the server starts listening.
      server.removeListener("error", onError);

      logger.info(`Server listening on port ${port}.`);
      resolve(server);
    });

    function onError(error: Error) {
      reject(error);
    }

    // Listen for errors that occur before the server starts listening.
    server.once("error", onError);

    // Log errors that occur after the server starts listening.
    server.on("error", (error) => {
      logger.error("HTTP server error:", String(error));
    });
  });
}
