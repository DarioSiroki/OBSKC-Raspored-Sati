$(document).ready(function () {
  if (
    (window.localStorage.getItem("smjena") &&
      window.localStorage.getItem("smjena") === "js/A.json") ||
    window.localStorage.getItem("smjena") === "js/B.json"
  ) {
    window.localStorage.setItem("smjena", "");
  }

  var baseURL =
    "https://raw.githubusercontent.com/DarioSiroki/OBSKC-Raspored-Sati/master/converter/data/json/";
  var input, smjena, osoba, verzija;
  var ACsrc = [];
  getVersion();
  var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  var daniID = ["pon", "uto", "sri", "cet", "pet"],
    trajanjeU = [
      "7.45-8.30",
      "8.35-9.20",
      "9.25-10.10",
      "10.25-11.10",
      "11.15-12.00",
      "12.05-12.50",
      "12.55-13.40",
    ],
    trajanjeP = [
      "13.45-14.30",
      "14.35-15.20",
      "15.25-16.10",
      "16.25-17.10",
      "17.15-18.00",
      "18.05-18.50",
      "18.55-19.40",
    ];

  // Accordion postavke
  $("#accordion").accordion({
    collapsible: true,
    active: false,
    heightStyle: "content",
  });
  /*
_________  ________   ________    ____  __..___ ___________  _________
\_   ___ \ \_____  \  \_____  \  |    |/ _||   |\_   _____/ /   _____/
/    \  \/  /   |   \  /   |   \ |      <  |   | |    __)_  \_____  \ 
\     \____/    |    \/    |    \|    |  \ |   | |        \ /        \
 \______  /\_______  /\_______  /|____|__ \|___|/_______  //_______  /
        \/         \/         \/         \/             \/         \/ 
*/

  // Pohranjivanje kolacica
  function cookies() {
    window.localStorage.setItem("input", input);
    window.localStorage.setItem("smjena", smjena);
    window.localStorage.setItem("osoba", osoba);
  }

  // Automatsko izvrsavanje skripte ako postoje kolacici
  input = window.localStorage.getItem("input");
  smjena = window.localStorage.getItem("smjena");
  osoba = window.localStorage.getItem("osoba");
  if (input && smjena && osoba !== "") {
    getRaspored();
  }
  /*
   _____        ____.   _____   ____  ___
  /  _  \      |    |  /  _  \  \   \/  /
 /  /_\  \     |    | /  /_\  \  \     / 
/    |    \/\__|    |/    |    \ /     \ 
\____|__  /\________|\____|__  //___/\  \
        \/                   \/       \_/
*/

  function filterVersionsFromJsonAndFillDom(verzije) {
    var datumi = [];
    var aktivniRaspored = "";
    for (var i = verzije.length - 1; i >= 0; i--) {
      datumi.push(verzije[i].substring(0, verzije[i].length - 6));
    }
    datumi = datumi.filter(function (item, pos) {
      return datumi.indexOf(item) == pos;
    });
    datumi = datumi.sort(function (a, b) {
      a = new Date(a);
      b = new Date(b);
      return a > b ? -1 : a < b ? 1 : 0;
    });
    for (var i = 0; i < datumi.length; i++) {
      var d = new Date(datumi[i] + ",2018");
      var today = new Date();
      var calc =
        new Date(datumi[i] + " " + (1900 + today.getYear())).getTime() -
        (today.getTime() + 259200000);
      if (calc < 0 && calc > -691200000) {
        verzija = datumi[i];
        var verzijaMjesec = d.getMonth() + 1;
        var id = i;
      }
      $("#datum").append(
        "<option value=" +
          i +
          "> " +
          datumi[i].match(/\d/g).join("") +
          "." +
          (d.getMonth() + 1) +
          ". </option>"
      );
    }
    $("select#datum").val(id);
  }

  // dohvacanje verzija rasporeda
  function getVersion() {
    if (window.localStorage.getItem("verzije") && !navigator.onLine) {
      filterVersionsFromJsonAndFillDom(
        JSON.parse(window.localStorage.getItem("verzije"))
      );
    } else if (navigator.onLine) {
      $.ajax({
        url: baseURL + "versions.json",
        dataType: "json",
        async: false,
        success: function (callback) {
          window.localStorage.setItem("verzije", JSON.stringify(callback));
          filterVersionsFromJsonAndFillDom(callback);
        },
      });
    } else {
      alert(
        "Spojite se na internet da bi se rasporedi mogli preuzeti, nakon što se preuzmu aplikacija radi bez internetske konekcije."
      );
    }
  }

  function fetchRasp(smjena) {
    var result;
    // za obje smjene
    if (smjena === "A/B") {
      var result = [];
      if (
        window.localStorage.getItem(verzija + "A") &&
        window.localStorage.getItem(verzija + "B")
      ) {
        result[0] = JSON.parse(window.localStorage.getItem(verzija + "A"));
        result[1] = JSON.parse(window.localStorage.getItem(verzija + "B"));
        return result;
      }
      $.ajax({
        url: baseURL + verzija + "A.json",
        dataType: "json",
        async: false,
        success: function (callback) {
          result[0] = callback;
          window.localStorage.setItem(verzija + "A", JSON.stringify(callback));
        },
      });
      $.ajax({
        url: baseURL + verzija + "B.json",
        dataType: "json",
        async: false,
        success: function (callback) {
          result[1] = callback;
          window.localStorage.setItem(verzija + "B", JSON.stringify(callback));
        },
      });
    } else {
      if (window.localStorage.getItem(verzija + smjena)) {
        result = JSON.parse(window.localStorage.getItem(verzija + smjena));
        return result;
      }
      // za jednu smjenu
      $.ajax({
        url: baseURL + verzija + smjena + ".json",
        dataType: "json",
        async: false,
        success: function (callback) {
          result = callback;
          window.localStorage.setItem(
            verzija + smjena,
            JSON.stringify(callback)
          );
        },
      });
    }
    return result;
  }
  /*
_____________________    _____   __________.___ .____     .___ _________     _____   
\__    ___/\______   \  /  _  \  \____    /|   ||    |    |   |\_   ___ \   /  _  \  
  |    |    |       _/ /  /_\  \   /     / |   ||    |    |   |/    \  \/  /  /_\  \ 
  |    |    |    |   \/    |    \ /     /_ |   ||    |___ |   |\     \____/    |    \
  |____|    |____|_  /\____|__  //_______ \|___||_______ \|___| \______  /\____|__  /
                   \/         \/         \/             \/             \/         \/ 
*/

  // Modal input
  $("select").change(function () {
    var selected = $("select option:selected").text().split(".") || [];
    verzija = months[parseInt(selected[1]) - 1] + selected[0].replace(/ /g, "");
    try {
      trazilicaData();
    } catch (error) {}
  });
  $(".osoba").click(function () {
    $(".smjena").prop("disabled", false);
    osoba = $(".osoba:checked").val() || [];
    try {
      trazilicaData();
    } catch (error) {}
  });
  $(".smjena").click(function () {
    $("#tags").prop("disabled", false);
    smjena = $(".smjena:checked").val() || [];
    trazilicaData();
  });
  $("#tags").click(function () {
    $(".en").prop("disabled", false);
  });
  $("#remember").click(function () {
    input = $("#tags").val().toUpperCase();
    cookies();
    getRaspored();
  });

  // Filteri za autocomplete
  function filterRazredi(data, dataL) {
    ACsrc.length = 0;
    var arr = [];
    for (var x = 1; x < dataL - 3; x++) {
      for (var y = 1; y < 36; y++) {
        if (typeof data[x][y] === "object") {
          arr.push(data[x][y].name);
        }
      }
    }
    // filtriranje smeca i duplikata
    $.each(arr, function (i, el) {
      if ($.inArray(el, ACsrc) === -1) ACsrc.push(el);
    });
    ACsrc = ACsrc.filter(function (word) {
      return word.length < 4;
    });
    trazilicaInit();
  }

  function filterProfesor(data, dataL) {
    ACsrc.length = 0;
    for (var i = 1; i < dataL - 3; i++) {
      ACsrc.push(data[i][0]);
    }
    trazilicaInit();
  }

  function filterProfesorAB(data) {
    ACsrc.length = 0;
    var arr1 = [];
    for (var i = 0; i < data.length; i++) {
      for (var ii = 1; ii < data[i].length - 3; ii++) {
        arr1.push(data[i][ii][0]);
      }
    }
    var arr2 = [];
    $.each(arr1, function (i, el) {
      arr2.push(arr1[i].replace(/ /g, "").replace(/-/g, ""));
    });
    var arr3 = [];
    $.each(arr2, function (i, el) {
      if ($.inArray(el, arr3) === -1) {
        arr3.push(el);
        ACsrc.push(arr1[i].replace(/-/g, " "));
      }
    });
    trazilicaInit();
  }

  // Autocomplete
  function trazilicaInit() {
    $("#tags").autocomplete({
      delay: 0,
      source: function (req, responseFn) {
        var re = $.ui.autocomplete.escapeRegex(req.term);
        var matcher = new RegExp("^" + re, "i");
        var a = $.grep(ACsrc, function (item, index) {
          return matcher.test(item);
        });
        responseFn(a);
      },
      minlength: 0,
    });
  }

  // Filtriranje podataka za trazilicu
  function trazilicaData() {
    // Zove ajax i funkcije za filtriranje
    if (osoba == "Učenik") {
      var data = fetchRasp(smjena);
      var dataL = data.length;
      filterRazredi(data, dataL);
    } else if (osoba == "Profesor") {
      if (smjena == "A/B") {
        var data = fetchRasp(smjena);
        var dataL = data.length;
        filterProfesorAB(data);
      } else {
        var data = fetchRasp(smjena);
        var dataL = data.length;
        filterProfesor(data, dataL);
      }
    }
  }
  /*
.____     ________     ________ .___  ____  __.   _____   
|    |    \_____  \   /  _____/ |   ||    |/ _|  /  _  \  
|    |     /   |   \ /   \  ___ |   ||      <   /  /_\  \ 
|    |___ /    |    \\    \_\  \|   ||    |  \ /    |    \
|_______ \\_______  / \______  /|___||____|__ \\____|__  /
        \/        \/         \/              \/        \/ 
*/

  function trajanjeFn(data) {
    trajanje = data.prijeposlije === "PRIJE" ? trajanjeU : trajanjeP;
    return trajanje;
  }

  function returnPattern(data) {
    if (typeof data === "object" && data.hasOwnProperty("pattern")) {
      var value =
        "background-image: url(&img/" +
        data.pattern +
        ".png&);font-weight:600;font-size: 20px;";
      value = value.replace(/&/g, '"');
      return value;
    } else {
      return "";
    }
  }

  function returnBgColor(data) {
    if (typeof data === "object" && data.hasOwnProperty("bgColor")) {
      var value = "background-color:#" + data.bgColor + ";font-weight:600;";
      return value;
    } else {
      return "";
    }
  }

  function returnFontColor(data) {
    if (typeof data === "object" && data.hasOwnProperty("fontColor")) {
      value = "color:#" + data.fontColor + ";";
      return value;
    } else {
      return "";
    }
  }

  function returnStyle(data) {
    return returnPattern(data) + returnBgColor(data) + returnFontColor(data);
  }

  function clearDOM() {
    for (var i = 0; i < daniID.length; i++) {
      document.getElementById(daniID[i]).innerHTML = "";
    }
  }

  function whiteTextForReadability() {
    $("p.inline").each(function () {
      var styles = $(this).css(["background-color", "color", "pattern"]);
      if (
        styles["background-color"] !== "rgba(0, 0, 0, 0)" &&
        styles["background-color"] !== "rgb(204, 255, 204)" &&
        styles.pattern !== null &&
        styles.color === "rgb(51, 51, 51)"
      ) {
        $(this).css("color", "#FFFFFF");
      }
    });
  }

  // Filtriranje i punjenje u accordion aka tour-de-france, gl
  // Profesor
  function getProfesor(data, dataL) {
    clearDOM();

    const poDanu = { pon: [], uto: [], sri: [], cet: [], pet: [] };

    data.forEach((profesor, j) => {
      if (j === 0) return;

      if (
        profesor[0]
          .toUpperCase()
          .replace(/ /g, "")
          .indexOf(input.replace(/ /g, "")) !== -1
      ) {
        for (let i = 1; i < profesor.length; i++) {
          const sat = profesor[i];
          if (typeof sat === "object" && sat.dan) {
            poDanu[sat.dan].push(sat);
          }
        }
      }
    });

    Object.keys(poDanu).forEach((dan) => {
      const sati = poDanu[dan];
      let text = "";

      sati.forEach((celija) => {
        text += `
          <th>${celija.sat}.sat (${celija.trajanje})</th>
        </tr>
        <tr>
          <td>
            <p class='inline' style='${returnStyle(celija)}'>${celija.name}</p>
          </td>
        </tr>`;
      });

      document.getElementById(dan).innerHTML = text;
    });

    finalTouch(data[0]);
  }

  // Prof obje smjene
  function getProfesorAB(data) {
    clearDOM();
    if (data[0][0].prijeposlije === "POSLIJE") {
      var swArr = data[1];
      data[1] = data[0];
      data[0] = swArr;
    }

    // prijepodne
    const poDanuA = { pon: [], uto: [], sri: [], cet: [], pet: [] };
    // poslijepodne
    const poDanuB = { pon: [], uto: [], sri: [], cet: [], pet: [] };

    data.forEach((smjena) => {
      const jePrijePodnevna = smjena[0].prijeposlije === "PRIJE";
      smjena.forEach((profesor, j) => {
        if (j === 0) return;

        if (
          profesor[0]
            .toUpperCase()
            .replace(/ /g, "")
            .indexOf(input.replace(/ /g, "")) !== -1
        ) {
          for (let i = 1; i < profesor.length; i++) {
            const sat = profesor[i];
            if (typeof sat === "object" && sat.dan) {
              if (jePrijePodnevna) {
                poDanuA[sat.dan].push(sat);
              } else {
                poDanuB[sat.dan].push(sat);
              }
            }
          }
        }
      });
    });

    Object.keys(poDanuA).forEach((dan) => {
      const prije = poDanuA[dan];
      const poslije = poDanuB[dan];
      let text = "";

      if (prije.length > 0) {
        text += "<tr><th>PRIJEPODNE</th></tr><tr>";
        prije.forEach((celija) => {
          text += `
          <th>${celija.sat}.sat (${celija.trajanje})</th>
        </tr>
        <tr>
          <td>
            <p class='inline' style='${returnStyle(celija)}'>${celija.name}</p>
          </td>
        </tr>`;
        });
      }

      if (poslije.length > 0) {
        text += "<tr><th>POSLIJEPODNE</th></tr><tr>";
        poslije.forEach((celija) => {
          text += `
          <th>${celija.sat}.sat (${celija.trajanje})</th>
        </tr>
        <tr>
          <td>
            <p class='inline' style='${returnStyle(celija)}'>${celija.name}</p>
          </td>
        </tr>`;
        });
      }

      document.getElementById(dan).innerHTML = text;
    });

    finalTouch({ A: data[0][0], B: data[1][0] });
  }

  // Ucenik
  function getUcenik(data, dataL) {
    clearDOM();
    let dan = 0;
    let prosliSat = -999;

    let text = "";
    for (let y = 1; y < 40; y++) {
      // Filtriranje
      let seDijeliNaGrupe = false; //varijabla za provjeru dijeli li se razred na grupe

      for (var x = 1; x < dataL; x++) {
        // loopanje kroz redove
        const celija = data[x][y];
        if (celija && celija.name.indexOf(input) != -1) {
          if (!seDijeliNaGrupe) {
            const jeNoviDan = celija.sat < prosliSat;
            prosliSat = celija.sat;
            if (jeNoviDan) {
              document.getElementById(daniID[dan++]).innerHTML = text;
              text = "";
            }
            text += `<th>${celija.sat}.sat (${celija.trajanje})</th><tr><td>`;
            text += `<p class='inline' style='${returnStyle(celija)}'>${
              data[x][0]
            }</p>`;
            seDijeliNaGrupe = true;
          } else {
            //  ispisi sa / za odvajanje profesora
            text += `/<p class='inline' style='${returnStyle(celija)}'>${
              data[x][0]
            }</p>`;
          }
        }
      }
      text += "</td></tr>";
    }
    document.getElementById(daniID[dan++]).innerHTML = text;
    finalTouch(data[0]);
  }

  function dezurni(data) {
    try {
      var DOMvalue = "";
      if (data.hasOwnProperty("A") && data.hasOwnProperty("B")) {
        for (var i = 0; i < daniID.length; i++) {
          DOMvalue +=
            "<tr><th>" +
            daniID[i].charAt(0).toUpperCase() +
            daniID[i].slice(1) +
            "</tr></th>" +
            "<tr><td><b>Prijepodne: </b>" +
            data.A.dezurni[i + 1].name +
            (window.innerWidth < 500 ? "<br>" : "") +
            " <b>Poslijepodne: </b>" +
            data.B.dezurni[i + 1].name +
            "</tr></td>";
        }
      } else {
        for (var i = 0; i < daniID.length; i++) {
          DOMvalue +=
            "<tr><th>" +
            daniID[i].charAt(0).toUpperCase() +
            daniID[i].slice(1) +
            "</tr></th>" +
            "<tr><td>" +
            data.dezurni[i + 1].name +
            "</tr></td>";
        }
      }
    } catch (error) {}
    return DOMvalue;
  }

  // Nakon dohvacanja sitnice
  function finalTouch(data) {
    if (data.hasOwnProperty("A") && data.hasOwnProperty("B")) {
      if (data.A.napomena) {
        $("#napomena").html(data.A.napomena);
        $("div.alert.alert-warning").show();
      } else {
        $("div.alert.alert-warning").hide();
        $("#napomena").html("");
      }
    } else {
      if (data.napomena) {
        $("#napomena").html(data.napomena);
        $("div.alert.alert-warning").show();
      } else {
        $("div.alert.alert-warning").hide();
        $("#napomena").html("");
      }
    }
    document.getElementById("info").innerHTML =
      "Raspored za: <br>" +
      (data.hasOwnProperty("A") && data.hasOwnProperty("B")
        ? data.A.datum
        : data.datum) +
      ",<br>" +
      input;
    var d = new Date();
    var n = d.getDay();
    if (n > 5 || n == 0) {
      n = 1;
    }
    $("#dezurni").html("<tbody>" + dezurni(data) + "</tbody>");
    $("#accordion").accordion({
      active: n - 1, //Otvori tab koji je dan
    });
    whiteTextForReadability();
    //document.activeElement.blur(); // Fix za bug tipkovnice koja ostane otvorena na mobitelu
  }

  // Jos jedan ajax req za slucaj da data nije ucitan (tj. kad se auto-executa zbog cookija)
  function getRaspored() {
    var data, dataL;
    data = fetchRasp(smjena);
    dataL = data.length;
    trajanje = trajanjeFn(data[0]);

    // Biranje između učenika i profesora
    if (osoba == "Učenik") {
      getUcenik(data, dataL);
    } else if (osoba == "Profesor" && smjena != "A/B") {
      getProfesor(data, dataL);
    } else {
      getProfesorAB(data);
    }
  }
}); // document onrdy
