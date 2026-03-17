import express from "express";
import { Logger } from "@/utils/logger";

export function createServer(port: number, logger: Logger) {
  const app = express();

  app.get("/", (req, res) => {
    res.redirect("https://mf-3d.github.io/");
  });

  app.listen(port, () => {
    logger.info(`🎧 Server listening on port ${port}.`);
  });
}