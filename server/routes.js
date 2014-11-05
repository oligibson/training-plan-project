/*jslint node:true, es5:true, nomen: true, plusplus: true */
/*globals module*/
module.exports = function (app, permissions) {
  "use strict";

  var
    Users       = require('./routes/users'),
    Sessions    = require('./routes/sessions'),
    Exercises   = require('./routes/exercises');

// ALLOW CORS =================================================================
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
  
// GET  =======================================================================
  app.get('/api/users',                                                    Users.getUsers);
  app.get('/api/users/:id',                                                Users.getUser);
  app.get('/api/users/:id/sessions',                                       Sessions.getUserSessions);

  app.get('/api/sessions/:id',                                             Sessions.getSession);

  app.get('/api/exercises',                                                Exercises.getExercisesAll);
  app.get('/api/exercises/:id',                                            Exercises.getExercise);

// POST =======================================================================
  app.post('/api/users/create',                                            Users.createUser);
  app.post('/api/sessions/create',                                         Sessions.createSession);
  app.post('/api/exercises/create',                                        Exercises.createExercise);

// PUT  =======================================================================
  app.put('/api/users/:id',                                                Users.modifyUser);
  app.put('/api/sessions/:id',                                             Sessions.modifySession);

// DELETE =====================================================================
  app.delete('/api/sessions/:id',                                          Sessions.deleteSession);
  app.delete('/api/users/:id',                                             Users.deleteUser);
  app.delete('/api/exercises/:id',                                         Exercises.deleteExercise);

/*
  app.get('/api/bookings',                                                 Bookings.getBookings);
  app.get('/api/bookings/all',                                             Bookings.getBookingsAll);
  app.get('/api/bookings/active',                                          Bookings.getBookingsActive);
  app.get('/api/bookings/:id',                                             Bookings.getBooking);
  app.get('/api/bookings/:id/user',                  permissions.admin,    Bookings.getBookingUser);
  app.get('/api/bookings/:id/seats',                                       Bookings.getBookingSeats);
  app.get('/api/bookings/between/:start/:end',                             Bookings.getBookingsBetween);
  app.get('/api/bookings/between/:start/:end/users', permissions.admin,    Bookings.getBookingsUsersBetween);
  app.get('/api/bookings/between/:start/:end/seats',                       Bookings.getBookingsSeatsBetween);
  
  app.get('/api/seats',                                                    Seats.getSeats);
  app.get('/api/seats/:id',                                                Seats.getSeat);
             
  app.get('/api/requests',                           permissions.admin,    Requests.getRequests);
  app.get('/api/requests/all',                       permissions.admin,    Requests.getRequestsAll);
  app.get('/api/requests/:id',                       permissions.request,  Requests.getRequest);
             
  app.get('/api/projects',                                                 Projects.getProjects);
  app.get('/api/projects/active',                                          Projects.getProjectsActive);
  
  app.get('/api', function (req, res) { res.redirect('/'); });
  
// POST =======================================================================
  app.post('/api/login',                                                   Auth.login);
  app.post('/api/users/newPassword',                                       Users.newPassword);
  
// PUT  =======================================================================
  app.put('/api/bookings/:id',                       permissions.booking,  Bookings.modifyBooking);
  
*/
};