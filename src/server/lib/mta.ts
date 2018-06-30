import config = require('config');

const MTA = require('@mtfe/mta-nodejs');

export type Tags = {
  [k: string]: string | number | undefined,
};

interface MTA {
  timing(name: string, t: number, tags?: Tags): this;

  increment(name: string, d: number, tags?: Tags): this;
}

let mta: MTA;
if (config.get('isDev')) {
  mta = {
    timing() {
      return this
    },
    increment() {
      return this
    },
  }
} else {
  mta = MTA({
    token: config.get('mta.nodejs.token'),
  }) as MTA;
}

export default mta;
