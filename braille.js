function Braille() {
    this.OFF = ".";
    this.ON = "0";
    this.EMPTY = "......";
// This is my change.

    this.parent = Code;
    this.parent('braille', 'png', 
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
                var id = this.name + (i+1);
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
        },
        // ***********
        // drawFunction
        // ***********
        function(div) {
            var content = '';
            content += '<div id="braille-div">';
            content += '<table>';
            content += '<thead>';
            content += '</thead>';
            content += '</tbody>';
            content += '<tr>';
            content += '<td><button id="braille1" onclick="decoder.code(\'braille\').toggle(1)">.</button></td>';
            content += '<td><button id="braille2" onclick="decoder.code(\'braille\').toggle(2)">.</button></td>';
            content += '</tr>';
            content += '<tr>';
            content += '<td><button id="braille3" onclick="decoder.code(\'braille\').toggle(3)">.</button></td>';
            content += '<td><button id="braille4" onclick="decoder.code(\'braille\').toggle(4)">.</button></td>';
            content += '</tr>';
            content += '<tr>';
            content += '<td><button id="braille5" onclick="decoder.code(\'braille\').toggle(5)">.</button></td>';
            content += '<td><button id="braille6" onclick="decoder.code(\'braille\').toggle(6)">.</button></td>';
            content += '</tr>';
            content += '</tbody>';
            content += '</table>';
            content += '</div>';

            div.innerHTML += content;
        },

        // hot key mappings
        {
            '7' : function() { this.toggle(1); },
            '8' : function() { this.toggle(2); },
            '4' : function() { this.toggle(3); },
            '5' : function() { this.toggle(4); },
            '1' : function() { this.toggle(5); },
            '2' : function() { this.toggle(6); },
        }
    );

    this.pips = new String(this.EMPTY);

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
