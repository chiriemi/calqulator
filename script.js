function addFieldsFreq() {
  var freq = document.getElementById("filterType").value;

  // Get the element where the inputs will be added to
  var containerFreq = document.getElementById("containerFreq");
  // Remove every children it had before
  while (containerFreq.hasChildNodes()) {
    containerFreq.removeChild(containerFreq.lastChild);
  }
  if (freq) {
    if (freq === "lpf" || freq === "hpf") {
      // Append a node with a random text
      containerFreq.appendChild(document.createTextNode("f0 : "));
      // Create an <input> element, set its type, id and name attributes
      var input = document.createElement("input");
      input.type = "text";
      input.name = "f0";
      input.id = "f0";
      containerFreq.appendChild(input);
      // Append a line break
      containerFreq.appendChild(document.createElement("br"));
    } else {
      // Append a node with a random text
      containerFreq.appendChild(document.createTextNode("fc : "));
      // Create an <input> element, set its type, id and name attributes
      var input = document.createElement("input");
      input.type = "text";
      input.name = "fc";
      input.id = "fc";
      containerFreq.appendChild(input);
      // Append a line break
      containerFreq.appendChild(document.createElement("br"));

      // Append a node with a random text
      containerFreq.appendChild(document.createTextNode("BW : "));
      // Create an <input> element, set its type, id and name attributes
      var input = document.createElement("input");
      input.type = "text";
      input.name = "BW";
      input.id = "BW";
      containerFreq.appendChild(input);
      // Append a line break
      containerFreq.appendChild(document.createElement("br"));
    }
  }
}

function addFieldOrd() {
  // Generate a dynamic number of inputs
  var number = document.getElementById("order").value;
  // Get the element where the inputs will be added to
  var containerOrd = document.getElementById("containerOrd");
  // Remove every children it had before
  while (containerOrd.hasChildNodes()) {
    containerOrd.removeChild(containerOrd.lastChild);
  }
  for (i = 1; i <= number; i++) {
    // Append a node with a random text
    containerOrd.appendChild(document.createTextNode("C" + i + "n : "));
    // Create an <input> element, set its type, id and name attributes
    var input = document.createElement("input");
    input.type = "text";
    input.name = "c" + i + "n";
    input.id = "c" + i + "n";
    containerOrd.appendChild(input);
    // Append a line break
    containerOrd.appendChild(document.createElement("br"));
    i = i + 1;
    if (i <= number) {
      containerOrd.appendChild(document.createTextNode("L" + i + "n : "));
      // Create an <input> element, set its type, id and name attributes
      var input = document.createElement("input");
      input.type = "text";
      input.name = "l" + i + "n";
      input.id = "l" + i + "n";
      containerOrd.appendChild(input);
      // Append a line break
      containerOrd.appendChild(document.createElement("br"));
    }
  }
}

function conversion() {
  var unit = document.getElementById("unit").value;
  var R = document.getElementById("R").value;

  if (unit === "kohm") R = R * 1000;
  else if (unit === "megohm") R = R * 1000000;

  return R;
}

function conversionPrim() {
  var unit = document.getElementById("unit").value;
  var R = document.getElementById("R").value;

  if (unit === "ohm") R = R / 1000;
  else if (unit === "megohm") R = R * 1000;

  return R;
}

