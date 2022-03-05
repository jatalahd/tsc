/* Global 2D arrays for navigation dropdown menus. When a new page  */
/* is added, and belongs in a dropdown menu, add it here.           */
var menuFender = [
    ["Treble-Mid-Bass (TMB)", 'fender.htm'  ],
    ["Bassman 5F6-A"        , 'bassman5f6a.htm'],
    ["Brownface"            , 'brownface.htm'],
    ["E-series"             , 'eseries.htm' ],
    ["Princeton 5E2"        , 'princeton5e2.htm'],
    ["Princeton 5F2A"       , 'princeton.htm'],
    ["Pro Junior"           , 'projunior.htm'],
];

var menuDumble = [
    ["Jazz", 'dumble_jazz2.htm'],
    ["Rock", 'dumble_rock2.htm'],
];

var menuJames = [
    ["Passive / Dual Bass Capacitor"  , 'james.htm'  ],
    ["Passive / Single Bass Capacitor", 'james_2.htm'],
    ["Active / Dual Bass Capacitor"   , 'james_3.htm'],
    ["Active / Single Bass Capacitor" , 'james_4.htm'],
];

var menuBaxandall = [
    ["Passive / Dual Bass Capacitor"  , 'baxandall_passive.htm'  ],
    ["Passive / Single Bass Capacitor", 'baxandall_passive_2.htm'],
    ["Active / Dual Bass Capacitor"   , 'baxandall_1.htm'        ],
    ["Active / Single Bass Capacitor" , 'baxandall_2.htm'        ],
];


var menuSWTC = [
    ["swtc v1"  , 'swtc1.htm'],
    ["swtc v2"  , 'swtc2.htm'],
    ["swtc v3"  , 'swtc3.htm'],
    ["swtc v4"  , 'swtc4.htm'],
];


/* Global 2D array for top-level navigation. When a new page is  */
/* added, and doesn't go in a dropdown, add it here so all pages */
/* will have the updated links.                                  */
var pages = [
    ["Marshall"      , 'marshall.htm' ],
    ["Fender"        , menuFender     ],
    ["Vox"           , 'vox.htm'      ],
    ["James"         , menuJames      ],
    ["Baxandall"     , menuBaxandall  ],
    ["Neve"          , 'nevehilo.htm' ],
    ["Bench"         , 'bench.htm'    ],
    ["Big Muff"      , 'bigmuff.htm'  ],
    ["Hiwatt"        , 'hiwatt.htm'   ],
    ["Crate"         , 'crate.htm'    ],
    ["Dumble"        , menuDumble     ],
    ["Aria"          , 'aria.htm'     ],
    ["Framus"        , 'framus.htm'   ],
    ["Bone Ray"      , 'boneray.htm'  ],
    ["Blackstar"     , 'blackstar.htm'],
    ["Wah"           , 'wah.htm'      ],
    ["SWTC"           , menuSWTC      ],
];


/* Global specification for color spinner in snapshots */
var colorSpectrum = ["#D50","blue","green","black","red","slateblue","violet","gray","tomato","lightgray"];
var currentGraph;
var origLabels = [ "frequency [Hz]", "amplitude [dB]" ];

/* Global array for storing snapshots */
var storeData = [];

var series = 1;
var labelArray = origLabels;
var colorArray = [colorSpectrum[0]];

/* Adds a snapshot series to graph */
function addSeries() {
    if (currentGraph) return addSeriesPair();

    storeData = data;
    colorArray.push(colorSpectrum[series%colorSpectrum.length]);
    series = storeData[0].length;
    labelArray.push(origLabels[1] + series);
    doCalc();
}

/* Add a snapshot to a pair of tscGraphs */
function addSeriesPair(a = graph1, b = graph2) {
    a.addSeries();
    b.addSeries();
    doCalc();
}

/* Removes all snapshot traces from the graph */
function clearSnapshots() {
    if (currentGraph) return clearSnapshotsPair();

    series = 1;
    colorArray = [colorSpectrum[0]];
    labelArray = [ "frequency [Hz]", "amplitude [dB]" ];
    doCalc();
}


