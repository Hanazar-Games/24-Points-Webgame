(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

console.warn('Compiled in DEV mode. Follow the advice at https://elm-lang.org/0.19.1/optimize for better performance and smaller assets.');


var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log_UNUSED = F2(function(tag, value)
{
	return value;
});

var _Debug_log = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString_UNUSED(value)
{
	return '<internals>';
}

function _Debug_toString(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash_UNUSED(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.start.line === region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'on lines ' + region.start.line + ' through ' + region.end.line;
}



// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**_UNUSED/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**_UNUSED/
	if (typeof x.$ === 'undefined')
	//*/
	/**/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0_UNUSED = 0;
var _Utils_Tuple0 = { $: '#0' };

function _Utils_Tuple2_UNUSED(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3_UNUSED(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr_UNUSED(c) { return c; }
function _Utils_chr(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil_UNUSED = { $: 0 };
var _List_Nil = { $: '[]' };

function _List_Cons_UNUSED(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap(value) { return { $: 0, a: value }; }
function _Json_unwrap(value) { return value.a; }

function _Json_wrap_UNUSED(value) { return value; }
function _Json_unwrap_UNUSED(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**_UNUSED/
	var node = args['node'];
	//*/
	/**/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS
//
// For some reason, tabs can appear in href protocols and it still works.
// So '\tjava\tSCRIPT:alert("!!!")' and 'javascript:alert("!!!")' are the same
// in practice. That is why _VirtualDom_RE_js and _VirtualDom_RE_js_html look
// so freaky.
//
// Pulling the regular expressions out to the top level gives a slight speed
// boost in small benchmarks (4-10%) but hoisting values to reduce allocation
// can be unpredictable in large programs where JIT may have a harder time with
// functions are not fully self-contained. The benefit is more that the js and
// js_html ones are so weird that I prefer to see them near each other.


var _VirtualDom_RE_script = /^script$/i;
var _VirtualDom_RE_on_formAction = /^(on|formAction$)/i;
var _VirtualDom_RE_js = /^\s*j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:/i;
var _VirtualDom_RE_js_html = /^\s*(j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:|d\s*a\s*t\s*a\s*:\s*t\s*e\s*x\s*t\s*\/\s*h\s*t\s*m\s*l\s*(,|;))/i;


function _VirtualDom_noScript(tag)
{
	return _VirtualDom_RE_script.test(tag) ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return _VirtualDom_RE_on_formAction.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return _VirtualDom_RE_js.test(value)
		? /**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return _VirtualDom_RE_js_html.test(value)
		? /**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlJson(value)
{
	return (typeof _Json_unwrap(value) === 'string' && _VirtualDom_RE_js_html.test(_Json_unwrap(value)))
		? _Json_wrap(
			/**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		) : value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		message: func(record.message),
		stopPropagation: record.stopPropagation,
		preventDefault: record.preventDefault
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.message;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.stopPropagation;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.preventDefault) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var view = impl.view;
			/**_UNUSED/
			var domNode = args['node'];
			//*/
			/**/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.setup && impl.setup(sendToApp)
			var view = impl.view;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.body);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.title) && (_VirtualDom_doc.title = title = doc.title);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.onUrlChange;
	var onUrlRequest = impl.onUrlRequest;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		setup: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.protocol === next.protocol
							&& curr.host === next.host
							&& curr.port_.a === next.port_.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		init: function(flags)
		{
			return A3(impl.init, flags, _Browser_getUrl(), key);
		},
		view: impl.view,
		update: impl.update,
		subscriptions: impl.subscriptions
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { hidden: 'hidden', change: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { hidden: 'mozHidden', change: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { hidden: 'msHidden', change: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { hidden: 'webkitHidden', change: 'webkitvisibilitychange' }
		: { hidden: 'hidden', change: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		scene: _Browser_getScene(),
		viewport: {
			x: _Browser_window.pageXOffset,
			y: _Browser_window.pageYOffset,
			width: _Browser_doc.documentElement.clientWidth,
			height: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		width: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		height: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			scene: {
				width: node.scrollWidth,
				height: node.scrollHeight
			},
			viewport: {
				x: node.scrollLeft,
				y: node.scrollTop,
				width: node.clientWidth,
				height: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			scene: _Browser_getScene(),
			viewport: {
				x: x,
				y: y,
				width: _Browser_doc.documentElement.clientWidth,
				height: _Browser_doc.documentElement.clientHeight
			},
			element: {
				x: x + rect.left,
				y: y + rect.top,
				width: rect.width,
				height: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});



function _Time_now(millisToPosix)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(millisToPosix(Date.now())));
	});
}

var _Time_setInterval = F2(function(interval, task)
{
	return _Scheduler_binding(function(callback)
	{
		var id = setInterval(function() { _Scheduler_rawSpawn(task); }, interval);
		return function() { clearInterval(id); };
	});
});

function _Time_here()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(
			A2($elm$time$Time$customZone, -(new Date().getTimezoneOffset()), _List_Nil)
		));
	});
}


function _Time_getZoneName()
{
	return _Scheduler_binding(function(callback)
	{
		try
		{
			var name = $elm$time$Time$Name(Intl.DateTimeFormat().resolvedOptions().timeZone);
		}
		catch (e)
		{
			var name = $elm$time$Time$Offset(new Date().getTimezoneOffset());
		}
		callback(_Scheduler_succeed(name));
	});
}
var $elm$core$List$cons = _List_cons;
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0.a;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Basics$EQ = {$: 'EQ'};
var $elm$core$Basics$GT = {$: 'GT'};
var $elm$core$Basics$LT = {$: 'LT'};
var $elm$core$Result$Err = function (a) {
	return {$: 'Err', a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 'Failure', a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 'Index', a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 'Ok', a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 'OneOf', a: a};
};
var $elm$core$Basics$False = {$: 'False'};
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 'Just', a: a};
};
var $elm$core$Maybe$Nothing = {$: 'Nothing'};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 'Field':
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 'Nothing') {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'Index':
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'OneOf':
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 'Array_elm_builtin', a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 'Leaf', a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 'SubTree', a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.nodeListSize) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.tail);
		} else {
			var treeLen = builder.nodeListSize * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.nodeList) : builder.nodeList;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.nodeListSize);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.tail);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{nodeList: nodeList, nodeListSize: (len / $elm$core$Array$branchFactor) | 0, tail: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = {$: 'True'};
var $elm$core$Result$isOk = function (result) {
	if (result.$ === 'Ok') {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 'Normal':
			return 0;
		case 'MayStopPropagation':
			return 1;
		case 'MayPreventDefault':
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 'External', a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 'Internal', a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = function (a) {
	return {$: 'NotFound', a: a};
};
var $elm$url$Url$Http = {$: 'Http'};
var $elm$url$Url$Https = {$: 'Https'};
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {fragment: fragment, host: host, path: path, port_: port_, protocol: protocol, query: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 'Nothing') {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Http,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Https,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0.a;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = function (a) {
	return {$: 'Perform', a: a};
};
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(_Utils_Tuple0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0.a;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return _Utils_Tuple0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(_Utils_Tuple0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0.a;
		return $elm$core$Task$Perform(
			A2($elm$core$Task$map, tagger, task));
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2($elm$core$Task$map, toMessage, task)));
	});
var $elm$browser$Browser$element = _Browser_element;
var $elm$json$Json$Decode$field = _Json_decodeField;
var $author$project$Main$Classic = {$: 'Classic'};
var $author$project$Main$Dark = {$: 'Dark'};
var $author$project$Main$Info = {$: 'Info'};
var $author$project$Main$Light = {$: 'Light'};
var $author$project$Main$NewCards = function (a) {
	return {$: 'NewCards', a: a};
};
var $author$project$Main$Normal = {$: 'Normal'};
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Main$getAt = F2(
	function (idx, list) {
		return $elm$core$List$head(
			A2($elm$core$List$drop, idx, list));
	});
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$Main$createCard = F2(
	function (val, suitIdx) {
		var suits = _List_fromArray(
			['♠', '♥', '♣', '♦']);
		var suit = A2(
			$elm$core$Maybe$withDefault,
			'♠',
			A2($author$project$Main$getAt, suitIdx, suits));
		var display = function () {
			switch (val) {
				case 1:
					return 'A';
				case 11:
					return 'J';
				case 12:
					return 'Q';
				case 13:
					return 'K';
				default:
					return $elm$core$String$fromInt(val);
			}
		}();
		var colors = _List_fromArray(
			['#2c3e50', '#e74c3c', '#2c3e50', '#e74c3c']);
		var color = A2(
			$elm$core$Maybe$withDefault,
			'#2c3e50',
			A2($author$project$Main$getAt, suitIdx, colors));
		return {color: color, display: display, suit: suit, value: val};
	});
var $elm$core$Dict$RBEmpty_elm_builtin = {$: 'RBEmpty_elm_builtin'};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$random$Random$Generate = function (a) {
	return {$: 'Generate', a: a};
};
var $elm$random$Random$Seed = F2(
	function (a, b) {
		return {$: 'Seed', a: a, b: b};
	});
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm$random$Random$next = function (_v0) {
	var state0 = _v0.a;
	var incr = _v0.b;
	return A2($elm$random$Random$Seed, ((state0 * 1664525) + incr) >>> 0, incr);
};
var $elm$random$Random$initialSeed = function (x) {
	var _v0 = $elm$random$Random$next(
		A2($elm$random$Random$Seed, 0, 1013904223));
	var state1 = _v0.a;
	var incr = _v0.b;
	var state2 = (state1 + x) >>> 0;
	return $elm$random$Random$next(
		A2($elm$random$Random$Seed, state2, incr));
};
var $elm$time$Time$Name = function (a) {
	return {$: 'Name', a: a};
};
var $elm$time$Time$Offset = function (a) {
	return {$: 'Offset', a: a};
};
var $elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 'Zone', a: a, b: b};
	});
var $elm$time$Time$customZone = $elm$time$Time$Zone;
var $elm$time$Time$Posix = function (a) {
	return {$: 'Posix', a: a};
};
var $elm$time$Time$millisToPosix = $elm$time$Time$Posix;
var $elm$time$Time$now = _Time_now($elm$time$Time$millisToPosix);
var $elm$time$Time$posixToMillis = function (_v0) {
	var millis = _v0.a;
	return millis;
};
var $elm$random$Random$init = A2(
	$elm$core$Task$andThen,
	function (time) {
		return $elm$core$Task$succeed(
			$elm$random$Random$initialSeed(
				$elm$time$Time$posixToMillis(time)));
	},
	$elm$time$Time$now);
var $elm$random$Random$step = F2(
	function (_v0, seed) {
		var generator = _v0.a;
		return generator(seed);
	});
var $elm$random$Random$onEffects = F3(
	function (router, commands, seed) {
		if (!commands.b) {
			return $elm$core$Task$succeed(seed);
		} else {
			var generator = commands.a.a;
			var rest = commands.b;
			var _v1 = A2($elm$random$Random$step, generator, seed);
			var value = _v1.a;
			var newSeed = _v1.b;
			return A2(
				$elm$core$Task$andThen,
				function (_v2) {
					return A3($elm$random$Random$onEffects, router, rest, newSeed);
				},
				A2($elm$core$Platform$sendToApp, router, value));
		}
	});
var $elm$random$Random$onSelfMsg = F3(
	function (_v0, _v1, seed) {
		return $elm$core$Task$succeed(seed);
	});
var $elm$random$Random$Generator = function (a) {
	return {$: 'Generator', a: a};
};
var $elm$random$Random$map = F2(
	function (func, _v0) {
		var genA = _v0.a;
		return $elm$random$Random$Generator(
			function (seed0) {
				var _v1 = genA(seed0);
				var a = _v1.a;
				var seed1 = _v1.b;
				return _Utils_Tuple2(
					func(a),
					seed1);
			});
	});
var $elm$random$Random$cmdMap = F2(
	function (func, _v0) {
		var generator = _v0.a;
		return $elm$random$Random$Generate(
			A2($elm$random$Random$map, func, generator));
	});
_Platform_effectManagers['Random'] = _Platform_createManager($elm$random$Random$init, $elm$random$Random$onEffects, $elm$random$Random$onSelfMsg, $elm$random$Random$cmdMap);
var $elm$random$Random$command = _Platform_leaf('Random');
var $elm$random$Random$generate = F2(
	function (tagger, generator) {
		return $elm$random$Random$command(
			$elm$random$Random$Generate(
				A2($elm$random$Random$map, tagger, generator)));
	});
var $elm$random$Random$listHelp = F4(
	function (revList, n, gen, seed) {
		listHelp:
		while (true) {
			if (n < 1) {
				return _Utils_Tuple2(revList, seed);
			} else {
				var _v0 = gen(seed);
				var value = _v0.a;
				var newSeed = _v0.b;
				var $temp$revList = A2($elm$core$List$cons, value, revList),
					$temp$n = n - 1,
					$temp$gen = gen,
					$temp$seed = newSeed;
				revList = $temp$revList;
				n = $temp$n;
				gen = $temp$gen;
				seed = $temp$seed;
				continue listHelp;
			}
		}
	});
var $elm$random$Random$list = F2(
	function (n, _v0) {
		var gen = _v0.a;
		return $elm$random$Random$Generator(
			function (seed) {
				return A4($elm$random$Random$listHelp, _List_Nil, n, gen, seed);
			});
	});
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$core$Bitwise$xor = _Bitwise_xor;
var $elm$random$Random$peel = function (_v0) {
	var state = _v0.a;
	var word = (state ^ (state >>> ((state >>> 28) + 4))) * 277803737;
	return ((word >>> 22) ^ word) >>> 0;
};
var $elm$random$Random$int = F2(
	function (a, b) {
		return $elm$random$Random$Generator(
			function (seed0) {
				var _v0 = (_Utils_cmp(a, b) < 0) ? _Utils_Tuple2(a, b) : _Utils_Tuple2(b, a);
				var lo = _v0.a;
				var hi = _v0.b;
				var range = (hi - lo) + 1;
				if (!((range - 1) & range)) {
					return _Utils_Tuple2(
						(((range - 1) & $elm$random$Random$peel(seed0)) >>> 0) + lo,
						$elm$random$Random$next(seed0));
				} else {
					var threshhold = (((-range) >>> 0) % range) >>> 0;
					var accountForBias = function (seed) {
						accountForBias:
						while (true) {
							var x = $elm$random$Random$peel(seed);
							var seedN = $elm$random$Random$next(seed);
							if (_Utils_cmp(x, threshhold) < 0) {
								var $temp$seed = seedN;
								seed = $temp$seed;
								continue accountForBias;
							} else {
								return _Utils_Tuple2((x % range) + lo, seedN);
							}
						}
					};
					return accountForBias(seed0);
				}
			});
	});
var $elm$random$Random$map2 = F3(
	function (func, _v0, _v1) {
		var genA = _v0.a;
		var genB = _v1.a;
		return $elm$random$Random$Generator(
			function (seed0) {
				var _v2 = genA(seed0);
				var a = _v2.a;
				var seed1 = _v2.b;
				var _v3 = genB(seed1);
				var b = _v3.a;
				var seed2 = _v3.b;
				return _Utils_Tuple2(
					A2(func, a, b),
					seed2);
			});
	});
var $author$project$Main$randomCard = function (maxVal) {
	return A3(
		$elm$random$Random$map2,
		F2(
			function (val, suitIdx) {
				var suits = _List_fromArray(
					['♠', '♥', '♣', '♦']);
				var suit = A2(
					$elm$core$Maybe$withDefault,
					'♠',
					A2($author$project$Main$getAt, suitIdx, suits));
				var display = function () {
					switch (val) {
						case 1:
							return 'A';
						case 11:
							return 'J';
						case 12:
							return 'Q';
						case 13:
							return 'K';
						default:
							return $elm$core$String$fromInt(val);
					}
				}();
				var colors = _List_fromArray(
					['#2c3e50', '#e74c3c', '#2c3e50', '#e74c3c']);
				var color = A2(
					$elm$core$Maybe$withDefault,
					'#2c3e50',
					A2($author$project$Main$getAt, suitIdx, colors));
				return {color: color, display: display, suit: suit, value: val};
			}),
		A2($elm$random$Random$int, 1, maxVal),
		A2($elm$random$Random$int, 0, 3));
};
var $author$project$Main$generateCards = function (diff) {
	var maxVal = function () {
		switch (diff.$) {
			case 'Easy':
				return 10;
			case 'Normal':
				return 13;
			default:
				return 13;
		}
	}();
	return A2(
		$elm$random$Random$generate,
		$author$project$Main$NewCards,
		A2(
			$elm$random$Random$list,
			4,
			$author$project$Main$randomCard(maxVal)));
};
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (_v0.$ === 'Just') {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$core$String$replace = F3(
	function (before, after, string) {
		return A2(
			$elm$core$String$join,
			after,
			A2($elm$core$String$split, before, string));
	});
var $author$project$Main$parseHashCards = function (hash) {
	if ($elm$core$String$isEmpty(hash)) {
		return $elm$core$Maybe$Nothing;
	} else {
		var nums = A2(
			$elm$core$List$filterMap,
			$elm$core$String$toInt,
			A2(
				$elm$core$String$split,
				',',
				A3($elm$core$String$replace, '#', '', hash)));
		return ($elm$core$List$length(nums) === 4) ? $elm$core$Maybe$Just(nums) : $elm$core$Maybe$Nothing;
	}
};
var $author$project$Main$init = function (flags) {
	var baseModel = {
		achievementTimer: 0,
		achievements: _List_Nil,
		allSolutions: _List_Nil,
		bestStreak: 0,
		canInstallPWA: false,
		cards: _List_Nil,
		comboDisplay: $elm$core$Maybe$Nothing,
		comboTimer: 0,
		dailyBestTime: 0,
		dailyCompleted: false,
		dailyDate: flags.today,
		dailyHistory: _List_Nil,
		difficulty: $author$project$Main$Normal,
		fastestSolve: 0,
		gameMode: $author$project$Main$Classic,
		hintLevel: 0,
		hintText: '',
		history: _List_Nil,
		input: '',
		inputHint: '',
		isOnline: true,
		keypadEnabled: true,
		liveResult: '',
		message: '点击「新游戏」开始24点挑战！',
		messageType: $author$project$Main$Info,
		newAchievements: _List_Nil,
		pendingNewCards: false,
		reduceMotion: flags.prefersReducedMotion,
		sfxEnabled: true,
		sharedCount: 0,
		shieldActive: false,
		showAllAnswers: false,
		showHint: false,
		showSkippedProblems: false,
		showSteps: false,
		showTutorial: flags.isFirstVisit,
		skipped: 0,
		skippedProblems: _List_Nil,
		solved: 0,
		solverCache: $elm$core$Dict$empty,
		stepByStep: _List_Nil,
		stepsWithKeypad: 0,
		streak: 0,
		theme: flags.prefersDark ? $author$project$Main$Dark : $author$project$Main$Light,
		timeAttackBest: 0,
		timeAttackHistory: _List_Nil,
		timeAttackScore: 0,
		timeAttackTotalQuestions: 0,
		timeLeft: 0,
		timer: 0,
		totalAttempts: 0,
		totalGames: 0,
		totalTime: 0
	};
	var _v0 = $author$project$Main$parseHashCards(flags.hash);
	if (_v0.$ === 'Just') {
		var values = _v0.a;
		var cards = A2($elm$core$List$indexedMap, $author$project$Main$createCard, values);
		return _Utils_Tuple2(
			_Utils_update(
				baseModel,
				{message: '好友分享的题目！来挑战吧！', messageType: $author$project$Main$Info}),
			A2(
				$elm$core$Task$perform,
				$author$project$Main$NewCards,
				$elm$core$Task$succeed(cards)));
	} else {
		return _Utils_Tuple2(
			baseModel,
			$author$project$Main$generateCards($author$project$Main$Normal));
	}
};
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$Main$InstallPromptChanged = function (a) {
	return {$: 'InstallPromptChanged', a: a};
};
var $author$project$Main$NetworkChanged = function (a) {
	return {$: 'NetworkChanged', a: a};
};
var $author$project$Main$ReceiveSFXSetting = function (a) {
	return {$: 'ReceiveSFXSetting', a: a};
};
var $author$project$Main$StorageLoaded = function (a) {
	return {$: 'StorageLoaded', a: a};
};
var $author$project$Main$Tick = function (a) {
	return {$: 'Tick', a: a};
};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$time$Time$Every = F2(
	function (a, b) {
		return {$: 'Every', a: a, b: b};
	});
var $elm$time$Time$State = F2(
	function (taggers, processes) {
		return {processes: processes, taggers: taggers};
	});
var $elm$time$Time$init = $elm$core$Task$succeed(
	A2($elm$time$Time$State, $elm$core$Dict$empty, $elm$core$Dict$empty));
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1.$) {
					case 'LT':
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 'EQ':
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$core$Dict$Black = {$: 'Black'};
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: 'RBNode_elm_builtin', a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = {$: 'Red'};
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Red')) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) && (left.d.$ === 'RBNode_elm_builtin')) && (left.d.a.$ === 'Red')) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1.$) {
				case 'LT':
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 'EQ':
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$time$Time$addMySub = F2(
	function (_v0, state) {
		var interval = _v0.a;
		var tagger = _v0.b;
		var _v1 = A2($elm$core$Dict$get, interval, state);
		if (_v1.$ === 'Nothing') {
			return A3(
				$elm$core$Dict$insert,
				interval,
				_List_fromArray(
					[tagger]),
				state);
		} else {
			var taggers = _v1.a;
			return A3(
				$elm$core$Dict$insert,
				interval,
				A2($elm$core$List$cons, tagger, taggers),
				state);
		}
	});
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _v0) {
				stepState:
				while (true) {
					var list = _v0.a;
					var result = _v0.b;
					if (!list.b) {
						return _Utils_Tuple2(
							list,
							A3(rightStep, rKey, rValue, result));
					} else {
						var _v2 = list.a;
						var lKey = _v2.a;
						var lValue = _v2.b;
						var rest = list.b;
						if (_Utils_cmp(lKey, rKey) < 0) {
							var $temp$rKey = rKey,
								$temp$rValue = rValue,
								$temp$_v0 = _Utils_Tuple2(
								rest,
								A3(leftStep, lKey, lValue, result));
							rKey = $temp$rKey;
							rValue = $temp$rValue;
							_v0 = $temp$_v0;
							continue stepState;
						} else {
							if (_Utils_cmp(lKey, rKey) > 0) {
								return _Utils_Tuple2(
									list,
									A3(rightStep, rKey, rValue, result));
							} else {
								return _Utils_Tuple2(
									rest,
									A4(bothStep, lKey, lValue, rValue, result));
							}
						}
					}
				}
			});
		var _v3 = A3(
			$elm$core$Dict$foldl,
			stepState,
			_Utils_Tuple2(
				$elm$core$Dict$toList(leftDict),
				initialResult),
			rightDict);
		var leftovers = _v3.a;
		var intermediateResult = _v3.b;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v4, result) {
					var k = _v4.a;
					var v = _v4.b;
					return A3(leftStep, k, v, result);
				}),
			intermediateResult,
			leftovers);
	});
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$time$Time$setInterval = _Time_setInterval;
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$time$Time$spawnHelp = F3(
	function (router, intervals, processes) {
		if (!intervals.b) {
			return $elm$core$Task$succeed(processes);
		} else {
			var interval = intervals.a;
			var rest = intervals.b;
			var spawnTimer = $elm$core$Process$spawn(
				A2(
					$elm$time$Time$setInterval,
					interval,
					A2($elm$core$Platform$sendToSelf, router, interval)));
			var spawnRest = function (id) {
				return A3(
					$elm$time$Time$spawnHelp,
					router,
					rest,
					A3($elm$core$Dict$insert, interval, id, processes));
			};
			return A2($elm$core$Task$andThen, spawnRest, spawnTimer);
		}
	});
