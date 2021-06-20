/*
 * Objects to support text input of values using multipliers or RKM codes
 * ----------------------------------------------------------------------------
 *
 * This script creates objects for parsing text into numeric values. RKM codes
 * and common multipliers like "k" (kilo) are interpreted and reflected in the
 * resulting value. Each of the objects has the same properties and methods.
 *
 * The base class, TSCValue, can validate and parse unitless values. All values
 * must be positive.
 *
 *   Example format   Integer   Float
 *   ---------------  -------  -------
 *   Numeric only        2500   0.0005
 *   With multiplier     2.5k     500n
 *   RKM code             2K5       m5 
 *
 * Derived classes TSCResistance, TSCCapacitance, and TSCInductance can parse
 * text representing ohms, farads, and henries. Note that for capacitance, if
 * the parsed text contains only a number, the unit is assumed to be pF. For
 * inductance, the unit is assumed to be mH.
 *
 * For convenience, each class has been instantiated in global variables
 * tscValue, tscResistance, tscCapacitance, and tscInductance.
 *
 *
 * -- Properties --
 *
 * value:           numeric value of the parsed text
 *
 * formatted:       a cleaned-up version of the parsed text
 *
 *
 * -- Methods --
 *
 * parse:           Parses the given text, and sets the value and formatted
 *                  properties accordingly. Returns true for valid text, and
 *                  false otherwise.
 *
 * parseElement:    Given a text input element, parses its text, updates its
 *                  text with a cleaned-up version, and returns the value.
 *
 * validateElement: Given a text input element, parses its text. Returns true
 *                  for valid text. Otherwise, sets a helpful message for the
 *                  user and returns false.
 *
 */



/*
 * TSCValue: Base class for parsing unitless values, and containing properties
 * and methods for inheritance by classes using units.
 */
function TSCValue () {
    // Derived classes can override these as needed.

    // The multipliers properties pairs characters to multiplication factors.
    this.multipliers = {
        p      : 1e-12,
        P      : 1e-12,
        n      : 1e-9,
        N      : 1e-9,
        u      : 1e-6,
        U      : 1e-6,
        \u00b5 : 1e-6,
        \u03bc : 1e-6,
        m      : 1e-3,
        k      : 1e3,
        K      : 1e3,
        M      : 1e6,
        g      : 1e9,
        G      : 1e9,
        t      : 1e12,
        T      : 1e12,
    };


    // The patternDecimal property defines a regular expression used to
    // determine the allowable patterns for an integer or floating point
    // value followed by a multiplier. The first group must capture the
    // numeric portion, and the second group must capture the multiplier.

    // Allow all multipliers by default
    var mults = Object.keys(this.multipliers).join("");
    this.patternDecimal = new RegExp("^(\\d*\\.\\d*|\\d+)([" + mults + "])$");


    // The patternRKM property defines a regular expression used to determine
    // the allowable patterns for RKM codes not already covered by the
    // patternDecimal pattern. The integer portion(s) of the code must be
    // captured by the first and third groups. Although both of these groups
    // are specified as optional in the regular expression, the parsing code
    // will test to ensure that at least one of them is non-empty. The
    // multiplier must be captured by the second group.
    this.patternRKM = new RegExp("^(\\d+)?([" + mults + "])(\\d+)?$");


    // The tip property defines text to show the user when invalid input is
    // detected.
    this.tip = "Enter a value";


    // The prefilter property specifies an optional function to perform any
    // custom manipulation of the text prior to parsing. The text is passed
    // as the parameter, and the function must return the filtered version.
    this.prefilter = undefined;


    // The defaultMultiplier property specifies a multiplier character to use
    // by default if the text does not specify one. This property is optional.
    this.defaultMultiplier = null;
};


TSCValue.prototype.parse = function(str) {

    // Set default results
    this.value = 0;
    this.formatted = "0";

    // Fail immediately if not given a string
    if (typeof str != "string") return false;

    // Remove all spaces and leading plus, and unneeded decimal points
    str = str.replace(/ +?/g, "")
             .replace(/^[\+]/, "")
             .replace(/\.([^\d])/g, "$1");

    // Do any custom filtering defined for this instance.
    if (this.prefilter) {
        str = this.prefilter(str);
    }

    // Empty strings are accepted as zero.
    if (!str) return true;

    // Reject leading negative sign
    if (str.charAt(0) == "-") return false;

    var multiplier;
    var match = str.match(this.patternDecimal);
    if (match) {
        // Integer or decimal point float, followed by a multiplier.
        // No commas allowed. 18k, 1.8u, etc
        this.value = parseFloat(match[1]);
        multiplier = match[2];
        this.formatted = str.replace(/^\./, "0.")
    } else if ((match = str.match(this.patternRKM)) && (match[1] || match[3])) {
        // RKM codes not matched earlier, like R5, 10R2, 1K87, 25M5
        this.value = parseFloat((match[1] || "0") + "." + (match[3] || "0"));
        multiplier = match[2];
        this.formatted = str;
    } else if (!isNaN(str)) {
        // Purely numeric

        this.value = parseFloat(str);
        this.formatted = this.value.toString();
        if (this.defaultMultiplier) {
            multiplier = this.defaultMultiplier;
            this.formatted += multiplier;
        }
    } else {
        // Unrecognized format
        return false;
    }

    // Recognized format. Use its multiplier.
    if (this.multipliers[multiplier]) {
        this.value *= this.multipliers[multiplier];
    }

    return true;
}


