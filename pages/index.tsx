import React from 'react';
import fetch from 'isomorphic-unfetch';
import GlobalStyle from '~/components/styles/global-style';
import LightProps from '~/types/light';
import Light from '~/components/light';

const Index = ({ lights }: { lights: LightProps[] }) => {
  return (
    <>
      <GlobalStyle />
      {lights.map(light => {
        return <Light key={light.uniqueid} light={light} />;
      })}
    </>
  );
};

Index.getInitialProps = async () => {
  const promise = await fetch(`${process.env.HUE_BRIDGE_API}/lights`);
  const lightsObject = await promise.json();
  const lights = Object.entries(lightsObject).map(light => ({
    lightId: light[0],
    ...light[1],
  }));

  return { lights };
};

export default Index;