var $elm$time$Time$onEffects = F3(
	function (router, subs, _v0) {
		var processes = _v0.processes;
		var rightStep = F3(
			function (_v6, id, _v7) {
				var spawns = _v7.a;
				var existing = _v7.b;
				var kills = _v7.c;
				return _Utils_Tuple3(
					spawns,
					existing,
					A2(
						$elm$core$Task$andThen,
						function (_v5) {
							return kills;
						},
						$elm$core$Process$kill(id)));
			});
		var newTaggers = A3($elm$core$List$foldl, $elm$time$Time$addMySub, $elm$core$Dict$empty, subs);
		var leftStep = F3(
			function (interval, taggers, _v4) {
				var spawns = _v4.a;
				var existing = _v4.b;
				var kills = _v4.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, interval, spawns),
					existing,
					kills);
			});
		var bothStep = F4(
			function (interval, taggers, id, _v3) {
				var spawns = _v3.a;
				var existing = _v3.b;
				var kills = _v3.c;
				return _Utils_Tuple3(
					spawns,
					A3($elm$core$Dict$insert, interval, id, existing),
					kills);
			});
		var _v1 = A6(
			$elm$core$Dict$merge,
			leftStep,
			bothStep,
			rightStep,
			newTaggers,
			processes,
			_Utils_Tuple3(
				_List_Nil,
				$elm$core$Dict$empty,
				$elm$core$Task$succeed(_Utils_Tuple0)));
		var spawnList = _v1.a;
		var existingDict = _v1.b;
		var killTask = _v1.c;
		return A2(
			$elm$core$Task$andThen,
			function (newProcesses) {
				return $elm$core$Task$succeed(
					A2($elm$time$Time$State, newTaggers, newProcesses));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v2) {
					return A3($elm$time$Time$spawnHelp, router, spawnList, existingDict);
				},
				killTask));
	});
var $elm$time$Time$onSelfMsg = F3(
	function (router, interval, state) {
		var _v0 = A2($elm$core$Dict$get, interval, state.taggers);
		if (_v0.$ === 'Nothing') {
			return $elm$core$Task$succeed(state);
		} else {
			var taggers = _v0.a;
			var tellTaggers = function (time) {
				return $elm$core$Task$sequence(
					A2(
						$elm$core$List$map,
						function (tagger) {
							return A2(
								$elm$core$Platform$sendToApp,
								router,
								tagger(time));
						},
						taggers));
			};
			return A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$succeed(state);
				},
				A2($elm$core$Task$andThen, tellTaggers, $elm$time$Time$now));
		}
	});
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$time$Time$subMap = F2(
	function (f, _v0) {
		var interval = _v0.a;
		var tagger = _v0.b;
		return A2(
			$elm$time$Time$Every,
			interval,
			A2($elm$core$Basics$composeL, f, tagger));
	});
_Platform_effectManagers['Time'] = _Platform_createManager($elm$time$Time$init, $elm$time$Time$onEffects, $elm$time$Time$onSelfMsg, 0, $elm$time$Time$subMap);
var $elm$time$Time$subscription = _Platform_leaf('Time');
var $elm$time$Time$every = F2(
	function (interval, tagger) {
		return $elm$time$Time$subscription(
			A2($elm$time$Time$Every, interval, tagger));
	});
var $author$project$Main$networkStatus = _Platform_incomingPort('networkStatus', $elm$json$Json$Decode$bool);
var $author$project$Main$receiveFromStorage = _Platform_incomingPort('receiveFromStorage', $elm$json$Json$Decode$string);
var $author$project$Main$receiveSFXSetting = _Platform_incomingPort('receiveSFXSetting', $elm$json$Json$Decode$bool);
var $author$project$Main$trackInstallPrompt = _Platform_incomingPort('trackInstallPrompt', $elm$json$Json$Decode$bool);
var $author$project$Main$subscriptions = function (model) {
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				A2($elm$time$Time$every, 1000, $author$project$Main$Tick),
				$author$project$Main$receiveFromStorage($author$project$Main$StorageLoaded),
				$author$project$Main$trackInstallPrompt($author$project$Main$InstallPromptChanged),
				$author$project$Main$networkStatus($author$project$Main$NetworkChanged),
				$author$project$Main$receiveSFXSetting($author$project$Main$ReceiveSFXSetting)
			]));
};
var $author$project$Main$Daily = {$: 'Daily'};
var $author$project$Main$DelayedNewCards = {$: 'DelayedNewCards'};
var $author$project$Main$Error = {$: 'Error'};
var $author$project$Main$Hard = {$: 'Hard'};
var $author$project$Main$NoOp = {$: 'NoOp'};
var $author$project$Main$Review = {$: 'Review'};
var $author$project$Main$TimeAttack = {$: 'TimeAttack'};
var $elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $author$project$Main$addToHistory = F2(
	function (input, hist) {
		return $elm$core$String$isEmpty(input) ? hist : (A2($elm$core$List$member, input, hist) ? hist : A2($elm$core$List$cons, input, hist));
	});
var $elm$core$Task$onError = _Scheduler_onError;
var $elm$core$Task$attempt = F2(
	function (resultToMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2(
					$elm$core$Task$onError,
					A2(
						$elm$core$Basics$composeL,
						A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
						$elm$core$Result$Err),
					A2(
						$elm$core$Task$andThen,
						A2(
							$elm$core$Basics$composeL,
							A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
							$elm$core$Result$Ok),
						task))));
	});
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$String$indices = _String_indexes;
var $author$project$Main$checkBrackets = function (s) {
	var opens = $elm$core$List$length(
		A2($elm$core$String$indices, '(', s));
	var closes = $elm$core$List$length(
		A2($elm$core$String$indices, ')', s));
	return (_Utils_cmp(opens, closes) > 0) ? ('缺少 ' + ($elm$core$String$fromInt(opens - closes) + ' 个 )')) : ((_Utils_cmp(closes, opens) > 0) ? ('缺少 ' + ($elm$core$String$fromInt(closes - opens) + ' 个 (')) : '');
};
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (maybeValue.$ === 'Just') {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$Maybe$map2 = F3(
	function (func, ma, mb) {
		if (ma.$ === 'Nothing') {
			return $elm$core$Maybe$Nothing;
		} else {
			var a = ma.a;
			if (mb.$ === 'Nothing') {
				return $elm$core$Maybe$Nothing;
			} else {
				var b = mb.a;
				return $elm$core$Maybe$Just(
					A2(func, a, b));
			}
		}
	});
var $author$project$Main$evalExpr = function (e) {
	switch (e.$) {
		case 'Num':
			var n = e.a;
			return $elm$core$Maybe$Just(n);
		case 'AddE':
			var l = e.a;
			var r = e.b;
			return A3(
				$elm$core$Maybe$map2,
				$elm$core$Basics$add,
				$author$project$Main$evalExpr(l),
				$author$project$Main$evalExpr(r));
		case 'SubE':
			var l = e.a;
			var r = e.b;
			return A3(
				$elm$core$Maybe$map2,
				$elm$core$Basics$sub,
				$author$project$Main$evalExpr(l),
				$author$project$Main$evalExpr(r));
		case 'MulE':
			var l = e.a;
			var r = e.b;
			return A3(
				$elm$core$Maybe$map2,
				$elm$core$Basics$mul,
				$author$project$Main$evalExpr(l),
				$author$project$Main$evalExpr(r));
		default:
			var l = e.a;
			var r = e.b;
			return A2(
				$elm$core$Maybe$andThen,
				function (denom) {
					return (!denom) ? $elm$core$Maybe$Nothing : A2(
						$elm$core$Maybe$map,
						function (num) {
							return num / denom;
						},
						$author$project$Main$evalExpr(l));
				},
				$author$project$Main$evalExpr(r));
	}
};
var $author$project$Main$extractNums = function (e) {
	switch (e.$) {
		case 'Num':
			var n = e.a;
			return _List_fromArray(
				[n]);
		case 'AddE':
			var l = e.a;
			var r = e.b;
			return _Utils_ap(
				$author$project$Main$extractNums(l),
				$author$project$Main$extractNums(r));
		case 'SubE':
			var l = e.a;
			var r = e.b;
			return _Utils_ap(
				$author$project$Main$extractNums(l),
				$author$project$Main$extractNums(r));
		case 'MulE':
			var l = e.a;
			var r = e.b;
			return _Utils_ap(
				$author$project$Main$extractNums(l),
				$author$project$Main$extractNums(r));
		default:
			var l = e.a;
			var r = e.b;
			return _Utils_ap(
				$author$project$Main$extractNums(l),
				$author$project$Main$extractNums(r));
	}
};
var $elm$core$String$fromFloat = _String_fromNumber;
var $elm$core$Basics$round = _Basics_round;
var $author$project$Main$fmt = function (n) {
	return _Utils_eq(
		n,
		$elm$core$Basics$round(n)) ? $elm$core$String$fromInt(
		$elm$core$Basics$round(n)) : $elm$core$String$fromFloat(n);
};
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $elm$core$List$sortBy = _List_sortBy;
var $elm$core$List$sort = function (xs) {
	return A2($elm$core$List$sortBy, $elm$core$Basics$identity, xs);
};
var $author$project$Main$matchCards = F2(
	function (expected, actual) {
		var round3 = function (n) {
			return $elm$core$Basics$round(n * 1000);
		};
		return _Utils_eq(
			$elm$core$List$sort(
				A2($elm$core$List$map, round3, expected)),
			$elm$core$List$sort(
				A2($elm$core$List$map, round3, actual)));
	});
var $elm$core$Basics$not = _Basics_not;
var $author$project$Main$AddE = F2(
	function (a, b) {
		return {$: 'AddE', a: a, b: b};
	});
var $author$project$Main$DivE = F2(
	function (a, b) {
		return {$: 'DivE', a: a, b: b};
	});
var $author$project$Main$MulE = F2(
	function (a, b) {
		return {$: 'MulE', a: a, b: b};
	});
var $author$project$Main$Num = function (a) {
	return {$: 'Num', a: a};
};
var $author$project$Main$SubE = F2(
	function (a, b) {
		return {$: 'SubE', a: a, b: b};
	});
var $elm$core$String$toFloat = _String_toFloat;
var $author$project$Main$parseAddSub = function (tokens) {
	return A2(
		$elm$core$Maybe$andThen,
		function (_v7) {
			var left = _v7.a;
			var rest = _v7.b;
			_v8$2:
			while (true) {
				if (rest.b) {
					switch (rest.a) {
						case '+':
							var r2 = rest.b;
							return A2(
								$elm$core$Maybe$map,
								function (_v9) {
									var right = _v9.a;
									var r3 = _v9.b;
									return _Utils_Tuple2(
										A2($author$project$Main$AddE, left, right),
										r3);
								},
								$author$project$Main$parseAddSub(r2));
						case '-':
							var r2 = rest.b;
							return A2(
								$elm$core$Maybe$map,
								function (_v10) {
									var right = _v10.a;
									var r3 = _v10.b;
									return _Utils_Tuple2(
										A2($author$project$Main$SubE, left, right),
										r3);
								},
								$author$project$Main$parseAddSub(r2));
						default:
							break _v8$2;
					}
				} else {
					break _v8$2;
				}
			}
			return $elm$core$Maybe$Just(
				_Utils_Tuple2(left, rest));
		},
		$author$project$Main$parseMulDiv(tokens));
};
var $author$project$Main$parseExpr = function (tokens) {
	return $author$project$Main$parseAddSub(tokens);
};
var $author$project$Main$parseMulDiv = function (tokens) {
	return A2(
		$elm$core$Maybe$andThen,
		function (_v3) {
			var left = _v3.a;
			var rest = _v3.b;
			_v4$2:
			while (true) {
				if (rest.b) {
					switch (rest.a) {
						case '*':
							var r2 = rest.b;
							return A2(
								$elm$core$Maybe$map,
								function (_v5) {
									var right = _v5.a;
									var r3 = _v5.b;
									return _Utils_Tuple2(
										A2($author$project$Main$MulE, left, right),
										r3);
								},
								$author$project$Main$parseMulDiv(r2));
						case '/':
							var r2 = rest.b;
							return A2(
								$elm$core$Maybe$map,
								function (_v6) {
									var right = _v6.a;
									var r3 = _v6.b;
									return _Utils_Tuple2(
										A2($author$project$Main$DivE, left, right),
										r3);
								},
								$author$project$Main$parseMulDiv(r2));
						default:
							break _v4$2;
					}
				} else {
					break _v4$2;
				}
			}
			return $elm$core$Maybe$Just(
				_Utils_Tuple2(left, rest));
		},
		$author$project$Main$parsePrimary(tokens));
};
var $author$project$Main$parsePrimary = function (tokens) {
	if (tokens.b) {
		if (tokens.a === '(') {
			var rest = tokens.b;
			return A2(
				$elm$core$Maybe$andThen,
				function (_v1) {
					var expr = _v1.a;
					var r2 = _v1.b;
					if (r2.b && (r2.a === ')')) {
						var r3 = r2.b;
						return $elm$core$Maybe$Just(
							_Utils_Tuple2(expr, r3));
					} else {
						return $elm$core$Maybe$Nothing;
					}
				},
				$author$project$Main$parseExpr(rest));
		} else {
			var numStr = tokens.a;
			var rest = tokens.b;
			return A2(
				$elm$core$Maybe$map,
				function (n) {
					return _Utils_Tuple2(
						$author$project$Main$Num(n),
						rest);
				},
				$elm$core$String$toFloat(numStr));
		}
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$String$foldr = _String_foldr;
var $elm$core$String$toList = function (string) {
	return A3($elm$core$String$foldr, $elm$core$List$cons, _List_Nil, string);
};
var $elm$core$String$fromList = _String_fromList;
var $author$project$Main$spanList = F2(
	function (p, list) {
		if (!list.b) {
			return _Utils_Tuple2(_List_Nil, _List_Nil);
		} else {
			var x = list.a;
			var xs = list.b;
			if (p(x)) {
				var _v1 = A2($author$project$Main$spanList, p, xs);
				var ys = _v1.a;
				var zs = _v1.b;
				return _Utils_Tuple2(
					A2($elm$core$List$cons, x, ys),
					zs);
			} else {
				return _Utils_Tuple2(_List_Nil, list);
			}
		}
	});
var $author$project$Main$tokenizeHelp = F2(
	function (acc, chars) {
		tokenizeHelp:
		while (true) {
			if (!chars.b) {
				return $elm$core$List$reverse(acc);
			} else {
				var c = chars.a;
				var rest = chars.b;
				if ($elm$core$Char$isDigit(c) || _Utils_eq(
					c,
					_Utils_chr('.'))) {
					var _v1 = A2(
						$author$project$Main$spanList,
						function (ch) {
							return $elm$core$Char$isDigit(ch) || _Utils_eq(
								ch,
								_Utils_chr('.'));
						},
						A2($elm$core$List$cons, c, rest));
					var digits = _v1.a;
					var remaining = _v1.b;
					var $temp$acc = A2(
						$elm$core$List$cons,
						$elm$core$String$fromList(digits),
						acc),
						$temp$chars = remaining;
					acc = $temp$acc;
					chars = $temp$chars;
					continue tokenizeHelp;
				} else {
					var $temp$acc = A2(
						$elm$core$List$cons,
						$elm$core$String$fromList(
							_List_fromArray(
								[c])),
						acc),
						$temp$chars = rest;
					acc = $temp$acc;
					chars = $temp$chars;
					continue tokenizeHelp;
				}
			}
		}
	});
var $author$project$Main$tokenize = function (s) {
	return A2(
		$author$project$Main$tokenizeHelp,
		_List_Nil,
		$elm$core$String$toList(
			A3($elm$core$String$replace, ' ', '', s)));
};
var $author$project$Main$computeLiveResult = F2(
	function (input, cardValues) {
		if ($elm$core$String$isEmpty(input)) {
			return '';
		} else {
			var tokens = $author$project$Main$tokenize(input);
			var _v0 = $author$project$Main$parseExpr(tokens);
			if (_v0.$ === 'Nothing') {
				return '';
			} else {
				var _v1 = _v0.a;
				var expr = _v1.a;
				var rest = _v1.b;
				if (!$elm$core$List$isEmpty(rest)) {
					return '';
				} else {
					var _v2 = $author$project$Main$evalExpr(expr);
					if (_v2.$ === 'Nothing') {
						return '计算错误';
					} else {
						var result = _v2.a;
						var usedNums = $author$project$Main$extractNums(expr);
						var numsOk = A2($author$project$Main$matchCards, cardValues, usedNums);
						return (!numsOk) ? '' : ('= ' + $author$project$Main$fmt(result));
					}
				}
			}
		}
	});
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $author$project$Main$computeUsedNumsHint = F2(
	function (input, cardValues) {
		if ($elm$core$String$isEmpty(input)) {
			return '';
		} else {
			var _v0 = $author$project$Main$parseExpr(
				$author$project$Main$tokenize(input));
			if (_v0.$ === 'Nothing') {
				return '';
			} else {
				var _v1 = _v0.a;
				var expr = _v1.a;
				var rest = _v1.b;
				if (!$elm$core$List$isEmpty(rest)) {
					return '';
				} else {
					var usedNums = $elm$core$List$sort(
						$author$project$Main$extractNums(expr));
					var expected = $elm$core$List$sort(cardValues);
					var remaining = A2(
						$elm$core$List$filter,
						function (n) {
							return !A2(
								$elm$core$List$member,
								$elm$core$Basics$round(n * 1000),
								A2(
									$elm$core$List$map,
									function (x) {
										return $elm$core$Basics$round(x * 1000);
									},
									usedNums));
						},
						expected);
					if ($elm$core$List$isEmpty(remaining)) {
						return '已用全部数字 ✓';
					} else {
						var usedStr = A2(
							$elm$core$String$join,
							', ',
							A2($elm$core$List$map, $author$project$Main$fmt, usedNums));
						var remStr = A2(
							$elm$core$String$join,
							', ',
							A2($elm$core$List$map, $author$project$Main$fmt, remaining));
						return '已用: ' + (usedStr + (' | 剩余: ' + remStr));
					}
				}
			}
		}
	});
var $elm$json$Json$Encode$string = _Json_wrap;
var $author$project$Main$copyToClipboard = _Platform_outgoingPort('copyToClipboard', $elm$json$Json$Encode$string);
var $author$project$Main$DecodedBase = F8(
	function (bestStreak, totalSolved, totalSkipped, totalTime, achievements, sfxEnabled, history, theme) {
		return {achievements: achievements, bestStreak: bestStreak, history: history, sfxEnabled: sfxEnabled, theme: theme, totalSkipped: totalSkipped, totalSolved: totalSolved, totalTime: totalTime};
	});
var $author$project$Main$ExtraData = F8(
	function (timeAttackBest, dailyCompletedDate, dailyBestTime, fastestSolve, totalAttempts, keypadEnabled, sharedCount, stepsWithKeypad) {
		return {dailyBestTime: dailyBestTime, dailyCompletedDate: dailyCompletedDate, fastestSolve: fastestSolve, keypadEnabled: keypadEnabled, sharedCount: sharedCount, stepsWithKeypad: stepsWithKeypad, timeAttackBest: timeAttackBest, totalAttempts: totalAttempts};
	});
var $author$project$Main$TimeAttackRecord = F3(
	function (score, accuracy, date) {
		return {accuracy: accuracy, date: date, score: score};
	});
var $elm$json$Json$Decode$decodeString = _Json_runOnString;
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $elm$json$Json$Decode$list = _Json_decodeList;
var $elm$json$Json$Decode$map3 = _Json_map3;
var $elm$json$Json$Decode$map8 = _Json_map8;
var $elm$json$Json$Decode$oneOf = _Json_oneOf;
var $elm$json$Json$Decode$maybe = function (decoder) {
	return $elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, decoder),
				$elm$json$Json$Decode$succeed($elm$core$Maybe$Nothing)
			]));
};
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $author$project$Main$themeDecoder = A2(
	$elm$json$Json$Decode$andThen,
	function (s) {
		if (s === 'light') {
			return $elm$json$Json$Decode$succeed($author$project$Main$Light);
		} else {
			return $elm$json$Json$Decode$succeed($author$project$Main$Dark);
		}
	},
	$elm$json$Json$Decode$string);
var $elm$core$Set$Set_elm_builtin = function (a) {
	return {$: 'Set_elm_builtin', a: a};
};
var $elm$core$Set$empty = $elm$core$Set$Set_elm_builtin($elm$core$Dict$empty);
var $elm$core$Set$insert = F2(
	function (key, _v0) {
		var dict = _v0.a;
		return $elm$core$Set$Set_elm_builtin(
			A3($elm$core$Dict$insert, key, _Utils_Tuple0, dict));
	});
