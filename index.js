/*
 * Copyright (c) 2016 Marcus Vinícius <vmvini@hotmail.com>
 * MIT Licensed
 */

module.exports = function(wsdl, setMethodToCall, setArgs ){

	var RestSoap = require('./restsoap');

	return function(req, res){
		
		var args = {};
		
		if(setArgs !== undefined){
			args = setArgs(req);
		}
		
		var restSoap = RestSoap(req, res);

		restSoap(wsdl, function(soapClient){

			soapClient
				.setArgs(args)
				.setMethodToCall( function(client){
					return setMethodToCall(client);
				} )
				.execute();

		});

	};



};
