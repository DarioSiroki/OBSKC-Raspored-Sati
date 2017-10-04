 function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

function cookies() {
  document.cookie = "input="+document.getElementById("tags").value.toUpperCase()+";expires=Wed, 1 Jan 2070 12:00:00 UTC";
  document.cookie = "smjena="+smjena+";expires=Wed, 1 Jan 2070 12:00:00 UTC";
  var x = readCookie("input");
  var y = readCookie("smjena");
  var odabir;
  if (x == "" || y == "") {alert("Prvo odaberi smjenu i razred");}
	else{
  if (y=="js/B.json") {odabir="B"} else {odabir="A"}
  alert("Odabran je "+x+" razred i "+odabir+" smjena, osvježavanjem stranice ovaj odabir će uvijek biti zapamćen");
	}
    //console.log(document.cookie);
}

function clearCookies() {
	document.cookie = "input=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
	document.cookie = "smjena=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
	alert("Odabir je očišćen");
		//console.log(document.cookie);
}

