import {
  useLoaderData,
  MetaFunction,
  useFetcher,
  Form,
} from "@remix-run/react";
import {
  DataFunctionArgs,
  redirect,
  json,
  SerializeFrom,
} from "@remix-run/node";
import { z } from "zod";

import { ClientOnly } from "~/components/client-only";
import { GroupLightState, connectToBridge } from "~/lib/api.server";

export async function loader() {
  let api = await connectToBridge();

  let [lights, groups] = await Promise.all([
    api.lights.getAll(),
    api.groups.getAll(),
  ]);

  let filteredDownLights = lights.map((light) => {
    return {
      name: light.name,
      id: light.id,
      type: light.type,
      status: (light.state as any).on as boolean,
    };
  });

  let lightsByGroup = groups
    .map((group) => {
      // group 0 appears to just be all the devices
      if (group.name.toLowerCase() === "group 0") return;
      let lightIds = group.getAttributeValue("lights") as string[];
      let groupLights = lightIds
        .map((l) => {
          return filteredDownLights.find((light) => String(light.id) === l);
        })
        .filter(Boolean);

      return {
        name: group.name,
        id: group.id,
        lights: groupLights,
        status: (group.state as any).any_on as boolean,
      };
    })
    .filter(Boolean);

  return {
    lights: lightsByGroup,
  };
}

export async function action({ request }: DataFunctionArgs) {
  let formData = await request.formData();

  let api = await connectToBridge();

  let schema = z
    .object({
      light_id: z.string().optional(),
      group_id: z.string().optional(),
      status: z.string().transform((val) => val === "true"),
      hydrated: z
        .string()
        .optional()
        .transform((val) => val === "true"),
    })
    .superRefine((val) => {
      if (!val.group_id && !val.light_id) {
        throw new Error("Must provide a light_id or group_id");
      }
    });

  let result = schema.parse(Object.fromEntries(formData.entries()));

  if (result.light_id) {
    let response = await api.lights.setLightState(result.light_id, {
      on: result.status,
    });

    await new Promise((resolve) => setTimeout(resolve, 2_000));

    if (result.hydrated) {
      return json({
        id: result.light_id,
        status: response as unknown as boolean,
      });
    }
  } else if (result.group_id) {
    let groupState = new GroupLightState();
    groupState.on(result.status);
    let response = await api.groups.setGroupState(result.group_id, groupState);
    if (result.hydrated) {
      return json({
        id: result.group_id,
        status: response as unknown as boolean,
      });
    }
  }

  return redirect("/");
}

export let meta: MetaFunction = () => {
  return [{ title: "Hue Hue Hue | Remix + Philips Hue Dashboard" }];
};

export default function Index() {
  let data = useLoaderData<typeof loader>();

  return (
    <div className="px-4 accent-pink-600 py-6">
      <h1 className="text-5xl">Hue Hue Hue</h1>

      <dl>
        {data.lights.map((group) => {
          let lightsOn = group.lights.filter((l) => l.status).length;
          return (
            <div key={group.name} className="space-y-1">
              <dt className="text-3xl font-medium flex items-center space-x-4">
                <div className="flex items-center space-x-4">
                  <span>{group.name} </span>
                  <span className="text-sm">
                    ({lightsOn}/{group.lights.length})
                  </span>
                </div>
                <Form method="post" className="inline-block text-base">
                  <ClientOnly>
                    {() => <input type="hidden" name="hydrated" value="true" />}
                  </ClientOnly>

                  <input type="hidden" name="group_id" value={group.id} />

                  <button
                    type="submit"
                    name="status"
                    value={String(!group.status)}
                  >
                    Turn all {group.status ? "off" : "on"}
                  </button>
                </Form>
              </dt>
              <dd>
                <ul className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {group.lights.map((light) => {
                    return <LightToggle key={light.id} light={light} />;
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
  light: SerializeFrom<typeof loader>["lights"][number]["lights"][number];
}) {
  let fetcher = useFetcher<SerializeFrom<typeof action>>();
  let inflight = fetcher.state === "submitting";
  let status =
    fetcher.formData && fetcher.formData.has("status")
      ? fetcher.formData.get("status") === "true"
      : light.status;

  return (
    <li className={cn("w-full", inflight ? "font-bold" : "")}>
      <fetcher.Form method="post" className="flex items-center">
        <input type="hidden" name="light_id" value={light.id} readOnly={true} />
        <ClientOnly>
          {() => <input type="hidden" name="hydrated" value="true" />}
        </ClientOnly>
        <button
          type="submit"
          name="status"
          value={String(!status)}
          className={cn(
            "rounded text-white w-full py-2",
            inflight ? "bg-pink-600" : status ? "bg-green-600" : "bg-gray-300"
          )}
        >
          <span className="hidden md:block">Turn {status ? "off" : "on"} </span>
          <span className="">{light.name}</span>
        </button>
      </fetcher.Form>
    </li>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