/*
 * Utility method for performing validity tests. Given some text, and whether
 * the text is expected to be valid, logs the test result to the console.
 */
TSCValue.prototype.test = function(str, expectedValidity = true) {
    var valid = this.parse(str);
    var passed = (valid == expectedValidity);
    console.log(this.constructor.name + " test " + (passed? "OK" : "FAIL"),
                str, this.formatted, this.value, valid);
    return passed;
}


TSCValue.prototype.parseElement = function(el) {
    // Parse the element text
    this.parse(el.value);

    if (this.formatted) {
        // Update the element with the formatted value
        el.value = this.formatted;
    }

    return this.value;
}


TSCValue.prototype.validateElement = function(el) {

    // Check for valid format
    if (this.parse(el.value)) {
        el.setCustomValidity("");
        return true;
    }

    // Validation failed
    el.setCustomValidity(this.tip);
    //console.log("validateElement", "failed", el.validity.customError, this.tip);
    el.reportValidity();
    return false;
}



/*
 * TSCResistance: Class containing all customizations for resistance values
 */
function TSCResistance() {
    TSCValue.call(this);

    this.prefilter = function(str) {
        // Remove any units
        str = str.replace(/ohm[s]?$/i, "")
                 .replace(/\u2126$/, "");

        // Capitalize mega or giga multipliers (and convert "meg" used in SPICE.)
        // It is assumed that "m" means mega, not milli.
        str = str.replace(/meg$/i, "M")
                 .replace("m", "M")
                 .replace("g", "G");

        return str;
    }

    this.patternDecimal = /^(\d*\.\d*|\d+)([kmg])$/i;
    this.patternRKM = /^(\d+)?([rkmg])(\d+)?$/i;
    this.tip = "Enter a resistance value.\nExamples: 2200, 2.2k, 2K2";
}
TSCResistance.prototype = Object.create(TSCValue.prototype);
TSCResistance.prototype.constructor = TSCResistance;



/*
 * TSCCapacitance: Class containing all customizations for capacitance values
 */
function TSCCapacitance() {
    TSCValue.call(this);

    this.prefilter = function(str) {
        // Simplify any unit to single letter
        str = str.replace(/(f)(arad)?s?$/i, "$1");
        return str;
    }

    this.patternDecimal = /^(\d*\.\d*|\d+)([pPnNuU\u00b5\u03bcmMfF])[fF]?$/;
    this.patternRKM     = /^(\d+)?([pPnNuU\u00b5\u03bcmMfF])(\d+)?$/
    this.tip = "Enter a capacitance value.\nExamples: 2200p, 2.2n, 2N2";

    // If no multiplier is given, assume pico. Use "F" for whole Farads.
    this.defaultMultiplier = "p";
    this.multipliers.f = 1;
    this.multipliers.F = 1;

    // Capital "M" is acceptable but only means milli, never mega.
    this.multipliers.M = 1e-3;
}
TSCCapacitance.prototype = Object.create(TSCValue.prototype);
TSCCapacitance.prototype.constructor = TSCCapacitance;



/*
 * TSCInductance: Class containing all customizations for inductance values
 */
function TSCInductance() {
    TSCValue.call(this);

    this.prefilter = function(str) {
        // Simplify any units to single letter
        str = str.replace(/(h)(enry|enrie)?s?$/i, "$1");
        return str;
    }

    this.patternDecimal = /^(\d*\.\d*|\d+)([uU\u00b5\u03bcmMhH])[hH]?$/;
    this.patternRKM     = /^(\d+)?([uU\u00b5\u03bcmMhH])(\d+)?$/
    this.tip = "Enter an inductance.\nExamples: 2200m, 2.2H, 2H2";

    // If no multiplier is given, assume milli. Use "H" for whole Henries.
    this.defaultMultiplier = "m";
    this.multipliers.h = 1;
    this.multipliers.H = 1;

    // Capital "M" is acceptable but only means milli, never mega.
    this.multipliers.M = 1e-3;
}
TSCInductance.prototype = Object.create(TSCValue.prototype);
TSCInductance.prototype.constructor = TSCInductance;



var tscValue       = new TSCValue;
var tscResistance  = new TSCResistance;
var tscCapacitance = new TSCCapacitance;
var tscInductance  = new TSCInductance;