var $author$project$Main$unique = function (list) {
	return $elm$core$Set$toList(
		A3(
			$elm$core$List$foldl,
			F2(
				function (x, set) {
					return A2($elm$core$Set$insert, x, set);
				}),
			$elm$core$Set$empty,
			list));
};
var $author$project$Main$decodeStats = F2(
	function (json, model) {
		var timeAttackRecordDecoder = A4(
			$elm$json$Json$Decode$map3,
			$author$project$Main$TimeAttackRecord,
			A2($elm$json$Json$Decode$field, 'score', $elm$json$Json$Decode$int),
			A2(
				$elm$json$Json$Decode$map,
				$elm$core$Maybe$withDefault('N/A'),
				$elm$json$Json$Decode$maybe(
					A2($elm$json$Json$Decode$field, 'accuracy', $elm$json$Json$Decode$string))),
			A2(
				$elm$json$Json$Decode$map,
				$elm$core$Maybe$withDefault(''),
				$elm$json$Json$Decode$maybe(
					A2($elm$json$Json$Decode$field, 'date', $elm$json$Json$Decode$string))));
		var timeAttackHistoryDecoder = $elm$json$Json$Decode$oneOf(
			_List_fromArray(
				[
					$elm$json$Json$Decode$list(timeAttackRecordDecoder),
					A2(
					$elm$json$Json$Decode$map,
					$elm$core$List$map(
						function (score) {
							return {accuracy: 'N/A', date: '', score: score};
						}),
					$elm$json$Json$Decode$list($elm$json$Json$Decode$int))
				]));
		var extraDecoder = A9(
			$elm$json$Json$Decode$map8,
			$author$project$Main$ExtraData,
			A2(
				$elm$json$Json$Decode$map,
				$elm$core$Maybe$withDefault(0),
				$elm$json$Json$Decode$maybe(
					A2($elm$json$Json$Decode$field, 'timeAttackBest', $elm$json$Json$Decode$int))),
			A2(
				$elm$json$Json$Decode$map,
				$elm$core$Maybe$withDefault(''),
				$elm$json$Json$Decode$maybe(
					A2($elm$json$Json$Decode$field, 'dailyCompletedDate', $elm$json$Json$Decode$string))),
			A2(
				$elm$json$Json$Decode$map,
				$elm$core$Maybe$withDefault(0),
				$elm$json$Json$Decode$maybe(
					A2($elm$json$Json$Decode$field, 'dailyBestTime', $elm$json$Json$Decode$int))),
			A2(
				$elm$json$Json$Decode$map,
				$elm$core$Maybe$withDefault(0),
				$elm$json$Json$Decode$maybe(
					A2($elm$json$Json$Decode$field, 'fastestSolve', $elm$json$Json$Decode$int))),
			A2(
				$elm$json$Json$Decode$map,
				$elm$core$Maybe$withDefault(0),
				$elm$json$Json$Decode$maybe(
					A2($elm$json$Json$Decode$field, 'totalAttempts', $elm$json$Json$Decode$int))),
			A2(
				$elm$json$Json$Decode$map,
				$elm$core$Maybe$withDefault(true),
				$elm$json$Json$Decode$maybe(
					A2($elm$json$Json$Decode$field, 'keypadEnabled', $elm$json$Json$Decode$bool))),
			A2(
				$elm$json$Json$Decode$map,
				$elm$core$Maybe$withDefault(0),
				$elm$json$Json$Decode$maybe(
					A2($elm$json$Json$Decode$field, 'sharedCount', $elm$json$Json$Decode$int))),
			A2(
				$elm$json$Json$Decode$map,
				$elm$core$Maybe$withDefault(0),
				$elm$json$Json$Decode$maybe(
					A2($elm$json$Json$Decode$field, 'stepsWithKeypad', $elm$json$Json$Decode$int))));
		var baseDecoder = A9(
			$elm$json$Json$Decode$map8,
			$author$project$Main$DecodedBase,
			A2(
				$elm$json$Json$Decode$map,
				$elm$core$Maybe$withDefault(0),
				$elm$json$Json$Decode$maybe(
					A2($elm$json$Json$Decode$field, 'bestStreak', $elm$json$Json$Decode$int))),
			A2(
				$elm$json$Json$Decode$map,
				$elm$core$Maybe$withDefault(0),
				$elm$json$Json$Decode$maybe(
					A2($elm$json$Json$Decode$field, 'totalSolved', $elm$json$Json$Decode$int))),
			A2(
				$elm$json$Json$Decode$map,
				$elm$core$Maybe$withDefault(0),
				$elm$json$Json$Decode$maybe(
					A2($elm$json$Json$Decode$field, 'totalSkipped', $elm$json$Json$Decode$int))),
			A2(
				$elm$json$Json$Decode$map,
				$elm$core$Maybe$withDefault(0),
				$elm$json$Json$Decode$maybe(
					A2($elm$json$Json$Decode$field, 'totalTime', $elm$json$Json$Decode$int))),
			A2(
				$elm$json$Json$Decode$map,
				$elm$core$Maybe$withDefault(_List_Nil),
				$elm$json$Json$Decode$maybe(
					A2(
						$elm$json$Json$Decode$field,
						'achievements',
						$elm$json$Json$Decode$list($elm$json$Json$Decode$string)))),
			A2(
				$elm$json$Json$Decode$map,
				$elm$core$Maybe$withDefault(true),
				$elm$json$Json$Decode$maybe(
					A2($elm$json$Json$Decode$field, 'sfxEnabled', $elm$json$Json$Decode$bool))),
			A2(
				$elm$json$Json$Decode$map,
				$elm$core$Maybe$withDefault(_List_Nil),
				$elm$json$Json$Decode$maybe(
					A2(
						$elm$json$Json$Decode$field,
						'history',
						$elm$json$Json$Decode$list($elm$json$Json$Decode$string)))),
			A2(
				$elm$json$Json$Decode$map,
				$elm$core$Maybe$withDefault($author$project$Main$Dark),
				$elm$json$Json$Decode$maybe(
					A2($elm$json$Json$Decode$field, 'theme', $author$project$Main$themeDecoder))));
		var fullDecoder = A4(
			$elm$json$Json$Decode$map3,
			F3(
				function (base, extra, _v1) {
					var tah = _v1.a;
					var dh = _v1.b;
					return _Utils_update(
						model,
						{
							achievements: $author$project$Main$unique(
								_Utils_ap(model.achievements, base.achievements)),
							bestStreak: A2($elm$core$Basics$max, model.bestStreak, base.bestStreak),
							dailyBestTime: A2($elm$core$Basics$max, model.dailyBestTime, extra.dailyBestTime),
							dailyCompleted: _Utils_eq(extra.dailyCompletedDate, model.dailyDate),
							dailyHistory: dh,
							fastestSolve: (extra.fastestSolve > 0) ? extra.fastestSolve : model.fastestSolve,
							history: A2(
								$elm$core$List$take,
								20,
								_Utils_ap(model.history, base.history)),
							keypadEnabled: extra.keypadEnabled,
							sfxEnabled: base.sfxEnabled,
							sharedCount: A2($elm$core$Basics$max, model.sharedCount, extra.sharedCount),
							skipped: A2($elm$core$Basics$max, model.skipped, base.totalSkipped),
							solved: A2($elm$core$Basics$max, model.solved, base.totalSolved),
							stepsWithKeypad: A2($elm$core$Basics$max, model.stepsWithKeypad, extra.stepsWithKeypad),
							theme: base.theme,
							timeAttackBest: A2($elm$core$Basics$max, model.timeAttackBest, extra.timeAttackBest),
							timeAttackHistory: tah,
							totalAttempts: A2($elm$core$Basics$max, model.totalAttempts, extra.totalAttempts),
							totalTime: A2($elm$core$Basics$max, model.totalTime, base.totalTime)
						});
				}),
			baseDecoder,
			extraDecoder,
			A3(
				$elm$json$Json$Decode$map2,
				$elm$core$Tuple$pair,
				A2(
					$elm$json$Json$Decode$map,
					$elm$core$Maybe$withDefault(_List_Nil),
					$elm$json$Json$Decode$maybe(
						A2($elm$json$Json$Decode$field, 'timeAttackHistory', timeAttackHistoryDecoder))),
				A2(
					$elm$json$Json$Decode$map,
					$elm$core$Maybe$withDefault(_List_Nil),
					$elm$json$Json$Decode$maybe(
						A2(
							$elm$json$Json$Decode$field,
							'dailyHistory',
							$elm$json$Json$Decode$list($elm$json$Json$Decode$string))))));
		var _v0 = A2($elm$json$Json$Decode$decodeString, fullDecoder, json);
		if (_v0.$ === 'Ok') {
			var newModel = _v0.a;
			return newModel;
		} else {
			return model;
		}
	});
var $author$project$Main$difficultyName = function (diff) {
	switch (diff.$) {
		case 'Easy':
			return '初级（1-10）';
		case 'Normal':
			return '中级（1-13）';
		default:
			return '高级（必须用除法）';
	}
};
var $elm$core$String$dropRight = F2(
	function (n, string) {
		return (n < 1) ? string : A3($elm$core$String$slice, 0, -n, string);
	});
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$json$Json$Encode$int = _Json_wrap;
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(_Utils_Tuple0),
			pairs));
};
var $author$project$Main$encodeTimeAttackRecord = function (rec) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'score',
				$elm$json$Json$Encode$int(rec.score)),
				_Utils_Tuple2(
				'accuracy',
				$elm$json$Json$Encode$string(rec.accuracy)),
				_Utils_Tuple2(
				'date',
				$elm$json$Json$Encode$string(rec.date))
			]));
};
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(_Utils_Tuple0),
				entries));
	});
var $author$project$Main$themeEncoder = function (t) {
	if (t.$ === 'Dark') {
		return $elm$json$Json$Encode$string('dark');
	} else {
		return $elm$json$Json$Encode$string('light');
	}
};
var $author$project$Main$encodeStats = function (model) {
	return A2(
		$elm$json$Json$Encode$encode,
		0,
		$elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'bestStreak',
					$elm$json$Json$Encode$int(model.bestStreak)),
					_Utils_Tuple2(
					'totalSolved',
					$elm$json$Json$Encode$int(model.solved)),
					_Utils_Tuple2(
					'totalSkipped',
					$elm$json$Json$Encode$int(model.skipped)),
					_Utils_Tuple2(
					'totalTime',
					$elm$json$Json$Encode$int(model.totalTime)),
					_Utils_Tuple2(
					'achievements',
					A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, model.achievements)),
					_Utils_Tuple2(
					'sfxEnabled',
					$elm$json$Json$Encode$bool(model.sfxEnabled)),
					_Utils_Tuple2(
					'history',
					A2(
						$elm$json$Json$Encode$list,
						$elm$json$Json$Encode$string,
						A2($elm$core$List$take, 20, model.history))),
					_Utils_Tuple2(
					'theme',
					$author$project$Main$themeEncoder(model.theme)),
					_Utils_Tuple2(
					'timeAttackBest',
					$elm$json$Json$Encode$int(model.timeAttackBest)),
					_Utils_Tuple2(
					'dailyCompletedDate',
					$elm$json$Json$Encode$string(
						model.dailyCompleted ? model.dailyDate : '')),
					_Utils_Tuple2(
					'dailyBestTime',
					$elm$json$Json$Encode$int(model.dailyBestTime)),
					_Utils_Tuple2(
					'fastestSolve',
					$elm$json$Json$Encode$int(model.fastestSolve)),
					_Utils_Tuple2(
					'totalAttempts',
					$elm$json$Json$Encode$int(model.totalAttempts)),
					_Utils_Tuple2(
					'keypadEnabled',
					$elm$json$Json$Encode$bool(model.keypadEnabled)),
					_Utils_Tuple2(
					'sharedCount',
					$elm$json$Json$Encode$int(model.sharedCount)),
					_Utils_Tuple2(
					'stepsWithKeypad',
					$elm$json$Json$Encode$int(model.stepsWithKeypad)),
					_Utils_Tuple2(
					'timeAttackHistory',
					A2($elm$json$Json$Encode$list, $author$project$Main$encodeTimeAttackRecord, model.timeAttackHistory))
				])));
};
var $author$project$Main$exprHasDiv = function (e) {
	switch (e.$) {
		case 'Num':
			return false;
		case 'DivE':
			return true;
		case 'AddE':
			var l = e.a;
			var r = e.b;
			return $author$project$Main$exprHasDiv(l) || $author$project$Main$exprHasDiv(r);
		case 'SubE':
			var l = e.a;
			var r = e.b;
			return $author$project$Main$exprHasDiv(l) || $author$project$Main$exprHasDiv(r);
		default:
			var l = e.a;
			var r = e.b;
			return $author$project$Main$exprHasDiv(l) || $author$project$Main$exprHasDiv(r);
	}
};
var $elm$browser$Browser$Dom$focus = _Browser_call('focus');
var $elm$core$Basics$ge = _Utils_ge;
var $elm$core$String$foldl = _String_foldl;
var $elm$core$Basics$modBy = _Basics_modBy;
var $author$project$Main$dateSeedInt = function (s) {
	return A3(
		$elm$core$String$foldl,
		F2(
			function (c, acc) {
				return A2(
					$elm$core$Basics$modBy,
					2147483647,
					(acc * 31) + $elm$core$Char$toCode(c));
			}),
		0,
		s);
};
var $author$project$Main$Add = {$: 'Add'};
var $author$project$Main$Div = {$: 'Div'};
var $author$project$Main$Mul = {$: 'Mul'};
var $author$project$Main$Sub = {$: 'Sub'};
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $author$project$Main$allPairs = function (n) {
	return A2(
		$elm$core$List$concatMap,
		function (i) {
			return A2(
				$elm$core$List$map,
				function (j) {
					return _Utils_Tuple2(i, j);
				},
				A2($elm$core$List$range, i + 1, n - 1));
		},
		A2($elm$core$List$range, 0, n - 2));
};
var $author$project$Main$applyOp = F3(
	function (op, a, b) {
		switch (op.$) {
			case 'Add':
				return $elm$core$Maybe$Just(a + b);
			case 'Sub':
				return $elm$core$Maybe$Just(a - b);
			case 'Mul':
				return $elm$core$Maybe$Just(a * b);
			default:
				return (!b) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(a / b);
		}
	});
var $author$project$Main$opSymbol = function (op) {
	switch (op.$) {
		case 'Add':
			return '+';
		case 'Sub':
			return '-';
		case 'Mul':
			return '*';
		default:
			return '/';
	}
};
var $author$project$Main$removeAt = F2(
	function (idx, list) {
		return _Utils_ap(
			A2($elm$core$List$take, idx, list),
			A2($elm$core$List$drop, idx + 1, list));
	});
var $author$project$Main$combinePair = F2(
	function (vals, _v1) {
		var i = _v1.a;
		var j = _v1.b;
		var rest = A2(
			$author$project$Main$removeAt,
			j - 1,
			A2($author$project$Main$removeAt, i, vals));
		var b = A2(
			$elm$core$Maybe$withDefault,
			{expr: '0', value: 0},
			A2($author$project$Main$getAt, j, vals));
		var a = A2(
			$elm$core$Maybe$withDefault,
			{expr: '0', value: 0},
			A2($author$project$Main$getAt, i, vals));
		return A2(
			$elm$core$List$concatMap,
			function (_v2) {
				var left = _v2.a;
				var right = _v2.b;
				return A2(
					$elm$core$List$concatMap,
					function (op) {
						var _v3 = A3($author$project$Main$applyOp, op, left.value, right.value);
						if (_v3.$ === 'Nothing') {
							return _List_Nil;
						} else {
							var result = _v3.a;
							var combo = {
								expr: '(' + (left.expr + ($author$project$Main$opSymbol(op) + (right.expr + ')'))),
								value: result
							};
							return $author$project$Main$compute(
								A2($elm$core$List$cons, combo, rest));
						}
					},
					_List_fromArray(
						[$author$project$Main$Add, $author$project$Main$Sub, $author$project$Main$Mul, $author$project$Main$Div]));
			},
			_List_fromArray(
				[
					_Utils_Tuple2(a, b),
					_Utils_Tuple2(b, a)
				]));
	});
var $author$project$Main$compute = function (vals) {
	if (vals.b && (!vals.b.b)) {
		var v = vals.a;
		return _List_fromArray(
			[v]);
	} else {
		return A2(
			$elm$core$List$concatMap,
			$author$project$Main$combinePair(vals),
			$author$project$Main$allPairs(
				$elm$core$List$length(vals)));
	}
};
var $author$project$Main$needsParens = F3(
	function (isRight, parent, child) {
		return (_Utils_cmp(child, parent) < 0) || (isRight && _Utils_eq(child, parent));
	});
var $author$project$Main$exprToStr = F3(
	function (parentPrec, isRight, e) {
		switch (e.$) {
			case 'Num':
				var n = e.a;
				return $author$project$Main$fmt(n);
			case 'AddE':
				var l = e.a;
				var r = e.b;
				var s = A3($author$project$Main$exprToStr, 1, false, l) + ('+' + A3($author$project$Main$exprToStr, 1, false, r));
				return A3($author$project$Main$needsParens, false, parentPrec, 1) ? ('(' + (s + ')')) : s;
			case 'SubE':
				var l = e.a;
				var r = e.b;
				var s = A3($author$project$Main$exprToStr, 1, false, l) + ('-' + A3($author$project$Main$exprToStr, 1, true, r));
				return A3($author$project$Main$needsParens, false, parentPrec, 1) ? ('(' + (s + ')')) : s;
			case 'MulE':
				var l = e.a;
				var r = e.b;
				var s = A3($author$project$Main$exprToStr, 2, false, l) + ('*' + A3($author$project$Main$exprToStr, 2, false, r));
				return A3($author$project$Main$needsParens, false, parentPrec, 2) ? ('(' + (s + ')')) : s;
			default:
				var l = e.a;
				var r = e.b;
				var s = A3($author$project$Main$exprToStr, 2, false, l) + ('/' + A3($author$project$Main$exprToStr, 2, true, r));
				return A3($author$project$Main$needsParens, false, parentPrec, 2) ? ('(' + (s + ')')) : s;
		}
	});
var $author$project$Main$exprToStringSimplified = function (e) {
	return A3($author$project$Main$exprToStr, 1, false, e);
};
var $author$project$Main$simplifySolution = function (s) {
	var _v0 = $author$project$Main$parseExpr(
		$author$project$Main$tokenize(s));
	if (_v0.$ === 'Just') {
		var _v1 = _v0.a;
		var expr = _v1.a;
		var rest = _v1.b;
		return $elm$core$List$isEmpty(rest) ? $author$project$Main$exprToStringSimplified(expr) : s;
	} else {
		return s;
	}
};
var $author$project$Main$solve24 = function (nums) {
	var initVals = A2(
		$elm$core$List$map,
		function (n) {
			return {
				expr: $author$project$Main$fmt(n),
				value: n
			};
		},
		nums);
	var allExprs = $author$project$Main$compute(initVals);
	var solutions = A2(
		$elm$core$List$filter,
		function (e) {
			return $elm$core$Basics$abs(e.value - 24) < 0.00001;
		},
		allExprs);
	return $elm$core$List$sort(
		$author$project$Main$unique(
			A2(
				$elm$core$List$map,
				function (e) {
					return $author$project$Main$simplifySolution(e.expr);
				},
				solutions)));
};
var $author$project$Main$generateDailyCards = function (dateStr) {
	var tryFindSuitable = F2(
		function (initSeed, attempt) {
			tryFindSuitable:
			while (true) {
				var generator = A2(
					$elm$random$Random$list,
					4,
					$author$project$Main$randomCard(13));
				var _v0 = A2($elm$random$Random$step, generator, initSeed);
				var dailyCards = _v0.a;
				var nextSeed = _v0.b;
				if ($elm$core$List$isEmpty(
					$author$project$Main$solve24(
						A2(
							$elm$core$List$map,
							function (c) {
								return c.value;
							},
							dailyCards))) && (attempt < 100)) {
					var $temp$initSeed = nextSeed,
						$temp$attempt = attempt + 1;
					initSeed = $temp$initSeed;
					attempt = $temp$attempt;
					continue tryFindSuitable;
				} else {
					return dailyCards;
				}
			}
		});
	var dailySeed = $elm$random$Random$initialSeed(
		$author$project$Main$dateSeedInt(dateStr));
	var cards = A2(tryFindSuitable, dailySeed, 0);
	return A2(
		$elm$core$Task$perform,
		$author$project$Main$NewCards,
		$elm$core$Task$succeed(cards));
};
var $author$project$Main$hintOpName = function (expr) {
	switch (expr.$) {
		case 'AddE':
			return '加法';
		case 'SubE':
			return '减法';
		case 'MulE':
			return '乘法';
		case 'DivE':
			return '除法';
		default:
			return '';
	}
};
var $author$project$Main$hintLevel1 = function (expr) {
	if (expr.$ === 'Num') {
		var n = expr.a;
		return '答案就是 ' + $author$project$Main$fmt(n);
	} else {
		var op = $author$project$Main$hintOpName(expr);
		return '提示：试着用' + (op + '来完成最后一步');
	}
};
var $author$project$Main$hintLevel2 = function (expr) {
	switch (expr.$) {
		case 'Num':
			var n = expr.a;
			return '答案就是 ' + $author$project$Main$fmt(n);
		case 'AddE':
			var l = expr.a;
			var r = expr.b;
			var _v1 = _Utils_Tuple2(
				$author$project$Main$evalExpr(l),
				$author$project$Main$evalExpr(r));
			if ((_v1.a.$ === 'Just') && (_v1.b.$ === 'Just')) {
				var lv = _v1.a.a;
				var rv = _v1.b.a;
				return '提示：' + ($author$project$Main$fmt(lv) + (' + ' + ($author$project$Main$fmt(rv) + ' = 24')));
			} else {
				return $author$project$Main$hintLevel1(expr);
			}
		case 'SubE':
			var l = expr.a;
			var r = expr.b;
			var _v2 = _Utils_Tuple2(
				$author$project$Main$evalExpr(l),
				$author$project$Main$evalExpr(r));
			if ((_v2.a.$ === 'Just') && (_v2.b.$ === 'Just')) {
				var lv = _v2.a.a;
				var rv = _v2.b.a;
				return '提示：' + ($author$project$Main$fmt(lv) + (' - ' + ($author$project$Main$fmt(rv) + ' = 24')));
			} else {
				return $author$project$Main$hintLevel1(expr);
			}
		case 'MulE':
			var l = expr.a;
			var r = expr.b;
			var _v3 = _Utils_Tuple2(
				$author$project$Main$evalExpr(l),
				$author$project$Main$evalExpr(r));
			if ((_v3.a.$ === 'Just') && (_v3.b.$ === 'Just')) {
				var lv = _v3.a.a;
				var rv = _v3.b.a;
				return '提示：' + ($author$project$Main$fmt(lv) + (' × ' + ($author$project$Main$fmt(rv) + ' = 24')));
			} else {
				return $author$project$Main$hintLevel1(expr);
			}
		default:
			var l = expr.a;
			var r = expr.b;
			var _v4 = _Utils_Tuple2(
				$author$project$Main$evalExpr(l),
				$author$project$Main$evalExpr(r));
			if ((_v4.a.$ === 'Just') && (_v4.b.$ === 'Just')) {
				var lv = _v4.a.a;
				var rv = _v4.b.a;
				return '提示：' + ($author$project$Main$fmt(lv) + (' ÷ ' + ($author$project$Main$fmt(rv) + ' = 24')));
			} else {
				return $author$project$Main$hintLevel1(expr);
			}
	}
};
var $author$project$Main$getStepHint = F2(
	function (level, solution) {
		var _v0 = $author$project$Main$parseExpr(
			$author$project$Main$tokenize(solution));
		if (_v0.$ === 'Nothing') {
			return solution;
		} else {
			var _v1 = _v0.a;
			var expr = _v1.a;
			var rest = _v1.b;
			if (!$elm$core$List$isEmpty(rest)) {
				return solution;
			} else {
				switch (level) {
					case 1:
						return $author$project$Main$hintLevel1(expr);
					case 2:
						return $author$project$Main$hintLevel2(expr);
					default:
						return '参考解法：' + solution;
				}
			}
		}
	});
