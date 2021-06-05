/*
 * rlc: Objects to parse resistance, capacitance, and inductance values
 * ----------------------------------------------------------------------------
 *
 * This script creates three objects (resistors, capacitors, and inductors) for
 * parsing text into numbers. RKM codes and common multipliers like "k" (1000x)
 * are interpreted and reflected in the returned value. Each of the objects has
 * the same properties and methods.
 *
 * Note that if the parsed text contains only a number, for capacitors the unit
 * is assumed to be pF. For inductors, the unit is assumed to be mH.
 *
 *
 * -- Properties --
 *
 * value:     numeric value of the part in ohms, farads, or henries
 *
 * formatted: a unit-less, cleaned-up version of the text, including multiplier
 *
 *
 * -- Methods --
 *
 * parse:        Given text, returns the value.
 *
 * parseElement: Given a text input element, parses its text, updates its text
 *               with a formatted version, and returns the value.
 *
 */

var resistors  = [];
var capacitors = [];
var inductors  = [];



resistors.parse = function(str) {

    // Remove all spaces, and any leading sign or trailing decimal point
    str = str.replace(/ +?/g, "")
             .replace(/^[\+\-]/, "")
             .replace(/\.$/, "");

    // Remove any units and convert "meg" (used in SPICE) to M
    str = str.replace(/ohm[s]?$/i, "")
             .replace(/\u2126/, "")
             .replace(/meg$/i, "M");

    // Check for known formats. It is assumed that "m" means mega, not milli.
    var match = str.match(/^(\d+)?(\.(\d+))?([kmgt])$/i);
    if (match && (match[1] || match[3])) {
        // Integer or decimal point float, followed by a multiplier.
        // No commas allowed. 0.18, 18, 18R, 1.8k, 18K
        resistors.formatted = str;
        resistors.value = parseFloat(str);

        // Use the multiplier
        if (match[4] == "k" || match[4] == "K") {
            resistors.value *= 1000;
        } else if (match[4] == "m" || match[4] == "M") {
            resistors.value *= 1000000;
        } else if (match[4] == "g" || match[4] == "G") {
            resistors.value *= 1000000000;
        } else if (match[4] == "t" || match[4] == "T") {
            resistors.value *= 1000000000000;
        }
    } else if (match = str.match(/^(\d+)?([rkmgt])(\d+)$/i)) {
        // RKM codes not matched earlier, like R5, 10R2, 1K87, 25M5
        resistors.formatted = str;
        resistors.value = parseFloat((match[1] || "0") + "." + match[3]);

        // Use the multiplier
        if (match[2] == "k" || match[2] == "K") {
            resistors.value *= 1000;
        } else if (match[2] == "m" || match[2] == "M") {
            resistors.value *= 1000000;
        } else if (match[2] == "g" || match[2] == "G") {
            resistors.value *= 1000000000;
        } else if (match[2] == "t" || match[2] == "T") {
            resistors.value *= 1000000000000;
        }
    } else {
        // Default behavior
        resistors.value = parseFloat(str);
        if (resistors.value && resistors.value > 0) {
            resistors.formatted = resistors.value.toString();
        } else {
            resistors.value = 0;
            resistors.formatted = "0";
        }
    }

    return resistors.value;
}

resistors.parseElement = function(el) {
    // Convert the element text to a number
    resistors.parse(el.value);

    // Update the element with the formatted value
    if (resistors.formatted) {
        el.value = resistors.formatted;
    }
    return resistors.value;
}



capacitors.parse = function(str) {

    // Remove all spaces, and any leading sign or trailing decimal point
    str = str.replace(/ +?/g, "")
             .replace(/^[\+\-]/, "")
             .replace(/\.$/, "");

    // Simplify any units to "F"
    str = str.replace(/f(arad)?s?$/i, "F");

    // Check for known formats
    var match = str.match(/^(\d+)?(\.(\d+))?([pPnNuUmM\u03bc])F?$/);
    if (match && (match[1] || match[3])) {
        // Integer or decimal point float, followed by a multiplier.
        // No commas allowed. 1.8u, 18n
        capacitors.formatted = str.replace(/F$/, "");
        capacitors.value = parseFloat(str);

        // Use the multiplier
        if (match[4] == "m" || match[4] == "M") {
            capacitors.value *= 1e-3;
        } else if (match[4] == "u" || match[4] == "U" || match[4] == "\u03bc") {
            capacitors.value *= 1e-6;
        } else if (match[4] == "n" || match[4] == "N") {
            capacitors.value *= 1e-9;
        } else if (match[4] == "p" || match[4] == "P") {
            capacitors.value *= 1e-12;
        }
    } else if (match = str.match(/^(\d+)?([fFpPnNuUmM\u03bc])(\d+)$/i)) {
        // RKM codes not matched earlier, like F5, 2u2
        capacitors.formatted = str;
        capacitors.value = parseFloat((match[1] || "0") + "." + match[3]);

        // Use the multiplier
        if (match[2] == "m" || match[2] == "M") {
            capacitors.value *= 1e-3;
        } else if (match[2] == "u" || match[2] == "U") {
            capacitors.value *= 1e-6;
        } else if (match[2] == "n" || match[2] == "N") {
            capacitors.value *= 1e-9;
            capacitors.value *= 0.000000001;
        } else if (match[2] == "p" || match[2] == "P") {
            capacitors.value *= 1e-12;
        }
    } else if (match = str.match(/^(\d+)?(\.(\d+))?F$/)) {
        // No multiplier, but ends with "F". 1.8F, 18F
        capacitors.formatted = str.replace(/F$/, "");
        capacitors.value = parseFloat(str);
    } else if (match = str.match(/^(\d+)?(\.(\d+))?$/)) {
        // Integer or float without multiplier or units. Assume pF.
        capacitors.formatted = str + "p";
        capacitors.value = parseFloat(str) * 1e-12;
    } else {
        capacitors.formatted = "0";
        capacitors.value = 0;
    }

    return capacitors.value;
}

