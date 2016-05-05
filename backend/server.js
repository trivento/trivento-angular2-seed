#!/bin/env node
var express = require('express');
// var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Q = require('q');
var jwt = require('jwt-simple');
var moment = require('moment');
var request = require('request');
var jwtauth = require('./auth');
var loki = require('lokijs');

var ServerApp = function() {

  var self = this;

  self.sendWithHeaders = function(response, result) {
    response.set('Content-Type', 'application/json; charset=utf-8');
    response.set('Access-Control-Allow-Origin', '*');
    return response.status(200).send(result);
  };

  self.sendNotFound = function(response, entity) {
    return response.status(404).send('Entity ' + entity + ' not found');
  };

  self.createRoutes = function(app) {
    // mongoose.connect(self.mongourl);

    app
      .options('/*', function(req, res) {
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Headers', req.get('Access-Control-Request-Headers'));
        res.set('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
        res.set('Allow', 'GET, PUT, POST, DELETE, OPTIONS');
        res.set('Content-Length', '0');
        return res.status(200).send();
      })
      .all('/*', [jwtauth])
      .post('/auth', function(req, res) {
        console.log('Received login ' + req.body.username);
        if (req.body.username && (req.body.username === req.body.password)) {
          var expires = moment().add(1, 'years').valueOf();
          var token = jwt.encode({
            iss: req.body.username,
            exp: expires
          }, app.get('jwt_secret'));
          self.sendWithHeaders(res, {
            token: token,
            expires: expires
          });
        } else {
          return res.status(401).send('Incorrect');
        }
      })
      .get('/:entity', function(req, res) {
        var entity = self.db.getCollection(req.params.entity);
        if (entity === null) {
          return self.sendNotFound(res, req.params.entity);
        } else {
          return self.sendWithHeaders(res, entity.data);
        }
      })
      .get('/:entity/:id', function(req, res) {
        var entity = self.db.getCollection(req.params.entity);
        if (entity === null) {
          return self.sendNotFound(res, req.params.entity);
        } else {
          return self.sendWithHeaders(res, entity.findOne({id: parseInt(req.params.id)}));
        }
      })
      .post('/:entity', function(req, res) {
        var entity = self.db.getCollection(req.params.entity);
        if (entity === null) {
          return self.sendNotFound(res, req.params.entity);
        } else {
          return self.sendWithHeaders(res, entity.insert(req.body));
        }
      })
      .put('/:entity/:id', function(req, res) {
        var entity = self.db.getCollection(req.params.entity);
        if (entity === null) {
          return self.sendNotFound(res, req.params.entity);
        } else {
          return self.sendWithHeaders(res, entity.update(req.body));
        }
      })
      .delete('/:entity/:id', function(req, res) {
        var entity = self.db.getCollection(req.params.entity);
        if (entity === null) {
          return self.sendNotFound(res, req.params.entity);
        } else {
          entity.removeWhere({id: parseInt(req.params.id)});
          return self.sendWithHeaders(res, undefined);
        }
      });
  };

  self.setupVariables = function() {
    //  Set the environment variables we need.
    self.ipaddress = process.env.NODEJS_IP;
    self.port      = process.env.NODEJS_PORT || 4040;

    if (typeof self.ipaddress === "undefined") {
      console.warn('No NODEJS_IP var, using 127.0.0.1');
      self.ipaddress = "127.0.0.1";
    }
  };

  /**
   *  terminator === the termination handler
   *  Terminate server on receipt of the specified signal.
   *  @param {string} sig  Signal to terminate on.
   */
  self.terminator = function(sig){
    if (typeof sig === "string") {
      console.log('%s: Received %s - terminating sample app ...',
        Date(Date.now()), sig);
      process.exit(1);
    }
    console.log('%s: Node server stopped.', Date(Date.now()) );
  };


  /**
   *  Setup termination handlers (for exit and a list of signals).
   */
  self.setupTerminationHandlers = function(){
    //  Process on exit and signals.
    process.on('exit', function() { self.terminator(); });

    // Removed 'SIGPIPE' from the list - bugz 852598.
    ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
      'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
    ].forEach(function(element, index, array) {
      process.on(element, function() { self.terminator(element); });
    });
  };

  /**
   *  Initialize the server (express) and create the routes and register
   *  the handlers.
   */
  self.initializeServer = function() {
    self.app = express();
    self.app.use(bodyParser.json());
    self.createRoutes(self.app);
    self.app.use(express.static('client'));
    self.app.set('jwt_secret', process.env.JWT_SECRET);
    self.db = new loki('db.json', {autosave: true});
    self.db.loadDatabase({}, function() {
      console.log('Database loaded');
    });
  };

  /**
   *  Initializes the sample application.
   */
  self.initialize = function() {
    self.setupVariables();
    self.setupTerminationHandlers();

    // Create the express server and routes.
    self.initializeServer();
  };

  /**
   *  Start the server (starts up the sample application).
   */
  self.start = function() {
    //  Start the app on the specific interface (and port).
    self.app.listen(self.port, self.ipaddress, function() {
      console.log('%s: Node server started on %s:%d ...',
        Date(Date.now() ), self.ipaddress, self.port);
    });
  };

};

var serverApp = new ServerApp();
serverApp.initialize();
serverApp.start();
