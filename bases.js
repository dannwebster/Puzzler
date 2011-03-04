function Base(name, displayDiv, imageExt, radix, placeCount, displayElementIdPrefix, numericalElementId, hotKeyMappings) {
    this.parent = Code;
    this.parent(name, displayDiv, imageExt, 
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
                var e = document.getElementById(this.numerical);
                if (e) {
                    e.innerText = this.value;
                }
                for (var i = 0; i < this.placeCount; i++) {
                    var e = document.getElementById(this.prefix + Math.pow(this.radix, i));
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
            hotKeyMappings
    );
    this.radix = radix;
    this.places = new Array(placeCount);
    this.placeCount = placeCount; 
    this.prefix = displayElementIdPrefix;
    this.numerical = numericalElementId;
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

function Binary(displayDiv, displayElementIdPrefix, numericalElementId) {
    this.parent = Base;
    this.parent('binary', displayDiv, 'png', 2, 5, displayElementIdPrefix, numericalElementId, 
    {
        '1' : function() { this.bump(4); },
        '2' : function() { this.bump(3); },
        '3' : function() { this.bump(2); },
        '4' : function() { this.bump(1); },
        '5' : function() { this.bump(0); },
    });
}

function Ternary(displayDiv, displayElementIdPrefix, numericalElementId) {
    this.parent = Base;
    this.parent('ternary', displayDiv, 'png', 3, 3, displayElementIdPrefix, numericalElementId,
    {
        '1' : function() { this.bump(2); },
        '2' : function() { this.bump(1); },
        '3' : function() { this.bump(0); },
    });
}