capacitors.parseElement = function(el) {
    // Convert the element text to a number
    capacitors.parse(el.value);

    // Update the element with the formatted value
    if (capacitors.formatted) {
        el.value = capacitors.formatted;
    }
    return capacitors.value;
}



inductors.parse = function(str) {

    // Remove all spaces, and any leading sign or trailing decimal point
    str = str.replace(/ +?/g, "")
             .replace(/^[\+\-]/, "")
             .replace(/\.$/, "");

    // Simplify any units to "H"
    str = str.replace(/h(enry)?(enries)?s?$/i, "H");

    // Check for known formats
    var match = str.match(/^(\d+)?(\.(\d+))?([pPnNuUmM])H?$/);
    if (match && (match[1] || match[3])) {
        // Integer or decimal point float, followed by a multiplier.
        // No commas allowed. 1.8u, 18n
        inductors.formatted = str.replace(/H$/, "");
        inductors.value = parseFloat(str);

        // Use the multiplier
        if (match[4] == "m" || match[4] == "M") {
            inductors.value *= 1e-3;
        } else if (match[4] == "u" || match[4] == "U" || match[4] == "\u03bc") {
            inductors.value *= 1e-6;
        } else if (match[4] == "n" || match[4] == "N") {
            inductors.value *= 1e-9;
        } else if (match[4] == "p" || match[4] == "P") {
            inductors.value *= 1e-12;
        }
    } else if (match = str.match(/^(\d+)?([fFpPnNuUmM])(\d+)$/i)) {
        // RKM codes not matched earlier, like F5, 2u2
        inductors.formatted = str;
        inductors.value = parseFloat((match[1] || "0") + "." + match[3]);

        // Use the multiplier
        if (match[2] == "m" || match[2] == "M") {
            inductors.value *= 1e-3;
        } else if (match[2] == "u" || match[2] == "U") {
            inductors.value *= 1e-6;
        } else if (match[2] == "n" || match[2] == "N") {
            inductors.value *= 1e-9;
        } else if (match[2] == "p" || match[2] == "P") {
            inductors.value *= 1e-12;
        }
    } else if (match = str.match(/^(\d+)?(\.(\d+))?H$/)) {
        // No multiplier, but ends with "H". 1.8H, 18H
        inductors.formatted = str.replace(/H$/, "");
        inductors.value = parseFloat(str);
    } else if (match = str.match(/^(\d+)?(\.(\d+))?$/)) {
        // Integer or float without multiplier or units. Assume mH.
        inductors.formatted = str + "m";
        inductors.value = parseFloat(str) * 1e-3;
    } else {
        inductors.formatted = "0";
        inductors.value = 0;
    }

    return inductors.value;
}

inductors.parseElement = function(el) {
    // Convert the element text to a number
    inductors.parse(el.value);

    // Update the element with the formatted value
    if (inductors.formatted) {
        el.value = inductors.formatted;
    }
    return inductors.value;
}



/* Tests: resistors
resistors.test = function(s) {
    resistors.parse(s);
    console.log("resistors:", s, resistors.formatted, resistors.value);
}
resistors.test("1k5 ohms");
resistors.test("1k5 Ohm");
resistors.test("1");
resistors.test("1.");
resistors.test("0.1");
resistors.test("0.1T");
resistors.test("0.1t");
resistors.test("1G");
resistors.test("1g");
resistors.test("1.2M");
resistors.test("1.2m");
resistors.test("1.2Meg");
resistors.test("1K");
resistors.test("1k");
*/

/* Tests: capacitors
capacitors.test = function(s) {
    capacitors.parse(s);
    console.log("capacitors:", s, capacitors.formatted, capacitors.value);
}
capacitors.test("1.5 F");
capacitors.test("1.5 farad ");
capacitors.test(" 1.5 Farads");
capacitors.test("1");
capacitors.test("1.");
capacitors.test("0.1");
capacitors.test("0.1M");
capacitors.test("0.1mF");
capacitors.test("1U");
capacitors.test("1u");
capacitors.test("1.2N");
capacitors.test("1.2n");
capacitors.test("1P");
capacitors.test("1p");
*/

/* Tests: inductors
inductors.test = function(s) {
    inductors.parse(s);
    console.log("inductors:", s, inductors.formatted, inductors.value);
}
inductors.test("1.5 H");
inductors.test("1.5 Henries ");
inductors.test(" 1.5 henry");
inductors.test("1H");
inductors.test("1.");
inductors.test("0.1");
inductors.test("0.1M");
inductors.test("0.1m");
inductors.test("1U");
inductors.test("1u");
inductors.test("1.2N");
inductors.test("1.2n");
inductors.test("1P");
inductors.test("1p");
*/
