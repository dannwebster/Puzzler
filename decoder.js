
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

String.prototype.capFirst = function() {
    if (this == '' ) return this;
    var first = this.substring(0, 1);
    var rest = this.substring(1, this.length);
    first = first.toUpperCase();
    return first+rest;
}

function Decoder(messageAreaId, characterAreaId, modeAreaId)  {

    this.EMPTY = '';
    this.UNKNOWN = '?';
    this.mode = 'ADD';
    this.cursor = 1;
    this.message = "";
    this.codes = [];
    this.currentCode = '';

    this.messageAreaId = 'message';
    this.characterAreaId = 'current-letter';
    this.modeAreaId = 'mode-area';

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

    this.draw = function(targetDivName) {
        var rootDiv = document.getElementById(targetDivName);
        var content = '';
        content += '<div id="message-div">Message: "<span id="message"></span>"</div>';
        content += '<div id="current-letter-div">Current Letter (<span id="mode-area">ADD</span>): "<span id="current-letter"></span>"</div>';
        content += '<ul id="selection-tabs">';
        for (codeName in this.codes) {
            content += '<li><a href="#' + codeName + '" id="' + codeName + '-tab" class="tab" onclick="decoder.setCode(\'' + codeName + '\')">' + codeName.capFirst() + '</a></li>';
        }
        content += '</ul>'; // selection tabs
        content += '<div id="codes-div"></div>';
        content += '<div id="controls" >';
        content += '<button id="reset"  value="Reset" onclick="decoder.reset()">Reset</button>';
        content += '<button id="commit"  value="Commit" onclick="decoder.commit()">Commit</button>';
        content += '<button id="backspace"  value="Backspace" onclick="decoder.backspace()">Backspace</button>';
        content += '<button id="space"  value="Space" onclick="decoder.space()">Space</button>';
        content += '<button id="clear"  value="Clear" onclick="decoder.clear()">Clear Message</button>';
        content += '</div>';

        rootDiv.innerHTML = content;

        var codesDiv = document.getElementById('codes-div');

        for (codeName in this.codes) {
            var code = this.codes[codeName];
            code.draw(codesDiv);
        }

        this.updateDisplay();
       
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
                var c = message[i];
                c = (c == ' ') ? '_' : c;
                m +=  '<a href="#" onclick="decoder.edit('+i+')">' + c + '</a>';
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

    this.space = function() {
        this.message = this.message + ' ';
        this.commit();
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

    this.hotKeyHandler = function(e) {
        var evnt = window.event; 
        var keyCode = evnt.keyCode;
        if (32 == keyCode) {
            this.space();
        } else if (46 == keyCode) {
            this.backspace();
        } else if (13 == keyCode) {
            this.commit();
        } else if (this.code().hotKeyMappings) {
            var code = String.fromCharCode(keyCode);
            //alert("keyCode: " + keyCode + " , code: " + code);
            var func = this.code().hotKeyMappings[code];
            if (func) {
                func();
            }
        }
    };

    // enable hotkeys
    if (!document.all) {
        window.captureEvents(Event.KEYPRESS);
        window.onkeypress = function(e) {this.hotKeyHandler(e); }.bind(this);
    } else {
        document.onkeypress = function(e) {this.hotKeyHandler(e); }.bind(this);
    }
}

function Code(name, imageExt, resetFunction, updateDisplayFunction, decodeFunction, getLetterFunction, drawFunction, hotKeyMappings) {
    this.name = name;
    this.imageExt = imageExt;
    this.displayDiv = name + '-div';

    this.getImage = function(letter, ext) {
        return  './images/' + this.name + '/' + letter + "." + this.imageExt;
    };

    this.reset = resetFunction; // no parameters; reset the interior state 
    this.updateDisplay = updateDisplayFunction; // no parameters; update the html page to represent the interior state 
    this.decode = decodeFunction; // accepts one parameter; update the interior state to represent the code value of 'letter' 
    this.getLetter = getLetterFunction; // no parameters;  returns the value represented by the decoder at this time
    this.draw = drawFunction; // one parameter: the div to insert this into; draw the visible UI for the code
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

    // a map of keys to the functions they bind to
    this.hotKeyMappings = hotKeyMappings;

    for (key in this.hotKeyMappings) {
        this.hotKeyMappings[key] = this.hotKeyMappings[key].bind(this);
    }

}

function DecoderFactory(divId) {
    decoder = new Decoder();
    var binary = new Binary();
    var ternary = new Ternary();
    var morse = new Morse();
    var braille = new Braille();
    var semaphore = new Semaphore();

    decoder.addCode(binary);
    decoder.addCode(ternary);
    decoder.addCode(morse);
    decoder.addCode(braille);
    decoder.addCode(semaphore);
    decoder.draw(divId);
    document.decoder = decoder;
}
