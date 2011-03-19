
function SemaphoreArm(id, horizCenter, vertCenter, bigR, littleR) {
    this.isActive = false;
    this.backgroundColor = "fff";
    this.activeColor = "f00";
    this.inactiveColor = "000";

    this.id = id;
    this.bigR = bigR;
    this.littleR = littleR;
    this.vertCenter = vertCenter;
    this.horizCenter = horizCenter;
    this.armLen = this.bigR - (2*this.littleR);
    this.sineOf45Degrees = 0.70710678

    this.highlightR = .7 * littleR;

    if (id % 2 == 1) { // not diagonal
        var xMag = ((id - 1) / 2 ) % 2;
        var yMag = 1 - ((id - 1) / 2 ) % 2;
    } else { // diagonal
        var xMag = this.sineOf45Degrees;
        var yMag = this.sineOf45Degrees;
    }

    var xDir = (id > 5) ? 1 : -1;
    var yDir = (id > 3 && id < 7) ? -1 : 1;

    this.xMult = xMag * xDir;
    this.yMult = yMag * yDir;

    this.lineX = this.horizCenter + (this.xMult * this.armLen);
    this.lineY = this.vertCenter + (this.yMult * this.armLen);

    this.circleX = this.lineX + (this.xMult * this.littleR);
    this.circleY = this.lineY + (this.yMult * this.littleR);

    this.minX = this.circleX - this.littleR;
    this.maxX = this.circleX + this.littleR;
    this.minY = this.circleY - this.littleR;
    this.maxY = this.circleY + this.littleR;

    this.draw = function(ctx) {
        var drawColor = (this.isActive) ? this.activeColor : this.inactiveColor;
        ctx.beginPath();
        ctx.moveTo(this.lineX, this.lineY);
        ctx.lineTo(this.horizCenter, this.vertCenter);
        ctx.closePath();

        ctx.strokeStyle = drawColor;
        ctx.stroke();
        this.fillCircle(ctx, this.circleX, this.circleY, this.littleR, drawColor, this.backgroundColor);

        if (this.isActive) {
            this.fillCircle(ctx, this.circleX, this.circleY, this.highlightR, this.activeColor, this.activeColor);
        }
    }

    this.fillCircle = function(ctx, x, y, radius, strokeColor, fillColor) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.strokeStyle = strokeColor;
        ctx.fillStyle = fillColor;
        ctx.stroke();
        ctx.fill();
    }

    this.strokeCircle = function(ctx, x, y, radius, strokeColor) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.strokeStyle = strokeColor;
        ctx.stroke();
    }

    this.inBoundingBox = function(c) {
        var inside = 
            (c.x >= this.minX && c.x <= this.maxX) &&
            (c.y >= this.minY && c.y <= this.maxY);
        return inside;
    }

}

function SemaphoreCanvas(div, activateCallback) {
    this.div = div;
    this.height = 125;
    this.width = 125;
    this.bigR = 50;
    this.littleR = 10;

    this.vertCenter = this.height / 2;
    this.horizCenter = this.width / 2;

    div.innerHTML += '<canvas id="semaphore-canvas" width="' + this.width + '" height="' + this.height + '" ></canvas>';
    this.canvas = document.getElementById('semaphore-canvas');
    this.ctx = this.canvas.getContext("2d");
    this.activateCallback = activateCallback;

    this.getCursorPosition = function(e) {
        return { x : e.offsetX, y : e.offsetY };
    }

    this.onClick = function(e) {
        var coords = this.getCursorPosition(e);
        for (i in this.arms) {
            var arm = this.arms[i];
            var id = arm.id;
            if (arm.inBoundingBox(coords)) {
                this.activateCallback(id);
            }
        }
    }

    this.canvas.addEventListener('click', this.onClick.bind(this), false);

    this.arms = [];
    for (var i = 1; i <= 8; i++) {
        this.arms[i] = new SemaphoreArm(i, this.horizCenter, this.vertCenter, this.bigR, this.littleR);
    }

    this.updateDisplay = function(){
        this.ctx.clearRect(0, 0, this.width, this.height);
        for (var i = 1; i <= 8; i++) {
            this.arms[i].draw(this.ctx);
        }
    }

    this.activate = function(i) {
        this.arms[i].isActive = true;
    }

    this.deactivate = function(i) {
        this.arms[i].isActive = false;
    }

    this.updateDisplay();
}

function Semaphore() {
    this.parent = Code;
    this.parent('semaphore', 'png', 
            // **************
            // resetFunction
            // **************
            function() {
                this.flags = [];
            }, 

            // **************
            // updateDisplayFunction
            // **************
            function() {
                /*
                var disable =  this.
                for (var i = 1; i <= 8 ; i++) {
                    var a = document.getElementById(this.name + i);
                    var active = (this.flagA == i || this.flagB == i);
                    a.innerHTML = (active) ? this.flagChars[i] : '';
                    a.disabled = (disable) ? !active : false;
                }
                */
                this.semaphoreCanvas.updateDisplay();
            }, 

            // **************
            // decodeFunction
            // **************
            function(letter) {
                var val = this.letterToFlags[letter];
                if (val) {
                    var b = val % 10;
                    var a = (val-b) / 10;
                    this.flags[0] = a;
                    this.flags[1] = b;
                } else {
                    this.reset();
                }
            }, 

            // **************
            // getLetterFunction
            // **************
            function() {
                var flags = this.flagValue();

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
                content += '<div id="semaphore-div" >';
                /*
                content += '<table>';
                content += '<tr>';
                content += '<td>&nbsp;</td>';
                content += '<td>&nbsp;</td>';
                content += '<td><button id="semaphore5" onclick="decoder.code(\'semaphore\').toggle(5)"></button></td>';
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
                */

                div.innerHTML += content;
                var semDiv = document.getElementById('semaphore-div');
                this.semaphoreCanvas = new SemaphoreCanvas(semDiv, this.toggle.bind(this));
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

    this.flags = [];

    /*
    this.flagChars = { 
        1 : '|', 2 : '/', 3 : '-', 4 : '\\',
        5 : '|', 6 : '/', 7 : '-', 8 : '\\',
    };
    */

    this.flagValue = function() {
        var val;
        if (this.flags.length == 0) {
            val = 0;
        } else if (this.flags.length == 1) {
            val = this.flags[0];
        } else {
            var flagA = this.flags[0];
            var flagB = this.flags[1];
            if (flagA > flagB) {
                var tmp = flagB;
                flagB = flagA;
                flagA = tmp;
            }
            val = 10 * flagA + flagB;
        }
        return val;
    }

    this.letterToFlags = {
        '' : 0,
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
        var flagId = this.letterToFlags[letter];
        this.flagsToLetter[flagId] = letter;
    }

    this.toggle = function(flag) {
        if (this.flags[0] == undefined) {
            this.flags.push(flag);
        } else if (this.flags.length == 1) {
            if (this.flags[0] == flag) {
                this.flags.pop();
            } else {
                this.flags.push(flag);
            }
        } else {
            if (this.flags[0] == flag) {
                this.flags.pop();
            } else if (this.flags[1] == flag) {
                this.flags.pop();
            } else {
                this.flags[1] = flag;
            }
        }
        for (var i = 1; i <= 8; i++) {
            if (this.flags[0] == i || this.flags[1] == i) {
                this.semaphoreCanvas.activate(i);
            } else {
                this.semaphoreCanvas.deactivate(i);
            }
        }
        this.decoder.updateDisplay();
    }
}

