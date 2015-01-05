/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');

module.exports = function(app) {

  // ALLOW CORS 
  app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Accept, Origin, Referer, User-Agent, Content-Type, Authorization, x-access-token');

    // intercept OPTIONS method
    if (req.method === 'OPTIONS') {
      res.send(200);
    } else {
      next();
    }
  });

  // Insert routes below
  app.use('/api/users', require('./api/user'));
  app.use('/api/sessions', require('./api/session'));

  app.use('/auth', require('./auth'));
  
  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};