var $author$project$Main$Success = {$: 'Success'};
var $author$project$Main$checkAchievements = function (model) {
	var all = _List_fromArray(
		[
			_Utils_Tuple2('首杀', model.solved >= 1),
			_Utils_Tuple2('三连冠', model.streak >= 3),
			_Utils_Tuple2('五连冠', model.streak >= 5),
			_Utils_Tuple2('十连冠', model.streak >= 10),
			_Utils_Tuple2('速算大师', (model.timer <= 10) && (model.solved > 0)),
			_Utils_Tuple2('百题斩', model.solved >= 100),
			_Utils_Tuple2(
			'每日首胜',
			_Utils_eq(model.gameMode, $author$project$Main$Daily) && model.dailyCompleted),
			_Utils_Tuple2('极速60秒', model.timeAttackBest >= 5),
			_Utils_Tuple2('火神', model.streak >= 20),
			_Utils_Tuple2('键盘侠', model.stepsWithKeypad >= 10),
			_Utils_Tuple2('分享达人', model.sharedCount >= 3),
			_Utils_Tuple2('步步为营', model.solved >= 1)
		]);
	return A2(
		$elm$core$List$filterMap,
		function (_v0) {
			var name = _v0.a;
			var cond = _v0.b;
			return (cond && (!A2($elm$core$List$member, name, model.achievements))) ? $elm$core$Maybe$Just(name) : $elm$core$Maybe$Nothing;
		},
		all);
};
var $author$project$Main$countOps = function (e) {
	switch (e.$) {
		case 'Num':
			return 0;
		case 'AddE':
			var l = e.a;
			var r = e.b;
			return (1 + $author$project$Main$countOps(l)) + $author$project$Main$countOps(r);
		case 'SubE':
			var l = e.a;
			var r = e.b;
			return (1 + $author$project$Main$countOps(l)) + $author$project$Main$countOps(r);
		case 'MulE':
			var l = e.a;
			var r = e.b;
			return (1 + $author$project$Main$countOps(l)) + $author$project$Main$countOps(r);
		default:
			var l = e.a;
			var r = e.b;
			return (1 + $author$project$Main$countOps(l)) + $author$project$Main$countOps(r);
	}
};
var $elm$core$Basics$neq = _Utils_notEqual;
var $author$project$Main$playSound = _Platform_outgoingPort('playSound', $elm$json$Json$Encode$string);
var $author$project$Main$saveToStorage = _Platform_outgoingPort('saveToStorage', $elm$json$Json$Encode$string);
var $author$project$Main$saveCmd = function (model) {
	return $author$project$Main$saveToStorage(
		$author$project$Main$encodeStats(model));
};
var $elm$core$Process$sleep = _Process_sleep;
var $author$project$Main$spawnParticles = _Platform_outgoingPort('spawnParticles', $elm$json$Json$Encode$int);
var $author$project$Main$vibrate = _Platform_outgoingPort('vibrate', $elm$json$Json$Encode$int);
var $author$project$Main$handleCorrect = function (model) {
	var stepCount = function () {
		var _v9 = $author$project$Main$parseExpr(
			$author$project$Main$tokenize(model.input));
		if (_v9.$ === 'Just') {
			var _v10 = _v9.a;
			var expr = _v10.a;
			var rest = _v10.b;
			return $elm$core$List$isEmpty(rest) ? $author$project$Main$countOps(expr) : 0;
		} else {
			return 0;
		}
	}();
	var stepMsg = (stepCount > 0) ? ('（' + ($elm$core$String$fromInt(stepCount) + '步运算）')) : '';
	var newStepsWithKeypad = model.keypadEnabled ? (model.stepsWithKeypad + 1) : model.stepsWithKeypad;
	var newShield = ((model.streak + 1) >= 3) ? true : false;
	var newFastest = ((model.timer > 0) && ((!model.fastestSolve) || (_Utils_cmp(model.timer, model.fastestSolve) < 0))) ? model.timer : model.fastestSolve;
	var bubuAchievement = ((stepCount === 3) && (!A2($elm$core$List$member, '步步为营', model.achievements))) ? _List_fromArray(
		['步步为营']) : _List_Nil;
	var _v0 = model.gameMode;
	switch (_v0.$) {
		case 'TimeAttack':
			var newTimeLeft = model.timeLeft + 10;
			var newStreak = model.streak + 1;
			var newScore = model.timeAttackScore + 1;
			var newHistory = A2($author$project$Main$addToHistory, model.input, model.history);
			var newBestStreak = A2($elm$core$Basics$max, newStreak, model.bestStreak);
			var newAch = _Utils_ap(
				$author$project$Main$checkAchievements(
					_Utils_update(
						model,
						{solved: model.solved + 1, stepsWithKeypad: newStepsWithKeypad, streak: newStreak})),
				bubuAchievement);
			var hasNewAch = !$elm$core$List$isEmpty(newAch);
			var newModel = _Utils_update(
				model,
				{
					achievementTimer: hasNewAch ? 5 : 0,
					achievements: _Utils_ap(model.achievements, newAch),
					bestStreak: newBestStreak,
					comboDisplay: $elm$core$Maybe$Just(newStreak),
					comboTimer: 2,
					fastestSolve: newFastest,
					hintLevel: 0,
					history: newHistory,
					input: '',
					message: hasNewAch ? ('解锁成就！' + (model.input + (' = 24 ' + stepMsg))) : ('+' + ($elm$core$String$fromInt(newScore) + ('分！+10秒！' + stepMsg))),
					messageType: $author$project$Main$Success,
					newAchievements: newAch,
					pendingNewCards: true,
					shieldActive: newShield,
					showHint: false,
					solved: model.solved + 1,
					stepsWithKeypad: newStepsWithKeypad,
					streak: newStreak,
					timeAttackScore: newScore,
					timeLeft: newTimeLeft
				});
			var sfx = hasNewAch ? _List_fromArray(
				[
					$author$project$Main$playSound('achievement'),
					$author$project$Main$spawnParticles(50),
					$author$project$Main$vibrate(200)
				]) : ((newStreak >= 2) ? _List_fromArray(
				[
					$author$project$Main$playSound('success'),
					$author$project$Main$playSound(
					'streak:' + $elm$core$String$fromInt(newStreak)),
					$author$project$Main$spawnParticles(30 + (newStreak * 5)),
					$author$project$Main$vibrate(80)
				]) : _List_fromArray(
				[
					$author$project$Main$playSound('success'),
					$author$project$Main$spawnParticles(30),
					$author$project$Main$vibrate(80)
				]));
			return _Utils_Tuple2(
				newModel,
				$elm$core$Platform$Cmd$batch(
					_Utils_ap(
						_List_fromArray(
							[
								A2(
								$elm$core$Task$perform,
								function (_v1) {
									return $author$project$Main$DelayedNewCards;
								},
								$elm$core$Process$sleep(600)),
								$author$project$Main$saveCmd(newModel),
								A2(
								$elm$core$Task$attempt,
								function (_v2) {
									return $author$project$Main$NoOp;
								},
								$elm$browser$Browser$Dom$focus('expr-input'))
							]),
						sfx)));
		case 'Daily':
			var newStreak = model.streak + 1;
			var newSolved = model.solved + 1;
			var newHistory = A2($author$project$Main$addToHistory, model.input, model.history);
			var newDailyCompleted = true;
			var newDailyBestTime = ((!model.dailyBestTime) || (_Utils_cmp(model.timer, model.dailyBestTime) < 0)) ? model.timer : model.dailyBestTime;
			var newBestStreak = A2($elm$core$Basics$max, newStreak, model.bestStreak);
			var newAch = _Utils_ap(
				$author$project$Main$checkAchievements(
					_Utils_update(
						model,
						{dailyCompleted: true, solved: newSolved, stepsWithKeypad: newStepsWithKeypad, streak: newStreak})),
				bubuAchievement);
			var isFirstDaily = !model.dailyCompleted;
			var newDailyHistory = isFirstDaily ? A2($elm$core$List$cons, model.dailyDate, model.dailyHistory) : model.dailyHistory;
			var hasNewAch = !$elm$core$List$isEmpty(newAch);
			var newModel = _Utils_update(
				model,
				{
					achievementTimer: hasNewAch ? 5 : 0,
					achievements: _Utils_ap(model.achievements, newAch),
					bestStreak: newBestStreak,
					comboDisplay: $elm$core$Maybe$Just(newStreak),
					comboTimer: 2,
					dailyBestTime: newDailyBestTime,
					dailyCompleted: newDailyCompleted,
					dailyHistory: newDailyHistory,
					fastestSolve: newFastest,
					hintLevel: 0,
					history: newHistory,
					input: '',
					message: hasNewAch ? ('解锁成就！' + (model.input + (' = 24 ' + stepMsg))) : (isFirstDaily ? ('今日挑战完成！' + (model.input + (' = 24 ' + stepMsg))) : ('正确！' + (model.input + (' = 24 ' + stepMsg)))),
					messageType: $author$project$Main$Success,
					newAchievements: newAch,
					pendingNewCards: true,
					shieldActive: newShield,
					showHint: false,
					solved: newSolved,
					stepsWithKeypad: newStepsWithKeypad,
					streak: newStreak
				});
			var sfx = hasNewAch ? _List_fromArray(
				[
					$author$project$Main$playSound('achievement'),
					$author$project$Main$spawnParticles(50),
					$author$project$Main$vibrate(200)
				]) : ((newStreak >= 2) ? _List_fromArray(
				[
					$author$project$Main$playSound('success'),
					$author$project$Main$playSound(
					'streak:' + $elm$core$String$fromInt(newStreak)),
					$author$project$Main$spawnParticles(40),
					$author$project$Main$vibrate(80)
				]) : _List_fromArray(
				[
					$author$project$Main$playSound('success'),
					$author$project$Main$spawnParticles(30),
					$author$project$Main$vibrate(80)
				]));
			return _Utils_Tuple2(
				newModel,
				$elm$core$Platform$Cmd$batch(
					_Utils_ap(
						_List_fromArray(
							[
								A2(
								$elm$core$Task$perform,
								function (_v3) {
									return $author$project$Main$DelayedNewCards;
								},
								$elm$core$Process$sleep(800)),
								$author$project$Main$saveCmd(newModel),
								A2(
								$elm$core$Task$attempt,
								function (_v4) {
									return $author$project$Main$NoOp;
								},
								$elm$browser$Browser$Dom$focus('expr-input'))
							]),
						sfx)));
		case 'Classic':
			var newStreak = model.streak + 1;
			var newSolved = model.solved + 1;
			var newHistory = A2($author$project$Main$addToHistory, model.input, model.history);
			var newBestStreak = A2($elm$core$Basics$max, newStreak, model.bestStreak);
			var newAch = _Utils_ap(
				$author$project$Main$checkAchievements(
					_Utils_update(
						model,
						{solved: newSolved, stepsWithKeypad: newStepsWithKeypad, streak: newStreak})),
				bubuAchievement);
			var hasNewAch = !$elm$core$List$isEmpty(newAch);
			var newModel = _Utils_update(
				model,
				{
					achievementTimer: hasNewAch ? 5 : 0,
					achievements: _Utils_ap(model.achievements, newAch),
					bestStreak: newBestStreak,
					comboDisplay: $elm$core$Maybe$Just(newStreak),
					comboTimer: 2,
					fastestSolve: newFastest,
					hintLevel: 0,
					history: newHistory,
					input: '',
					message: hasNewAch ? ('解锁成就！' + (model.input + (' = 24 ' + stepMsg))) : ('正确！' + (model.input + (' = 24 ' + stepMsg))),
					messageType: $author$project$Main$Success,
					newAchievements: newAch,
					pendingNewCards: true,
					shieldActive: newShield,
					showHint: false,
					solved: newSolved,
					stepsWithKeypad: newStepsWithKeypad,
					streak: newStreak
				});
			var sfx = hasNewAch ? _List_fromArray(
				[
					$author$project$Main$playSound('achievement'),
					$author$project$Main$spawnParticles(50),
					$author$project$Main$vibrate(200)
				]) : ((newStreak >= 2) ? _List_fromArray(
				[
					$author$project$Main$playSound('success'),
					$author$project$Main$playSound(
					'streak:' + $elm$core$String$fromInt(newStreak)),
					$author$project$Main$spawnParticles(40),
					$author$project$Main$vibrate(80)
				]) : _List_fromArray(
				[
					$author$project$Main$playSound('success'),
					$author$project$Main$spawnParticles(30),
					$author$project$Main$vibrate(80)
				]));
			return _Utils_Tuple2(
				newModel,
				$elm$core$Platform$Cmd$batch(
					_Utils_ap(
						_List_fromArray(
							[
								A2(
								$elm$core$Task$perform,
								function (_v5) {
									return $author$project$Main$DelayedNewCards;
								},
								$elm$core$Process$sleep(800)),
								$author$project$Main$saveCmd(newModel),
								A2(
								$elm$core$Task$attempt,
								function (_v6) {
									return $author$project$Main$NoOp;
								},
								$elm$browser$Browser$Dom$focus('expr-input'))
							]),
						sfx)));
		default:
			var newStreak = model.streak + 1;
			var newSolved = model.solved + 1;
			var newHistory = A2($author$project$Main$addToHistory, model.input, model.history);
			var newBestStreak = A2($elm$core$Basics$max, newStreak, model.bestStreak);
			var newAch = _Utils_ap(
				$author$project$Main$checkAchievements(
					_Utils_update(
						model,
						{solved: newSolved, stepsWithKeypad: newStepsWithKeypad, streak: newStreak})),
				bubuAchievement);
			var hasNewAch = !$elm$core$List$isEmpty(newAch);
			var sfx = hasNewAch ? _List_fromArray(
				[
					$author$project$Main$playSound('achievement'),
					$author$project$Main$spawnParticles(50),
					$author$project$Main$vibrate(200)
				]) : ((newStreak >= 2) ? _List_fromArray(
				[
					$author$project$Main$playSound('success'),
					$author$project$Main$playSound(
					'streak:' + $elm$core$String$fromInt(newStreak)),
					$author$project$Main$spawnParticles(40),
					$author$project$Main$vibrate(80)
				]) : _List_fromArray(
				[
					$author$project$Main$playSound('success'),
					$author$project$Main$spawnParticles(30),
					$author$project$Main$vibrate(80)
				]));
			var currentCardValues = A2(
				$elm$core$List$map,
				function ($) {
					return $.value;
				},
				model.cards);
			var newSkippedProblems = A2(
				$elm$core$List$filter,
				function (p) {
					return !_Utils_eq(p.cardValues, currentCardValues);
				},
				model.skippedProblems);
			var newModel = _Utils_update(
				model,
				{
					achievementTimer: hasNewAch ? 5 : 0,
					achievements: _Utils_ap(model.achievements, newAch),
					bestStreak: newBestStreak,
					comboDisplay: $elm$core$Maybe$Just(newStreak),
					comboTimer: 2,
					fastestSolve: newFastest,
					hintLevel: 0,
					history: newHistory,
					input: '',
					message: hasNewAch ? ('解锁成就！' + (model.input + (' = 24 ' + stepMsg))) : ('复习正确！已移除该错题 ✓' + stepMsg),
					messageType: $author$project$Main$Success,
					newAchievements: newAch,
					pendingNewCards: true,
					shieldActive: newShield,
					showHint: false,
					skippedProblems: newSkippedProblems,
					solved: newSolved,
					stepsWithKeypad: newStepsWithKeypad,
					streak: newStreak
				});
			return _Utils_Tuple2(
				newModel,
				$elm$core$Platform$Cmd$batch(
					_Utils_ap(
						_List_fromArray(
							[
								A2(
								$elm$core$Task$perform,
								function (_v7) {
									return $author$project$Main$DelayedNewCards;
								},
								$elm$core$Process$sleep(800)),
								$author$project$Main$saveCmd(newModel),
								A2(
								$elm$core$Task$attempt,
								function (_v8) {
									return $author$project$Main$NoOp;
								},
								$elm$browser$Browser$Dom$focus('expr-input'))
							]),
						sfx)));
	}
};
var $author$project$Main$hasDivision = function (s) {
	return A2($elm$core$String$contains, '/', s);
};
var $author$project$Main$hasDivisionSolution = function (solutions) {
	return A2($elm$core$List$any, $author$project$Main$hasDivision, solutions);
};
var $author$project$Main$valuesToCards = function (values) {
	return A2(
		$elm$core$List$indexedMap,
		F2(
			function (i, v) {
				return A2(
					$author$project$Main$createCard,
					v,
					A2($elm$core$Basics$modBy, 4, i));
			}),
		values);
};
var $author$project$Main$loadReviewProblem = function (problems) {
	if (!problems.b) {
		return A2(
			$elm$core$Task$perform,
			$author$project$Main$NewCards,
			$elm$core$Task$succeed(_List_Nil));
	} else {
		var generator = A2(
			$elm$random$Random$int,
			0,
			$elm$core$List$length(problems) - 1);
		return A2(
			$elm$random$Random$generate,
			function (idx) {
				var _v1 = A2($author$project$Main$getAt, idx, problems);
				if (_v1.$ === 'Nothing') {
					return $author$project$Main$NewCards(_List_Nil);
				} else {
					var p = _v1.a;
					return $author$project$Main$NewCards(
						$author$project$Main$valuesToCards(p.cardValues));
				}
			},
			generator);
	}
};
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Main$parseAndValidate = F2(
	function (input, cardValues) {
		var tokens = $author$project$Main$tokenize(input);
		var _v0 = $author$project$Main$parseExpr(tokens);
		if (_v0.$ === 'Nothing') {
			return $elm$core$Result$Err('表达式格式错误，请检查括号和数字');
		} else {
			var _v1 = _v0.a;
			var expr = _v1.a;
			var rest = _v1.b;
			if (!$elm$core$List$isEmpty(rest)) {
				return $elm$core$Result$Err('表达式有多余内容');
			} else {
				var usedNums = $author$project$Main$extractNums(expr);
				if (!A2($author$project$Main$matchCards, cardValues, usedNums)) {
					return $elm$core$Result$Err('使用的数字与牌面不匹配（必须且只能用4张牌各一次）');
				} else {
					var _v2 = $author$project$Main$evalExpr(expr);
					if (_v2.$ === 'Nothing') {
						return $elm$core$Result$Err('计算错误（可能除以零）');
					} else {
						var result = _v2.a;
						return $elm$core$Result$Ok(result);
					}
				}
			}
		}
	});
var $elm$json$Json$Encode$null = _Json_encodeNull;
var $author$project$Main$releaseWakeLock = _Platform_outgoingPort(
	'releaseWakeLock',
	function ($) {
		return $elm$json$Json$Encode$null;
	});
var $author$project$Main$requestWakeLock = _Platform_outgoingPort(
	'requestWakeLock',
	function ($) {
		return $elm$json$Json$Encode$null;
	});
var $author$project$Main$setHash = _Platform_outgoingPort('setHash', $elm$json$Json$Encode$string);
var $author$project$Main$setSFX = _Platform_outgoingPort('setSFX', $elm$json$Json$Encode$bool);
var $author$project$Main$showInstallPrompt = _Platform_outgoingPort(
	'showInstallPrompt',
	function ($) {
		return $elm$json$Json$Encode$null;
	});
var $author$project$Main$cacheKey = function (nums) {
	return A2(
		$elm$core$String$join,
		',',
		A2(
			$elm$core$List$map,
			$elm$core$String$fromInt,
			$elm$core$List$sort(
				A2(
					$elm$core$List$map,
					function (n) {
						return $elm$core$Basics$round(n * 1000);
					},
					nums))));
};
var $author$project$Main$solve24Cached = F2(
	function (cache, nums) {
		var key = $author$project$Main$cacheKey(nums);
		var _v0 = A2($elm$core$Dict$get, key, cache);
		if (_v0.$ === 'Just') {
			var solutions = _v0.a;
			return _Utils_Tuple2(solutions, cache);
		} else {
			var solutions = $author$project$Main$solve24(nums);
			return _Utils_Tuple2(
				solutions,
				A3($elm$core$Dict$insert, key, solutions, cache));
		}
	});
var $author$project$Main$findSimplestBinary = function (e) {
	findSimplestBinary:
	while (true) {
		switch (e.$) {
			case 'Num':
				return $elm$core$Maybe$Nothing;
			case 'AddE':
				if ((e.a.$ === 'Num') && (e.b.$ === 'Num')) {
					return $elm$core$Maybe$Just(e);
				} else {
					var l = e.a;
					var r = e.b;
					var _v1 = $author$project$Main$findSimplestBinary(l);
					if (_v1.$ === 'Just') {
						var found = _v1.a;
						return $elm$core$Maybe$Just(found);
					} else {
						var $temp$e = r;
						e = $temp$e;
						continue findSimplestBinary;
					}
				}
			case 'SubE':
				if ((e.a.$ === 'Num') && (e.b.$ === 'Num')) {
					return $elm$core$Maybe$Just(e);
				} else {
					var l = e.a;
					var r = e.b;
					var _v2 = $author$project$Main$findSimplestBinary(l);
					if (_v2.$ === 'Just') {
						var found = _v2.a;
						return $elm$core$Maybe$Just(found);
					} else {
						var $temp$e = r;
						e = $temp$e;
						continue findSimplestBinary;
					}
				}
			case 'MulE':
				if ((e.a.$ === 'Num') && (e.b.$ === 'Num')) {
					return $elm$core$Maybe$Just(e);
				} else {
					var l = e.a;
					var r = e.b;
					var _v3 = $author$project$Main$findSimplestBinary(l);
					if (_v3.$ === 'Just') {
						var found = _v3.a;
						return $elm$core$Maybe$Just(found);
					} else {
						var $temp$e = r;
						e = $temp$e;
						continue findSimplestBinary;
					}
				}
			default:
				if ((e.a.$ === 'Num') && (e.b.$ === 'Num')) {
					return $elm$core$Maybe$Just(e);
				} else {
					var l = e.a;
					var r = e.b;
					var _v4 = $author$project$Main$findSimplestBinary(l);
					if (_v4.$ === 'Just') {
						var found = _v4.a;
						return $elm$core$Maybe$Just(found);
					} else {
						var $temp$e = r;
						e = $temp$e;
						continue findSimplestBinary;
					}
				}
		}
	}
};
var $author$project$Main$expressionsEqual = F2(
	function (a, b) {
		var _v0 = _Utils_Tuple2(a, b);
		_v0$5:
		while (true) {
			switch (_v0.a.$) {
				case 'Num':
					if (_v0.b.$ === 'Num') {
						var n1 = _v0.a.a;
						var n2 = _v0.b.a;
						return $elm$core$Basics$abs(n1 - n2) < 0.0001;
					} else {
						break _v0$5;
					}
				case 'AddE':
					if (_v0.b.$ === 'AddE') {
						var _v1 = _v0.a;
						var l1 = _v1.a;
						var r1 = _v1.b;
						var _v2 = _v0.b;
						var l2 = _v2.a;
						var r2 = _v2.b;
						return A2($author$project$Main$expressionsEqual, l1, l2) && A2($author$project$Main$expressionsEqual, r1, r2);
					} else {
						break _v0$5;
					}
				case 'SubE':
					if (_v0.b.$ === 'SubE') {
						var _v3 = _v0.a;
						var l1 = _v3.a;
						var r1 = _v3.b;
						var _v4 = _v0.b;
						var l2 = _v4.a;
						var r2 = _v4.b;
						return A2($author$project$Main$expressionsEqual, l1, l2) && A2($author$project$Main$expressionsEqual, r1, r2);
					} else {
						break _v0$5;
					}
				case 'MulE':
					if (_v0.b.$ === 'MulE') {
						var _v5 = _v0.a;
						var l1 = _v5.a;
						var r1 = _v5.b;
						var _v6 = _v0.b;
						var l2 = _v6.a;
						var r2 = _v6.b;
						return A2($author$project$Main$expressionsEqual, l1, l2) && A2($author$project$Main$expressionsEqual, r1, r2);
					} else {
						break _v0$5;
					}
				default:
					if (_v0.b.$ === 'DivE') {
						var _v7 = _v0.a;
						var l1 = _v7.a;
						var r1 = _v7.b;
						var _v8 = _v0.b;
						var l2 = _v8.a;
						var r2 = _v8.b;
						return A2($author$project$Main$expressionsEqual, l1, l2) && A2($author$project$Main$expressionsEqual, r1, r2);
					} else {
						break _v0$5;
					}
			}
		}
		return false;
	});
var $author$project$Main$replaceExpr = F3(
	function (target, replacement, expr) {
		if (A2($author$project$Main$expressionsEqual, expr, target)) {
			return replacement;
		} else {
			switch (expr.$) {
				case 'Num':
					var n = expr.a;
					return $author$project$Main$Num(n);
				case 'AddE':
					var l = expr.a;
					var r = expr.b;
					return A2(
						$author$project$Main$AddE,
						A3($author$project$Main$replaceExpr, target, replacement, l),
						A3($author$project$Main$replaceExpr, target, replacement, r));
				case 'SubE':
					var l = expr.a;
					var r = expr.b;
					return A2(
						$author$project$Main$SubE,
						A3($author$project$Main$replaceExpr, target, replacement, l),
						A3($author$project$Main$replaceExpr, target, replacement, r));
				case 'MulE':
					var l = expr.a;
					var r = expr.b;
					return A2(
						$author$project$Main$MulE,
						A3($author$project$Main$replaceExpr, target, replacement, l),
						A3($author$project$Main$replaceExpr, target, replacement, r));
				default:
					var l = expr.a;
					var r = expr.b;
					return A2(
						$author$project$Main$DivE,
						A3($author$project$Main$replaceExpr, target, replacement, l),
						A3($author$project$Main$replaceExpr, target, replacement, r));
			}
		}
	});
