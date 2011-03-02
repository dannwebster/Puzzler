
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

    this.EMPTY = '';
    this.UNKNOWN = '?';
    this.mode = 'ADD';
    this.cursor = 1;
    this.message = "";
    this.messageAreaId = messageAreaId;
    this.characterAreaId = characterAreaId;
    this.modeAreaId = modeAreaId;
    this.codes = [];
    this.currentCode = '';

    this.backspace = function() {
        this.message = this.message.substring(0, this.message.length() - 2);
    };

    this.commit = function() {
        var val = this.code().getLetter();
        if (val) {
            if (this.cursor > this.message.length) {
                this.message += val;
            } else {
                this.message = this.message.replaceChar(this.cursor,val[0]);
            }
        }
        this.mode = 'ADD';
        this.cursor = this.message.length + 1;
        this.code().reset();
        this.updateDisplay();
    };

    this.code = function(name) {
        if (name) {
            return this.codes[name];
        } else {
            return this.codes[this.currentCode]
        }
    };

    this.updateDisplay = function() {
        var mode = document.getElementById(this.modeAreaId); 
        var msg = document.getElementById(this.messageAreaId); 
        var cl = document.getElementById(this.characterAreaId); 
        msg.innerHTML = this.createMessage(this.message);
        cl.innerText = this.code().getLetter();
        mode.innerText = this.mode;
        for (codeName in this.codes) {
            var code = this.codes[codeName];
            code.updateDisplay();
            if (code.name == this.currentCode) {
                code.show();
            } else {
                code.hide();
            }
        }
    };

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
    };

    this.edit = function(index) {
        var letter = this.message[index];
        this.cursor = index;
        this.mode = 'EDIT';
        this.code().decode(letter);
        this.updateDisplay();
    };

    this.unedit = function() {
        this.cursor = this.message.length + 1;
        this.mode = 'ADD';
    };

    this.backspace = function() {
        this.unedit();
        this.message = this.message.substring(0, this.message.length-1);
        this.code().reset();
        this.commit();
    };

    this.clear = function() {
        if (!confirm("Are you sure you want to delete the message?")) {
            return;
        }
        this.mode = 'ADD';
        this.cursor = 1;
        this.message = "";
        this.currentValue = "";
        this.code().reset();
        this.updateDisplay();
    };

    this.reset = function() {
        this.code().reset();
    };

    this.addCode = function(code) {
        var name = code.name;
        code.decoder = this;
        this.codes[name] = code;
        this.currentCode = name;
    };

    this.setCode = function(name) {
        this.currentCode = name;
        this.updateDisplay();
    };
}

function Code(name, displayDiv, imageExt, resetFunction, updateDisplayFunction, decodeFunction, getLetterFunction) {
    this.name = name;
    this.imageExt = imageExt;
    this.displayDiv = displayDiv;

    this.getImage = function(letter, ext) {
        return  './images/' + this.name + '/' + letter + "." + this.imageExt;
    };

    this.reset = resetFunction; // no parameters; reset the interior state 
    this.updateDisplay = updateDisplayFunction; // no parameters; update the html page to represent the interior state 
    this.decode = decodeFunction; // accepts one parameter; update the interior state to represent the code value of 'letter' 
    this.getLetter = getLetterFunction; // no parameters;  returns the value represented by the decoder at this time
    this.decoder = '';

    this.setVisible = function(visible) {
        var div = document.getElementById(this.displayDiv);
        if (div) {
            div.style.display = (visible) ? 'block' : 'none';
        }
    }

    this.toggle = function() {
        var div = document.getElementById(this.displayDiv);
        var isVisible = (div.style.display != 'none');
        this.setVisible(!isVisible);
    }

    this.hide = function() {
        this.setVisible(false);
    }

    this.show = function() {
        this.setVisible(true);
    }

}