/* Remove all snapshots traces from a pair of tscGraphs */
function clearSnapshotsPair(a = graph1, b = graph2) {
    a.clearSnapshots();
    b.clearSnapshots();
    doCalc();
}

/* Creates links based on the pages array defined above */
/* pageReference string needs to match the item in the pages array */
function createLinks(divId, pageReference, dropdownReference) {
    var linkDiv = document.getElementById(divId);

    function _createDropdown(name, arr) {
        // Dropdown menu container
        var dropDiv = document.createElement('div');
        dropDiv.className = "navbar-menu-item dropdown";
        if (pageReference == name) {
            dropDiv.classList.add("disabled");
        }

        // Button element
        var dropElement = document.createElement('button');
        dropElement.innerText = name;
        dropDiv.appendChild(dropElement);
        dropElement = dropElement.appendChild(document.createElement('img'));
        dropElement.className = "navbar-menu-item-icon";
        dropElement.src = "expand_more.png";

        // Dropdown contents
        var dropContent = document.createElement('div');
        dropContent.className = "dropdown-content";
        dropDiv.appendChild(dropContent);
        for (var i = 0; i < arr.length; i++) {
            dropElement = document.createElement('a');
            dropElement.setAttribute('href', arr[i][1]);
            dropElement.innerText = arr[i][0];
            if (pageReference == name && dropdownReference == arr[i][0]) {
                dropElement.classList.add("disabled");
            }
            dropContent.appendChild(dropElement);
        }
        return dropDiv;
    }

    // Top level of navigation bar
    for (var row = 0; row < pages.length; row++) {
        linkDiv.appendChild(document.createTextNode("| "));
        if (Array.isArray(pages[row][1])) {
            linkDiv.appendChild(_createDropdown(pages[row][0], pages[row][1]));
        } else {
            var linkElement = document.createElement('a');
            linkElement.setAttribute('href', pages[row][1]);
            linkElement.appendChild(document.createTextNode(pages[row][0]));
            var cls = 'navbar-menu-item';
            if (pageReference == pages[row][0]) {
                  cls = cls + ' disabled';
            }
            linkElement.setAttribute('class', cls)
            linkDiv.appendChild(linkElement);
            linkDiv.appendChild(document.createTextNode(""));
        }
    }
}

/* Creates an arithmetic or geometric set of frequencies based on input parameters  */
function createFrequencies(deviation, startfreq, stopfreq, mode) {
    // adder for "arithmetic" series in logarithmic frequency sequence (mode = 1)
    var adder = (10-1)/deviation;
    // multiplier for "geometric" series in logarithmic frequency sequence (mode = 0)
    var multiplr = Math.pow(10,(1/deviation));

    // calculate the exponent for the calculation stop frequency
    var k = 0;
    while (Math.pow(10,k) < stopfreq) {
        k = k + 1;
    }

    // X = array for frequency values
    var X = [];
    // f = frequency variable for generating a sequence of analysis frequencies
    var f = startfreq;
    var z = f;

    // create an array X[] of analysis frequency points
    for (j = 0; j <= k; j++) {
        var limit = Math.pow(10,(j+1)) - adder;
        var increment = adder*Math.pow(10,j);
        while (f <= limit && f <= stopfreq) {
            X.push(z);
            if (mode > 0) {
                f += increment;
                z = f;
            } else {
                f *= multiplr;
                z = Math.round(100000*f)/100000;
            }
        }
    }
    X.push(z);
    return X;
}


/* A common function to create a slider with default layout */
function createSlider(rangeDiv, valueDiv, startValue=5) {
    var range_RX = document.getElementById(rangeDiv);
    noUiSlider.create(range_RX, {
        start: startValue,
        step: 0.10,
        range: {min: 0, max: 10},
        pips: {mode: 'values', values: [0, 5 ,10], density: 10}
    });

    var value_RX = document.getElementById(valueDiv);
    range_RX.noUiSlider.on('update', function( values, handle ){
        value_RX.innerHTML = values[handle];
    });

    return range_RX;
}


