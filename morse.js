function Morse(displayDiv, bufferDisplayDiv) {
    this.parent = Code;
    this.parent('morse', displayDiv, 'png', 
            // ******************
            // resetFunciton
            // ******************
            function() {
                this.buffer = '';
            },
            
            // ******************
            // updateDisplayFunction
            // ******************
            function() {
                var div = document.getElementById(this.bufferDisplayDiv);
                div.innerHTML = this.buffer;
            },

            // ******************
            // decodeFunction
            // ******************
            function(letter) {
                var val = this.letterToMorse[letter];
                if (val) {
                    this.buffer = val;
                } else {
                    this.buffer = '';
                }
            },
            
            // ******************
            // getLetterFunciton
            // ******************
            function() {
                if (this.buffer == '') {
                    return decoder.EMPTY;
                }
                var val = this.morseToLetter[this.buffer];
                return (val) ? val : decoder.UNKNOWN;
            },
            // hot key mappings
            {
                '*' : function() { this.dot(); },
                '-' : function() { this.dash(); },
                '0' : function() { this.back(); },
            }
    );

    this.buffer = '';
    this.bufferDisplayDiv = bufferDisplayDiv;
    this.dot = function() {
        this.buffer += '.';
        this.decoder.updateDisplay();
    }
    this.dash = function() {
        this.buffer += '-';
        this.decoder.updateDisplay();
    }
    this.back = function() {
        this.buffer = this.buffer.substr(0, this.buffer.length - 1);
        this.decoder.updateDisplay();
    }
    this.letterToMorse = {
        'A' : '.-',
        'B' : '-...',
        'C' : '-.-.',
        'D' : '-..',
        'E' : '.',
        'F' : '..-.',
        'G' : '--.',
        'H' : '....',
        'I' : '..',
        'J' : '.---',
        'K' : '-.-',
        'L' : '.-..',
        'M' : '--',
        'N' : '-.',
        'O' : '---',
        'P' : '.--.',
        'Q' : '--.-',
        'R' : '.-.',
        'S' : '...',
        'T' : '-',
        'U' : '..-',
        'V' : '...-',
        'W' : '.--',
        'X' : '-..-',
        'Y' : '-.--',
        'Z' : '--..',
    };
    this.morseToLetter = {
    };

    for (var letter in this.letterToMorse) {
        var morse = this.letterToMorse[letter];
        this.morseToLetter[morse] = letter;
    }
}