function calcul() {
  var n = document.getElementById("order").value;
  var CnLn = [];
  var CL = [];
  var R = conversion();
  var freq = document.getElementById("filterType").value;

  for (i = 1; i <= n; i++) {
    CnLn[i] = document.getElementById("c" + i + "n").value;
    i++;
    if (i <= n) CnLn[i] = document.getElementById("l" + i + "n").value;
  }

  if (freq === "lpf" || freq === "hpf") {
    var f0 = document.getElementById("f0").value;
    var w0 = 2 * Math.PI * f0;

    // Filtru trece jos LPF

    if (freq === "lpf") {
      for (i = 1; i <= n; i++) {
        CL[i] = CnLn[i] / (w0 * R);
        i++;
        if (i <= n) {
          CL[i] = (CnLn[i] * R) / w0;
        }
      }
      console.log("Filtru LPF");

      for (i = 1; i <= n; i++) {
        CL[i] = unitate(CL[i]);
        showdata.appendChild(document.createTextNode(" C" + i + " = " + CL[i]));
        showdata.appendChild(document.createElement("br"));
        console.log("C" + i + " = " + CL[i]);
        i++;
        if (i <= n) {
          CL[i] = unitate(CL[i]);
          showdata.appendChild(
            document.createTextNode(" L" + i + " = " + CL[i])
          );
          showdata.appendChild(document.createElement("br"));
        }
        if (i < n) showdata.appendChild(document.createElement("br"));
        console.log("L" + i + " = " + CL[i]);
      }
    }

    // Filtru trece sus HPF
    else {
      for (i = 1; i <= n; i++) {
        CL[i] = R / (w0 * CnLn[i]);
        i++;
        if (i <= n) CL[i] = 1 / (w0 * R * CnLn[i]);
      }
      console.log("Filtru HPF");

      for (i = 1; i <= n; i++) {
        CL[i] = unitate(CL[i]);
        showdata.appendChild(document.createTextNode(" L" + i + " = " + CL[i]));
        showdata.appendChild(document.createElement("br"));
        console.log("L" + i + " = " + CL[i]);
        i++;
        if (i <= n) {
          CL[i] = unitate(CL[i]);
          showdata.appendChild(
            document.createTextNode(" C" + i + " = " + CL[i])
          );
          showdata.appendChild(document.createElement("br"));
        }
        if (i < n) showdata.appendChild(document.createElement("br"));
        console.log("C" + i + " = " + CL[i]);
      }
    }
  } else {
    var fc = document.getElementById("fc").value;
    var BW = document.getElementById("BW").value;
    var MIRR = [];
    var wc = 2 * Math.PI * fc;
    var Qbp = wc / (2 * Math.PI * BW);
    // Filtru trece banda BPF

    if (freq === "bpf") {
      for (i = 1; i <= n; i++) {
        CL[i] = (Qbp * CnLn[i]) / (wc * R);
        MIRR[i] = R / (Qbp * wc * CnLn[i]);
        if (i + 1 <= n) {
          i++;
          CL[i] = 1 / (wc * Qbp * R * CnLn[i]);
          MIRR[i] = (R * Qbp * CnLn[i]) / wc;
        }
      }

      console.log("Filtru BPF");

      for (i = 1; i <= n; i++) {
        CL[i] = unitate(CL[i]);
        MIRR[i] = unitate(MIRR[i]);
        showdata.appendChild(document.createTextNode(" C" + i + " = " + CL[i]));
        showdata.appendChild(document.createElement("br"));
        showdata.appendChild(
          document.createTextNode(" L" + i + " = " + MIRR[i])
        );
        showdata.appendChild(document.createElement("br"));
        if (i < n) showdata.appendChild(document.createElement("br"));
      }
    }

    // Filtru banda stop BRF
    else {
      for (i = 1; i <= n; i++) {
        CL[i] = CnLn[i] / (wc * R * Qbp);
        MIRR[i] = (R * Qbp) / (wc * CnLn[i]);
        if (i + 1 <= n) {
          i++;
          CL[i] = Qbp / (wc * R * CnLn[i]);
          MIRR[i] = (R * CnLn[i]) / (wc * Qbp);
        }
      }
      console.log("Filtru BRF");

      for (i = 1; i <= n; i++) {
        CL[i] = unitate(CL[i]);
        MIRR[i] = unitate(MIRR[i]);
        showdata.appendChild(document.createTextNode(" C" + i + " = " + CL[i]));
        showdata.appendChild(document.createElement("br"));
        showdata.appendChild(
          document.createTextNode(" L" + i + " = " + MIRR[i])
        );
        showdata.appendChild(document.createElement("br"));
        if (i < n) showdata.appendChild(document.createElement("br"));
      }
    }
  }
}

function unitate(valoare) {
  var count = 0;
  if (valoare < 1) {
    while (valoare < 1) {
      valoare = valoare * 1000;
      count = count + 1;
    }
    valoare = valoare.toFixed(4);
    if (count == 1) return valoare + "m";
    else if (count == 2) return valoare + "u";
    else if (count == 3) return valoare + "n";
    else return valoare + "p";
  } else {
    valoare = valoare.toFixed(4);
    return valoare;
  }
}

function calculus() {
  var showdata = document.getElementById("showdata");
  var downloadBtn = document.getElementById("dwn-btn");
  var resetBtn = document.getElementById("rst-btn");

  downloadBtn.style.display = "initial";
  resetBtn.style.display = "initial";

  while (showdata.hasChildNodes()) {
    showdata.removeChild(showdata.lastChild);
  }
  calcul();

  CSS;
}

