/*
    javascript.js

	License: MIT license - http://www.opensource.org/licenses/mit-license.php
*/

// todo: Date.prototype.toJSON (see json.js) and corresponding changes to Date.parse

!function(){

function declare(constructor, methodname, method) {
	if (!constructor.prototype[methodname])
		constructor.prototype[methodname] = method
}

function assign(constructor, methodname, method) {
	if (!constructor[methodname])
		constructor[methodname] = method
}

declare(Array, "filter", function(fun /*, thisp */)
  {


    if (this == null)
      throw new TypeError()

    var t = Object(this)
    var len = t.length >>> 0
    if (typeof fun != "function")
      throw new TypeError()

    var res = []
    var thisp = arguments[1]
    for (var i = 0; i < len; i++)
    {
      if (i in t)
      {
        var val = t[i] // in case fun mutates this
        if (fun.call(thisp, val, i, t))
          res.push(val)
      }
    }

    return res
  })


declare(Array, "every", function(fun /*, thisp */)
  {


    if (this == null)
      throw new TypeError()

    var t = Object(this)
    var len = t.length >>> 0
    if (typeof fun != "function")
      throw new TypeError()

    var thisp = arguments[1]
    for (var i = 0; i < len; i++)
    {
      if (i in t && !fun.call(thisp, t[i], i, t))
        return false
    }

    return true
  })

// Production steps of ECMA-262, Edition 5, 15.4.4.19
// Reference: http://es5.github.com/#x15.4.4.19
declare(Array, "map", function(callback, thisArg) {

    var T, A, k

    if (this == null) {
      throw new TypeError(" this is null or not defined")
    }

    // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
    var O = Object(this)

    // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0

    // 4. If IsCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if ({}.toString.call(callback) != "[object Function]") {
      throw new TypeError(callback + " is not a function")
    }

    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
    if (thisArg) {
      T = thisArg
    }

    // 6. Let A be a new array created as if by the expression new Array(len) where Array is
    // the standard built-in constructor with that name and len is the value of len.
    A = new Array(len)

    // 7. Let k be 0
    k = 0

    // 8. Repeat, while k < len
    while(k < len) {

      var kValue, mappedValue

      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
        kValue = O[ k ]

        // ii. Let mappedValue be the result of calling the Call internal method of callback
        // with T as the this value and argument list containing kValue, k, and O.
        mappedValue = callback.call(T, kValue, k, O)

        // iii. Call the DefineOwnProperty internal method of A with arguments
        // Pk, Property Descriptor {Value: mappedValue, : true, Enumerable: true, Configurable: true},
        // and false.

        // In browsers that support Object.defineProperty, use the following:
        // Object.defineProperty(A, Pk, { value: mappedValue, writable: true, enumerable: true, configurable: true })

        // For best browser support, use the following:
        A[ k ] = mappedValue
      }
      // d. Increase k by 1.
      k++
    }

    // 9. return A
    return A
  })

declare(Array, "some", function(fun /*, thisp */)
  {


    if (this == null)
      throw new TypeError()

    var t = Object(this)
    var len = t.length >>> 0
    if (typeof fun != "function")
      throw new TypeError()

    var thisp = arguments[1]
    for (var i = 0; i < len; i++)
    {
      if (i in t && fun.call(thisp, t[i], i, t))
        return true
    }

    return false
  })

declare(Array, "reduce", function reduce(accumulator){
    if (this===null || this===undefined) throw new TypeError("Object is null or undefined")
    var i = 0, l = this.length >> 0, curr

    if(typeof accumulator !== "function") // ES5 : "If IsCallable(callbackfn) is false, throw a TypeError exception."
      throw new TypeError("First argument is not callable")

    if(arguments.length < 2) {
      if (l === 0) throw new TypeError("Array length is 0 and no second argument")
      curr = this[0]
      i = 1 // start accumulating at the second element
    }
    else
      curr = arguments[1]

    while (i < l) {
      if(i in this) curr = accumulator.call(undefined, curr, this[i], i, this)
      ++i
    }

    return curr
  })

declare(Array, "reduceRight", function(callbackfn /*, initialValue */)
  {


    if (this == null)
      throw new TypeError()

    var t = Object(this)
    var len = t.length >>> 0
    if (typeof callbackfn != "function")
      throw new TypeError()

    // no value to return if no initial value, empty array
    if (len === 0 && arguments.length === 1)
      throw new TypeError()

    var k = len - 1
    var accumulator
    if (arguments.length >= 2)
    {
      accumulator = arguments[1]
    }
    else
    {
      do
      {
        if (k in this)
        {
          accumulator = this[k--]
          break
        }

        // if array contains no values, no initial value to return
        if (--k < 0)
          throw new TypeError()
      }
      while (true)
    }

    while (k >= 0)
    {
      if (k in t)
        accumulator = callbackfn.call(undefined, accumulator, t[k], k, t)
      k--
    }

    return accumulator
  })

// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.com/#x15.4.4.18
declare(Array, "forEach", function( callback, thisArg ) {

    var T, k

    if ( this == null ) {
      throw new TypeError( "this is null or not defined" )
    }

    // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
    var O = Object(this)

    // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0 // Hack to convert O.length to a UInt32

    // 4. If IsCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if ( {}.toString.call(callback) != "[object Function]" ) {
      throw new TypeError( callback + " is not a function" )
    }

    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
    if ( thisArg ) {
      T = thisArg
    }

    // 6. Let k be 0
    k = 0

    // 7. Repeat, while k < len
    while( k < len ) {

      var kValue

      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      if ( k in O ) {

        // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
        kValue = O[ k ]

        // ii. Call the Call internal method of callback with T as the this value and
        // argument list containing kValue, k, and O.
        callback.call( T, kValue, k, O )
      }
      // d. Increase k by 1.
      k++
    }
    // 8. return undefined
  })

