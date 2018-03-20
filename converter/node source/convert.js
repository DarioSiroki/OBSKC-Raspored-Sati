const fs = require("fs");
const XLSX = require("xlsx-style"); // https://github.com/protobi/js-xlsx

const debug = false;
const loopabet = [
	"B",
	"C",
	"D",
	"E",
	"F",
	"G",
	"H",
	"I",
	"J",
	"K",
	"L",
	"M",
	"N",
	"O",
	"P",
	"Q",
	"R",
	"S",
	"T",
	"U",
	"V",
	"W",
	"X",
	"Y",
	"Z",
	"AA",
	"AB",
	"AC",
	"AD",
	"AE",
	"AF",
	"AG",
	"AH",
	"AI",
	"AJ"
];
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

let rmWeirdFiles = () => {
	fs.readdirSync(scanFolder).forEach(file => {
		if (file.indexOf("$") !== -1) {
			fs.unlinkSync(file);
		}
	});
};

let componentToHex = c => {
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
};

let rgbToHex = (r, g, b) => {
	return componentToHex(r) + componentToHex(g) + componentToHex(b);
};

let hexToRgb = hex => {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result
		? [
				parseInt(result[1], 16),
				parseInt(result[2], 16),
				parseInt(result[3], 16)
			]
		: null;
};

let calcRGBandTint = (r, g, b, tint) => {
	return {
		r: Math.round(r + (255 - r) * tint),
		g: Math.round(g + (255 - g) * tint),
		b: Math.round(b + (255 - b) * tint)
	};
};

let tintAndHexToHex = (hex, tint) => {
	let rgbVal = hexToRgb(hex);
	let newRgbVal = calcRGBandTint(...rgbVal, Math.abs(tint));
	return rgbToHex(newRgbVal.r, newRgbVal.g, newRgbVal.b);
};

let formatName = input => {
  input = input.replace("smjena","").replace("xlsx","json").split(".");
  let smjena = "";
  for (let i = 0; i < input.length; i++) {
    if(input[i].indexOf("A")!=-1) {
      smjena = "A";
    } else if(input[i].indexOf("B")!=-1){
      smjena = "B";
    }
  }
  let naziv = months[input[1]]+input[0]+smjena+".json";
  return naziv;
}

// skeniranje foldera
const scanFolder = "./";
paths = [];
fs.readdirSync(scanFolder).forEach(file => {
	paths.push(file);
});
// izbacivanje stavki koje nisu xlsx
paths = paths.filter(word => word.indexOf("xlsx") !== -1);

for (var i = 0; i < paths.length; i++) {
	var workbookRead;
	// citanje xlsxa
	try {
		workbookRead = XLSX.readFile(paths[i], {
			cellStyles: true,
			cellHTML: false
		});
	} catch (error) {
		// silence error
	}

	var workbook = workbookRead.Sheets[workbookRead.Props.SheetNames[0]];

	var final = [];
	var info = {
		smjena: workbook.A1.v.charAt(0),
		datum: workbook.A2.v,
		prijeposlije: workbook.A1.v.search("POSLIJE") === -1 ? "PRIJE" : "POSLIJE"
	};
	final.push(info);

	// vrti kroz prvih 100 redaka
	for (let i = 4; i < 100; i++) {
		if (typeof workbook["A" + i] !== "undefined") {
			let profesor = [];
			profesor.push(workbook["A" + i].v);
			for (let ii = 0; ii < loopabet.length; ii++) {
				let razred = workbook[loopabet[ii] + i];
				if (razred.v === "") {
					// za prazne celije
					profesor.push("");
				} else {
					let fill = {
						name: razred.v
					};

					if (razred.s.fill) {
						// za pozadinsku boju
						if (
							razred.s.fill.fgColor &&
							Object.keys(razred.s.fill.fgColor).length !== 0
						) {
							// za pozadinsku boju (fgColor)
							if (razred.s.fill.fgColor.hasOwnProperty("tint")) {
								fill.bgColor = tintAndHexToHex(
									razred.s.fill.fgColor.rgb.length > 6
										? razred.s.fill.fgColor.rgb.substring(2)
										: razred.s.fill.fgColor.rgb,
									razred.s.fill.fgColor.tint
								);
							} else {
								if (razred.s.fill.fgColor.rgb !== "000000") {
									// .substring() pretvara excel value u hex value boje (excel koristi hex sa FF na pocetku stringa)
									if (razred.s.fill.fgColor.rgb.length > 6) {
										fill.bgColor = razred.s.fill.fgColor.rgb.substring(2);
									} else {
										fill.bgColor = razred.s.fill.fgColor.rgb;
									}
								}
							}
						}
					}

					if (razred.s.font.color) {
						// za boju fonta
						if (
							razred.s.font.color.rgb &&
							Object.keys(razred.s.font.color.rgb).length !== 0
						) {
							if (razred.s.font.color.rgb.length > 6) {
								fill.fontColor = razred.s.font.color.rgb.substring(2);
							} else {
								fill.fontColor = razred.s.font.color.rgb;
							}
						}
					}

					if (razred.s.fill) {
						// za patterne
						if (razred.s.fill.patternType) {
							if (razred.s.fill.patternType !== "solid") {
								fill.pattern = razred.s.fill.patternType;
							}
						}
					}

					profesor.push(fill);
				}
			}
			final.push(profesor);
		}
	}

	// dezurni prof.
	for (let i = final.length - 1; i >= 0; i--) {
		for (let ii = 0; ii < final[i].length; ii++) {
			if (final[i].indexOf("DEŽURNI PROFESORI") != -1) {
				final[0].dezurni = final[i].filter(function(e) {
					return e;
				});
			}
		}
	}

	fs.writeFile(
		formatName(paths[i]),
		JSON.stringify(final),
		function(err) {
			if (err) {
				return console.log(err);
			}
			rmWeirdFiles();
		}
	);

	if (debug) {
		fs.writeFile(
			"debug_" + formatName(paths[i]),
			JSON.stringify(workbookRead),
			function(err) {
				if (err) {
					return console.log(err);
				}
			}
		);
	}
}

/*
const legendaUcionice = {
	"FF99CC": "uč. 35",
	"00FF00": "uč. 41",
	"0099FF": "uč. 42",
	"FFFF00": "uč. 45a", //sumnjivo
	"996600": "uč. 45b",
	"FFD9CD": "konobarski praktikum",
	"CC99FF": "forum 1",
	"C0C0C0": "rač. kabinet 1",//sumnjivo
	"FFCC00": "rač. kabinet 2",
	"lightHorizontal": "forum 2",
	"lightUp": "forum 5",
	"lightVertical": "forum 3",
	"99CCFF": "forum 4",
	"FF0000": "rač. kabinet 3",
	"gray125": "uč. 37",
	"CCFFCC": "rač. kabinet 4"
}
*/
