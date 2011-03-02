function Braille(displayDiv, pipElementIdPrefix) {
    this.OFF = ".";
    this.ON = "0";
    this.EMPTY = "......";


    this.parent = Code;
    this.parent('braille', displayDiv, 'png', 
        // ***********
        // resetFunction, 
        // ***********
        function() {
            this.pips = new String(this.EMPTY);
        },

        // ***********
        // updateDisplayFunction, 
        // ***********
        function() {
            for (var i = 0; i < this.pips.length; i++) {
                // convert from 0-indexed to 1 indexed
                var id = this.pipElementIdPrefix + (i+1);
                var pip = document.getElementById(id);
                var val = this.pips[i];
                pip.innerHTML = val;
            }
        },

        // ***********
        // decodeFunction, 
        // ***********
        function(letter) {
            this.pips = this.letterToPips[letter];
        },

        // ***********
        // getLetterFunction
        // ***********
        function() {
            if (this.pips == this.EMPTY) {
                return '';
            } 
            var val =  this.pipsToLetter[this.pips];
            if (val) {
                return val;
            } else {
                return this.decoder.UNKNOWN;
            }
        }
    );

    this.pips = new String(this.EMPTY);
    this.pipElementIdPrefix = pipElementIdPrefix;

    this.toggle = function(index) {
        index--; // from 1 indexed to 0 indexed;
        var val = (this.pips[index] == this.ON) ? this.OFF : this.ON;
        this.pips = this.pips.replaceChar(index, val);
        this.decoder.updateDisplay();
    }

    this.letterToPips = {

        'A' : '0.' +
              '..' +
              '..',

        'B' : '0.' +
              '0.' +
              '..',
        
        'C' : '00' +
              '..' +
              '..',
        
        'D' : '00' +
              '.0' +
              '..',
        
        'E' : '0.' +
              '.0' +
              '..',
        
        'F' : '00' +
              '0.' +
              '..',
        
        'G' : '00' +
              '00' +
              '..',
        
        'H' : '0.' +
              '00' +
              '..',
        
        'I' : '.0' +
              '0.' +
              '..',
        
        'J' : '.0' +
              '00' +
              '..',
        
        'K' : '0.' +
              '..' +
              '0.',
        
        'L' : '0.' +
              '0.' +
              '0.',
        
        'M' : '00' +
              '..' +
              '0.',
        
        'N' : '00' +
              '.0' +
              '0.',
        
        'O' : '0.' +
              '.0' +
              '0.',
        
        'P' : '00' +
              '0.' +
              '0.',
        
        'Q' : '00' +
              '00' +
              '0.',
        
        'R' : '0.' +
              '00' +
              '0.',
        
        'S' : '.0' +
              '0.' +
              '0.',
        
        'T' : '.0' +
              '00' +
              '0.',
        
        'U' : '0.' +
              '..' +
              '00',
        
        'V' : '0.' +
              '0.' +
              '00',
        
        'W' : '.0' +
              '00' +
              '.0',
        
        'X' : '00' +
              '..' +
              '00',
        
        'Y' : '00' +
              '.0' +
              '00',
        
        'Z' : '0.' +
              '.0' +
              '00',
    };
    this.pipsToLetter = {};

    for (var letter in this.letterToPips) {
        var pips = this.letterToPips[letter];
        this.pipsToLetter[pips] = letter;
    }

}
