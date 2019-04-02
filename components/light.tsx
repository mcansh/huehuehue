import React, { useState } from 'react';
import styled from 'styled-components';
import { desaturate } from 'polished';
import LightProps from '~/types/light';

const Button = styled.button.attrs({ type: 'button' })`
  color: white;
  background: #1eb273;
  border-radius: 100px;
  border: none;
  padding: 0.75rem 4rem 0.85rem;
  cursor: pointer;

  &:disabled {
    background: ${desaturate(0.8, '#1eb273')};
    cursor: not-allowed;
  }
`;

const Light = ({ light }: { light: LightProps }) => {
  const [lightState, setLight] = useState<LightProps>(() => light);

  const toggleLight = async () => {
    const url = `${process.env.HUE_BRIDGE_API}/lights/${light.lightId}`;
    await fetch(`${url}/state`, {
      method: 'put',
      body: JSON.stringify({
        effect: 'none',
        on: !lightState.state.on,
        ct: Math.floor(1000000 / 3000), // 3000K
      }),
    });

    const promise = await fetch(url);
    const json = await promise.json();
    setLight(json);
  };

  const hours = new Date().getHours();

  return (
    <div
      css={`
        margin: 2rem;
        h1 {
          margin-bottom: 0.5rem;
        }
        p {
          margin-bottom: 0.5rem;
        }
        span {
          display: inline-block;
          &:not(:last-of-type)::after {
            content: '|';
            margin: 0 0.25rem;
          }
        }
      `}
    >
      <h1>
        {lightState.name}{' '}
        {lightState.swupdate.state !== 'noupdates' && ' - Update Available'}
      </h1>
      <p>
        <span>Brightness: {lightState.state.bri}</span>
        <span>Hue: {lightState.state.hue}</span>
        <span>Saturation: {lightState.state.sat}</span>
        <span>Effect: {lightState.state.effect}</span>
        {/* <span>Kelvin: {lightState.state.ct}</span> */}
      </p>
      {/* <pre>{JSON.stringify(lightState, null, 2)}</pre> */}
      <Button
        onClick={toggleLight}
        disabled={
          !lightState.state.reachable ||
          (lightState.name === 'Dresser Lamp' && (hours >= 22 || hours <= 8))
        }
      >
        Turn {lightState.state.on ? 'Off' : 'On'}
      </Button>
    </div>
  );
};

export default Light;
