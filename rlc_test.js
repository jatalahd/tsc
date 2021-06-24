/*
 * rlc_test.js: unit tests for rlc.js parsing objects
 */

/* Tests: values without units */
tscValue.test("1k5 ");              // Trailing space
tscValue.test(" 1K5");              // Leading space
tscValue.test("1");                 // Integer w/o multiplier
tscValue.test("0.1");               // Float w/o multiplier
tscValue.test("1.");                // Float w/o fractional w/o multiplier
tscValue.test("1.p");               // Float w/o fractional w/ multiplier
tscValue.test(".1");                // Float w/o whole w/o multiplier
tscValue.test(".1p");               // Float w/o whole w/ multiplier
tscValue.test(".", false);          // Decimal point w/o multiplier
tscValue.test(".p", false);         // Decimal point w/ multiplier
tscValue.test("1p");                // Integer pico
tscValue.test("1.5P");              // Float pico
tscValue.test("1P5");               // RKM mid pico
tscValue.test("p5");                // RKM leading pico
tscValue.test("1n");                // Integer nano
tscValue.test("1.5N");              // Float nano
tscValue.test("1N5");               // RKM mid nano
tscValue.test("n5");                // RKM leading nano
tscValue.test("1u");                // Integer micro (u)
tscValue.test("1\u00b5");           // Integer micro (micro symbol)
tscValue.test("1\u03bc");           // Integer micro (mu)
tscValue.test("1.5U");              // Float micro (u)
tscValue.test("1.5\u00b5");         // Float micro (micro symbol)
tscValue.test("1.5\u03bc");         // Float micro (mu)
tscValue.test("1U5");               // RKM mid micro (u)
tscValue.test("1\u00b55");          // RKM mid micro (micro symbol)
tscValue.test("1\u03bc5");          // RKM mid micro (mu)
tscValue.test("u5");                // RKM leading micro (u)
tscValue.test("\u00b55");           // RKM leading micro (micro symbol)
tscValue.test("\u03bc5");           // RKM leading micro (mu)
tscValue.test("1m");                // Integer milli
tscValue.test("1.5m");              // Float milli
tscValue.test("1m5");               // RKM mid milli
tscValue.test("m5");                // RKM leading milli
tscValue.test("1k");                // Integer kilo
tscValue.test("1.5K");              // Float kilo
tscValue.test("1K5");               // RKM mid kilo
tscValue.test("k5");                // RKM leading kilo
tscValue.test("1M");                // Integer mega
tscValue.test("1.5M");              // Float mega
tscValue.test("1M5");               // RKM mid mega
tscValue.test("M5");                // RKM leading mega
tscValue.test("1g");                // Integer giga
tscValue.test("1.5G");              // Float giga
tscValue.test("1G5");               // RKM mid giga
tscValue.test("g5");                // RKM leading giga
tscValue.test("1t");                // Integer tera
tscValue.test("1.5T");              // Float tera
tscValue.test("1T5");               // RKM mid tera
tscValue.test("t5");                // RKM leading tera

/* Tests: resistors */
tscResistance.test("1k5 ohms");       // Unit w/o multiplier (ohms)
tscResistance.test("1k5 Ohm");        // Unit w/o multiplier (Ohm)
tscResistance.test("1");              // Integer w/o multiplier
tscResistance.test("1.");             // Float w/o multiplier
tscResistance.test("0.1");            // Float w/o multiplier
tscResistance.test(".1");             // Float w/o multiplier
tscResistance.test(".", false);       // Float w/o multiplier
tscResistance.test("R1");             // RKM leading R
tscResistance.test("1R");             // RKM trailing R
tscResistance.test("1R1");            // RKM mid R
tscResistance.test("1m");             // Integer milli as mega
tscResistance.test("1.5m");           // Float milli as mega
tscResistance.test("1m5");            // RKM mid milli as mega
tscResistance.test("m5");             // RKM leading milli as mega
tscResistance.test("1k");             // Integer kilo
tscResistance.test("1.5K");           // Float kilo
tscResistance.test("1K5");            // RKM mid kilo
tscResistance.test("k5");             // RKM leading kilo
tscResistance.test("1M");             // Integer mega (M)
tscResistance.test("1meg");           // Integer mega (meg)
tscResistance.test("1.5M");           // Float mega (M)
tscResistance.test("1.5Meg");         // Float mega (Meg)
tscResistance.test("1M5");            // RKM mid mega
tscResistance.test("M5");             // RKM leading mega
tscResistance.test("1g");             // Integer giga
tscResistance.test("1.5G");           // Float giga
tscResistance.test("1G5");            // RKM mid giga
tscResistance.test("g5");             // RKM leading giga

