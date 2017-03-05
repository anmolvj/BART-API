$( document ).ready(function() {
    
	visitCount();
	populate();




	var minArivalTime;

	var sLat;
	var sLong;
	var dLat;
	var dLong;

	var sAddress;
	var sCity;
	var sCounty;
	var sState;
	var sZip;
	
	
	var intervalID	= 0;
	var coming ;
   
    var trainOrigin;
	var trainDestination;
	

    $( "#lookup" ).click(function() {
    	var sourceStnName = $('#source').find(':selected').text();
    	var destinationStnName = $('#destination').find(':selected').text();
   		
		var source = $('#source').find(":selected").val(); //values selected
		var destination = $('#destination').find(":selected").val(); //values selected

		//Check if both stations are same
		if(source == destination){
		  	alert("You need to select different stations");
		  }
		  else 
		  {

		  	$("#table").empty();
		  	$("#table").append($('<tr><th>Train Number</th><th>Origin</th><th>Departure</th><th>Destination</th><th>Arrival</th><th>Fare</th></tr>'));
		  	

		  	trainOrigin =  $('#source option:selected').text();
		  	trainDestination =  $('#destination option:selected').text();
		  	
		  		$.get("/station/" + source , function(data, status){ 

		  			sLat		= data.root.stations.station.gtfs_latitude;
		  			sLong		= data.root.stations.station.gtfs_longitude;
		  			sAddress 	= data.root.stations.station.address;
		  			sCity		= data.root.stations.station.city;
					sCounty 	= data.root.stations.station.county;
					sState 		= data.root.stations.station.state;
					sZip 		= data.root.stations.station.zipcode;
		  			
		  			$("#source-info").append($('<h2>'+ trainOrigin+'</h2>' + '<p>Local Address: ' + sAddress + '</p>'  + '<p>City: ' + sCity + '</p>'+ '<p>County: ' + sCounty + '</p>' + '<p>State: ' + sState + '</p>' + '<p>City: ' + sCity + '</p>'  +'<p>ZipCode: ' + sZip + '</p>'));
		  			$.get("/station/" + destination , function(data, status){ 

		  			dLat	= data.root.stations.station.gtfs_latitude;
		  			dLong	= data.root.stations.station.gtfs_longitude;
		  			
		  			map(sLat,sLong,dLat,dLong);
		  		});
		  		});

		  		

		  		
		  		
		  		
		  		

		  		$.get("/trips/" + source + "/" + destination, function(data, status){ 
				var minArivalTime = Number.POSITIVE_INFINITY;

			  	$.each(data.root.schedule.request.trip, function(key,value){

			  		var fare	= value.fare;//same
			  		var trainID = value.leg.trainId;//these are multiple
					var route 	= value.leg.line;
	  				var arrival = value.leg.destTimeMin;
	  				var departure = value.origTimeMin;
	  				var date = value.origTimeDate;

	  				var hours = Number(departure.match(/^(\d+)/)[1]);
					var minutes = Number(departure.match(/:(\d+)/)[1]);
					var AMPM = departure.match(/\s(.*)$/)[1];
					if(AMPM == "PM" && hours<12) hours = hours+12;
					if(AMPM == "AM" && hours==12) hours = hours-12;
					var sHours = hours.toString();
					var sMinutes = minutes.toString();
					if(hours<10) sHours = "0" + sHours;
					if(minutes<10) sMinutes = "0" + sMinutes;
					

					 

					var trainTime=new Date(date+departure);
					var arrivalTimeTotalSec=(trainTime-new Date())/1000;
					var arrivalTimeMin= Math.floor(arrivalTimeTotalSec/60);
					var arrivalTimesec= Math.abs(Math.floor(arrivalTimeTotalSec % 60));
					
					

					 if(minArivalTime > arrivalTimeTotalSec && arrivalTimeTotalSec>0){

              				minArivalTime=arrivalTimeTotalSec;
             			}


					
					

					var result = trainID + " | " + trainOrigin + "-->" + departure + " | " + trainDestination + "-->" + arrival + " $" + fare  + " | " ;
	  				

	  				$("#table").append($('<tr>' +'<td>'+ trainID +'</td>' +'<td>'+ trainOrigin+ '</td>'+ '<td>' + departure + '</td>' +'<td>' + trainDestination + '</td>'+ '<td>' + arrival + '</td>' + '<td>$' + fare +'</td>' + '</tr>'));
        			
        			

        			});

			  	$('#depart-text').css("display", "block");
			  	$('#clockC').timeTo({

					    seconds: Math.floor(minArivalTime)

					});
			  	console.log(minArivalTime);
			  	});

			  	

		  		$('#table').addClass('border');


			  	clearInterval(intervalID);
		  		intervalID = setInterval(function(){

		  		
		  		$("#table").empty();
		  		$("#table").append($('<tr><th>Train Number</th><th>Origin</th><th>Departure</th><th>Destination</th><th>Arrival</th><th>Fare</th></tr>'));


		  		$.get("/trips/" + source + "/" + destination, function(data, status){ 
					var minArivalTime = Number.POSITIVE_INFINITY;
			  	$.each(data.root.schedule.request.trip, function(key,value){

			  		var fare	= value.fare;//same
			  		var trainID = value.leg.trainId;//these are multiple
					var route 	= value.leg.line;
	  				var arrival = value.leg.destTimeMin;
	  				var departure = value.origTimeMin;

	  				var hours = Number(departure.match(/^(\d+)/)[1]);
					var minutes = Number(departure.match(/:(\d+)/)[1]);
					var AMPM = departure.match(/\s(.*)$/)[1];
					if(AMPM == "PM" && hours<12) hours = hours+12;
					if(AMPM == "AM" && hours==12) hours = hours-12;
					var sHours = hours.toString();
					var sMinutes = minutes.toString();
					if(hours<10) sHours = "0" + sHours;
					if(minutes<10) sMinutes = "0" + sMinutes;
					var time = (hours*3600)+(minutes*60);
					var date = value.origTimeDate;

					var trainTime=new Date(date+ "" +departure);
					var arrivalTimeTotalSec=(trainTime-new Date())/1000;
					var arrivalTimeMin= Math.floor(arrivalTimeTotalSec/60);
					var arrivalTimesec= Math.abs(Math.floor(arrivalTimeTotalSec % 60));
					 

					 if(minArivalTime > arrivalTimeTotalSec && arrivalTimeTotalSec>0){
              				minArivalTime=arrivalTimeTotalSec;
             			};


					

	  				$("#table").append($('<tr>' +'<td>'+ trainID +'</td>' +'<td>'+ trainOrigin+ '</td>'+ '<td>' + departure + '</td>' +'<td>' + trainDestination + '</td>'+ '<td>' + arrival + '</td>' + '<td>$' + fare +'</td>' + '</tr>'));
        			
        			var result = trainID + " | " + trainOrigin + "-->" + departure + " | " + trainDestination + "-->" + arrival + " $" + fare  + " | " ;
	  				

        			});
				  		$('#clockC').timeTo({
				  			
						    seconds: Math.floor(minArivalTime)
						});
						console.log(minArivalTime);
			  	});

		  			},30000)
			
		  	 
		  }


		});


});

