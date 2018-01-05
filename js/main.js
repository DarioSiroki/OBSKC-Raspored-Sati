/*
TODO lista
boje s rasporeda
android toolbar + mozda jos neki korisni plugin za phonegap
auto update (mozda =)
push notificationi za novu verziju rasporeda i apdejta appa bi bili bozanski isto ko i offline verzija ili kešanje ty darac
cordova onrdy 
app za iphone i winse ako ti se da =DDDD
wiki github / prezentacija ?
dezurni profesori
onaj kul templejt s MACovima za telku u hodniku

za filtriranje:

for (var x = 0; x < data.length; x++) {
  for (var i = 0; i < data[x].length; i++) {
    if (data[x][i]===0) {
    data[x][i]="";
    }
  }
}

*/

$(document).ready(function() {
  // Globalne varijable
  var input, inputNormalCase, smjena, osoba;
  var ACsrc = [];

  // Accordion postavke
  $("#accordion").accordion({
    collapsible: true,
    active: false,
    heightStyle: "content"
  });

  // Skripta za citanje kolacica
  function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  // Pohranjivanje kolacica
  function cookies() {
    document.cookie =
      "input=" + input + ";expires=Wed, 1 Jan 2070 12:00:00 UTC";
    document.cookie =
      "smjena=" + smjena + ";expires=Wed, 1 Jan 2070 12:00:00 UTC";
    document.cookie =
      "osoba=" + osoba + ";expires=Wed, 1 Jan 2070 12:00:00 UTC";
  }

  // Ciscenje kolacica
  function clearCookies() {
    document.cookie = "input=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    document.cookie = "smjena=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    document.cookie = "osoba=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
  }

  // Automatsko izvrsavanje skripte ako postoje kolacici
  input = readCookie("input");
  smjena = readCookie("smjena");
  osoba = readCookie("osoba");
  if (input && smjena && osoba !== "") {
    getRaspored();
  }

  //Ajax requestovi
  function fetchA() {
    var result;
    $.ajax({
      url: "js/A.json",
      dataType: "json",
      async: false,
      success: function(callback) {
        result = callback;
      }
    });
    return result;
  }

  function fetchB() {
    var result;
    $.ajax({
      url: "js/B.json",
      dataType: "json",
      async: false,
      success: function(callback) {
        result = callback;
      }
    });
    return result;
  }

  // Filtriranje podataka za trazilicu
  function trazilica() {
    // Provjera unesenih parametara za trazilicu i pozivanje ajaxa u skladu s njima
    if (osoba == "Učenik") {
      if (smjena == "js/A.json") {
        var data = fetchA();
        var dataL = data.length;
        filterRazredi();
      } else if (smjena == "js/B.json") {
        var data = fetchB();
        var dataL = data.length;
        filterRazredi();
      } else {
        //console.error("Smjena nije odabrana");
      }
    } else if (osoba == "Profesor") {
      if (smjena == "js/A.json") {
        var data = fetchA();
        var dataL = data.length;
        filterProfesor();
      } else if (smjena == "js/B.json") {
        var data = fetchB();
        var dataL = data.length;
        filterProfesor();
      } else if (smjena == "Obje smjene (profesori)") {
        // TODO
      } else {
        //console.error("Smjena nije odabrana");
      }
    } else {
      //console.error("Osoba nije odabrana");
    }

    // Filteri za autocomplete
    function filterRazredi() {
      ACsrc.length = 0; // Pražnjenje autocompletea ako postoji
      // Arr = raspored bez imena profesora
      var arr = [];
      for (var x = 3; x < dataL; x++) {
        for (var y = 1; y < 36; y++) {
          arr.push(data[x][y]);
        }
      }
      // Brisanje duplikata
      $.each(arr, function(i, el) {
        if ($.inArray(el, ACsrc) === -1) ACsrc.push(el);
      });
    }

    function filterProfesor() {
      ACsrc.length = 0; // Pražnjenje autocompletea ako postoji
      // Vađenje imena profesora iz rasporeda
      for (var i = 3; i < dataL; i++) {
        ACsrc.push(data[i][0]);
      }
    }
  }

  // Autocomplete
  $("#tags").autocomplete({
    delay: 0,
    source: ACsrc,
    minlength: 0
  });
  
  // Dohvacanje rasporeda i spremanje u accordion
  function getRaspored() {
    var data, dataL, daniID;
    // Ajax za raspored
    if (smjena == "js/A.json") {
      data = fetchA();
      dataL = data.length;
    } else if (smjena == "js/B.json") {
      data = fetchB();
      dataL = data.length;
    } else {
      //console.error("Smjena nije odabrana");
    }
    // Biranje između učenika i profesora
    if (osoba == "Učenik") {
      trajanje();
      getUcenik();
    } else if (osoba == "Profesor") {
      trajanje();
      getProfesor();
    } else {
      // console.error("Osoba nije odabrana");
    }
    // Biranje trajanja bazirano na odabranoj smjeni
    function trajanje() {
      daniID = ["pon", "uto", "sri", "cet", "pet"];
      var trajanjeU = [
        "7.45-8.30",
        "8.35-9.20",
        "9.25-10.10",
        "10.25-11.10",
        "11.15-12.00",
        "12.05-12.50",
        "12.55-13.40"
      ];
      var trajanjeP = [
        "13.45-14.30",
        "14.35-15.20",
        "15.25-16.10",
        "16.25-17.10",
        "17.15-18.00",
        "18.05-18.50",
        "18.55-19.40"
      ];
      if (data[0][0].search("PRIJE") !== -1) {
        trajanje = trajanjeU;
      } else {
        trajanje = trajanjeP;
      }
    }

    // Filtriranje i punjenje u accordion aka tour-de-france, gl
    // Profesor
    function getProfesor() {
      var counter = -1;
      // loop kroz profesore
      for (i = 2; i < dataL; i++) {
        // searcha string umjesto == zbog whitespacea
        if (data[i][0].toUpperCase().search(input) !== -1) {
          // ako je prof pronadjen filtriraj
          for (var param = 1; param < 36; param += 7) {
            var text = "";
            for (z = param; z < param + 7; z++) {
              text +=
                "<th>" +
                (z - param + 1) +
                ".sat" +
                " (" +
                trajanje[z - param] +
                ")" +
                "</th>" +
                "<tr>" +
                "<td>" +
                data[i][z] +
                "</td>" +
                "</tr>";
            }
            counter++;
            document.getElementById(daniID[counter]).innerHTML = text;
          }
        }
      }
      afterFix();
    }

    // Ucenik
    function getUcenik() {
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
          for (x = 2; x < dataL; x++) {
            // loopanje kroz redove
            if (data[x][y] == input) {
              // ako je pronadjen raz
              if (provjera == 0) {
                //uvjet za provjeru
                text += "<td>" + data[x][0]; //ispisi profesora
                provjera++;
              } else {
                // inace ga ispisi sa / za odvajanje profesora
                text += "/" + data[x][0];
              }
            }
          }
          text += "</td></tr>";
        }
        counter++;
        document.getElementById(daniID[counter]).innerHTML = text;
      }
      afterFix();
    }

    // Nakon dohvacanja fixevi
    function afterFix() {
      document.getElementById("info").innerHTML =
        "Raspored za: <br>" + data[1][0] + ",<br>" + input; // Prikazuje datum rasporeda i odabrani raz/prof
      var d = new Date();
      var n = d.getDay();
      if (n > 5 || n == 0) {
        n = 1;
      }
      $("#accordion").accordion({
        active: n - 1 //Otvori tab koji je dan
      });
      //document.activeElement.blur(); // Fix za bug tipkovnice koja ostane otvorena na mobitelu
    }
  }

  // Modal input
  $(".osoba").click(function() {
    $(".smjena").prop("disabled", false);
    osoba = $(".osoba:checked").val() || [];
    trazilica();
  });
  $(".smjena").click(function() {
    $("#tags").prop("disabled", false);
    smjena = $(".smjena:checked").val() || [];
    trazilica();
  });
  $("#tags").click(function() {
    $(".en").prop("disabled", false);
  });
  $(".en").click(function() {
    input = $("#tags")
      .val()
      .toUpperCase();
    clearCookies();
    getRaspored();
  });
  $("#remember").click(function() {
    input = $("#tags")
      .val()
      .toUpperCase();
    cookies();
    getRaspored();
  });
});
