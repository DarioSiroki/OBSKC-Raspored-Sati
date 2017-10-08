// Accordion postavke
$( "#accordion" ).accordion({
  collapsible:true,
  active:false,
  heightStyle: "content"
})

// Provjera postoji li kolacic
let input;
let exeCookie;
let smjena;
  function ifCookieExists(){
	input = readCookie("input");
	smjena = readCookie("smjena");
	ajaxReq();
	exeCookie=1;
  }
if (readCookie("input")!="") {ifCookieExists();}

function ajaxReq(){
// jQuery ajax za povlacenje json datoteke
	$.ajax({
		url: smjena,
		dataType: "json",
		success: function(data) {

			let dataL = data.length;
			document.getElementById("datum").innerHTML="Raspored za: " + data[1][0];// Datum rasporeda
			// Arr = raspored bez imena profesora
			let arr = [];
	   			for (let x = 3; x < dataL; x++){
		   			for (let y = 1; y < 36; y++){
		   				arr.push(data[x][y]);
					}
			}			
			// Brisanje duplikata za autocomplete iz Arr u razredi
			let razredi = [];
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
				if (input!=="") {	 // Fixanje buga zbog kojeg su se petlje vrtile dok nije bilo inputa 	
					let trajanjeU = ["7.45-8.30","8.35-9.20","9.25-10.10","10.25-11.10","11.15-12.00","12.05-12.50","12.55-13.40"];
					let trajanjeP = ["13.45-14.30","14.35-15.20","15.25-16.10","16.25-17.10","17.15-18.00","18.05-18.50","18.55-19.40"];
					let trajanje;
					if (data[0][0].search("PRIJE")!=-1) {trajanje=trajanjeU;} else {trajanje=trajanjeP;}					
					let razrediL = razredi.length;
					for (let i = razrediL - 1; i >= 0; i--){ // Loopanje kroz ucenike	   				
				   		if(input==razredi[i]){ //Ako je razred unesen prikazi raspored
				   			let counter=-1;
				   			for (let param = 1; param < 36; param+=7) { // param je varijabla koja se prilagodjava danu
				   			let text="";
				   			for (y = param; y < param+7; y++){ //loopanje kroz stupce
				   			  let provjera = 0;	//varijabla za provjeru dijeli li se razred na grupe
					   			text+="<th>"+(y-param+1)+".sat"+" ("+trajanje[y-param]+")"+"</th>"+"<tr>";
					   			for (x = 2; x < dataL; x++){ //loopanje kroz redove		   						
					   				if(data[x][y]==razredi[i]){ //ako je pronadjen raz 				   					
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
								let dani = ["pon","uto","sri","cet","pet"];
								counter++;
									document.getElementById(dani[counter]).innerHTML=text;
				   			}
							
					// Nakon dohvacanja fixevi		
					let d = new Date();
					let n = d.getDay();
					if(n>5 || n==0){n=1}
					  $( "#accordion" ).accordion({
					  active:n-1, //Otvori tab koji je dan
					  });
   					document.activeElement.blur(); // Fix za bug tipkovnice koja ostane otvorena
   					document.getElementById("datum").innerHTML="Raspored za: " + data[1][0]+", razred:"+input;// Prikaze raspored uz datum, update
   					document.getElementById("zapamti").style.visibility="visible";
   					document.getElementById("ocisti").style.visibility="visible";
						}
					}
				}
			}
		}
	});
}