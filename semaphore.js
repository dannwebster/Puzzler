
//function Code(name, displayDiv, imageExt, resetFunction, updateDisplayFunction, decodeFunction, getLetterFunction) {
function Semaphore(displayDiv, flagElementIdPrefix) {
    this.EMPTY = 000;
    this.parent = Code;
    this.code('semaphore', displayDiv, 'png', 
        // **************
        // resetFunction
        // **************
        function() {
            this.flags = this.EMPTY;
        }, 

        // **************
        // updateDisplayFunction
        // **************
        function() {
        }, 

        // **************
        // decodeFunction
        // **************
        function(letter) {
            var val = this.letterToFlags[letter];
            if (val) {
                this.flags = val;
            } else {
                this.flags = this.EMPTY;
            }
        }, 

        // **************
        // getLetterFunction
        // **************
        function() {
            if (this.flags == this.EMPTY) {
                return '';
            }
            var val = this.flagsToLetter[this.flags];
            if (val) {
                return val;
            } else {
                return this.decoder.UNKNOWN;
            }
        }
    );

    this.flagElementidPrefix = flagElementidPrefix;

    this.letterToFlags = {
        'A' : 001,
        'B' : 002,
        'C' : 003,
        'D' : 004,
        'E' : 005,
        'F' : 006,
        'G' : 007,
        'H' : 012,
        'I' : 013,
        'J' : 046,
        'K' : 014,
        'L' : 015,
        'M' : 016,
        'N' : 017,
        'O' : 023,
        'P' : 024,
        'Q' : 025,
        'R' : 026,
        'S' : 027,
        'T' : 034,
        'U' : 035,
        'V' : 046,
        'W' : 056,
        'X' : 057,
        'Y' : 036,
        'Z' : 067,
    };

    this.flagsToLetter = {};

    for (var letter in this.letterToFlags) {
        var flags = this.letterToPips[letter];
        this.flagsToLetter[flags] = letter;
    }
}
