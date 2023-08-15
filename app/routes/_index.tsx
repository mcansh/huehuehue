import { useLoaderData, MetaFunction, useFetcher } from "@remix-run/react";
import {
  DataFunctionArgs,
  redirect,
  json,
  SerializeFrom,
} from "@remix-run/node";
import { z } from "zod";

import { ClientOnly } from "~/components/client-only";
import { connectToBridge, LightState, LightType } from "~/lib/api.server";

function filterDownLights(lights: Array<LightType>) {
  return lights.map((light) => {
    return {
      name: light.name,
      id: light.id,
      type: light.type,
      status: light.state.on,
    };
  });
}

export async function loader() {
  try {
    let api = await connectToBridge();

    let [lights, groups] = await Promise.all([
      api.lights.getAll(),
      api.groups.getAll(),
    ]);

    let filteredDownLights = filterDownLights(lights);

    let lightsByGroup = groups.reduce<{
      [key: string]: typeof filteredDownLights;
    }>((acc, group) => {
      let lightIds = group.getAttributeValue("lights") as string[];

      let groupLights = lightIds
        .map((l) => {
          return filteredDownLights.find((light) => String(light.id) === l);
        })
        .filter(Boolean);

      let groupName = group.name as string;

      // group 0 appears to just be all the devices
      if (groupName === "Group 0") return acc;

      acc[groupName] = groupLights;
      return acc;
    }, {});

    return {
      lights: lightsByGroup,
    };
  } catch (error) {
    console.error(error);
    return { lights: {} };
  }
}

let schema = z.object({
  id: z.string(),
  status: z.string().transform((val) => val === "true"),
  hydrated: z
    .string()
    .optional()
    .transform((val) => val === "true"),
});

export async function action({ request }: DataFunctionArgs) {
  let formData = await request.formData();

  let api = await connectToBridge();

  let result = schema.parse(Object.fromEntries(formData.entries()));

  const lightState = new LightState();
  lightState.on(result.status);
  let response = await api.lights.setLightState(result.id, lightState);

  await new Promise((resolve) => setTimeout(resolve, 2_000));

  if (result.hydrated) {
    return json({ id: result.id, status: result.status });
  }
  return redirect("/");
}

export let meta: MetaFunction = () => {
  return [{ title: "Hue Hue Hue | Remix + Philips Hue Dashboard" }];
};

export default function Index() {
  let data = useLoaderData<typeof loader>();

  return (
    <div className="px-4 accent-pink-600">
      <h1 className="text-5xl">Hue Hue Hue</h1>

      <dl>
        {Object.entries(data.lights).map(([groupName, lights]) => {
          return (
            <div key={groupName}>
              <dt className="text-3xl font-medium">{groupName}</dt>
              <dd>
                <ul>
                  {lights.map((light) => {
                    return <LightToggle light={light} />;
                  })}
                </ul>
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}

function LightToggle({
  light,
}: {
  light: SerializeFrom<typeof loader>["lights"][string][number];
}) {
  let fetcher = useFetcher<SerializeFrom<typeof action>>();
  let status =
    fetcher.data?.status !== undefined ? fetcher.data.status : light.status;

  return (
    <li key={light.id}>
      <fetcher.Form method="post" className="space-x-2">
        <input type="checkbox" name="on" defaultChecked={status} readOnly />
        <input type="hidden" name="id" value={light.id} readOnly={true} />
        <input
          type="hidden"
          name="status"
          value={String(!status)}
          readOnly={true}
        />
        <ClientOnly>
          {() => <input type="hidden" name="hydrated" value="true" />}
        </ClientOnly>
        <button
          type="submit"
          className={
            fetcher.state === "submitting" &&
            fetcher.formData?.get("id") === String(light.id)
              ? "font-bold"
              : ""
          }
        >
          {light.name} ({light.type})
        </button>
      </fetcher.Form>
    </li>
  );
}
