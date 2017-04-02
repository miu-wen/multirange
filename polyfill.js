/*
* fix ES6
* */
/*======================
*	polyfill Array
*======================*/
(function(Array){
	//fix Array.from
	if(!Array.from){
		Object.defineProperty(Array.prototype,"from",{
			value:(function () {
				var toStr = Object.prototype.toString;
				var isCallable = function (fn) {
					return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
				};
				var toInteger = function (value) {
					var number = Number(value);
					if (isNaN(number)) { return 0; }
					if (number === 0 || !isFinite(number)) { return number; }
					return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
				};
				var maxSafeInteger = Math.pow(2, 53) - 1;
				var toLength = function (value) {
					var len = toInteger(value);
					return Math.min(Math.max(len, 0), maxSafeInteger);
				};
				return function from(arrayLike/*, mapFn, thisArg */) {
					var C = this;
					var items = Object(arrayLike);
					if (arrayLike == null) {
						throw new TypeError("Array.from requires an array-like object - not null or undefined");
					}
					var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
					var T;
					if (typeof mapFn !== 'undefined') {
						if (!isCallable(mapFn)) {
							throw new TypeError('Array.from: when provided, the second argument must be a function');
						}
						if (arguments.length > 2) {
							T = arguments[2];
						}
					}
					var len = toLength(items.length);
					var A = isCallable(C) ? Object(new C(len)) : new Array(len);
					var k = 0;
					var kValue;
					while (k < len) {
						kValue = items[k];
						if (mapFn) {
							A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
						} else {
							A[k] = kValue;
						}
						k += 1;
					}
					A.length = len;
					return A;
				};
			}()),
			enumerable:false,
			writable:true,
			configurable:true
		});
	}
})(Array);

/*=======================================
 *	polyfill Object
 *=====================================*/
(function(Object){
	//fix defineProperties
	if(!Object.defineProperties){
		Object.defineProperty(Object.prototype,"defineProperties",{
			value:defineProperties,
			enumerable:false,
			writable:true,
			configurable:true
		});
	}
	function defineProperties(obj, properties)
	{
		function convertToDescriptor(desc){
			function hasProperty(obj, prop){
				return Object.prototype.hasOwnProperty.call(obj, prop);
			}
			function isCallable(v){
				return typeof v === "function";
			}
			if (typeof desc !== "object" || desc === null)
				throw new TypeError("不是正规的对象");
			var d = {};
			if (hasProperty(desc, "enumerable"))
				d.enumerable = !!desc.enumerable;
			if (hasProperty(desc, "configurable"))
				d.configurable = !!desc.configurable;
			if (hasProperty(desc, "value"))
				d.value = desc.value;
			if (hasProperty(desc, "writable"))
				d.writable = !!desc.writable;
			if (hasProperty(desc, "get")){
				var g = desc.get;
				if (!isCallable(g) && g !== "undefined")
					throw new TypeError("bad get");
				d.get = g;
			}
			if (hasProperty(desc, "set")){
				var s = desc.set;
				if (!isCallable(s) && s !== "undefined")
					throw new TypeError("bad set");
				d.set = s;
			}
			if (("get" in d || "set" in d) && ("value" in d || "writable" in d))
				throw new TypeError("identity-confused descriptor");
			return d;
		}
		if (typeof obj !== "object" || obj === null)
			throw new TypeError("不是正规的对象");
		properties = Object(properties);
		var keys = Object.keys(properties);
		var descs = [];
		for (var i = 0; i < keys.length; i++)
			descs.push([keys[i], convertToDescriptor(properties[keys[i]])]);
		for (var i = 0; i < descs.length; i++)
			Object.defineProperty(obj, descs[i][0], descs[i][1]);
		return obj;
	}
})(Object)