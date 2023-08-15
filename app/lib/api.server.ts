import { v3 } from "node-hue-api";

import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    HUE_BRIDGE_IP_ADDRESS: z.string().min(1),
    HUE_BRIDGE_USERNAME: z.string().min(1),
    HUE_BRIDGE_CLIENT_KEY: z.string().min(1),
  },
  /**
   * What object holds the environment variables at runtime.
   * Often `process.env` or `import.meta.env`
   */
  runtimeEnv: process.env,
});

export function connectToBridge() {
  return v3.api
    .createLocal(env.HUE_BRIDGE_IP_ADDRESS)
    .connect(env.HUE_BRIDGE_USERNAME);
}

declare global {
  var __api__: Awaited<ReturnType<typeof connectToBridge>>;
}

(async () => {
  if (!global.__api__) {
    global.__api__ = await connectToBridge();
  }
})();

export let api = global.__api__;

export type LightState = typeof v3.lightStates.LightState;
export type LightType = Awaited<ReturnType<typeof api.lights.getAll>>[number];
export type GroupLightState = typeof v3.lightStates.GroupLightState;

export let LightState = v3.lightStates.LightState;
export let GroupLightState = v3.lightStates.GroupLightState;
