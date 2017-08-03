

//                      Jquery ajax za povlacenje json datoteke


    $.ajax({
    url: "js/data.json",
    dataType: "json",
    success: function(out) {
        jsondata = $.map(out, function(item) {
            return {
                label: item[0]
            };                 
        });

        jsondata.shift();
        jsondata.shift();
            // autocomplete
        $("#tags").autocomplete({
            delay: 0,
            source: jsondata,
            minlength:0
        });


//                      Input iz trazilice koji se sprema u varijablu input
    window.onkeyup = keyup;
    var input;
    function keyup(e) {
      input = e.target.value;
      getRaspored();
    }

 //						Prikazivanje rasporeda
 			function getRaspored()
 			{
				for (i = 2; i < out.length; i++) // Loopanje kroz profesore
				{					   				
					   		if(input==out[i][0]) //Ako je profesor unesen prikazi raspored
					   			{

					   			// Ponedjeljak
					   			var text="";
					   			for (z = 1; z < 8; z++){
					   				
					   				text +=  "<td>" + out[i][z] + "</td>";
		   				

					   			}
										document.getElementById('pon').innerHTML=text;
					   			// Utorak
					   			var text="";
					   			for (z = 8; z < 15; z++){
					   				
					   				text +=  "<td>" + out[i][z] + "</td>";
		   				

					   			}
										document.getElementById('uto').innerHTML=text;
					   			// Srijeda
					   			var text="";
					   			for (z = 15; z < 22; z++){
					   				
					   				text +=  "<td>" + out[i][z] + "</td>";
		   				

					   			}
										document.getElementById('sri').innerHTML=text;	
					   			// Cetvrtak
					   			var text="";
					   			for (z = 22; z < 29; z++){
					   				
					   				text +=  "<td>" + out[i][z] + "</td>";
		   				

					   			}
										document.getElementById('cet').innerHTML=text;
					   			// Petak
					   			var text="";
					   			for (z = 29; z < 36; z++){
					   				
					   				text +=  "<td>" + out[i][z] + "</td>";
		   				

					   			}
										document.getElementById('pet').innerHTML=text; 		
					   			}
				}
			}


							
							

}});