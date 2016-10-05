var express = require('express'),
  router = express.Router(); 
var sql = require('mssql');
var Promise = require("bluebird");

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

router.get('/ping', function (req, res) {
  res.send('PONG');
});

router.get('/query/:querytext', function (req, res) {
  getCorporateProfile().then(function(response){
		res.send(response);	
	});
  // request(LUIS_URL + req.params.querytext, function (error, response, body) {
  // if (!error && response.statusCode == 200) {
		// var request = dbRequest(getHighestIntent(response));    	
  //   	res.send(request);
  // 	}
  // })
});

router.get('/dbtest', function(req, res, next) {
	getCorporateProfile().then(function(response){
		res.send(response);	
	});
})

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

var getCorporateProfile = function () {
		
		var SQL = 'select distinct  TOP 10 Client, Category, FSP_number, Reg_number, ' +
		'Risk_profile_client, Legal_persona_client, Legal_persona_fund, count(Fund_name) as Fund_count ' +
		'from FUND_DATA ' +
		//'where Client like '\%Allan Gray\%' and Legal_persona_fund != '' ' +
		'group by Client, Category, FSP_number, Reg_number, Risk_profile_client, Legal_persona_client, Legal_persona_fund ' +
		'order by count(Fund_name) DESC'

		var result = {};
		var config = {
    		user: 'foudnery@foundery-codefest', 
    		password: 'F0und3ry',
    		server: 'foundery-codefest.database.windows.net',
    		database: 'codefest2016',
    		options: {
        		encrypt: true 
    		}
		};
		
		return new Promise(function(resolve) {
			sql.connect(config, function (err) {
	    		if(err) { console.log(err); }
	    		new sql.Request().query(SQL)
	    		.then(function(recordset) {
	    			resolve(recordset); 		
	    		}).catch(function(err) {
	      			console.log(err);
	    		 });
			});
		});

	};