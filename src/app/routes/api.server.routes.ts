'use strict';

import { helloWorld } from '../controllers/api.server.controller';

module.exports = function(app) {
    app.route('/auth/hello').post(helloWorld);

    app.route('/auth/hello').get(helloWorld);

    // app.route('/metrics').get(getMetrics);

    // Set params if needed
    // app.param('Id', apiCtrl.func);
};
