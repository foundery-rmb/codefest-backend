var express = require('express'),
  router = express.Router(); 
var sql = require('mssql');
var Promise = require("bluebird");
var changeCase = require('change-case');
var bodyParser = require('body-parser');
var google = require('googleapis');
var speech = google.speech('v1beta1');
var R = require('ramda');

 var request = require('request'); 

 var LUIS_URL =  "https://api.projectoxford.ai/luis/v1/application?id=afad2289-d126-489a-8d9b-2f9f8cf02bdb&subscription-key=b5ab91160f864fde9626ae6b395b35e4&q=";

module.exports = function (app) {
  app.use(bodyParser.raw({limit: 10240000}));
  app.use(bodyParser.json({limit: 10240000}));
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

router.post('/speech', function (req, res) {
  var key = {
  "type": "service_account",
  "project_id": "codefest-145619",
  "private_key_id": "765a5459763bdca40f454f9c51b424b47cd4cd40",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDij2Jtov9Ih+B0\na88vRdZ9yQ3ZJaPaH16t4N9+6Dc6LU1dCh+MlhYH8zKDdrjA7DnSjmX9V/n80c9b\ntJStEUD8g+HPnIfoPLjr0ZI51975WnBNLeqhLCXgsWkHyLo0VZNAQ/d7tfbtXHuV\nYJ1mEkYtLprruFQLhZIoyT6OtA9o4yiK4vxL5gAbMxslZg/ax9xEEbkeX4JRUOjh\n98p3Z5q3E1ik7T5PZM9L+3+Oim6Sl6UWXKPW7lSLz/FbzzrFDSlatlAKPjyUmanU\nbjaeSUXCJ6nkuN1vG6a680swTYyS8fqJx0pFLjw6Snxa2O8/lUieJEmD5yOZDMxg\nf4C3DCV9AgMBAAECggEBAK6QTAat0ITSLN+HMdv6s4m3oDPwDI/EG+9dlNbzlZn9\nzd4iLqzj95WojQM+NpxvZx4VGgBaCQQDpQHD4cp3wNrPwu10bkNChjktAL4Q1nzK\ncj0FZANLQOQfzg1xXAd26D5cIBPx4JCC8bXm+1/qNKgbgMKfBCLciAFlDg5mLnlh\nGnNnOlxdkFyweViBcIVT/otYcyONkfweBNdHv0I1U6dTKm88PArPA0PJuWAlai7m\nPmdUgaUC+R8D03rW457OvJKKfKdkxK1sIUtyr/FWrXPd1u4a7gEpfOEGGUNu11yJ\ngzz+abHCmuJoGdEXfOCBu/zLvYSU7SnaE+WKoxmQkwECgYEA9CLs6oS2dTG+owmN\njgkotTl0MsyOaQY4fIbzZ8wpXXj6ckiGNa7uSiCnOFojxdrBfv64zGp+L+A5gWqo\nHPgRyL8WeswK4R5a5jyhgtTYf28q+eWfhldf2gEe9+jFe1xsTykIL8Lz+U7MXT9f\nht8uKhRP8UQpFHIIgrkMbquiLAcCgYEA7ZHO5u5TAbGks8OeYfzAjWmQ4N1U4hX2\n/7cZr4QKif6haHUwoRaCx0OZFA1PPtc52myNkgWPdpYwTOgtc4K/3LU4k8X7AIU/\nVp3c8t/Ld8BF9gUCz1NQvMYk0hhxiycbFcSsFrIF9YKtMAOJ4mokyONXdLgGKXCh\n/MI5mNZDyVsCgYA6s4MfyJVOjI14Cj39HvqoyI3GASVk31gJqTExjgeMMCCYBhQv\nKEankD5k8FeVpUnNTVYF4L1CqblqAsk1Xfh4ummfURx0kKXuojl7ic4cphBBUhMP\nbEbh1k8p8NA7HzfzuLv9L/UVxvqgmTJQ7azd9VBbhLYT8m9Vb0Ur/xzZVQKBgQDa\nOvie9gpWIgM0Btx1EqMmw/SMO4T/8kFlAaOcsWSlArzuocg8EdushBIYc2l6Rmck\nmFcr7eOtgaV44EbwNwlcCzSfulwqTDy0qmsOyDm2FW+u4UeFf/lIj5O/UyjqNNAS\nnQmgB4Sl1JaW5olA7VRBHWV3GJzAcHC9KQWTui+mxQKBgCWLfLZv4/L30MixGvNG\nLvvlIoZ1qqyUT4Frna1k/McCfov+uyfLWrXKawPnwiRUpaRdZbGWUukA5yju3ox7\n8Z3E/bBH3OcyG/rbd9DJoDUaFHdL0qMXUDPrzSJxTHzJ42a6+GXd2yCacRpX+KKM\nFBnACwt72bAFeuK98eUOl5Sp\n-----END PRIVATE KEY-----\n",
  "client_email": "codefest3@codefest-145619.iam.gserviceaccount.com",
  "client_id": "101330733257312302751",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://accounts.google.com/o/oauth2/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/codefest3%40codefest-145619.iam.gserviceaccount.com"
}
  var jwtClient = new google.auth.JWT(key.client_email, null, key.private_key, ['https://www.googleapis.com/auth/cloud-platform'], null);
	jwtClient.authorize(function(err, tokens) {
	  if (err) {
  		res.send(err);
	  }

	  speech.speech.syncrecognize({ auth: jwtClient, resource: req.body }, function(err, resp) {
  		callLuis(res, resp.results[0].alternatives[0].transcript);
	  });
	});
});

function callLuis(res, querytext) {
	request(LUIS_URL + querytext, function (error, response, body) {
	  		if (!error && response.statusCode == 200) {
			var request = dbRequest(getQueryEntity(body)); 
			var result = {};
			var queryResponse = {};
			queryResponse.intent = getIntents(body);  
			queryResponse.entities = getEntitiesList(body); 
			result.queryResponse = queryResponse;
			
			if(queryResponse.intent.intent == "Show Client Profile"){
				ShowClientProfile(res, request, result);
			}

			if(queryResponse.intent.intent == "Show Legal Persona"){
				ShowLegalPersona(res, request, result)				
			}
		}
	});
}

function ShowClientProfile(res, databaseRequest, result) {
	if( R.isEmpty(databaseRequest) ) { res.send("No Results"); }
		customerData(databaseRequest).then(function(response) {
			if(response !== undefined){
				result.clients = response;
				return result;
			}
			return result;
		})
		.then(function(customerData) {
			return fundData(databaseRequest.capitalized).then(function(fundData) {
				if(result.clients.length > 0){
					result.clients[0].funds = fundData;
					return result;
				}
				return result;
			});
		})
		.then(function(result) {
			res.send(result);
		});
	
}

function ShowLegalPersona(res, databaseRequest, result) {
	if( R.isEmpty(databaseRequest) ) { res.send("No Results"); }
		fundDataWithFilter(databaseRequest)
		.then(function(response){
			result.funds = response;
			result.clients = [];
			res.send(result);
		});
}

router.get('/query/:querytext', function (req, res) {
	callLuis(res, req.params.querytext)
});

var getQueryEntity = function(response) {
	json_result = JSON.parse(response);
	if ( json_result.intents[0].score > 0.60 ) {
		return json_result.entities[0]; 
	} 
	return undefined;
}

var getEntitiesList = function(response) {
	json_result = JSON.parse(response);
	return json_result.entities;
}

var getIntents = function(response) {
	json_result = JSON.parse(response);
	return json_result.intents[0];
}

var dbRequest = function(response) {
	var db_request = {};
	if(response !== undefined)
	{
		db_request.entity = response.entity;
		db_request.type = response.type; 
		db_request.capitalized = changeCase.titleCase(response.entity);
	}
	return db_request;
}

var customerData = function (request) {
		
		var SQL_CP_Distinct = 'SELECT DISTINCT Client, Category, FSP_number, Reg_number, ' +
							  'Risk_profile_client, Legal_persona_client ' +
							  'FROM FUND_DATA ' +
		                      'WHERE (' + request.type + ' like \'' + request.capitalized + '%\')'
		
		
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
	    
	    		new sql.Request().query(SQL_CP_Distinct)
	    		.then(function(recordset) {
	    			resolve(recordset); 		
	    		}).catch(function(err) {
	      			console.log(err);
	    		 });
	
			});
		
		});

	};

 var fundData = function (customer) {
	
	var SQL_FUNDS = 'SELECT DISTINCT Legal_persona_fund, Fund_name, Reg_number_fund ' +  
					'FROM dbo.FUND_DATA ' + 
					'WHERE (Client like \'' + customer + '%\')';

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
			new sql.Request().query(SQL_FUNDS)
	    		.then(function(recordset) {
	    			resolve(recordset); 		
	    		}).catch(function(err) {
	      			console.log(err);
	    	});
		});
	});
};	

var fundDataWithFilter = function (request) {
	var SQL_FUNDS_FILTER = 'SELECT Client, Legal_persona_fund, Fund_name, Reg_number_fund ' +  
					'FROM dbo.FUND_DATA ' + 
					'WHERE ( Legal_persona_fund like \'' + request.entity + '%\')'

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
			new sql.Request().query(SQL_FUNDS_FILTER)
	    		.then(function(recordset) {
	    			resolve(recordset); 		
	    		}).catch(function(err) {
	      			console.log(err);
	    	});
		});
	});
};	