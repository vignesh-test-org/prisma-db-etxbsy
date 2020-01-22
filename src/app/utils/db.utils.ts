/**
 * WRAPPER ABOVE PHOTON
 */

import { Photon } from '../../generated/photon';

let photon;

class Store {
    store: Object;

    context: Object;

    constructor() {
        if (photon) {
            this.store = photon;
        } else {
            this.store = new Photon({
                datasources: {
                    postgres: process.env.POSTGRES_URL
                }
            });
            photon = this.store;
        }
    }

    initialize(config) {
        this.context = config.context;
    }

    getStore() {
        if (photon) {
            return photon;
        }
        photon = new Photon({
            datasources: {
                postgres: process.env.POSTGRES_URL
            },
            debug: true,
            log: [
                {
                    level: 'QUERY'
                }
            ]
        });
        return photon;
    }
}

process.once('SIGUSR2', async () => {
    if (photon) {
        await photon.disconnect();
    }
    process.kill(process.pid, 'SIGUSR2');
});

export { Store };
