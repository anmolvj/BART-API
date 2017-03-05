var express = require('express');
var router = express.Router();
var request		= require('request');
var parser 			= require('xml2json');


router.get('/', function(req,res,next){
	request.get({url:"http://api.bart.gov/api/stn.aspx?cmd=stns&key=MW9S-E7SL-26DU-VV8V"},function(error,response,body){
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

router.get('/:source', (req,res,next) => {

	 var STN_ABBR = req.params.source;
	 var URL = "http://api.bart.gov/api/stn.aspx?cmd=stninfo&orig=" + STN_ABBR + "&key=MW9S-E7SL-26DU-VV8V"
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