var $author$project$Main$stepByStepSolve = function (expr) {
	var _v0 = $author$project$Main$findSimplestBinary(expr);
	if (_v0.$ === 'Nothing') {
		return _List_Nil;
	} else {
		var subExpr = _v0.a;
		var _v1 = $author$project$Main$evalExpr(subExpr);
		if (_v1.$ === 'Nothing') {
			return _List_Nil;
		} else {
			var result = _v1.a;
			var step = {
				before: $author$project$Main$exprToStringSimplified(subExpr) + (' = ' + $author$project$Main$fmt(result)),
				result: result
			};
			var newExpr = A3(
				$author$project$Main$replaceExpr,
				subExpr,
				$author$project$Main$Num(result),
				expr);
			return A2(
				$elm$core$List$cons,
				step,
				$author$project$Main$stepByStepSolve(newExpr));
		}
	}
};
var $author$project$Main$triggerImport = _Platform_outgoingPort(
	'triggerImport',
	function ($) {
		return $elm$json$Json$Encode$null;
	});
var $author$project$Main$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'NewCards':
				var cards = msg.a;
				var cardFloats = A2(
					$elm$core$List$map,
					function (c) {
						return c.value;
					},
					cards);
				var _v1 = A2($author$project$Main$solve24Cached, model.solverCache, cardFloats);
				var solutions = _v1.a;
				var newCache = _v1.b;
				if ($elm$core$List$isEmpty(solutions)) {
					return _Utils_eq(model.gameMode, $author$project$Main$Daily) ? _Utils_Tuple2(
						_Utils_update(
							model,
							{solverCache: newCache}),
						$author$project$Main$generateDailyCards(model.dailyDate)) : _Utils_Tuple2(
						_Utils_update(
							model,
							{solverCache: newCache}),
						$author$project$Main$generateCards(model.difficulty));
				} else {
					if (_Utils_eq(model.difficulty, $author$project$Main$Hard) && (!$author$project$Main$hasDivisionSolution(solutions))) {
						return _Utils_eq(model.gameMode, $author$project$Main$Daily) ? _Utils_Tuple2(
							_Utils_update(
								model,
								{solverCache: newCache}),
							$author$project$Main$generateDailyCards(model.dailyDate)) : _Utils_Tuple2(
							_Utils_update(
								model,
								{solverCache: newCache}),
							$author$project$Main$generateCards(model.difficulty));
					} else {
						var isFirstGame = !model.totalGames;
						var hashCmd = _Utils_eq(model.gameMode, $author$project$Main$Classic) ? $author$project$Main$setHash(
							A2(
								$elm$core$String$join,
								',',
								A2(
									$elm$core$List$map,
									function (c) {
										return $elm$core$String$fromInt(c.value);
									},
									cards))) : $elm$core$Platform$Cmd$none;
						var baseMsg = function () {
							var _v3 = model.gameMode;
							switch (_v3.$) {
								case 'Daily':
									return '今日挑战！用这4张牌算出24';
								case 'TimeAttack':
									return '计时挑战！答对+10秒，跳过-5秒';
								default:
									return isFirstGame ? '请用下面4张牌算出24点！' : '新的一组牌！';
							}
						}();
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									allSolutions: solutions,
									cards: cards,
									hintLevel: 0,
									hintText: '',
									input: '',
									inputHint: '',
									liveResult: '',
									message: baseMsg,
									messageType: $author$project$Main$Info,
									pendingNewCards: false,
									showAllAnswers: false,
									showHint: false,
									solverCache: newCache,
									timeAttackTotalQuestions: _Utils_eq(model.gameMode, $author$project$Main$TimeAttack) ? (model.timeAttackTotalQuestions + 1) : model.timeAttackTotalQuestions,
									timer: 0,
									totalGames: model.totalGames + 1
								}),
							$elm$core$Platform$Cmd$batch(
								_List_fromArray(
									[
										$author$project$Main$playSound('deal'),
										A2(
										$elm$core$Task$attempt,
										function (_v2) {
											return $author$project$Main$NoOp;
										},
										$elm$browser$Browser$Dom$focus('expr-input')),
										hashCmd
									])));
					}
				}
			case 'UpdateInput':
				var s = msg.a;
				var usedHint = A2(
					$author$project$Main$computeUsedNumsHint,
					s,
					A2(
						$elm$core$List$map,
						function (c) {
							return c.value;
						},
						model.cards));
				var live = A2(
					$author$project$Main$computeLiveResult,
					s,
					A2(
						$elm$core$List$map,
						function (c) {
							return c.value;
						},
						model.cards));
				var bracketHint = $author$project$Main$checkBrackets(s);
				var combinedHint = $elm$core$String$isEmpty(bracketHint) ? usedHint : _Utils_ap(
					bracketHint,
					$elm$core$String$isEmpty(usedHint) ? '' : (' | ' + usedHint));
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{input: s, inputHint: combinedHint, liveResult: live}),
					$elm$core$Platform$Cmd$none);
			case 'SubmitAnswer':
				if (model.pendingNewCards) {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					if (_Utils_eq(model.gameMode, $author$project$Main$TimeAttack) && (model.timeLeft <= 0)) {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					} else {
						var newAttempts = model.totalAttempts + 1;
						var cardValues = A2(
							$elm$core$List$map,
							function (c) {
								return c.value;
							},
							model.cards);
						var _v4 = A2($author$project$Main$parseAndValidate, model.input, cardValues);
						if (_v4.$ === 'Ok') {
							var result = _v4.a;
							if ($elm$core$Basics$abs(result - 24) < 0.0001) {
								if (_Utils_eq(model.difficulty, $author$project$Main$Hard)) {
									var _v5 = $author$project$Main$parseExpr(
										$author$project$Main$tokenize(model.input));
									if (_v5.$ === 'Just') {
										var _v6 = _v5.a;
										var expr = _v6.a;
										var rest = _v6.b;
										if ($elm$core$List$isEmpty(rest) && $author$project$Main$exprHasDiv(expr)) {
											return $author$project$Main$handleCorrect(
												_Utils_update(
													model,
													{totalAttempts: newAttempts}));
										} else {
											var newHistory = $elm$core$String$isEmpty(model.input) ? model.history : A2($author$project$Main$addToHistory, model.input, model.history);
											return _Utils_Tuple2(
												_Utils_update(
													model,
													{history: newHistory, message: 'Hard 模式答案必须用到除法！', messageType: $author$project$Main$Error, streak: 0, totalAttempts: newAttempts}),
												$author$project$Main$playSound('error'));
										}
									} else {
										return $author$project$Main$handleCorrect(
											_Utils_update(
												model,
												{totalAttempts: newAttempts}));
									}
								} else {
									return $author$project$Main$handleCorrect(
										_Utils_update(
											model,
											{totalAttempts: newAttempts}));
								}
							} else {
								var newHistory = $elm$core$String$isEmpty(model.input) ? model.history : A2($author$project$Main$addToHistory, model.input, model.history);
								var errModel = _Utils_update(
									model,
									{
										history: newHistory,
										message: '结果是 ' + ($author$project$Main$fmt(result) + '，不是24！'),
										messageType: $author$project$Main$Error,
										shieldActive: false,
										streak: 0,
										totalAttempts: newAttempts
									});
								return _Utils_Tuple2(
									errModel,
									$author$project$Main$playSound('error'));
							}
						} else {
							var errMsg = _v4.a;
							var newHistory = $elm$core$String$isEmpty(model.input) ? model.history : A2($author$project$Main$addToHistory, model.input, model.history);
							var newModel = _Utils_update(
								model,
								{history: newHistory, message: errMsg, messageType: $author$project$Main$Error, shieldActive: false, streak: 0, totalAttempts: newAttempts});
							return _Utils_Tuple2(
								newModel,
								$elm$core$Platform$Cmd$batch(
									_List_fromArray(
										[
											$author$project$Main$saveCmd(newModel),
											$author$project$Main$playSound('error'),
											$author$project$Main$vibrate(150)
										])));
						}
					}
				}
			case 'ShowHint':
				if (model.pendingNewCards) {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					var _v7 = model.allSolutions;
					if (!_v7.b) {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{message: '这道题无解！点击「跳过」换一组。', messageType: $author$project$Main$Info}),
							$author$project$Main$playSound('click'));
					} else {
						var first = _v7.a;
						var steps = function () {
							var _v8 = $author$project$Main$parseExpr(
								$author$project$Main$tokenize(first));
							if (_v8.$ === 'Just') {
								var _v9 = _v8.a;
								var expr = _v9.a;
								var rest = _v9.b;
								return $elm$core$List$isEmpty(rest) ? $author$project$Main$stepByStepSolve(expr) : _List_Nil;
							} else {
								return _List_Nil;
							}
						}();
						var newLevel = A2($elm$core$Basics$min, 3, model.hintLevel + 1);
						var hint = A2($author$project$Main$getStepHint, newLevel, first);
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									hintLevel: newLevel,
									hintText: hint,
									message: '提示已显示（' + ($elm$core$String$fromInt(newLevel) + '/3）'),
									messageType: $author$project$Main$Info,
									showHint: true,
									stepByStep: steps
								}),
							$author$project$Main$playSound('click'));
					}
				}
			case 'ShowAllAnswers':
				return model.pendingNewCards ? _Utils_Tuple2(model, $elm$core$Platform$Cmd$none) : ($elm$core$List$isEmpty(model.allSolutions) ? _Utils_Tuple2(
					_Utils_update(
						model,
						{message: '这道题没有解法，请跳过换一组', messageType: $author$project$Main$Info, showAllAnswers: true}),
					$author$project$Main$playSound('click')) : _Utils_Tuple2(
					_Utils_update(
						model,
						{
							message: '显示全部 ' + ($elm$core$String$fromInt(
								$elm$core$List$length(model.allSolutions)) + ' 个解法'),
							messageType: $author$project$Main$Info,
							showAllAnswers: true
						}),
					$author$project$Main$playSound('click')));
			case 'NewGame':
				var _v10 = model.gameMode;
				switch (_v10.$) {
					case 'TimeAttack':
						var newModel = _Utils_update(
							model,
							{message: '计时挑战开始！', messageType: $author$project$Main$Info, pendingNewCards: true, shieldActive: false, timeAttackScore: 0, timeAttackTotalQuestions: 0, timeLeft: 60, timer: 0});
						return _Utils_Tuple2(
							newModel,
							$elm$core$Platform$Cmd$batch(
								_List_fromArray(
									[
										$author$project$Main$generateCards(model.difficulty),
										$author$project$Main$playSound('click'),
										$author$project$Main$requestWakeLock(_Utils_Tuple0)
									])));
					case 'Review':
						var newModel = _Utils_update(
							model,
							{message: '错题复习新局！', messageType: $author$project$Main$Info, newAchievements: _List_Nil, pendingNewCards: true, shieldActive: false, showAllAnswers: false, streak: 0, timer: 0});
						return _Utils_Tuple2(
							newModel,
							$elm$core$Platform$Cmd$batch(
								_List_fromArray(
									[
										$author$project$Main$loadReviewProblem(model.skippedProblems),
										$author$project$Main$playSound('click')
									])));
					default:
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{message: '新游戏开始！', messageType: $author$project$Main$Info, newAchievements: _List_Nil, pendingNewCards: true, shieldActive: false, showAllAnswers: false, streak: 0, timer: 0}),
							$elm$core$Platform$Cmd$batch(
								_List_fromArray(
									[
										$author$project$Main$generateCards(model.difficulty),
										$author$project$Main$playSound('click')
									])));
				}
			case 'Skip':
				if (model.pendingNewCards) {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					var problem = {
						answer: A2(
							$elm$core$Maybe$withDefault,
							'',
							$elm$core$List$head(model.allSolutions)),
						cardValues: A2(
							$elm$core$List$map,
							function ($) {
								return $.value;
							},
							model.cards)
					};
					var hasShield = (model.streak >= 3) && (!model.shieldActive);
					var alreadyExists = A2(
						$elm$core$List$any,
						function (p) {
							return _Utils_eq(p.cardValues, problem.cardValues);
						},
						model.skippedProblems);
					var newSkippedProblems = alreadyExists ? model.skippedProblems : A2(
						$elm$core$List$cons,
						problem,
						A2($elm$core$List$take, 19, model.skippedProblems));
					var _v11 = model.gameMode;
					if (_v11.$ === 'TimeAttack') {
						var newTimeLeft = A2($elm$core$Basics$max, 0, model.timeLeft - 5);
						var newModel = _Utils_update(
							model,
							{
								message: hasShield ? ('护盾保护！跳过不中断连胜。答案是：' + A2(
									$elm$core$Maybe$withDefault,
									'',
									$elm$core$List$head(model.allSolutions))) : ('跳过！扣5秒。答案是：' + A2(
									$elm$core$Maybe$withDefault,
									'',
									$elm$core$List$head(model.allSolutions))),
								messageType: $author$project$Main$Info,
								pendingNewCards: true,
								shieldActive: hasShield ? true : model.shieldActive,
								showAllAnswers: true,
								skipped: model.skipped + 1,
								skippedProblems: newSkippedProblems,
								streak: hasShield ? model.streak : 0,
								timeLeft: newTimeLeft
							});
						return _Utils_Tuple2(
							newModel,
							$elm$core$Platform$Cmd$batch(
								_List_fromArray(
									[
										A2(
										$elm$core$Task$perform,
										function (_v12) {
											return $author$project$Main$DelayedNewCards;
										},
										$elm$core$Process$sleep(1500)),
										$author$project$Main$saveCmd(newModel),
										$author$project$Main$playSound('click')
									])));
					} else {
						var newModel = _Utils_update(
							model,
							{
								message: hasShield ? ('护盾保护！跳过不中断连胜。答案是：' + A2(
									$elm$core$Maybe$withDefault,
									'',
									$elm$core$List$head(model.allSolutions))) : ('跳过！答案是：' + A2(
									$elm$core$Maybe$withDefault,
									'',
									$elm$core$List$head(model.allSolutions))),
								messageType: $author$project$Main$Info,
								pendingNewCards: true,
								shieldActive: hasShield ? true : model.shieldActive,
								showAllAnswers: true,
								skipped: model.skipped + 1,
								skippedProblems: newSkippedProblems,
								streak: hasShield ? model.streak : 0
							});
						return _Utils_Tuple2(
							newModel,
							$elm$core$Platform$Cmd$batch(
								_List_fromArray(
									[
										A2(
										$elm$core$Task$perform,
										function (_v13) {
											return $author$project$Main$DelayedNewCards;
										},
										$elm$core$Process$sleep(1500)),
										$author$project$Main$saveCmd(newModel),
										$author$project$Main$playSound('click')
									])));
					}
				}
			case 'Tick':
				var _v14 = model.gameMode;
				if (_v14.$ === 'TimeAttack') {
					if (model.timeLeft <= 1) {
						var totalTA = model.timeAttackTotalQuestions;
						var finalScore = model.timeAttackScore;
						var isNewRecord = (_Utils_cmp(finalScore, model.timeAttackBest) > 0) && (finalScore > 0);
						var recordMsg = isNewRecord ? ' 🎉 新纪录！' : '';
						var newBest = A2($elm$core$Basics$max, finalScore, model.timeAttackBest);
						var accuracyStr = (!totalTA) ? 'N/A' : ($elm$core$String$fromInt(
							$elm$core$Basics$round((finalScore / totalTA) * 100)) + '%');
						var newRecord = {accuracy: accuracyStr, date: model.dailyDate, score: finalScore};
						var newHistory = A2(
							$elm$core$List$cons,
							newRecord,
							A2($elm$core$List$take, 9, model.timeAttackHistory));
						var gameOverModel = _Utils_update(
							model,
							{
								message: '时间到！得分：' + ($elm$core$String$fromInt(finalScore) + (' | 准确率：' + (accuracyStr + (' | 最佳：' + ($elm$core$String$fromInt(newBest) + recordMsg))))),
								messageType: $author$project$Main$Info,
								pendingNewCards: false,
								timeAttackBest: newBest,
								timeAttackHistory: newHistory,
								timeLeft: 0
							});
						return _Utils_Tuple2(
							gameOverModel,
							$elm$core$Platform$Cmd$batch(
								_List_fromArray(
									[
										$author$project$Main$saveCmd(gameOverModel),
										$author$project$Main$playSound('error'),
										$author$project$Main$vibrate(300),
										$author$project$Main$releaseWakeLock(_Utils_Tuple0)
									])));
					} else {
						var newTimeLeft = model.timeLeft - 1;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{timeLeft: newTimeLeft, timer: model.timer + 1, totalTime: model.totalTime + 1}),
							(newTimeLeft <= 10) ? $author$project$Main$playSound('tick') : $elm$core$Platform$Cmd$none);
					}
				} else {
					var newTotalTime = model.totalTime + 1;
					var newTimer = model.timer + 1;
					var newComboTimer = A2($elm$core$Basics$max, 0, model.comboTimer - 1);
					var newAchTimer = A2($elm$core$Basics$max, 0, model.achievementTimer - 1);
					var clearedCombo = ((!newComboTimer) && (model.comboTimer > 0)) ? $elm$core$Maybe$Nothing : model.comboDisplay;
					var clearedAch = ((!newAchTimer) && (model.achievementTimer > 0)) ? _List_Nil : model.newAchievements;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{achievementTimer: newAchTimer, comboDisplay: clearedCombo, comboTimer: newComboTimer, newAchievements: clearedAch, timer: newTimer, totalTime: newTotalTime}),
						$elm$core$Platform$Cmd$none);
				}
			case 'StorageLoaded':
				var json = msg.a;
				var newModel = A2($author$project$Main$decodeStats, json, model);
				return _Utils_Tuple2(newModel, $elm$core$Platform$Cmd$none);
			case 'DelayedNewCards':
				var _v15 = model.gameMode;
				if (_v15.$ === 'TimeAttack') {
					return (model.timeLeft <= 0) ? _Utils_Tuple2(
						_Utils_update(
							model,
							{pendingNewCards: false}),
						$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
						_Utils_update(
							model,
							{pendingNewCards: false}),
						$author$project$Main$generateCards(model.difficulty));
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{pendingNewCards: false}),
						$author$project$Main$generateCards(model.difficulty));
				}
			case 'DismissAchievements':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{newAchievements: _List_Nil}),
					$elm$core$Platform$Cmd$none);
			case 'ToggleSFX':
				var newModel = _Utils_update(
					model,
					{sfxEnabled: !model.sfxEnabled});
				return _Utils_Tuple2(
					newModel,
					$author$project$Main$setSFX(newModel.sfxEnabled));
			case 'ClearHistory':
				var newModel = _Utils_update(
					model,
					{history: _List_Nil});
				return _Utils_Tuple2(
					newModel,
					$author$project$Main$saveCmd(newModel));
			case 'CopyAnswer':
				var ans = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{message: '已复制到剪贴板', messageType: $author$project$Main$Info}),
					$author$project$Main$copyToClipboard(ans + ' = 24'));
			case 'ChangeDifficulty':
				var diff = msg.a;
				return model.pendingNewCards ? _Utils_Tuple2(model, $elm$core$Platform$Cmd$none) : _Utils_Tuple2(
					_Utils_update(
						model,
						{
							difficulty: diff,
							message: '难度切换为' + $author$project$Main$difficultyName(diff),
							messageType: $author$project$Main$Info,
							newAchievements: _List_Nil,
							pendingNewCards: true,
							shieldActive: false,
							showAllAnswers: false,
							streak: 0
						}),
					$elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[
								$author$project$Main$generateCards(diff),
								$author$project$Main$playSound('click')
							])));
			case 'ChangeTheme':
				var t = msg.a;
				var newModel = _Utils_update(
					model,
					{theme: t});
				return _Utils_Tuple2(
					newModel,
					$author$project$Main$saveCmd(newModel));
			case 'SetGameMode':
				var mode = msg.a;
				var wasTimeAttack = _Utils_eq(model.gameMode, $author$project$Main$TimeAttack);
				switch (mode.$) {
					case 'Daily':
						var newModel = _Utils_update(
							model,
							{gameMode: $author$project$Main$Daily, hintLevel: 0, input: '', newAchievements: _List_Nil, shieldActive: false, showAllAnswers: false, showHint: false, streak: 0});
						return _Utils_Tuple2(
							newModel,
							$elm$core$Platform$Cmd$batch(
								_List_fromArray(
									[
										$author$project$Main$generateDailyCards(model.dailyDate),
										$author$project$Main$playSound('click'),
										wasTimeAttack ? $author$project$Main$releaseWakeLock(_Utils_Tuple0) : $elm$core$Platform$Cmd$none
									])));
					case 'TimeAttack':
						var newModel = _Utils_update(
							model,
							{gameMode: $author$project$Main$TimeAttack, hintLevel: 0, input: '', message: '计时挑战开始！', messageType: $author$project$Main$Info, newAchievements: _List_Nil, pendingNewCards: true, shieldActive: false, showAllAnswers: false, showHint: false, streak: 0, timeAttackScore: 0, timeAttackTotalQuestions: 0, timeLeft: 60, timer: 0});
						return _Utils_Tuple2(
							newModel,
							$elm$core$Platform$Cmd$batch(
								_List_fromArray(
									[
										$author$project$Main$generateCards(model.difficulty),
										$author$project$Main$playSound('click'),
										$author$project$Main$requestWakeLock(_Utils_Tuple0)
									])));
					case 'Classic':
						var newModel = _Utils_update(
							model,
							{gameMode: $author$project$Main$Classic, hintLevel: 0, input: '', message: '返回经典模式', messageType: $author$project$Main$Info, newAchievements: _List_Nil, shieldActive: false, showAllAnswers: false, showHint: false, streak: 0});
						return _Utils_Tuple2(
							newModel,
							$elm$core$Platform$Cmd$batch(
								_List_fromArray(
									[
										$author$project$Main$generateCards(model.difficulty),
										$author$project$Main$playSound('click'),
										wasTimeAttack ? $author$project$Main$releaseWakeLock(_Utils_Tuple0) : $elm$core$Platform$Cmd$none
									])));
					default:
						if ($elm$core$List$isEmpty(model.skippedProblems)) {
							var newModel = _Utils_update(
								model,
								{gameMode: $author$project$Main$Classic, message: '错题本为空，无法复习', messageType: $author$project$Main$Info, shieldActive: false});
							return _Utils_Tuple2(
								newModel,
								$elm$core$Platform$Cmd$batch(
									_List_fromArray(
										[
											$author$project$Main$generateCards(model.difficulty),
											$author$project$Main$playSound('click')
										])));
						} else {
							var newModel = _Utils_update(
								model,
								{gameMode: $author$project$Main$Review, hintLevel: 0, input: '', message: '错题复习模式！复习你跳过的题目', messageType: $author$project$Main$Info, newAchievements: _List_Nil, pendingNewCards: true, shieldActive: false, showAllAnswers: false, showHint: false, streak: 0});
							return _Utils_Tuple2(
								newModel,
								$elm$core$Platform$Cmd$batch(
									_List_fromArray(
										[
											$author$project$Main$loadReviewProblem(model.skippedProblems),
											$author$project$Main$playSound('click'),
											wasTimeAttack ? $author$project$Main$releaseWakeLock(_Utils_Tuple0) : $elm$core$Platform$Cmd$none
										])));
						}
				}
			case 'StartTimeAttack':
				var newModel = _Utils_update(
					model,
					{gameMode: $author$project$Main$TimeAttack, hintLevel: 0, input: '', message: '计时挑战开始！', messageType: $author$project$Main$Info, newAchievements: _List_Nil, pendingNewCards: true, shieldActive: false, showAllAnswers: false, showHint: false, streak: 0, timeAttackScore: 0, timeAttackTotalQuestions: 0, timeLeft: 60, timer: 0});
				return _Utils_Tuple2(
					newModel,
					$elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[
								$author$project$Main$generateCards(model.difficulty),
								$author$project$Main$playSound('click'),
								$author$project$Main$requestWakeLock(_Utils_Tuple0)
							])));
			case 'StartReview':
				if ($elm$core$List$isEmpty(model.skippedProblems)) {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{gameMode: $author$project$Main$Classic, message: '错题本为空', messageType: $author$project$Main$Info, shieldActive: false}),
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									$author$project$Main$generateCards(model.difficulty),
									$author$project$Main$playSound('click')
								])));
				} else {
					var newModel = _Utils_update(
						model,
						{gameMode: $author$project$Main$Review, hintLevel: 0, input: '', message: '错题复习模式！', messageType: $author$project$Main$Info, newAchievements: _List_Nil, pendingNewCards: true, shieldActive: false, showAllAnswers: false, showHint: false, streak: 0});
					return _Utils_Tuple2(
						newModel,
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									$author$project$Main$loadReviewProblem(model.skippedProblems),
									$author$project$Main$playSound('click')
								])));
				}
			case 'CardClick':
				var val = msg.a;
				if (model.pendingNewCards || (_Utils_eq(model.gameMode, $author$project$Main$TimeAttack) && (model.timeLeft <= 0))) {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					if (A2(
						$elm$core$List$any,
						function (c) {
							return _Utils_eq(c.value, val);
						},
						model.cards)) {
						var newInput = _Utils_ap(
							model.input,
							$elm$core$String$fromInt(val));
						var usedHint = A2(
							$author$project$Main$computeUsedNumsHint,
							newInput,
							A2(
								$elm$core$List$map,
								function (c) {
									return c.value;
								},
								model.cards));
						var live = A2(
							$author$project$Main$computeLiveResult,
							newInput,
							A2(
								$elm$core$List$map,
								function (c) {
									return c.value;
								},
								model.cards));
						var bracketHint = $author$project$Main$checkBrackets(newInput);
						var combinedHint = $elm$core$String$isEmpty(bracketHint) ? usedHint : _Utils_ap(
							bracketHint,
							$elm$core$String$isEmpty(usedHint) ? '' : (' | ' + usedHint));
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{input: newInput, inputHint: combinedHint, liveResult: live}),
							$elm$core$Platform$Cmd$batch(
								_List_fromArray(
									[
										$author$project$Main$playSound('key'),
										A2(
										$elm$core$Task$attempt,
										function (_v17) {
											return $author$project$Main$NoOp;
										},
										$elm$browser$Browser$Dom$focus('expr-input'))
									])));
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				}
			case 'BackspaceInput':
				if (model.pendingNewCards || (_Utils_eq(model.gameMode, $author$project$Main$TimeAttack) && (model.timeLeft <= 0))) {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					var newInput = A2($elm$core$String$dropRight, 1, model.input);
					var usedHint = A2(
						$author$project$Main$computeUsedNumsHint,
						newInput,
						A2(
							$elm$core$List$map,
							function (c) {
								return c.value;
							},
							model.cards));
					var live = A2(
						$author$project$Main$computeLiveResult,
						newInput,
						A2(
							$elm$core$List$map,
							function (c) {
								return c.value;
							},
							model.cards));
					var bracketHint = $author$project$Main$checkBrackets(newInput);
					var combinedHint = $elm$core$String$isEmpty(bracketHint) ? usedHint : _Utils_ap(
						bracketHint,
						$elm$core$String$isEmpty(usedHint) ? '' : (' | ' + usedHint));
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{input: newInput, inputHint: combinedHint, liveResult: live}),
						$elm$core$Platform$Cmd$none);
				}
			case 'KeypadInput':
				var s = msg.a;
				if (model.pendingNewCards || (_Utils_eq(model.gameMode, $author$project$Main$TimeAttack) && (model.timeLeft <= 0))) {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					var newInput = _Utils_ap(model.input, s);
					var usedHint = A2(
						$author$project$Main$computeUsedNumsHint,
						newInput,
						A2(
							$elm$core$List$map,
							function (c) {
								return c.value;
							},
							model.cards));
					var live = A2(
						$author$project$Main$computeLiveResult,
						newInput,
						A2(
							$elm$core$List$map,
							function (c) {
								return c.value;
							},
							model.cards));
					var bracketHint = $author$project$Main$checkBrackets(newInput);
					var combinedHint = $elm$core$String$isEmpty(bracketHint) ? usedHint : _Utils_ap(
						bracketHint,
						$elm$core$String$isEmpty(usedHint) ? '' : (' | ' + usedHint));
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{input: newInput, inputHint: combinedHint, liveResult: live}),
						$author$project$Main$playSound('key'));
				}
			case 'ToggleKeypad':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{keypadEnabled: !model.keypadEnabled}),
					$elm$core$Platform$Cmd$none);
			case 'ToggleSkippedProblems':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{showSkippedProblems: !model.showSkippedProblems}),
					$elm$core$Platform$Cmd$none);
			case 'ShowSteps':
				if (model.pendingNewCards) {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					if ($elm$core$List$isEmpty(model.allSolutions)) {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{message: '这道题没有解法，无法显示步骤', messageType: $author$project$Main$Info}),
							$author$project$Main$playSound('click'));
					} else {
						var steps = function () {
							var _v18 = $elm$core$List$head(model.allSolutions);
							if (_v18.$ === 'Nothing') {
								return _List_Nil;
							} else {
								var first = _v18.a;
								var _v19 = $author$project$Main$parseExpr(
									$author$project$Main$tokenize(first));
								if (_v19.$ === 'Just') {
									var _v20 = _v19.a;
									var expr = _v20.a;
									var rest = _v20.b;
									return $elm$core$List$isEmpty(rest) ? $author$project$Main$stepByStepSolve(expr) : _List_Nil;
								} else {
									return _List_Nil;
								}
							}
						}();
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{showSteps: true, stepByStep: steps}),
							$author$project$Main$playSound('click'));
					}
				}
			case 'HideSteps':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{showSteps: false}),
					$elm$core$Platform$Cmd$none);
			case 'ShareProblem':
				var newShared = model.sharedCount + 1;
				var hash = A2(
					$elm$core$String$join,
					',',
					A2(
						$elm$core$List$map,
						function (c) {
							return $elm$core$String$fromInt(c.value);
						},
						model.cards));
				var shareText = '24点挑战：' + (A2(
					$elm$core$String$join,
					', ',
					A2(
						$elm$core$List$map,
						function (c) {
							return c.display;
						},
						model.cards)) + ('，你能算出24吗？ https://hanazar-games.github.io/24-Points-Webgame/#' + hash));
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{message: '题目已复制到剪贴板', messageType: $author$project$Main$Info, sharedCount: newShared}),
					$author$project$Main$copyToClipboard(shareText));
			case 'ExportData':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{message: '数据已复制到剪贴板', messageType: $author$project$Main$Info}),
					$author$project$Main$copyToClipboard(
						$author$project$Main$encodeStats(model)));
			case 'TriggerImport':
				return _Utils_Tuple2(
					model,
					$author$project$Main$triggerImport(_Utils_Tuple0));
			case 'DismissTutorial':
				var newModel = _Utils_update(
					model,
					{showTutorial: false});
				return _Utils_Tuple2(
					newModel,
					$author$project$Main$saveCmd(newModel));
			case 'InstallPWA':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{canInstallPWA: false}),
					$author$project$Main$showInstallPrompt(_Utils_Tuple0));
			case 'InstallPromptChanged':
				var canInstall = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{canInstallPWA: canInstall}),
					$elm$core$Platform$Cmd$none);
			case 'NetworkChanged':
				var online = msg.a;
				var newModel = _Utils_update(
					model,
					{isOnline: online});
				return _Utils_Tuple2(newModel, $elm$core$Platform$Cmd$none);
			case 'ReceiveSFXSetting':
				var enabled = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{sfxEnabled: enabled}),
					$elm$core$Platform$Cmd$none);
			default:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Main$ChangeDifficulty = function (a) {
	return {$: 'ChangeDifficulty', a: a};
};
var $author$project$Main$ChangeTheme = function (a) {
	return {$: 'ChangeTheme', a: a};
};
var $author$project$Main$ClearHistory = {$: 'ClearHistory'};
var $author$project$Main$CopyAnswer = function (a) {
	return {$: 'CopyAnswer', a: a};
};
var $author$project$Main$DismissAchievements = {$: 'DismissAchievements'};
var $author$project$Main$DismissTutorial = {$: 'DismissTutorial'};
var $author$project$Main$Easy = {$: 'Easy'};
var $author$project$Main$ExportData = {$: 'ExportData'};
var $author$project$Main$HideSteps = {$: 'HideSteps'};
var $author$project$Main$InstallPWA = {$: 'InstallPWA'};
var $author$project$Main$NewGame = {$: 'NewGame'};
var $author$project$Main$SetGameMode = function (a) {
	return {$: 'SetGameMode', a: a};
};
var $author$project$Main$ShareProblem = {$: 'ShareProblem'};
var $author$project$Main$ShowAllAnswers = {$: 'ShowAllAnswers'};
var $author$project$Main$ShowHint = {$: 'ShowHint'};
var $author$project$Main$ShowSteps = {$: 'ShowSteps'};
var $author$project$Main$Skip = {$: 'Skip'};
var $author$project$Main$StartTimeAttack = {$: 'StartTimeAttack'};
var $author$project$Main$SubmitAnswer = {$: 'SubmitAnswer'};
var $author$project$Main$ToggleSFX = {$: 'ToggleSFX'};
var $author$project$Main$ToggleSkippedProblems = {$: 'ToggleSkippedProblems'};
var $author$project$Main$TriggerImport = {$: 'TriggerImport'};
var $author$project$Main$UpdateInput = function (a) {
	return {$: 'UpdateInput', a: a};
};
var $author$project$Main$achievementProgress = F2(
	function (name, model) {
		switch (name) {
			case '首杀':
				return $elm$core$String$fromInt(model.solved) + '/1';
			case '三连冠':
				return $elm$core$String$fromInt(model.streak) + '/3';
			case '五连冠':
				return $elm$core$String$fromInt(model.streak) + '/5';
			case '十连冠':
				return $elm$core$String$fromInt(model.streak) + '/10';
			case '速算大师':
				return '≤10秒';
			case '百题斩':
				return $elm$core$String$fromInt(model.solved) + '/100';
			case '每日首胜':
				return model.dailyCompleted ? '已完成' : '未完成';
			case '极速60秒':
				return $elm$core$String$fromInt(model.timeAttackBest) + '/5';
			case '火神':
				return $elm$core$String$fromInt(model.streak) + '/20';
			case '键盘侠':
				return $elm$core$String$fromInt(model.stepsWithKeypad) + '/10';
			case '分享达人':
				return $elm$core$String$fromInt(model.sharedCount) + '/3';
			case '步步为营':
				return '恰好3步';
			default:
				return '';
		}
	});
