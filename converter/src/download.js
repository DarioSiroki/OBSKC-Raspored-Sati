const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");

let isTimetable = str => {
  str = str.toUpperCase()
  if (
    !str.includes("XLSX") ||
    str.includes("PRAKS") ||
    !str.includes("SMJENA")
  ) {
    return false;
  }
  return true;
};

let getAvailableTimetables = async () => {
  try {
    const response = await axios.get(
      "http://ss-obrtnicka-koprivnica.skole.hr/rasporedsati?dm2_foldercontents=103&forcetpl=1&mshow=mod_docman&onlylid=mod_docman"
    );
    let $ = cheerio.load(response.data);
    const urls = $("td.fi-title a")
      .map((i, el) => {
        const title = $(el).text().toUpperCase();
        const url = $(el).attr("href").replace("det", "rev")
        if (isTimetable(title)) {
          return {
            title,
            url
          };
        }
      })
      .get()
    return urls;
  } catch(e) {
    throw new Error(e)
  }
};

(async () => {
  const timetables = await getAvailableTimetables();
  for (const timetable of timetables) {
    try {
      const response = axios.get(
        `http://ss-obrtnicka-koprivnica.skole.hr${timetable.url}&dm_dnl=1`
      );
      fs.writeFileSync(`./data/xlsx/${timetable.title}`, response.data);
      console.log(`PREUZETO: ${timetable.title}`);
    } catch(e) {
      throw new Error(e)
    }
  }
})();
