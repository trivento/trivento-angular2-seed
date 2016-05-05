var jwt = require('jwt-simple');
var NO_AUTH_NEEDED = ['/auth'];
var jwtSecret = process.env.JWT_SECRET;

module.exports = function(req, res, next) {
  if (NO_AUTH_NEEDED.indexOf(req.path) === -1) {
    res.set('Access-Control-Allow-Origin', '*');

    var token = (req.body && req.body.access_token) ||
      (req.query && req.query.access_token) ||
      (req.headers['authorization'] && req.headers['authorization'].substring(7));

    console.log(token);
    if (token) {
      try {
        var decoded = jwt.decode(token, jwtSecret);
        if (decoded.exp <= Date.now()) {
          res.status(400).end('Access token has expired', 400);
        }
        req.user = decoded.iss;
        next();

      } catch (err) {
        console.log('error ' + err);
        res.status(401).end('Not authorized', 401);
      }
    } else {
      res.status(401).end('Not authorized', 401);
    }
  } else {
    next();
  }

};
