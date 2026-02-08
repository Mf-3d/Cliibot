import "dotenv/config";

import { createClient } from "./client";
import { registerReadyEvent } from "./events/ready";
import { registerMessageCreateEvent } from "./events/messageCreate";
import { setLogLevel } from "./utils/logger";

setLogLevel("info");

const client = createClient();

registerReadyEvent(client);
registerMessageCreateEvent(client);

client.login(process.env.DISCORD_TOKEN);