/* Implements the logA potentiometer model as defined in the original TSC */
function logAPotModel(rotation) {
    var rot = 0;
    if (rotation < 5) {
        rot = 0.6*rotation
    } else {
        rot = rotation*1.4 - 4;
    }
    return rot;
}


/* Implements the logB potentiometer model as defined in the original TSC */
function logBPotModel(rotation) {
    var rot = 0;
    if (rotation < 5) {
        rot = 0.2*rotation;
    } else {
        rot = rotation*1.8 - 8;
    }
    return rot;
}


/* Implements the logC potentiometer model as inverse of logA (anti-log taper)  */
function logCPotModel(rotation) {
    var rot = 0;
    if (rotation < 5) {
        rot = 1.4*rotation
    } else {
        rot = rotation*0.6 + 4;
    }
    return rot;
}


/* Wrapper function for returning the pot rotation value according to the given potentiometer type */
function getRotationForPotType(rotation, type) {
    // Linear pot model as default
    var rot = rotation;

    // LogA and LogB pot models selected per given type
    if ("LogA" == type) {
        rot = logAPotModel(rotation);
    } else if ("LogB" == type) {
        rot = logBPotModel(rotation);
    } else if ("LogC" == type) {
        rot = logCPotModel(rotation);
    }
    return rot;
}


/* Customized legend for the graph for all data series */
function legendFormatter(data){
    //console.log(data);
    if(data.x == undefined){
        return '';
    }
    var html = data.xHTML + ' Hz' + ' : ';
    data.series.forEach(function(series) {
        html += ' ' + series.yHTML.fontcolor(series.color) + ' dB ';
    });
    return html;
}

/* A common function to create the graph area with default layout */
function createDyGraph(data, titleText, offset=0) {
    var grph = new Dygraph(document.getElementById('graph'), data, { labels: origLabels
                                                                     , strokeWidth: 2.0
                                                                     , colors: [colorSpectrum[0]]
                                                                     , title: titleText
                                                                     , xlabel: "frequency [Hz]"
                                                                     , ylabel: "amplitude [dB]"
                                                                     , axisLabelFontSize: 18
                                                                     , xLabelHeight: 20
                                                                     , yLabelWidth: 20
                                                                     , legend: "always"
                                                                     , legendFormatter: legendFormatter
                                                                     , labelsDiv: document.getElementById('legendDiv')
                                                                     , maxNumberWidth: 7
                                                                     , digitsAfterDecimal: 3
                                                                     , axes: {  y: {valueRange: [-50+offset, 1+offset]}
                                                                     , x: {logscale: true, ticker:
        function(min, max, pixels) {
            return [ { v: 10 }, { label_v: 10, label: '10' },
                     { v: 20 },
                     { v: 30 },
                     { v: 40 },
                     { v: 50 },
                     { v: 60 },
                     { v: 70 },
                     { v: 80 },
                     { v: 90 },
                     { v: 100 }, { label_v: 100, label: '100' },
                     { v: 200 },
                     { v: 300 },
                     { v: 400 },
                     { v: 500 },
                     { v: 600 },
                     { v: 700 },
                     { v: 800 },
                     { v: 900 },
                     { v: 1000 }, { label_v: 1000, label: '1000' },
                     { v: 2000 },
                     { v: 3000 },
                     { v: 4000 },
                     { v: 5000 },
                     { v: 6000 },
                     { v: 7000 },
                     { v: 8000 },
                     { v: 9000 },
                     { v: 10000 }, { label_v: 10000, label: '10000' },
                     { v: 20000 },
                     { v: 30000 },
                     { v: 40000 },
                     { v: 50000 },
                     { v: 60000 },
                     { v: 70000 },
                     { v: 80000 },
                     { v: 90000 },
                     { v: 100000 }, { label_v: 100000, label: '100000' }
            ]}}}});
    return grph;
}

/* This function swaps display between two tscGraphs */
function swapGraphs(a = graph1, b = graph2) {
    currentGraph.div.style.display = "none";
    currentGraph = currentGraph === a ? b : a;
    currentGraph.div.style.display = "block";
    currentGraph.update();
    return currentGraph;
}



