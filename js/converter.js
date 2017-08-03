	// XLSX to JSON

		/* set up XMLHttpRequest */
		var url = "19.12._B_smjena.xlsx";
		var oReq = new XMLHttpRequest();
		oReq.open("GET", url, true);
		oReq.responseType = "arraybuffer";

		oReq.onload = function(e) {
		  var arraybuffer = oReq.response;

		  /* convert data to binary string */
		  var data = new Uint8Array(arraybuffer);
		  var arr = new Array();
		  for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
		  var bstr = arr.join("");

		  /* Call XLSX */
		  var workbook = XLSX.read(bstr, {type:"binary"});

		  /* DO SOMETHING WITH workbook HERE */
		  var first_sheet_name = workbook.SheetNames[0];
		  /* Get worksheet */
		  var worksheet = workbook.Sheets[first_sheet_name];
		  //document.write(XLSX.utils.sheet_to_json(worksheet,{header:1})+"<hr>");
		}

		oReq.send();