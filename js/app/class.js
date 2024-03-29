var slice = Array.prototype.slice, emptyFunction = function() { };

var IS_DONTENUM_BUGGY = (function(){
    for (var p in { toString: 1 }) {
      if (p === 'toString') return false;
    }
    return true;
  })()

function Subclass() { }

/** @ignore */
function addMethods(artifiClass, source, parent) {
    for (var property in source) {

      if (property in artifiClass.prototype &&
          typeof artifiClass.prototype[property] === 'function' &&
          (source[property] + '').indexOf('callSuper') > -1) {

        artifiClass.prototype[property] = (function(property) {
          return function() {

            var superclass = this.constructor.superclass;
            this.constructor.superclass = parent;
            var returnValue = source[property].apply(this, arguments);
            this.constructor.superclass = superclass;

            if (property !== 'initialize') {
              return returnValue;
            }
          };
        })(property);
      }
      else {
        artifiClass.prototype[property] = source[property];
      }

      if (IS_DONTENUM_BUGGY) {
        if (source.toString !== Object.prototype.toString) {
          artifiClass.prototype.toString = source.toString;
        }
        if (source.valueOf !== Object.prototype.valueOf) {
          artifiClass.prototype.valueOf = source.valueOf;
        }
      }
    }
};

function callSuper(methodName) {
var fn = this.constructor.superclass.prototype[methodName];
return (arguments.length > 1)
  ? fn.apply(this, slice.call(arguments, 1))
  : fn.call(this);
}

/**
* Helper for creation of "classes".
* @param parent optional "Class" to inherit from
* @param properties Properties shared by all instances of this class
* (be careful modifying objects defined here as this would affect all instances)
*/
function createClass() {
var parent = null,
    properties = slice.call(arguments, 0);

if (typeof properties[0] === 'function') {
  parent = properties.shift();
}
function cdkClass() {
  this.initialize.apply(this, arguments);
}

cdkClass.superclass = parent;
cdkClass.subclasses = [ ];

if (parent) {
  Subclass.prototype = parent.prototype;
  cdkClass.prototype = new Subclass();
  parent.subclasses.push(cdkClass);
}
for (var i = 0, length = properties.length; i < length; i++) {
  addMethods(cdkClass, properties[i], parent);
}
if (!cdkClass.prototype.initialize) {
  cdkClass.prototype.initialize = emptyFunction;
}
cdkClass.prototype.constructor = cdkClass;
cdkClass.prototype.callSuper = callSuper;
return cdkClass;
}

createClass = createClass;

