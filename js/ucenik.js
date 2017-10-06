// Accordion postavke
$( "#accordion" ).accordion({
  collapsible:true,
  active:false,
  heightStyle: "content"
})

// Provjera postoji li kolacic
var input;
var exeCookie;
var smjena;
	function ifCookieExists(){
		input = readCookie("input");
		smjena = readCookie("smjena");
		ucenik();
		exeCookie=1;
	}
if (readCookie("input")!="") {ifCookieExists();}

function ucenik(){
// jQuery ajax za povlacenje json datoteke
	$.ajax({
	url: smjena,
	dataType: "json",
	success: function(data) {
		var dataL = data.length;
		document.getElementById("datum").innerHTML="Raspored za: " + data[1][0];// Datum rasporeda
		// Arr = raspored bez imena profesora
		var arr = [];
   			for (var x = 3; x < dataL; x++){
	   			for (var y = 1; y < 36; y++){
	   				arr.push(data[x][y]);
				}
		}			
		// Brisanje duplikata za autocomplete iz Arr u razredi
		var razredi = [];
			$.each(arr, function(i, el){
			    if($.inArray(el, razredi) === -1) razredi.push(el);
			});
				
	    // Autocomplete
	    $("#tags").autocomplete({
	        delay: 0,
	        source: razredi,
	        minlength:0
		});


		// Input iz trazilice koji se sprema u varijablu input i poziva getRaspored funkciju
		window.onkeyup = keyup;
		function keyup(e) {
		  input = e.target.value.toUpperCase();
		  getRaspored();
		}

 //	Prikazivanje rasporeda
		if (exeCookie) {getRaspored();}

		function getRaspored(){

			var trajanjeU = ["7.45-8.30","8.35-9.20","9.25-10.10","10.25-11.10","11.15-12.00","12.05-12.50","12.55-13.40"];
			var trajanjeP = ["13.45-14.30","14.35-15.20","15.25-16.10","16.25-17.10","17.15-18.00","18.05-18.50","18.55-19.40"];
			var trajanje;
			if (data[0][0].search("PRIJE")!=-1) {trajanje=trajanjeU;} else {trajanje=trajanjeP;}
			
			var razrediL = razredi.length;
			for (var i = razrediL - 1; i >= 0; i--){ // Loopanje kroz ucenike
			if (input!=="") { // Fixanje buga zbog kojeg su se petlje vrtile dok nije bilo inputa 		   				
		   		if(input==razredi[i]){ //Ako je razred unesen prikazi raspored
		   			// Ponedjeljak
		   			var text="";
		   			for (y = 1; y < 8; y++){ //loopanje kroz stupce

		   			  var provjera = 0;	//varijabla za provjeru dijeli li se razred na grupe
			   			text+="<th>"+y+".sat"+" ("+trajanje[y-1]+")"+"</th>"+"<tr>";
			   			for (x = 2; x < dataL; x++){ //loopanje kroz redove		   				
			   				
			   				if(data[x][y]==razredi[i]) //ako je pronadjen raz 
			   				{
			   					
			   					if(provjera==0){ //uvjet za provjeru 
			   				text +=  "<td>" + data[x][0];//ispisi prvi stupac
			   				provjera++;
			   				}
			   						else{
			   							text += "/" + data[x][0];
			   						}

			   			}
						}
						text+="</td></tr>";
					}
							document.getElementById('pon').innerHTML=text;

		   			// Utorak
		   			var text="";
		   			for (y = 8; y < 15; y++){ //loopanje kroz stupce

		   			  var provjera = 0;	//varijabla za provjeru dijeli li se razred na grupe
			   			text+="<th>"+(y-7)+".sat"+" ("+trajanje[y-8]+")"+"</th>"+"<tr>";
			   			for (x = 2; x < dataL; x++){ //loopanje kroz redove		   				
			   				
			   				if(data[x][y]==razredi[i]) //ako je pronadjen raz 
			   				{
			   					
			   					if(provjera==0){ //uvjet za provjeru 
			   				text +=  "<td>" + data[x][0];//ispisi prvi stupac
			   				provjera++;
			   				}
			   						else{
			   							text += "/" + data[x][0];
			   						}

			   			}
						}
						text+="</td></tr>";
					}
							document.getElementById('uto').innerHTML=text;

		   			// Srijeda
		   			var text="";
		   			for (y = 15; y < 22; y++){ //loopanje kroz stupce

		   			  var provjera = 0;	//varijabla za provjeru dijeli li se razred na grupe
			   			text+="<th>"+(y-14)+".sat"+" ("+trajanje[y-15]+")"+"</th>"+"<tr>";
			   			for (x = 2; x < dataL; x++){ //loopanje kroz redove		   				
			   				
			   				if(data[x][y]==razredi[i]) //ako je pronadjen raz 
			   				{
			   					
			   					if(provjera==0){ //uvjet za provjeru 
			   				text +=  "<td>" + data[x][0];//ispisi prvi stupac
			   				provjera++;
			   				}
			   						else{
			   							text += "/" + data[x][0];
			   						}

			   			}
						}
						text+="</td></tr>";
					}
							document.getElementById('sri').innerHTML=text;

		   			// Cetvrtak
		   			var text="";
		   			for (y = 22; y < 29; y++){ //loopanje kroz stupce

		   			  var provjera = 0;	//varijabla za provjeru dijeli li se razred na grupe
			   			text+="<th>"+(y-21)+".sat"+" ("+trajanje[y-22]+")"+"</th>"+"<tr>";
			   			for (x = 2; x < dataL; x++){ //loopanje kroz redove		   				
			   				
			   				if(data[x][y]==razredi[i]) //ako je pronadjen raz 
			   				{
			   					
			   					if(provjera==0){ //uvjet za provjeru 
			   				text +=  "<td>" + data[x][0];//ispisi prvi stupac
			   				provjera++;
			   				}
			   						else{
			   							text += "/" + data[x][0];
			   						}

			   			}
						}
						text+="</td></tr>";
					}
							document.getElementById('cet').innerHTML=text;


		   			// Petak
		   			var text="";
		   			for (y = 29; y < 36; y++){ //loopanje kroz stupce

		   			  var provjera = 0;	//varijabla za provjeru dijeli li se razred na grupe
			   			text+="<th>"+(y-28)+".sat"+" ("+trajanje[y-29]+")"+"</th>"+"<tr>";
			   			for (x = 2; x < dataL; x++){ //loopanje kroz redove		   				
			   				
			   				if(data[x][y]==razredi[i]) //ako je pronadjen raz 
			   				{
			   					
			   					if(provjera==0){ //uvjet za provjeru 
			   				text +=  "<td>" + data[x][0];//ispisi prvi stupac
			   				provjera++;
			   				}
			   						else{
			   							text += "/" + data[x][0];
			   						}

			   			}
						}
						text+="</td></tr>";
					}
							document.getElementById('pet').innerHTML=text; 	
					
			// Nakon dohvacanja fixevi		
			var d = new Date();
			var n = d.getDay();
			if(n>5 || n==0){n=1}
				$( "#accordion" ).accordion({
				  active:n-1, //Otvori tab koji je dan
				});
		   					document.activeElement.blur(); // Fix za bug tipkovnice koja ostane otvorena
		   					document.getElementById("datum").innerHTML="Raspored za: " + data[1][0]+", razred:"+input;// Prikaze raspored uz datum, update
		   					document.getElementById("zapamti").style.visibility="visible";
		   					document.getElementById("ocisti").style.visibility="visible";
					}}
				}
			}
		}
	});
}