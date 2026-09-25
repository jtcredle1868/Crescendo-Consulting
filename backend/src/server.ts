import { createApp } from "./app";
import { env } from "./config/env";

const app = createApp();

app.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Crescendo API listening on port ${env.port} (${env.nodeEnv})`);
});