var $author$project$Main$allAchievements = _List_fromArray(
	['首杀', '三连冠', '五连冠', '十连冠', '速算大师', '百题斩', '每日首胜', '极速60秒', '火神', '键盘侠', '分享达人', '步步为营']);
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$html$Html$code = _VirtualDom_node('code');
var $elm$core$List$sum = function (numbers) {
	return A3($elm$core$List$foldl, $elm$core$Basics$add, 0, numbers);
};
var $author$project$Main$dateToDays = function (s) {
	var _v0 = A2($elm$core$String$split, '-', s);
	if (((_v0.b && _v0.b.b) && _v0.b.b.b) && (!_v0.b.b.b.b)) {
		var yStr = _v0.a;
		var _v1 = _v0.b;
		var mStr = _v1.a;
		var _v2 = _v1.b;
		var dStr = _v2.a;
		var _v3 = _Utils_Tuple3(
			$elm$core$String$toInt(yStr),
			$elm$core$String$toInt(mStr),
			$elm$core$String$toInt(dStr));
		if (((_v3.a.$ === 'Just') && (_v3.b.$ === 'Just')) && (_v3.c.$ === 'Just')) {
			var y = _v3.a.a;
			var m = _v3.b.a;
			var d = _v3.c.a;
			var yearDays = ((((y - 1970) * 365) + (((y - 1969) / 4) | 0)) - (((y - 1901) / 100) | 0)) + (((y - 1601) / 400) | 0);
			var monthDays = _List_fromArray(
				[0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30]);
			var monthTotal = $elm$core$List$sum(
				A2($elm$core$List$take, m - 1, monthDays));
			var isLeap = ((!A2($elm$core$Basics$modBy, 4, y)) && (!(!A2($elm$core$Basics$modBy, 100, y)))) || (!A2($elm$core$Basics$modBy, 400, y));
			var leapAdjust = (isLeap && (m > 2)) ? 1 : 0;
			return ((yearDays + monthTotal) + d) + leapAdjust;
		} else {
			return 0;
		}
	} else {
		return 0;
	}
};
var $author$project$Main$consecutiveStreak = function (dates) {
	var uniqueDates = A3(
		$elm$core$List$foldl,
		F2(
			function (x, acc) {
				return A2($elm$core$List$member, x, acc) ? acc : A2($elm$core$List$cons, x, acc);
			}),
		_List_Nil,
		dates);
	var sorted = $elm$core$List$reverse(
		A2($elm$core$List$sortBy, $author$project$Main$dateToDays, uniqueDates));
	if (!sorted.b) {
		return 0;
	} else {
		var first = sorted.a;
		var rest = sorted.b;
		var go = F3(
			function (prevDay, count, remaining) {
				go:
				while (true) {
					if (!remaining.b) {
						return count;
					} else {
						var next = remaining.a;
						var restNext = remaining.b;
						if (($author$project$Main$dateToDays(prevDay) - $author$project$Main$dateToDays(next)) === 1) {
							var $temp$prevDay = next,
								$temp$count = count + 1,
								$temp$remaining = restNext;
							prevDay = $temp$prevDay;
							count = $temp$count;
							remaining = $temp$remaining;
							continue go;
						} else {
							return count;
						}
					}
				}
			});
		return A3(go, first, 1, rest);
	}
};
var $elm$virtual_dom$VirtualDom$node = function (tag) {
	return _VirtualDom_node(
		_VirtualDom_noScript(tag));
};
var $elm$html$Html$node = $elm$virtual_dom$VirtualDom$node;
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $author$project$Main$css = function (theme) {
	var themeCls = function () {
		if (theme.$ === 'Dark') {
			return 'dark';
		} else {
			return 'light';
		}
	}();
	return A3(
		$elm$html$Html$node,
		'style',
		_List_Nil,
		_List_fromArray(
			[
				$elm$html$Html$text('\nbody { font-family: \'Inter\', \'Segoe UI\', system-ui, sans-serif; margin: 0; min-height: 100vh; }\n.container { max-width: 900px; margin: 0 auto; padding: 16px; min-height: 100vh; }\n.container.dark { background: radial-gradient(ellipse at top, #1a1a3e 0%, #0d0d1a 50%, #050510 100%); color: #eee; }\n.container.light { background: radial-gradient(ellipse at top, #f5f5f7 0%, #e8e8ec 50%, #ddd 100%); color: #1a1a2e; }\n.container, .expr-input, .stat-box, .btn-secondary, .message, .all-answers, .history-panel, .rules, .achievements-panel, .hint-box, .answer-item, .diff-btn, .mode-btn { transition: background-color 0.4s ease, color 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease; }\n\n.header { text-align: center; margin-bottom: 24px; position: relative; }\n.header h1 { font-size: 2.8em; margin: 0; font-weight: 900; letter-spacing: -1px; background: linear-gradient(135deg, #e94560, #ff6b6b, #ffd93d); -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 0 20px rgba(233,69,96,0.4)); }\n.container.light .header h1 { filter: drop-shadow(0 0 10px rgba(233,69,96,0.2)); }\n.header p { margin-top: 6px; font-size: 1em; font-weight: 400; }\n.container.dark .header p { color: #8892b0; }\n.container.light .header p { color: #64748b; }\n\n.stats { display: flex; justify-content: center; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; }\n.stat-box { border-radius: 14px; padding: 10px 16px; text-align: center; backdrop-filter: blur(20px); border: 1px solid; transition: all 0.3s; }\n.container.dark .stat-box { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.06); }\n.container.light .stat-box { background: rgba(0,0,0,0.04); border-color: rgba(0,0,0,0.08); }\n.stat-box:hover { transform: translateY(-2px); }\n.container.dark .stat-box:hover { background: rgba(255,255,255,0.08); }\n.container.light .stat-box:hover { background: rgba(0,0,0,0.08); }\n.stat-label { font-size: 0.65em; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600; }\n.container.dark .stat-label { color: #8892b0; }\n.container.light .stat-label { color: #64748b; }\n.stat-value { font-size: 1.3em; font-weight: 700; color: #e94560; margin-top: 2px; }\n.stat-fire { font-size: 1.1em; animation: firePulse 1s ease infinite; }\n@keyframes firePulse { 0%,100% { transform: scale(1); filter: brightness(1); } 50% { transform: scale(1.2); filter: brightness(1.3); } }\n\n.cards-area { display: flex; justify-content: center; gap: 12px; margin: 24px 0; flex-wrap: wrap; perspective: 800px; }\n.card {\n  width: 90px; height: 126px; background: linear-gradient(145deg, #ffffff 0%, #f0f0f0 40%, #e8e8e8 100%);\n  border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.8);\n  position: relative; transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);\n  cursor: pointer; overflow: hidden; border: 1px solid rgba(0,0,0,0.08);\n}\n.card::before { content: \'\'; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(0,0,0,0.015) 8px, rgba(0,0,0,0.015) 16px); pointer-events: none; }\n.card:hover { transform: translateY(-10px) rotateX(8deg) rotateY(-5deg) scale(1.08); box-shadow: 0 20px 40px rgba(0,0,0,0.6); z-index: 10; }\n.card:active { transform: scale(0.95); }\n@keyframes dealIn { 0% { opacity: 0; transform: translateY(-60px) rotateZ(-10deg) scale(0.7); } 70% { transform: translateY(5px) rotateZ(2deg) scale(1.02); } 100% { opacity: 1; transform: translateY(0) rotateZ(0) scale(1); } }\n.card { animation: dealIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) backwards; }\n.card:nth-child(1) { animation-delay: 0.08s; }\n.card:nth-child(2) { animation-delay: 0.16s; }\n.card:nth-child(3) { animation-delay: 0.24s; }\n.card:nth-child(4) { animation-delay: 0.32s; }\n.card-corner-top { position: absolute; top: 6px; left: 8px; display: flex; flex-direction: column; align-items: center; line-height: 1; }\n.card-corner-bottom { position: absolute; bottom: 6px; right: 8px; display: flex; flex-direction: column; align-items: center; line-height: 1; transform: rotate(180deg); }\n.card-corner-val { font-size: 1.1em; font-weight: 800; }\n.card-corner-suit { font-size: 0.85em; }\n.card-center-suit { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 2.8em; opacity: 0.15; }\n\n.card.streak-glow { box-shadow: 0 4px 20px rgba(233,69,96,0.3), 0 0 30px rgba(233,69,96,0.15); }\n.card.streak-fire { box-shadow: 0 4px 20px rgba(255,107,59,0.4), 0 0 40px rgba(255,107,59,0.2); animation: fireGlow 1.5s ease infinite; }\n.card.streak-god { box-shadow: 0 4px 20px rgba(255,215,0,0.5), 0 0 60px rgba(255,215,0,0.3); animation: godGlow 1s ease infinite; }\n@keyframes fireGlow { 0%,100% { box-shadow: 0 4px 20px rgba(255,107,59,0.4), 0 0 40px rgba(255,107,59,0.2); } 50% { box-shadow: 0 4px 20px rgba(255,107,59,0.6), 0 0 60px rgba(255,107,59,0.35); } }\n@keyframes godGlow { 0%,100% { box-shadow: 0 4px 20px rgba(255,215,0,0.5), 0 0 60px rgba(255,215,0,0.3); } 50% { box-shadow: 0 4px 20px rgba(255,215,0,0.7), 0 0 80px rgba(255,215,0,0.5); } }\n\n.input-area { display: flex; gap: 10px; justify-content: center; margin: 16px 0; flex-wrap: wrap; }\n.expr-input { flex: 1; min-width: 220px; max-width: 380px; padding: 14px 20px; border: 2px solid rgba(233,69,96,0.25); border-radius: 12px; font-size: 1.15em; outline: none; transition: all 0.3s; font-family: monospace; }\n.container.dark .expr-input { background: rgba(0,0,0,0.25); color: #fff; box-shadow: inset 0 2px 8px rgba(0,0,0,0.3); }\n.container.light .expr-input { background: rgba(0,0,0,0.05); color: #1a1a2e; box-shadow: inset 0 2px 8px rgba(0,0,0,0.05); }\n.expr-input:focus { border-color: #e94560; box-shadow: 0 0 20px rgba(233,69,96,0.2); }\n.container.dark .expr-input::placeholder { color: #555; }\n.container.light .expr-input::placeholder { color: #999; }\n\n.btn { padding: 12px 20px; border: none; border-radius: 10px; font-size: 0.9em; cursor: pointer; transition: all 0.15s; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; position: relative; overflow: hidden; }\n.btn::after { content: \'\'; position: absolute; top: 50%; left: 50%; width: 0; height: 0; background: rgba(255,255,255,0.2); border-radius: 50%; transform: translate(-50%, -50%); transition: width 0.4s, height 0.4s; }\n.btn:active::after { width: 200px; height: 200px; }\n.btn:active { transform: scale(0.92); }\n.btn-primary { background: linear-gradient(135deg, #e94560, #ff2e63); color: white; box-shadow: 0 4px 20px rgba(233,69,96,0.4); }\n.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(233,69,96,0.5); }\n.btn-success { background: linear-gradient(135deg, #00c9ff, #0077ff); color: white; box-shadow: 0 4px 20px rgba(0,201,255,0.3); }\n.btn-success:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,201,255,0.4); }\n.btn-secondary { border: 1px solid; }\n.container.dark .btn-secondary { background: rgba(255,255,255,0.06); color: #ccd6f6; border-color: rgba(255,255,255,0.1); }\n.container.light .btn-secondary { background: rgba(0,0,0,0.04); color: #475569; border-color: rgba(0,0,0,0.1); }\n.container.dark .btn-secondary:hover { background: rgba(255,255,255,0.12); }\n.container.light .btn-secondary:hover { background: rgba(0,0,0,0.08); }\n\n.message { text-align: center; padding: 14px 20px; border-radius: 12px; margin: 12px 0; font-weight: 600; min-height: 24px; font-size: 1.05em; backdrop-filter: blur(10px); }\n.container.dark .msg-success { background: rgba(46, 204, 113, 0.12); border: 1px solid rgba(46, 204, 113, 0.25); color: #2ecc71; }\n.container.light .msg-success { background: rgba(46, 204, 113, 0.08); border: 1px solid rgba(46, 204, 113, 0.2); color: #27ae60; }\n.container.dark .msg-error { background: rgba(231, 76, 60, 0.12); border: 1px solid rgba(231, 76, 60, 0.25); color: #e74c3c; }\n.container.light .msg-error { background: rgba(231, 76, 60, 0.08); border: 1px solid rgba(231, 76, 60, 0.2); color: #c0392b; }\n.container.dark .msg-info { background: rgba(52, 152, 219, 0.12); border: 1px solid rgba(52, 152, 219, 0.25); color: #3498db; }\n.container.light .msg-info { background: rgba(52, 152, 219, 0.08); border: 1px solid rgba(52, 152, 219, 0.2); color: #2980b9; }\n@keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.03); } 100% { transform: scale(1); } }\n@keyframes shake { 0%,100% { transform: translateX(0); } 15% { transform: translateX(-10px) rotate(-1deg); } 30% { transform: translateX(10px) rotate(1deg); } 45% { transform: translateX(-6px); } 60% { transform: translateX(6px); } 75% { transform: translateX(-3px); } }\n.msg-pulse { animation: pulse 0.6s ease; }\n.msg-shake { animation: shake 0.6s ease; }\n\n.hint-box { border: 1px dashed; border-radius: 12px; padding: 14px; margin: 12px 0; text-align: center; font-family: monospace; font-size: 1.05em; }\n.container.dark .hint-box { background: rgba(255, 193, 7, 0.08); border-color: rgba(255, 193, 7, 0.35); color: #ffc107; }\n.container.light .hint-box { background: rgba(255, 193, 7, 0.06); border-color: rgba(255, 193, 7, 0.3); color: #f39c12; }\n\n.achievement-toast { position: fixed; top: 20px; right: 20px; background: linear-gradient(135deg, #ffd700, #ffaa00); color: #1a1a2e; padding: 16px 24px; border-radius: 14px; font-weight: 700; box-shadow: 0 10px 40px rgba(255, 215, 0, 0.3); z-index: 10000; animation: slideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); max-width: 300px; }\n.achievement-toast .ach-title { font-size: 0.75em; text-transform: uppercase; letter-spacing: 1px; opacity: 0.7; margin-bottom: 4px; }\n.achievement-toast .ach-name { font-size: 1.2em; }\n@keyframes slideIn { 0% { transform: translateX(120%) scale(0.8); opacity: 0; } 100% { transform: translateX(0) scale(1); opacity: 1; } }\n\n.achievements-panel { border-radius: 14px; padding: 16px; margin: 12px 0; }\n.container.dark .achievements-panel { background: rgba(255,215,0,0.05); border: 1px solid rgba(255,215,0,0.15); }\n.container.light .achievements-panel { background: rgba(255,215,0,0.04); border: 1px solid rgba(255,215,0,0.12); }\n.achievements-panel h4 { margin: 0 0 10px 0; color: #ffd700; font-size: 0.9em; text-transform: uppercase; letter-spacing: 1px; }\n.ach-badge { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 0.75em; font-weight: 700; margin: 3px; border: 1px solid; }\n.container.dark .ach-badge { background: rgba(255,255,255,0.08); color: #8892b0; border-color: rgba(255,255,255,0.1); }\n.container.light .ach-badge { background: rgba(0,0,0,0.05); color: #64748b; border-color: rgba(0,0,0,0.08); }\n.ach-badge.unlocked { background: linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,170,0,0.2)); color: #ffd700; border-color: rgba(255,215,0,0.3); }\n\n.daily-streak { border-radius: 14px; padding: 14px; margin: 12px 0; text-align: center; }\n.container.dark .daily-streak { background: rgba(255,215,0,0.05); border: 1px solid rgba(255,215,0,0.15); }\n.container.light .daily-streak { background: rgba(255,215,0,0.04); border: 1px solid rgba(255,215,0,0.12); }\n.daily-streak-title { font-size: 0.8em; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #ffd700; margin-bottom: 4px; }\n.daily-streak-days { display: flex; align-items: baseline; justify-content: center; gap: 4px; }\n.daily-streak-num { font-size: 2em; font-weight: 900; color: #e94560; }\n.daily-streak-unit { font-size: 0.9em; color: #8892b0; font-weight: 600; }\n.daily-calendar { display: flex; gap: 6px; justify-content: center; margin-top: 10px; flex-wrap: wrap; }\n.daily-calendar-day { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 0.75em; font-weight: 700; }\n.container.dark .daily-calendar-day { background: rgba(255,255,255,0.06); color: #8892b0; }\n.container.light .daily-calendar-day { background: rgba(0,0,0,0.04); color: #64748b; }\n.daily-calendar-day.completed { background: linear-gradient(135deg, rgba(46,204,113,0.2), rgba(39,174,96,0.2)) !important; color: #2ecc71 !important; }\n\n.rules { border-radius: 14px; padding: 20px; margin-top: 24px; }\n.container.dark .rules { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); }\n.container.light .rules { background: rgba(0,0,0,0.02); border: 1px solid rgba(0,0,0,0.06); }\n.rules h3 { margin-top: 0; color: #e94560; font-size: 1.1em; }\n.container.dark .rules ul { padding-left: 20px; color: #8892b0; line-height: 1.8; font-size: 0.95em; }\n.container.light .rules ul { padding-left: 20px; color: #64748b; line-height: 1.8; font-size: 0.95em; }\n.rules code { background: rgba(233,69,96,0.12); padding: 2px 8px; border-radius: 6px; color: #ff6b6b; font-family: monospace; font-size: 0.9em; }\n\n.buttons-row { display: flex; gap: 8px; justify-content: center; margin-top: 8px; flex-wrap: wrap; }\n\n.all-answers { border-radius: 14px; padding: 18px; margin: 12px 0; }\n.container.dark .all-answers { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); }\n.container.light .all-answers { background: rgba(0,0,0,0.02); border: 1px solid rgba(0,0,0,0.06); }\n.all-answers-title { font-weight: 700; color: #e94560; margin-bottom: 10px; font-size: 1em; }\n.answers-list { display: flex; flex-direction: column; gap: 6px; max-height: 300px; overflow-y: auto; }\n.answer-item { padding: 10px 14px; border-radius: 8px; font-family: monospace; font-size: 1em; border-left: 3px solid #e94560; transition: all 0.2s; cursor: pointer; }\n.container.dark .answer-item { background: rgba(0,0,0,0.2); color: #ccd6f6; }\n.container.light .answer-item { background: rgba(0,0,0,0.05); color: #475569; }\n.container.dark .answer-item:hover { background: rgba(0,0,0,0.3); }\n.container.light .answer-item:hover { background: rgba(0,0,0,0.1); }\n.answer-item:hover { transform: translateX(4px); }\n\n.sfx-toggle { position: absolute; top: 0; right: 0; border: 1px solid; padding: 6px 12px; border-radius: 20px; font-size: 0.75em; cursor: pointer; transition: all 0.2s; }\n.container.dark .sfx-toggle { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.15); color: #ccd6f6; }\n.container.light .sfx-toggle { background: rgba(0,0,0,0.06); border-color: rgba(0,0,0,0.1); color: #475569; }\n.sfx-toggle:hover { transform: scale(1.05); }\n.container.dark .sfx-toggle:hover { background: rgba(255,255,255,0.15); }\n.container.light .sfx-toggle:hover { background: rgba(0,0,0,0.1); }\n\n.theme-toggle { position: absolute; top: 0; left: 0; border: 1px solid; padding: 6px 12px; border-radius: 20px; font-size: 0.75em; cursor: pointer; transition: all 0.2s; }\n.container.dark .theme-toggle { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.15); color: #ccd6f6; }\n.container.light .theme-toggle { background: rgba(0,0,0,0.06); border-color: rgba(0,0,0,0.1); color: #475569; }\n.theme-toggle:hover { transform: scale(1.05); }\n.container.dark .theme-toggle:hover { background: rgba(255,255,255,0.15); }\n.container.light .theme-toggle:hover { background: rgba(0,0,0,0.1); }\n\n.difficulty-row { display: flex; justify-content: center; gap: 8px; margin-bottom: 12px; }\n.diff-btn { padding: 6px 14px; border-radius: 20px; border: 1px solid; font-size: 0.75em; font-weight: 700; cursor: pointer; transition: all 0.2s; text-transform: uppercase; letter-spacing: 0.5px; }\n.container.dark .diff-btn { background: rgba(255,255,255,0.04); color: #8892b0; border-color: rgba(255,255,255,0.1); }\n.container.light .diff-btn { background: rgba(0,0,0,0.04); color: #64748b; border-color: rgba(0,0,0,0.1); }\n.container.dark .diff-btn:hover { background: rgba(255,255,255,0.1); }\n.container.light .diff-btn:hover { background: rgba(0,0,0,0.08); }\n.diff-btn.active { background: linear-gradient(135deg, #e94560, #ff2e63) !important; color: white !important; border-color: transparent !important; box-shadow: 0 4px 15px rgba(233,69,96,0.3); }\n\n.mode-row { display: flex; justify-content: center; gap: 8px; margin-bottom: 16px; }\n.mode-btn { padding: 8px 18px; border-radius: 20px; border: 1px solid; font-size: 0.8em; font-weight: 700; cursor: pointer; transition: all 0.2s; text-transform: uppercase; letter-spacing: 0.5px; }\n.container.dark .mode-btn { background: rgba(255,255,255,0.04); color: #8892b0; border-color: rgba(255,255,255,0.1); }\n.container.light .mode-btn { background: rgba(0,0,0,0.04); color: #64748b; border-color: rgba(0,0,0,0.1); }\n.container.dark .mode-btn:hover { background: rgba(255,255,255,0.1); }\n.container.light .mode-btn:hover { background: rgba(0,0,0,0.08); }\n.mode-btn.active { background: linear-gradient(135deg, #00c9ff, #0077ff) !important; color: white !important; border-color: transparent !important; box-shadow: 0 4px 15px rgba(0,201,255,0.3); }\n\n.live-result { text-align: center; font-family: monospace; font-size: 1.1em; min-height: 24px; margin: -6px 0 6px 0; transition: all 0.3s; }\n.container.dark .live-result { color: #8892b0; }\n.container.light .live-result { color: #64748b; }\n.live-result.valid { color: #2ecc71; font-weight: 700; }\n\n.history-panel { border-radius: 14px; padding: 14px; margin: 12px 0; }\n.container.dark .history-panel { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); }\n.container.light .history-panel { background: rgba(0,0,0,0.02); border: 1px solid rgba(0,0,0,0.06); }\n.history-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }\n.history-title { font-size: 0.8em; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }\n.container.dark .history-title { color: #8892b0; }\n.container.light .history-title { color: #64748b; }\n.history-clear { background: none; border: none; font-size: 0.75em; cursor: pointer; padding: 2px 8px; border-radius: 6px; transition: all 0.2s; }\n.container.dark .history-clear { color: #e94560; }\n.container.light .history-clear { color: #e94560; }\n.container.dark .history-clear:hover { background: rgba(233,69,96,0.15); }\n.container.light .history-clear:hover { background: rgba(233,69,96,0.1); }\n.history-list { display: flex; flex-wrap: wrap; gap: 6px; }\n.history-item { padding: 4px 10px; border-radius: 6px; font-family: monospace; font-size: 0.85em; border: 1px solid; }\n.container.dark .history-item { background: rgba(0,0,0,0.2); color: #8892b0; border-color: rgba(255,255,255,0.05); }\n.container.light .history-item { background: rgba(0,0,0,0.05); color: #64748b; border-color: rgba(0,0,0,0.05); }\n\n.time-attack-bar { width: 100%; height: 6px; border-radius: 3px; margin: 8px 0; overflow: hidden; }\n.container.dark .time-attack-bar { background: rgba(255,255,255,0.1); }\n.container.light .time-attack-bar { background: rgba(0,0,0,0.1); }\n.time-attack-fill { height: 100%; border-radius: 3px; transition: width 1s linear; }\n.time-attack-fill.ok { background: linear-gradient(90deg, #00c9ff, #0077ff); }\n.time-attack-fill.warn { background: linear-gradient(90deg, #ffd93d, #ff6b6b); }\n.time-attack-fill.danger { background: linear-gradient(90deg, #e94560, #ff2e63); }\n\n.daily-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 0.75em; font-weight: 700; margin-left: 8px; }\n.container.dark .daily-badge { background: rgba(255,215,0,0.15); color: #ffd700; border: 1px solid rgba(255,215,0,0.3); }\n.container.light .daily-badge { background: rgba(255,215,0,0.12); color: #d4a000; border: 1px solid rgba(255,215,0,0.25); }\n\n.footer { text-align: center; margin-top: 24px; font-size: 0.8em; padding-bottom: 20px; }\n.container.dark .footer { color: #555; }\n.container.light .footer { color: #999; }\n\n.keypad { display: flex; flex-direction: column; gap: 8px; align-items: center; margin: 12px 0; }\n.keypad-row { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; }\n.keypad-btn { min-width: 48px; height: 44px; border-radius: 10px; border: 1px solid; font-size: 1.1em; font-weight: 700; cursor: pointer; transition: all 0.15s; font-family: monospace; }\n.container.dark .keypad-btn { background: rgba(255,255,255,0.06); color: #ccd6f6; border-color: rgba(255,255,255,0.12); }\n.container.light .keypad-btn { background: rgba(0,0,0,0.04); color: #475569; border-color: rgba(0,0,0,0.1); }\n.container.dark .keypad-btn:hover { background: rgba(255,255,255,0.12); transform: translateY(-2px); }\n.container.light .keypad-btn:hover { background: rgba(0,0,0,0.08); transform: translateY(-2px); }\n.keypad-btn:active { transform: scale(0.92); }\n.keypad-num { min-width: 52px; font-size: 1.2em; }\n.keypad-op { min-width: 40px; }\n.keypad-del { color: #e94560 !important; }\n.keypad-clear { color: #ffd93d !important; }\n.keypad-submit { background: linear-gradient(135deg, #e94560, #ff2e63) !important; color: white !important; border-color: transparent !important; }\n.keypad-toggle { padding: 4px 12px; border-radius: 20px; border: 1px solid; font-size: 0.7em; font-weight: 700; cursor: pointer; transition: all 0.2s; margin-bottom: 4px; }\n.container.dark .keypad-toggle { background: rgba(255,255,255,0.06); color: #8892b0; border-color: rgba(255,255,255,0.1); }\n.container.light .keypad-toggle { background: rgba(0,0,0,0.04); color: #64748b; border-color: rgba(0,0,0,0.1); }\n\n.used-hint { text-align: center; font-size: 0.8em; margin: -4px 0 8px 0; font-weight: 600; }\n.container.dark .used-hint { color: #6bcb77; }\n.container.light .used-hint { color: #27ae60; }\n\n.skipped-panel { border-radius: 14px; padding: 16px; margin: 12px 0; }\n.container.dark .skipped-panel { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); }\n.container.light .skipped-panel { background: rgba(0,0,0,0.02); border: 1px solid rgba(0,0,0,0.06); }\n.skipped-header { display: flex; justify-content: space-between; align-items: center; cursor: pointer; margin-bottom: 8px; }\n.skipped-header h4 { margin: 0; color: #e94560; font-size: 0.9em; text-transform: uppercase; letter-spacing: 1px; }\n.skipped-list { display: flex; flex-direction: column; gap: 6px; max-height: 200px; overflow-y: auto; }\n.skipped-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; border-radius: 8px; font-family: monospace; font-size: 0.9em; }\n.container.dark .skipped-item { background: rgba(0,0,0,0.2); color: #ccd6f6; }\n.container.light .skipped-item { background: rgba(0,0,0,0.05); color: #475569; }\n.skipped-ans { color: #e94560; font-size: 0.85em; }\n\n@keyframes popUp { 0% { transform: scale(0.5); opacity: 0; } 50% { transform: scale(1.3); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }\n.pop-animation { animation: popUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }\n\n.combo-popup { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: linear-gradient(135deg, #e94560, #ff2e63); color: white; padding: 20px 40px; border-radius: 20px; font-size: 2em; font-weight: 900; z-index: 10001; box-shadow: 0 20px 60px rgba(233,69,96,0.5); animation: comboPop 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; pointer-events: none; text-align: center; }\n.combo-shield { font-size: 0.5em; margin-top: 8px; color: #ffd700; font-weight: 700; }\n@keyframes comboPop { 0% { transform: translate(-50%, -50%) scale(0); opacity: 0; } 20% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; } 70% { transform: translate(-50%, -50%) scale(1); opacity: 1; } 100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; } }\n\n.steps-panel { border-radius: 14px; padding: 18px; margin: 12px 0; }\n.container.dark .steps-panel { background: rgba(0,201,255,0.05); border: 1px solid rgba(0,201,255,0.15); }\n.container.light .steps-panel { background: rgba(0,201,255,0.03); border: 1px solid rgba(0,201,255,0.12); }\n.steps-title { font-weight: 700; color: #00c9ff; margin-bottom: 12px; font-size: 1em; }\n.steps-list { display: flex; flex-direction: column; gap: 8px; }\n.step-item { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 10px; font-family: monospace; font-size: 1em; }\n.container.dark .step-item { background: rgba(0,0,0,0.2); color: #ccd6f6; }\n.container.light .step-item { background: rgba(0,0,0,0.05); color: #475569; }\n.step-num { min-width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, #00c9ff, #0077ff); color: white; display: flex; align-items: center; justify-content: center; font-size: 0.8em; font-weight: 700; }\n.step-arrow { color: #00c9ff; font-size: 1.2em; }\n.step-result { color: #e94560; font-weight: 700; }\n\n.ta-history { border-radius: 14px; padding: 14px; margin: 12px 0; text-align: center; }\n.container.dark .ta-history { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); }\n.container.light .ta-history { background: rgba(0,0,0,0.02); border: 1px solid rgba(0,0,0,0.06); }\n.ta-history-title { font-size: 0.8em; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }\n.container.dark .ta-history-title { color: #8892b0; }\n.container.light .ta-history-title { color: #64748b; }\n.ta-scores { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; }\n.ta-score { padding: 4px 12px; border-radius: 20px; font-size: 0.85em; font-weight: 700; }\n.container.dark .ta-score { background: rgba(0,201,255,0.1); color: #00c9ff; }\n.container.light .ta-score { background: rgba(0,201,255,0.08); color: #0077ff; }\n.ta-score.best { background: linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,170,0,0.2)) !important; color: #ffd700 !important; }\n\n.tutorial-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 10002; display: flex; align-items: center; justify-content: center; padding: 20px; box-sizing: border-box; }\n.tutorial-box { max-width: 420px; width: 100%; border-radius: 20px; padding: 28px; text-align: center; animation: popUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }\n.container.dark .tutorial-box { background: #1a1a3e; border: 1px solid rgba(255,255,255,0.1); color: #eee; }\n.container.light .tutorial-box { background: #fff; border: 1px solid rgba(0,0,0,0.1); color: #1a1a2e; }\n.tutorial-box h2 { margin: 0 0 12px 0; font-size: 1.5em; font-weight: 900; color: #e94560; }\n.tutorial-box p { margin: 8px 0; font-size: 0.95em; line-height: 1.6; }\n.container.dark .tutorial-box p { color: #8892b0; }\n.container.light .tutorial-box p { color: #64748b; }\n.tutorial-box .btn { margin-top: 16px; }\n\n.reduce-motion .particle { display: none; }\n.reduce-motion .card { animation: none; }\n.reduce-motion .msg-pulse { animation: none; }\n.reduce-motion .msg-shake { animation: none; }\n.reduce-motion .combo-popup { animation: none; opacity: 1; }\n.reduce-motion .achievement-toast { animation: none; }\n.reduce-motion .pop-animation { animation: none; }\n.reduce-motion .stat-fire { animation: none; }\n\n@media (max-width: 600px) {\n    .header h1 { font-size: 2em; }\n    .header { position: relative; }\n    .sfx-toggle, .theme-toggle { position: relative; top: auto; right: auto; left: auto; margin-top: 8px; display: inline-block; }\n    .card { width: 72px; height: 100px; }\n    .card-center-suit { font-size: 2em; }\n    .btn { padding: 10px 14px; font-size: 0.8em; }\n    .stats { gap: 6px; }\n    .stat-box { padding: 8px 10px; }\n}\n')
			]));
};
var $author$project$Main$BackspaceInput = {$: 'BackspaceInput'};
var $author$project$Main$decodeKey = function (_v0) {
	var key = _v0.key;
	var ctrlKey = _v0.ctrlKey;
	return ((key === 'Enter') && ctrlKey) ? $author$project$Main$SubmitAnswer : ((key === 'Enter') ? $author$project$Main$SubmitAnswer : ((key === 'Escape') ? $author$project$Main$UpdateInput('') : ((key === 'Backspace') ? $author$project$Main$BackspaceInput : $author$project$Main$NoOp)));
};
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$disabled = $elm$html$Html$Attributes$boolProperty('disabled');
var $elm$html$Html$div = _VirtualDom_node('div');
var $author$project$Main$formatTime = function (seconds) {
	var s = A2($elm$core$Basics$modBy, 60, seconds);
	var m = (seconds / 60) | 0;
	return $elm$core$String$fromInt(m) + (':' + (((s < 10) ? '0' : '') + $elm$core$String$fromInt(s)));
};
var $elm$html$Html$h1 = _VirtualDom_node('h1');
var $elm$html$Html$h2 = _VirtualDom_node('h2');
var $elm$html$Html$h3 = _VirtualDom_node('h3');
var $elm$html$Html$h4 = _VirtualDom_node('h4');
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $elm$html$Html$input = _VirtualDom_node('input');
var $author$project$Main$keyDecoder = A3(
	$elm$json$Json$Decode$map2,
	F2(
		function (k, c) {
			return {ctrlKey: c, key: k};
		}),
	A2($elm$json$Json$Decode$field, 'key', $elm$json$Json$Decode$string),
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$field, 'ctrlKey', $elm$json$Json$Decode$bool),
				$elm$json$Json$Decode$succeed(false)
			])));
