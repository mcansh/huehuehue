import { LightState } from '~/types/light';

const updateLight = async (hueId: number, body: Partial<LightState>) => {
  const url = `${process.env.HUE_BRIDGE_API}/lights/${hueId}`;
  await fetch(`${url}/state`, {
    method: 'put',
    body: JSON.stringify(body),
  });

  const promise = await fetch(url);
  return promise.json();
};

const updateGroup = async (hueId: number, body: Partial<LightState>) => {
  const url = `${process.env.HUE_BRIDGE_API}/groups/${hueId}`;
  await fetch(`${url}/action`, {
    method: 'put',
    body: JSON.stringify(body),
  });

  const promise = await fetch(url);
  const data = await promise.json();
  return data;
};

export { updateLight, updateGroup };
