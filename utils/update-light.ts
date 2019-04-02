import { LightState } from '~/types/light';

const updateLight = async (hueId: number, body: LightState) => {
  const url = `${process.env.HUE_BRIDGE_API}/lights/${hueId}`;
  await fetch(`${url}/state`, {
    method: 'put',
    body: JSON.stringify(body),
  });

  const promise = await fetch(url);
  return promise.json();
};

export default updateLight;
