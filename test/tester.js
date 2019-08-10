(function(){

    QUnit.test('createClass', function(assert) {
        var Klass = createClass();
    
        assert.ok(typeof Klass === 'function');
        assert.ok(typeof new Klass() === 'object');
    
        var Person = createClass({
          initialize: function(firstName, lastName) {
            this.firstName = firstName;
            this.lastName = lastName;
          },
          toString: function() {
            return 'My name is ' + this.firstName + ' ' + this.lastName;
          }
        });
    
        assert.ok(typeof Person === 'function');
        assert.ok(typeof new Person() === 'object');
    
        var john = new Person('John', 'Meadows');
        assert.ok(john instanceof Person);
    
        assert.equal(john.firstName, 'John');
        assert.equal(john.lastName, 'Meadows');
        assert.equal(john + '', 'My name is John Meadows');
    
    
        var WebDeveloper = createClass(Person, {
          initialize: function(firstName, lastName, skills) {
            this.callSuper('initialize', firstName, lastName);
            this.skills = skills;
          },
          toString: function() {
            return this.callSuper('toString') + ' and my skills are ' + this.skills.join(', ');
          }
        });
    
        assert.ok(typeof WebDeveloper === 'function');
        var dan = new WebDeveloper('Dan', 'Trink', ['HTML', 'CSS', 'Javascript']);
        assert.ok(dan instanceof Person);
        assert.ok(dan instanceof WebDeveloper);
        assert.equal(dan.firstName, 'Dan');
        assert.equal(dan.lastName, 'Trink');
        assert.deepEqual(dan.skills, ['HTML', 'CSS', 'Javascript']);
        assert.equal(dan + '', 'My name is Dan Trink and my skills are HTML, CSS, Javascript');
});

QUnit.test('constructor & properties', function(assert) {
    assert.ok(typeof mineSwipper.MineSwipperGenerator === 'function');
    var cObj= new mineSwipper.MineSwipperGenerator();
    assert.ok(cObj);
    assert.ok(cObj instanceof mineSwipper.MineSwipperGenerator);
    assert.ok(cObj.constructor === mineSwipper.MineSwipperGenerator);

  });

  QUnit.test('Miniswipper Container', function(assert) {
    var mineSwipperGeneratorIns= new mineSwipper.MineSwipperGenerator({
        container:'mineswipper',
        gridPercentage:30,
        mineSwipperTemplate:'<div class="container"><form class="form-inline"><div class="form-group"><label for="grid-size">Grid Size</label><input type="number" name="nbMines" value="10"  class="form-control" ></div><button type="button" id="start-game" class="btn">Start/Refresh</button></form></div><div class="container"><div id="mines-wrapper"><div id="scoreboard"><div  class="panel">Mines:<span id="score-bomb-count"> 000</span></div><hr><div  class="panel">Time: <span id="score-time-count">000</span> </div></div><div id="mines" class="clearfix" style="clear: both">Click to start button for game.</div></div></div>'
    });
    assert.ok(mineSwipperGeneratorIns.container,'mineswipper');
    assert.ok(mineSwipperGeneratorIns.gridPercentage,30);
    assert.ok(mineSwipperGeneratorIns.mineSwipperTemplate,'<div class="container"><form class="form-inline"><div class="form-group"><label for="grid-size">Grid Size</label><input type="number" name="nbMines" value="10"  class="form-control" ></div><button type="button" id="start-game" class="btn">Start/Refresh</button></form></div><div class="container"><div id="mines-wrapper"><div id="scoreboard"><div  class="panel">Mines:<span id="score-bomb-count"> 000</span></div><hr><div  class="panel">Time: <span id="score-time-count">000</span> </div></div><div id="mines" class="clearfix" style="clear: both">Click to start button for game.</div></div></div>');
  });

  QUnit.test('UI Helpers', function(assert) {
    var mineSwipperGeneratorIns= new mineSwipper.MineSwipperGenerator();
    var newNode = document.createElement('div');
     newNode.className = 'textNode news content active';
     newNode.id = 'active_id_check';
     newNode.innerHTML = 'this created div contains class while created!!!';
     document.querySelector('body').appendChild(newNode); 

    assert.ok(mineSwipperGeneratorIns.hasClass('active_id_check','active'));
    assert.ok(!mineSwipperGeneratorIns.hasClass('active_id_check',''));

    assert.ok(!mineSwipperGeneratorIns.addClass('active_id_check','active_add'));
    assert.ok(mineSwipperGeneratorIns.hasClass('active_id_check','active_add'));

    assert.ok(!mineSwipperGeneratorIns.removeClass('active_id_check','active_add'));

    assert.ok(!mineSwipperGeneratorIns.hasClass('active_id_check','active_add'));

    assert.ok(!mineSwipperGeneratorIns.addClass('',''));
   

  });



}())