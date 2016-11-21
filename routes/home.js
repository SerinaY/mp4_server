var secrets = require('../config/secrets');
var mongoose = require('mongoose');

module.exports = function(router) {

  var homeRoute = router.route('/');

  homeRoute.get(function(req, res) {



  });


  return router;
}

