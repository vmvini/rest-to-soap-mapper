/*
 * Copyright (c) 2016 Marcus Vinícius <vmvini@hotmail.com>
 * MIT Licensed
 */

var RestSoap = function(req, res){

	var soap = require('soap');

	return function(wsdl, clientSoapCallback){
		if(wsdl.auth !== undefined){
			var auth = "Basic " + new Buffer(wsdl.auth.login + ":" + wsdl.auth.password).toString("base64");
			soap.createClient(wsdl.wsdl, { wsdl_headers: {Authorization: auth} }, function(err, client){
				var soapClient;

				if(err){
					res.status(404);
					res.json({err:err, message: "Connection to web service failed"});
					return;
				}
				if(!client){
					res.status(404);
					res.json({message:"The soap client wasn't obtained" });
					return;
				}

				soapClient = new SoapClient(client, wsdl.auth);

				clientSoapCallback(soapClient);

			});
		} else {
			soap.createClient(wsdl, function(err, client){
				var soapClient;

				if(err){
					res.status(404);
					res.json({err:err, message: "Connection to web service failed"});
					return;
				}
				if(!client){
					res.status(404);
					res.json({message:"The soap client wasn't obtained" });
					return;
				}

				soapClient = new SoapClient(client);

				clientSoapCallback(soapClient);

			});
		}
	};
	
	function SoapClient(client, auth){

		var args;
		var methodToCall;

		if(auth) {
			client.setSecurity(new soap.BasicAuthSecurity(auth.login, auth.password));
		}

		this.setArgs = function(argsParam){
			args = argsParam;
			return this;
		};

		this.setMethodToCall = function(callback){
			methodToCall = callback(client);
			return this;
		};


		this.execute = function(){
			methodToCall.call(client, args, function(err, result){

				if(err){
					res.status(404);
					res.json({err:err, message: "erro ao chamar método"});
					return;
				}

				if(!result){
					res.status(404);
					res.json({message: "resultado nulo!"});
					return;
				}

				res.status(200);
				res.json({message:"success", result:result});

			} );
		};

	}


}

module.exports = RestSoap;