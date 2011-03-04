function Morse() {
    this.parent = Code;
    this.parent('morse', 'png', 
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
                var div = document.getElementById('current-morse-val');
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
            // ******************
            // drawFunction
            // ******************
            function(div) {
                var content = '';
                content += '<div id="morse-div">';
                content += 'Current Morse Value: "<span id="current-morse-val"></span>"';
                content += '<table>';
                content += '<thead>';
                content += '<tr>';
                content += '<th>Dot</th>';
                content += '<th>Dash</th>';
                content += '<th>Back</th>';
                content += '</tr>';
                content += '</thead>';
                content += '</tbody>';
                content += '<tr>';
                content += '<td><button id="morse-dot" onclick="decoder.code(\'morse\').dot()">.</button></td>';
                content += '<td><button id="morse-dash" onclick="decoder.code(\'morse\').dash()">-</button></td>';
                content += '<td><button id="morse-back" onclick="decoder.code(\'morse\').back()">&lt;</button></td>';
                content += '</tr>';
                content += '</tbody>';
                content += '</table>';
                content += '</div>';
                div.innerHTML += content;
            },

            // hot key mappings
            {
                '*' : function() { this.dot(); },
                '-' : function() { this.dash(); },
                '0' : function() { this.back(); },
            }
    );

    this.buffer = '';
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