var $elm$html$Html$li = _VirtualDom_node('li');
var $author$project$Main$msgClass = function (mt) {
	switch (mt.$) {
		case 'Success':
			return 'message msg-success msg-pulse';
		case 'Error':
			return 'message msg-error msg-shake';
		case 'Info':
			return 'message msg-info';
		default:
			return 'message';
	}
};
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 'Normal', a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 'MayStopPropagation', a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $elm$html$Html$p = _VirtualDom_node('p');
var $elm$html$Html$Attributes$placeholder = $elm$html$Html$Attributes$stringProperty('placeholder');
var $elm$core$String$right = F2(
	function (n, string) {
		return (n < 1) ? '' : A3(
			$elm$core$String$slice,
			-n,
			$elm$core$String$length(string),
			string);
	});
var $elm$html$Html$span = _VirtualDom_node('span');
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $author$project$Main$themeName = function (t) {
	if (t.$ === 'Dark') {
		return '深色';
	} else {
		return '浅色';
	}
};
var $elm$html$Html$Attributes$title = $elm$html$Html$Attributes$stringProperty('title');
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $elm$html$Html$ul = _VirtualDom_node('ul');
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $author$project$Main$viewAchievementToast = F2(
	function (idx, name) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('achievement-toast'),
					A2(
					$elm$html$Html$Attributes$style,
					'top',
					$elm$core$String$fromInt(20 + (idx * 80)) + 'px')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('ach-title')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('解锁成就')
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('ach-name')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(name)
						]))
				]));
	});
var $author$project$Main$CardClick = function (a) {
	return {$: 'CardClick', a: a};
};
var $author$project$Main$viewCard = F2(
	function (card, streak) {
		var glowClass = (streak >= 20) ? ' streak-god' : ((streak >= 10) ? ' streak-fire' : ((streak >= 3) ? ' streak-glow' : ''));
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('card' + glowClass),
					$elm$html$Html$Events$onClick(
					$author$project$Main$CardClick(card.value)),
					$elm$html$Html$Attributes$title('点击输入 ' + card.display)
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('card-corner-top')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'color', card.color),
									A2($elm$html$Html$Attributes$style, 'font-size', '1.1em'),
									A2($elm$html$Html$Attributes$style, 'font-weight', '800')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(card.display)
								])),
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'color', card.color),
									A2($elm$html$Html$Attributes$style, 'font-size', '0.85em')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(card.suit)
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('card-center-suit'),
							A2($elm$html$Html$Attributes$style, 'color', card.color)
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(card.suit)
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('card-corner-bottom')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'color', card.color),
									A2($elm$html$Html$Attributes$style, 'font-size', '1.1em'),
									A2($elm$html$Html$Attributes$style, 'font-weight', '800')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(card.display)
								])),
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'color', card.color),
									A2($elm$html$Html$Attributes$style, 'font-size', '0.85em')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(card.suit)
								]))
						]))
				]));
	});
