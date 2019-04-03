import React, { useState } from 'react';
import { updateGroup } from '~/utils/update-lights';

const Group = ({
  group,
}: {
  group: {
    action: {
      alert: string;
      bri: number;
      colormode: string;
      ct: number;
      effect: string;
      hue: number;
      on: boolean;
      sat: number;
      xy: number[];
    };
    class: string;
    hueId: number;
    lights: string[];
    locations: { [key: string]: number[] };
    name: string;
    recycle: boolean;
    sensors: string[];
    state: { any_on: boolean; all_on: boolean };
    stream: {
      active: boolean;
      owner?: string;
      proxymode: string;
      proxynode: string;
    };
    type: 'Room' | 'Entertainment';
  };
}) => {
  const [groupState, setGroup] = useState(() => group);

  const toggleGroup = async () => {
    const updatedGroup = await updateGroup(group.hueId, {
      effect: 'none',
      on: !groupState.state.any_on,
      ct: Math.floor(1000000 / 3000), // 3000K
    });
    setGroup(updatedGroup);
  };

  return (
    <div key={group.hueId}>
      <button type="button" onClick={toggleGroup}>
        Turn {group.name} {groupState.state.any_on ? 'Off' : 'On'}
      </button>
    </div>
  );
};

export default Group;
