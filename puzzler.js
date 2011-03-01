var EMPTY = 0;
var UNKNOWN = -1;

String.prototype.replaceChar = function(pos, c) {
    var before = this.substring(0, pos);
    if (pos+1 == this.length) {
        var after = '';
    } else {
        var after = this.substring(pos+1, this.length);
    }
    var s = before + c + after;
    return s;
}

function Decoder(messageAreaId, characterAreaId, modeAreaId)  {
    this.mode = 'ADD';
    this.cursor = 1;
    this.message = "";
    this.currentValue = "";
    this.messageAreaId = messageAreaId;
    this.characterAreaId = characterAreaId;
    this.modeAreaId = modeAreaId;
    this.decodeFunction = '';

    this.backspace = function() {
        this.message = this.message.substring(0, this.message.length() - 2);
    }

    this.commit = function() {
        if (this.cursor > this.message.length) {
            this.message += this.currentValue;
        } else {
            this.message = this.message.replaceChar(this.cursor,this.currentValue[0]);
        }
        this.mode = 'ADD';
        this.cursor = this.message.length + 1;
        this.currentValue = '';
        this.updateDisplay();
    }

    this.update = function(letter) {
        if (letter == UNKNOWN) {
            this.currentValue = '?';
        } else if (letter == EMPTY) {
            this.currentValue = '';
        } else {
            this.currentValue = letter;
        }
        this.updateDisplay();
    }

    this.updateDisplay = function() {
        var mode = document.getElementById(this.modeAreaId); 
        var msg = document.getElementById(this.messageAreaId); 
        var cl = document.getElementById(this.characterAreaId); 
        msg.innerHTML = this.createMessage(this.message);
        cl.innerText = this.currentValue;
        mode.innerText = this.mode;
    }

    this.createMessage = function(message) {
        var m = '';
        for (var i = 0; i < message.length; i++) {
            if (i > 0) {
                m += ' ';
            }
            if (i == this.cursor) {
                m +=  '<span class="edit">' + message[i] + '</span>';
            } else {
                m +=  '<a href="#" onclick="decoder.edit('+i+')">' + message[i] + '</a>';
            }
        }
        return m;
    }

    this.edit = function(index) {
        var letter = this.message[index];
        this.cursor = index;
        this.mode = 'EDIT';
        this.decodeFunction(letter);
    }

    this.unedit = function() {
        this.cursor = this.message.length + 1;
        this.mode = 'ADD';
    }

    this.backspace = function() {
        this.unedit();
        this.message = this.message.substring(0, this.message.length-1);
        this.commit();
    }

    this.clear = function() {
        this.mode = 'ADD';
        this.cursor = 1;
        this.message = "";
        this.currentValue = "";
        this.updateDisplay();
    }
}

function Binary(decoder, displayElementIdPrefix, numericalElementId) {
    this.prefix = displayElementIdPrefix;
    this.numerical = numericalElementId;
    this.decoder = decoder;
    this.places = [0, 0, 0, 0, 0];
    this.value = 0;
    this.letter = '';

    this.update = function(index) {
        this.places[index] = (this.places[index] == 0) ? 1 : 0;
        this.calculate();
        this.updateDisplay();
    }

    this.decode = function(letter) {
        if (letter >= 'A' && letter <= 'Z') {
            this.letter = letter;
            this.value = letter.charCodeAt(0) - 64;
            var v = this.value;
            for (var i = 4; i >= 0; i--) {
                var radix = Math.pow(2, i);
                var place = Math.floor(v / radix);
                this.places[i] = place;
                v =  v % radix;
            }
        } else {
            this.resetPlaces();
        }
        this.calculate();
        this.updateDisplay();
    }

    this.calculate = function() {
        var temp = 0;
        for (var i = 0; i < 5; i++) {
            temp += this.places[i] * Math.pow(2, i);
        }
        this.value = temp;
        if (this.value == 0) {
            this.letter = EMPTY;
        } else if (this.value > 0 && this.value <= 26) {
            this.letter = String.fromCharCode(64 + this.value);
        } else {
            this.letter = UNKNOWN;
        }
    }

    this.resetPlaces = function() { 
        for (var i = 0; i < 5; i++) {
            this.places[i] = 0;
        }
    }

    this.reset = function() { 
        this.resetPlaces();
        this.calculate();
        this.updateDisplay();
    }

    this.commit = function() { 
        this.decoder.commit();
        this.reset()
    }

    this.backspace = function() {
        this.reset();
        this.decoder.backspace();
    }

    this.updateDisplay = function() {
        var e = document.getElementById(this.numerical);
        if (e) {
            e.innerText = this.value;
        }
        for (var i = 0; i < 5; i++) {
            var e = document.getElementById(this.prefix + Math.pow(2, i));
            e.innerText = this.places[i];
        }
        this.decoder.update(this.letter);
    }

    this.clear = function() {
        this.reset();
        this.decoder.clear();
    }
}