/*
 * tscGraph: Object representing a Tone Stack Calculator graph
 * ----------------------------------------------------------------------------
 *
 * This object helps with management of Tone Stack Calculator graphs. It holds
 * the data and settings specific to a single graph, and offers methods for
 * common tasks, such as management of snapshots.
 *
 *
 * -- Properties --
 *
 * title: The title of the graph. May contain HTML.
 *
 * xLabel, yLabel:
 * The labels for the x and y axes of the graph.
 *
 * div:
 * The id of the HTML div to be used to contain the display of the graph. If
 * not specified, "graph" is assumed.
 *
 * offset:
 * An amount by which to raise or lower the default range displayed on the y
 * axis. For phase graphs, this is ignored.
 *
 * data:
 * The data property represents a table of rows and columns. It
 * is defined as an array of rows, where each row is itself an
 * array. Each column consists of the nth elements in each row.
 *
 * The first column of the table contains the x values, which must
 * be common to all data series. The second column contains the
 * the corresponding y values for the first data series, the third
 * column has the y values for the second data series, and so on.
 *
 * For example, if the data property is
 *     [ [1, 5, 10], [2, 6, 7] ]
 * then the first data series has points (1, 5) and (2, 6), while
 * the second data series has points (1, 10) and (2, 7).
 *
 * series:
 * The total number of data series, including the series that is recalculated
 * "live" as the user interacts with controls.
 *
 * labels:
 * An array containing a label for each column in the data table, as required
 * by the dygraphs library. These are managed automatically when using the
 * clearSnapshots and addSeries methods.
 *
 * colors:
 * An array containing the graphing colors, one for each data series. These are
 * managed automatically when using the clearSnapshots and addSeries methods.
 *
 *
 * -- Methods --
 *
 * addSeries:
 * Saves the current "live" series away and prepares for a new one that the
 * user can interact with. After calling this, the y values for the new series
 * must be added before the graph's display can be updated.
 *
 * clearSnapshots:
 * Clears away all series and prepares for a new "live" series. After using
 * this, the y values for the new series must be added before the graph's
 * display can be updated.
 *
 * update:
 * Redraws the graph. Call this after series data has been updated. Also useful
 * if the graph's div has been "display: none" but has now become visible.
 *
 * createDyGraph:
 * Creates a default graph (Bode magnitude plot) using the dygraphs library.
 * This is automatically done if the graph does not already exist when the
 * update() method is used.
 *
 * createDyGraphPhase:
 * Creates a phase graph (Bode phase plot) using the dygraphs library.
 * This is automatically done if the graph does not already exist when the
 * update() method is used, and the y axis has been labeled "phase".
 *
 */
