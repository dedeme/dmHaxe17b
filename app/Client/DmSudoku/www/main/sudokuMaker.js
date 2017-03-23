(function (console) { "use strict";
var $estr = function() { return js_Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
Math.__name__ = true;
var Model = function() { };
Model.__name__ = true;
Model.linearGame = function(backward,next,forward) {
	while(true) if(next()) {
		if(!forward()) return true;
	} else if(!backward()) return false;
};
Model.linearGameSingle = function(backward,next,forward) {
	var r = 0;
	while(true) if(next()) {
		if(!forward()) {
			++r;
			if(r > 1 || !backward()) return r;
		}
	} else if(!backward()) return r;
};
var BiCounter = function(rowSize,colSize) {
	this.rowSize = rowSize;
	this.colSize = colSize;
	this.rowLimit = rowSize - 1;
	this.colLimit = colSize - 1;
	this.row = 0;
	this.col = 0;
};
BiCounter.__name__ = true;
BiCounter.prototype = {
	inc: function() {
		++this.col;
		if(this.col == this.colSize) {
			if(this.row == this.rowLimit) return false;
			this.col = 0;
			++this.row;
		}
		return true;
	}
	,dec: function() {
		--this.col;
		if(this.col == -1) {
			if(this.row == 0) return false;
			this.col = this.colLimit;
			--this.row;
		}
		return true;
	}
	,__class__: BiCounter
};
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
Std.random = function(x) {
	if(x <= 0) return 0; else return Math.floor(Math.random() * x);
};
var Sudoku = function(board) {
	this.board = board;
};
Sudoku.__name__ = true;
Sudoku.mkEmpty = function() {
	return new Sudoku(dm_It.range(9).map(function(_1) {
		return dm_It.range(9).map(function(_11) {
			return -1;
		}).to();
	}).to());
};
Sudoku.mkRandom = function() {
	var c = new BiCounter(9,9);
	var su = Sudoku.mkEmpty();
	var boxes = dm_It.range(9).map(function(_1) {
		return dm_It.range(9).map(function(_11) {
			return dm_It.from([1,2,3,4,5,6,7,8,9]).shuffle();
		}).to();
	}).to();
	var backward = function() {
		su.board[c.row][c.col] = -1;
		boxes[c.row][c.col] = dm_It.from([1,2,3,4,5,6,7,8,9]).shuffle();
		return c.dec();
	};
	var next = function() {
		var it = boxes[c.row][c.col];
		while(it.hasNext()) {
			var nx = it.next();
			if(su.putSeq(c.row,c.col,nx)) return true;
		}
		return false;
	};
	var forward = function() {
		return c.inc();
	};
	Model.linearGame(backward,next,forward);
	return su;
};
Sudoku.mkLevel = function(l) {
	var s = Sudoku.mkRandom();
	var base = Sudoku.mkEmpty();
	var user = Sudoku.mkEmpty();
	var limit;
	if(l == 1) limit = 0; else limit = 25 + l;
	while(true) {
		var _g = 0;
		while(_g < 9) {
			var r = _g++;
			var ixBox = new dm_Box([0,1,2,3,4,5,6,7,8]);
			var _g1 = 0;
			while(_g1 < 4) {
				var i1 = _g1++;
				var c = ixBox.next();
				var n = s.board[r][c];
				base.board[r][c] = n;
				user.board[r][c] = n;
			}
		}
		if(base.solutions() == 1) break;
		base = Sudoku.mkEmpty();
		user = Sudoku.mkEmpty();
	}
	var i = 36;
	var _g2 = 0;
	while(_g2 < 9) {
		var r1 = _g2++;
		var _g11 = 0;
		while(_g11 < 9) {
			var c1 = _g11++;
			var v = base.board[r1][c1];
			if(v != -1) {
				base.board[r1][c1] = -1;
				if(base.solutions() == 1) {
					user.board[r1][c1] = -1;
					--i;
					if(i == limit) break;
				} else base.board[r1][c1] = v;
			}
		}
		if(i == limit) break;
	}
	var pbox = new dm_Box([0,1,2]);
	var rbox = new dm_Box([0,1,2]);
	var s0 = [];
	var b0 = [];
	var u0 = [];
	var _g3 = 0;
	while(_g3 < 3) {
		var i2 = _g3++;
		var part = pbox.next();
		var _g12 = 0;
		while(_g12 < 3) {
			var j = _g12++;
			var row = rbox.next();
			s0.push(s.board[part * 3 + row]);
			b0.push(base.board[part * 3 + row]);
			u0.push(user.board[part * 3 + row]);
		}
	}
	s = new Sudoku(s0);
	base = new Sudoku(b0);
	user = new Sudoku(u0);
	var ix = 0;
	while(base.board[0][ix] != -1) ++ix;
	return { id : new Date().getTime(), date : dm_DateDm.fromDate(new Date()).serialize(), time : 0, cell : [0,ix], sudoku : s.board, base : base.board, user : user.board, pencil : dm_It.range(9).map(function(_1) {
		return dm_It.range(9).map(function(_11) {
			return false;
		}).to();
	}).to()};
};
Sudoku.prototype = {
	isRightValue: function(row,col,value) {
		var row2 = Math.floor(row / 3) * 3;
		var col2 = Math.floor(col / 3) * 3;
		var _g = 0;
		while(_g < 9) {
			var r = _g++;
			if(r != row && this.board[r][col] == value) return false;
		}
		var _g1 = 0;
		while(_g1 < 9) {
			var c = _g1++;
			if(c != col && this.board[row][c] == value) return false;
		}
		var _g11 = row2;
		var _g2 = row2 + 3;
		while(_g11 < _g2) {
			var r1 = _g11++;
			var _g3 = col2;
			var _g21 = col2 + 3;
			while(_g3 < _g21) {
				var c1 = _g3++;
				if((r1 != row || c1 != col) && this.board[r1][c1] == value) return false;
			}
		}
		return true;
	}
	,solutions: function() {
		var _g = this;
		var c = new BiCounter(9,9);
		var su = Sudoku.mkEmpty();
		var boxes = dm_It.range(9).map(function(row) {
			return dm_It.range(9).map(function(col) {
				var n = _g.board[row][col];
				if(n == -1) return dm_It.from([1,2,3,4,5,6,7,8,9]); else {
					su.board[row][col] = n;
					return dm_It.from([n]);
				}
			}).to();
		}).to();
		var backward = function() {
			var n1 = _g.board[c.row][c.col];
			su.board[c.row][c.col] = n1;
			if(n1 == -1) boxes[c.row][c.col] = dm_It.from([1,2,3,4,5,6,7,8,9]); else boxes[c.row][c.col] = dm_It.from([n1]);
			return c.dec();
		};
		var next = function() {
			var it = boxes[c.row][c.col];
			while(it.hasNext()) {
				var nx = it.next();
				var r = su.isRightValue(c.row,c.col,nx);
				if(r) {
					su.board[c.row][c.col] = nx;
					return true;
				}
			}
			return false;
		};
		var forward = function() {
			return c.inc();
		};
		return Model.linearGameSingle(backward,next,forward);
	}
	,putSeq: function(row,col,value) {
		var _g1 = this;
		var isRight = function(row1,col1,value1) {
			var row2 = Math.floor(row1 / 3) * 3;
			var col2 = Math.floor(col1 / 3) * 3;
			var _g = 0;
			while(_g < row1) {
				var r = _g++;
				if(_g1.board[r][col1] == value1) return false;
			}
			var _g2 = 0;
			while(_g2 < col1) {
				var c = _g2++;
				if(_g1.board[row1][c] == value1) return false;
			}
			var _g3 = row2;
			while(_g3 < row1) {
				var r1 = _g3++;
				var _g11 = col2;
				while(_g11 < col1) {
					var c1 = _g11++;
					if(_g1.board[r1][c1] == value1) return false;
				}
			}
			var _g4 = row2;
			while(_g4 < row1) {
				var r2 = _g4++;
				var _g21 = col1;
				var _g12 = col2 + 3;
				while(_g21 < _g12) {
					var c2 = _g21++;
					if(_g1.board[r2][c2] == value1) return false;
				}
			}
			return true;
		};
		var r3 = isRight(row,col,value);
		if(r3) this.board[row][col] = value;
		return r3;
	}
	,__class__: Sudoku
};
var SudokuMaker = function() { };
SudokuMaker.__name__ = true;
SudokuMaker.main = function() {
	dm_Worker.onRequest(function(e) {
		dm_Worker.postRequest(Sudoku.mkLevel(e.data));
	});
};
var dm_DateDm = function(day,month,year) {
	this.date = new Date(year,month - 1,day,12,0,0);
};
dm_DateDm.__name__ = true;
dm_DateDm.fromDate = function(date) {
	return new dm_DateDm(date.getDate(),date.getMonth() + 1,date.getFullYear());
};
dm_DateDm.prototype = {
	serialize: function() {
		return [this.date.getDate(),this.date.getMonth() + 1,this.date.getFullYear()];
	}
	,__class__: dm_DateDm
};
var dm_It = function(hasNext,next) {
	this.fhasNext = hasNext;
	this.fnext = next;
};
dm_It.__name__ = true;
dm_It.empty = function() {
	return new dm_It(function() {
		return false;
	},function() {
		return null;
	});
};
dm_It.from = function(it) {
	return dm_It.fromIterator($iterator(it)());
};
dm_It.fromIterator = function(it) {
	return new dm_It($bind(it,it.hasNext),$bind(it,it.next));
};
dm_It.range = function(begin,end,step) {
	if(end == null) {
		var count1 = 0;
		return new dm_It(function() {
			return count1 < begin;
		},function() {
			return count1++;
		});
	}
	if(step == null) {
		var count2 = begin;
		return new dm_It(function() {
			return count2 < end;
		},function() {
			return count2++;
		});
	}
	if(step == 0) return dm_It.empty();
	var count = begin;
	return new dm_It(function() {
		if(step > 0) return count < end; else return count > end;
	},function() {
		var r = count;
		count += step;
		return r;
	});
};
dm_It.prototype = {
	hasNext: function() {
		return this.fhasNext();
	}
	,map: function(f) {
		var _g = this;
		return new dm_It(function() {
			return _g.hasNext();
		},function() {
			return f(_g.next());
		});
	}
	,next: function() {
		return this.fnext();
	}
	,reduce: function(seed,f) {
		while(this.hasNext()) seed = f(seed,this.next());
		return seed;
	}
	,shuffle: function() {
		var a = this.to();
		var lg = a.length;
		var ni;
		var tmp;
		var _g = 0;
		while(_g < lg) {
			var i = _g++;
			ni = Std.random(lg);
			if(i != ni) {
				tmp = a[i];
				a[i] = a[ni];
				a[ni] = tmp;
			}
		}
		return dm_It.from(a);
	}
	,to: function() {
		return this.reduce([],function(r,e) {
			r.push(e);
			return r;
		});
	}
	,__class__: dm_It
};
var dm_Box = function(es) {
	this.es = dm_It.from(es).to();
	this.box = dm_It.from(es).shuffle().to();
};
dm_Box.__name__ = true;
dm_Box.prototype = {
	next: function() {
		if(this.box.length == 0) this.box = dm_It.from(this.es).shuffle().to();
		return this.box.pop();
	}
	,__class__: dm_Box
};
var dm_Worker = function() { };
dm_Worker.__name__ = true;
dm_Worker.onRequest = function(f) {
	onmessage=f;
};
dm_Worker.postRequest = function(rp) {
	postMessage(rp);
};
var haxe__$Int64__$_$_$Int64 = function(high,low) {
	this.high = high;
	this.low = low;
};
haxe__$Int64__$_$_$Int64.__name__ = true;
haxe__$Int64__$_$_$Int64.prototype = {
	__class__: haxe__$Int64__$_$_$Int64
};
var haxe_io_Error = { __ename__ : true, __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] };
haxe_io_Error.Blocked = ["Blocked",0];
haxe_io_Error.Blocked.toString = $estr;
haxe_io_Error.Blocked.__enum__ = haxe_io_Error;
haxe_io_Error.Overflow = ["Overflow",1];
haxe_io_Error.Overflow.toString = $estr;
haxe_io_Error.Overflow.__enum__ = haxe_io_Error;
haxe_io_Error.OutsideBounds = ["OutsideBounds",2];
haxe_io_Error.OutsideBounds.toString = $estr;
haxe_io_Error.OutsideBounds.__enum__ = haxe_io_Error;
haxe_io_Error.Custom = function(e) { var $x = ["Custom",3,e]; $x.__enum__ = haxe_io_Error; $x.toString = $estr; return $x; };
var haxe_io_FPHelper = function() { };
haxe_io_FPHelper.__name__ = true;
haxe_io_FPHelper.i32ToFloat = function(i) {
	var sign = 1 - (i >>> 31 << 1);
	var exp = i >>> 23 & 255;
	var sig = i & 8388607;
	if(sig == 0 && exp == 0) return 0.0;
	return sign * (1 + Math.pow(2,-23) * sig) * Math.pow(2,exp - 127);
};
haxe_io_FPHelper.floatToI32 = function(f) {
	if(f == 0) return 0;
	var af;
	if(f < 0) af = -f; else af = f;
	var exp = Math.floor(Math.log(af) / 0.6931471805599453);
	if(exp < -127) exp = -127; else if(exp > 128) exp = 128;
	var sig = Math.round((af / Math.pow(2,exp) - 1) * 8388608) & 8388607;
	return (f < 0?-2147483648:0) | exp + 127 << 23 | sig;
};
haxe_io_FPHelper.i64ToDouble = function(low,high) {
	var sign = 1 - (high >>> 31 << 1);
	var exp = (high >> 20 & 2047) - 1023;
	var sig = (high & 1048575) * 4294967296. + (low >>> 31) * 2147483648. + (low & 2147483647);
	if(sig == 0 && exp == -1023) return 0.0;
	return sign * (1.0 + Math.pow(2,-52) * sig) * Math.pow(2,exp);
};
haxe_io_FPHelper.doubleToI64 = function(v) {
	var i64 = haxe_io_FPHelper.i64tmp;
	if(v == 0) {
		i64.low = 0;
		i64.high = 0;
	} else {
		var av;
		if(v < 0) av = -v; else av = v;
		var exp = Math.floor(Math.log(av) / 0.6931471805599453);
		var sig;
		var v1 = (av / Math.pow(2,exp) - 1) * 4503599627370496.;
		sig = Math.round(v1);
		var sig_l = sig | 0;
		var sig_h = sig / 4294967296.0 | 0;
		i64.low = sig_l;
		i64.high = (v < 0?-2147483648:0) | exp + 1023 << 20 | sig_h;
	}
	return i64;
};
var js__$Boot_HaxeError = function(val) {
	Error.call(this);
	this.val = val;
	this.message = String(val);
	if(Error.captureStackTrace) Error.captureStackTrace(this,js__$Boot_HaxeError);
};
js__$Boot_HaxeError.__name__ = true;
js__$Boot_HaxeError.__super__ = Error;
js__$Boot_HaxeError.prototype = $extend(Error.prototype,{
	__class__: js__$Boot_HaxeError
});
var js_Boot = function() { };
js_Boot.__name__ = true;
js_Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) return Array; else {
		var cl = o.__class__;
		if(cl != null) return cl;
		var name = js_Boot.__nativeClassName(o);
		if(name != null) return js_Boot.__resolveNativeClass(name);
		return null;
	}
};
js_Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str2 = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i1 = _g1++;
					if(i1 != 2) str2 += "," + js_Boot.__string_rec(o[i1],s); else str2 += js_Boot.__string_rec(o[i1],s);
				}
				return str2 + ")";
			}
			var l = o.length;
			var i;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js_Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			if (e instanceof js__$Boot_HaxeError) e = e.val;
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js_Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js_Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js_Boot.__interfLoop(cc.__super__,cl);
};
js_Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Array:
		return (o instanceof Array) && o.__enum__ == null;
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) return true;
				if(js_Boot.__interfLoop(js_Boot.getClass(o),cl)) return true;
			} else if(typeof(cl) == "object" && js_Boot.__isNativeObj(cl)) {
				if(o instanceof cl) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
};
js_Boot.__nativeClassName = function(o) {
	var name = js_Boot.__toStr.call(o).slice(8,-1);
	if(name == "Object" || name == "Function" || name == "Math" || name == "JSON") return null;
	return name;
};
js_Boot.__isNativeObj = function(o) {
	return js_Boot.__nativeClassName(o) != null;
};
js_Boot.__resolveNativeClass = function(name) {
	if(typeof window != "undefined") return window[name]; else return global[name];
};
var js_html_compat_ArrayBuffer = function(a) {
	if((a instanceof Array) && a.__enum__ == null) {
		this.a = a;
		this.byteLength = a.length;
	} else {
		var len = a;
		this.a = [];
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			this.a[i] = 0;
		}
		this.byteLength = len;
	}
};
js_html_compat_ArrayBuffer.__name__ = true;
js_html_compat_ArrayBuffer.sliceImpl = function(begin,end) {
	var u = new Uint8Array(this,begin,end == null?null:end - begin);
	var result = new ArrayBuffer(u.byteLength);
	var resultArray = new Uint8Array(result);
	resultArray.set(u);
	return result;
};
js_html_compat_ArrayBuffer.prototype = {
	slice: function(begin,end) {
		return new js_html_compat_ArrayBuffer(this.a.slice(begin,end));
	}
	,__class__: js_html_compat_ArrayBuffer
};
var js_html_compat_DataView = function(buffer,byteOffset,byteLength) {
	this.buf = buffer;
	if(byteOffset == null) this.offset = 0; else this.offset = byteOffset;
	if(byteLength == null) this.length = buffer.byteLength - this.offset; else this.length = byteLength;
	if(this.offset < 0 || this.length < 0 || this.offset + this.length > buffer.byteLength) throw new js__$Boot_HaxeError(haxe_io_Error.OutsideBounds);
};
js_html_compat_DataView.__name__ = true;
js_html_compat_DataView.prototype = {
	getInt8: function(byteOffset) {
		var v = this.buf.a[this.offset + byteOffset];
		if(v >= 128) return v - 256; else return v;
	}
	,getUint8: function(byteOffset) {
		return this.buf.a[this.offset + byteOffset];
	}
	,getInt16: function(byteOffset,littleEndian) {
		var v = this.getUint16(byteOffset,littleEndian);
		if(v >= 32768) return v - 65536; else return v;
	}
	,getUint16: function(byteOffset,littleEndian) {
		if(littleEndian) return this.buf.a[this.offset + byteOffset] | this.buf.a[this.offset + byteOffset + 1] << 8; else return this.buf.a[this.offset + byteOffset] << 8 | this.buf.a[this.offset + byteOffset + 1];
	}
	,getInt32: function(byteOffset,littleEndian) {
		var p = this.offset + byteOffset;
		var a = this.buf.a[p++];
		var b = this.buf.a[p++];
		var c = this.buf.a[p++];
		var d = this.buf.a[p++];
		if(littleEndian) return a | b << 8 | c << 16 | d << 24; else return d | c << 8 | b << 16 | a << 24;
	}
	,getUint32: function(byteOffset,littleEndian) {
		var v = this.getInt32(byteOffset,littleEndian);
		if(v < 0) return v + 4294967296.; else return v;
	}
	,getFloat32: function(byteOffset,littleEndian) {
		return haxe_io_FPHelper.i32ToFloat(this.getInt32(byteOffset,littleEndian));
	}
	,getFloat64: function(byteOffset,littleEndian) {
		var a = this.getInt32(byteOffset,littleEndian);
		var b = this.getInt32(byteOffset + 4,littleEndian);
		return haxe_io_FPHelper.i64ToDouble(littleEndian?a:b,littleEndian?b:a);
	}
	,setInt8: function(byteOffset,value) {
		if(value < 0) this.buf.a[byteOffset + this.offset] = value + 128 & 255; else this.buf.a[byteOffset + this.offset] = value & 255;
	}
	,setUint8: function(byteOffset,value) {
		this.buf.a[byteOffset + this.offset] = value & 255;
	}
	,setInt16: function(byteOffset,value,littleEndian) {
		this.setUint16(byteOffset,value < 0?value + 65536:value,littleEndian);
	}
	,setUint16: function(byteOffset,value,littleEndian) {
		var p = byteOffset + this.offset;
		if(littleEndian) {
			this.buf.a[p] = value & 255;
			this.buf.a[p++] = value >> 8 & 255;
		} else {
			this.buf.a[p++] = value >> 8 & 255;
			this.buf.a[p] = value & 255;
		}
	}
	,setInt32: function(byteOffset,value,littleEndian) {
		this.setUint32(byteOffset,value,littleEndian);
	}
	,setUint32: function(byteOffset,value,littleEndian) {
		var p = byteOffset + this.offset;
		if(littleEndian) {
			this.buf.a[p++] = value & 255;
			this.buf.a[p++] = value >> 8 & 255;
			this.buf.a[p++] = value >> 16 & 255;
			this.buf.a[p++] = value >>> 24;
		} else {
			this.buf.a[p++] = value >>> 24;
			this.buf.a[p++] = value >> 16 & 255;
			this.buf.a[p++] = value >> 8 & 255;
			this.buf.a[p++] = value & 255;
		}
	}
	,setFloat32: function(byteOffset,value,littleEndian) {
		this.setUint32(byteOffset,haxe_io_FPHelper.floatToI32(value),littleEndian);
	}
	,setFloat64: function(byteOffset,value,littleEndian) {
		var i64 = haxe_io_FPHelper.doubleToI64(value);
		if(littleEndian) {
			this.setUint32(byteOffset,i64.low);
			this.setUint32(byteOffset,i64.high);
		} else {
			this.setUint32(byteOffset,i64.high);
			this.setUint32(byteOffset,i64.low);
		}
	}
	,__class__: js_html_compat_DataView
};
var js_html_compat_Uint8Array = function() { };
js_html_compat_Uint8Array.__name__ = true;
js_html_compat_Uint8Array._new = function(arg1,offset,length) {
	var arr;
	if(typeof(arg1) == "number") {
		arr = [];
		var _g = 0;
		while(_g < arg1) {
			var i = _g++;
			arr[i] = 0;
		}
		arr.byteLength = arr.length;
		arr.byteOffset = 0;
		arr.buffer = new js_html_compat_ArrayBuffer(arr);
	} else if(js_Boot.__instanceof(arg1,js_html_compat_ArrayBuffer)) {
		var buffer = arg1;
		if(offset == null) offset = 0;
		if(length == null) length = buffer.byteLength - offset;
		if(offset == 0) arr = buffer.a; else arr = buffer.a.slice(offset,offset + length);
		arr.byteLength = arr.length;
		arr.byteOffset = offset;
		arr.buffer = buffer;
	} else if((arg1 instanceof Array) && arg1.__enum__ == null) {
		arr = arg1.slice();
		arr.byteLength = arr.length;
		arr.byteOffset = 0;
		arr.buffer = new js_html_compat_ArrayBuffer(arr);
	} else throw new js__$Boot_HaxeError("TODO " + Std.string(arg1));
	arr.subarray = js_html_compat_Uint8Array._subarray;
	arr.set = js_html_compat_Uint8Array._set;
	return arr;
};
js_html_compat_Uint8Array._set = function(arg,offset) {
	var t = this;
	if(js_Boot.__instanceof(arg.buffer,js_html_compat_ArrayBuffer)) {
		var a = arg;
		if(arg.byteLength + offset > t.byteLength) throw new js__$Boot_HaxeError("set() outside of range");
		var _g1 = 0;
		var _g = arg.byteLength;
		while(_g1 < _g) {
			var i = _g1++;
			t[i + offset] = a[i];
		}
	} else if((arg instanceof Array) && arg.__enum__ == null) {
		var a1 = arg;
		if(a1.length + offset > t.byteLength) throw new js__$Boot_HaxeError("set() outside of range");
		var _g11 = 0;
		var _g2 = a1.length;
		while(_g11 < _g2) {
			var i1 = _g11++;
			t[i1 + offset] = a1[i1];
		}
	} else throw new js__$Boot_HaxeError("TODO");
};
js_html_compat_Uint8Array._subarray = function(start,end) {
	var t = this;
	var a = js_html_compat_Uint8Array._new(t.slice(start,end));
	a.byteOffset = start;
	return a;
};
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; }
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
String.prototype.__class__ = String;
String.__name__ = true;
Array.__name__ = true;
Date.prototype.__class__ = Date;
Date.__name__ = ["Date"];
var Int = { __name__ : ["Int"]};
var Dynamic = { __name__ : ["Dynamic"]};
var Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = { __name__ : ["Class"]};
var Enum = { };
var ArrayBuffer = typeof(window) != "undefined" && window.ArrayBuffer || typeof(global) != "undefined" && global.ArrayBuffer || js_html_compat_ArrayBuffer;
if(ArrayBuffer.prototype.slice == null) ArrayBuffer.prototype.slice = js_html_compat_ArrayBuffer.sliceImpl;
var DataView = typeof(window) != "undefined" && window.DataView || typeof(global) != "undefined" && global.DataView || js_html_compat_DataView;
var Uint8Array = typeof(window) != "undefined" && window.Uint8Array || typeof(global) != "undefined" && global.Uint8Array || js_html_compat_Uint8Array._new;
haxe_io_FPHelper.i64tmp = (function($this) {
	var $r;
	var x = new haxe__$Int64__$_$_$Int64(0,0);
	$r = x;
	return $r;
}(this));
js_Boot.__toStr = {}.toString;
js_html_compat_Uint8Array.BYTES_PER_ELEMENT = 1;
SudokuMaker.main();
})(typeof console != "undefined" ? console : {log:function(){}});