function visitCount(){
	var n = localStorage.getItem("count");
	if(n==null)
	{
		alert("0");
		localStorage.setItem("count", "1");
	}else{
		alert(n);
		localStorage.setItem("count", Number(n)+1);
		}
	}
function populate(){
	$.get("/stations", function(data, status){
        $.each(data.root.stations.station, function(key,value){
        	$(".stations").append($('<option></option>').val(value.abbr).html(value.name));
        });
    	});
	}

function map(sLat,sLong,dLat,dLong){
					
		  			var directionsService = new google.maps.DirectionsService;
				    var directionsDisplay = new google.maps.DirectionsRenderer;
				    var mapCanvas = document.getElementById("map");
				    
				    var mapOptions = { zoom: 15,scrollwheel: false};
				    var map = new google.maps.Map(mapCanvas, mapOptions);
				    directionsDisplay.setMap(map);
				       directionsService.route({
				            origin: new google.maps.LatLng(sLat,sLong),
				            destination: new google.maps.LatLng(dLat,dLong),
				            travelMode: 'TRANSIT'
				            }, function(response, status) {
				            if (status === 'OK') {
				              directionsDisplay.setDirections(response);
				            } else {
				              window.alert('Directions request failed due to ' + status);
				            }
				          });

		  		}
 









 
