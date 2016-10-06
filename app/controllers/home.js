var express = require('express'),
  router = express.Router(); 
var sql = require('mssql');
var Promise = require("bluebird");
var changeCase = require('change-case');

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

  request(LUIS_URL + req.params.querytext, function (error, response, body) {
  if (!error && response.statusCode == 200) {
		var request = dbRequest(getQueryEntity(body)); 
		var customerEntity = changeCase.titleCase(request.entity);
		var result = {};
		var queryResponse = {};
		queryResponse.intent = getIntents(body);  
		queryResponse.entities = getEntitiesList(body); 
		result.queryResponse = queryResponse;
		customerData(customerEntity).then(function(response) {
			if(response !== undefined){
				result.clients = response;
				return result;
			}
			return result;
		}).then(function(customerData) {
			return fundData(customerEntity).then(function(fundData) {
				if(result.clients.length > 0){
					result.clients[0].funds = fundData;
					return result;
				}
				return result;
			});
		}).then(function(result) {
			res.send(result);
		}); 
	}
  });
});

//Test method
router.get('/dbtest', function(req, res, next) {
	//var customer = getQueryEntity();
	var result = {}; 
	customerData('Allan Gray').then(function(response){
		result.client = response;
		return result;
	}).then(function(customerData){
		return fundData('Allan Gray').then(function(fundData){
			result.funds = fundData;
			return result;
		});
	}).then(function(result){
		res.send(result);
	});
});

var getQueryEntity = function(response) {
	json_result = JSON.parse(response);
	return json_result.entities[0];
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
	console.log(response);
	var db_request = {};
	if(response !== undefined)
	{
		db_request.entity = response.entity;
		db_request.type = response.type; 
	}
	return db_request;
}

var customerData = function (customer) {
		
		var SQL_CP_Distinct = 'SELECT DISTINCT Client, Category, FSP_number, Reg_number, ' +
							  'Risk_profile_client, Legal_persona_client ' +
							  'FROM FUND_DATA ' +
		                      'WHERE (Client like \'' + customer + '%\')'
		
		
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