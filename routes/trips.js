var express = require('express');
var router = express.Router();
var request		= require('request');
var parser 			= require('xml2json');

router.get('/:source/:destination', function(req,res,next){
	
	 var source = req.params.source;
	 var destination	= req.params.destination;
	
	 var URL = "http://api.bart.gov/api/sched.aspx?cmd=depart&orig=" + source + "&dest=" + destination + "&date=now&key=MW9S-E7SL-26DU-VV8V&b=2&a=2&l=1"
	 request.get({url:URL},function(error,response,body){
		 if (!error && response.statusCode == 200) { 
                  var result = parser.toJson(body, {
				              object: false,
				              reversible: false,
				              coerce: true,
				              sanitize: true,
				              trim: true,
				              arrayNotation: false
						           });
		           res.set('Content-Type', 'application/json');
		           res.send(result); 
                 }
	 });
});


router.get('/:source/:destination/:date', (req,res,next) => {
	
	 var source = req.params.source;
	 var destination	= req.params.destination;
	 var date	= req.params.date;
	
	 var URL = "http://api.bart.gov/api/sched.aspx?cmd=depart&orig=" + source + "&dest=" + destination + "&date=" + date + "&key=MW9S-E7SL-26DU-VV8V&b=2&a=2&l=1"
	 request.get({url:URL},function(error,response,body){
		 if (!error && response.statusCode == 200) { 
                  var result = parser.toJson(body, {
				              object: false,
				              reversible: false,
				              coerce: true,
				              sanitize: true,
				              trim: true,
				              arrayNotation: false
						           });
			           res.set('Content-Type', 'application/json');
			           res.send(result); 
                 }
	 });
});

module.exports = router;