/* Tests: capacitors */
tscCapacitance.test("1.5 farad");     // Unit w/o multiplier (farad)
tscCapacitance.test("1.5 Farads");    // Unit w/o multiplier (Farads)
tscCapacitance.test("1.5 F");         // Unit w/o multiplier (F)
tscCapacitance.test("1F");            // Integer w/o multiplier as x1
tscCapacitance.test("1.F");           // Float w/o multiplier as x1
tscCapacitance.test("0.1F");          // Float w/o multiplier as x1
tscCapacitance.test(".1F");           // Float w/o multiplier as x1
tscCapacitance.test(".F", false);     // Float w/o multiplier as x1
tscCapacitance.test("1F5");           // RKM mid x1
tscCapacitance.test("f5");            // RKM leading x1
tscCapacitance.test("1");             // Integer w/o multiplier as pico
tscCapacitance.test("1.");            // Float w/o multiplier as pico
tscCapacitance.test("0.1");           // Float w/o multiplier as pico
tscCapacitance.test(".1");            // Float w/o multiplier as pico
tscCapacitance.test(".", false);      // Float w/o multiplier as pico
tscCapacitance.test("1p");            // Integer pico
tscCapacitance.test("1pF");           // Integer pico
tscCapacitance.test("1.5P");          // Float pico
tscCapacitance.test("1.5PF");         // Float pico
tscCapacitance.test("1P5");           // RKM mid pico
tscCapacitance.test("p5");            // RKM leading pico
tscCapacitance.test("1n");            // Integer nano
tscCapacitance.test("1nF");           // Integer nano
tscCapacitance.test("1.5N");          // Float nano
tscCapacitance.test("1.5NF");         // Float nano
tscCapacitance.test("1N5");           // RKM mid nano
tscCapacitance.test("n5");            // RKM leading nano
tscCapacitance.test("1u");            // Integer micro (u)
tscCapacitance.test("1uF");           // Integer micro (u)
tscCapacitance.test("1\u00b5");       // Integer micro (micro symbol)
tscCapacitance.test("1\u00b5F");      // Integer micro (micro symbol)
tscCapacitance.test("1\u03bc");       // Integer micro (mu)
tscCapacitance.test("1\u03bcF");      // Integer micro (mu)
tscCapacitance.test("1.5U");          // Float micro (u)
tscCapacitance.test("1.5UF");         // Float micro (u)
tscCapacitance.test("1.5\u00b5");     // Float micro (micro symbol)
tscCapacitance.test("1.5\u00b5F");    // Float micro (micro symbol)
tscCapacitance.test("1.5\u03bc");     // Float micro (mu)
tscCapacitance.test("1.5\u03bcF");    // Float micro (mu)
tscCapacitance.test("1U5");           // RKM mid micro (u)
tscCapacitance.test("1\u00b55");      // RKM mid micro (micro symbol)
tscCapacitance.test("1\u03bc5");      // RKM mid micro (mu)
tscCapacitance.test("u5");            // RKM leading micro (u)
tscCapacitance.test("\u00b55");       // RKM leading micro (micro symbol)
tscCapacitance.test("\u03bc5");       // RKM leading micro (mu)
tscCapacitance.test("1m");            // Integer milli
tscCapacitance.test("1mF");           // Integer milli
tscCapacitance.test("1.5m");          // Float milli
tscCapacitance.test("1.5mF");         // Float milli
tscCapacitance.test("1m5");           // RKM mid milli
tscCapacitance.test("m5");            // RKM leading milli
tscCapacitance.test("1M");            // Integer mega as milli
tscCapacitance.test("1MF");           // Integer mega as milli
tscCapacitance.test("1.5M");          // Float mega as milli
tscCapacitance.test("1.5MF");         // Float mega as milli
tscCapacitance.test("1M5");           // RKM mid mega as milli
tscCapacitance.test("M5");            // RKM leading mega as milli

/* Tests: inductors */
tscInductance.test("1.5 Henries");    // Unit w/o multiplier (Henries)
tscInductance.test("1.5 henry");      // Unit w/o multiplier (henry)
tscInductance.test("1.5 H");          // Unit w/o multiplier (H)
tscInductance.test("1H");             // Integer w/o multiplier as x1
tscInductance.test("1.H");            // Float w/o multiplier as x1
tscInductance.test("0.1H");           // Float w/o multiplier as x1
tscInductance.test(".1H");            // Float w/o multiplier as x1
tscInductance.test(".H", false);      // Float w/o multiplier as x1
tscInductance.test("1H5");            // RKM mid x1
tscInductance.test("h5");             // RKM leading x1
tscInductance.test("1");              // Integer w/o multiplier as milli
tscInductance.test("1.");             // Float w/o multiplier as milli
tscInductance.test("0.1");            // Float w/o multiplier as milli
tscInductance.test(".1");             // Float w/o multiplier as milli
tscInductance.test(".", false);       // Float w/o multiplier as milli
tscInductance.test("1u");             // Integer micro (u)
tscInductance.test("1uH");            // Integer micro (u)
tscInductance.test("1\u00b5");        // Integer micro (micro symbol)
tscInductance.test("1\u00b5H");       // Integer micro (micro symbol)
tscInductance.test("1\u03bc");        // Integer micro (mu)
tscInductance.test("1\u03bcH");       // Integer micro (mu)
tscInductance.test("1.5U");           // Float micro (u)
tscInductance.test("1.5UH");          // Float micro (u)
tscInductance.test("1.5\u00b5");      // Float micro (micro symbol)
tscInductance.test("1.5\u00b5H");     // Float micro (micro symbol)
tscInductance.test("1.5\u03bc");      // Float micro (mu)
tscInductance.test("1.5\u03bcH");     // Float micro (mu)
tscInductance.test("1U5");            // RKM mid micro (u)
tscInductance.test("1\u00b55");       // RKM mid micro (micro symbol)
tscInductance.test("1\u03bc5");       // RKM mid micro (mu)
tscInductance.test("u5");             // RKM leading micro (u)
tscInductance.test("\u00b55");        // RKM leading micro (micro symbol)
tscInductance.test("\u03bc5");        // RKM leading micro (mu)
tscInductance.test("1m");             // Integer milli
tscInductance.test("1mH");            // Integer milli
tscInductance.test("1.5m");           // Float milli
tscInductance.test("1.5mH");          // Float milli
tscInductance.test("1m5");            // RKM mid milli
tscInductance.test("m5");             // RKM leading milli
tscInductance.test("1M");             // Integer mega as milli
tscInductance.test("1MH");            // Integer mega as milli
tscInductance.test("1.5M");           // Float mega as milli
tscInductance.test("1.5MH");          // Float mega as milli
tscInductance.test("1M5");            // RKM mid mega as milli
tscInductance.test("M5");             // RKM leading mega as milli