var $author$project$Main$KeypadInput = function (a) {
	return {$: 'KeypadInput', a: a};
};
var $author$project$Main$ToggleKeypad = {$: 'ToggleKeypad'};
var $author$project$Main$viewKeypad = function (model) {
	var uniqueCards = A2(
		$elm$core$List$sortBy,
		function ($) {
			return $.value;
		},
		A3(
			$elm$core$List$foldl,
			F2(
				function (c, acc) {
					return A2(
						$elm$core$List$any,
						function (existing) {
							return _Utils_eq(existing.value, c.value);
						},
						acc) ? acc : A2($elm$core$List$cons, c, acc);
				}),
			_List_Nil,
			model.cards));
	var ops = _List_fromArray(
		['+', '-', '*', '/', '(', ')']);
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('keypad')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('keypad-toggle'),
						$elm$html$Html$Events$onClick($author$project$Main$ToggleKeypad)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						model.keypadEnabled ? '隐藏键盘' : '显示键盘')
					])),
				model.keypadEnabled ? A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('keypad-row')
							]),
						A2(
							$elm$core$List$map,
							function (c) {
								return A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('keypad-btn keypad-num'),
											$elm$html$Html$Events$onClick(
											$author$project$Main$KeypadInput(
												$elm$core$String$fromInt(c.value)))
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(c.display)
										]));
							},
							uniqueCards)),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('keypad-row')
							]),
						A2(
							$elm$core$List$map,
							function (o) {
								return A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('keypad-btn keypad-op'),
											$elm$html$Html$Events$onClick(
											$author$project$Main$KeypadInput(o))
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(o)
										]));
							},
							ops)),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('keypad-row')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('keypad-btn keypad-del'),
										$elm$html$Html$Events$onClick($author$project$Main$BackspaceInput)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('⌫')
									])),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('keypad-btn keypad-clear'),
										$elm$html$Html$Events$onClick(
										$author$project$Main$UpdateInput(''))
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('C')
									])),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('keypad-btn keypad-submit'),
										$elm$html$Html$Events$onClick($author$project$Main$SubmitAnswer)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('✓')
									]))
							]))
					])) : $elm$html$Html$text('')
			]));
};
var $elm$core$Basics$clamp = F3(
	function (low, high, number) {
		return (_Utils_cmp(number, low) < 0) ? low : ((_Utils_cmp(number, high) > 0) ? high : number);
	});
var $author$project$Main$viewTimeAttackBar = function (timeLeft) {
	var pct = A3($elm$core$Basics$clamp, 0, 100, ((timeLeft * 100) / 60) | 0);
	var barClass = (timeLeft <= 10) ? 'time-attack-fill danger' : ((timeLeft <= 25) ? 'time-attack-fill warn' : 'time-attack-fill ok');
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('time-attack-bar')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class(barClass),
						A2(
						$elm$html$Html$Attributes$style,
						'width',
						$elm$core$String$fromInt(pct) + '%')
					]),
				_List_Nil)
			]));
};
var $author$project$Main$view = function (model) {
	var total = model.solved + model.skipped;
	var winRate = (!total) ? '0%' : ($elm$core$String$fromInt(
		$elm$core$Basics$round((model.solved / total) * 100)) + '%');
	var themeClass = function () {
		var _v1 = model.theme;
		if (_v1.$ === 'Dark') {
			return 'dark';
		} else {
			return 'light';
		}
	}();
	var streakFire = (model.streak >= 2) ? ' 🔥' : '';
	var isTimeAttack = _Utils_eq(model.gameMode, $author$project$Main$TimeAttack);
	var isReview = _Utils_eq(model.gameMode, $author$project$Main$Review);
	var isDaily = _Utils_eq(model.gameMode, $author$project$Main$Daily);
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class(
				'container ' + (themeClass + (model.reduceMotion ? ' reduce-motion' : '')))
			]),
		_List_fromArray(
			[
				$author$project$Main$css(model.theme),
				model.showTutorial ? A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('tutorial-overlay'),
						$elm$html$Html$Events$onClick($author$project$Main$DismissTutorial)
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('tutorial-box')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$h2,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('👋 欢迎来到 24点挑战')
									])),
								A2(
								$elm$html$Html$p,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('用加减乘除和括号，让 4 张牌算出 24 点。')
									])),
								A2(
								$elm$html$Html$p,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('🃏 点击牌面快速输入数字')
									])),
								A2(
								$elm$html$Html$p,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('⌨️ 支持键盘和虚拟键盘')
									])),
								A2(
								$elm$html$Html$p,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('🔥 连击解锁护盾保护')
									])),
								A2(
								$elm$html$Html$p,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('📱 支持 PWA 离线游玩')
									])),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('btn btn-primary'),
										$elm$html$Html$Events$onClick($author$project$Main$DismissTutorial)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('开始挑战')
									]))
							]))
					])) : $elm$html$Html$text(''),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('header')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('theme-toggle'),
								$elm$html$Html$Events$onClick(
								$author$project$Main$ChangeTheme(
									_Utils_eq(model.theme, $author$project$Main$Dark) ? $author$project$Main$Light : $author$project$Main$Dark))
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								$author$project$Main$themeName(model.theme))
							])),
						A2(
						$elm$html$Html$h1,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('24点挑战')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('用加减乘除和括号，让四张牌算出 24')
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('sfx-toggle'),
								$elm$html$Html$Events$onClick($author$project$Main$ToggleSFX)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								model.sfxEnabled ? '音效开' : '音效关')
							])),
						model.canInstallPWA ? A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('sfx-toggle'),
								$elm$html$Html$Events$onClick($author$project$Main$InstallPWA),
								A2($elm$html$Html$Attributes$style, 'right', '80px'),
								$elm$html$Html$Attributes$title('安装为本地应用')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('📲 安装')
							])) : $elm$html$Html$text('')
					])),
				(!model.isOnline) ? A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('message msg-error')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('⚠️ 当前处于离线状态')
					])) : $elm$html$Html$text(''),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('mode-row')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class(
								_Utils_eq(model.gameMode, $author$project$Main$Classic) ? 'mode-btn active' : 'mode-btn'),
								$elm$html$Html$Events$onClick(
								$author$project$Main$SetGameMode($author$project$Main$Classic))
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('经典')
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class(
								_Utils_eq(model.gameMode, $author$project$Main$Daily) ? 'mode-btn active' : 'mode-btn'),
								$elm$html$Html$Events$onClick(
								$author$project$Main$SetGameMode($author$project$Main$Daily))
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								'每日挑战' + ((isDaily && model.dailyCompleted) ? ' ✓' : ''))
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class(
								_Utils_eq(model.gameMode, $author$project$Main$TimeAttack) ? 'mode-btn active' : 'mode-btn'),
								$elm$html$Html$Events$onClick(
								$author$project$Main$SetGameMode($author$project$Main$TimeAttack))
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('计时挑战')
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class(
								_Utils_eq(model.gameMode, $author$project$Main$Review) ? 'mode-btn active' : 'mode-btn'),
								$elm$html$Html$Events$onClick(
								$author$project$Main$SetGameMode($author$project$Main$Review)),
								$elm$html$Html$Attributes$title('复习错题本中的题目')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								'错题复习' + ($elm$core$List$isEmpty(model.skippedProblems) ? '' : (' (' + ($elm$core$String$fromInt(
									$elm$core$List$length(model.skippedProblems)) + ')'))))
							]))
					])),
				isTimeAttack ? A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'text-align', 'center'),
								A2($elm$html$Html$Attributes$style, 'font-size', '0.85em'),
								A2($elm$html$Html$Attributes$style, 'color', '#e94560'),
								A2($elm$html$Html$Attributes$style, 'font-weight', '700'),
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '4px')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								$elm$core$String$fromInt(model.timeLeft) + ('秒  |  得分: ' + ($elm$core$String$fromInt(model.timeAttackScore) + ('  |  最佳: ' + $elm$core$String$fromInt(model.timeAttackBest)))))
							])),
						$author$project$Main$viewTimeAttackBar(model.timeLeft)
					])) : $elm$html$Html$text(''),
				isDaily ? A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'text-align', 'center'),
						A2($elm$html$Html$Attributes$style, 'font-size', '0.85em'),
						A2($elm$html$Html$Attributes$style, 'margin-bottom', '8px')
					]),
				_List_fromArray(
					[
						model.dailyCompleted ? A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'color', '#2ecc71'),
								A2($elm$html$Html$Attributes$style, 'font-weight', '600')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								'今日已完成！最佳用时: ' + $author$project$Main$formatTime(model.dailyBestTime))
							])) : A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'color', '#ffd700'),
								A2($elm$html$Html$Attributes$style, 'font-weight', '600')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('完成今日挑战，解锁专属成就！')
							]))
					])) : $elm$html$Html$text(''),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('stats')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('stat-box')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('stat-label')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('连胜')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('stat-value')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$span,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text(
												$elm$core$String$fromInt(model.streak))
											])),
										A2(
										$elm$html$Html$span,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('stat-fire')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(streakFire)
											]))
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('stat-box')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('stat-label')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('已解')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('stat-value')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										$elm$core$String$fromInt(model.solved))
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('stat-box')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('stat-label')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('最佳')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('stat-value')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										$elm$core$String$fromInt(model.bestStreak))
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('stat-box')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('stat-label')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('胜率')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('stat-value')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(winRate)
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('stat-box')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('stat-label')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('用时')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('stat-value')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										$author$project$Main$formatTime(model.timer))
									]))
							])),
						(model.fastestSolve > 0) ? A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('stat-box')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('stat-label')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('最快')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('stat-value')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										$author$project$Main$formatTime(model.fastestSolve))
									]))
							])) : $elm$html$Html$text('')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('cards-area')
					]),
				A2(
					$elm$core$List$map,
					function (c) {
						return A2($author$project$Main$viewCard, c, model.streak);
					},
					model.cards)),
				function () {
				var _v0 = model.comboDisplay;
				if (_v0.$ === 'Just') {
					var n = _v0.a;
					return A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('combo-popup')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								$elm$core$String$fromInt(n) + ' 连击！'),
								(model.shieldActive && (n >= 3)) ? A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('combo-shield')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('🛡️ 护盾激活')
									])) : $elm$html$Html$text('')
							]));
				} else {
					return $elm$html$Html$text('');
				}
			}(),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class(
						$author$project$Main$msgClass(model.messageType))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(model.message)
					])),
				model.showHint ? A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('hint-box')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(model.hintText)
					])) : $elm$html$Html$text(''),
				((!isTimeAttack) && (!isReview)) ? A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('difficulty-row')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class(
								_Utils_eq(model.difficulty, $author$project$Main$Easy) ? 'diff-btn active' : 'diff-btn'),
								$elm$html$Html$Events$onClick(
								$author$project$Main$ChangeDifficulty($author$project$Main$Easy))
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('初级')
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class(
								_Utils_eq(model.difficulty, $author$project$Main$Normal) ? 'diff-btn active' : 'diff-btn'),
								$elm$html$Html$Events$onClick(
								$author$project$Main$ChangeDifficulty($author$project$Main$Normal))
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('中级')
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class(
								_Utils_eq(model.difficulty, $author$project$Main$Hard) ? 'diff-btn active' : 'diff-btn'),
								$elm$html$Html$Events$onClick(
								$author$project$Main$ChangeDifficulty($author$project$Main$Hard))
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('高级')
							]))
					])) : $elm$html$Html$text(''),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('input-area')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$input,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('expr-input'),
								$elm$html$Html$Attributes$type_('text'),
								$elm$html$Html$Attributes$id('expr-input'),
								$elm$html$Html$Attributes$value(model.input),
								$elm$html$Html$Attributes$placeholder('输入算式，如 (3+3)*8/2  ·  Enter提交  ·  Esc清除  ·  Backspace退格  ·  点击牌输入'),
								$elm$html$Html$Events$onInput($author$project$Main$UpdateInput),
								A2(
								$elm$html$Html$Events$on,
								'keydown',
								A2($elm$json$Json$Decode$map, $author$project$Main$decodeKey, $author$project$Main$keyDecoder)),
								$elm$html$Html$Attributes$disabled(
								model.pendingNewCards || (_Utils_eq(model.gameMode, $author$project$Main$TimeAttack) && (model.timeLeft <= 0)))
							]),
						_List_Nil)
					])),
				$elm$core$String$isEmpty(model.liveResult) ? $elm$html$Html$text('') : A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class(
						A2($elm$core$String$contains, '= 24', model.liveResult) ? 'live-result valid' : 'live-result')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(model.liveResult)
					])),
				$elm$core$String$isEmpty(model.inputHint) ? $elm$html$Html$text('') : A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('used-hint')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(model.inputHint)
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('buttons-row')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('btn btn-primary'),
								$elm$html$Html$Events$onClick($author$project$Main$SubmitAnswer)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('提交')
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('btn btn-success'),
								$elm$html$Html$Events$onClick($author$project$Main$ShowHint)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('提示')
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('btn btn-secondary'),
								$elm$html$Html$Events$onClick($author$project$Main$ShowAllAnswers)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('全部')
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('btn btn-secondary'),
								$elm$html$Html$Events$onClick($author$project$Main$ShowSteps)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('步骤')
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('btn btn-secondary'),
								$elm$html$Html$Events$onClick($author$project$Main$Skip)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('跳过')
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('btn btn-secondary'),
								$elm$html$Html$Events$onClick($author$project$Main$ShareProblem)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('分享')
							])),
						(isTimeAttack && (model.timeLeft <= 0)) ? A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('btn btn-primary'),
								$elm$html$Html$Events$onClick($author$project$Main$StartTimeAttack)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('再来一局')
							])) : A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('btn btn-secondary'),
								$elm$html$Html$Events$onClick($author$project$Main$NewGame)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('新局')
							]))
					])),
				(!isTimeAttack) ? $author$project$Main$viewKeypad(model) : $elm$html$Html$text(''),
				(!$elm$core$List$isEmpty(model.history)) ? A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('history-panel')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('history-header')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('history-title')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('尝试记录')
									])),
								A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$elm$html$Html$button,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('history-clear'),
												$elm$html$Html$Events$onClick($author$project$Main$ExportData),
												$elm$html$Html$Attributes$title('导出数据到剪贴板')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('导出')
											])),
										A2(
										$elm$html$Html$button,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('history-clear'),
												$elm$html$Html$Events$onClick($author$project$Main$ClearHistory)
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('清除')
											]))
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('history-list')
							]),
						A2(
							$elm$core$List$indexedMap,
							F2(
								function (i, h) {
									return A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('history-item')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(
												$elm$core$String$fromInt(i + 1) + ('. ' + h))
											]));
								}),
							A2($elm$core$List$take, 8, model.history)))
					])) : $elm$html$Html$text(''),
				(model.showAllAnswers && (!$elm$core$List$isEmpty(model.allSolutions))) ? A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('all-answers')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('all-answers-title')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								'全部解法 (' + ($elm$core$String$fromInt(
									$elm$core$List$length(model.allSolutions)) + ' 个)'))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('answers-list')
							]),
						A2(
							$elm$core$List$indexedMap,
							F2(
								function (i, ans) {
									return A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('answer-item'),
												$elm$html$Html$Events$onClick(
												$author$project$Main$CopyAnswer(ans)),
												$elm$html$Html$Attributes$title('点击复制')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(
												$elm$core$String$fromInt(i + 1) + ('. ' + (ans + ' = 24')))
											]));
								}),
							model.allSolutions))
					])) : $elm$html$Html$text(''),
				(model.showSteps && (!$elm$core$List$isEmpty(model.stepByStep))) ? A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('steps-panel')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('steps-title')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('解题步骤')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('steps-list')
							]),
						A2(
							$elm$core$List$indexedMap,
							F2(
								function (i, step) {
									return A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('step-item')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('step-num')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text(
														$elm$core$String$fromInt(i + 1))
													])),
												A2(
												$elm$html$Html$span,
												_List_Nil,
												_List_fromArray(
													[
														$elm$html$Html$text(step.before)
													])),
												A2(
												$elm$html$Html$span,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('step-arrow')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('→')
													])),
												A2(
												$elm$html$Html$span,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('step-result')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text(
														$author$project$Main$fmt(step.result))
													]))
											]));
								}),
							model.stepByStep)),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'text-align', 'center'),
								A2($elm$html$Html$Attributes$style, 'margin-top', '10px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('btn btn-secondary'),
										$elm$html$Html$Events$onClick($author$project$Main$HideSteps)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('关闭')
									]))
							]))
					])) : $elm$html$Html$text(''),
				(isTimeAttack && (!$elm$core$List$isEmpty(model.timeAttackHistory))) ? A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('ta-history')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('ta-history-title')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('历史得分')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('ta-scores')
							]),
						A2(
							$elm$core$List$indexedMap,
							F2(
								function (i, rec) {
									return A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class(
												(!i) ? 'ta-score best' : 'ta-score'),
												$elm$html$Html$Attributes$title(
												'准确率: ' + (rec.accuracy + ($elm$core$String$isEmpty(rec.date) ? '' : (' | 日期: ' + rec.date))))
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(
												$elm$core$String$fromInt(rec.score))
											]));
								}),
							model.timeAttackHistory))
					])) : $elm$html$Html$text(''),
				(!$elm$core$List$isEmpty(model.newAchievements)) ? A2(
				$elm$html$Html$div,
				_List_Nil,
				_Utils_ap(
					A2($elm$core$List$indexedMap, $author$project$Main$viewAchievementToast, model.newAchievements),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'text-align', 'center'),
									A2($elm$html$Html$Attributes$style, 'margin-top', '8px')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('btn btn-secondary'),
											$elm$html$Html$Events$onClick($author$project$Main$DismissAchievements)
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('知道了')
										]))
								]))
						]))) : $elm$html$Html$text(''),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('achievements-panel')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h4,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('成就墙')
							])),
						A2(
						$elm$html$Html$div,
						_List_Nil,
						A2(
							$elm$core$List$map,
							function (a) {
								var isUnlocked = A2($elm$core$List$member, a, model.achievements);
								var progress = isUnlocked ? '' : A2($author$project$Main$achievementProgress, a, model);
								var label = isUnlocked ? a : (a + (' ' + progress));
								return A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class(
											isUnlocked ? 'ach-badge unlocked' : 'ach-badge'),
											$elm$html$Html$Attributes$title(
											isUnlocked ? '已解锁' : ('进度: ' + progress))
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(label)
										]));
							},
							$author$project$Main$allAchievements))
					])),
				(!$elm$core$List$isEmpty(model.dailyHistory)) ? A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('daily-streak')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('daily-streak-title')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('连续打卡')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('daily-streak-days')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('daily-streak-num')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										$elm$core$String$fromInt(
											$author$project$Main$consecutiveStreak(model.dailyHistory)))
									])),
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('daily-streak-unit')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('天')
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('daily-calendar')
							]),
						A2(
							$elm$core$List$map,
							function (date) {
								return A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('daily-calendar-day completed'),
											$elm$html$Html$Attributes$title(date)
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(
											A2($elm$core$String$right, 2, date))
										]));
							},
							A2($elm$core$List$take, 14, model.dailyHistory)))
					])) : $elm$html$Html$text(''),
				(!$elm$core$List$isEmpty(model.skippedProblems)) ? A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('skipped-panel')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('skipped-header'),
								$elm$html$Html$Events$onClick($author$project$Main$ToggleSkippedProblems)
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$h4,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(
										'错题本 (' + ($elm$core$String$fromInt(
											$elm$core$List$length(model.skippedProblems)) + ')'))
									])),
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'font-size', '0.8em')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										model.showSkippedProblems ? '▲' : '▼')
									]))
							])),
						model.showSkippedProblems ? A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('skipped-list')
							]),
						A2(
							$elm$core$List$indexedMap,
							F2(
								function (i, p) {
									return A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('skipped-item')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$span,
												_List_Nil,
												_List_fromArray(
													[
														$elm$html$Html$text(
														$elm$core$String$fromInt(i + 1) + ('. ' + A2(
															$elm$core$String$join,
															', ',
															A2($elm$core$List$map, $elm$core$String$fromInt, p.cardValues))))
													])),
												A2(
												$elm$html$Html$span,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('skipped-ans')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('答案: ' + (p.answer + ' = 24'))
													]))
											]));
								}),
							model.skippedProblems)) : $elm$html$Html$text('')
					])) : $elm$html$Html$text(''),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('rules')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h3,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('游戏规则')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('从扑克牌中随机抽取4张牌（A=1, J=11, Q=12, K=13），用加减乘除算出24')
							])),
						A2(
						$elm$html$Html$ul,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$li,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('只能使用加、减、乘、除和括号')
									])),
								A2(
								$elm$html$Html$li,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('每张牌必须且只能使用一次')
									])),
								A2(
								$elm$html$Html$li,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('最终结果必须恰好等于24')
									])),
								A2(
								$elm$html$Html$li,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('支持分数运算，如 8/(3-8/3) = 24')
									]))
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('示例：')
							])),
						A2(
						$elm$html$Html$ul,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$li,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('3, 3, 8, 8 → '),
										A2(
										$elm$html$Html$code,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text('8/(3-8/3)')
											])),
										$elm$html$Html$text(' = 24')
									])),
								A2(
								$elm$html$Html$li,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('4, 4, 10, 10 → '),
										A2(
										$elm$html$Html$code,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text('(10*10-4)/4')
											])),
										$elm$html$Html$text(' = 24')
									])),
								A2(
								$elm$html$Html$li,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('1, 5, 5, 5 → '),
										A2(
										$elm$html$Html$code,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text('5*(5-1/5)')
											])),
										$elm$html$Html$text(' = 24')
									]))
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('buttons-row')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('btn btn-secondary'),
								$elm$html$Html$Events$onClick($author$project$Main$TriggerImport),
								$elm$html$Html$Attributes$title('从剪贴板导入备份数据')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('📥 导入数据')
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('footer')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Elm · 纯函数式 · 零运行时错误 · PWA 离线可玩 v0.4.13')
					]))
			]));
};
var $author$project$Main$main = $elm$browser$Browser$element(
	{init: $author$project$Main$init, subscriptions: $author$project$Main$subscriptions, update: $author$project$Main$update, view: $author$project$Main$view});
_Platform_export({'Main':{'init':$author$project$Main$main(
	A2(
		$elm$json$Json$Decode$andThen,
		function (today) {
			return A2(
				$elm$json$Json$Decode$andThen,
				function (prefersReducedMotion) {
					return A2(
						$elm$json$Json$Decode$andThen,
						function (prefersDark) {
							return A2(
								$elm$json$Json$Decode$andThen,
								function (isFirstVisit) {
									return A2(
										$elm$json$Json$Decode$andThen,
										function (hash) {
											return $elm$json$Json$Decode$succeed(
												{hash: hash, isFirstVisit: isFirstVisit, prefersDark: prefersDark, prefersReducedMotion: prefersReducedMotion, today: today});
										},
										A2($elm$json$Json$Decode$field, 'hash', $elm$json$Json$Decode$string));
								},
								A2($elm$json$Json$Decode$field, 'isFirstVisit', $elm$json$Json$Decode$bool));
						},
						A2($elm$json$Json$Decode$field, 'prefersDark', $elm$json$Json$Decode$bool));
				},
				A2($elm$json$Json$Decode$field, 'prefersReducedMotion', $elm$json$Json$Decode$bool));
		},
		A2($elm$json$Json$Decode$field, 'today', $elm$json$Json$Decode$string)))(0)}});}(this));