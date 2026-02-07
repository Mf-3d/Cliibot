import "dotenv/config";

import { createClient } from "./client";
import { registerReadyEvent } from "./events/ready";
import { registerMessageCreateEvent } from "./events/messageCreate";

const client = createClient();

registerReadyEvent(client);
registerMessageCreateEvent(client);

client.login(process.env.DISCORD_TOKEN);