function tscGraph(xValues, xLabel = "X", yLabel = "Y", title = null, offset = 0, div) {

    // Save the current series y values and prepare for a new series
    this.addSeries = function() {
        this.series++;
        this.colors.push(colorSpectrum[this.series%colorSpectrum.length]);
        this.labels.push(yLabel + this.series);
    }

    // Clear saved y values for all series and prepare for a new series
    this.clearSnapshots = function() {
        this.series = 1;
        this.colors = [colorSpectrum[0]];
        this.labels = [this.xLabel, this.yLabel + this.series];

        // Reset the data table to one column containing the x values
        this.data = [];
        for (var i = 0; i < xValues.length; i++) {
            this.data.push([xValues[i]]);
        }
    }

    // Private function for specifying dygraphs axis style for frequencies
    this._tickerHz = function(min, max, pixels) {
        return [
            { v: 10 }, { label_v: 10, label: '10' },
            { v: 20 },
            { v: 30 },
            { v: 40 },
            { v: 50 },
            { v: 60 },
            { v: 70 },
            { v: 80 },
            { v: 90 },
            { v: 100 }, { label_v: 100, label: '100' },
            { v: 200 },
            { v: 300 },
            { v: 400 },
            { v: 500 },
            { v: 600 },
            { v: 700 },
            { v: 800 },
            { v: 900 },
            { v: 1000 }, { label_v: 1000, label: '1K' },
            { v: 2000 },
            { v: 3000 },
            { v: 4000 },
            { v: 5000 },
            { v: 6000 },
            { v: 7000 },
            { v: 8000 },
            { v: 9000 },
            { v: 10000 }, { label_v: 10000, label: '10K' },
            { v: 20000 },
            { v: 30000 },
            { v: 40000 },
            { v: 50000 },
            { v: 60000 },
            { v: 70000 },
            { v: 80000 },
            { v: 90000 },
            { v: 100000 }, { label_v: 100000, label: '100K' }
        ]
    };

    /* Create a graph with layout for Bode magnitude plot */
    this.createDyGraph = function() {

        /* Customized legend for the graph for all data series */
        function _legendFormatter(data){
            //console.log(data);
            if(data.x == undefined){
                return '';
            }
            var html = data.xHTML + ' Hz' + ' : ';
            data.series.forEach(function(series) {
                html += ' ' + series.yHTML.fontcolor(series.color) + ' dB ';
            });
            return html;
        }

        this.graph = new Dygraph(
            this.div,
            this.data,
            {
                labels: this.labels,
                strokeWidth: 2.0,
                colors: this.colors,
                title: this.title,
                xlabel: this.xLabel,
                ylabel: this.yLabel,
                axisLabelFontSize: 18,
                xLabelHeight: 20,
                legend: "always",
                legendFormatter: _legendFormatter,
                labelsDiv: document.getElementById('legendDiv'),
                maxNumberWidth: 7,
                digitsAfterDecimal: 1,
                axes: {
                    y: {valueRange: [-50 + offset, 1 + this.offset]},
                    x: {
                        logscale: true,
                        ticker: this._tickerHz
                    },
                },
            },
        );

        return this.graph;
    }

    /* Create a graph with layout for Bode phase plot */
    this.createDyGraphPhase = function() {

        /* Customized legend for the graph for all data series */
        function _legendFormatter(data){
            if (data.x == undefined) {
                return '';
            }
            var html = data.xHTML + ' Hz' + ' : ';
            data.series.forEach(function(series) {
                html += ' ' + series.yHTML.fontcolor(series.color) + '&deg ';
            });
            return html;
        }

        this.graph = new Dygraph(
            this.div,
            this.data,
            {
                labels: this.labels,
                strokeWidth: 2.0,
                colors: this.colors,
                title: this.title,
                xlabel: this.xLabel,
                ylabel: this.yLabel,
                axisLabelFontSize: 18,
                xLabelHeight: 20,
                legend: "always",
                legendFormatter: _legendFormatter,
                labelsDiv: document.getElementById('legendDiv'),
                maxNumberWidth: 7,
                digitsAfterDecimal: 1,
                axes: {
                    y: {
                        valueRange: [-180, 181],
                        drawAxis: true,
                        ticker: function(min, max, pixels) {
                            return [ { v: -180 }, { label_v: -180, label: '-180&deg' },
                                     { v: -135 }, { label_v: -135, label: '-135&deg' },
                                     { v:  -90 }, { label_v:  -90, label: '-90&deg'  },
                                     { v:  -45 }, { label_v:  -45, label: '-45&deg'  },
                                     { v:    0 }, { label_v:    0, label: '0&deg'    },
                                     { v:   45 }, { label_v:   45, label: '45&deg'   },
                                     { v:   90 }, { label_v:   90, label: '90&deg'   },
                                     { v:  135 }, { label_v:  135, label: '135&deg'  },
                                     { v:  180 }, { label_v:  180, label: '180&deg'  },
                                   ]
                        },
                    },
                    x: {
                        logscale: true,
                        ticker: this._tickerHz
                    },
                },
            },
        );

        return this.graph;
    }

    /* Update the graph, or create one if it doesn't exist already. */
    this.update = function() {
        if (this.graph) {
            this.graph.updateOptions({file: this.data, labels: this.labels, colors: this.colors});
            this.graph.resize();
        } else {
            switch (this.yLabel) {
                case "phase":
                    this.createDyGraphPhase();
                    break;
                default:
                    this.createDyGraph();
            }
        }
    }

    // Initialize the object
    this.title = title;
    this.xLabel = xLabel;
    this.yLabel = yLabel;
    this.div = typeof div !== 'undefined' ? document.getElementById(div) :
                                            document.getElementById('graph');
    this.offset = offset;
    this.clearSnapshots();

    //console.log(this);
}


