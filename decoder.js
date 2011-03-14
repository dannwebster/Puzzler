
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
    this.message = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    this.letterCodes = [];
    this.codes = {};
    this.searches = {};
    this.currentCode = '';
    this.currentSearch = '';

    this.l1Tabs = ['codes', 'searches'];
    this.currentTab = 'codes';

    this.messageAreaId = 'message';
    this.characterAreaId = 'current-letter';
    this.characterImageId = 'current-letter-img';
    this.editorTextAreaId = 'editor-text-area';
    this.modeAreaId = 'mode-area';

    this.commit = function() {
        var val = this.code().getLetter();
        if (val) {
            if (this.cursor > this.message.length) {
                this.message += val;
                this.letterCodes[this.letterCodes.length] = this.code().name;
            } else {
                this.message = this.message.replaceChar(this.cursor,val[0]);
                this.letterCodes[this.cursor] = this.code().name;
            }
        }
        this.mode = 'ADD';
        this.cursor = this.message.length + 1;
        this.code().reset();
        this.updateDisplay();
    };

    this.getLetter = function(index) {
        if (index) {
            return (index < this.message.length && index >= 0) ? this.message[index] : '';
        } else {
            return this.getLetter(this.message.length - 1);
        }
    };

    this.getLetterCode = function(index) {
        if (index) {
            var letterCode = (index < this.message.length && index >= 0) ? this.letterCodes[index] : this.defaultCodeName();
            return (letterCode) ? letterCode : this.defaultCodeName();
        } else {
            return this.getLetterCode(this.message.length - 1);
        }
    };

    this.defaultCodeName = function() {
        // TODO: there has to be better way to do this...
        // all I want to do is get the first name in the
        // associative array
        for (codeName in this.codes) {
            return codeName;
        }
    };

    this.defaultSearchName = function() {
        // TODO: there has to be better way to do this...
        // all I want to do is get the first name in the
        // associative array
        for (searchName in this.searches) {
            return searchName;
        }
    };


    this.code = function(name) {
        if (name) {
            return this.codes[name];
        } else if (this.currentCode) {
            return this.codes[this.currentCode];
        } else {
            return this.codes[this.getLetterCode()]; 
        }
    };

    this.search = function(name) {
        if (name) {
            return this.searches[name];
        } else if (this.currentSearch) {
            return this.searches[this.currentSearch];
        } else {
            return this.searches[this.defaultSearchName()];
        }
    };

    this.doSearch = function(name) {
        var searchResults = this.search().search(this.message);
        var content = '<ul>';
        for (i in searchResults) {
            var searchResult = searchResults[i];
            var c = (i % 2 == 0) ? 'even' : 'odd';
            content += '<li><a href="#search-result-' + i + '" class="search-result-' + c + '" onclick="decoder.setMessage(\'' + searchResult+ '\')">' + searchResult + '</a></li>';
        }
        content += '</ul>';
        var searchDiv = document.getElementById('search-results-div');
        searchDiv.innerHTML = content;
    }


    this.draw = function(targetDivName) {
        var rootDiv = document.getElementById(targetDivName);
        var content = '';
        // message area
        content += '<div id="' + this.messageAreaId + '">';
        content += this.createMessage(this.message);
        content += '</div>';

        // current letter
        content += '<div id="current-letter-div">Current Letter (<span id="mode-area">ADD</span>): "<span id="current-letter"></span>"<span id="current-letter-img"></span></div>';

        // level 1 tabs: Code or Search
        content += '<div id="level1-tabs-div"><ul id="level1-tabs" class="level1-tabs">';
        for (i in this.l1Tabs) {
            var tabName = this.l1Tabs[i];
            content += '<li><a href="#' + tabName + '" id="l1-' + tabName + '-tab" class="l1-tab-on" onclick="decoder.setTab(\'' + tabName + '\')">' + tabName.capFirst()+ '</a></li>';
        }
        content += '</ul></div>';

        // level 2 tabs: Codes
        content += '<div id="codes-tab-div">';
        content += '<ul class="level2-tabs" id="codes-tabs">';
        for (codeName in this.codes) {
            content += '<li><a href="#' + codeName + '" id="' + codeName + '-tab" class="l2-tab-off" onclick="decoder.setCode(\'' + codeName + '\')">' + codeName.capFirst() + '</a></li>';
        }
        content += '</ul>'; // end codes-tabs
        content += '<div id="codes-div"></div>';
        // general code controls
        content += '<div id="code-controls-div" >';
        content += '<button id="reset"  value="Reset" onclick="decoder.resetCode()">Reset</button>';
        content += '<button id="commit"  value="Commit" onclick="decoder.commit()">Commit</button>';
        content += '<button id="backspace"  value="Backspace" onclick="decoder.backspace()">Backspace</button>';
        content += '<button id="space"  value="Space" onclick="decoder.space()">Space</button>';
        content += '<button id="clear"  value="Clear" onclick="decoder.clearCode()">Clear Message</button>';
        content += '<div id="editor-div">';
        content += '<label name="editor-text-area">Edit Message</label>';
        content += '<textarea id="editor-text-area" onblur="decoder.onEditorBlur(this)"n onfocus="decoder.onEditorFocus(this)"></textarea>';
        content += '</div>'; // end editor-div
        content += '</div>'; // end code-controls-div
        content += '</div>'; // end codes-tab-div

        // level 2 tabs: Searches
        content += '<div id="searches-tab-div">';
        content += '<ul class="level2-tabs" id="search-tabs">';
        for (searchName in this.searches) {
            content += '<li><a href="#' + searchName + '" id="' + searchName + '-tab" class="l2-tab-off" onclick="decoder.setSearch(\'' + searchName + '\')">' + searchName.capFirst() + '</a></li>';
        }
        content += '</ul>'; // end search-tabs
        content += '<div id="searches-div"></div>';
        // general search controls
        content += '<div id="search-controls-div" >';
        content += '<button id="reset"  value="Reset" onclick="decoder.resetSearch()">Reset</button>';
        content += '<button id="commit"  value="Commit" onclick="decoder.doSearch()">Search</button>';
        content += '</div>'; // end search-controls-div
        // search results area 
        content += '<div id="search-results-div"></div>';
        content += '</div>'; // end search-tab-div

        rootDiv.innerHTML = content;

        var codesDiv = document.getElementById('codes-div');
        for (codeName in this.codes) {
            var code = this.codes[codeName];
            code.draw(codesDiv);
        }

        var searchesDiv = document.getElementById('searches-div');
        for (searchName in this.searches) {
            var search = this.searches[searchName];
            search.draw(searchesDiv);
        }

        this.updateDisplay();
    };

    this.onEditorFocus = function(editor) {
        editor.value = this.message;
    }

    this.onEditorBlur = function(editor) {
        this.setMessage(editor.value);
        editor.value = '';
    }

    this.setMessage = function(message) {
        this.message = message.toUpperCase();
        this.cursor = message.length + 1;
        this.updateDisplay();
    }

    this.setTab = function(tabName) {
        this.currentTab = tabName;
        this.updateDisplay();
    }

    this.updateDisplay = function() {
        var mode = document.getElementById(this.modeAreaId); 
        var msg = document.getElementById(this.messageAreaId); 
        var cl = document.getElementById(this.characterAreaId); 
        var img = document.getElementById(this.characterImageId); 
        var editor = document.getElementById(this.editorTextAreaId); 
        var letter = this.code().getLetter();
        msg.innerHTML = this.createMessage(this.message);
        cl.innerText = letter;
        mode.innerText = this.mode;
        img.innerHTML = this.code().getImage(letter);
        for (i in this.l1Tabs) {
            var tabName = this.l1Tabs[i];
            var tab = document.getElementById('l1-' + tabName + '-tab');
            var div = document.getElementById(tabName + '-tab-div');
            if (tabName == this.currentTab) {
                tab.className = 'l1-tab-on';
                div.style.display = 'block';
            } else {
                tab.className = 'l1-tab-off';
                div.style.display = 'none';
            }
        }
        for (codeName in this.codes) {
            var code = this.codes[codeName];
            var tab = document.getElementById(codeName + '-tab');
            if (code.name == this.currentCode) {
                tab.className = 'l2-tab-on';
                code.show();
            } else {
                tab.className = 'l2-tab-off';
                code.hide();
            }
            code.updateDisplay();
        }
        for (searchName in this.searches) {
            var search = this.searches[searchName];
            var tab = document.getElementById(searchName + '-tab');
            if (search.name == this.currentSearch) {
                tab.className = 'tab-on';
                search.show();
            } else {
                tab.className = 'tab-off';
                search.hide();
            }
            search.updateDisplay();
        }
    };

    this.createMessage = function(message) {
        var m = '<table id="message-table"><thead>';
        m += '<tr id="message-row"><tr><th>Message</th>';
        for (var i = 0; i < message.length; i++) {
            m += '<th>';
            if (i == this.cursor) {
                m +=  '<span class="edit">' + message[i] + '</span>';
            } else {
                var c = message[i];
                c = (c == ' ') ? '_' : c;
                m +=  '<a href="#" onclick="decoder.edit('+i+')">' + c + '</a>';
            }
            m += '</th>';
        }
        m += '</tr></thead>';
        m += '<tbody>';
        for (codeName in this.codes) {
                m += '<tr><th id="message_' + codeName + '_row">';
                m += codeName.capFirst();
                m += '</th>';
            for (var i = 0; i < message.length; i++) {
                var c = message[i];
                if ( c == ' ') {
                    m += '<td>&nbsp;</td>';
                } else {
                    var letterCode = this.letterCodes[i];
                    var img = this.codes[codeName].getImage(c);
                    var codeClass =  (letterCode == codeName) ? "orig-code" : "non-orig-code";
                    m += '<td class="' + codeClass + '">';
                    m += '<a href="#" onclick="decoder.edit(' + i + ', \'' + codeName + '\')">' + img;
                    m += '</td>';
                }
            }
        }
        m += '</tbody>';
        m += '</table>';
        return m;
    };

    this.edit = function(index, code) {
        var letter = this.message[index];
        if (!(code)) {
            code = this.letterCodes[index];
        }
        this.setCode(code);
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
        if (this.message.length > 0) {
            this.message = this.message.substring(0, this.message.length-1);
            this.letterCodes.pop();
        }
        this.code().reset();
        this.commit();
    };

    this.clearCode = function() {
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

    this.resetCode = function() {
        this.code().reset();
    };

    this.resetSearch = function() {
        this.search().reset();
    };

    this.addCode = function(code) {
        var name = code.name;
        code.decoder = this;
        this.codes[name] = code;
        this.currentCode = name;
    };

    this.addSearch = function(search) {
        var name = search.name;
        search.decoder = this;
        this.searches[name] = search;
        this.currentSearch = name;
    };

    this.setCode = function(name) {
        this.currentCode = name;
        this.updateDisplay();
    };

    this.setSearch = function(name) {
        this.currentSearch = name;
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

    this.getImage = function(letter) {
        var img;
        if (letter == this.decoder.UNKNOWN) {
            img = 'UNKNOWN';
        } else if (letter == this.decoder.EMPTY) {
            img = 'EMPTY';
        } else {
            img = letter;
        }
        var path =  './images/' + this.name + '/' + img + "." + this.imageExt;
        return '<img class="letter-tile" src="' + path + '" />';
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

function Search(name, searchFunction, resetFunction, updateDisplayFunction, drawFunction, hotKeyMappings) {
    this.name = name;
    this.displayDiv = name + '-div';


    this.search = searchFunction; // no parameters, returns a list of strings representing search matches
    this.reset = resetFunction; // no parameters; reset the interior state 
    this.updateDisplay = updateDisplayFunction; // no parameters; update the html page to represent the interior state 
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
    decoder.addCode(new Decimal());
    decoder.addCode(new Binary());
    decoder.addCode(new Ternary());
    decoder.addCode(new Morse());
    decoder.addCode(new Braille());
    decoder.addCode(new Semaphore());
    decoder.addSearch(new InternalRegexSearch());
    decoder.draw(divId);
    document.decoder = decoder;
}
