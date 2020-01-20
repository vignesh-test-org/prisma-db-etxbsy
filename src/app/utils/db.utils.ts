/**
 * WRAPPER ABOVE PHOTON
 */

import { Photon } from '../../generated/photon';

class Store {
    store: Object;

    context: Object;

    constructor() {
        this.store = new Photon({
            datasources: {
                postgres: process.env.POSTGRES_URL
            }
        });
    }

    initialize(config) {
        this.context = config.context;
    }

    getStore() {
        return new Photon({
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
    }
}

export { Store };