/*
 * Given coefficients of a polynomial in s, and angular frequency w,
 * this function calculates the sums of the real and imaginary parts.
 *
 * The polynomial must take the form of increasing powers of s:
 *     a0 + a1*s + a2*s^2 + a3*s^3 + ...
 *
 * The coefficients must be passed as parameters in array form, like:
 *     [ a0, a1, a2, a3, ... ]
 */
function sumCoeffs(coeffs, w) {
    // Each term is multiplied by s=jw in increasing powers of s.
    // Even powers of s are real, while odd powers are imaginary.
    var sumRe = 0;
    var sumIm = 0;
    var multip = 1;
    coeffs.forEach(function(value, k) {
        if (k%2 != 0) {
            sumIm += multip * value;
            multip *= -w;
        } else {
            sumRe += multip * value;
            multip *= w;
        }
    });

    return {
        re : sumRe,
        im : sumIm,
    };
}


/*
 * Given the coefficients of a linear, time invariant transfer function H(s),
 * and a set of frequencies, this function calculates the magnitude and phase
 * of H(jw), where w is the angular frequency (2*pi*f). The results are saved
 * in the latest data series of the given tscGraphs. If both graphs are given
 * then their sets of frequencies are assumed to be the same.
 *
 * The transfer function takes the form of increasing powers of s:
 *     a0 + a1*s + a2*s^2 + a3*s^3 + ...
 *     ---------------------------------
 *     b0 + b1*s + b2*s^2 + b3*s^3 + ...
 *
 * The coefficients of the transfer function must be passed as parameters in
 * array form.
 *      numCoeffs: [ a0, a1, a2, a3, ... ]
 *      denCoeffs: [ b0, b1, b2, b3, ... ]
 *
 */
function doCalcBode(numCoeffs, denCoeffs, magGraph = graph1, phaseGraph = graph2) {
    var dBMin;
    var dBMax;
    var degMin;
    var degMax;
    var previousDegPositive = true;

    // Determine the number of frequencies to use for calculation.
    var g = magGraph? magGraph : phaseGraph;
    var n = g? g.data.length : 0;

    for (var j = 0; j < n; j++) {
        // Angular frequency w = 2*pi*f
        var w = 2*Math.PI*g.data[j][0];

        // Sum the real and imaginary parts of the numerator and denominator.
        var sumNum = sumCoeffs(numCoeffs, w);
        var sumDen = sumCoeffs(denCoeffs, w);

        // Rearrange the expression so that all imaginary terms are in the
        // numerator. This can be accomplished by multiplying the numerator
        // and denominator by the denominator's complex conjugate.
        //     A + jB     C - jD     (AC + BD) + j(BC - AD)
        //     ------  *  ------  =  ----------------------
        //     C + jD     C - jD           C*C + D*D
        var NUMERATOR_Re = sumNum.re * sumDen.re + sumNum.im * sumDen.im;
        var NUMERATOR_Im = sumNum.im * sumDen.re - sumNum.re * sumDen.im;
        var DENOMINATOR  = sumDen.re**2 + sumDen.im**2;

        // Get the magnitude and phase. The numerator is a phasor and the
        // denominator is real and positive. The magnitude may be found by
        // using the Pythagorean theorem on the phasor, then scaling by a
        // factor of 1/DENOMINATOR. The scale factor is irrelevant to phase,
        // which may be found by figuring the inverse tangent of the phasor.
        var magnitude = Math.sqrt(NUMERATOR_Re**2 + NUMERATOR_Im**2)/DENOMINATOR;
        var phase     = Math.atan2(NUMERATOR_Im, NUMERATOR_Re);

        // Record the magnitude in dB.
        var dB = 20 * Math.log10(magnitude);
        if (magGraph) {
            magGraph.data[j][magGraph.series] = dB;
        }

        // Record the phase in degrees to the nearest 0.1 degrees. To minimize
        // graphing of vertical lines, for +180 or -180 degrees use the same
        // sign as the previous result.
        var deg = Math.round(phase * 1800 / Math.PI) / 10;
        if (Math.abs(deg) == 180) {
            deg = previousDegPositive? 180 : -180;
        }
        previousDegPositive = (deg > 0);
        if (phaseGraph) {
            phaseGraph.data[j][phaseGraph.series] = deg;
        }

        // Track the largest and smallest values in dB and degrees
        if (dBMin == undefined || dB < dBMin) {
            dBMin = dB;
        }
        if (dBMax == undefined || dB > dBMax) {
            dBMax = dB;
        }
        if (degMin == undefined || deg < degMin) {
            degMin = deg;
        }
        if (degMax == undefined || deg > degMax) {
            degMax = deg;
        }
    }

    return {
        dBMin  : dBMin,
        dBMax  : dBMax,
        degMin : degMin,
        degMax : degMax,
    };
}