function Help() {
  var freq = document.getElementById("filterType").value;
  var helpButton = document.getElementById("helpButtonDiv");
  var imghelp = document.getElementById("imgHelp");
  var helpButtonFirst = document.getElementById("helpBtn");
  var helpImg = document.getElementById("helpImg");
  while (helpButton.hasChildNodes()) {
    helpButton.removeChild(helpButton.lastChild);
    helpButtonFirst.removeChild(helpButtonFirst.lastChild);
  }

  // Create a help button
  if (freq) {
    var filterButton = document.createElement("button");
    var helpBtn = document.createElement("button");
    helpBtn.textContent = "Help";
    helpBtn.id = "helpBtnCSS";
    filterButton.textContent = "Vezi filtru";
    filterButton.id = "btnHelp";
    if (freq === "lpf") {
      helpImg.className = "helpLPF";
      helpBtn.addEventListener("click", function () {
        document.getElementById("helpImg").classList.toggle("open-helpLPF");
      });

      filterButton.className = "lpfHelp helpButtonCSS";
      imgHelp.className = "LPF";
      filterButton.addEventListener("click", function () {
        document.getElementById("imgHelp").classList.toggle("open-LPF");
      });
    } else if (freq == "hpf") {
      helpImg.className = "helpHPF";
      helpBtn.addEventListener("click", function () {
        document.getElementById("helpImg").classList.toggle("open-helpHPF");
      });

      filterButton.className = "hpfHelp helpButtonCSS";
      imgHelp.className = "HPF";
      filterButton.addEventListener("click", function () {
        document.getElementById("imgHelp").classList.toggle("open-HPF");
      });
    } else if (freq == "bpf") {
      helpImg.className = "helpBPF";
      helpBtn.addEventListener("click", function () {
        document.getElementById("helpImg").classList.toggle("open-helpBPF");
      });

      filterButton.className = "bpfHelp helpButtonCSS";
      imgHelp.className = "BPF";
      filterButton.addEventListener("click", function () {
        document.getElementById("imgHelp").classList.toggle("open-BPF");
      });
    } else {
      helpImg.className = "helpBRF";
      helpBtn.addEventListener("click", function () {
        document.getElementById("helpImg").classList.toggle("open-helpBRF");
      });

      filterButton.className = "brfHelp helpButtonCSS";
      imgHelp.className = "BRF";
      filterButton.addEventListener("click", function () {
        document.getElementById("imgHelp").classList.toggle("open-BRF");
      });
    }

    helpButton.appendChild(filterButton);
    helpButtonFirst.appendChild(helpBtn);
  }
}

function ChangeHelpImage() {
  var order = document.getElementById("order").value;
  var freq = document.getElementById("filterType").value;
  var imghelp = document.getElementById("imgHelp");
  var imgSize = document.createElement("img");
  var helpImg = document.getElementById("helpImg");
  var helpImgSize = document.createElement("img");

  while (imghelp.hasChildNodes()) {
    imghelp.removeChild(imghelp.lastChild);
    helpImg.removeChild(helpImg.lastChild);
  }
  if (freq) {
    if (freq === "lpf") {
      helpImgSize.setAttribute("src", "img/LPF2pana9/psvLPF.png");
      helpImgSize.style.visibility = "hidden";
      helpImgSize.style.display = "block";
      helpImgSize.style.width = "100%";
      helpImg.style.backgroundImage = "url(img/LPF2pana9/psvLPF.png)";

      imgSize.setAttribute("src", "img/LPF2pana9/lpf" + order + ".png");
      imgSize.style.visibility = "hidden";
      imgSize.style.display = "block";
      imgSize.style.width = "100%";
      imghelp.style.backgroundImage = "url(img/LPF2pana9/lpf" + order + ".png)";
    } else if (freq == "hpf") {
      helpImgSize.setAttribute("src", "img/HPF2pana9/psvHPF.png");
      helpImgSize.style.visibility = "hidden";
      helpImgSize.style.display = "block";
      helpImgSize.style.width = "100%";
      helpImg.style.backgroundImage = "url(img/HPF2pana9/psvHPF.png)";

      imgSize.setAttribute("src", "img/HPF2pana9/hpf" + order + ".png");
      imgSize.style.visibility = "hidden";
      imgSize.style.display = "block";
      imgSize.style.width = "100%";
      imghelp.style.backgroundImage = "url(img/HPF2pana9/hpf" + order + ".png)";
    } else if (freq == "bpf") {
      helpImgSize.setAttribute("src", "img/BPF2pana9/psvBPF.png");
      helpImgSize.style.visibility = "hidden";
      helpImgSize.style.display = "block";
      helpImgSize.style.width = "100%";
      helpImg.style.backgroundImage = "url(img/BPF2pana9/psvBPF.png)";

      imgSize.setAttribute("src", "img/BPF2pana9/bpf" + order + ".png");
      imgSize.style.visibility = "hidden";
      imgSize.style.display = "block";
      imgSize.style.width = "100%";
      imghelp.style.backgroundImage = "url(img/BPF2pana9/bpf" + order + ".png)";
    } else {
      helpImgSize.setAttribute("src", "img/BRF2pana9/psvBRF.png");
      helpImgSize.style.visibility = "hidden";
      helpImgSize.style.display = "block";
      helpImgSize.style.width = "100%";
      helpImg.style.backgroundImage = "url(img/BRF2pana9/psvBRF.png)";

      imgSize.setAttribute("src", "img/BRF2pana9/brf" + order + ".png");
      imgSize.style.visibility = "hidden";
      imgSize.style.display = "block";
      imgSize.style.width = "100%";
      imghelp.style.backgroundImage = "url(img/BRF2pana9/brf" + order + ".png)";
    }
    imghelp.appendChild(imgSize);
    helpImg.appendChild(helpImgSize);
  }
}

function download(filename, text) {
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function Download() {
  var order = document.getElementById("order").value;
  var freq = document.getElementById("filterType").value;
  var R = conversionPrim();
  var text =
    ".param R=" + R + "k" + document.getElementById("showdata").textContent;
  var filename = freq + order + ".txt";
  console.log(text);
  download(filename, text);
}

function Reset() {
  location.reload();
}

function ShowFilterButton() {
  var filerButton = document.getElementById("btnHelp");

  filerButton.style.display = "initial";
}
