const fs = require('fs');
const request = require("request");
const cheerio = require("cheerio");

const months = {
	'1': 'January', 
	'2': 'February', 
	'3': 'March', 
	'4': 'April', 
	'5': 'May', 
	'6': 'June', 
	'7': 'July', 
	'8': 'August', 
	'9': 'September', 
	'10': 'October', 
	'11': 'November', 
	'12': 'December'
};

const url = "http://ss-obrtnicka-koprivnica.skole.hr/rasporedsati?dm2_foldercontents=103&forcetpl=1&mshow=mod_docman&onlylid=mod_docman";

let getUrls = () => {
	return new Promise((resolve, reject) => {
		request({url: url},(error, resp, body) => {
			if (body) {
				let $ = cheerio.load(body);
				let urls =  $("td.fi-title a").map((i,el) => {
					if ($(el).text().toUpperCase().search("XLSX")!==-1) {
						return {
							naziv: $(el).text().toUpperCase(),
							url: $(el).attr('href').replace("det","rev")
						}; 
					}
				}).get();
				resolve(urls);
			}
		});
	});
}

let downloadXLSX = (props) => {
	let fileName = props.unformattedDate+props.smjena+".xlsx";
	request
	  .get('http://ss-obrtnicka-koprivnica.skole.hr'+props.url+'&dm_dnl=1')
	  .on('error', function(err) {
	    console.log(err)
	  })
	  .pipe(fs.createWriteStream(fileName));
	  console.log("Preuzeto: "+fileName);
}

getUrls()
	.then(data=>{
		res = {
			Asmjena: [],
			Bsmjena: []
		};
		for (let i = 0; i < data.length; i++) {
			data[i].naziv = data[i].naziv.replace("SMJENA","");
			data[i].naziv = data[i].naziv.split(".");
			for (let ii = 0; ii < data[i].naziv.length; ii++) {
				data[i].naziv[ii] = data[i].naziv[ii].replace(/ /g,"");
				if (data[i].naziv[ii].search("A")!=-1) {
					data[i].smjena = "A";
					res.Asmjena.push(data[i]);
				} else if (data[i].naziv[ii].search("B")!=-1){
					data[i].smjena = "B";
					res.Bsmjena.push(data[i]);
				}
			}
			data[i].date = new Date(months[data[i].naziv[1]]+data[i].naziv[0]);
			data[i].unformattedDate = months[data[i].naziv[1]]+data[i].naziv[0];
		}

		let getNewer = (smjena) => {
			let winner;
			for (let i = 0; i < res[smjena].length; i++) {
				for (let ii = 0; ii < res[smjena].length; ii++) {
					if(res[smjena][i].date >= res[smjena][ii].date) {
						winner = res[smjena][i];
					}
				}
			}
			return winner;
		}
		winnerA = getNewer("Asmjena");
		winnerB = getNewer("Bsmjena");
		downloadXLSX(winnerA);
		downloadXLSX(winnerB);
	}).catch(error=>{
		console.log(error);
	});