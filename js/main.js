$(document).ready(function() {
  const baseURL = "https://raw.githubusercontent.com/DarioSiroki/OBSKC-Raspored-Sati/master/converter/data/json/";
  var input, smjena, osoba, verzija;
  var ACsrc = [];
  getVersion();
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];
  const daniID = ["pon", "uto", "sri", "cet", "pet"],
    trajanjeU = [
      "7.45-8.30",
      "8.35-9.20",
      "9.25-10.10",
      "10.25-11.10",
      "11.15-12.00",
      "12.05-12.50",
      "12.55-13.40"
    ],
    trajanjeP = [
      "13.45-14.30",
      "14.35-15.20",
      "15.25-16.10",
      "16.25-17.10",
      "17.15-18.00",
      "18.05-18.50",
      "18.55-19.40"
    ];

  // Accordion postavke
  $("#accordion").accordion({
    collapsible: true,
    active: false,
    heightStyle: "content"
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


  function filterVersionsFromJsonAndFillDom(verzije){
    var datumi = [];
    var aktivniRaspored = "";
    for (var i = verzije.length - 1; i >= 0; i--) {
      datumi.push(verzije[i].substring(0, verzije[i].length - 6));
    }
    datumi = datumi.filter(function(item, pos) {
        return datumi.indexOf(item) == pos;
    });
    datumi = datumi.sort(function(a, b) {
        a = new Date(a);
        b = new Date(b);
        return a>b ? -1 : a<b ? 1 : 0;
    });
    for (var i = 0; i < datumi.length; i++) {
      var d = new Date(datumi[i]);
      var today = new Date();
      var calc = new Date(datumi[i] + " "  + (1900+today.getYear())).getTime() - (today.getTime() + 259200000);
      if (calc > 0 && calc < 604800000) {
        verzija = datumi[i];
      }
      $("#datum").append('<option> ' + datumi[i].match(/\d/g).join("") + "." + (d.getMonth()+1) + '. </option>');
    }
  }

  // dohvacanje verzija rasporeda
  function getVersion(){
    if(window.localStorage.getItem('verzije')){
      filterVersionsFromJsonAndFillDom(JSON.parse(window.localStorage.getItem("verzije")));
    } else {
      $.ajax({
        url: baseURL+"versions.json",
        dataType: "json",
        async: false,
        success: function(callback) {
          window.localStorage.setItem("verzije", JSON.stringify(callback));
          filterVersionsFromJsonAndFillDom(callback);
        }
      });
    }
  }

  function fetchRasp(smjena) {
    var result;
    // za obje smjene
    if (smjena === "A/B") {
      var result = [];
      if(window.localStorage.getItem(verzija+"A") && window.localStorage.getItem(verzija+"B")) {
        result[0] = JSON.parse(window.localStorage.getItem(verzija+"A"));
        result[1] = JSON.parse(window.localStorage.getItem(verzija+"B"));
        return result;
      }
      $.ajax({
        url: baseURL+verzija+"A.json",
        dataType: "json",
        async: false,
        success: function(callback) {
          result[0] = callback;
          window.localStorage.setItem(verzija+"A", JSON.stringify(callback));
        }
      });
      $.ajax({
        url: baseURL+verzija+"B.json",
        dataType: "json",
        async: false,
        success: function(callback) {
          result[1] = callback;
          window.localStorage.setItem(verzija+"B", JSON.stringify(callback));
        }
      });
    } else {
      if(window.localStorage.getItem(verzija+smjena)) {
        result = JSON.parse(window.localStorage.getItem(verzija+smjena));
        return result;
      }
      // za jednu smjenu
      $.ajax({
        url: baseURL+verzija+smjena+".json",
        dataType: "json",
        async: false,
        success: function(callback) {
          result = callback;
          window.localStorage.setItem(verzija+smjena, JSON.stringify(callback));
        }
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
  $("select").change(function() {
    var selected = $("select option:selected").text().split(".") || [];
    verzija = months[parseInt(selected[1])-1]+selected[0].replace(/ /g,"");
    try {
      trazilicaData();
    } catch (error) {}
  });
  $(".osoba").click(function() {
    $(".smjena").prop("disabled", false);
    osoba = $(".osoba:checked").val() || [];
    try {
      trazilicaData();
    } catch (error) {}
  });
  $(".smjena").click(function() {
    $("#tags").prop("disabled", false);
    smjena = $(".smjena:checked").val() || [];
    trazilicaData();
  });
  $("#tags").click(function() {
    $(".en").prop("disabled", false);
  });
  $("#remember").click(function() {
    input = $("#tags")
      .val()
      .toUpperCase();
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
    $.each(arr, function(i, el) {
      if ($.inArray(el, ACsrc) === -1) ACsrc.push(el);
    });
    ACsrc = ACsrc.filter(word => word.length < 4);
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
    $.each(arr1, function(i, el) {
      arr2.push(arr1[i].replace(/ /g, "").replace(/-/g, ""));
    });
    var arr3 = [];
    $.each(arr2, function(i, el) {
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
      source: function(req, responseFn) {
        var re = $.ui.autocomplete.escapeRegex(req.term);
        var matcher = new RegExp("^" + re, "i");
        var a = $.grep(ACsrc, function(item, index) {
          return matcher.test(item);
        });
        responseFn(a);
      },
      minlength: 0
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

  // Filtriranje i punjenje u accordion aka tour-de-france, gl
  // Profesor
  function getProfesor(data, dataL) {
    clearDOM();
    var counter = -1;
    // loop kroz profesore
    for (i = 1; i < dataL; i++) {
      if (
        data[i][0]
          .toUpperCase()
          .replace(/ /g, "")
          .indexOf(input.replace(/ /g, "")) !== -1
      ) {
        // ako je prof pronadjen filtriraj
        for (var param = 1; param < 36; param += 7) {
          var text = "";
          for (ii = param; ii < param + 7; ii++) {
            text +=
              "<tr><th>" +
              (ii - param + 1) +
              ".sat (" +
              trajanje[ii - param] +
              ")</th></tr><tr><td>" +
              (typeof data[i][ii] === "object"
                ? "<p class='inline' style='" +
                  returnStyle(data[i][ii]) +
                  "'>" +
                  data[i][ii].name +
                  "</p>"
                : "") +
              "</td></tr>";
          }
          counter++;
          document.getElementById(daniID[counter]).innerHTML = text;
        }
      }
    }
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
    var counter = -1;
    for (var param = 1; param < 36; param += 7) {
      var text = "";
      var counter2 = -1;
      for (var i = 0; i < data.length; i++) {
        for (ii = 1; ii < data[i].length; ii++) {
          if (
            data[i][ii][0]
              .toUpperCase()
              .replace(/ /g, "")
              .indexOf(input.replace(/ /g, "")) !== -1
          ) {
            counter2++;
            text +=
              counter2 === 0
                ? "<tr><th>PRIJEPODNE</th></tr>"
                : "<tr><th>POSLIJEPODNE</th></tr>";
            for (iii = param; iii < param + 7; iii++) {
              if (typeof data[i][ii][iii] === "object") {
                text +=
                  "<tr><th>" +
                  (iii - param + 1) +
                  ".sat (" +
                  (counter2 === 0
                    ? trajanjeU[iii - param]
                    : trajanjeP[iii - param]) +
                  ")</th></tr><tr><td>" +
                  (typeof data[i][ii][iii] === "object"
                    ? "<p class='inline' style='" +
                      returnStyle(data[i][ii][iii]) +
                      "'>" +
                      data[i][ii][iii].name +
                      "</p>"
                    : "") +
                  "</td></tr>";
              } else {
                text += "";
              }
            }
          }
        }
      }
      counter++;
      document.getElementById(daniID[counter]).innerHTML = text;
    }
    finalTouch({ A: data[0][0], B: data[1][0] });
  }

  // Ucenik
  function getUcenik(data, dataL) {
    clearDOM();
    // Counter za danID
    var counter = -1;
    // Param je varijabla koja se prilagodjava danu
    for (var param = 1; param < 36; param += 7) {
      // Filtriranje
      var text = "";
      for (y = param; y < param + 7; y++) {
        var provjera = 0; //varijabla za provjeru dijeli li se razred na grupe
        text +=
          "<th>" +
          (y - param + 1) +
          ".sat" +
          " (" +
          trajanje[y - param] +
          ")" +
          "</th>" +
          "<tr>";
        for (x = 1; x < dataL; x++) {
          // loopanje kroz redove
          if (String(data[x][y].name).indexOf(input) != -1) {
            // ako je pronadjen raz
            if (provjera == 0) {
              //uvjet za provjeru
              text +=
                "<td>" +
                (typeof data[x][y] === "object"
                  ? "<p class='inline' style='" +
                    returnStyle(data[x][y]) +
                    "'>" +
                    data[x][0] +
                    "</p>"
                  : "");
              provjera++;
            } else {
              //  ispisi sa / za odvajanje profesora
              text +=
                "/" +
                (typeof data[x][y] === "object"
                  ? "<p class='inline' style='" +
                    returnStyle(data[x][y]) +
                    "'>" +
                    data[x][0] +
                    "</p>"
                  : "");
            }
          }
        }
        text += "</td></tr>";
      }
      counter++;
      document.getElementById(daniID[counter]).innerHTML = text;
    }
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
      active: n - 1 //Otvori tab koji je dan
    });
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