declare(Array, "indexOf", function (searchElement /*, fromIndex */ ) {

        if (this == null) {
            throw new TypeError()
        }
        var t = Object(this)
        var len = t.length >>> 0
        if (len === 0) {
            return -1
        }
        var n = 0
        if (arguments.length > 1) {
            n = Number(arguments[1])
            if (n != n) { // shortcut for verifying if it's NaN
                n = 0
            } else if (n != 0 && n != Infinity && n != -Infinity) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n))
            }
        }
        if (n >= len) {
            return -1
        }
        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0)
        for (; k < len; k++) {
            if (k in t && t[k] === searchElement) {
                return k
            }
        }
        return -1
    })

declare(Array, "lastIndexOf", function(searchElement /*, fromIndex*/)
  {

    if (this == null)
      throw new TypeError()

    var t = Object(this)
    var len = t.length >>> 0
    if (len === 0)
      return -1

    var n = len
    if (arguments.length > 1)
    {
      n = Number(arguments[1])
      if (n != n)
        n = 0
      else if (n != 0 && n != (1 / 0) && n != -(1 / 0))
        n = (n > 0 || -1) * Math.floor(Math.abs(n))
    }

    var k = n >= 0
          ? Math.min(n, len - 1)
          : len - Math.abs(n)

    for (; k >= 0; k--)
    {
      if (k in t && t[k] === searchElement)
        return k
    }
    return -1
  })

assign(Array, "isArray", function (vArg) {
    return Object.prototype.toString.call(vArg) === "[object Array]"
  })

assign(Object, "keys", (function () {
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
        dontEnums = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ],
        dontEnumsLength = dontEnums.length

    return function (obj) {
      if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) throw new TypeError('Object.keys called on non-object')

      var result = []

      for (var prop in obj) {
        if (hasOwnProperty.call(obj, prop)) result.push(prop)
      }

      if (hasDontEnumBug) {
        for (var i=0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) result.push(dontEnums[i])
        }
      }
      return result
    }
  })())

declare(Function, "bind", function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable")
    }

    var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP && oThis
                                 ? this
                                 : oThis,
                               aArgs.concat(Array.prototype.slice.call(arguments)))
        }

    fNOP.prototype = this.prototype
    fBound.prototype = new fNOP()

    return fBound
  })

!["slice", "filter", "every", "some", "reduce", "reduceRight", "map", "forEach", "indexOf", "lastIndexOf"]
.forEach(function (n) {
	var f = Array.prototype[n]
	if (!Array[n])
		Array[n] = function () {
			return f.call.apply(f, arguments)
		}
})

if (typeof document != "undefined") {

var makeVendorProps = function(prop) {
	var titled = prop.charAt(0).toUpperCase() + prop.substr(1)
	return ["ms", "moz", "webkit", "O"].map(function (vendorPrefix) { return {
		js: vendorPrefix + titled,
		css: "-" + vendorPrefix.toLowerCase() + "-" + prop
	} } )
}

var replaced = {}

var checkVendorProp = function (obj, prop, vendorProps) {
	if (!(prop in obj) && typeof obj[prop] == "undefined") {
		var proto = obj.constructor.prototype
		!(vendorProps || makeVendorProps(prop)).every(function (v) {
			if (v.js in obj) {
				replaced[ prop ] = v.css
				if (Object.defineProperty)
					Object.defineProperty(proto, prop, { enumerable: true, get: get, set: set })
				else if (proto.__defineGetter__) {
					proto.__defineGetter__(prop, get)
					proto.__defineSetter__(prop, set)
				}
				return false
			}
			return true
			function get() {
				return this[ v.js ]
			}
			function set( x ) {
				if ( x && complexProp[ prop ] && typeof x == "string" )
					x = x.split( " " ).map( function ( s ) { return replaced[ s ] || s } ).join( " " )
				this[ v.js ] = x
			}
		})
	}
}

var checkVendorObj = function(obj, props) {
	props.forEach(function (prop) { checkVendorProp(obj, prop) })
}

var complexProp = {}
0,[
	"animation",
	"transition",
	"transitionProperty"
].forEach( function ( i ) { complexProp[ i ] = true } )

checkVendorObj(
	document.createElement("div").style, [
	"animation",
	"animationDelay",
	"animationDirection",
	"animationDuration",
	"animationFillMode",
	"animationIterationCount",
	"animationName",
	"animationPlayState",
	"animationTimingFunction",
	"perspective",
	"perspectiveOrigin",
	"perspectiveOriginX",
	"perspectiveOriginY",
	"touchCallout",
	"transform",
	"transformOrigin",
	"transformOriginX",
	"transformOriginY",
	"transformOriginZ",
	"transformStyle",
	"transition",
	"transitionProperty",
	"transitionDuration",
	"transitionTimingFunction",
	"transitionDelay"
])

checkVendorObj(
	window, [
	"requestAnimationFrame",
	"cancelRequestAnimationFrame",
	"cancelAimationFrame",
	"indexedDB"
])

}

}()
