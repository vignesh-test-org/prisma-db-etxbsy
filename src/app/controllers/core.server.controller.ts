let config = require('../../config/config');
// import { log } from '../utils/error.utils';

// import { signJWT, verifyJWT } from '../utils/auth.utils';

// const passport = require('passport');

/**
 * AUTHENTICATION MIDDLEWARE FUNCTION
 */
export const renderIndex = function(req, res, next) {
    if (req.headers.authorization === config.authorization) {
        next();
    } else {
        return res.status(400).jsonp({
            message:
                'You may be unauthorized to do this request! Please add the token'
        });
    }
};
