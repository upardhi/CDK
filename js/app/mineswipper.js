(function(global) {

    'use strict';

    mineSwipper = mineSwipper || (mineSwipper = {});

    if (mineSwipper.MineSwipperGenerator) {
        console.warn('MineSwipperGenerator class is already defined');
        return;
    }
    mineSwipper.MineSwipperGenerator = createClass({

        /**
         * No of mines flag
         */
        nbFlags: 0,

        toDiscover: true,

        /**
         * Mines Array
         */
        arrayMines: new Array(),

        /**
         * Game timer
         */
        timer: 0,

        /**
         * Count of selected girds
         */
        count: 0,

        /**
         * Default Grid size 
         */
        gridSize: 10,

        /**
         * Default no of mine percentage
         */
        gridPercentage: 20,

        container: 'mineswipper',

        /**
         * MiniswipperTemplate HTML
         */
        mineSwipperTemplate: '<div class="container"><form class="form-inline"><div class="form-group"><label for="grid-size">Grid Size</label><input type="number" name="nbMines" value="10"  class="form-control" ></div><button type="button" id="start-game" class="btn">Start/Refresh</button></form></div><div class="container"><div id="mines-wrapper"><div id="scoreboard"><div  class="panel">Mines:<span id="score-bomb-count"> 000</span></div><hr><div  class="panel">Time: <span id="score-time-count">000</span> </div></div><div id="mines" class="clearfix" style="clear: both">Click to start button for game.</div></div></div>',

        /**
         * Constructor
         * @param {Object} [options] Options object
         */
        initialize: function(options) {
            this.container = options && options.container ? options.container : this.container;
            this.nbFlags = options && options.nbFlags ? options.nbFlags : this.nbFlags;
            this.timer = options && options.timer ? options.timer : this.timer;
            this.gridPercentage = options && options.gridPercentage ? options.gridPercentage : this.gridPercentage;
            this.mineSwipperTemplate = options && options.mineSwipperTemplate ? options.gridPercentage : this.mineSwipperTemplate;
            
            /**
             * Setting UI of miniswipper
             */
            this.setHTMLUsingId(this.container, this.mineSwipperTemplate);
            /**
             * Listning events
             */
            document.querySelector('body').addEventListener('click', this.clickMe.bind(this));
            document.querySelector('body').addEventListener('contextmenu', this.clickMe.bind(this));
            document.getElementById('start-game') && document.getElementById('start-game').addEventListener('click', this.clickMe.bind(this));
            /**
             * Setting timer
             */
            this.startTimer();
        },

        clickMe: function clickMe(e) {
            /**
             * Listning Events
             */
            if (event.target.dataset && event.target.dataset.mineLocation) {
                var mineLocation = event.target.dataset.mineLocation.split(',');
                if (event.type == 'click')
                    this.clickMine(mineLocation[0], mineLocation[1]);
                else if (event.type == 'contextmenu')
                    this.switchFlag(mineLocation[0], mineLocation[1]);
            } else if (event.target.id == "start-game") {
                var gridSize = this.getElementValues("[name='nbMines']");
                this.init(gridSize);
            }
        },
        /**
         * Method for managing the time and set time using the setTimeout function 
         *  
         */
        startTimer: function() {
            var _this = this;
            setInterval(function() {
                if (_this.timer) {
                    _this.setHTMLUsingId('score-time-count', ("00" + _this.count).slice(-3));
                    _this.count++;
                }
            }, 1000);
        },

        /**
         * Function for creating grids and mines 
         */
        init: function(gridSize) {
            var _this = this;
            _this.gridSize = gridSize;
            _this.columns = gridSize;
            _this.lines = gridSize;
            _this.nbMines = parseInt(((gridSize * gridSize) /100) * _this.gridPercentage);
            _this.setGridsWrapper();
            _this.setMines();
            _this.setNbMines();
            _this.timer = true;
            _this.count = 0;
        },
        /**
         * Function for managing the clicks and check victory
         * @param {number} i : Row  
         * @param {number} j : Column
         */

        clickMine: function(i, j) {
            var _this = this;
            if (_this.arrayMines[i][j] > 1) {
                _this.switchFlag(i, j);
            } else if (_this.arrayMines[i][j] == 1) {
                _this.addClass(i + "_" + j, "active");
                _this.timer = false;
                _this.showBombs();
                _this.showMessage("You Loose !");

            } else {
                _this.addClass(i + "_" + j, "active");
                _this.toDiscover--;
                var number = _this.countMines(i, j);
                if (number !== 0)
                    _this.setImputValueToId(i + "_" + j, number);

                else
                    for (var x = Math.max(0, i - 1); x <= Math.min(_this.lines - 1, i + 1); x++)
                        for (var y = Math.max(0, j - 1); y <= Math.min(_this.columns - 1, j + 1); y++)
                            if (_this.arrayMines[x][y] < 2 && !_this.hasClass(x + "_" + y, 'active')) _this.clickMine(x, y);

                _this.checkVictory();
            }
        },
        /**
         * Function for counting mines
         * @param {number} i : Row  
         * @param {number} j : Column
         */
        countMines: function(i, j) {
            var _this = this;
            var k = 0;
            for (var x = Math.max(0, i - 1); x <= Math.min(_this.lines - 1, i + 1); x++)
                for (var y = Math.max(0, j - 1); y <= Math.min(_this.columns - 1, j + 1); y++)
                    if (_this.arrayMines[x][y] == 1 || _this.arrayMines[x][y] == 3) k++;
            return k;
        },

        /**
         * Function for setting flag
         * @param {number} i : Row 
         * @param {number} j : Column
         */
        switchFlag: function(i, j) {
            var _this = this;
            if (!_this.hasClass(i + "_" + j, 'active')) {
                if (_this.arrayMines[i][j] < 2) {
                    if (_this.nbFlags > 0) {
                        _this.arrayMines[i][j] += 2;
                        _this.addClass(i + "_" + j,'flag');
                       // _this.setImputValueToId(i + "_" + j, "F");
                       // _this.setTyleToId(i + "_" + j, 'color', '#FF0000');
                        _this.nbFlags--;
                    }
                } else {
                    _this.arrayMines[i][j] -= 2;
                    //_this.setImputValueToId(i + "_" + j, "");
                    _this.removeClass(i + "_" + j,'flag');
                    _this.setTyleToId(i + "_" + j, 'color', '');
                    _this.nbFlags++;
                }
            }
            _this.setHTMLUsingId('score-bomb-count', ("00" + _this.nbFlags).slice(-3))

        },

        /**
         * Show bombs
         */
        showBombs: function() {
            var _this = this;
            for (var i = 0; i < _this.lines; i++)
                for (var j = 0; j < _this.columns; j++) {
                    if (_this.arrayMines[i][j] == 1) {
                        _this.setImputValueToId(i + "_" + j, "*");
                        _this.setTyleToId(i + "_" + j, 'font-size', '20px');
                        _this.setTyleToId(i + "_" + j, 'background-color', 'FF0000');
                    }
                }
        },

        /**
         * Check Victory
         */
        checkVictory: function() {
            var _this = this;
            if (_this.toDiscover === 0) {
                _this.timer = false;
                for (var i = 0; i < _this._this.lines; i++)
                    for (var j = 0; j < _this.columns; j++) {
                        if (_this.arrayMines[i][j] == 1) {
                            _this.addClass(i + "_" + j,'flag');
                            //_this.setImputValueToId(i + "_" + j, "F");
                            //_this.setTyleToId(i + "_" + j, 'color', '#FF0000');
                        }
                        // $("#" + i + "_" + j).attr('onclick', 'init()');
                    }
                _this.showMessage("You Win!");
                _this.toDiscover = -1;
            }
        },
        /**
         * Set grids 
         */
        setGridsWrapper: function() {
            var _this = this;
            _this.setHTMLUsingId('mines', '');

            _this.nbFlags = _this.nbMines;
            _this.toDiscover = _this.columns * _this.lines - _this.nbMines;
            _this.setTyleToId('mines-wrapper', 'width', _this.columns * 21);
            _this.setTyleToId('mines-wrapper', 'height', _this.lines * 21 + 52);
            _this.setHTMLUsingId('score-bomb-count', _this.nbFlags);
        },
        /**
         * Set Mines
         */
        setMines: function() {
            var _this = this;
            for (var i = 0; i < _this.lines; i++) {
                _this.arrayMines[i] = new Array();
                for (var j = 0; j < _this.columns; j++) {
                    _this.arrayMines[i][j] = 0;
                    _this.appendHTMLToIdSelector('mines', "<input type='button' value='' class='square mines-square' id=" + i + "_" + j + "    data-mine-location =" + i + "," + j + " />");
                }
            }
        },
        /**
         * Set NB mines
         */
        setNbMines: function() {
            var _this = this;
            var i = 0;
            while (i < _this.nbMines) {
                var x = Math.floor(Math.random() * _this.lines);
                var y = Math.floor(Math.random() * _this.columns);
                if (_this.arrayMines[x][y] === 0) {
                    _this.arrayMines[x][y] = 1;
                    i++;
                }
            }
        },
        /**
         * Helper Function to manage the Javascript element. I have created this function because in future if I need to use the 
         * jQuery or any flugin it will be easy for me to replace only this function other than code
         */

        /**
         * Function for getting UI element using ID 
         */
        setHTMLUsingId: function(id, innerHTML) {
            return document.getElementById(id).innerHTML = innerHTML;
        },

        getElementValues: function(element) {
            return document.querySelectorAll(element)[0].value;
        },

        appendHTMLToIdSelector: function(id, node) {
            var dom = document.getElementById(id)
            dom.insertAdjacentHTML('beforeend', node);
        },
        setTyleToId: function(id, prop, value) {
            document.getElementById(id).style[prop] = value;
        },
        setImputValueToId: function(id, val) {
            document.getElementById(id).value = val;
        },
        hasClass: function(id, className) {
            if (id && document.getElementById(id) && document.getElementById(id).classList.contains(className)) {

                return true;
            }
            return false;
        },
        addClass: function(id, className) {
            return document.getElementById(id) && document.getElementById(id).classList.add(className)
        },
        removeClass: function(id, className) {
            return document.getElementById(id) && document.getElementById(id).classList.remove(className)
        },
        showMessage: function(msg) {
            showMessage(msg);
        }



    })

})(typeof exports !== 'undefined' ? exports : this);