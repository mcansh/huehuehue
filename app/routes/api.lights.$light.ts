import { DataFunctionArgs, json, redirect } from "@remix-run/node";
import { z } from "zod";
import { LightState, connectToBridge } from "~/lib/api.server";

export async function action({ request }: DataFunctionArgs) {
  let formData = await request.formData();

  let api = await connectToBridge();

  let result = schema.parse(Object.fromEntries(formData.entries()));

  const lightState = new LightState();
  lightState.on(result.status);
  // await api.lights.setLightState(result.id, lightState);

  await new Promise((resolve) => setTimeout(resolve, 2_000));

  if (result.hydrated) {
    return json({ id: result.id, status: result.status });
  }
  return redirect("/");
}

let schema = z.object({
  id: z.string(),
  status: z.string().transform((val) => val === "true"),
  hydrated: z
    .string()
    .optional()
    .transform((val) => val === "true"),
});
