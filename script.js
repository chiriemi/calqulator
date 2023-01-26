function addFieldsFreq() {
  var freq = document.getElementById("filterType").value;

  // Get the element where the inputs will be added to
  var containerFreq = document.getElementById("containerFreq");
  // Remove every children it had before
  while (containerFreq.hasChildNodes()) {
    containerFreq.removeChild(containerFreq.lastChild);
  }

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

  if (unit === "ohm") R = R / 1000;
  else if (unit === "megohm") R = R * 1000;

  return R;
}

function calcul() {
  var n = document.getElementById("order").value;
  var CnLn = [];
  var CL = [];
  var R = conversion();
  // var R = document.getElementById("R").value;
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
        showdata.appendChild(document.createTextNode("C" + i + " = " + CL[i]));
        showdata.appendChild(document.createElement("br"));
        console.log("C" + i + " = " + CL[i]);
        i++;
        if (i <= n)
          showdata.appendChild(
            document.createTextNode("L" + i + " = " + CL[i])
          );
        showdata.appendChild(document.createElement("br"));
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
        showdata.appendChild(document.createTextNode("L" + i + " = " + CL[i]));
        showdata.appendChild(document.createElement("br"));
        console.log("L" + i + " = " + CL[i]);
        i++;
        if (i <= n)
          showdata.appendChild(
            document.createTextNode("C" + i + " = " + CL[i])
          );
        showdata.appendChild(document.createElement("br"));
        console.log("C" + i + " = " + CL[i]);
      }
    }
  } else {
    var fc = document.getElementById("fc").value;
    var BW = document.getElementById("BW").value;
    var MIRR = [];
    var wc = 2 * Math.PI * fc;

    // Filtru trece banda BPF

    if (freq === "bpf") {
      var Qbp = wc / (2 * Math.PI * BW);
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
        if (CL[i] < 1) CL[i] = CL[i] * 1000;
        if (MIRR[i] < 1) MIRR[i] = MIRR[i] * 1000;
        showdata.appendChild(document.createTextNode("C" + i + " = " + CL[i]));
        showdata.appendChild(document.createElement("br"));
        showdata.appendChild(
          document.createTextNode("L" + i + " = " + MIRR[i])
        );
        showdata.appendChild(document.createElement("br"));
        if (i < n) showdata.appendChild(document.createElement("br"));
      }
    }

    // Filtru banda stop BRF
    else {
      var Qbr = wc / (2 * Math.PI * BW);
      for (i = 1; i <= n; i++) {
        CL[i] = CnLn[i] / (wc * R * Qbr);
        MIRR[i] = (R * Qbr) / (wc * CnLn[i]);
        if (i + 1 <= n) {
          i++;
          CL[i] = Qbr / (wc * R * CnLn[i]);
          MIRR[i] = (R * CnLn[i]) / (wc * Qbr);
        }
      }
      console.log("Filtru BRF");

      for (i = 1; i <= n; i++) {
        showdata.appendChild(document.createTextNode("C" + i + " = " + CL[i]));
        showdata.appendChild(document.createElement("br"));
        showdata.appendChild(
          document.createTextNode("L" + i + " = " + MIRR[i])
        );
        showdata.appendChild(document.createElement("br"));
      }
    }
  }
}

function calculus() {
  var showdata = document.getElementById("showdata");

  while (showdata.hasChildNodes()) {
    showdata.removeChild(showdata.lastChild);
  }
  calcul();

  CSS;
}
