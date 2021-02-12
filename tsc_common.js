
/* Global 2D array to for creating links to each page. When a new page */
/* is added, add it here so all pages will have the updated links. */
var pages = [["Marshall"      , 'marshall.htm'],
             ["Fender"        , 'fender.htm'  ],
             ["Vox"           , 'vox.htm'     ],
             ["James"         , 'james.htm'   ],
             ["E-series"      , 'eseries.htm' ],
             ["Bench"         , 'bench.htm'   ],
             ["Big Muff"      , 'bigmuff.htm' ],
             ["Hiwatt"        , 'hiwatt.htm'  ],
             ["Crate"         , 'crate.htm'   ],
             ["Dumble R"      , 'dumble_rock2.htm'],
             ["Dumble J"      , 'dumble_jazz2.htm'],
             ["Aria"          , 'aria.htm'    ],
             ["Framus"        , 'framus.htm'  ],
             ["Princeton 5F2A", 'princeton.htm'],
             ["Princeton 5E2" , 'princeton5e2.htm'],
             ["Bone Ray"      , 'boneray.htm'],
             ["Brownface"     , 'brownface.htm'],
             ["Blackstar"     , 'blackstar.htm'],
             ["Wah"           , 'wah.htm'     ]];
			 
/* Global specification for color spinner in snapshots */
var colorSpectrum = ["#D50","blue","green","black","red","slateblue","violet","gray","tomato","lightgray"];
var origLabels = [ "frequency [Hz]", "amplitude [dB]" ];

/* Global array for storing snapshots */
var storeData = [];

var series = 1;
var labelArray = origLabels;
var colorArray = [colorSpectrum[0]];

/* Adds a snapshot series to graph */
function addSeries() {
    storeData = data;
    colorArray.push(colorSpectrum[series%colorSpectrum.length]);
    series = storeData[0].length;
    labelArray.push(origLabels[1] + series);
    doCalc();
}
	
/* Removes all snapshot traces from the graph */
function clearSnapshots() {
    series = 1;
    colorArray = [colorSpectrum[0]];
    labelArray = [ "frequency [Hz]", "amplitude [dB]" ];
    doCalc();
}

/* Creates links based on the pages array defined above */
/* pageReference string needs to match the item in the pages array */
function createLinks(divId, pageReference) {
    var linkDiv = document.getElementById(divId);

    for (var row = 0; row < pages.length; row++) {
        linkDiv.appendChild(document.createTextNode("| "));
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


/* Wrapper function for returning the pot rotation value according to the given potentiometer type */
function getRotationForPotType(rotation, type) {
    // Linear pot model as default
    var rot = rotation;
    
    // LogA and LogB pot models selected per given type
    if ("LogA" == type) {
        rot = logAPotModel(rotation);
    } else if ("LogB" == type) {
        rot = logBPotModel(rotation);
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
