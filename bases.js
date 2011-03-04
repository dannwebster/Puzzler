function Base(name, imageExt, radix, placeCount, hotKeyMappings) {
    this.parent = Code;
    this.parent(name, imageExt, 
            // **************
            // resetFunction
            // **************
            function() { 
                this.resetPlaces();
                this.calculate();
            },
            
            // **************
            // updateDisplayFunction
            // **************
            function() {
                var e = document.getElementById('current-'+this.name+'-val');
                if (e) {
                    e.innerText = this.value;
                }
                for (var i = 0; i < this.placeCount; i++) {
                    var e = document.getElementById(this.name + Math.pow(this.radix, i));
                    e.innerText = this.places[i];
                }
            },

            // **************
            // decodeFunction
            // **************
            function(letter) {
                if (letter >= 'A' && letter <= 'Z') {
                    this.value = letter.charCodeAt(0) - 64;
                    var v = this.value;
                    for (var i = (this.placeCount - 1); i >= 0; i--) {
                        var place = Math.pow(this.radix, i);
                        var value = Math.floor(v / place);
                        this.places[i] = value;
                        v =  v % place;
                    }
                } else {
                    this.resetPlaces();
                }
                this.calculate();
                this.decoder.updateDisplay();
            },
           
            // **************
            // getLetterFunction
            // **************
            function() {
                if (this.value == 0) {
                    return decoder.EMPTY;
                } else if (this.value > 0 && this.value <= 26) {
                    return String.fromCharCode(64 + this.value);
                } else {
                    return decoder.UNKNOWN;
                }
            },

            // **************
            // drawFunction
            // **************
            function(div) {
                var content = '';
                content += '<div id="' + this.name + '-div">';
                content += 'Current ' + this.name.capFirst() + ' Value: <span id="current-' + this.name + '-val">0</span>';
                content += '<table>';
                content += '<thead>';
                content += '<tr>';
                for (var i = this.placeCount - 1; i >= 0; i--) {
                    var place = Math.pow(this.radix, i);
                    content += '<th>' + place + '</th>';
                }
                content += '</tr>';
                content += '</thead>';
                content += '</tbody>';
                content += '<tr>';
                for (var i = this.placeCount - 1; i >= 0; i--) {
                    var place = Math.pow(this.radix, i);
                    content += '<td> <button id="' + this.name + place + '" value="0" onclick="decoder.code(\'' + this.name + '\').bump(' + i + ')">0</button> </td>';
                }
                content += '</tr>';
                content += '</tbody>';
                content += '</table>';
                content += '</div>';

                div.innerHTML += content;
            },
            hotKeyMappings
    );
    this.radix = radix;
    this.places = new Array(placeCount);
    this.placeCount = placeCount; 
    this.value = 0;

    for (var i = 0; i < this.placeCount; i++) {
        this.places[i] = 0;
    }

    this.bump = function(index) {
        var val = (this.places[index] + 1) % this.radix;
        this.set(index, val);
    };

    this.set = function(index, value) {
        this.places[index] = value;
        this.calculate();
        this.decoder.updateDisplay();
    };

    // PRIVATE
    this.calculate = function() {
        var temp = 0;
        for (var i = 0; i < this.placeCount; i++) {
            temp += this.places[i] * Math.pow(this.radix, i);
        }
        this.value = temp;
    };

    // PRIVATE 
    this.resetPlaces = function() { 
        for (var i = 0; i < this.placeCount; i++) {
            this.places[i] = 0;
        }
    };
}

function Binary() {
    this.parent = Base;
    this.parent('binary', 'png', 2, 5, 
    {
        '1' : function() { this.bump(4); },
        '2' : function() { this.bump(3); },
        '3' : function() { this.bump(2); },
        '4' : function() { this.bump(1); },
        '5' : function() { this.bump(0); },
    });
}

function Ternary() {
    this.parent = Base;
    this.parent('ternary', 'png', 3, 3, 
    {
        '1' : function() { this.bump(2); },
        '2' : function() { this.bump(1); },
        '3' : function() { this.bump(0); },
    });
}
