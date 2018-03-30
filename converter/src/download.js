const fs = require('fs');
const request = require("request");
const cheerio = require("cheerio");

const writeDir = "../data/xlsx/"
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
	for (var i = props.length - 1; i >= 0; i--) {
		request
		  .get('http://ss-obrtnicka-koprivnica.skole.hr'+props[i].url+'&dm_dnl=1')
		  .on('error', function(err) {
		    console.log(err)
		  })
		  .pipe(fs.createWriteStream(writeDir + props[i].naziv));
		  console.log("Preuzeto: "+props[i].naziv);
	  }
}

getUrls()
	.then(data=>{
		downloadXLSX(data);
	}).catch(error=>{
		console.log(error);
	});