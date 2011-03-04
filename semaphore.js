function Semaphore() {
    this.parent = Code;
    this.parent('semaphore', 'png', 
        // **************
        // resetFunction
        // **************
        function() {
            this.flagA = 0;
            this.flagB = 0;
        }, 

        // **************
        // updateDisplayFunction
        // **************
        function() {
            var disable =  (this.flagA != 0 && this.flagB != 0);
            for (var i = 1; i <= 8 ; i++) {
                var a = document.getElementById(this.name + i);
                var active = (this.flagA == i || this.flagB == i);
                a.innerHTML = (active) ? this.flagChars[i] : '';
                a.disabled = (disable) ? !active : false;
            }
        }, 

        // **************
        // decodeFunction
        // **************
        function(letter) {
            var val = this.letterToFlags[letter];
            if (val) {
                var b = val % 10;
                var a = (val-b) / 10;
                this.flagA = a;
                this.flagB = b;
            } else {
                this.reset();
            }
        }, 

        // **************
        // getLetterFunction
        // **************
        function() {
            var flags = this.flags();

            if (this.flagA == 0 && this.flagB == 0) {
                return '';
            }
            var val = this.flagsToLetter[flags];
            if (val) {
                return val;
            } else {
                return this.decoder.UNKNOWN;
            }
        },

        // **************
        // drawFunction
        // **************
        function(div) {
            var content = '';
            content += '<div id="semaphore-div">';
            content += '<table>';
            content += '<tr>';
            content += '<td>&nbsp;</td>';
            content += '<td>&nbsp;</td>';
            content += '<td><button id="semaphore5" onclick="decoder.code(\'semaphore\')return decoder;.toggle(5)"></button></td>';
            content += '<td>&nbsp;</td>';
            content += '<td>&nbsp;</td>';
            content += '</tr>';
            content += '<tr>';
            content += '<td>&nbsp;</td>';
            content += '<td><button id="semaphore4" onclick="decoder.code(\'semaphore\').toggle(4)"></button></td>';
            content += '<td>&nbsp;</td>';
            content += '<td><button id="semaphore6" onclick="decoder.code(\'semaphore\').toggle(6)"></button></td>';
            content += '<td>&nbsp;</td>';
            content += '</tr>';
            content += '<tr>';
            content += '<td><button id="semaphore3" onclick="decoder.code(\'semaphore\').toggle(3)"></button></td>';
            content += '<td>&nbsp;</td>';
            content += '<td>&nbsp;</td>';
            content += '<td>&nbsp;</td>';
            content += '<td><button id="semaphore7" onclick="decoder.code(\'semaphore\').toggle(7)"></button></td>';
            content += '</tr>';
            content += '<tr>';
            content += '<td>&nbsp;</td>';
            content += '<td><button id="semaphore2" onclick="decoder.code(\'semaphore\').toggle(2)"></button></td>';
            content += '<td>&nbsp;</td>';
            content += '<td><button id="semaphore8" onclick="decoder.code(\'semaphore\').toggle(8)"></button></td>';
            content += '<td>&nbsp;</td>';
            content += '</tr>';
            content += '<tr>';
            content += '<td>&nbsp;</td>';
            content += '<td>&nbsp;</td>';
            content += '<td><button id="semaphore1" onclick="decoder.code(\'semaphore\').toggle(1)"></button></td>';
            content += '<td>&nbsp;</td>';
            content += '<td>&nbsp;</td>';
            content += '</tr>';
            content += '</table>';
            content += '</div>';

            div.innerHTML += content;
        },

        // hot key mappings
        {
            '2' : function() { this.toggle(1); }, 
            '1' : function() { this.toggle(2); }, 
            '4' : function() { this.toggle(3); }, 
            '7' : function() { this.toggle(4); }, 
            '8' : function() { this.toggle(5); }, 
            '9' : function() { this.toggle(6); }, 
            '6' : function() { this.toggle(7); }, 
            '3' : function() { this.toggle(8); }, 
        }
    );

    this.flagA = 0;
    this.flagB = 0;

    this.flagChars = { 
        1 : '|', 2 : '/', 3 : '-', 4 : '\\',
        5 : '|', 6 : '/', 7 : '-', 8 : '\\',
    };
    this.flags = function() {
        return 10 * this.flagA + this.flagB;
    }
    this.letterToFlags = {
        'A' : 12,
        'B' : 13,
        'C' : 14,
        'D' : 15,
        'E' : 16,
        'F' : 17,
        'G' : 18,
        'H' : 23,
        'I' : 24,
        'J' : 57,
        'K' : 25,
        'L' : 26,
        'M' : 27,
        'N' : 28,
        'O' : 34,
        'P' : 35,
        'Q' : 36,
        'R' : 37,
        'S' : 38,
        'T' : 45,
        'U' : 46,
        'V' : 57,
        'W' : 67,
        'X' : 68,
        'Y' : 47,
        'Z' : 78,
    };

    this.flagsToLetter = {};

    for (var letter in this.letterToFlags) {
        var flags = this.letterToFlags[letter];
        this.flagsToLetter[flags] = letter;
    }

    this.toggle = function(flag) {
        if (this.flagA == flag) {
            this.flagA = 0;
        } else if (this.flagB == flag) {
            this.flagB = 0;
        } else if (this.flagA == 0) {
            this.flagA = flag;
        } else if (this.flagB == 0) {
            this.flagB = flag;
        } else {
            this.flagA = flag;
        }

        if (this.flagA > this.flagB) {
            var tmp = this.flagA;
            this.flagA = this.flagB;
            this.flagB = tmp;
        }
        this.decoder.updateDisplay();
    }
}
