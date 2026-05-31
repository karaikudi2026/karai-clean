import dotenv from "dotenv";

dotenv.config();

import { env } from "./config/env";
import { buildApp } from "./app";

async function start() {
  const app = await buildApp();

  try {
    await app.listen({
      port: env.PORT,
      host: "0.0.0.0",
    });

    app.log.info(
      { port: env.PORT, api: `/api/${env.API_VERSION}` },
      "myKaraikudi API started"
    );
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