/*
 * Function to set part values based on any parameters after the URL hash (#)
 */
function setCustomValues() {
    var params = new URLSearchParams(location.hash.substring(1));
    params.forEach(function(value, key) {
        //console.log(key, value);
        if (document.frm[key]) {
            document.frm[key].value = value;
        }
    });
    if (params.has("graphToggle") && document.frm.graphToggle) {
        document.frm.graphToggle.checked = true;
    }
}


/*
 * This function combines all part values into query parameter form and places
 * them into the URL. Then if the page is refreshed, or the URL is shared, the
 * part values are remembered. To prevent an automatic page reload, the hash
 * identifier (#) is used instead of the search identifier (?).
 */
function updateURL () {
    var formData = new FormData(document.frm);
    formData.delete("apply");
    var searchParams = new URLSearchParams(formData);
    location.hash = searchParams.toString();
}



function initializeForm() {
    const f = document.frm;

    // Add form validation functions
    var els = f.getElementsByTagName("input");
    for (var i = 0; els[i]; i++) {
        if (els[i].classList.contains("resistance")) {
            els[i].addEventListener("input", function(event) {
                tscResistance.validateElement(event.target);
            });
        } else if (els[i].classList.contains("capacitance")) {
            els[i].addEventListener("input", function(event) {
                tscCapacitance.validateElement(event.target);
            });
        } else if (els[i].classList.contains("inductance")) {
            els[i].addEventListener("input", function(event) {
                tscInductance.validateElement(event.target);
            });
        } else if (els[i].classList.contains("tonestack-value-input")) {
            els[i].addEventListener("input", function(event) {
                tscValue.validateElement(event.target);
            });
        }
    }

    // Add potentiometer type selection functions
    els = f.getElementsByClassName("tonestack-select-pot");
    for (var i = 0; els[i]; i++) {
        els[i].addEventListener("change", function(event) {
            updateURL();
            doCalc();
        });
    }

    // Add potentiometer slider functions
    els = f.getElementsByClassName("tonestack-slider-input");
    for (var i = 0; els[i]; i++) {
        if (els[i].noUiSlider) {
            els[i].noUiSlider.on("slide", doCalc);
        }
    }

    // Assign form button functions
    f.edit.addEventListener("click", editValues);
    f.defaults.addEventListener("click", function(event) {
        setDefaultValues();
        applyValues();
    });

    // Assign graph control functions
    f.graphToggle.addEventListener("click", function(event) {
        updateURL();
        swapGraphs();
    });
    f.Clear.addEventListener("click", clearSnapshots);
    f.Snapshot.addEventListener("click", addSeries);
    f.Sweep.addEventListener("click", sweepValues);

    // Assign form submit function
    f.addEventListener("submit", function(event) {
        applyValues();
        event.preventDefault();
    });
}


