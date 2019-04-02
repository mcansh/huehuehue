interface LightState {
  /**
   * true if the light should be on.
   */
  on: boolean;
  /**
   * brightness, in range 0 - 254. 0 is not off.
   */
  bri: number;
  /**
   * hue, in range 0 - 65535.
   */
  hue: number;
  /**
   * saturation, in range 0 - 254.
   */
  sat: number;
  effect: 'none' | 'colorloop';
  /**
   * color as array of xy-coordinates.
   */
  xy: number[];
  /**
   * white color temperature, 154 (cold) - 500 (warm).
   */
  ct: number;
  /**
   * select flashes light once, lselect flashes repeatedly for 10 seconds.
   */
  alert: 'none' | 'select' | 'lselect';
  colormode: string;
  mode: string;
  reachable: boolean;
  /**
   * time for transition in centiseconds.
   */
  transitiontime: number;
}

interface LightUpdate {
  state: string;
  lastinstall: string;
}

interface LightCapabilities {
  certified: boolean;
  control: {
    mindimlevel: number;
    maxlumen: number;
    colorgamuttype: string;
    colorgamut: number[][];
    ct: {
      min: number;
      max: number;
    };
  };
  streaming: {
    renderer: boolean;
    proxy: boolean;
  };
}

interface LightConfig {
  archetype: string;
  function: string;
  direction: string;
  startup: {
    mode: string;
    configured: boolean;
  };
}

interface Light {
  hueId: number;
  state: LightState;
  swupdate: LightUpdate;
  type: string;
  name: string;
  modelid: string;
  manufacturername: string;
  productname: string;
  capabilities: LightCapabilities;
  config: LightConfig;
  uniqueid: string;
  swversion: string;
  swconfigid: string;
  productid: string;
}

export default Light;
export { LightState, LightUpdate, LightCapabilities, LightConfig };
