var express = require('express'),
  router = express.Router(),
  db = require('../models');

 var request = require('request'); 

 var LUIS_URL =  "https://api.projectoxford.ai/luis/v1/application?id=afad2289-d126-489a-8d9b-2f9f8cf02bdb&subscription-key=b5ab91160f864fde9626ae6b395b35e4&q=";

module.exports = function (app) {
  app.use('/', router);
  app.use(function(req, res, next) {
  	res.header("Access-Control-Allow-Origin", "*");
  	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  	next();
  });
};

router.get('/', function (req, res, next) {
  db.Article.findAll().then(function (articles) {
    res.render('index', {
      title: 'Generator-Express MVC',
      articles: articles
    });
  });
});

router.get('/ping', function (req, res) {
  res.send('PONG');
});

router.get('/query/:querytext', function (req, res) {
  request(LUIS_URL + req.params.querytext, function (error, response, body) {
  if (!error && response.statusCode == 200) {
		var request = dbRequest(getHighestIntent(response));    	
    	res.send(request);
  	}
  })
});

var getHighestIntent = function(response) {
	json_result = JSON.parse(response.body);
	return json_result.entities[0];
}

var dbRequest = function(response) {
	var db_request = {};
	db_request.entity = response.entity;
	db_request.type = response.type; 
	return db_request;
}