import React from 'react';
import fetch from 'isomorphic-unfetch';
import GlobalStyle from '~/components/styles/global-style';
import LightProps from '~/types/light';
import Light from '~/components/light';
import Group from '~/components/group';

const Index = ({ lights, groups }: { lights: LightProps[] }) => {
  return (
    <>
      <GlobalStyle />

      {groups.map(group => (
        <Group key={group.name} group={group} />
      ))}

      {lights.map(light => (
        <Light key={light.uniqueid} light={light} />
      ))}
    </>
  );
};

Index.getInitialProps = async () => {
  const promise = await fetch(`${process.env.HUE_BRIDGE_API}/lights`);
  const lightsObject = await promise.json();
  const lights = Object.entries(lightsObject).map(([lightId, light]) => ({
    hueId: Number(lightId),
    ...light,
  }));

  const p2 = await fetch(`${process.env.HUE_BRIDGE_API}/groups`);
  const groupsObject = await p2.json();
  const groups = Object.entries(groupsObject)
    .map(([groupId, group]) => ({
      hueId: Number(groupId),
      ...group,
    }))
    .filter(group => group.lights.length);

  return { lights, groups };
};

export default Index;
