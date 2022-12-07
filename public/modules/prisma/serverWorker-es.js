var ie = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Lr(e) {
  var t = e.default;
  if (typeof t == "function") {
    var n = function() {
      return t.apply(this, arguments);
    };
    n.prototype = t.prototype;
  } else
    n = {};
  return Object.defineProperty(n, "__esModule", { value: !0 }), Object.keys(e).forEach(function(r) {
    var i = Object.getOwnPropertyDescriptor(e, r);
    Object.defineProperty(n, r, i.get ? i : {
      enumerable: !0,
      get: function() {
        return e[r];
      }
    });
  }), n;
}
var At = { exports: {} }, at = {}, hn = {}, Se = {}, oe = {}, gn = { exports: {} }, Qe = {}, mi = {}, Pe = {};
Object.defineProperty(Pe, "__esModule", { value: !0 });
let mn;
function yn() {
  if (mn === void 0)
    throw new Error("No runtime abstraction layer installed");
  return mn;
}
(function(e) {
  function t(n) {
    if (n === void 0)
      throw new Error("No runtime abstraction layer provided");
    mn = n;
  }
  e.install = t;
})(yn || (yn = {}));
Pe.default = yn;
var yi = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.Disposable = void 0, function(t) {
    function n(r) {
      return {
        dispose: r
      };
    }
    t.create = n;
  }(e.Disposable || (e.Disposable = {}));
})(yi);
var Xe = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.Emitter = e.Event = void 0;
  const t = Pe;
  (function(i) {
    const o = { dispose() {
    } };
    i.None = function() {
      return o;
    };
  })(e.Event || (e.Event = {}));
  class n {
    add(o, a = null, u) {
      this._callbacks || (this._callbacks = [], this._contexts = []), this._callbacks.push(o), this._contexts.push(a), Array.isArray(u) && u.push({ dispose: () => this.remove(o, a) });
    }
    remove(o, a = null) {
      if (!this._callbacks)
        return;
      let u = !1;
      for (let c = 0, d = this._callbacks.length; c < d; c++)
        if (this._callbacks[c] === o)
          if (this._contexts[c] === a) {
            this._callbacks.splice(c, 1), this._contexts.splice(c, 1);
            return;
          } else
            u = !0;
      if (u)
        throw new Error("When adding a listener with a context, you should remove it with the same context");
    }
    invoke(...o) {
      if (!this._callbacks)
        return [];
      const a = [], u = this._callbacks.slice(0), c = this._contexts.slice(0);
      for (let d = 0, y = u.length; d < y; d++)
        try {
          a.push(u[d].apply(c[d], o));
        } catch (v) {
          (0, t.default)().console.error(v);
        }
      return a;
    }
    isEmpty() {
      return !this._callbacks || this._callbacks.length === 0;
    }
    dispose() {
      this._callbacks = void 0, this._contexts = void 0;
    }
  }
  class r {
    constructor(o) {
      this._options = o;
    }
    get event() {
      return this._event || (this._event = (o, a, u) => {
        this._callbacks || (this._callbacks = new n()), this._options && this._options.onFirstListenerAdd && this._callbacks.isEmpty() && this._options.onFirstListenerAdd(this), this._callbacks.add(o, a);
        const c = {
          dispose: () => {
            !this._callbacks || (this._callbacks.remove(o, a), c.dispose = r._noop, this._options && this._options.onLastListenerRemove && this._callbacks.isEmpty() && this._options.onLastListenerRemove(this));
          }
        };
        return Array.isArray(u) && u.push(c), c;
      }), this._event;
    }
    fire(o) {
      this._callbacks && this._callbacks.invoke.call(this._callbacks, o);
    }
    dispose() {
      this._callbacks && (this._callbacks.dispose(), this._callbacks = void 0);
    }
  }
  e.Emitter = r, r._noop = function() {
  };
})(Xe);
var Wt = {};
Object.defineProperty(Wt, "__esModule", { value: !0 });
Wt.AbstractMessageBuffer = void 0;
const Fr = 13, Ar = 10, Wr = `\r
`;
class Ir {
  constructor(t = "utf-8") {
    this._encoding = t, this._chunks = [], this._totalLength = 0;
  }
  get encoding() {
    return this._encoding;
  }
  append(t) {
    const n = typeof t == "string" ? this.fromString(t, this._encoding) : t;
    this._chunks.push(n), this._totalLength += n.byteLength;
  }
  tryReadHeaders() {
    if (this._chunks.length === 0)
      return;
    let t = 0, n = 0, r = 0, i = 0;
    e:
      for (; n < this._chunks.length; ) {
        const c = this._chunks[n];
        for (r = 0; r < c.length; ) {
          switch (c[r]) {
            case Fr:
              switch (t) {
                case 0:
                  t = 1;
                  break;
                case 2:
                  t = 3;
                  break;
                default:
                  t = 0;
              }
              break;
            case Ar:
              switch (t) {
                case 1:
                  t = 2;
                  break;
                case 3:
                  t = 4, r++;
                  break e;
                default:
                  t = 0;
              }
              break;
            default:
              t = 0;
          }
          r++;
        }
        i += c.byteLength, n++;
      }
    if (t !== 4)
      return;
    const o = this._read(i + r), a = /* @__PURE__ */ new Map(), u = this.toString(o, "ascii").split(Wr);
    if (u.length < 2)
      return a;
    for (let c = 0; c < u.length - 2; c++) {
      const d = u[c], y = d.indexOf(":");
      if (y === -1)
        throw new Error("Message header must separate key and value using :");
      const v = d.substr(0, y), m = d.substr(y + 1).trim();
      a.set(v, m);
    }
    return a;
  }
  tryReadBody(t) {
    if (!(this._totalLength < t))
      return this._read(t);
  }
  get numberOfBytes() {
    return this._totalLength;
  }
  _read(t) {
    if (t === 0)
      return this.emptyBuffer();
    if (t > this._totalLength)
      throw new Error("Cannot read so many bytes!");
    if (this._chunks[0].byteLength === t) {
      const o = this._chunks[0];
      return this._chunks.shift(), this._totalLength -= t, this.asNative(o);
    }
    if (this._chunks[0].byteLength > t) {
      const o = this._chunks[0], a = this.asNative(o, t);
      return this._chunks[0] = o.slice(t), this._totalLength -= t, a;
    }
    const n = this.allocNative(t);
    let r = 0, i = 0;
    for (; t > 0; ) {
      const o = this._chunks[i];
      if (o.byteLength > t) {
        const a = o.slice(0, t);
        n.set(a, r), r += t, this._chunks[i] = o.slice(t), this._totalLength -= t, t -= t;
      } else
        n.set(o, r), r += o.byteLength, this._chunks.shift(), this._totalLength -= o.byteLength, t -= o.byteLength;
    }
    return n;
  }
}
Wt.AbstractMessageBuffer = Ir;
Object.defineProperty(mi, "__esModule", { value: !0 });
const $i = Pe, tt = yi, Hr = Xe, $r = Wt;
class It extends $r.AbstractMessageBuffer {
  constructor(t = "utf-8") {
    super(t), this.asciiDecoder = new TextDecoder("ascii");
  }
  emptyBuffer() {
    return It.emptyBuffer;
  }
  fromString(t, n) {
    return new TextEncoder().encode(t);
  }
  toString(t, n) {
    return n === "ascii" ? this.asciiDecoder.decode(t) : new TextDecoder(n).decode(t);
  }
  asNative(t, n) {
    return n === void 0 ? t : t.slice(0, n);
  }
  allocNative(t) {
    return new Uint8Array(t);
  }
}
It.emptyBuffer = new Uint8Array(0);
class zr {
  constructor(t) {
    this.socket = t, this._onData = new Hr.Emitter(), this._messageListener = (n) => {
      n.data.arrayBuffer().then((i) => {
        this._onData.fire(new Uint8Array(i));
      }, () => {
        (0, $i.default)().console.error("Converting blob to array buffer failed.");
      });
    }, this.socket.addEventListener("message", this._messageListener);
  }
  onClose(t) {
    return this.socket.addEventListener("close", t), tt.Disposable.create(() => this.socket.removeEventListener("close", t));
  }
  onError(t) {
    return this.socket.addEventListener("error", t), tt.Disposable.create(() => this.socket.removeEventListener("error", t));
  }
  onEnd(t) {
    return this.socket.addEventListener("end", t), tt.Disposable.create(() => this.socket.removeEventListener("end", t));
  }
  onData(t) {
    return this._onData.event(t);
  }
}
class Br {
  constructor(t) {
    this.socket = t;
  }
  onClose(t) {
    return this.socket.addEventListener("close", t), tt.Disposable.create(() => this.socket.removeEventListener("close", t));
  }
  onError(t) {
    return this.socket.addEventListener("error", t), tt.Disposable.create(() => this.socket.removeEventListener("error", t));
  }
  onEnd(t) {
    return this.socket.addEventListener("end", t), tt.Disposable.create(() => this.socket.removeEventListener("end", t));
  }
  write(t, n) {
    if (typeof t == "string") {
      if (n !== void 0 && n !== "utf-8")
        throw new Error(`In a Browser environments only utf-8 text encoding is supported. But got encoding: ${n}`);
      this.socket.send(t);
    } else
      this.socket.send(t);
    return Promise.resolve();
  }
  end() {
    this.socket.close();
  }
}
const Ur = new TextEncoder(), zi = Object.freeze({
  messageBuffer: Object.freeze({
    create: (e) => new It(e)
  }),
  applicationJson: Object.freeze({
    encoder: Object.freeze({
      name: "application/json",
      encode: (e, t) => {
        if (t.charset !== "utf-8")
          throw new Error(`In a Browser environments only utf-8 text encoding is supported. But got encoding: ${t.charset}`);
        return Promise.resolve(Ur.encode(JSON.stringify(e, void 0, 0)));
      }
    }),
    decoder: Object.freeze({
      name: "application/json",
      decode: (e, t) => {
        if (!(e instanceof Uint8Array))
          throw new Error("In a Browser environments only Uint8Arrays are supported.");
        return Promise.resolve(JSON.parse(new TextDecoder(t.charset).decode(e)));
      }
    })
  }),
  stream: Object.freeze({
    asReadableStream: (e) => new zr(e),
    asWritableStream: (e) => new Br(e)
  }),
  console,
  timer: Object.freeze({
    setTimeout(e, t, ...n) {
      const r = setTimeout(e, t, ...n);
      return { dispose: () => clearTimeout(r) };
    },
    setImmediate(e, ...t) {
      const n = setTimeout(e, 0, ...t);
      return { dispose: () => clearTimeout(n) };
    },
    setInterval(e, t, ...n) {
      const r = setInterval(e, t, ...n);
      return { dispose: () => clearInterval(r) };
    }
  })
});
function pn() {
  return zi;
}
(function(e) {
  function t() {
    $i.default.install(zi);
  }
  e.install = t;
})(pn || (pn = {}));
mi.default = pn;
var nn = {}, rn = {}, le = {}, Ti;
function Rt() {
  if (Ti)
    return le;
  Ti = 1, Object.defineProperty(le, "__esModule", { value: !0 }), le.stringArray = le.array = le.func = le.error = le.number = le.string = le.boolean = void 0;
  function e(u) {
    return u === !0 || u === !1;
  }
  le.boolean = e;
  function t(u) {
    return typeof u == "string" || u instanceof String;
  }
  le.string = t;
  function n(u) {
    return typeof u == "number" || u instanceof Number;
  }
  le.number = n;
  function r(u) {
    return u instanceof Error;
  }
  le.error = r;
  function i(u) {
    return typeof u == "function";
  }
  le.func = i;
  function o(u) {
    return Array.isArray(u);
  }
  le.array = o;
  function a(u) {
    return o(u) && u.every((c) => t(c));
  }
  return le.stringArray = a, le;
}
var wi;
function Bi() {
  return wi || (wi = 1, function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.Message = e.NotificationType9 = e.NotificationType8 = e.NotificationType7 = e.NotificationType6 = e.NotificationType5 = e.NotificationType4 = e.NotificationType3 = e.NotificationType2 = e.NotificationType1 = e.NotificationType0 = e.NotificationType = e.RequestType9 = e.RequestType8 = e.RequestType7 = e.RequestType6 = e.RequestType5 = e.RequestType4 = e.RequestType3 = e.RequestType2 = e.RequestType1 = e.RequestType = e.RequestType0 = e.AbstractMessageSignature = e.ParameterStructures = e.ResponseError = e.ErrorCodes = void 0;
    const t = Rt();
    var n;
    (function(s) {
      s.ParseError = -32700, s.InvalidRequest = -32600, s.MethodNotFound = -32601, s.InvalidParams = -32602, s.InternalError = -32603, s.jsonrpcReservedErrorRangeStart = -32099, s.serverErrorStart = -32099, s.MessageWriteError = -32099, s.MessageReadError = -32098, s.PendingResponseRejected = -32097, s.ConnectionInactive = -32096, s.ServerNotInitialized = -32002, s.UnknownErrorCode = -32001, s.jsonrpcReservedErrorRangeEnd = -32e3, s.serverErrorEnd = -32e3;
    })(n = e.ErrorCodes || (e.ErrorCodes = {}));
    class r extends Error {
      constructor(w, A, N) {
        super(A), this.code = t.number(w) ? w : n.UnknownErrorCode, this.data = N, Object.setPrototypeOf(this, r.prototype);
      }
      toJson() {
        const w = {
          code: this.code,
          message: this.message
        };
        return this.data !== void 0 && (w.data = this.data), w;
      }
    }
    e.ResponseError = r;
    class i {
      constructor(w) {
        this.kind = w;
      }
      static is(w) {
        return w === i.auto || w === i.byName || w === i.byPosition;
      }
      toString() {
        return this.kind;
      }
    }
    e.ParameterStructures = i, i.auto = new i("auto"), i.byPosition = new i("byPosition"), i.byName = new i("byName");
    class o {
      constructor(w, A) {
        this.method = w, this.numberOfParams = A;
      }
      get parameterStructures() {
        return i.auto;
      }
    }
    e.AbstractMessageSignature = o;
    class a extends o {
      constructor(w) {
        super(w, 0);
      }
    }
    e.RequestType0 = a;
    class u extends o {
      constructor(w, A = i.auto) {
        super(w, 1), this._parameterStructures = A;
      }
      get parameterStructures() {
        return this._parameterStructures;
      }
    }
    e.RequestType = u;
    class c extends o {
      constructor(w, A = i.auto) {
        super(w, 1), this._parameterStructures = A;
      }
      get parameterStructures() {
        return this._parameterStructures;
      }
    }
    e.RequestType1 = c;
    class d extends o {
      constructor(w) {
        super(w, 2);
      }
    }
    e.RequestType2 = d;
    class y extends o {
      constructor(w) {
        super(w, 3);
      }
    }
    e.RequestType3 = y;
    class v extends o {
      constructor(w) {
        super(w, 4);
      }
    }
    e.RequestType4 = v;
    class m extends o {
      constructor(w) {
        super(w, 5);
      }
    }
    e.RequestType5 = m;
    class g extends o {
      constructor(w) {
        super(w, 6);
      }
    }
    e.RequestType6 = g;
    class P extends o {
      constructor(w) {
        super(w, 7);
      }
    }
    e.RequestType7 = P;
    class I extends o {
      constructor(w) {
        super(w, 8);
      }
    }
    e.RequestType8 = I;
    class B extends o {
      constructor(w) {
        super(w, 9);
      }
    }
    e.RequestType9 = B;
    class M extends o {
      constructor(w, A = i.auto) {
        super(w, 1), this._parameterStructures = A;
      }
      get parameterStructures() {
        return this._parameterStructures;
      }
    }
    e.NotificationType = M;
    class H extends o {
      constructor(w) {
        super(w, 0);
      }
    }
    e.NotificationType0 = H;
    class $ extends o {
      constructor(w, A = i.auto) {
        super(w, 1), this._parameterStructures = A;
      }
      get parameterStructures() {
        return this._parameterStructures;
      }
    }
    e.NotificationType1 = $;
    class re extends o {
      constructor(w) {
        super(w, 2);
      }
    }
    e.NotificationType2 = re;
    class he extends o {
      constructor(w) {
        super(w, 3);
      }
    }
    e.NotificationType3 = he;
    class Z extends o {
      constructor(w) {
        super(w, 4);
      }
    }
    e.NotificationType4 = Z;
    class ae extends o {
      constructor(w) {
        super(w, 5);
      }
    }
    e.NotificationType5 = ae;
    class T extends o {
      constructor(w) {
        super(w, 6);
      }
    }
    e.NotificationType6 = T;
    class j extends o {
      constructor(w) {
        super(w, 7);
      }
    }
    e.NotificationType7 = j;
    class F extends o {
      constructor(w) {
        super(w, 8);
      }
    }
    e.NotificationType8 = F;
    class E extends o {
      constructor(w) {
        super(w, 9);
      }
    }
    e.NotificationType9 = E, function(s) {
      function w(W) {
        const G = W;
        return G && t.string(G.method) && (t.string(G.id) || t.number(G.id));
      }
      s.isRequest = w;
      function A(W) {
        const G = W;
        return G && t.string(G.method) && W.id === void 0;
      }
      s.isNotification = A;
      function N(W) {
        const G = W;
        return G && (G.result !== void 0 || !!G.error) && (t.string(G.id) || t.number(G.id) || G.id === null);
      }
      s.isResponse = N;
    }(e.Message || (e.Message = {}));
  }(rn)), rn;
}
var on = {}, Pi;
function Ui() {
  return Pi || (Pi = 1, function(e) {
    var t;
    Object.defineProperty(e, "__esModule", { value: !0 }), e.LRUCache = e.LinkedMap = e.Touch = void 0;
    var n;
    (function(o) {
      o.None = 0, o.First = 1, o.AsOld = o.First, o.Last = 2, o.AsNew = o.Last;
    })(n = e.Touch || (e.Touch = {}));
    class r {
      constructor() {
        this[t] = "LinkedMap", this._map = /* @__PURE__ */ new Map(), this._head = void 0, this._tail = void 0, this._size = 0, this._state = 0;
      }
      clear() {
        this._map.clear(), this._head = void 0, this._tail = void 0, this._size = 0, this._state++;
      }
      isEmpty() {
        return !this._head && !this._tail;
      }
      get size() {
        return this._size;
      }
      get first() {
        var a;
        return (a = this._head) == null ? void 0 : a.value;
      }
      get last() {
        var a;
        return (a = this._tail) == null ? void 0 : a.value;
      }
      has(a) {
        return this._map.has(a);
      }
      get(a, u = n.None) {
        const c = this._map.get(a);
        if (!!c)
          return u !== n.None && this.touch(c, u), c.value;
      }
      set(a, u, c = n.None) {
        let d = this._map.get(a);
        if (d)
          d.value = u, c !== n.None && this.touch(d, c);
        else {
          switch (d = { key: a, value: u, next: void 0, previous: void 0 }, c) {
            case n.None:
              this.addItemLast(d);
              break;
            case n.First:
              this.addItemFirst(d);
              break;
            case n.Last:
              this.addItemLast(d);
              break;
            default:
              this.addItemLast(d);
              break;
          }
          this._map.set(a, d), this._size++;
        }
        return this;
      }
      delete(a) {
        return !!this.remove(a);
      }
      remove(a) {
        const u = this._map.get(a);
        if (!!u)
          return this._map.delete(a), this.removeItem(u), this._size--, u.value;
      }
      shift() {
        if (!this._head && !this._tail)
          return;
        if (!this._head || !this._tail)
          throw new Error("Invalid list");
        const a = this._head;
        return this._map.delete(a.key), this.removeItem(a), this._size--, a.value;
      }
      forEach(a, u) {
        const c = this._state;
        let d = this._head;
        for (; d; ) {
          if (u ? a.bind(u)(d.value, d.key, this) : a(d.value, d.key, this), this._state !== c)
            throw new Error("LinkedMap got modified during iteration.");
          d = d.next;
        }
      }
      keys() {
        const a = this._state;
        let u = this._head;
        const c = {
          [Symbol.iterator]: () => c,
          next: () => {
            if (this._state !== a)
              throw new Error("LinkedMap got modified during iteration.");
            if (u) {
              const d = { value: u.key, done: !1 };
              return u = u.next, d;
            } else
              return { value: void 0, done: !0 };
          }
        };
        return c;
      }
      values() {
        const a = this._state;
        let u = this._head;
        const c = {
          [Symbol.iterator]: () => c,
          next: () => {
            if (this._state !== a)
              throw new Error("LinkedMap got modified during iteration.");
            if (u) {
              const d = { value: u.value, done: !1 };
              return u = u.next, d;
            } else
              return { value: void 0, done: !0 };
          }
        };
        return c;
      }
      entries() {
        const a = this._state;
        let u = this._head;
        const c = {
          [Symbol.iterator]: () => c,
          next: () => {
            if (this._state !== a)
              throw new Error("LinkedMap got modified during iteration.");
            if (u) {
              const d = { value: [u.key, u.value], done: !1 };
              return u = u.next, d;
            } else
              return { value: void 0, done: !0 };
          }
        };
        return c;
      }
      [(t = Symbol.toStringTag, Symbol.iterator)]() {
        return this.entries();
      }
      trimOld(a) {
        if (a >= this.size)
          return;
        if (a === 0) {
          this.clear();
          return;
        }
        let u = this._head, c = this.size;
        for (; u && c > a; )
          this._map.delete(u.key), u = u.next, c--;
        this._head = u, this._size = c, u && (u.previous = void 0), this._state++;
      }
      addItemFirst(a) {
        if (!this._head && !this._tail)
          this._tail = a;
        else if (this._head)
          a.next = this._head, this._head.previous = a;
        else
          throw new Error("Invalid list");
        this._head = a, this._state++;
      }
      addItemLast(a) {
        if (!this._head && !this._tail)
          this._head = a;
        else if (this._tail)
          a.previous = this._tail, this._tail.next = a;
        else
          throw new Error("Invalid list");
        this._tail = a, this._state++;
      }
      removeItem(a) {
        if (a === this._head && a === this._tail)
          this._head = void 0, this._tail = void 0;
        else if (a === this._head) {
          if (!a.next)
            throw new Error("Invalid list");
          a.next.previous = void 0, this._head = a.next;
        } else if (a === this._tail) {
          if (!a.previous)
            throw new Error("Invalid list");
          a.previous.next = void 0, this._tail = a.previous;
        } else {
          const u = a.next, c = a.previous;
          if (!u || !c)
            throw new Error("Invalid list");
          u.previous = c, c.next = u;
        }
        a.next = void 0, a.previous = void 0, this._state++;
      }
      touch(a, u) {
        if (!this._head || !this._tail)
          throw new Error("Invalid list");
        if (!(u !== n.First && u !== n.Last)) {
          if (u === n.First) {
            if (a === this._head)
              return;
            const c = a.next, d = a.previous;
            a === this._tail ? (d.next = void 0, this._tail = d) : (c.previous = d, d.next = c), a.previous = void 0, a.next = this._head, this._head.previous = a, this._head = a, this._state++;
          } else if (u === n.Last) {
            if (a === this._tail)
              return;
            const c = a.next, d = a.previous;
            a === this._head ? (c.previous = void 0, this._head = c) : (c.previous = d, d.next = c), a.next = void 0, a.previous = this._tail, this._tail.next = a, this._tail = a, this._state++;
          }
        }
      }
      toJSON() {
        const a = [];
        return this.forEach((u, c) => {
          a.push([c, u]);
        }), a;
      }
      fromJSON(a) {
        this.clear();
        for (const [u, c] of a)
          this.set(u, c);
      }
    }
    e.LinkedMap = r;
    class i extends r {
      constructor(a, u = 1) {
        super(), this._limit = a, this._ratio = Math.min(Math.max(0, u), 1);
      }
      get limit() {
        return this._limit;
      }
      set limit(a) {
        this._limit = a, this.checkTrim();
      }
      get ratio() {
        return this._ratio;
      }
      set ratio(a) {
        this._ratio = Math.min(Math.max(0, a), 1), this.checkTrim();
      }
      get(a, u = n.AsNew) {
        return super.get(a, u);
      }
      peek(a) {
        return super.get(a, n.None);
      }
      set(a, u) {
        return super.set(a, u, n.Last), this.checkTrim(), this;
      }
      checkTrim() {
        this.size > this._limit && this.trimOld(Math.round(this._limit * this._ratio));
      }
    }
    e.LRUCache = i;
  }(on)), on;
}
var sn = {}, ki;
function Vi() {
  return ki || (ki = 1, function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.CancellationTokenSource = e.CancellationToken = void 0;
    const t = Pe, n = Rt(), r = Xe;
    var i;
    (function(c) {
      c.None = Object.freeze({
        isCancellationRequested: !1,
        onCancellationRequested: r.Event.None
      }), c.Cancelled = Object.freeze({
        isCancellationRequested: !0,
        onCancellationRequested: r.Event.None
      });
      function d(y) {
        const v = y;
        return v && (v === c.None || v === c.Cancelled || n.boolean(v.isCancellationRequested) && !!v.onCancellationRequested);
      }
      c.is = d;
    })(i = e.CancellationToken || (e.CancellationToken = {}));
    const o = Object.freeze(function(c, d) {
      const y = (0, t.default)().timer.setTimeout(c.bind(d), 0);
      return { dispose() {
        y.dispose();
      } };
    });
    class a {
      constructor() {
        this._isCancelled = !1;
      }
      cancel() {
        this._isCancelled || (this._isCancelled = !0, this._emitter && (this._emitter.fire(void 0), this.dispose()));
      }
      get isCancellationRequested() {
        return this._isCancelled;
      }
      get onCancellationRequested() {
        return this._isCancelled ? o : (this._emitter || (this._emitter = new r.Emitter()), this._emitter.event);
      }
      dispose() {
        this._emitter && (this._emitter.dispose(), this._emitter = void 0);
      }
    }
    class u {
      get token() {
        return this._token || (this._token = new a()), this._token;
      }
      cancel() {
        this._token ? this._token.cancel() : this._token = i.Cancelled;
      }
      dispose() {
        this._token ? this._token instanceof a && this._token.dispose() : this._token = i.None;
      }
    }
    e.CancellationTokenSource = u;
  }(sn)), sn;
}
var an = {}, Ci;
function Vr() {
  return Ci || (Ci = 1, function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.ReadableStreamMessageReader = e.AbstractMessageReader = e.MessageReader = void 0;
    const t = Pe, n = Rt(), r = Xe;
    (function(u) {
      function c(d) {
        let y = d;
        return y && n.func(y.listen) && n.func(y.dispose) && n.func(y.onError) && n.func(y.onClose) && n.func(y.onPartialMessage);
      }
      u.is = c;
    })(e.MessageReader || (e.MessageReader = {}));
    class i {
      constructor() {
        this.errorEmitter = new r.Emitter(), this.closeEmitter = new r.Emitter(), this.partialMessageEmitter = new r.Emitter();
      }
      dispose() {
        this.errorEmitter.dispose(), this.closeEmitter.dispose();
      }
      get onError() {
        return this.errorEmitter.event;
      }
      fireError(c) {
        this.errorEmitter.fire(this.asError(c));
      }
      get onClose() {
        return this.closeEmitter.event;
      }
      fireClose() {
        this.closeEmitter.fire(void 0);
      }
      get onPartialMessage() {
        return this.partialMessageEmitter.event;
      }
      firePartialMessage(c) {
        this.partialMessageEmitter.fire(c);
      }
      asError(c) {
        return c instanceof Error ? c : new Error(`Reader received error. Reason: ${n.string(c.message) ? c.message : "unknown"}`);
      }
    }
    e.AbstractMessageReader = i;
    var o;
    (function(u) {
      function c(d) {
        var I;
        let y, v;
        const m = /* @__PURE__ */ new Map();
        let g;
        const P = /* @__PURE__ */ new Map();
        if (d === void 0 || typeof d == "string")
          y = d != null ? d : "utf-8";
        else {
          if (y = (I = d.charset) != null ? I : "utf-8", d.contentDecoder !== void 0 && (v = d.contentDecoder, m.set(v.name, v)), d.contentDecoders !== void 0)
            for (const B of d.contentDecoders)
              m.set(B.name, B);
          if (d.contentTypeDecoder !== void 0 && (g = d.contentTypeDecoder, P.set(g.name, g)), d.contentTypeDecoders !== void 0)
            for (const B of d.contentTypeDecoders)
              P.set(B.name, B);
        }
        return g === void 0 && (g = (0, t.default)().applicationJson.decoder, P.set(g.name, g)), { charset: y, contentDecoder: v, contentDecoders: m, contentTypeDecoder: g, contentTypeDecoders: P };
      }
      u.fromOptions = c;
    })(o || (o = {}));
    class a extends i {
      constructor(c, d) {
        super(), this.readable = c, this.options = o.fromOptions(d), this.buffer = (0, t.default)().messageBuffer.create(this.options.charset), this._partialMessageTimeout = 1e4, this.nextMessageLength = -1, this.messageToken = 0;
      }
      set partialMessageTimeout(c) {
        this._partialMessageTimeout = c;
      }
      get partialMessageTimeout() {
        return this._partialMessageTimeout;
      }
      listen(c) {
        this.nextMessageLength = -1, this.messageToken = 0, this.partialMessageTimer = void 0, this.callback = c;
        const d = this.readable.onData((y) => {
          this.onData(y);
        });
        return this.readable.onError((y) => this.fireError(y)), this.readable.onClose(() => this.fireClose()), d;
      }
      onData(c) {
        for (this.buffer.append(c); ; ) {
          if (this.nextMessageLength === -1) {
            const v = this.buffer.tryReadHeaders();
            if (!v)
              return;
            const m = v.get("Content-Length");
            if (!m)
              throw new Error("Header must provide a Content-Length property.");
            const g = parseInt(m);
            if (isNaN(g))
              throw new Error("Content-Length value must be a number.");
            this.nextMessageLength = g;
          }
          const d = this.buffer.tryReadBody(this.nextMessageLength);
          if (d === void 0) {
            this.setPartialMessageTimer();
            return;
          }
          this.clearPartialMessageTimer(), this.nextMessageLength = -1;
          let y;
          this.options.contentDecoder !== void 0 ? y = this.options.contentDecoder.decode(d) : y = Promise.resolve(d), y.then((v) => {
            this.options.contentTypeDecoder.decode(v, this.options).then((m) => {
              this.callback(m);
            }, (m) => {
              this.fireError(m);
            });
          }, (v) => {
            this.fireError(v);
          });
        }
      }
      clearPartialMessageTimer() {
        this.partialMessageTimer && (this.partialMessageTimer.dispose(), this.partialMessageTimer = void 0);
      }
      setPartialMessageTimer() {
        this.clearPartialMessageTimer(), !(this._partialMessageTimeout <= 0) && (this.partialMessageTimer = (0, t.default)().timer.setTimeout((c, d) => {
          this.partialMessageTimer = void 0, c === this.messageToken && (this.firePartialMessage({ messageToken: c, waitingTime: d }), this.setPartialMessageTimer());
        }, this._partialMessageTimeout, this.messageToken, this._partialMessageTimeout));
      }
    }
    e.ReadableStreamMessageReader = a;
  }(an)), an;
}
var cn = {}, dt = {}, Si;
function Jr() {
  if (Si)
    return dt;
  Si = 1, Object.defineProperty(dt, "__esModule", { value: !0 }), dt.Semaphore = void 0;
  const e = Pe;
  class t {
    constructor(r = 1) {
      if (r <= 0)
        throw new Error("Capacity must be greater than 0");
      this._capacity = r, this._active = 0, this._waiting = [];
    }
    lock(r) {
      return new Promise((i, o) => {
        this._waiting.push({ thunk: r, resolve: i, reject: o }), this.runNext();
      });
    }
    get active() {
      return this._active;
    }
    runNext() {
      this._waiting.length === 0 || this._active === this._capacity || (0, e.default)().timer.setImmediate(() => this.doRunNext());
    }
    doRunNext() {
      if (this._waiting.length === 0 || this._active === this._capacity)
        return;
      const r = this._waiting.shift();
      if (this._active++, this._active > this._capacity)
        throw new Error("To many thunks active");
      try {
        const i = r.thunk();
        i instanceof Promise ? i.then((o) => {
          this._active--, r.resolve(o), this.runNext();
        }, (o) => {
          this._active--, r.reject(o), this.runNext();
        }) : (this._active--, r.resolve(i), this.runNext());
      } catch (i) {
        this._active--, r.reject(i), this.runNext();
      }
    }
  }
  return dt.Semaphore = t, dt;
}
var qi;
function Qr() {
  return qi || (qi = 1, function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.WriteableStreamMessageWriter = e.AbstractMessageWriter = e.MessageWriter = void 0;
    const t = Pe, n = Rt(), r = Jr(), i = Xe, o = "Content-Length: ", a = `\r
`;
    (function(y) {
      function v(m) {
        let g = m;
        return g && n.func(g.dispose) && n.func(g.onClose) && n.func(g.onError) && n.func(g.write);
      }
      y.is = v;
    })(e.MessageWriter || (e.MessageWriter = {}));
    class u {
      constructor() {
        this.errorEmitter = new i.Emitter(), this.closeEmitter = new i.Emitter();
      }
      dispose() {
        this.errorEmitter.dispose(), this.closeEmitter.dispose();
      }
      get onError() {
        return this.errorEmitter.event;
      }
      fireError(v, m, g) {
        this.errorEmitter.fire([this.asError(v), m, g]);
      }
      get onClose() {
        return this.closeEmitter.event;
      }
      fireClose() {
        this.closeEmitter.fire(void 0);
      }
      asError(v) {
        return v instanceof Error ? v : new Error(`Writer received error. Reason: ${n.string(v.message) ? v.message : "unknown"}`);
      }
    }
    e.AbstractMessageWriter = u;
    var c;
    (function(y) {
      function v(m) {
        var g, P;
        return m === void 0 || typeof m == "string" ? { charset: m != null ? m : "utf-8", contentTypeEncoder: (0, t.default)().applicationJson.encoder } : { charset: (g = m.charset) != null ? g : "utf-8", contentEncoder: m.contentEncoder, contentTypeEncoder: (P = m.contentTypeEncoder) != null ? P : (0, t.default)().applicationJson.encoder };
      }
      y.fromOptions = v;
    })(c || (c = {}));
    class d extends u {
      constructor(v, m) {
        super(), this.writable = v, this.options = c.fromOptions(m), this.errorCount = 0, this.writeSemaphore = new r.Semaphore(1), this.writable.onError((g) => this.fireError(g)), this.writable.onClose(() => this.fireClose());
      }
      async write(v) {
        return this.writeSemaphore.lock(async () => this.options.contentTypeEncoder.encode(v, this.options).then((g) => this.options.contentEncoder !== void 0 ? this.options.contentEncoder.encode(g) : g).then((g) => {
          const P = [];
          return P.push(o, g.byteLength.toString(), a), P.push(a), this.doWrite(v, P, g);
        }, (g) => {
          throw this.fireError(g), g;
        }));
      }
      async doWrite(v, m, g) {
        try {
          return await this.writable.write(m.join(""), "ascii"), this.writable.write(g);
        } catch (P) {
          return this.handleError(P, v), Promise.reject(P);
        }
      }
      handleError(v, m) {
        this.errorCount++, this.fireError(v, m, this.errorCount);
      }
      end() {
        this.writable.end();
      }
    }
    e.WriteableStreamMessageWriter = d;
  }(cn)), cn;
}
var un = {}, Ni;
function Xr() {
  return Ni || (Ni = 1, function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.createMessageConnection = e.ConnectionOptions = e.CancellationStrategy = e.CancellationSenderStrategy = e.CancellationReceiverStrategy = e.ConnectionStrategy = e.ConnectionError = e.ConnectionErrors = e.LogTraceNotification = e.SetTraceNotification = e.TraceFormat = e.TraceValues = e.Trace = e.NullLogger = e.ProgressType = e.ProgressToken = void 0;
    const t = Pe, n = Rt(), r = Bi(), i = Ui(), o = Xe, a = Vi();
    var u;
    (function(T) {
      T.type = new r.NotificationType("$/cancelRequest");
    })(u || (u = {}));
    var c;
    (function(T) {
      function j(F) {
        return typeof F == "string" || typeof F == "number";
      }
      T.is = j;
    })(c = e.ProgressToken || (e.ProgressToken = {}));
    var d;
    (function(T) {
      T.type = new r.NotificationType("$/progress");
    })(d || (d = {}));
    class y {
      constructor() {
      }
    }
    e.ProgressType = y;
    var v;
    (function(T) {
      function j(F) {
        return n.func(F);
      }
      T.is = j;
    })(v || (v = {})), e.NullLogger = Object.freeze({
      error: () => {
      },
      warn: () => {
      },
      info: () => {
      },
      log: () => {
      }
    });
    var m;
    (function(T) {
      T[T.Off = 0] = "Off", T[T.Messages = 1] = "Messages", T[T.Compact = 2] = "Compact", T[T.Verbose = 3] = "Verbose";
    })(m = e.Trace || (e.Trace = {})), function(T) {
      T.Off = "off", T.Messages = "messages", T.Compact = "compact", T.Verbose = "verbose";
    }(e.TraceValues || (e.TraceValues = {})), function(T) {
      function j(E) {
        if (!n.string(E))
          return T.Off;
        switch (E = E.toLowerCase(), E) {
          case "off":
            return T.Off;
          case "messages":
            return T.Messages;
          case "compact":
            return T.Compact;
          case "verbose":
            return T.Verbose;
          default:
            return T.Off;
        }
      }
      T.fromString = j;
      function F(E) {
        switch (E) {
          case T.Off:
            return "off";
          case T.Messages:
            return "messages";
          case T.Compact:
            return "compact";
          case T.Verbose:
            return "verbose";
          default:
            return "off";
        }
      }
      T.toString = F;
    }(m = e.Trace || (e.Trace = {}));
    var g;
    (function(T) {
      T.Text = "text", T.JSON = "json";
    })(g = e.TraceFormat || (e.TraceFormat = {})), function(T) {
      function j(F) {
        return n.string(F) ? (F = F.toLowerCase(), F === "json" ? T.JSON : T.Text) : T.Text;
      }
      T.fromString = j;
    }(g = e.TraceFormat || (e.TraceFormat = {}));
    var P;
    (function(T) {
      T.type = new r.NotificationType("$/setTrace");
    })(P = e.SetTraceNotification || (e.SetTraceNotification = {}));
    var I;
    (function(T) {
      T.type = new r.NotificationType("$/logTrace");
    })(I = e.LogTraceNotification || (e.LogTraceNotification = {}));
    var B;
    (function(T) {
      T[T.Closed = 1] = "Closed", T[T.Disposed = 2] = "Disposed", T[T.AlreadyListening = 3] = "AlreadyListening";
    })(B = e.ConnectionErrors || (e.ConnectionErrors = {}));
    class M extends Error {
      constructor(j, F) {
        super(F), this.code = j, Object.setPrototypeOf(this, M.prototype);
      }
    }
    e.ConnectionError = M;
    var H;
    (function(T) {
      function j(F) {
        const E = F;
        return E && n.func(E.cancelUndispatched);
      }
      T.is = j;
    })(H = e.ConnectionStrategy || (e.ConnectionStrategy = {}));
    var $;
    (function(T) {
      T.Message = Object.freeze({
        createCancellationTokenSource(F) {
          return new a.CancellationTokenSource();
        }
      });
      function j(F) {
        const E = F;
        return E && n.func(E.createCancellationTokenSource);
      }
      T.is = j;
    })($ = e.CancellationReceiverStrategy || (e.CancellationReceiverStrategy = {}));
    var re;
    (function(T) {
      T.Message = Object.freeze({
        sendCancellation(F, E) {
          return F.sendNotification(u.type, { id: E });
        },
        cleanup(F) {
        }
      });
      function j(F) {
        const E = F;
        return E && n.func(E.sendCancellation) && n.func(E.cleanup);
      }
      T.is = j;
    })(re = e.CancellationSenderStrategy || (e.CancellationSenderStrategy = {}));
    var he;
    (function(T) {
      T.Message = Object.freeze({
        receiver: $.Message,
        sender: re.Message
      });
      function j(F) {
        const E = F;
        return E && $.is(E.receiver) && re.is(E.sender);
      }
      T.is = j;
    })(he = e.CancellationStrategy || (e.CancellationStrategy = {})), function(T) {
      function j(F) {
        const E = F;
        return E && (he.is(E.cancellationStrategy) || H.is(E.connectionStrategy));
      }
      T.is = j;
    }(e.ConnectionOptions || (e.ConnectionOptions = {}));
    var Z;
    (function(T) {
      T[T.New = 1] = "New", T[T.Listening = 2] = "Listening", T[T.Closed = 3] = "Closed", T[T.Disposed = 4] = "Disposed";
    })(Z || (Z = {}));
    function ae(T, j, F, E) {
      const s = F !== void 0 ? F : e.NullLogger;
      let w = 0, A = 0, N = 0;
      const W = "2.0";
      let G;
      const Fe = /* @__PURE__ */ new Map();
      let qe;
      const Ae = /* @__PURE__ */ new Map(), We = /* @__PURE__ */ new Map();
      let Ge, De = new i.LinkedMap(), Te = /* @__PURE__ */ new Map(), Ie = /* @__PURE__ */ new Set(), ve = /* @__PURE__ */ new Map(), U = m.Off, q = g.Text, f, D = Z.New;
      const O = new o.Emitter(), p = new o.Emitter(), ce = new o.Emitter(), me = new o.Emitter(), Ne = new o.Emitter(), He = E && E.cancellationStrategy ? E.cancellationStrategy : he.Message;
      function ct(l) {
        if (l === null)
          throw new Error("Can't send requests with id null since the response can't be correlated.");
        return "req-" + l.toString();
      }
      function wt(l) {
        return l === null ? "res-unknown-" + (++N).toString() : "res-" + l.toString();
      }
      function Pt() {
        return "not-" + (++A).toString();
      }
      function Ye(l, R) {
        r.Message.isRequest(R) ? l.set(ct(R.id), R) : r.Message.isResponse(R) ? l.set(wt(R.id), R) : l.set(Pt(), R);
      }
      function Kt(l) {
      }
      function $e() {
        return D === Z.Listening;
      }
      function ze() {
        return D === Z.Closed;
      }
      function _e() {
        return D === Z.Disposed;
      }
      function ke() {
        (D === Z.New || D === Z.Listening) && (D = Z.Closed, p.fire(void 0));
      }
      function b(l) {
        O.fire([l, void 0, void 0]);
      }
      function _(l) {
        O.fire(l);
      }
      T.onClose(ke), T.onError(b), j.onClose(ke), j.onError(_);
      function C() {
        Ge || De.size === 0 || (Ge = (0, t.default)().timer.setImmediate(() => {
          Ge = void 0, Re();
        }));
      }
      function Re() {
        if (De.size === 0)
          return;
        const l = De.shift();
        try {
          r.Message.isRequest(l) ? xt(l) : r.Message.isNotification(l) ? Cr(l) : r.Message.isResponse(l) ? kr(l) : Sr(l);
        } finally {
          C();
        }
      }
      const ye = (l) => {
        try {
          if (r.Message.isNotification(l) && l.method === u.type.method) {
            const R = l.params.id, k = ct(R), S = De.get(k);
            if (r.Message.isRequest(S)) {
              const X = E == null ? void 0 : E.connectionStrategy, V = X && X.cancelUndispatched ? X.cancelUndispatched(S, Kt) : void 0;
              if (V && (V.error !== void 0 || V.result !== void 0)) {
                De.delete(k), ve.delete(R), V.id = S.id, kt(V, l.method, Date.now()), j.write(V).catch(() => s.error("Sending response for canceled message failed."));
                return;
              }
            }
            const Q = ve.get(R);
            if (Q !== void 0) {
              Q.cancel(), en(l);
              return;
            } else
              Ie.add(R);
          }
          Ye(De, l);
        } finally {
          C();
        }
      };
      function xt(l) {
        var ue;
        if (_e())
          return;
        function R(z, K, J) {
          const ne = {
            jsonrpc: W,
            id: l.id
          };
          z instanceof r.ResponseError ? ne.error = z.toJson() : ne.result = z === void 0 ? null : z, kt(ne, K, J), j.write(ne).catch(() => s.error("Sending response failed."));
        }
        function k(z, K, J) {
          const ne = {
            jsonrpc: W,
            id: l.id,
            error: z.toJson()
          };
          kt(ne, K, J), j.write(ne).catch(() => s.error("Sending response failed."));
        }
        function S(z, K, J) {
          z === void 0 && (z = null);
          const ne = {
            jsonrpc: W,
            id: l.id,
            result: z
          };
          kt(ne, K, J), j.write(ne).catch(() => s.error("Sending response failed."));
        }
        Mr(l);
        const Q = Fe.get(l.method);
        let X, V;
        Q && (X = Q.type, V = Q.handler);
        const se = Date.now();
        if (V || G) {
          const z = (ue = l.id) != null ? ue : String(Date.now()), K = He.receiver.createCancellationTokenSource(z);
          l.id !== null && Ie.has(l.id) && K.cancel(), l.id !== null && ve.set(z, K);
          try {
            let J;
            if (V)
              if (l.params === void 0) {
                if (X !== void 0 && X.numberOfParams !== 0) {
                  k(new r.ResponseError(r.ErrorCodes.InvalidParams, `Request ${l.method} defines ${X.numberOfParams} params but received none.`), l.method, se);
                  return;
                }
                J = V(K.token);
              } else if (Array.isArray(l.params)) {
                if (X !== void 0 && X.parameterStructures === r.ParameterStructures.byName) {
                  k(new r.ResponseError(r.ErrorCodes.InvalidParams, `Request ${l.method} defines parameters by name but received parameters by position`), l.method, se);
                  return;
                }
                J = V(...l.params, K.token);
              } else {
                if (X !== void 0 && X.parameterStructures === r.ParameterStructures.byPosition) {
                  k(new r.ResponseError(r.ErrorCodes.InvalidParams, `Request ${l.method} defines parameters by position but received parameters by name`), l.method, se);
                  return;
                }
                J = V(l.params, K.token);
              }
            else
              G && (J = G(l.method, l.params, K.token));
            const ne = J;
            J ? ne.then ? ne.then((fe) => {
              ve.delete(z), R(fe, l.method, se);
            }, (fe) => {
              ve.delete(z), fe instanceof r.ResponseError ? k(fe, l.method, se) : fe && n.string(fe.message) ? k(new r.ResponseError(r.ErrorCodes.InternalError, `Request ${l.method} failed with message: ${fe.message}`), l.method, se) : k(new r.ResponseError(r.ErrorCodes.InternalError, `Request ${l.method} failed unexpectedly without providing any details.`), l.method, se);
            }) : (ve.delete(z), R(J, l.method, se)) : (ve.delete(z), S(J, l.method, se));
          } catch (J) {
            ve.delete(z), J instanceof r.ResponseError ? R(J, l.method, se) : J && n.string(J.message) ? k(new r.ResponseError(r.ErrorCodes.InternalError, `Request ${l.method} failed with message: ${J.message}`), l.method, se) : k(new r.ResponseError(r.ErrorCodes.InternalError, `Request ${l.method} failed unexpectedly without providing any details.`), l.method, se);
          }
        } else
          k(new r.ResponseError(r.ErrorCodes.MethodNotFound, `Unhandled method ${l.method}`), l.method, se);
      }
      function kr(l) {
        if (!_e())
          if (l.id === null)
            l.error ? s.error(`Received response message without id: Error is: 
${JSON.stringify(l.error, void 0, 4)}`) : s.error("Received response message without id. No further error information provided.");
          else {
            const R = l.id, k = Te.get(R);
            if (Or(l, k), k !== void 0) {
              Te.delete(R);
              try {
                if (l.error) {
                  const S = l.error;
                  k.reject(new r.ResponseError(S.code, S.message, S.data));
                } else if (l.result !== void 0)
                  k.resolve(l.result);
                else
                  throw new Error("Should never happen.");
              } catch (S) {
                S.message ? s.error(`Response handler '${k.method}' failed with message: ${S.message}`) : s.error(`Response handler '${k.method}' failed unexpectedly.`);
              }
            }
          }
      }
      function Cr(l) {
        if (_e())
          return;
        let R, k;
        if (l.method === u.type.method) {
          const S = l.params.id;
          Ie.delete(S), en(l);
          return;
        } else {
          const S = Ae.get(l.method);
          S && (k = S.handler, R = S.type);
        }
        if (k || qe)
          try {
            if (en(l), k)
              if (l.params === void 0)
                R !== void 0 && R.numberOfParams !== 0 && R.parameterStructures !== r.ParameterStructures.byName && s.error(`Notification ${l.method} defines ${R.numberOfParams} params but received none.`), k();
              else if (Array.isArray(l.params)) {
                const S = l.params;
                l.method === d.type.method && S.length === 2 && c.is(S[0]) ? k({ token: S[0], value: S[1] }) : (R !== void 0 && (R.parameterStructures === r.ParameterStructures.byName && s.error(`Notification ${l.method} defines parameters by name but received parameters by position`), R.numberOfParams !== l.params.length && s.error(`Notification ${l.method} defines ${R.numberOfParams} params but received ${S.length} arguments`)), k(...S));
              } else
                R !== void 0 && R.parameterStructures === r.ParameterStructures.byPosition && s.error(`Notification ${l.method} defines parameters by position but received parameters by name`), k(l.params);
            else
              qe && qe(l.method, l.params);
          } catch (S) {
            S.message ? s.error(`Notification handler '${l.method}' failed with message: ${S.message}`) : s.error(`Notification handler '${l.method}' failed unexpectedly.`);
          }
        else
          ce.fire(l);
      }
      function Sr(l) {
        if (!l) {
          s.error("Received empty message.");
          return;
        }
        s.error(`Received message which is neither a response nor a notification message:
${JSON.stringify(l, null, 4)}`);
        const R = l;
        if (n.string(R.id) || n.number(R.id)) {
          const k = R.id, S = Te.get(k);
          S && S.reject(new Error("The received response has neither a result nor an error property."));
        }
      }
      function Me(l) {
        if (l != null)
          switch (U) {
            case m.Verbose:
              return JSON.stringify(l, null, 4);
            case m.Compact:
              return JSON.stringify(l);
            default:
              return;
          }
      }
      function qr(l) {
        if (!(U === m.Off || !f))
          if (q === g.Text) {
            let R;
            (U === m.Verbose || U === m.Compact) && l.params && (R = `Params: ${Me(l.params)}

`), f.log(`Sending request '${l.method} - (${l.id})'.`, R);
          } else
            Ze("send-request", l);
      }
      function Nr(l) {
        if (!(U === m.Off || !f))
          if (q === g.Text) {
            let R;
            (U === m.Verbose || U === m.Compact) && (l.params ? R = `Params: ${Me(l.params)}

` : R = `No parameters provided.

`), f.log(`Sending notification '${l.method}'.`, R);
          } else
            Ze("send-notification", l);
      }
      function kt(l, R, k) {
        if (!(U === m.Off || !f))
          if (q === g.Text) {
            let S;
            (U === m.Verbose || U === m.Compact) && (l.error && l.error.data ? S = `Error data: ${Me(l.error.data)}

` : l.result ? S = `Result: ${Me(l.result)}

` : l.error === void 0 && (S = `No result returned.

`)), f.log(`Sending response '${R} - (${l.id})'. Processing request took ${Date.now() - k}ms`, S);
          } else
            Ze("send-response", l);
      }
      function Mr(l) {
        if (!(U === m.Off || !f))
          if (q === g.Text) {
            let R;
            (U === m.Verbose || U === m.Compact) && l.params && (R = `Params: ${Me(l.params)}

`), f.log(`Received request '${l.method} - (${l.id})'.`, R);
          } else
            Ze("receive-request", l);
      }
      function en(l) {
        if (!(U === m.Off || !f || l.method === I.type.method))
          if (q === g.Text) {
            let R;
            (U === m.Verbose || U === m.Compact) && (l.params ? R = `Params: ${Me(l.params)}

` : R = `No parameters provided.

`), f.log(`Received notification '${l.method}'.`, R);
          } else
            Ze("receive-notification", l);
      }
      function Or(l, R) {
        if (!(U === m.Off || !f))
          if (q === g.Text) {
            let k;
            if ((U === m.Verbose || U === m.Compact) && (l.error && l.error.data ? k = `Error data: ${Me(l.error.data)}

` : l.result ? k = `Result: ${Me(l.result)}

` : l.error === void 0 && (k = `No result returned.

`)), R) {
              const S = l.error ? ` Request failed: ${l.error.message} (${l.error.code}).` : "";
              f.log(`Received response '${R.method} - (${l.id})' in ${Date.now() - R.timerStart}ms.${S}`, k);
            } else
              f.log(`Received response ${l.id} without active response promise.`, k);
          } else
            Ze("receive-response", l);
      }
      function Ze(l, R) {
        if (!f || U === m.Off)
          return;
        const k = {
          isLSPMessage: !0,
          type: l,
          message: R,
          timestamp: Date.now()
        };
        f.log(k);
      }
      function ut() {
        if (ze())
          throw new M(B.Closed, "Connection is closed.");
        if (_e())
          throw new M(B.Disposed, "Connection is disposed.");
      }
      function Er() {
        if ($e())
          throw new M(B.AlreadyListening, "Connection is already listening");
      }
      function jr() {
        if (!$e())
          throw new Error("Call listen() first.");
      }
      function lt(l) {
        return l === void 0 ? null : l;
      }
      function _i(l) {
        if (l !== null)
          return l;
      }
      function Ri(l) {
        return l != null && !Array.isArray(l) && typeof l == "object";
      }
      function tn(l, R) {
        switch (l) {
          case r.ParameterStructures.auto:
            return Ri(R) ? _i(R) : [lt(R)];
          case r.ParameterStructures.byName:
            if (!Ri(R))
              throw new Error("Received parameters by name but param is not an object literal.");
            return _i(R);
          case r.ParameterStructures.byPosition:
            return [lt(R)];
          default:
            throw new Error(`Unknown parameter structure ${l.toString()}`);
        }
      }
      function Di(l, R) {
        let k;
        const S = l.numberOfParams;
        switch (S) {
          case 0:
            k = void 0;
            break;
          case 1:
            k = tn(l.parameterStructures, R[0]);
            break;
          default:
            k = [];
            for (let Q = 0; Q < R.length && Q < S; Q++)
              k.push(lt(R[Q]));
            if (R.length < S)
              for (let Q = R.length; Q < S; Q++)
                k.push(null);
            break;
        }
        return k;
      }
      const Ke = {
        sendNotification: (l, ...R) => {
          ut();
          let k, S;
          if (n.string(l)) {
            k = l;
            const X = R[0];
            let V = 0, se = r.ParameterStructures.auto;
            r.ParameterStructures.is(X) && (V = 1, se = X);
            let ue = R.length;
            const z = ue - V;
            switch (z) {
              case 0:
                S = void 0;
                break;
              case 1:
                S = tn(se, R[V]);
                break;
              default:
                if (se === r.ParameterStructures.byName)
                  throw new Error(`Received ${z} parameters for 'by Name' notification parameter structure.`);
                S = R.slice(V, ue).map((K) => lt(K));
                break;
            }
          } else {
            const X = R;
            k = l.method, S = Di(l, X);
          }
          const Q = {
            jsonrpc: W,
            method: k,
            params: S
          };
          return Nr(Q), j.write(Q).catch(() => s.error("Sending notification failed."));
        },
        onNotification: (l, R) => {
          ut();
          let k;
          return n.func(l) ? qe = l : R && (n.string(l) ? (k = l, Ae.set(l, { type: void 0, handler: R })) : (k = l.method, Ae.set(l.method, { type: l, handler: R }))), {
            dispose: () => {
              k !== void 0 ? Ae.delete(k) : qe = void 0;
            }
          };
        },
        onProgress: (l, R, k) => {
          if (We.has(R))
            throw new Error(`Progress handler for token ${R} already registered`);
          return We.set(R, k), {
            dispose: () => {
              We.delete(R);
            }
          };
        },
        sendProgress: (l, R, k) => Ke.sendNotification(d.type, { token: R, value: k }),
        onUnhandledProgress: me.event,
        sendRequest: (l, ...R) => {
          ut(), jr();
          let k, S, Q;
          if (n.string(l)) {
            k = l;
            const ue = R[0], z = R[R.length - 1];
            let K = 0, J = r.ParameterStructures.auto;
            r.ParameterStructures.is(ue) && (K = 1, J = ue);
            let ne = R.length;
            a.CancellationToken.is(z) && (ne = ne - 1, Q = z);
            const fe = ne - K;
            switch (fe) {
              case 0:
                S = void 0;
                break;
              case 1:
                S = tn(J, R[K]);
                break;
              default:
                if (J === r.ParameterStructures.byName)
                  throw new Error(`Received ${fe} parameters for 'by Name' request parameter structure.`);
                S = R.slice(K, ne).map((Oe) => lt(Oe));
                break;
            }
          } else {
            const ue = R;
            k = l.method, S = Di(l, ue);
            const z = l.numberOfParams;
            Q = a.CancellationToken.is(ue[z]) ? ue[z] : void 0;
          }
          const X = w++;
          let V;
          return Q && (V = Q.onCancellationRequested(() => {
            const ue = He.sender.sendCancellation(Ke, X);
            return ue === void 0 ? (s.log(`Received no promise from cancellation strategy when cancelling id ${X}`), Promise.resolve()) : ue.catch(() => {
              s.log(`Sending cancellation messages for id ${X} failed`);
            });
          })), new Promise((ue, z) => {
            const K = {
              jsonrpc: W,
              id: X,
              method: k,
              params: S
            }, J = (Oe) => {
              ue(Oe), He.sender.cleanup(X), V == null || V.dispose();
            }, ne = (Oe) => {
              z(Oe), He.sender.cleanup(X), V == null || V.dispose();
            };
            let fe = { method: k, timerStart: Date.now(), resolve: J, reject: ne };
            qr(K);
            try {
              j.write(K).catch(() => s.error("Sending request failed."));
            } catch (Oe) {
              fe.reject(new r.ResponseError(r.ErrorCodes.MessageWriteError, Oe.message ? Oe.message : "Unknown reason")), fe = null;
            }
            fe && Te.set(X, fe);
          });
        },
        onRequest: (l, R) => {
          ut();
          let k = null;
          return v.is(l) ? (k = void 0, G = l) : n.string(l) ? (k = null, R !== void 0 && (k = l, Fe.set(l, { handler: R, type: void 0 }))) : R !== void 0 && (k = l.method, Fe.set(l.method, { type: l, handler: R })), {
            dispose: () => {
              k !== null && (k !== void 0 ? Fe.delete(k) : G = void 0);
            }
          };
        },
        hasPendingResponse: () => Te.size > 0,
        trace: async (l, R, k) => {
          let S = !1, Q = g.Text;
          k !== void 0 && (n.boolean(k) ? S = k : (S = k.sendNotification || !1, Q = k.traceFormat || g.Text)), U = l, q = Q, U === m.Off ? f = void 0 : f = R, S && !ze() && !_e() && await Ke.sendNotification(P.type, { value: m.toString(l) });
        },
        onError: O.event,
        onClose: p.event,
        onUnhandledNotification: ce.event,
        onDispose: Ne.event,
        end: () => {
          j.end();
        },
        dispose: () => {
          if (_e())
            return;
          D = Z.Disposed, Ne.fire(void 0);
          const l = new r.ResponseError(r.ErrorCodes.PendingResponseRejected, "Pending response rejected since connection got disposed");
          for (const R of Te.values())
            R.reject(l);
          Te = /* @__PURE__ */ new Map(), ve = /* @__PURE__ */ new Map(), Ie = /* @__PURE__ */ new Set(), De = new i.LinkedMap(), n.func(j.dispose) && j.dispose(), n.func(T.dispose) && T.dispose();
        },
        listen: () => {
          ut(), Er(), D = Z.Listening, T.listen(ye);
        },
        inspect: () => {
          (0, t.default)().console.log("inspect");
        }
      };
      return Ke.onNotification(I.type, (l) => {
        if (U === m.Off || !f)
          return;
        const R = U === m.Verbose || U === m.Compact;
        f.log(l.message, R ? l.verbose : void 0);
      }), Ke.onNotification(d.type, (l) => {
        const R = We.get(l.token);
        R ? R(l.value) : me.fire(l);
      }), Ke;
    }
    e.createMessageConnection = ae;
  }(un)), un;
}
var Mi;
function Oi() {
  return Mi || (Mi = 1, function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.TraceFormat = e.TraceValues = e.Trace = e.ProgressType = e.ProgressToken = e.createMessageConnection = e.NullLogger = e.ConnectionOptions = e.ConnectionStrategy = e.WriteableStreamMessageWriter = e.AbstractMessageWriter = e.MessageWriter = e.ReadableStreamMessageReader = e.AbstractMessageReader = e.MessageReader = e.CancellationToken = e.CancellationTokenSource = e.Emitter = e.Event = e.Disposable = e.LRUCache = e.Touch = e.LinkedMap = e.ParameterStructures = e.NotificationType9 = e.NotificationType8 = e.NotificationType7 = e.NotificationType6 = e.NotificationType5 = e.NotificationType4 = e.NotificationType3 = e.NotificationType2 = e.NotificationType1 = e.NotificationType0 = e.NotificationType = e.ErrorCodes = e.ResponseError = e.RequestType9 = e.RequestType8 = e.RequestType7 = e.RequestType6 = e.RequestType5 = e.RequestType4 = e.RequestType3 = e.RequestType2 = e.RequestType1 = e.RequestType0 = e.RequestType = e.Message = e.RAL = void 0, e.CancellationStrategy = e.CancellationSenderStrategy = e.CancellationReceiverStrategy = e.ConnectionError = e.ConnectionErrors = e.LogTraceNotification = e.SetTraceNotification = void 0;
    const t = Bi();
    Object.defineProperty(e, "Message", { enumerable: !0, get: function() {
      return t.Message;
    } }), Object.defineProperty(e, "RequestType", { enumerable: !0, get: function() {
      return t.RequestType;
    } }), Object.defineProperty(e, "RequestType0", { enumerable: !0, get: function() {
      return t.RequestType0;
    } }), Object.defineProperty(e, "RequestType1", { enumerable: !0, get: function() {
      return t.RequestType1;
    } }), Object.defineProperty(e, "RequestType2", { enumerable: !0, get: function() {
      return t.RequestType2;
    } }), Object.defineProperty(e, "RequestType3", { enumerable: !0, get: function() {
      return t.RequestType3;
    } }), Object.defineProperty(e, "RequestType4", { enumerable: !0, get: function() {
      return t.RequestType4;
    } }), Object.defineProperty(e, "RequestType5", { enumerable: !0, get: function() {
      return t.RequestType5;
    } }), Object.defineProperty(e, "RequestType6", { enumerable: !0, get: function() {
      return t.RequestType6;
    } }), Object.defineProperty(e, "RequestType7", { enumerable: !0, get: function() {
      return t.RequestType7;
    } }), Object.defineProperty(e, "RequestType8", { enumerable: !0, get: function() {
      return t.RequestType8;
    } }), Object.defineProperty(e, "RequestType9", { enumerable: !0, get: function() {
      return t.RequestType9;
    } }), Object.defineProperty(e, "ResponseError", { enumerable: !0, get: function() {
      return t.ResponseError;
    } }), Object.defineProperty(e, "ErrorCodes", { enumerable: !0, get: function() {
      return t.ErrorCodes;
    } }), Object.defineProperty(e, "NotificationType", { enumerable: !0, get: function() {
      return t.NotificationType;
    } }), Object.defineProperty(e, "NotificationType0", { enumerable: !0, get: function() {
      return t.NotificationType0;
    } }), Object.defineProperty(e, "NotificationType1", { enumerable: !0, get: function() {
      return t.NotificationType1;
    } }), Object.defineProperty(e, "NotificationType2", { enumerable: !0, get: function() {
      return t.NotificationType2;
    } }), Object.defineProperty(e, "NotificationType3", { enumerable: !0, get: function() {
      return t.NotificationType3;
    } }), Object.defineProperty(e, "NotificationType4", { enumerable: !0, get: function() {
      return t.NotificationType4;
    } }), Object.defineProperty(e, "NotificationType5", { enumerable: !0, get: function() {
      return t.NotificationType5;
    } }), Object.defineProperty(e, "NotificationType6", { enumerable: !0, get: function() {
      return t.NotificationType6;
    } }), Object.defineProperty(e, "NotificationType7", { enumerable: !0, get: function() {
      return t.NotificationType7;
    } }), Object.defineProperty(e, "NotificationType8", { enumerable: !0, get: function() {
      return t.NotificationType8;
    } }), Object.defineProperty(e, "NotificationType9", { enumerable: !0, get: function() {
      return t.NotificationType9;
    } }), Object.defineProperty(e, "ParameterStructures", { enumerable: !0, get: function() {
      return t.ParameterStructures;
    } });
    const n = Ui();
    Object.defineProperty(e, "LinkedMap", { enumerable: !0, get: function() {
      return n.LinkedMap;
    } }), Object.defineProperty(e, "LRUCache", { enumerable: !0, get: function() {
      return n.LRUCache;
    } }), Object.defineProperty(e, "Touch", { enumerable: !0, get: function() {
      return n.Touch;
    } });
    const r = yi;
    Object.defineProperty(e, "Disposable", { enumerable: !0, get: function() {
      return r.Disposable;
    } });
    const i = Xe;
    Object.defineProperty(e, "Event", { enumerable: !0, get: function() {
      return i.Event;
    } }), Object.defineProperty(e, "Emitter", { enumerable: !0, get: function() {
      return i.Emitter;
    } });
    const o = Vi();
    Object.defineProperty(e, "CancellationTokenSource", { enumerable: !0, get: function() {
      return o.CancellationTokenSource;
    } }), Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
      return o.CancellationToken;
    } });
    const a = Vr();
    Object.defineProperty(e, "MessageReader", { enumerable: !0, get: function() {
      return a.MessageReader;
    } }), Object.defineProperty(e, "AbstractMessageReader", { enumerable: !0, get: function() {
      return a.AbstractMessageReader;
    } }), Object.defineProperty(e, "ReadableStreamMessageReader", { enumerable: !0, get: function() {
      return a.ReadableStreamMessageReader;
    } });
    const u = Qr();
    Object.defineProperty(e, "MessageWriter", { enumerable: !0, get: function() {
      return u.MessageWriter;
    } }), Object.defineProperty(e, "AbstractMessageWriter", { enumerable: !0, get: function() {
      return u.AbstractMessageWriter;
    } }), Object.defineProperty(e, "WriteableStreamMessageWriter", { enumerable: !0, get: function() {
      return u.WriteableStreamMessageWriter;
    } });
    const c = Xr();
    Object.defineProperty(e, "ConnectionStrategy", { enumerable: !0, get: function() {
      return c.ConnectionStrategy;
    } }), Object.defineProperty(e, "ConnectionOptions", { enumerable: !0, get: function() {
      return c.ConnectionOptions;
    } }), Object.defineProperty(e, "NullLogger", { enumerable: !0, get: function() {
      return c.NullLogger;
    } }), Object.defineProperty(e, "createMessageConnection", { enumerable: !0, get: function() {
      return c.createMessageConnection;
    } }), Object.defineProperty(e, "ProgressToken", { enumerable: !0, get: function() {
      return c.ProgressToken;
    } }), Object.defineProperty(e, "ProgressType", { enumerable: !0, get: function() {
      return c.ProgressType;
    } }), Object.defineProperty(e, "Trace", { enumerable: !0, get: function() {
      return c.Trace;
    } }), Object.defineProperty(e, "TraceValues", { enumerable: !0, get: function() {
      return c.TraceValues;
    } }), Object.defineProperty(e, "TraceFormat", { enumerable: !0, get: function() {
      return c.TraceFormat;
    } }), Object.defineProperty(e, "SetTraceNotification", { enumerable: !0, get: function() {
      return c.SetTraceNotification;
    } }), Object.defineProperty(e, "LogTraceNotification", { enumerable: !0, get: function() {
      return c.LogTraceNotification;
    } }), Object.defineProperty(e, "ConnectionErrors", { enumerable: !0, get: function() {
      return c.ConnectionErrors;
    } }), Object.defineProperty(e, "ConnectionError", { enumerable: !0, get: function() {
      return c.ConnectionError;
    } }), Object.defineProperty(e, "CancellationReceiverStrategy", { enumerable: !0, get: function() {
      return c.CancellationReceiverStrategy;
    } }), Object.defineProperty(e, "CancellationSenderStrategy", { enumerable: !0, get: function() {
      return c.CancellationSenderStrategy;
    } }), Object.defineProperty(e, "CancellationStrategy", { enumerable: !0, get: function() {
      return c.CancellationStrategy;
    } });
    const d = Pe;
    e.RAL = d.default;
  }(nn)), nn;
}
(function(e) {
  var t = ie && ie.__createBinding || (Object.create ? function(c, d, y, v) {
    v === void 0 && (v = y);
    var m = Object.getOwnPropertyDescriptor(d, y);
    (!m || ("get" in m ? !d.__esModule : m.writable || m.configurable)) && (m = { enumerable: !0, get: function() {
      return d[y];
    } }), Object.defineProperty(c, v, m);
  } : function(c, d, y, v) {
    v === void 0 && (v = y), c[v] = d[y];
  }), n = ie && ie.__exportStar || function(c, d) {
    for (var y in c)
      y !== "default" && !Object.prototype.hasOwnProperty.call(d, y) && t(d, c, y);
  };
  Object.defineProperty(e, "__esModule", { value: !0 }), e.createMessageConnection = e.BrowserMessageWriter = e.BrowserMessageReader = void 0, mi.default.install();
  const i = Oi();
  n(Oi(), e);
  class o extends i.AbstractMessageReader {
    constructor(d) {
      super(), this._onData = new i.Emitter(), this._messageListener = (y) => {
        this._onData.fire(y.data);
      }, d.addEventListener("error", (y) => this.fireError(y)), d.onmessage = this._messageListener;
    }
    listen(d) {
      return this._onData.event(d);
    }
  }
  e.BrowserMessageReader = o;
  class a extends i.AbstractMessageWriter {
    constructor(d) {
      super(), this.context = d, this.errorCount = 0, d.addEventListener("error", (y) => this.fireError(y));
    }
    write(d) {
      try {
        return this.context.postMessage(d), Promise.resolve();
      } catch (y) {
        return this.handleError(y, d), Promise.reject(y);
      }
    }
    handleError(d, y) {
      this.errorCount++, this.fireError(d, y, this.errorCount);
    }
    end() {
    }
  }
  e.BrowserMessageWriter = a;
  function u(c, d, y, v) {
    return y === void 0 && (y = i.NullLogger), i.ConnectionStrategy.is(v) && (v = { connectionStrategy: v }), (0, i.createMessageConnection)(c, d, y, v);
  }
  e.createMessageConnection = u;
})(Qe);
(function(e) {
  e.exports = Qe;
})(gn);
var Ji = {}, bn;
(function(e) {
  function t(n) {
    return typeof n == "string";
  }
  e.is = t;
})(bn || (bn = {}));
var Nt;
(function(e) {
  function t(n) {
    return typeof n == "string";
  }
  e.is = t;
})(Nt || (Nt = {}));
var vn;
(function(e) {
  e.MIN_VALUE = -2147483648, e.MAX_VALUE = 2147483647;
  function t(n) {
    return typeof n == "number" && e.MIN_VALUE <= n && n <= e.MAX_VALUE;
  }
  e.is = t;
})(vn || (vn = {}));
var ht;
(function(e) {
  e.MIN_VALUE = 0, e.MAX_VALUE = 2147483647;
  function t(n) {
    return typeof n == "number" && e.MIN_VALUE <= n && n <= e.MAX_VALUE;
  }
  e.is = t;
})(ht || (ht = {}));
var pe;
(function(e) {
  function t(r, i) {
    return r === Number.MAX_VALUE && (r = ht.MAX_VALUE), i === Number.MAX_VALUE && (i = ht.MAX_VALUE), { line: r, character: i };
  }
  e.create = t;
  function n(r) {
    var i = r;
    return h.objectLiteral(i) && h.uinteger(i.line) && h.uinteger(i.character);
  }
  e.is = n;
})(pe || (pe = {}));
var ee;
(function(e) {
  function t(r, i, o, a) {
    if (h.uinteger(r) && h.uinteger(i) && h.uinteger(o) && h.uinteger(a))
      return { start: pe.create(r, i), end: pe.create(o, a) };
    if (pe.is(r) && pe.is(i))
      return { start: r, end: i };
    throw new Error("Range#create called with invalid arguments[".concat(r, ", ").concat(i, ", ").concat(o, ", ").concat(a, "]"));
  }
  e.create = t;
  function n(r) {
    var i = r;
    return h.objectLiteral(i) && pe.is(i.start) && pe.is(i.end);
  }
  e.is = n;
})(ee || (ee = {}));
var gt;
(function(e) {
  function t(r, i) {
    return { uri: r, range: i };
  }
  e.create = t;
  function n(r) {
    var i = r;
    return h.objectLiteral(i) && ee.is(i.range) && (h.string(i.uri) || h.undefined(i.uri));
  }
  e.is = n;
})(gt || (gt = {}));
var _n;
(function(e) {
  function t(r, i, o, a) {
    return { targetUri: r, targetRange: i, targetSelectionRange: o, originSelectionRange: a };
  }
  e.create = t;
  function n(r) {
    var i = r;
    return h.objectLiteral(i) && ee.is(i.targetRange) && h.string(i.targetUri) && ee.is(i.targetSelectionRange) && (ee.is(i.originSelectionRange) || h.undefined(i.originSelectionRange));
  }
  e.is = n;
})(_n || (_n = {}));
var Mt;
(function(e) {
  function t(r, i, o, a) {
    return {
      red: r,
      green: i,
      blue: o,
      alpha: a
    };
  }
  e.create = t;
  function n(r) {
    var i = r;
    return h.objectLiteral(i) && h.numberRange(i.red, 0, 1) && h.numberRange(i.green, 0, 1) && h.numberRange(i.blue, 0, 1) && h.numberRange(i.alpha, 0, 1);
  }
  e.is = n;
})(Mt || (Mt = {}));
var Rn;
(function(e) {
  function t(r, i) {
    return {
      range: r,
      color: i
    };
  }
  e.create = t;
  function n(r) {
    var i = r;
    return h.objectLiteral(i) && ee.is(i.range) && Mt.is(i.color);
  }
  e.is = n;
})(Rn || (Rn = {}));
var Dn;
(function(e) {
  function t(r, i, o) {
    return {
      label: r,
      textEdit: i,
      additionalTextEdits: o
    };
  }
  e.create = t;
  function n(r) {
    var i = r;
    return h.objectLiteral(i) && h.string(i.label) && (h.undefined(i.textEdit) || we.is(i)) && (h.undefined(i.additionalTextEdits) || h.typedArray(i.additionalTextEdits, we.is));
  }
  e.is = n;
})(Dn || (Dn = {}));
var Tn;
(function(e) {
  e.Comment = "comment", e.Imports = "imports", e.Region = "region";
})(Tn || (Tn = {}));
var wn;
(function(e) {
  function t(r, i, o, a, u, c) {
    var d = {
      startLine: r,
      endLine: i
    };
    return h.defined(o) && (d.startCharacter = o), h.defined(a) && (d.endCharacter = a), h.defined(u) && (d.kind = u), h.defined(c) && (d.collapsedText = c), d;
  }
  e.create = t;
  function n(r) {
    var i = r;
    return h.objectLiteral(i) && h.uinteger(i.startLine) && h.uinteger(i.startLine) && (h.undefined(i.startCharacter) || h.uinteger(i.startCharacter)) && (h.undefined(i.endCharacter) || h.uinteger(i.endCharacter)) && (h.undefined(i.kind) || h.string(i.kind));
  }
  e.is = n;
})(wn || (wn = {}));
var Ot;
(function(e) {
  function t(r, i) {
    return {
      location: r,
      message: i
    };
  }
  e.create = t;
  function n(r) {
    var i = r;
    return h.defined(i) && gt.is(i.location) && h.string(i.message);
  }
  e.is = n;
})(Ot || (Ot = {}));
var Pn;
(function(e) {
  e.Error = 1, e.Warning = 2, e.Information = 3, e.Hint = 4;
})(Pn || (Pn = {}));
var kn;
(function(e) {
  e.Unnecessary = 1, e.Deprecated = 2;
})(kn || (kn = {}));
var Cn;
(function(e) {
  function t(n) {
    var r = n;
    return h.objectLiteral(r) && h.string(r.href);
  }
  e.is = t;
})(Cn || (Cn = {}));
var mt;
(function(e) {
  function t(r, i, o, a, u, c) {
    var d = { range: r, message: i };
    return h.defined(o) && (d.severity = o), h.defined(a) && (d.code = a), h.defined(u) && (d.source = u), h.defined(c) && (d.relatedInformation = c), d;
  }
  e.create = t;
  function n(r) {
    var i, o = r;
    return h.defined(o) && ee.is(o.range) && h.string(o.message) && (h.number(o.severity) || h.undefined(o.severity)) && (h.integer(o.code) || h.string(o.code) || h.undefined(o.code)) && (h.undefined(o.codeDescription) || h.string((i = o.codeDescription) === null || i === void 0 ? void 0 : i.href)) && (h.string(o.source) || h.undefined(o.source)) && (h.undefined(o.relatedInformation) || h.typedArray(o.relatedInformation, Ot.is));
  }
  e.is = n;
})(mt || (mt = {}));
var Ve;
(function(e) {
  function t(r, i) {
    for (var o = [], a = 2; a < arguments.length; a++)
      o[a - 2] = arguments[a];
    var u = { title: r, command: i };
    return h.defined(o) && o.length > 0 && (u.arguments = o), u;
  }
  e.create = t;
  function n(r) {
    var i = r;
    return h.defined(i) && h.string(i.title) && h.string(i.command);
  }
  e.is = n;
})(Ve || (Ve = {}));
var we;
(function(e) {
  function t(o, a) {
    return { range: o, newText: a };
  }
  e.replace = t;
  function n(o, a) {
    return { range: { start: o, end: o }, newText: a };
  }
  e.insert = n;
  function r(o) {
    return { range: o, newText: "" };
  }
  e.del = r;
  function i(o) {
    var a = o;
    return h.objectLiteral(a) && h.string(a.newText) && ee.is(a.range);
  }
  e.is = i;
})(we || (we = {}));
var Ue;
(function(e) {
  function t(r, i, o) {
    var a = { label: r };
    return i !== void 0 && (a.needsConfirmation = i), o !== void 0 && (a.description = o), a;
  }
  e.create = t;
  function n(r) {
    var i = r;
    return h.objectLiteral(i) && h.string(i.label) && (h.boolean(i.needsConfirmation) || i.needsConfirmation === void 0) && (h.string(i.description) || i.description === void 0);
  }
  e.is = n;
})(Ue || (Ue = {}));
var de;
(function(e) {
  function t(n) {
    var r = n;
    return h.string(r);
  }
  e.is = t;
})(de || (de = {}));
var Ce;
(function(e) {
  function t(o, a, u) {
    return { range: o, newText: a, annotationId: u };
  }
  e.replace = t;
  function n(o, a, u) {
    return { range: { start: o, end: o }, newText: a, annotationId: u };
  }
  e.insert = n;
  function r(o, a) {
    return { range: o, newText: "", annotationId: a };
  }
  e.del = r;
  function i(o) {
    var a = o;
    return we.is(a) && (Ue.is(a.annotationId) || de.is(a.annotationId));
  }
  e.is = i;
})(Ce || (Ce = {}));
var yt;
(function(e) {
  function t(r, i) {
    return { textDocument: r, edits: i };
  }
  e.create = t;
  function n(r) {
    var i = r;
    return h.defined(i) && pt.is(i.textDocument) && Array.isArray(i.edits);
  }
  e.is = n;
})(yt || (yt = {}));
var it;
(function(e) {
  function t(r, i, o) {
    var a = {
      kind: "create",
      uri: r
    };
    return i !== void 0 && (i.overwrite !== void 0 || i.ignoreIfExists !== void 0) && (a.options = i), o !== void 0 && (a.annotationId = o), a;
  }
  e.create = t;
  function n(r) {
    var i = r;
    return i && i.kind === "create" && h.string(i.uri) && (i.options === void 0 || (i.options.overwrite === void 0 || h.boolean(i.options.overwrite)) && (i.options.ignoreIfExists === void 0 || h.boolean(i.options.ignoreIfExists))) && (i.annotationId === void 0 || de.is(i.annotationId));
  }
  e.is = n;
})(it || (it = {}));
var rt;
(function(e) {
  function t(r, i, o, a) {
    var u = {
      kind: "rename",
      oldUri: r,
      newUri: i
    };
    return o !== void 0 && (o.overwrite !== void 0 || o.ignoreIfExists !== void 0) && (u.options = o), a !== void 0 && (u.annotationId = a), u;
  }
  e.create = t;
  function n(r) {
    var i = r;
    return i && i.kind === "rename" && h.string(i.oldUri) && h.string(i.newUri) && (i.options === void 0 || (i.options.overwrite === void 0 || h.boolean(i.options.overwrite)) && (i.options.ignoreIfExists === void 0 || h.boolean(i.options.ignoreIfExists))) && (i.annotationId === void 0 || de.is(i.annotationId));
  }
  e.is = n;
})(rt || (rt = {}));
var ot;
(function(e) {
  function t(r, i, o) {
    var a = {
      kind: "delete",
      uri: r
    };
    return i !== void 0 && (i.recursive !== void 0 || i.ignoreIfNotExists !== void 0) && (a.options = i), o !== void 0 && (a.annotationId = o), a;
  }
  e.create = t;
  function n(r) {
    var i = r;
    return i && i.kind === "delete" && h.string(i.uri) && (i.options === void 0 || (i.options.recursive === void 0 || h.boolean(i.options.recursive)) && (i.options.ignoreIfNotExists === void 0 || h.boolean(i.options.ignoreIfNotExists))) && (i.annotationId === void 0 || de.is(i.annotationId));
  }
  e.is = n;
})(ot || (ot = {}));
var Et;
(function(e) {
  function t(n) {
    var r = n;
    return r && (r.changes !== void 0 || r.documentChanges !== void 0) && (r.documentChanges === void 0 || r.documentChanges.every(function(i) {
      return h.string(i.kind) ? it.is(i) || rt.is(i) || ot.is(i) : yt.is(i);
    }));
  }
  e.is = t;
})(Et || (Et = {}));
var Ct = function() {
  function e(t, n) {
    this.edits = t, this.changeAnnotations = n;
  }
  return e.prototype.insert = function(t, n, r) {
    var i, o;
    if (r === void 0 ? i = we.insert(t, n) : de.is(r) ? (o = r, i = Ce.insert(t, n, r)) : (this.assertChangeAnnotations(this.changeAnnotations), o = this.changeAnnotations.manage(r), i = Ce.insert(t, n, o)), this.edits.push(i), o !== void 0)
      return o;
  }, e.prototype.replace = function(t, n, r) {
    var i, o;
    if (r === void 0 ? i = we.replace(t, n) : de.is(r) ? (o = r, i = Ce.replace(t, n, r)) : (this.assertChangeAnnotations(this.changeAnnotations), o = this.changeAnnotations.manage(r), i = Ce.replace(t, n, o)), this.edits.push(i), o !== void 0)
      return o;
  }, e.prototype.delete = function(t, n) {
    var r, i;
    if (n === void 0 ? r = we.del(t) : de.is(n) ? (i = n, r = Ce.del(t, n)) : (this.assertChangeAnnotations(this.changeAnnotations), i = this.changeAnnotations.manage(n), r = Ce.del(t, i)), this.edits.push(r), i !== void 0)
      return i;
  }, e.prototype.add = function(t) {
    this.edits.push(t);
  }, e.prototype.all = function() {
    return this.edits;
  }, e.prototype.clear = function() {
    this.edits.splice(0, this.edits.length);
  }, e.prototype.assertChangeAnnotations = function(t) {
    if (t === void 0)
      throw new Error("Text edit change is not configured to manage change annotations.");
  }, e;
}(), Ei = function() {
  function e(t) {
    this._annotations = t === void 0 ? /* @__PURE__ */ Object.create(null) : t, this._counter = 0, this._size = 0;
  }
  return e.prototype.all = function() {
    return this._annotations;
  }, Object.defineProperty(e.prototype, "size", {
    get: function() {
      return this._size;
    },
    enumerable: !1,
    configurable: !0
  }), e.prototype.manage = function(t, n) {
    var r;
    if (de.is(t) ? r = t : (r = this.nextId(), n = t), this._annotations[r] !== void 0)
      throw new Error("Id ".concat(r, " is already in use."));
    if (n === void 0)
      throw new Error("No annotation provided for id ".concat(r));
    return this._annotations[r] = n, this._size++, r;
  }, e.prototype.nextId = function() {
    return this._counter++, this._counter.toString();
  }, e;
}(), Gr = function() {
  function e(t) {
    var n = this;
    this._textEditChanges = /* @__PURE__ */ Object.create(null), t !== void 0 ? (this._workspaceEdit = t, t.documentChanges ? (this._changeAnnotations = new Ei(t.changeAnnotations), t.changeAnnotations = this._changeAnnotations.all(), t.documentChanges.forEach(function(r) {
      if (yt.is(r)) {
        var i = new Ct(r.edits, n._changeAnnotations);
        n._textEditChanges[r.textDocument.uri] = i;
      }
    })) : t.changes && Object.keys(t.changes).forEach(function(r) {
      var i = new Ct(t.changes[r]);
      n._textEditChanges[r] = i;
    })) : this._workspaceEdit = {};
  }
  return Object.defineProperty(e.prototype, "edit", {
    get: function() {
      return this.initDocumentChanges(), this._changeAnnotations !== void 0 && (this._changeAnnotations.size === 0 ? this._workspaceEdit.changeAnnotations = void 0 : this._workspaceEdit.changeAnnotations = this._changeAnnotations.all()), this._workspaceEdit;
    },
    enumerable: !1,
    configurable: !0
  }), e.prototype.getTextEditChange = function(t) {
    if (pt.is(t)) {
      if (this.initDocumentChanges(), this._workspaceEdit.documentChanges === void 0)
        throw new Error("Workspace edit is not configured for document changes.");
      var n = { uri: t.uri, version: t.version }, r = this._textEditChanges[n.uri];
      if (!r) {
        var i = [], o = {
          textDocument: n,
          edits: i
        };
        this._workspaceEdit.documentChanges.push(o), r = new Ct(i, this._changeAnnotations), this._textEditChanges[n.uri] = r;
      }
      return r;
    } else {
      if (this.initChanges(), this._workspaceEdit.changes === void 0)
        throw new Error("Workspace edit is not configured for normal text edit changes.");
      var r = this._textEditChanges[t];
      if (!r) {
        var i = [];
        this._workspaceEdit.changes[t] = i, r = new Ct(i), this._textEditChanges[t] = r;
      }
      return r;
    }
  }, e.prototype.initDocumentChanges = function() {
    this._workspaceEdit.documentChanges === void 0 && this._workspaceEdit.changes === void 0 && (this._changeAnnotations = new Ei(), this._workspaceEdit.documentChanges = [], this._workspaceEdit.changeAnnotations = this._changeAnnotations.all());
  }, e.prototype.initChanges = function() {
    this._workspaceEdit.documentChanges === void 0 && this._workspaceEdit.changes === void 0 && (this._workspaceEdit.changes = /* @__PURE__ */ Object.create(null));
  }, e.prototype.createFile = function(t, n, r) {
    if (this.initDocumentChanges(), this._workspaceEdit.documentChanges === void 0)
      throw new Error("Workspace edit is not configured for document changes.");
    var i;
    Ue.is(n) || de.is(n) ? i = n : r = n;
    var o, a;
    if (i === void 0 ? o = it.create(t, r) : (a = de.is(i) ? i : this._changeAnnotations.manage(i), o = it.create(t, r, a)), this._workspaceEdit.documentChanges.push(o), a !== void 0)
      return a;
  }, e.prototype.renameFile = function(t, n, r, i) {
    if (this.initDocumentChanges(), this._workspaceEdit.documentChanges === void 0)
      throw new Error("Workspace edit is not configured for document changes.");
    var o;
    Ue.is(r) || de.is(r) ? o = r : i = r;
    var a, u;
    if (o === void 0 ? a = rt.create(t, n, i) : (u = de.is(o) ? o : this._changeAnnotations.manage(o), a = rt.create(t, n, i, u)), this._workspaceEdit.documentChanges.push(a), u !== void 0)
      return u;
  }, e.prototype.deleteFile = function(t, n, r) {
    if (this.initDocumentChanges(), this._workspaceEdit.documentChanges === void 0)
      throw new Error("Workspace edit is not configured for document changes.");
    var i;
    Ue.is(n) || de.is(n) ? i = n : r = n;
    var o, a;
    if (i === void 0 ? o = ot.create(t, r) : (a = de.is(i) ? i : this._changeAnnotations.manage(i), o = ot.create(t, r, a)), this._workspaceEdit.documentChanges.push(o), a !== void 0)
      return a;
  }, e;
}(), Sn;
(function(e) {
  function t(r) {
    return { uri: r };
  }
  e.create = t;
  function n(r) {
    var i = r;
    return h.defined(i) && h.string(i.uri);
  }
  e.is = n;
})(Sn || (Sn = {}));
var qn;
(function(e) {
  function t(r, i) {
    return { uri: r, version: i };
  }
  e.create = t;
  function n(r) {
    var i = r;
    return h.defined(i) && h.string(i.uri) && h.integer(i.version);
  }
  e.is = n;
})(qn || (qn = {}));
var pt;
(function(e) {
  function t(r, i) {
    return { uri: r, version: i };
  }
  e.create = t;
  function n(r) {
    var i = r;
    return h.defined(i) && h.string(i.uri) && (i.version === null || h.integer(i.version));
  }
  e.is = n;
})(pt || (pt = {}));
var Nn;
(function(e) {
  function t(r, i, o, a) {
    return { uri: r, languageId: i, version: o, text: a };
  }
  e.create = t;
  function n(r) {
    var i = r;
    return h.defined(i) && h.string(i.uri) && h.string(i.languageId) && h.integer(i.version) && h.string(i.text);
  }
  e.is = n;
})(Nn || (Nn = {}));
var jt;
(function(e) {
  e.PlainText = "plaintext", e.Markdown = "markdown";
  function t(n) {
    var r = n;
    return r === e.PlainText || r === e.Markdown;
  }
  e.is = t;
})(jt || (jt = {}));
var st;
(function(e) {
  function t(n) {
    var r = n;
    return h.objectLiteral(n) && jt.is(r.kind) && h.string(r.value);
  }
  e.is = t;
})(st || (st = {}));
var Mn;
(function(e) {
  e.Text = 1, e.Method = 2, e.Function = 3, e.Constructor = 4, e.Field = 5, e.Variable = 6, e.Class = 7, e.Interface = 8, e.Module = 9, e.Property = 10, e.Unit = 11, e.Value = 12, e.Enum = 13, e.Keyword = 14, e.Snippet = 15, e.Color = 16, e.File = 17, e.Reference = 18, e.Folder = 19, e.EnumMember = 20, e.Constant = 21, e.Struct = 22, e.Event = 23, e.Operator = 24, e.TypeParameter = 25;
})(Mn || (Mn = {}));
var On;
(function(e) {
  e.PlainText = 1, e.Snippet = 2;
})(On || (On = {}));
var En;
(function(e) {
  e.Deprecated = 1;
})(En || (En = {}));
var jn;
(function(e) {
  function t(r, i, o) {
    return { newText: r, insert: i, replace: o };
  }
  e.create = t;
  function n(r) {
    var i = r;
    return i && h.string(i.newText) && ee.is(i.insert) && ee.is(i.replace);
  }
  e.is = n;
})(jn || (jn = {}));
var Ln;
(function(e) {
  e.asIs = 1, e.adjustIndentation = 2;
})(Ln || (Ln = {}));
var Fn;
(function(e) {
  function t(n) {
    var r = n;
    return r && (h.string(r.detail) || r.detail === void 0) && (h.string(r.description) || r.description === void 0);
  }
  e.is = t;
})(Fn || (Fn = {}));
var An;
(function(e) {
  function t(n) {
    return { label: n };
  }
  e.create = t;
})(An || (An = {}));
var Wn;
(function(e) {
  function t(n, r) {
    return { items: n || [], isIncomplete: !!r };
  }
  e.create = t;
})(Wn || (Wn = {}));
var bt;
(function(e) {
  function t(r) {
    return r.replace(/[\\`*_{}[\]()#+\-.!]/g, "\\$&");
  }
  e.fromPlainText = t;
  function n(r) {
    var i = r;
    return h.string(i) || h.objectLiteral(i) && h.string(i.language) && h.string(i.value);
  }
  e.is = n;
})(bt || (bt = {}));
var In;
(function(e) {
  function t(n) {
    var r = n;
    return !!r && h.objectLiteral(r) && (st.is(r.contents) || bt.is(r.contents) || h.typedArray(r.contents, bt.is)) && (n.range === void 0 || ee.is(n.range));
  }
  e.is = t;
})(In || (In = {}));
var Hn;
(function(e) {
  function t(n, r) {
    return r ? { label: n, documentation: r } : { label: n };
  }
  e.create = t;
})(Hn || (Hn = {}));
var $n;
(function(e) {
  function t(n, r) {
    for (var i = [], o = 2; o < arguments.length; o++)
      i[o - 2] = arguments[o];
    var a = { label: n };
    return h.defined(r) && (a.documentation = r), h.defined(i) ? a.parameters = i : a.parameters = [], a;
  }
  e.create = t;
})($n || ($n = {}));
var zn;
(function(e) {
  e.Text = 1, e.Read = 2, e.Write = 3;
})(zn || (zn = {}));
var Bn;
(function(e) {
  function t(n, r) {
    var i = { range: n };
    return h.number(r) && (i.kind = r), i;
  }
  e.create = t;
})(Bn || (Bn = {}));
var Un;
(function(e) {
  e.File = 1, e.Module = 2, e.Namespace = 3, e.Package = 4, e.Class = 5, e.Method = 6, e.Property = 7, e.Field = 8, e.Constructor = 9, e.Enum = 10, e.Interface = 11, e.Function = 12, e.Variable = 13, e.Constant = 14, e.String = 15, e.Number = 16, e.Boolean = 17, e.Array = 18, e.Object = 19, e.Key = 20, e.Null = 21, e.EnumMember = 22, e.Struct = 23, e.Event = 24, e.Operator = 25, e.TypeParameter = 26;
})(Un || (Un = {}));
var Vn;
(function(e) {
  e.Deprecated = 1;
})(Vn || (Vn = {}));
var Jn;
(function(e) {
  function t(n, r, i, o, a) {
    var u = {
      name: n,
      kind: r,
      location: { uri: o, range: i }
    };
    return a && (u.containerName = a), u;
  }
  e.create = t;
})(Jn || (Jn = {}));
var Qn;
(function(e) {
  function t(n, r, i, o) {
    return o !== void 0 ? { name: n, kind: r, location: { uri: i, range: o } } : { name: n, kind: r, location: { uri: i } };
  }
  e.create = t;
})(Qn || (Qn = {}));
var Xn;
(function(e) {
  function t(r, i, o, a, u, c) {
    var d = {
      name: r,
      detail: i,
      kind: o,
      range: a,
      selectionRange: u
    };
    return c !== void 0 && (d.children = c), d;
  }
  e.create = t;
  function n(r) {
    var i = r;
    return i && h.string(i.name) && h.number(i.kind) && ee.is(i.range) && ee.is(i.selectionRange) && (i.detail === void 0 || h.string(i.detail)) && (i.deprecated === void 0 || h.boolean(i.deprecated)) && (i.children === void 0 || Array.isArray(i.children)) && (i.tags === void 0 || Array.isArray(i.tags));
  }
  e.is = n;
})(Xn || (Xn = {}));
var Gn;
(function(e) {
  e.Empty = "", e.QuickFix = "quickfix", e.Refactor = "refactor", e.RefactorExtract = "refactor.extract", e.RefactorInline = "refactor.inline", e.RefactorRewrite = "refactor.rewrite", e.Source = "source", e.SourceOrganizeImports = "source.organizeImports", e.SourceFixAll = "source.fixAll";
})(Gn || (Gn = {}));
var vt;
(function(e) {
  e.Invoked = 1, e.Automatic = 2;
})(vt || (vt = {}));
var Yn;
(function(e) {
  function t(r, i, o) {
    var a = { diagnostics: r };
    return i != null && (a.only = i), o != null && (a.triggerKind = o), a;
  }
  e.create = t;
  function n(r) {
    var i = r;
    return h.defined(i) && h.typedArray(i.diagnostics, mt.is) && (i.only === void 0 || h.typedArray(i.only, h.string)) && (i.triggerKind === void 0 || i.triggerKind === vt.Invoked || i.triggerKind === vt.Automatic);
  }
  e.is = n;
})(Yn || (Yn = {}));
var Zn;
(function(e) {
  function t(r, i, o) {
    var a = { title: r }, u = !0;
    return typeof i == "string" ? (u = !1, a.kind = i) : Ve.is(i) ? a.command = i : a.edit = i, u && o !== void 0 && (a.kind = o), a;
  }
  e.create = t;
  function n(r) {
    var i = r;
    return i && h.string(i.title) && (i.diagnostics === void 0 || h.typedArray(i.diagnostics, mt.is)) && (i.kind === void 0 || h.string(i.kind)) && (i.edit !== void 0 || i.command !== void 0) && (i.command === void 0 || Ve.is(i.command)) && (i.isPreferred === void 0 || h.boolean(i.isPreferred)) && (i.edit === void 0 || Et.is(i.edit));
  }
  e.is = n;
})(Zn || (Zn = {}));
var Kn;
(function(e) {
  function t(r, i) {
    var o = { range: r };
    return h.defined(i) && (o.data = i), o;
  }
  e.create = t;
  function n(r) {
    var i = r;
    return h.defined(i) && ee.is(i.range) && (h.undefined(i.command) || Ve.is(i.command));
  }
  e.is = n;
})(Kn || (Kn = {}));
var xn;
(function(e) {
  function t(r, i) {
    return { tabSize: r, insertSpaces: i };
  }
  e.create = t;
  function n(r) {
    var i = r;
    return h.defined(i) && h.uinteger(i.tabSize) && h.boolean(i.insertSpaces);
  }
  e.is = n;
})(xn || (xn = {}));
var ei;
(function(e) {
  function t(r, i, o) {
    return { range: r, target: i, data: o };
  }
  e.create = t;
  function n(r) {
    var i = r;
    return h.defined(i) && ee.is(i.range) && (h.undefined(i.target) || h.string(i.target));
  }
  e.is = n;
})(ei || (ei = {}));
var ti;
(function(e) {
  function t(r, i) {
    return { range: r, parent: i };
  }
  e.create = t;
  function n(r) {
    var i = r;
    return h.objectLiteral(i) && ee.is(i.range) && (i.parent === void 0 || e.is(i.parent));
  }
  e.is = n;
})(ti || (ti = {}));
var ni;
(function(e) {
  e.namespace = "namespace", e.type = "type", e.class = "class", e.enum = "enum", e.interface = "interface", e.struct = "struct", e.typeParameter = "typeParameter", e.parameter = "parameter", e.variable = "variable", e.property = "property", e.enumMember = "enumMember", e.event = "event", e.function = "function", e.method = "method", e.macro = "macro", e.keyword = "keyword", e.modifier = "modifier", e.comment = "comment", e.string = "string", e.number = "number", e.regexp = "regexp", e.operator = "operator", e.decorator = "decorator";
})(ni || (ni = {}));
var ii;
(function(e) {
  e.declaration = "declaration", e.definition = "definition", e.readonly = "readonly", e.static = "static", e.deprecated = "deprecated", e.abstract = "abstract", e.async = "async", e.modification = "modification", e.documentation = "documentation", e.defaultLibrary = "defaultLibrary";
})(ii || (ii = {}));
var ri;
(function(e) {
  function t(n) {
    var r = n;
    return h.objectLiteral(r) && (r.resultId === void 0 || typeof r.resultId == "string") && Array.isArray(r.data) && (r.data.length === 0 || typeof r.data[0] == "number");
  }
  e.is = t;
})(ri || (ri = {}));
var oi;
(function(e) {
  function t(r, i) {
    return { range: r, text: i };
  }
  e.create = t;
  function n(r) {
    var i = r;
    return i != null && ee.is(i.range) && h.string(i.text);
  }
  e.is = n;
})(oi || (oi = {}));
var si;
(function(e) {
  function t(r, i, o) {
    return { range: r, variableName: i, caseSensitiveLookup: o };
  }
  e.create = t;
  function n(r) {
    var i = r;
    return i != null && ee.is(i.range) && h.boolean(i.caseSensitiveLookup) && (h.string(i.variableName) || i.variableName === void 0);
  }
  e.is = n;
})(si || (si = {}));
var ai;
(function(e) {
  function t(r, i) {
    return { range: r, expression: i };
  }
  e.create = t;
  function n(r) {
    var i = r;
    return i != null && ee.is(i.range) && (h.string(i.expression) || i.expression === void 0);
  }
  e.is = n;
})(ai || (ai = {}));
var ci;
(function(e) {
  function t(r, i) {
    return { frameId: r, stoppedLocation: i };
  }
  e.create = t;
  function n(r) {
    var i = r;
    return h.defined(i) && ee.is(r.stoppedLocation);
  }
  e.is = n;
})(ci || (ci = {}));
var Lt;
(function(e) {
  e.Type = 1, e.Parameter = 2;
  function t(n) {
    return n === 1 || n === 2;
  }
  e.is = t;
})(Lt || (Lt = {}));
var Ft;
(function(e) {
  function t(r) {
    return { value: r };
  }
  e.create = t;
  function n(r) {
    var i = r;
    return h.objectLiteral(i) && (i.tooltip === void 0 || h.string(i.tooltip) || st.is(i.tooltip)) && (i.location === void 0 || gt.is(i.location)) && (i.command === void 0 || Ve.is(i.command));
  }
  e.is = n;
})(Ft || (Ft = {}));
var ui;
(function(e) {
  function t(r, i, o) {
    var a = { position: r, label: i };
    return o !== void 0 && (a.kind = o), a;
  }
  e.create = t;
  function n(r) {
    var i = r;
    return h.objectLiteral(i) && pe.is(i.position) && (h.string(i.label) || h.typedArray(i.label, Ft.is)) && (i.kind === void 0 || Lt.is(i.kind)) && i.textEdits === void 0 || h.typedArray(i.textEdits, we.is) && (i.tooltip === void 0 || h.string(i.tooltip) || st.is(i.tooltip)) && (i.paddingLeft === void 0 || h.boolean(i.paddingLeft)) && (i.paddingRight === void 0 || h.boolean(i.paddingRight));
  }
  e.is = n;
})(ui || (ui = {}));
var li;
(function(e) {
  function t(n) {
    var r = n;
    return h.objectLiteral(r) && Nt.is(r.uri) && h.string(r.name);
  }
  e.is = t;
})(li || (li = {}));
var Yr = [`
`, `\r
`, "\r"], di;
(function(e) {
  function t(o, a, u, c) {
    return new Zr(o, a, u, c);
  }
  e.create = t;
  function n(o) {
    var a = o;
    return !!(h.defined(a) && h.string(a.uri) && (h.undefined(a.languageId) || h.string(a.languageId)) && h.uinteger(a.lineCount) && h.func(a.getText) && h.func(a.positionAt) && h.func(a.offsetAt));
  }
  e.is = n;
  function r(o, a) {
    for (var u = o.getText(), c = i(a, function(P, I) {
      var B = P.range.start.line - I.range.start.line;
      return B === 0 ? P.range.start.character - I.range.start.character : B;
    }), d = u.length, y = c.length - 1; y >= 0; y--) {
      var v = c[y], m = o.offsetAt(v.range.start), g = o.offsetAt(v.range.end);
      if (g <= d)
        u = u.substring(0, m) + v.newText + u.substring(g, u.length);
      else
        throw new Error("Overlapping edit");
      d = m;
    }
    return u;
  }
  e.applyEdits = r;
  function i(o, a) {
    if (o.length <= 1)
      return o;
    var u = o.length / 2 | 0, c = o.slice(0, u), d = o.slice(u);
    i(c, a), i(d, a);
    for (var y = 0, v = 0, m = 0; y < c.length && v < d.length; ) {
      var g = a(c[y], d[v]);
      g <= 0 ? o[m++] = c[y++] : o[m++] = d[v++];
    }
    for (; y < c.length; )
      o[m++] = c[y++];
    for (; v < d.length; )
      o[m++] = d[v++];
    return o;
  }
})(di || (di = {}));
var Zr = function() {
  function e(t, n, r, i) {
    this._uri = t, this._languageId = n, this._version = r, this._content = i, this._lineOffsets = void 0;
  }
  return Object.defineProperty(e.prototype, "uri", {
    get: function() {
      return this._uri;
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "languageId", {
    get: function() {
      return this._languageId;
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "version", {
    get: function() {
      return this._version;
    },
    enumerable: !1,
    configurable: !0
  }), e.prototype.getText = function(t) {
    if (t) {
      var n = this.offsetAt(t.start), r = this.offsetAt(t.end);
      return this._content.substring(n, r);
    }
    return this._content;
  }, e.prototype.update = function(t, n) {
    this._content = t.text, this._version = n, this._lineOffsets = void 0;
  }, e.prototype.getLineOffsets = function() {
    if (this._lineOffsets === void 0) {
      for (var t = [], n = this._content, r = !0, i = 0; i < n.length; i++) {
        r && (t.push(i), r = !1);
        var o = n.charAt(i);
        r = o === "\r" || o === `
`, o === "\r" && i + 1 < n.length && n.charAt(i + 1) === `
` && i++;
      }
      r && n.length > 0 && t.push(n.length), this._lineOffsets = t;
    }
    return this._lineOffsets;
  }, e.prototype.positionAt = function(t) {
    t = Math.max(Math.min(t, this._content.length), 0);
    var n = this.getLineOffsets(), r = 0, i = n.length;
    if (i === 0)
      return pe.create(0, t);
    for (; r < i; ) {
      var o = Math.floor((r + i) / 2);
      n[o] > t ? i = o : r = o + 1;
    }
    var a = r - 1;
    return pe.create(a, t - n[a]);
  }, e.prototype.offsetAt = function(t) {
    var n = this.getLineOffsets();
    if (t.line >= n.length)
      return this._content.length;
    if (t.line < 0)
      return 0;
    var r = n[t.line], i = t.line + 1 < n.length ? n[t.line + 1] : this._content.length;
    return Math.max(Math.min(r + t.character, i), r);
  }, Object.defineProperty(e.prototype, "lineCount", {
    get: function() {
      return this.getLineOffsets().length;
    },
    enumerable: !1,
    configurable: !0
  }), e;
}(), h;
(function(e) {
  var t = Object.prototype.toString;
  function n(g) {
    return typeof g < "u";
  }
  e.defined = n;
  function r(g) {
    return typeof g > "u";
  }
  e.undefined = r;
  function i(g) {
    return g === !0 || g === !1;
  }
  e.boolean = i;
  function o(g) {
    return t.call(g) === "[object String]";
  }
  e.string = o;
  function a(g) {
    return t.call(g) === "[object Number]";
  }
  e.number = a;
  function u(g, P, I) {
    return t.call(g) === "[object Number]" && P <= g && g <= I;
  }
  e.numberRange = u;
  function c(g) {
    return t.call(g) === "[object Number]" && -2147483648 <= g && g <= 2147483647;
  }
  e.integer = c;
  function d(g) {
    return t.call(g) === "[object Number]" && 0 <= g && g <= 2147483647;
  }
  e.uinteger = d;
  function y(g) {
    return t.call(g) === "[object Function]";
  }
  e.func = y;
  function v(g) {
    return g !== null && typeof g == "object";
  }
  e.objectLiteral = v;
  function m(g, P) {
    return Array.isArray(g) && g.every(P);
  }
  e.typedArray = m;
})(h || (h = {}));
const Kr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DocumentUri() {
    return bn;
  },
  get URI() {
    return Nt;
  },
  get integer() {
    return vn;
  },
  get uinteger() {
    return ht;
  },
  get Position() {
    return pe;
  },
  get Range() {
    return ee;
  },
  get Location() {
    return gt;
  },
  get LocationLink() {
    return _n;
  },
  get Color() {
    return Mt;
  },
  get ColorInformation() {
    return Rn;
  },
  get ColorPresentation() {
    return Dn;
  },
  get FoldingRangeKind() {
    return Tn;
  },
  get FoldingRange() {
    return wn;
  },
  get DiagnosticRelatedInformation() {
    return Ot;
  },
  get DiagnosticSeverity() {
    return Pn;
  },
  get DiagnosticTag() {
    return kn;
  },
  get CodeDescription() {
    return Cn;
  },
  get Diagnostic() {
    return mt;
  },
  get Command() {
    return Ve;
  },
  get TextEdit() {
    return we;
  },
  get ChangeAnnotation() {
    return Ue;
  },
  get ChangeAnnotationIdentifier() {
    return de;
  },
  get AnnotatedTextEdit() {
    return Ce;
  },
  get TextDocumentEdit() {
    return yt;
  },
  get CreateFile() {
    return it;
  },
  get RenameFile() {
    return rt;
  },
  get DeleteFile() {
    return ot;
  },
  get WorkspaceEdit() {
    return Et;
  },
  WorkspaceChange: Gr,
  get TextDocumentIdentifier() {
    return Sn;
  },
  get VersionedTextDocumentIdentifier() {
    return qn;
  },
  get OptionalVersionedTextDocumentIdentifier() {
    return pt;
  },
  get TextDocumentItem() {
    return Nn;
  },
  get MarkupKind() {
    return jt;
  },
  get MarkupContent() {
    return st;
  },
  get CompletionItemKind() {
    return Mn;
  },
  get InsertTextFormat() {
    return On;
  },
  get CompletionItemTag() {
    return En;
  },
  get InsertReplaceEdit() {
    return jn;
  },
  get InsertTextMode() {
    return Ln;
  },
  get CompletionItemLabelDetails() {
    return Fn;
  },
  get CompletionItem() {
    return An;
  },
  get CompletionList() {
    return Wn;
  },
  get MarkedString() {
    return bt;
  },
  get Hover() {
    return In;
  },
  get ParameterInformation() {
    return Hn;
  },
  get SignatureInformation() {
    return $n;
  },
  get DocumentHighlightKind() {
    return zn;
  },
  get DocumentHighlight() {
    return Bn;
  },
  get SymbolKind() {
    return Un;
  },
  get SymbolTag() {
    return Vn;
  },
  get SymbolInformation() {
    return Jn;
  },
  get WorkspaceSymbol() {
    return Qn;
  },
  get DocumentSymbol() {
    return Xn;
  },
  get CodeActionKind() {
    return Gn;
  },
  get CodeActionTriggerKind() {
    return vt;
  },
  get CodeActionContext() {
    return Yn;
  },
  get CodeAction() {
    return Zn;
  },
  get CodeLens() {
    return Kn;
  },
  get FormattingOptions() {
    return xn;
  },
  get DocumentLink() {
    return ei;
  },
  get SelectionRange() {
    return ti;
  },
  get SemanticTokenTypes() {
    return ni;
  },
  get SemanticTokenModifiers() {
    return ii;
  },
  get SemanticTokens() {
    return ri;
  },
  get InlineValueText() {
    return oi;
  },
  get InlineValueVariableLookup() {
    return si;
  },
  get InlineValueEvaluatableExpression() {
    return ai;
  },
  get InlineValueContext() {
    return ci;
  },
  get InlayHintKind() {
    return Lt;
  },
  get InlayHintLabelPart() {
    return Ft;
  },
  get InlayHint() {
    return ui;
  },
  get WorkspaceFolder() {
    return li;
  },
  EOL: Yr,
  get TextDocument() {
    return di;
  }
}, Symbol.toStringTag, { value: "Module" })), pi = /* @__PURE__ */ Lr(Kr);
var Y = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ProtocolNotificationType = e.ProtocolNotificationType0 = e.ProtocolRequestType = e.ProtocolRequestType0 = e.RegistrationType = e.MessageDirection = void 0;
  const t = Qe;
  (function(u) {
    u.clientToServer = "clientToServer", u.serverToClient = "serverToClient", u.both = "both";
  })(e.MessageDirection || (e.MessageDirection = {}));
  class n {
    constructor(c) {
      this.method = c;
    }
  }
  e.RegistrationType = n;
  class r extends t.RequestType0 {
    constructor(c) {
      super(c);
    }
  }
  e.ProtocolRequestType0 = r;
  class i extends t.RequestType {
    constructor(c) {
      super(c, t.ParameterStructures.byName);
    }
  }
  e.ProtocolRequestType = i;
  class o extends t.NotificationType0 {
    constructor(c) {
      super(c);
    }
  }
  e.ProtocolNotificationType0 = o;
  class a extends t.NotificationType {
    constructor(c) {
      super(c, t.ParameterStructures.byName);
    }
  }
  e.ProtocolNotificationType = a;
})(Y);
var Qi = {}, x = {};
Object.defineProperty(x, "__esModule", { value: !0 });
x.objectLiteral = x.typedArray = x.stringArray = x.array = x.func = x.error = x.number = x.string = x.boolean = void 0;
function xr(e) {
  return e === !0 || e === !1;
}
x.boolean = xr;
function Xi(e) {
  return typeof e == "string" || e instanceof String;
}
x.string = Xi;
function eo(e) {
  return typeof e == "number" || e instanceof Number;
}
x.number = eo;
function to(e) {
  return e instanceof Error;
}
x.error = to;
function no(e) {
  return typeof e == "function";
}
x.func = no;
function Gi(e) {
  return Array.isArray(e);
}
x.array = Gi;
function io(e) {
  return Gi(e) && e.every((t) => Xi(t));
}
x.stringArray = io;
function ro(e, t) {
  return Array.isArray(e) && e.every(t);
}
x.typedArray = ro;
function oo(e) {
  return e !== null && typeof e == "object";
}
x.objectLiteral = oo;
var Yi = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ImplementationRequest = void 0;
  const t = Y;
  (function(n) {
    n.method = "textDocument/implementation", n.messageDirection = t.MessageDirection.clientToServer, n.type = new t.ProtocolRequestType(n.method);
  })(e.ImplementationRequest || (e.ImplementationRequest = {}));
})(Yi);
var Zi = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.TypeDefinitionRequest = void 0;
  const t = Y;
  (function(n) {
    n.method = "textDocument/typeDefinition", n.messageDirection = t.MessageDirection.clientToServer, n.type = new t.ProtocolRequestType(n.method);
  })(e.TypeDefinitionRequest || (e.TypeDefinitionRequest = {}));
})(Zi);
var Ki = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.DidChangeWorkspaceFoldersNotification = e.WorkspaceFoldersRequest = void 0;
  const t = Y;
  (function(n) {
    n.method = "workspace/workspaceFolders", n.messageDirection = t.MessageDirection.serverToClient, n.type = new t.ProtocolRequestType0(n.method);
  })(e.WorkspaceFoldersRequest || (e.WorkspaceFoldersRequest = {})), function(n) {
    n.method = "workspace/didChangeWorkspaceFolders", n.messageDirection = t.MessageDirection.clientToServer, n.type = new t.ProtocolNotificationType(n.method);
  }(e.DidChangeWorkspaceFoldersNotification || (e.DidChangeWorkspaceFoldersNotification = {}));
})(Ki);
var xi = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ConfigurationRequest = void 0;
  const t = Y;
  (function(n) {
    n.method = "workspace/configuration", n.messageDirection = t.MessageDirection.serverToClient, n.type = new t.ProtocolRequestType(n.method);
  })(e.ConfigurationRequest || (e.ConfigurationRequest = {}));
})(xi);
var er = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ColorPresentationRequest = e.DocumentColorRequest = void 0;
  const t = Y;
  (function(n) {
    n.method = "textDocument/documentColor", n.messageDirection = t.MessageDirection.clientToServer, n.type = new t.ProtocolRequestType(n.method);
  })(e.DocumentColorRequest || (e.DocumentColorRequest = {})), function(n) {
    n.method = "textDocument/colorPresentation", n.messageDirection = t.MessageDirection.clientToServer, n.type = new t.ProtocolRequestType(n.method);
  }(e.ColorPresentationRequest || (e.ColorPresentationRequest = {}));
})(er);
var tr = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.FoldingRangeRequest = void 0;
  const t = Y;
  (function(n) {
    n.method = "textDocument/foldingRange", n.messageDirection = t.MessageDirection.clientToServer, n.type = new t.ProtocolRequestType(n.method);
  })(e.FoldingRangeRequest || (e.FoldingRangeRequest = {}));
})(tr);
var nr = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.DeclarationRequest = void 0;
  const t = Y;
  (function(n) {
    n.method = "textDocument/declaration", n.messageDirection = t.MessageDirection.clientToServer, n.type = new t.ProtocolRequestType(n.method);
  })(e.DeclarationRequest || (e.DeclarationRequest = {}));
})(nr);
var ir = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.SelectionRangeRequest = void 0;
  const t = Y;
  (function(n) {
    n.method = "textDocument/selectionRange", n.messageDirection = t.MessageDirection.clientToServer, n.type = new t.ProtocolRequestType(n.method);
  })(e.SelectionRangeRequest || (e.SelectionRangeRequest = {}));
})(ir);
var rr = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.WorkDoneProgressCancelNotification = e.WorkDoneProgressCreateRequest = e.WorkDoneProgress = void 0;
  const t = Qe, n = Y;
  (function(r) {
    r.type = new t.ProgressType();
    function i(o) {
      return o === r.type;
    }
    r.is = i;
  })(e.WorkDoneProgress || (e.WorkDoneProgress = {})), function(r) {
    r.method = "window/workDoneProgress/create", r.messageDirection = n.MessageDirection.serverToClient, r.type = new n.ProtocolRequestType(r.method);
  }(e.WorkDoneProgressCreateRequest || (e.WorkDoneProgressCreateRequest = {})), function(r) {
    r.method = "window/workDoneProgress/cancel", r.messageDirection = n.MessageDirection.clientToServer, r.type = new n.ProtocolNotificationType(r.method);
  }(e.WorkDoneProgressCancelNotification || (e.WorkDoneProgressCancelNotification = {}));
})(rr);
var or = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CallHierarchyOutgoingCallsRequest = e.CallHierarchyIncomingCallsRequest = e.CallHierarchyPrepareRequest = void 0;
  const t = Y;
  (function(n) {
    n.method = "textDocument/prepareCallHierarchy", n.messageDirection = t.MessageDirection.clientToServer, n.type = new t.ProtocolRequestType(n.method);
  })(e.CallHierarchyPrepareRequest || (e.CallHierarchyPrepareRequest = {})), function(n) {
    n.method = "callHierarchy/incomingCalls", n.messageDirection = t.MessageDirection.clientToServer, n.type = new t.ProtocolRequestType(n.method);
  }(e.CallHierarchyIncomingCallsRequest || (e.CallHierarchyIncomingCallsRequest = {})), function(n) {
    n.method = "callHierarchy/outgoingCalls", n.messageDirection = t.MessageDirection.clientToServer, n.type = new t.ProtocolRequestType(n.method);
  }(e.CallHierarchyOutgoingCallsRequest || (e.CallHierarchyOutgoingCallsRequest = {}));
})(or);
var sr = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.SemanticTokensRefreshRequest = e.SemanticTokensRangeRequest = e.SemanticTokensDeltaRequest = e.SemanticTokensRequest = e.SemanticTokensRegistrationType = e.TokenFormat = void 0;
  const t = Y;
  (function(r) {
    r.Relative = "relative";
  })(e.TokenFormat || (e.TokenFormat = {}));
  var n;
  (function(r) {
    r.method = "textDocument/semanticTokens", r.type = new t.RegistrationType(r.method);
  })(n = e.SemanticTokensRegistrationType || (e.SemanticTokensRegistrationType = {})), function(r) {
    r.method = "textDocument/semanticTokens/full", r.messageDirection = t.MessageDirection.clientToServer, r.type = new t.ProtocolRequestType(r.method), r.registrationMethod = n.method;
  }(e.SemanticTokensRequest || (e.SemanticTokensRequest = {})), function(r) {
    r.method = "textDocument/semanticTokens/full/delta", r.messageDirection = t.MessageDirection.clientToServer, r.type = new t.ProtocolRequestType(r.method), r.registrationMethod = n.method;
  }(e.SemanticTokensDeltaRequest || (e.SemanticTokensDeltaRequest = {})), function(r) {
    r.method = "textDocument/semanticTokens/range", r.messageDirection = t.MessageDirection.clientToServer, r.type = new t.ProtocolRequestType(r.method), r.registrationMethod = n.method;
  }(e.SemanticTokensRangeRequest || (e.SemanticTokensRangeRequest = {})), function(r) {
    r.method = "workspace/semanticTokens/refresh", r.messageDirection = t.MessageDirection.clientToServer, r.type = new t.ProtocolRequestType0(r.method);
  }(e.SemanticTokensRefreshRequest || (e.SemanticTokensRefreshRequest = {}));
})(sr);
var ar = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ShowDocumentRequest = void 0;
  const t = Y;
  (function(n) {
    n.method = "window/showDocument", n.messageDirection = t.MessageDirection.serverToClient, n.type = new t.ProtocolRequestType(n.method);
  })(e.ShowDocumentRequest || (e.ShowDocumentRequest = {}));
})(ar);
var cr = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.LinkedEditingRangeRequest = void 0;
  const t = Y;
  (function(n) {
    n.method = "textDocument/linkedEditingRange", n.messageDirection = t.MessageDirection.clientToServer, n.type = new t.ProtocolRequestType(n.method);
  })(e.LinkedEditingRangeRequest || (e.LinkedEditingRangeRequest = {}));
})(cr);
var ur = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.WillDeleteFilesRequest = e.DidDeleteFilesNotification = e.DidRenameFilesNotification = e.WillRenameFilesRequest = e.DidCreateFilesNotification = e.WillCreateFilesRequest = e.FileOperationPatternKind = void 0;
  const t = Y;
  (function(n) {
    n.file = "file", n.folder = "folder";
  })(e.FileOperationPatternKind || (e.FileOperationPatternKind = {})), function(n) {
    n.method = "workspace/willCreateFiles", n.messageDirection = t.MessageDirection.clientToServer, n.type = new t.ProtocolRequestType(n.method);
  }(e.WillCreateFilesRequest || (e.WillCreateFilesRequest = {})), function(n) {
    n.method = "workspace/didCreateFiles", n.messageDirection = t.MessageDirection.clientToServer, n.type = new t.ProtocolNotificationType(n.method);
  }(e.DidCreateFilesNotification || (e.DidCreateFilesNotification = {})), function(n) {
    n.method = "workspace/willRenameFiles", n.messageDirection = t.MessageDirection.clientToServer, n.type = new t.ProtocolRequestType(n.method);
  }(e.WillRenameFilesRequest || (e.WillRenameFilesRequest = {})), function(n) {
    n.method = "workspace/didRenameFiles", n.messageDirection = t.MessageDirection.clientToServer, n.type = new t.ProtocolNotificationType(n.method);
  }(e.DidRenameFilesNotification || (e.DidRenameFilesNotification = {})), function(n) {
    n.method = "workspace/didDeleteFiles", n.messageDirection = t.MessageDirection.clientToServer, n.type = new t.ProtocolNotificationType(n.method);
  }(e.DidDeleteFilesNotification || (e.DidDeleteFilesNotification = {})), function(n) {
    n.method = "workspace/willDeleteFiles", n.messageDirection = t.MessageDirection.clientToServer, n.type = new t.ProtocolRequestType(n.method);
  }(e.WillDeleteFilesRequest || (e.WillDeleteFilesRequest = {}));
})(ur);
var lr = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.MonikerRequest = e.MonikerKind = e.UniquenessLevel = void 0;
  const t = Y;
  (function(n) {
    n.document = "document", n.project = "project", n.group = "group", n.scheme = "scheme", n.global = "global";
  })(e.UniquenessLevel || (e.UniquenessLevel = {})), function(n) {
    n.$import = "import", n.$export = "export", n.local = "local";
  }(e.MonikerKind || (e.MonikerKind = {})), function(n) {
    n.method = "textDocument/moniker", n.messageDirection = t.MessageDirection.clientToServer, n.type = new t.ProtocolRequestType(n.method);
  }(e.MonikerRequest || (e.MonikerRequest = {}));
})(lr);
var dr = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.TypeHierarchySubtypesRequest = e.TypeHierarchySupertypesRequest = e.TypeHierarchyPrepareRequest = void 0;
  const t = Y;
  (function(n) {
    n.method = "textDocument/prepareTypeHierarchy", n.messageDirection = t.MessageDirection.clientToServer, n.type = new t.ProtocolRequestType(n.method);
  })(e.TypeHierarchyPrepareRequest || (e.TypeHierarchyPrepareRequest = {})), function(n) {
    n.method = "typeHierarchy/supertypes", n.messageDirection = t.MessageDirection.clientToServer, n.type = new t.ProtocolRequestType(n.method);
  }(e.TypeHierarchySupertypesRequest || (e.TypeHierarchySupertypesRequest = {})), function(n) {
    n.method = "typeHierarchy/subtypes", n.messageDirection = t.MessageDirection.clientToServer, n.type = new t.ProtocolRequestType(n.method);
  }(e.TypeHierarchySubtypesRequest || (e.TypeHierarchySubtypesRequest = {}));
})(dr);
var fr = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.InlineValueRefreshRequest = e.InlineValueRequest = void 0;
  const t = Y;
  (function(n) {
    n.method = "textDocument/inlineValue", n.messageDirection = t.MessageDirection.clientToServer, n.type = new t.ProtocolRequestType(n.method);
  })(e.InlineValueRequest || (e.InlineValueRequest = {})), function(n) {
    n.method = "workspace/inlineValue/refresh", n.messageDirection = t.MessageDirection.clientToServer, n.type = new t.ProtocolRequestType0(n.method);
  }(e.InlineValueRefreshRequest || (e.InlineValueRefreshRequest = {}));
})(fr);
var hr = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.InlayHintRefreshRequest = e.InlayHintResolveRequest = e.InlayHintRequest = void 0;
  const t = Y;
  (function(n) {
    n.method = "textDocument/inlayHint", n.messageDirection = t.MessageDirection.clientToServer, n.type = new t.ProtocolRequestType(n.method);
  })(e.InlayHintRequest || (e.InlayHintRequest = {})), function(n) {
    n.method = "inlayHint/resolve", n.messageDirection = t.MessageDirection.clientToServer, n.type = new t.ProtocolRequestType(n.method);
  }(e.InlayHintResolveRequest || (e.InlayHintResolveRequest = {})), function(n) {
    n.method = "workspace/inlayHint/refresh", n.messageDirection = t.MessageDirection.clientToServer, n.type = new t.ProtocolRequestType0(n.method);
  }(e.InlayHintRefreshRequest || (e.InlayHintRefreshRequest = {}));
})(hr);
var gr = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.DiagnosticRefreshRequest = e.WorkspaceDiagnosticRequest = e.DocumentDiagnosticRequest = e.DocumentDiagnosticReportKind = e.DiagnosticServerCancellationData = void 0;
  const t = Qe, n = x, r = Y;
  (function(i) {
    function o(a) {
      const u = a;
      return u && n.boolean(u.retriggerRequest);
    }
    i.is = o;
  })(e.DiagnosticServerCancellationData || (e.DiagnosticServerCancellationData = {})), function(i) {
    i.Full = "full", i.Unchanged = "unchanged";
  }(e.DocumentDiagnosticReportKind || (e.DocumentDiagnosticReportKind = {})), function(i) {
    i.method = "textDocument/diagnostic", i.messageDirection = r.MessageDirection.clientToServer, i.type = new r.ProtocolRequestType(i.method), i.partialResult = new t.ProgressType();
  }(e.DocumentDiagnosticRequest || (e.DocumentDiagnosticRequest = {})), function(i) {
    i.method = "workspace/diagnostic", i.messageDirection = r.MessageDirection.clientToServer, i.type = new r.ProtocolRequestType(i.method), i.partialResult = new t.ProgressType();
  }(e.WorkspaceDiagnosticRequest || (e.WorkspaceDiagnosticRequest = {})), function(i) {
    i.method = "workspace/diagnostic/refresh", i.messageDirection = r.MessageDirection.clientToServer, i.type = new r.ProtocolRequestType0(i.method);
  }(e.DiagnosticRefreshRequest || (e.DiagnosticRefreshRequest = {}));
})(gr);
var mr = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.DidCloseNotebookDocumentNotification = e.DidSaveNotebookDocumentNotification = e.DidChangeNotebookDocumentNotification = e.NotebookCellArrayChange = e.DidOpenNotebookDocumentNotification = e.NotebookDocumentSyncRegistrationType = e.NotebookDocument = e.NotebookCell = e.ExecutionSummary = e.NotebookCellKind = void 0;
  const t = pi, n = x, r = Y;
  var i;
  (function(c) {
    c.Markup = 1, c.Code = 2;
    function d(y) {
      return y === 1 || y === 2;
    }
    c.is = d;
  })(i = e.NotebookCellKind || (e.NotebookCellKind = {}));
  var o;
  (function(c) {
    function d(m, g) {
      const P = { executionOrder: m };
      return (g === !0 || g === !1) && (P.success = g), P;
    }
    c.create = d;
    function y(m) {
      const g = m;
      return n.objectLiteral(g) && t.uinteger.is(g.executionOrder) && (g.success === void 0 || n.boolean(g.success));
    }
    c.is = y;
    function v(m, g) {
      return m === g ? !0 : m == null || g === null || g === void 0 ? !1 : m.executionOrder === g.executionOrder && m.success === g.success;
    }
    c.equals = v;
  })(o = e.ExecutionSummary || (e.ExecutionSummary = {}));
  var a;
  (function(c) {
    function d(g, P) {
      return { kind: g, document: P };
    }
    c.create = d;
    function y(g) {
      const P = g;
      return n.objectLiteral(P) && i.is(P.kind) && t.DocumentUri.is(P.document) && (P.metadata === void 0 || n.objectLiteral(P.metadata));
    }
    c.is = y;
    function v(g, P) {
      const I = /* @__PURE__ */ new Set();
      return g.document !== P.document && I.add("document"), g.kind !== P.kind && I.add("kind"), g.executionSummary !== P.executionSummary && I.add("executionSummary"), (g.metadata !== void 0 || P.metadata !== void 0) && !m(g.metadata, P.metadata) && I.add("metadata"), (g.executionSummary !== void 0 || P.executionSummary !== void 0) && !o.equals(g.executionSummary, P.executionSummary) && I.add("executionSummary"), I;
    }
    c.diff = v;
    function m(g, P) {
      if (g === P)
        return !0;
      if (g == null || P === null || P === void 0 || typeof g != typeof P || typeof g != "object")
        return !1;
      const I = Array.isArray(g), B = Array.isArray(P);
      if (I !== B)
        return !1;
      if (I && B) {
        if (g.length !== P.length)
          return !1;
        for (let M = 0; M < g.length; M++)
          if (!m(g[M], P[M]))
            return !1;
      }
      if (n.objectLiteral(g) && n.objectLiteral(P)) {
        const M = Object.keys(g), H = Object.keys(P);
        if (M.length !== H.length || (M.sort(), H.sort(), !m(M, H)))
          return !1;
        for (let $ = 0; $ < M.length; $++) {
          const re = M[$];
          if (!m(g[re], P[re]))
            return !1;
        }
      }
      return !0;
    }
  })(a = e.NotebookCell || (e.NotebookCell = {})), function(c) {
    function d(v, m, g, P) {
      return { uri: v, notebookType: m, version: g, cells: P };
    }
    c.create = d;
    function y(v) {
      const m = v;
      return n.objectLiteral(m) && n.string(m.uri) && t.integer.is(m.version) && n.typedArray(m.cells, a.is);
    }
    c.is = y;
  }(e.NotebookDocument || (e.NotebookDocument = {}));
  var u;
  (function(c) {
    c.method = "notebookDocument/sync", c.messageDirection = r.MessageDirection.clientToServer, c.type = new r.RegistrationType(c.method);
  })(u = e.NotebookDocumentSyncRegistrationType || (e.NotebookDocumentSyncRegistrationType = {})), function(c) {
    c.method = "notebookDocument/didOpen", c.messageDirection = r.MessageDirection.clientToServer, c.type = new r.ProtocolNotificationType(c.method), c.registrationMethod = u.method;
  }(e.DidOpenNotebookDocumentNotification || (e.DidOpenNotebookDocumentNotification = {})), function(c) {
    function d(v) {
      const m = v;
      return n.objectLiteral(m) && t.uinteger.is(m.start) && t.uinteger.is(m.deleteCount) && (m.cells === void 0 || n.typedArray(m.cells, a.is));
    }
    c.is = d;
    function y(v, m, g) {
      const P = { start: v, deleteCount: m };
      return g !== void 0 && (P.cells = g), P;
    }
    c.create = y;
  }(e.NotebookCellArrayChange || (e.NotebookCellArrayChange = {})), function(c) {
    c.method = "notebookDocument/didChange", c.messageDirection = r.MessageDirection.clientToServer, c.type = new r.ProtocolNotificationType(c.method), c.registrationMethod = u.method;
  }(e.DidChangeNotebookDocumentNotification || (e.DidChangeNotebookDocumentNotification = {})), function(c) {
    c.method = "notebookDocument/didSave", c.messageDirection = r.MessageDirection.clientToServer, c.type = new r.ProtocolNotificationType(c.method), c.registrationMethod = u.method;
  }(e.DidSaveNotebookDocumentNotification || (e.DidSaveNotebookDocumentNotification = {})), function(c) {
    c.method = "notebookDocument/didClose", c.messageDirection = r.MessageDirection.clientToServer, c.type = new r.ProtocolNotificationType(c.method), c.registrationMethod = u.method;
  }(e.DidCloseNotebookDocumentNotification || (e.DidCloseNotebookDocumentNotification = {}));
})(mr);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.WorkspaceSymbolRequest = e.CodeActionResolveRequest = e.CodeActionRequest = e.DocumentSymbolRequest = e.DocumentHighlightRequest = e.ReferencesRequest = e.DefinitionRequest = e.SignatureHelpRequest = e.SignatureHelpTriggerKind = e.HoverRequest = e.CompletionResolveRequest = e.CompletionRequest = e.CompletionTriggerKind = e.PublishDiagnosticsNotification = e.WatchKind = e.RelativePattern = e.FileChangeType = e.DidChangeWatchedFilesNotification = e.WillSaveTextDocumentWaitUntilRequest = e.WillSaveTextDocumentNotification = e.TextDocumentSaveReason = e.DidSaveTextDocumentNotification = e.DidCloseTextDocumentNotification = e.DidChangeTextDocumentNotification = e.TextDocumentContentChangeEvent = e.DidOpenTextDocumentNotification = e.TextDocumentSyncKind = e.TelemetryEventNotification = e.LogMessageNotification = e.ShowMessageRequest = e.ShowMessageNotification = e.MessageType = e.DidChangeConfigurationNotification = e.ExitNotification = e.ShutdownRequest = e.InitializedNotification = e.InitializeErrorCodes = e.InitializeRequest = e.WorkDoneProgressOptions = e.TextDocumentRegistrationOptions = e.StaticRegistrationOptions = e.PositionEncodingKind = e.FailureHandlingKind = e.ResourceOperationKind = e.UnregistrationRequest = e.RegistrationRequest = e.DocumentSelector = e.NotebookCellTextDocumentFilter = e.NotebookDocumentFilter = e.TextDocumentFilter = void 0, e.TypeHierarchySubtypesRequest = e.TypeHierarchyPrepareRequest = e.MonikerRequest = e.MonikerKind = e.UniquenessLevel = e.WillDeleteFilesRequest = e.DidDeleteFilesNotification = e.WillRenameFilesRequest = e.DidRenameFilesNotification = e.WillCreateFilesRequest = e.DidCreateFilesNotification = e.FileOperationPatternKind = e.LinkedEditingRangeRequest = e.ShowDocumentRequest = e.SemanticTokensRegistrationType = e.SemanticTokensRefreshRequest = e.SemanticTokensRangeRequest = e.SemanticTokensDeltaRequest = e.SemanticTokensRequest = e.TokenFormat = e.CallHierarchyPrepareRequest = e.CallHierarchyOutgoingCallsRequest = e.CallHierarchyIncomingCallsRequest = e.WorkDoneProgressCancelNotification = e.WorkDoneProgressCreateRequest = e.WorkDoneProgress = e.SelectionRangeRequest = e.DeclarationRequest = e.FoldingRangeRequest = e.ColorPresentationRequest = e.DocumentColorRequest = e.ConfigurationRequest = e.DidChangeWorkspaceFoldersNotification = e.WorkspaceFoldersRequest = e.TypeDefinitionRequest = e.ImplementationRequest = e.ApplyWorkspaceEditRequest = e.ExecuteCommandRequest = e.PrepareRenameRequest = e.RenameRequest = e.PrepareSupportDefaultBehavior = e.DocumentOnTypeFormattingRequest = e.DocumentRangeFormattingRequest = e.DocumentFormattingRequest = e.DocumentLinkResolveRequest = e.DocumentLinkRequest = e.CodeLensRefreshRequest = e.CodeLensResolveRequest = e.CodeLensRequest = e.WorkspaceSymbolResolveRequest = void 0, e.DidCloseNotebookDocumentNotification = e.DidSaveNotebookDocumentNotification = e.DidChangeNotebookDocumentNotification = e.NotebookCellArrayChange = e.DidOpenNotebookDocumentNotification = e.NotebookDocumentSyncRegistrationType = e.NotebookDocument = e.NotebookCell = e.ExecutionSummary = e.NotebookCellKind = e.DiagnosticRefreshRequest = e.WorkspaceDiagnosticRequest = e.DocumentDiagnosticRequest = e.DocumentDiagnosticReportKind = e.DiagnosticServerCancellationData = e.InlayHintRefreshRequest = e.InlayHintResolveRequest = e.InlayHintRequest = e.InlineValueRefreshRequest = e.InlineValueRequest = e.TypeHierarchySupertypesRequest = void 0;
  const t = Y, n = pi, r = x, i = Yi;
  Object.defineProperty(e, "ImplementationRequest", { enumerable: !0, get: function() {
    return i.ImplementationRequest;
  } });
  const o = Zi;
  Object.defineProperty(e, "TypeDefinitionRequest", { enumerable: !0, get: function() {
    return o.TypeDefinitionRequest;
  } });
  const a = Ki;
  Object.defineProperty(e, "WorkspaceFoldersRequest", { enumerable: !0, get: function() {
    return a.WorkspaceFoldersRequest;
  } }), Object.defineProperty(e, "DidChangeWorkspaceFoldersNotification", { enumerable: !0, get: function() {
    return a.DidChangeWorkspaceFoldersNotification;
  } });
  const u = xi;
  Object.defineProperty(e, "ConfigurationRequest", { enumerable: !0, get: function() {
    return u.ConfigurationRequest;
  } });
  const c = er;
  Object.defineProperty(e, "DocumentColorRequest", { enumerable: !0, get: function() {
    return c.DocumentColorRequest;
  } }), Object.defineProperty(e, "ColorPresentationRequest", { enumerable: !0, get: function() {
    return c.ColorPresentationRequest;
  } });
  const d = tr;
  Object.defineProperty(e, "FoldingRangeRequest", { enumerable: !0, get: function() {
    return d.FoldingRangeRequest;
  } });
  const y = nr;
  Object.defineProperty(e, "DeclarationRequest", { enumerable: !0, get: function() {
    return y.DeclarationRequest;
  } });
  const v = ir;
  Object.defineProperty(e, "SelectionRangeRequest", { enumerable: !0, get: function() {
    return v.SelectionRangeRequest;
  } });
  const m = rr;
  Object.defineProperty(e, "WorkDoneProgress", { enumerable: !0, get: function() {
    return m.WorkDoneProgress;
  } }), Object.defineProperty(e, "WorkDoneProgressCreateRequest", { enumerable: !0, get: function() {
    return m.WorkDoneProgressCreateRequest;
  } }), Object.defineProperty(e, "WorkDoneProgressCancelNotification", { enumerable: !0, get: function() {
    return m.WorkDoneProgressCancelNotification;
  } });
  const g = or;
  Object.defineProperty(e, "CallHierarchyIncomingCallsRequest", { enumerable: !0, get: function() {
    return g.CallHierarchyIncomingCallsRequest;
  } }), Object.defineProperty(e, "CallHierarchyOutgoingCallsRequest", { enumerable: !0, get: function() {
    return g.CallHierarchyOutgoingCallsRequest;
  } }), Object.defineProperty(e, "CallHierarchyPrepareRequest", { enumerable: !0, get: function() {
    return g.CallHierarchyPrepareRequest;
  } });
  const P = sr;
  Object.defineProperty(e, "TokenFormat", { enumerable: !0, get: function() {
    return P.TokenFormat;
  } }), Object.defineProperty(e, "SemanticTokensRequest", { enumerable: !0, get: function() {
    return P.SemanticTokensRequest;
  } }), Object.defineProperty(e, "SemanticTokensDeltaRequest", { enumerable: !0, get: function() {
    return P.SemanticTokensDeltaRequest;
  } }), Object.defineProperty(e, "SemanticTokensRangeRequest", { enumerable: !0, get: function() {
    return P.SemanticTokensRangeRequest;
  } }), Object.defineProperty(e, "SemanticTokensRefreshRequest", { enumerable: !0, get: function() {
    return P.SemanticTokensRefreshRequest;
  } }), Object.defineProperty(e, "SemanticTokensRegistrationType", { enumerable: !0, get: function() {
    return P.SemanticTokensRegistrationType;
  } });
  const I = ar;
  Object.defineProperty(e, "ShowDocumentRequest", { enumerable: !0, get: function() {
    return I.ShowDocumentRequest;
  } });
  const B = cr;
  Object.defineProperty(e, "LinkedEditingRangeRequest", { enumerable: !0, get: function() {
    return B.LinkedEditingRangeRequest;
  } });
  const M = ur;
  Object.defineProperty(e, "FileOperationPatternKind", { enumerable: !0, get: function() {
    return M.FileOperationPatternKind;
  } }), Object.defineProperty(e, "DidCreateFilesNotification", { enumerable: !0, get: function() {
    return M.DidCreateFilesNotification;
  } }), Object.defineProperty(e, "WillCreateFilesRequest", { enumerable: !0, get: function() {
    return M.WillCreateFilesRequest;
  } }), Object.defineProperty(e, "DidRenameFilesNotification", { enumerable: !0, get: function() {
    return M.DidRenameFilesNotification;
  } }), Object.defineProperty(e, "WillRenameFilesRequest", { enumerable: !0, get: function() {
    return M.WillRenameFilesRequest;
  } }), Object.defineProperty(e, "DidDeleteFilesNotification", { enumerable: !0, get: function() {
    return M.DidDeleteFilesNotification;
  } }), Object.defineProperty(e, "WillDeleteFilesRequest", { enumerable: !0, get: function() {
    return M.WillDeleteFilesRequest;
  } });
  const H = lr;
  Object.defineProperty(e, "UniquenessLevel", { enumerable: !0, get: function() {
    return H.UniquenessLevel;
  } }), Object.defineProperty(e, "MonikerKind", { enumerable: !0, get: function() {
    return H.MonikerKind;
  } }), Object.defineProperty(e, "MonikerRequest", { enumerable: !0, get: function() {
    return H.MonikerRequest;
  } });
  const $ = dr;
  Object.defineProperty(e, "TypeHierarchyPrepareRequest", { enumerable: !0, get: function() {
    return $.TypeHierarchyPrepareRequest;
  } }), Object.defineProperty(e, "TypeHierarchySubtypesRequest", { enumerable: !0, get: function() {
    return $.TypeHierarchySubtypesRequest;
  } }), Object.defineProperty(e, "TypeHierarchySupertypesRequest", { enumerable: !0, get: function() {
    return $.TypeHierarchySupertypesRequest;
  } });
  const re = fr;
  Object.defineProperty(e, "InlineValueRequest", { enumerable: !0, get: function() {
    return re.InlineValueRequest;
  } }), Object.defineProperty(e, "InlineValueRefreshRequest", { enumerable: !0, get: function() {
    return re.InlineValueRefreshRequest;
  } });
  const he = hr;
  Object.defineProperty(e, "InlayHintRequest", { enumerable: !0, get: function() {
    return he.InlayHintRequest;
  } }), Object.defineProperty(e, "InlayHintResolveRequest", { enumerable: !0, get: function() {
    return he.InlayHintResolveRequest;
  } }), Object.defineProperty(e, "InlayHintRefreshRequest", { enumerable: !0, get: function() {
    return he.InlayHintRefreshRequest;
  } });
  const Z = gr;
  Object.defineProperty(e, "DiagnosticServerCancellationData", { enumerable: !0, get: function() {
    return Z.DiagnosticServerCancellationData;
  } }), Object.defineProperty(e, "DocumentDiagnosticReportKind", { enumerable: !0, get: function() {
    return Z.DocumentDiagnosticReportKind;
  } }), Object.defineProperty(e, "DocumentDiagnosticRequest", { enumerable: !0, get: function() {
    return Z.DocumentDiagnosticRequest;
  } }), Object.defineProperty(e, "WorkspaceDiagnosticRequest", { enumerable: !0, get: function() {
    return Z.WorkspaceDiagnosticRequest;
  } }), Object.defineProperty(e, "DiagnosticRefreshRequest", { enumerable: !0, get: function() {
    return Z.DiagnosticRefreshRequest;
  } });
  const ae = mr;
  Object.defineProperty(e, "NotebookCellKind", { enumerable: !0, get: function() {
    return ae.NotebookCellKind;
  } }), Object.defineProperty(e, "ExecutionSummary", { enumerable: !0, get: function() {
    return ae.ExecutionSummary;
  } }), Object.defineProperty(e, "NotebookCell", { enumerable: !0, get: function() {
    return ae.NotebookCell;
  } }), Object.defineProperty(e, "NotebookDocument", { enumerable: !0, get: function() {
    return ae.NotebookDocument;
  } }), Object.defineProperty(e, "NotebookDocumentSyncRegistrationType", { enumerable: !0, get: function() {
    return ae.NotebookDocumentSyncRegistrationType;
  } }), Object.defineProperty(e, "DidOpenNotebookDocumentNotification", { enumerable: !0, get: function() {
    return ae.DidOpenNotebookDocumentNotification;
  } }), Object.defineProperty(e, "NotebookCellArrayChange", { enumerable: !0, get: function() {
    return ae.NotebookCellArrayChange;
  } }), Object.defineProperty(e, "DidChangeNotebookDocumentNotification", { enumerable: !0, get: function() {
    return ae.DidChangeNotebookDocumentNotification;
  } }), Object.defineProperty(e, "DidSaveNotebookDocumentNotification", { enumerable: !0, get: function() {
    return ae.DidSaveNotebookDocumentNotification;
  } }), Object.defineProperty(e, "DidCloseNotebookDocumentNotification", { enumerable: !0, get: function() {
    return ae.DidCloseNotebookDocumentNotification;
  } });
  var T;
  (function(s) {
    function w(A) {
      const N = A;
      return r.string(N.language) || r.string(N.scheme) || r.string(N.pattern);
    }
    s.is = w;
  })(T = e.TextDocumentFilter || (e.TextDocumentFilter = {}));
  var j;
  (function(s) {
    function w(A) {
      const N = A;
      return r.objectLiteral(N) && (r.string(N.notebookType) || r.string(N.scheme) || r.string(N.pattern));
    }
    s.is = w;
  })(j = e.NotebookDocumentFilter || (e.NotebookDocumentFilter = {}));
  var F;
  (function(s) {
    function w(A) {
      const N = A;
      return r.objectLiteral(N) && (r.string(N.notebook) || j.is(N.notebook)) && (N.language === void 0 || r.string(N.language));
    }
    s.is = w;
  })(F = e.NotebookCellTextDocumentFilter || (e.NotebookCellTextDocumentFilter = {}));
  var E;
  (function(s) {
    function w(A) {
      if (!Array.isArray(A))
        return !1;
      for (let N of A)
        if (!r.string(N) && !T.is(N) && !F.is(N))
          return !1;
      return !0;
    }
    s.is = w;
  })(E = e.DocumentSelector || (e.DocumentSelector = {})), function(s) {
    s.method = "client/registerCapability", s.messageDirection = t.MessageDirection.serverToClient, s.type = new t.ProtocolRequestType(s.method);
  }(e.RegistrationRequest || (e.RegistrationRequest = {})), function(s) {
    s.method = "client/unregisterCapability", s.messageDirection = t.MessageDirection.serverToClient, s.type = new t.ProtocolRequestType(s.method);
  }(e.UnregistrationRequest || (e.UnregistrationRequest = {})), function(s) {
    s.Create = "create", s.Rename = "rename", s.Delete = "delete";
  }(e.ResourceOperationKind || (e.ResourceOperationKind = {})), function(s) {
    s.Abort = "abort", s.Transactional = "transactional", s.TextOnlyTransactional = "textOnlyTransactional", s.Undo = "undo";
  }(e.FailureHandlingKind || (e.FailureHandlingKind = {})), function(s) {
    s.UTF8 = "utf-8", s.UTF16 = "utf-16", s.UTF32 = "utf-32";
  }(e.PositionEncodingKind || (e.PositionEncodingKind = {})), function(s) {
    function w(A) {
      const N = A;
      return N && r.string(N.id) && N.id.length > 0;
    }
    s.hasId = w;
  }(e.StaticRegistrationOptions || (e.StaticRegistrationOptions = {})), function(s) {
    function w(A) {
      const N = A;
      return N && (N.documentSelector === null || E.is(N.documentSelector));
    }
    s.is = w;
  }(e.TextDocumentRegistrationOptions || (e.TextDocumentRegistrationOptions = {})), function(s) {
    function w(N) {
      const W = N;
      return r.objectLiteral(W) && (W.workDoneProgress === void 0 || r.boolean(W.workDoneProgress));
    }
    s.is = w;
    function A(N) {
      const W = N;
      return W && r.boolean(W.workDoneProgress);
    }
    s.hasWorkDoneProgress = A;
  }(e.WorkDoneProgressOptions || (e.WorkDoneProgressOptions = {})), function(s) {
    s.method = "initialize", s.messageDirection = t.MessageDirection.clientToServer, s.type = new t.ProtocolRequestType(s.method);
  }(e.InitializeRequest || (e.InitializeRequest = {})), function(s) {
    s.unknownProtocolVersion = 1;
  }(e.InitializeErrorCodes || (e.InitializeErrorCodes = {})), function(s) {
    s.method = "initialized", s.messageDirection = t.MessageDirection.clientToServer, s.type = new t.ProtocolNotificationType(s.method);
  }(e.InitializedNotification || (e.InitializedNotification = {})), function(s) {
    s.method = "shutdown", s.messageDirection = t.MessageDirection.clientToServer, s.type = new t.ProtocolRequestType0(s.method);
  }(e.ShutdownRequest || (e.ShutdownRequest = {})), function(s) {
    s.method = "exit", s.messageDirection = t.MessageDirection.clientToServer, s.type = new t.ProtocolNotificationType0(s.method);
  }(e.ExitNotification || (e.ExitNotification = {})), function(s) {
    s.method = "workspace/didChangeConfiguration", s.messageDirection = t.MessageDirection.clientToServer, s.type = new t.ProtocolNotificationType(s.method);
  }(e.DidChangeConfigurationNotification || (e.DidChangeConfigurationNotification = {})), function(s) {
    s.Error = 1, s.Warning = 2, s.Info = 3, s.Log = 4;
  }(e.MessageType || (e.MessageType = {})), function(s) {
    s.method = "window/showMessage", s.messageDirection = t.MessageDirection.serverToClient, s.type = new t.ProtocolNotificationType(s.method);
  }(e.ShowMessageNotification || (e.ShowMessageNotification = {})), function(s) {
    s.method = "window/showMessageRequest", s.messageDirection = t.MessageDirection.serverToClient, s.type = new t.ProtocolRequestType(s.method);
  }(e.ShowMessageRequest || (e.ShowMessageRequest = {})), function(s) {
    s.method = "window/logMessage", s.messageDirection = t.MessageDirection.serverToClient, s.type = new t.ProtocolNotificationType(s.method);
  }(e.LogMessageNotification || (e.LogMessageNotification = {})), function(s) {
    s.method = "telemetry/event", s.messageDirection = t.MessageDirection.serverToClient, s.type = new t.ProtocolNotificationType(s.method);
  }(e.TelemetryEventNotification || (e.TelemetryEventNotification = {})), function(s) {
    s.None = 0, s.Full = 1, s.Incremental = 2;
  }(e.TextDocumentSyncKind || (e.TextDocumentSyncKind = {})), function(s) {
    s.method = "textDocument/didOpen", s.messageDirection = t.MessageDirection.clientToServer, s.type = new t.ProtocolNotificationType(s.method);
  }(e.DidOpenTextDocumentNotification || (e.DidOpenTextDocumentNotification = {})), function(s) {
    function w(N) {
      let W = N;
      return W != null && typeof W.text == "string" && W.range !== void 0 && (W.rangeLength === void 0 || typeof W.rangeLength == "number");
    }
    s.isIncremental = w;
    function A(N) {
      let W = N;
      return W != null && typeof W.text == "string" && W.range === void 0 && W.rangeLength === void 0;
    }
    s.isFull = A;
  }(e.TextDocumentContentChangeEvent || (e.TextDocumentContentChangeEvent = {})), function(s) {
    s.method = "textDocument/didChange", s.messageDirection = t.MessageDirection.clientToServer, s.type = new t.ProtocolNotificationType(s.method);
  }(e.DidChangeTextDocumentNotification || (e.DidChangeTextDocumentNotification = {})), function(s) {
    s.method = "textDocument/didClose", s.messageDirection = t.MessageDirection.clientToServer, s.type = new t.ProtocolNotificationType(s.method);
  }(e.DidCloseTextDocumentNotification || (e.DidCloseTextDocumentNotification = {})), function(s) {
    s.method = "textDocument/didSave", s.messageDirection = t.MessageDirection.clientToServer, s.type = new t.ProtocolNotificationType(s.method);
  }(e.DidSaveTextDocumentNotification || (e.DidSaveTextDocumentNotification = {})), function(s) {
    s.Manual = 1, s.AfterDelay = 2, s.FocusOut = 3;
  }(e.TextDocumentSaveReason || (e.TextDocumentSaveReason = {})), function(s) {
    s.method = "textDocument/willSave", s.messageDirection = t.MessageDirection.clientToServer, s.type = new t.ProtocolNotificationType(s.method);
  }(e.WillSaveTextDocumentNotification || (e.WillSaveTextDocumentNotification = {})), function(s) {
    s.method = "textDocument/willSaveWaitUntil", s.messageDirection = t.MessageDirection.clientToServer, s.type = new t.ProtocolRequestType(s.method);
  }(e.WillSaveTextDocumentWaitUntilRequest || (e.WillSaveTextDocumentWaitUntilRequest = {})), function(s) {
    s.method = "workspace/didChangeWatchedFiles", s.messageDirection = t.MessageDirection.clientToServer, s.type = new t.ProtocolNotificationType(s.method);
  }(e.DidChangeWatchedFilesNotification || (e.DidChangeWatchedFilesNotification = {})), function(s) {
    s.Created = 1, s.Changed = 2, s.Deleted = 3;
  }(e.FileChangeType || (e.FileChangeType = {})), function(s) {
    function w(A) {
      const N = A;
      return r.objectLiteral(N) && (n.URI.is(N.baseUri) || n.WorkspaceFolder.is(N.baseUri)) && r.string(N.pattern);
    }
    s.is = w;
  }(e.RelativePattern || (e.RelativePattern = {})), function(s) {
    s.Create = 1, s.Change = 2, s.Delete = 4;
  }(e.WatchKind || (e.WatchKind = {})), function(s) {
    s.method = "textDocument/publishDiagnostics", s.messageDirection = t.MessageDirection.serverToClient, s.type = new t.ProtocolNotificationType(s.method);
  }(e.PublishDiagnosticsNotification || (e.PublishDiagnosticsNotification = {})), function(s) {
    s.Invoked = 1, s.TriggerCharacter = 2, s.TriggerForIncompleteCompletions = 3;
  }(e.CompletionTriggerKind || (e.CompletionTriggerKind = {})), function(s) {
    s.method = "textDocument/completion", s.messageDirection = t.MessageDirection.clientToServer, s.type = new t.ProtocolRequestType(s.method);
  }(e.CompletionRequest || (e.CompletionRequest = {})), function(s) {
    s.method = "completionItem/resolve", s.messageDirection = t.MessageDirection.clientToServer, s.type = new t.ProtocolRequestType(s.method);
  }(e.CompletionResolveRequest || (e.CompletionResolveRequest = {})), function(s) {
    s.method = "textDocument/hover", s.messageDirection = t.MessageDirection.clientToServer, s.type = new t.ProtocolRequestType(s.method);
  }(e.HoverRequest || (e.HoverRequest = {})), function(s) {
    s.Invoked = 1, s.TriggerCharacter = 2, s.ContentChange = 3;
  }(e.SignatureHelpTriggerKind || (e.SignatureHelpTriggerKind = {})), function(s) {
    s.method = "textDocument/signatureHelp", s.messageDirection = t.MessageDirection.clientToServer, s.type = new t.ProtocolRequestType(s.method);
  }(e.SignatureHelpRequest || (e.SignatureHelpRequest = {})), function(s) {
    s.method = "textDocument/definition", s.messageDirection = t.MessageDirection.clientToServer, s.type = new t.ProtocolRequestType(s.method);
  }(e.DefinitionRequest || (e.DefinitionRequest = {})), function(s) {
    s.method = "textDocument/references", s.messageDirection = t.MessageDirection.clientToServer, s.type = new t.ProtocolRequestType(s.method);
  }(e.ReferencesRequest || (e.ReferencesRequest = {})), function(s) {
    s.method = "textDocument/documentHighlight", s.messageDirection = t.MessageDirection.clientToServer, s.type = new t.ProtocolRequestType(s.method);
  }(e.DocumentHighlightRequest || (e.DocumentHighlightRequest = {})), function(s) {
    s.method = "textDocument/documentSymbol", s.messageDirection = t.MessageDirection.clientToServer, s.type = new t.ProtocolRequestType(s.method);
  }(e.DocumentSymbolRequest || (e.DocumentSymbolRequest = {})), function(s) {
    s.method = "textDocument/codeAction", s.messageDirection = t.MessageDirection.clientToServer, s.type = new t.ProtocolRequestType(s.method);
  }(e.CodeActionRequest || (e.CodeActionRequest = {})), function(s) {
    s.method = "codeAction/resolve", s.messageDirection = t.MessageDirection.clientToServer, s.type = new t.ProtocolRequestType(s.method);
  }(e.CodeActionResolveRequest || (e.CodeActionResolveRequest = {})), function(s) {
    s.method = "workspace/symbol", s.messageDirection = t.MessageDirection.clientToServer, s.type = new t.ProtocolRequestType(s.method);
  }(e.WorkspaceSymbolRequest || (e.WorkspaceSymbolRequest = {})), function(s) {
    s.method = "workspaceSymbol/resolve", s.messageDirection = t.MessageDirection.clientToServer, s.type = new t.ProtocolRequestType(s.method);
  }(e.WorkspaceSymbolResolveRequest || (e.WorkspaceSymbolResolveRequest = {})), function(s) {
    s.method = "textDocument/codeLens", s.messageDirection = t.MessageDirection.clientToServer, s.type = new t.ProtocolRequestType(s.method);
  }(e.CodeLensRequest || (e.CodeLensRequest = {})), function(s) {
    s.method = "codeLens/resolve", s.messageDirection = t.MessageDirection.clientToServer, s.type = new t.ProtocolRequestType(s.method);
  }(e.CodeLensResolveRequest || (e.CodeLensResolveRequest = {})), function(s) {
    s.method = "workspace/codeLens/refresh", s.messageDirection = t.MessageDirection.serverToClient, s.type = new t.ProtocolRequestType0(s.method);
  }(e.CodeLensRefreshRequest || (e.CodeLensRefreshRequest = {})), function(s) {
    s.method = "textDocument/documentLink", s.messageDirection = t.MessageDirection.clientToServer, s.type = new t.ProtocolRequestType(s.method);
  }(e.DocumentLinkRequest || (e.DocumentLinkRequest = {})), function(s) {
    s.method = "documentLink/resolve", s.messageDirection = t.MessageDirection.clientToServer, s.type = new t.ProtocolRequestType(s.method);
  }(e.DocumentLinkResolveRequest || (e.DocumentLinkResolveRequest = {})), function(s) {
    s.method = "textDocument/formatting", s.messageDirection = t.MessageDirection.clientToServer, s.type = new t.ProtocolRequestType(s.method);
  }(e.DocumentFormattingRequest || (e.DocumentFormattingRequest = {})), function(s) {
    s.method = "textDocument/rangeFormatting", s.messageDirection = t.MessageDirection.clientToServer, s.type = new t.ProtocolRequestType(s.method);
  }(e.DocumentRangeFormattingRequest || (e.DocumentRangeFormattingRequest = {})), function(s) {
    s.method = "textDocument/onTypeFormatting", s.messageDirection = t.MessageDirection.clientToServer, s.type = new t.ProtocolRequestType(s.method);
  }(e.DocumentOnTypeFormattingRequest || (e.DocumentOnTypeFormattingRequest = {})), function(s) {
    s.Identifier = 1;
  }(e.PrepareSupportDefaultBehavior || (e.PrepareSupportDefaultBehavior = {})), function(s) {
    s.method = "textDocument/rename", s.messageDirection = t.MessageDirection.clientToServer, s.type = new t.ProtocolRequestType(s.method);
  }(e.RenameRequest || (e.RenameRequest = {})), function(s) {
    s.method = "textDocument/prepareRename", s.messageDirection = t.MessageDirection.clientToServer, s.type = new t.ProtocolRequestType(s.method);
  }(e.PrepareRenameRequest || (e.PrepareRenameRequest = {})), function(s) {
    s.method = "workspace/executeCommand", s.messageDirection = t.MessageDirection.clientToServer, s.type = new t.ProtocolRequestType(s.method);
  }(e.ExecuteCommandRequest || (e.ExecuteCommandRequest = {})), function(s) {
    s.method = "workspace/applyEdit", s.messageDirection = t.MessageDirection.serverToClient, s.type = new t.ProtocolRequestType("workspace/applyEdit");
  }(e.ApplyWorkspaceEditRequest || (e.ApplyWorkspaceEditRequest = {}));
})(Qi);
var Ht = {};
Object.defineProperty(Ht, "__esModule", { value: !0 });
Ht.createProtocolConnection = void 0;
const ji = Qe;
function so(e, t, n, r) {
  return ji.ConnectionStrategy.is(r) && (r = { connectionStrategy: r }), (0, ji.createMessageConnection)(e, t, n, r);
}
Ht.createProtocolConnection = so;
(function(e) {
  var t = ie && ie.__createBinding || (Object.create ? function(i, o, a, u) {
    u === void 0 && (u = a);
    var c = Object.getOwnPropertyDescriptor(o, a);
    (!c || ("get" in c ? !o.__esModule : c.writable || c.configurable)) && (c = { enumerable: !0, get: function() {
      return o[a];
    } }), Object.defineProperty(i, u, c);
  } : function(i, o, a, u) {
    u === void 0 && (u = a), i[u] = o[a];
  }), n = ie && ie.__exportStar || function(i, o) {
    for (var a in i)
      a !== "default" && !Object.prototype.hasOwnProperty.call(o, a) && t(o, i, a);
  };
  Object.defineProperty(e, "__esModule", { value: !0 }), e.LSPErrorCodes = e.createProtocolConnection = void 0, n(Qe, e), n(pi, e), n(Y, e), n(Qi, e);
  var r = Ht;
  Object.defineProperty(e, "createProtocolConnection", { enumerable: !0, get: function() {
    return r.createProtocolConnection;
  } }), function(i) {
    i.lspReservedErrorRangeStart = -32899, i.RequestFailed = -32803, i.ServerCancelled = -32802, i.ContentModified = -32801, i.RequestCancelled = -32800, i.lspReservedErrorRangeEnd = -32800;
  }(e.LSPErrorCodes || (e.LSPErrorCodes = {}));
})(Ji);
(function(e) {
  var t = ie && ie.__createBinding || (Object.create ? function(o, a, u, c) {
    c === void 0 && (c = u);
    var d = Object.getOwnPropertyDescriptor(a, u);
    (!d || ("get" in d ? !a.__esModule : d.writable || d.configurable)) && (d = { enumerable: !0, get: function() {
      return a[u];
    } }), Object.defineProperty(o, c, d);
  } : function(o, a, u, c) {
    c === void 0 && (c = u), o[c] = a[u];
  }), n = ie && ie.__exportStar || function(o, a) {
    for (var u in o)
      u !== "default" && !Object.prototype.hasOwnProperty.call(a, u) && t(a, o, u);
  };
  Object.defineProperty(e, "__esModule", { value: !0 }), e.createProtocolConnection = void 0;
  const r = gn.exports;
  n(gn.exports, e), n(Ji, e);
  function i(o, a, u, c) {
    return (0, r.createMessageConnection)(o, a, u, c);
  }
  e.createProtocolConnection = i;
})(oe);
Object.defineProperty(Se, "__esModule", { value: !0 });
Se.SemanticTokensBuilder = Se.SemanticTokensDiff = Se.SemanticTokensFeature = void 0;
const St = oe, ao = (e) => class extends e {
  get semanticTokens() {
    return {
      refresh: () => this.connection.sendRequest(St.SemanticTokensRefreshRequest.type),
      on: (t) => {
        const n = St.SemanticTokensRequest.type;
        return this.connection.onRequest(n, (r, i) => t(r, i, this.attachWorkDoneProgress(r), this.attachPartialResultProgress(n, r)));
      },
      onDelta: (t) => {
        const n = St.SemanticTokensDeltaRequest.type;
        return this.connection.onRequest(n, (r, i) => t(r, i, this.attachWorkDoneProgress(r), this.attachPartialResultProgress(n, r)));
      },
      onRange: (t) => {
        const n = St.SemanticTokensRangeRequest.type;
        return this.connection.onRequest(n, (r, i) => t(r, i, this.attachWorkDoneProgress(r), this.attachPartialResultProgress(n, r)));
      }
    };
  }
};
Se.SemanticTokensFeature = ao;
class yr {
  constructor(t, n) {
    this.originalSequence = t, this.modifiedSequence = n;
  }
  computeDiff() {
    const t = this.originalSequence.length, n = this.modifiedSequence.length;
    let r = 0;
    for (; r < n && r < t && this.originalSequence[r] === this.modifiedSequence[r]; )
      r++;
    if (r < n && r < t) {
      let i = t - 1, o = n - 1;
      for (; i >= r && o >= r && this.originalSequence[i] === this.modifiedSequence[o]; )
        i--, o--;
      (i < r || o < r) && (i++, o++);
      const a = i - r + 1, u = this.modifiedSequence.slice(r, o + 1);
      return u.length === 1 && u[0] === this.originalSequence[i] ? [
        { start: r, deleteCount: a - 1 }
      ] : [
        { start: r, deleteCount: a, data: u }
      ];
    } else
      return r < n ? [
        { start: r, deleteCount: 0, data: this.modifiedSequence.slice(r) }
      ] : r < t ? [
        { start: r, deleteCount: t - r }
      ] : [];
  }
}
Se.SemanticTokensDiff = yr;
class co {
  constructor() {
    this._prevData = void 0, this.initialize();
  }
  initialize() {
    this._id = Date.now(), this._prevLine = 0, this._prevChar = 0, this._data = [], this._dataLen = 0;
  }
  push(t, n, r, i, o) {
    let a = t, u = n;
    this._dataLen > 0 && (a -= this._prevLine, a === 0 && (u -= this._prevChar)), this._data[this._dataLen++] = a, this._data[this._dataLen++] = u, this._data[this._dataLen++] = r, this._data[this._dataLen++] = i, this._data[this._dataLen++] = o, this._prevLine = t, this._prevChar = n;
  }
  get id() {
    return this._id.toString();
  }
  previousResult(t) {
    this.id === t && (this._prevData = this._data), this.initialize();
  }
  build() {
    return this._prevData = void 0, {
      resultId: this.id,
      data: this._data
    };
  }
  canBuildEdits() {
    return this._prevData !== void 0;
  }
  buildEdits() {
    return this._prevData !== void 0 ? {
      resultId: this.id,
      edits: new yr(this._prevData, this._data).computeDiff()
    } : this.build();
  }
}
Se.SemanticTokensBuilder = co;
var Dt = {};
Object.defineProperty(Dt, "__esModule", { value: !0 });
Dt.TextDocuments = void 0;
const Be = oe;
class uo {
  constructor(t) {
    this._configuration = t, this._syncedDocuments = /* @__PURE__ */ new Map(), this._onDidChangeContent = new Be.Emitter(), this._onDidOpen = new Be.Emitter(), this._onDidClose = new Be.Emitter(), this._onDidSave = new Be.Emitter(), this._onWillSave = new Be.Emitter();
  }
  get onDidOpen() {
    return this._onDidOpen.event;
  }
  get onDidChangeContent() {
    return this._onDidChangeContent.event;
  }
  get onWillSave() {
    return this._onWillSave.event;
  }
  onWillSaveWaitUntil(t) {
    this._willSaveWaitUntil = t;
  }
  get onDidSave() {
    return this._onDidSave.event;
  }
  get onDidClose() {
    return this._onDidClose.event;
  }
  get(t) {
    return this._syncedDocuments.get(t);
  }
  all() {
    return Array.from(this._syncedDocuments.values());
  }
  keys() {
    return Array.from(this._syncedDocuments.keys());
  }
  listen(t) {
    t.__textDocumentSync = Be.TextDocumentSyncKind.Incremental;
    const n = [];
    return n.push(t.onDidOpenTextDocument((r) => {
      const i = r.textDocument, o = this._configuration.create(i.uri, i.languageId, i.version, i.text);
      this._syncedDocuments.set(i.uri, o);
      const a = Object.freeze({ document: o });
      this._onDidOpen.fire(a), this._onDidChangeContent.fire(a);
    })), n.push(t.onDidChangeTextDocument((r) => {
      const i = r.textDocument, o = r.contentChanges;
      if (o.length === 0)
        return;
      const { version: a } = i;
      if (a == null)
        throw new Error(`Received document change event for ${i.uri} without valid version identifier`);
      let u = this._syncedDocuments.get(i.uri);
      u !== void 0 && (u = this._configuration.update(u, o, a), this._syncedDocuments.set(i.uri, u), this._onDidChangeContent.fire(Object.freeze({ document: u })));
    })), n.push(t.onDidCloseTextDocument((r) => {
      let i = this._syncedDocuments.get(r.textDocument.uri);
      i !== void 0 && (this._syncedDocuments.delete(r.textDocument.uri), this._onDidClose.fire(Object.freeze({ document: i })));
    })), n.push(t.onWillSaveTextDocument((r) => {
      let i = this._syncedDocuments.get(r.textDocument.uri);
      i !== void 0 && this._onWillSave.fire(Object.freeze({ document: i, reason: r.reason }));
    })), n.push(t.onWillSaveTextDocumentWaitUntil((r, i) => {
      let o = this._syncedDocuments.get(r.textDocument.uri);
      return o !== void 0 && this._willSaveWaitUntil ? this._willSaveWaitUntil(Object.freeze({ document: o, reason: r.reason }), i) : [];
    })), n.push(t.onDidSaveTextDocument((r) => {
      let i = this._syncedDocuments.get(r.textDocument.uri);
      i !== void 0 && this._onDidSave.fire(Object.freeze({ document: i }));
    })), Be.Disposable.create(() => {
      n.forEach((r) => r.dispose());
    });
  }
}
Dt.TextDocuments = uo;
var Je = {};
Object.defineProperty(Je, "__esModule", { value: !0 });
Je.NotebookDocuments = Je.NotebookSyncFeature = void 0;
const be = oe, Li = Dt, lo = (e) => class extends e {
  get synchronization() {
    return {
      onDidOpenNotebookDocument: (t) => this.connection.onNotification(be.DidOpenNotebookDocumentNotification.type, (n) => {
        t(n);
      }),
      onDidChangeNotebookDocument: (t) => this.connection.onNotification(be.DidChangeNotebookDocumentNotification.type, (n) => {
        t(n);
      }),
      onDidSaveNotebookDocument: (t) => this.connection.onNotification(be.DidSaveNotebookDocumentNotification.type, (n) => {
        t(n);
      }),
      onDidCloseNotebookDocument: (t) => this.connection.onNotification(be.DidCloseNotebookDocumentNotification.type, (n) => {
        t(n);
      })
    };
  }
};
Je.NotebookSyncFeature = lo;
class nt {
  onDidOpenTextDocument(t) {
    return this.openHandler = t, be.Disposable.create(() => {
      this.openHandler = void 0;
    });
  }
  openTextDocument(t) {
    this.openHandler && this.openHandler(t);
  }
  onDidChangeTextDocument(t) {
    return this.changeHandler = t, be.Disposable.create(() => {
      this.changeHandler = t;
    });
  }
  changeTextDocument(t) {
    this.changeHandler && this.changeHandler(t);
  }
  onDidCloseTextDocument(t) {
    return this.closeHandler = t, be.Disposable.create(() => {
      this.closeHandler = void 0;
    });
  }
  closeTextDocument(t) {
    this.closeHandler && this.closeHandler(t);
  }
  onWillSaveTextDocument() {
    return nt.NULL_DISPOSE;
  }
  onWillSaveTextDocumentWaitUntil() {
    return nt.NULL_DISPOSE;
  }
  onDidSaveTextDocument() {
    return nt.NULL_DISPOSE;
  }
}
nt.NULL_DISPOSE = Object.freeze({ dispose: () => {
} });
class fo {
  constructor(t) {
    t instanceof Li.TextDocuments ? this._cellTextDocuments = t : this._cellTextDocuments = new Li.TextDocuments(t), this.notebookDocuments = /* @__PURE__ */ new Map(), this.notebookCellMap = /* @__PURE__ */ new Map(), this._onDidOpen = new be.Emitter(), this._onDidChange = new be.Emitter(), this._onDidSave = new be.Emitter(), this._onDidClose = new be.Emitter();
  }
  get cellTextDocuments() {
    return this._cellTextDocuments;
  }
  getCellTextDocument(t) {
    return this._cellTextDocuments.get(t.document);
  }
  getNotebookDocument(t) {
    return this.notebookDocuments.get(t);
  }
  getNotebookCell(t) {
    const n = this.notebookCellMap.get(t);
    return n && n[0];
  }
  findNotebookDocumentForCell(t) {
    const n = typeof t == "string" ? t : t.document, r = this.notebookCellMap.get(n);
    return r && r[1];
  }
  get onDidOpen() {
    return this._onDidOpen.event;
  }
  get onDidSave() {
    return this._onDidSave.event;
  }
  get onDidChange() {
    return this._onDidChange.event;
  }
  get onDidClose() {
    return this._onDidClose.event;
  }
  listen(t) {
    const n = new nt(), r = [];
    return r.push(this.cellTextDocuments.listen(n)), r.push(t.notebooks.synchronization.onDidOpenNotebookDocument((i) => {
      this.notebookDocuments.set(i.notebookDocument.uri, i.notebookDocument);
      for (const o of i.cellTextDocuments)
        n.openTextDocument({ textDocument: o });
      this.updateCellMap(i.notebookDocument), this._onDidOpen.fire(i.notebookDocument);
    })), r.push(t.notebooks.synchronization.onDidChangeNotebookDocument((i) => {
      const o = this.notebookDocuments.get(i.notebookDocument.uri);
      if (o === void 0)
        return;
      o.version = i.notebookDocument.version;
      const a = o.metadata;
      let u = !1;
      const c = i.change;
      c.metadata !== void 0 && (u = !0, o.metadata = c.metadata);
      const d = [], y = [], v = [], m = [];
      if (c.cells !== void 0) {
        const M = c.cells;
        if (M.structure !== void 0) {
          const H = M.structure.array;
          if (o.cells.splice(H.start, H.deleteCount, ...H.cells !== void 0 ? H.cells : []), M.structure.didOpen !== void 0)
            for (const $ of M.structure.didOpen)
              n.openTextDocument({ textDocument: $ }), d.push($.uri);
          if (M.structure.didClose)
            for (const $ of M.structure.didClose)
              n.closeTextDocument({ textDocument: $ }), y.push($.uri);
        }
        if (M.data !== void 0) {
          const H = new Map(M.data.map(($) => [$.document, $]));
          for (let $ = 0; $ <= o.cells.length; $++) {
            const re = H.get(o.cells[$].document);
            if (re !== void 0) {
              const he = o.cells.splice($, 1, re);
              if (v.push({ old: he[0], new: re }), H.delete(re.document), H.size === 0)
                break;
            }
          }
        }
        if (M.textContent !== void 0)
          for (const H of M.textContent)
            n.changeTextDocument({ textDocument: H.document, contentChanges: H.changes }), m.push(H.document.uri);
      }
      this.updateCellMap(o);
      const g = { notebookDocument: o };
      u && (g.metadata = { old: a, new: o.metadata });
      const P = [];
      for (const M of d)
        P.push(this.getNotebookCell(M));
      const I = [];
      for (const M of y)
        I.push(this.getNotebookCell(M));
      const B = [];
      for (const M of m)
        B.push(this.getNotebookCell(M));
      (P.length > 0 || I.length > 0 || v.length > 0 || B.length > 0) && (g.cells = { added: P, removed: I, changed: { data: v, textContent: B } }), (g.metadata !== void 0 || g.cells !== void 0) && this._onDidChange.fire(g);
    })), r.push(t.notebooks.synchronization.onDidSaveNotebookDocument((i) => {
      const o = this.notebookDocuments.get(i.notebookDocument.uri);
      o !== void 0 && this._onDidSave.fire(o);
    })), r.push(t.notebooks.synchronization.onDidCloseNotebookDocument((i) => {
      const o = this.notebookDocuments.get(i.notebookDocument.uri);
      if (o !== void 0) {
        this._onDidClose.fire(o);
        for (const a of i.cellTextDocuments)
          n.closeTextDocument({ textDocument: a });
        this.notebookDocuments.delete(i.notebookDocument.uri);
        for (const a of o.cells)
          this.notebookCellMap.delete(a.document);
      }
    })), be.Disposable.create(() => {
      r.forEach((i) => i.dispose());
    });
  }
  updateCellMap(t) {
    for (const n of t.cells)
      this.notebookCellMap.set(n.document, [n, t]);
  }
}
Je.NotebookDocuments = fo;
var pr = {}, te = {};
Object.defineProperty(te, "__esModule", { value: !0 });
te.thenable = te.typedArray = te.stringArray = te.array = te.func = te.error = te.number = te.string = te.boolean = void 0;
function ho(e) {
  return e === !0 || e === !1;
}
te.boolean = ho;
function br(e) {
  return typeof e == "string" || e instanceof String;
}
te.string = br;
function go(e) {
  return typeof e == "number" || e instanceof Number;
}
te.number = go;
function mo(e) {
  return e instanceof Error;
}
te.error = mo;
function vr(e) {
  return typeof e == "function";
}
te.func = vr;
function _r(e) {
  return Array.isArray(e);
}
te.array = _r;
function yo(e) {
  return _r(e) && e.every((t) => br(t));
}
te.stringArray = yo;
function po(e, t) {
  return Array.isArray(e) && e.every(t);
}
te.typedArray = po;
function bo(e) {
  return e && vr(e.then);
}
te.thenable = bo;
var ge = {};
Object.defineProperty(ge, "__esModule", { value: !0 });
ge.generateUuid = ge.parse = ge.isUUID = ge.v4 = ge.empty = void 0;
class bi {
  constructor(t) {
    this._value = t;
  }
  asHex() {
    return this._value;
  }
  equals(t) {
    return this.asHex() === t.asHex();
  }
}
class L extends bi {
  constructor() {
    super([
      L._randomHex(),
      L._randomHex(),
      L._randomHex(),
      L._randomHex(),
      L._randomHex(),
      L._randomHex(),
      L._randomHex(),
      L._randomHex(),
      "-",
      L._randomHex(),
      L._randomHex(),
      L._randomHex(),
      L._randomHex(),
      "-",
      "4",
      L._randomHex(),
      L._randomHex(),
      L._randomHex(),
      "-",
      L._oneOf(L._timeHighBits),
      L._randomHex(),
      L._randomHex(),
      L._randomHex(),
      "-",
      L._randomHex(),
      L._randomHex(),
      L._randomHex(),
      L._randomHex(),
      L._randomHex(),
      L._randomHex(),
      L._randomHex(),
      L._randomHex(),
      L._randomHex(),
      L._randomHex(),
      L._randomHex(),
      L._randomHex()
    ].join(""));
  }
  static _oneOf(t) {
    return t[Math.floor(t.length * Math.random())];
  }
  static _randomHex() {
    return L._oneOf(L._chars);
  }
}
L._chars = ["0", "1", "2", "3", "4", "5", "6", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
L._timeHighBits = ["8", "9", "a", "b"];
ge.empty = new bi("00000000-0000-0000-0000-000000000000");
function Rr() {
  return new L();
}
ge.v4 = Rr;
const vo = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function Dr(e) {
  return vo.test(e);
}
ge.isUUID = Dr;
function _o(e) {
  if (!Dr(e))
    throw new Error("invalid uuid");
  return new bi(e);
}
ge.parse = _o;
function Ro() {
  return Rr().asHex();
}
ge.generateUuid = Ro;
var Ee = {};
Object.defineProperty(Ee, "__esModule", { value: !0 });
Ee.attachPartialResult = Ee.ProgressFeature = Ee.attachWorkDone = void 0;
const je = oe, Do = ge;
class Le {
  constructor(t, n) {
    this._connection = t, this._token = n, Le.Instances.set(this._token, this);
  }
  begin(t, n, r, i) {
    let o = {
      kind: "begin",
      title: t,
      percentage: n,
      message: r,
      cancellable: i
    };
    this._connection.sendProgress(je.WorkDoneProgress.type, this._token, o);
  }
  report(t, n) {
    let r = {
      kind: "report"
    };
    typeof t == "number" ? (r.percentage = t, n !== void 0 && (r.message = n)) : r.message = t, this._connection.sendProgress(je.WorkDoneProgress.type, this._token, r);
  }
  done() {
    Le.Instances.delete(this._token), this._connection.sendProgress(je.WorkDoneProgress.type, this._token, { kind: "end" });
  }
}
Le.Instances = /* @__PURE__ */ new Map();
class Fi extends Le {
  constructor(t, n) {
    super(t, n), this._source = new je.CancellationTokenSource();
  }
  get token() {
    return this._source.token;
  }
  done() {
    this._source.dispose(), super.done();
  }
  cancel() {
    this._source.cancel();
  }
}
class vi {
  constructor() {
  }
  begin() {
  }
  report() {
  }
  done() {
  }
}
class Ai extends vi {
  constructor() {
    super(), this._source = new je.CancellationTokenSource();
  }
  get token() {
    return this._source.token;
  }
  done() {
    this._source.dispose();
  }
  cancel() {
    this._source.cancel();
  }
}
function To(e, t) {
  if (t === void 0 || t.workDoneToken === void 0)
    return new vi();
  const n = t.workDoneToken;
  return delete t.workDoneToken, new Le(e, n);
}
Ee.attachWorkDone = To;
const wo = (e) => class extends e {
  constructor() {
    super(), this._progressSupported = !1;
  }
  initialize(t) {
    var n;
    super.initialize(t), ((n = t == null ? void 0 : t.window) == null ? void 0 : n.workDoneProgress) === !0 && (this._progressSupported = !0, this.connection.onNotification(je.WorkDoneProgressCancelNotification.type, (r) => {
      let i = Le.Instances.get(r.token);
      (i instanceof Fi || i instanceof Ai) && i.cancel();
    }));
  }
  attachWorkDoneProgress(t) {
    return t === void 0 ? new vi() : new Le(this.connection, t);
  }
  createWorkDoneProgress() {
    if (this._progressSupported) {
      const t = (0, Do.generateUuid)();
      return this.connection.sendRequest(je.WorkDoneProgressCreateRequest.type, { token: t }).then(() => new Fi(this.connection, t));
    } else
      return Promise.resolve(new Ai());
  }
};
Ee.ProgressFeature = wo;
var fi;
(function(e) {
  e.type = new je.ProgressType();
})(fi || (fi = {}));
class Po {
  constructor(t, n) {
    this._connection = t, this._token = n;
  }
  report(t) {
    this._connection.sendProgress(fi.type, this._token, t);
  }
}
function ko(e, t) {
  if (t === void 0 || t.partialResultToken === void 0)
    return;
  const n = t.partialResultToken;
  return delete t.partialResultToken, new Po(e, n);
}
Ee.attachPartialResult = ko;
var $t = {};
Object.defineProperty($t, "__esModule", { value: !0 });
$t.ConfigurationFeature = void 0;
const Co = oe, So = te, qo = (e) => class extends e {
  getConfiguration(t) {
    return t ? So.string(t) ? this._getConfiguration({ section: t }) : this._getConfiguration(t) : this._getConfiguration({});
  }
  _getConfiguration(t) {
    let n = {
      items: Array.isArray(t) ? t : [t]
    };
    return this.connection.sendRequest(Co.ConfigurationRequest.type, n).then((r) => Array.isArray(r) ? Array.isArray(t) ? r : r[0] : Array.isArray(t) ? [] : null);
  }
};
$t.ConfigurationFeature = qo;
var zt = {};
Object.defineProperty(zt, "__esModule", { value: !0 });
zt.WorkspaceFoldersFeature = void 0;
const qt = oe, No = (e) => class extends e {
  constructor() {
    super(), this._notificationIsAutoRegistered = !1;
  }
  initialize(t) {
    super.initialize(t);
    let n = t.workspace;
    n && n.workspaceFolders && (this._onDidChangeWorkspaceFolders = new qt.Emitter(), this.connection.onNotification(qt.DidChangeWorkspaceFoldersNotification.type, (r) => {
      this._onDidChangeWorkspaceFolders.fire(r.event);
    }));
  }
  fillServerCapabilities(t) {
    var r, i;
    super.fillServerCapabilities(t);
    const n = (i = (r = t.workspace) == null ? void 0 : r.workspaceFolders) == null ? void 0 : i.changeNotifications;
    this._notificationIsAutoRegistered = n === !0 || typeof n == "string";
  }
  getWorkspaceFolders() {
    return this.connection.sendRequest(qt.WorkspaceFoldersRequest.type);
  }
  get onDidChangeWorkspaceFolders() {
    if (!this._onDidChangeWorkspaceFolders)
      throw new Error("Client doesn't support sending workspace folder change events.");
    return !this._notificationIsAutoRegistered && !this._unregistration && (this._unregistration = this.connection.client.register(qt.DidChangeWorkspaceFoldersNotification.type)), this._onDidChangeWorkspaceFolders.event;
  }
};
zt.WorkspaceFoldersFeature = No;
var Bt = {};
Object.defineProperty(Bt, "__esModule", { value: !0 });
Bt.CallHierarchyFeature = void 0;
const ln = oe, Mo = (e) => class extends e {
  get callHierarchy() {
    return {
      onPrepare: (t) => this.connection.onRequest(ln.CallHierarchyPrepareRequest.type, (n, r) => t(n, r, this.attachWorkDoneProgress(n), void 0)),
      onIncomingCalls: (t) => {
        const n = ln.CallHierarchyIncomingCallsRequest.type;
        return this.connection.onRequest(n, (r, i) => t(r, i, this.attachWorkDoneProgress(r), this.attachPartialResultProgress(n, r)));
      },
      onOutgoingCalls: (t) => {
        const n = ln.CallHierarchyOutgoingCallsRequest.type;
        return this.connection.onRequest(n, (r, i) => t(r, i, this.attachWorkDoneProgress(r), this.attachPartialResultProgress(n, r)));
      }
    };
  }
};
Bt.CallHierarchyFeature = Mo;
var Ut = {};
Object.defineProperty(Ut, "__esModule", { value: !0 });
Ut.ShowDocumentFeature = void 0;
const Oo = oe, Eo = (e) => class extends e {
  showDocument(t) {
    return this.connection.sendRequest(Oo.ShowDocumentRequest.type, t);
  }
};
Ut.ShowDocumentFeature = Eo;
var Vt = {};
Object.defineProperty(Vt, "__esModule", { value: !0 });
Vt.FileOperationsFeature = void 0;
const xe = oe, jo = (e) => class extends e {
  onDidCreateFiles(t) {
    return this.connection.onNotification(xe.DidCreateFilesNotification.type, (n) => {
      t(n);
    });
  }
  onDidRenameFiles(t) {
    return this.connection.onNotification(xe.DidRenameFilesNotification.type, (n) => {
      t(n);
    });
  }
  onDidDeleteFiles(t) {
    return this.connection.onNotification(xe.DidDeleteFilesNotification.type, (n) => {
      t(n);
    });
  }
  onWillCreateFiles(t) {
    return this.connection.onRequest(xe.WillCreateFilesRequest.type, (n, r) => t(n, r));
  }
  onWillRenameFiles(t) {
    return this.connection.onRequest(xe.WillRenameFilesRequest.type, (n, r) => t(n, r));
  }
  onWillDeleteFiles(t) {
    return this.connection.onRequest(xe.WillDeleteFilesRequest.type, (n, r) => t(n, r));
  }
};
Vt.FileOperationsFeature = jo;
var Jt = {};
Object.defineProperty(Jt, "__esModule", { value: !0 });
Jt.LinkedEditingRangeFeature = void 0;
const Lo = oe, Fo = (e) => class extends e {
  onLinkedEditingRange(t) {
    return this.connection.onRequest(Lo.LinkedEditingRangeRequest.type, (n, r) => t(n, r, this.attachWorkDoneProgress(n), void 0));
  }
};
Jt.LinkedEditingRangeFeature = Fo;
var Qt = {};
Object.defineProperty(Qt, "__esModule", { value: !0 });
Qt.TypeHierarchyFeature = void 0;
const dn = oe, Ao = (e) => class extends e {
  get typeHierarchy() {
    return {
      onPrepare: (t) => this.connection.onRequest(dn.TypeHierarchyPrepareRequest.type, (n, r) => t(n, r, this.attachWorkDoneProgress(n), void 0)),
      onSupertypes: (t) => {
        const n = dn.TypeHierarchySupertypesRequest.type;
        return this.connection.onRequest(n, (r, i) => t(r, i, this.attachWorkDoneProgress(r), this.attachPartialResultProgress(n, r)));
      },
      onSubtypes: (t) => {
        const n = dn.TypeHierarchySubtypesRequest.type;
        return this.connection.onRequest(n, (r, i) => t(r, i, this.attachWorkDoneProgress(r), this.attachPartialResultProgress(n, r)));
      }
    };
  }
};
Qt.TypeHierarchyFeature = Ao;
var Xt = {};
Object.defineProperty(Xt, "__esModule", { value: !0 });
Xt.InlineValueFeature = void 0;
const Wi = oe, Wo = (e) => class extends e {
  get inlineValue() {
    return {
      refresh: () => this.connection.sendRequest(Wi.InlineValueRefreshRequest.type),
      on: (t) => this.connection.onRequest(Wi.InlineValueRequest.type, (n, r) => t(n, r, this.attachWorkDoneProgress(n)))
    };
  }
};
Xt.InlineValueFeature = Wo;
var Gt = {};
Object.defineProperty(Gt, "__esModule", { value: !0 });
Gt.InlayHintFeature = void 0;
const fn = oe, Io = (e) => class extends e {
  get inlayHint() {
    return {
      refresh: () => this.connection.sendRequest(fn.InlayHintRefreshRequest.type),
      on: (t) => this.connection.onRequest(fn.InlayHintRequest.type, (n, r) => t(n, r, this.attachWorkDoneProgress(n))),
      resolve: (t) => this.connection.onRequest(fn.InlayHintResolveRequest.type, (n, r) => t(n, r))
    };
  }
};
Gt.InlayHintFeature = Io;
var Yt = {};
Object.defineProperty(Yt, "__esModule", { value: !0 });
Yt.DiagnosticFeature = void 0;
const ft = oe, Ho = (e) => class extends e {
  get diagnostics() {
    return {
      refresh: () => this.connection.sendRequest(ft.DiagnosticRefreshRequest.type),
      on: (t) => this.connection.onRequest(ft.DocumentDiagnosticRequest.type, (n, r) => t(n, r, this.attachWorkDoneProgress(n), this.attachPartialResultProgress(ft.DocumentDiagnosticRequest.partialResult, n))),
      onWorkspace: (t) => this.connection.onRequest(ft.WorkspaceDiagnosticRequest.type, (n, r) => t(n, r, this.attachWorkDoneProgress(n), this.attachPartialResultProgress(ft.WorkspaceDiagnosticRequest.partialResult, n)))
    };
  }
};
Yt.DiagnosticFeature = Ho;
var Zt = {};
Object.defineProperty(Zt, "__esModule", { value: !0 });
Zt.MonikerFeature = void 0;
const $o = oe, zo = (e) => class extends e {
  get moniker() {
    return {
      on: (t) => {
        const n = $o.MonikerRequest.type;
        return this.connection.onRequest(n, (r, i) => t(r, i, this.attachWorkDoneProgress(r), this.attachPartialResultProgress(n, r)));
      }
    };
  }
};
Zt.MonikerFeature = zo;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.createConnection = e.combineFeatures = e.combineNotebooksFeatures = e.combineLanguagesFeatures = e.combineWorkspaceFeatures = e.combineWindowFeatures = e.combineClientFeatures = e.combineTracerFeatures = e.combineTelemetryFeatures = e.combineConsoleFeatures = e._NotebooksImpl = e._LanguagesImpl = e.BulkUnregistration = e.BulkRegistration = e.ErrorMessageTracker = void 0;
  const t = oe, n = te, r = ge, i = Ee, o = $t, a = zt, u = Bt, c = Se, d = Ut, y = Vt, v = Jt, m = Qt, g = Xt, P = Gt, I = Yt, B = Je, M = Zt;
  function H(q) {
    if (q !== null)
      return q;
  }
  class $ {
    constructor() {
      this._messages = /* @__PURE__ */ Object.create(null);
    }
    add(f) {
      let D = this._messages[f];
      D || (D = 0), D++, this._messages[f] = D;
    }
    sendErrors(f) {
      Object.keys(this._messages).forEach((D) => {
        f.window.showErrorMessage(D);
      });
    }
  }
  e.ErrorMessageTracker = $;
  class re {
    constructor() {
    }
    rawAttach(f) {
      this._rawConnection = f;
    }
    attach(f) {
      this._connection = f;
    }
    get connection() {
      if (!this._connection)
        throw new Error("Remote is not attached to a connection yet.");
      return this._connection;
    }
    fillServerCapabilities(f) {
    }
    initialize(f) {
    }
    error(f) {
      this.send(t.MessageType.Error, f);
    }
    warn(f) {
      this.send(t.MessageType.Warning, f);
    }
    info(f) {
      this.send(t.MessageType.Info, f);
    }
    log(f) {
      this.send(t.MessageType.Log, f);
    }
    send(f, D) {
      this._rawConnection && this._rawConnection.sendNotification(t.LogMessageNotification.type, { type: f, message: D }).catch(() => {
        (0, t.RAL)().console.error("Sending log message failed");
      });
    }
  }
  class he {
    constructor() {
    }
    attach(f) {
      this._connection = f;
    }
    get connection() {
      if (!this._connection)
        throw new Error("Remote is not attached to a connection yet.");
      return this._connection;
    }
    initialize(f) {
    }
    fillServerCapabilities(f) {
    }
    showErrorMessage(f, ...D) {
      let O = { type: t.MessageType.Error, message: f, actions: D };
      return this.connection.sendRequest(t.ShowMessageRequest.type, O).then(H);
    }
    showWarningMessage(f, ...D) {
      let O = { type: t.MessageType.Warning, message: f, actions: D };
      return this.connection.sendRequest(t.ShowMessageRequest.type, O).then(H);
    }
    showInformationMessage(f, ...D) {
      let O = { type: t.MessageType.Info, message: f, actions: D };
      return this.connection.sendRequest(t.ShowMessageRequest.type, O).then(H);
    }
  }
  const Z = (0, d.ShowDocumentFeature)((0, i.ProgressFeature)(he));
  (function(q) {
    function f() {
      return new ae();
    }
    q.create = f;
  })(e.BulkRegistration || (e.BulkRegistration = {}));
  class ae {
    constructor() {
      this._registrations = [], this._registered = /* @__PURE__ */ new Set();
    }
    add(f, D) {
      const O = n.string(f) ? f : f.method;
      if (this._registered.has(O))
        throw new Error(`${O} is already added to this registration`);
      const p = r.generateUuid();
      this._registrations.push({
        id: p,
        method: O,
        registerOptions: D || {}
      }), this._registered.add(O);
    }
    asRegistrationParams() {
      return {
        registrations: this._registrations
      };
    }
  }
  (function(q) {
    function f() {
      return new T(void 0, []);
    }
    q.create = f;
  })(e.BulkUnregistration || (e.BulkUnregistration = {}));
  class T {
    constructor(f, D) {
      this._connection = f, this._unregistrations = /* @__PURE__ */ new Map(), D.forEach((O) => {
        this._unregistrations.set(O.method, O);
      });
    }
    get isAttached() {
      return !!this._connection;
    }
    attach(f) {
      this._connection = f;
    }
    add(f) {
      this._unregistrations.set(f.method, f);
    }
    dispose() {
      let f = [];
      for (let O of this._unregistrations.values())
        f.push(O);
      let D = {
        unregisterations: f
      };
      this._connection.sendRequest(t.UnregistrationRequest.type, D).catch(() => {
        this._connection.console.info("Bulk unregistration failed.");
      });
    }
    disposeSingle(f) {
      const D = n.string(f) ? f : f.method, O = this._unregistrations.get(D);
      if (!O)
        return !1;
      let p = {
        unregisterations: [O]
      };
      return this._connection.sendRequest(t.UnregistrationRequest.type, p).then(() => {
        this._unregistrations.delete(D);
      }, (ce) => {
        this._connection.console.info(`Un-registering request handler for ${O.id} failed.`);
      }), !0;
    }
  }
  class j {
    attach(f) {
      this._connection = f;
    }
    get connection() {
      if (!this._connection)
        throw new Error("Remote is not attached to a connection yet.");
      return this._connection;
    }
    initialize(f) {
    }
    fillServerCapabilities(f) {
    }
    register(f, D, O) {
      return f instanceof ae ? this.registerMany(f) : f instanceof T ? this.registerSingle1(f, D, O) : this.registerSingle2(f, D);
    }
    registerSingle1(f, D, O) {
      const p = n.string(D) ? D : D.method, ce = r.generateUuid();
      let me = {
        registrations: [{ id: ce, method: p, registerOptions: O || {} }]
      };
      return f.isAttached || f.attach(this.connection), this.connection.sendRequest(t.RegistrationRequest.type, me).then((Ne) => (f.add({ id: ce, method: p }), f), (Ne) => (this.connection.console.info(`Registering request handler for ${p} failed.`), Promise.reject(Ne)));
    }
    registerSingle2(f, D) {
      const O = n.string(f) ? f : f.method, p = r.generateUuid();
      let ce = {
        registrations: [{ id: p, method: O, registerOptions: D || {} }]
      };
      return this.connection.sendRequest(t.RegistrationRequest.type, ce).then((me) => t.Disposable.create(() => {
        this.unregisterSingle(p, O).catch(() => {
          this.connection.console.info(`Un-registering capability with id ${p} failed.`);
        });
      }), (me) => (this.connection.console.info(`Registering request handler for ${O} failed.`), Promise.reject(me)));
    }
    unregisterSingle(f, D) {
      let O = {
        unregisterations: [{ id: f, method: D }]
      };
      return this.connection.sendRequest(t.UnregistrationRequest.type, O).catch(() => {
        this.connection.console.info(`Un-registering request handler for ${f} failed.`);
      });
    }
    registerMany(f) {
      let D = f.asRegistrationParams();
      return this.connection.sendRequest(t.RegistrationRequest.type, D).then(() => new T(this._connection, D.registrations.map((O) => ({ id: O.id, method: O.method }))), (O) => (this.connection.console.info("Bulk registration failed."), Promise.reject(O)));
    }
  }
  class F {
    constructor() {
    }
    attach(f) {
      this._connection = f;
    }
    get connection() {
      if (!this._connection)
        throw new Error("Remote is not attached to a connection yet.");
      return this._connection;
    }
    initialize(f) {
    }
    fillServerCapabilities(f) {
    }
    applyEdit(f) {
      function D(p) {
        return p && !!p.edit;
      }
      let O = D(f) ? f : { edit: f };
      return this.connection.sendRequest(t.ApplyWorkspaceEditRequest.type, O);
    }
  }
  const E = (0, y.FileOperationsFeature)((0, a.WorkspaceFoldersFeature)((0, o.ConfigurationFeature)(F)));
  class s {
    constructor() {
      this._trace = t.Trace.Off;
    }
    attach(f) {
      this._connection = f;
    }
    get connection() {
      if (!this._connection)
        throw new Error("Remote is not attached to a connection yet.");
      return this._connection;
    }
    initialize(f) {
    }
    fillServerCapabilities(f) {
    }
    set trace(f) {
      this._trace = f;
    }
    log(f, D) {
      this._trace !== t.Trace.Off && this.connection.sendNotification(t.LogTraceNotification.type, {
        message: f,
        verbose: this._trace === t.Trace.Verbose ? D : void 0
      }).catch(() => {
      });
    }
  }
  class w {
    constructor() {
    }
    attach(f) {
      this._connection = f;
    }
    get connection() {
      if (!this._connection)
        throw new Error("Remote is not attached to a connection yet.");
      return this._connection;
    }
    initialize(f) {
    }
    fillServerCapabilities(f) {
    }
    logEvent(f) {
      this.connection.sendNotification(t.TelemetryEventNotification.type, f).catch(() => {
        this.connection.console.log("Sending TelemetryEventNotification failed");
      });
    }
  }
  class A {
    constructor() {
    }
    attach(f) {
      this._connection = f;
    }
    get connection() {
      if (!this._connection)
        throw new Error("Remote is not attached to a connection yet.");
      return this._connection;
    }
    initialize(f) {
    }
    fillServerCapabilities(f) {
    }
    attachWorkDoneProgress(f) {
      return (0, i.attachWorkDone)(this.connection, f);
    }
    attachPartialResultProgress(f, D) {
      return (0, i.attachPartialResult)(this.connection, D);
    }
  }
  e._LanguagesImpl = A;
  const N = (0, M.MonikerFeature)((0, I.DiagnosticFeature)((0, P.InlayHintFeature)((0, g.InlineValueFeature)((0, m.TypeHierarchyFeature)((0, v.LinkedEditingRangeFeature)((0, c.SemanticTokensFeature)((0, u.CallHierarchyFeature)(A))))))));
  class W {
    constructor() {
    }
    attach(f) {
      this._connection = f;
    }
    get connection() {
      if (!this._connection)
        throw new Error("Remote is not attached to a connection yet.");
      return this._connection;
    }
    initialize(f) {
    }
    fillServerCapabilities(f) {
    }
    attachWorkDoneProgress(f) {
      return (0, i.attachWorkDone)(this.connection, f);
    }
    attachPartialResultProgress(f, D) {
      return (0, i.attachPartialResult)(this.connection, D);
    }
  }
  e._NotebooksImpl = W;
  const G = (0, B.NotebookSyncFeature)(W);
  function Fe(q, f) {
    return function(D) {
      return f(q(D));
    };
  }
  e.combineConsoleFeatures = Fe;
  function qe(q, f) {
    return function(D) {
      return f(q(D));
    };
  }
  e.combineTelemetryFeatures = qe;
  function Ae(q, f) {
    return function(D) {
      return f(q(D));
    };
  }
  e.combineTracerFeatures = Ae;
  function We(q, f) {
    return function(D) {
      return f(q(D));
    };
  }
  e.combineClientFeatures = We;
  function Ge(q, f) {
    return function(D) {
      return f(q(D));
    };
  }
  e.combineWindowFeatures = Ge;
  function De(q, f) {
    return function(D) {
      return f(q(D));
    };
  }
  e.combineWorkspaceFeatures = De;
  function Te(q, f) {
    return function(D) {
      return f(q(D));
    };
  }
  e.combineLanguagesFeatures = Te;
  function Ie(q, f) {
    return function(D) {
      return f(q(D));
    };
  }
  e.combineNotebooksFeatures = Ie;
  function ve(q, f) {
    function D(p, ce, me) {
      return p && ce ? me(p, ce) : p || ce;
    }
    return {
      __brand: "features",
      console: D(q.console, f.console, Fe),
      tracer: D(q.tracer, f.tracer, Ae),
      telemetry: D(q.telemetry, f.telemetry, qe),
      client: D(q.client, f.client, We),
      window: D(q.window, f.window, Ge),
      workspace: D(q.workspace, f.workspace, De),
      languages: D(q.languages, f.languages, Te),
      notebooks: D(q.notebooks, f.notebooks, Ie)
    };
  }
  e.combineFeatures = ve;
  function U(q, f, D) {
    const O = D && D.console ? new (D.console(re))() : new re(), p = q(O);
    O.rawAttach(p);
    const ce = D && D.tracer ? new (D.tracer(s))() : new s(), me = D && D.telemetry ? new (D.telemetry(w))() : new w(), Ne = D && D.client ? new (D.client(j))() : new j(), He = D && D.window ? new (D.window(Z))() : new Z(), ct = D && D.workspace ? new (D.workspace(E))() : new E(), wt = D && D.languages ? new (D.languages(N))() : new N(), Pt = D && D.notebooks ? new (D.notebooks(G))() : new G(), Ye = [O, ce, me, Ne, He, ct, wt, Pt];
    function Kt(b) {
      return b instanceof Promise ? b : n.thenable(b) ? new Promise((_, C) => {
        b.then((Re) => _(Re), (Re) => C(Re));
      }) : Promise.resolve(b);
    }
    let $e, ze, _e, ke = {
      listen: () => p.listen(),
      sendRequest: (b, ..._) => p.sendRequest(n.string(b) ? b : b.method, ..._),
      onRequest: (b, _) => p.onRequest(b, _),
      sendNotification: (b, _) => {
        const C = n.string(b) ? b : b.method;
        return arguments.length === 1 ? p.sendNotification(C) : p.sendNotification(C, _);
      },
      onNotification: (b, _) => p.onNotification(b, _),
      onProgress: p.onProgress,
      sendProgress: p.sendProgress,
      onInitialize: (b) => (ze = b, {
        dispose: () => {
          ze = void 0;
        }
      }),
      onInitialized: (b) => p.onNotification(t.InitializedNotification.type, b),
      onShutdown: (b) => ($e = b, {
        dispose: () => {
          $e = void 0;
        }
      }),
      onExit: (b) => (_e = b, {
        dispose: () => {
          _e = void 0;
        }
      }),
      get console() {
        return O;
      },
      get telemetry() {
        return me;
      },
      get tracer() {
        return ce;
      },
      get client() {
        return Ne;
      },
      get window() {
        return He;
      },
      get workspace() {
        return ct;
      },
      get languages() {
        return wt;
      },
      get notebooks() {
        return Pt;
      },
      onDidChangeConfiguration: (b) => p.onNotification(t.DidChangeConfigurationNotification.type, b),
      onDidChangeWatchedFiles: (b) => p.onNotification(t.DidChangeWatchedFilesNotification.type, b),
      __textDocumentSync: void 0,
      onDidOpenTextDocument: (b) => p.onNotification(t.DidOpenTextDocumentNotification.type, b),
      onDidChangeTextDocument: (b) => p.onNotification(t.DidChangeTextDocumentNotification.type, b),
      onDidCloseTextDocument: (b) => p.onNotification(t.DidCloseTextDocumentNotification.type, b),
      onWillSaveTextDocument: (b) => p.onNotification(t.WillSaveTextDocumentNotification.type, b),
      onWillSaveTextDocumentWaitUntil: (b) => p.onRequest(t.WillSaveTextDocumentWaitUntilRequest.type, b),
      onDidSaveTextDocument: (b) => p.onNotification(t.DidSaveTextDocumentNotification.type, b),
      sendDiagnostics: (b) => p.sendNotification(t.PublishDiagnosticsNotification.type, b),
      onHover: (b) => p.onRequest(t.HoverRequest.type, (_, C) => b(_, C, (0, i.attachWorkDone)(p, _), void 0)),
      onCompletion: (b) => p.onRequest(t.CompletionRequest.type, (_, C) => b(_, C, (0, i.attachWorkDone)(p, _), (0, i.attachPartialResult)(p, _))),
      onCompletionResolve: (b) => p.onRequest(t.CompletionResolveRequest.type, b),
      onSignatureHelp: (b) => p.onRequest(t.SignatureHelpRequest.type, (_, C) => b(_, C, (0, i.attachWorkDone)(p, _), void 0)),
      onDeclaration: (b) => p.onRequest(t.DeclarationRequest.type, (_, C) => b(_, C, (0, i.attachWorkDone)(p, _), (0, i.attachPartialResult)(p, _))),
      onDefinition: (b) => p.onRequest(t.DefinitionRequest.type, (_, C) => b(_, C, (0, i.attachWorkDone)(p, _), (0, i.attachPartialResult)(p, _))),
      onTypeDefinition: (b) => p.onRequest(t.TypeDefinitionRequest.type, (_, C) => b(_, C, (0, i.attachWorkDone)(p, _), (0, i.attachPartialResult)(p, _))),
      onImplementation: (b) => p.onRequest(t.ImplementationRequest.type, (_, C) => b(_, C, (0, i.attachWorkDone)(p, _), (0, i.attachPartialResult)(p, _))),
      onReferences: (b) => p.onRequest(t.ReferencesRequest.type, (_, C) => b(_, C, (0, i.attachWorkDone)(p, _), (0, i.attachPartialResult)(p, _))),
      onDocumentHighlight: (b) => p.onRequest(t.DocumentHighlightRequest.type, (_, C) => b(_, C, (0, i.attachWorkDone)(p, _), (0, i.attachPartialResult)(p, _))),
      onDocumentSymbol: (b) => p.onRequest(t.DocumentSymbolRequest.type, (_, C) => b(_, C, (0, i.attachWorkDone)(p, _), (0, i.attachPartialResult)(p, _))),
      onWorkspaceSymbol: (b) => p.onRequest(t.WorkspaceSymbolRequest.type, (_, C) => b(_, C, (0, i.attachWorkDone)(p, _), (0, i.attachPartialResult)(p, _))),
      onWorkspaceSymbolResolve: (b) => p.onRequest(t.WorkspaceSymbolResolveRequest.type, b),
      onCodeAction: (b) => p.onRequest(t.CodeActionRequest.type, (_, C) => b(_, C, (0, i.attachWorkDone)(p, _), (0, i.attachPartialResult)(p, _))),
      onCodeActionResolve: (b) => p.onRequest(t.CodeActionResolveRequest.type, (_, C) => b(_, C)),
      onCodeLens: (b) => p.onRequest(t.CodeLensRequest.type, (_, C) => b(_, C, (0, i.attachWorkDone)(p, _), (0, i.attachPartialResult)(p, _))),
      onCodeLensResolve: (b) => p.onRequest(t.CodeLensResolveRequest.type, (_, C) => b(_, C)),
      onDocumentFormatting: (b) => p.onRequest(t.DocumentFormattingRequest.type, (_, C) => b(_, C, (0, i.attachWorkDone)(p, _), void 0)),
      onDocumentRangeFormatting: (b) => p.onRequest(t.DocumentRangeFormattingRequest.type, (_, C) => b(_, C, (0, i.attachWorkDone)(p, _), void 0)),
      onDocumentOnTypeFormatting: (b) => p.onRequest(t.DocumentOnTypeFormattingRequest.type, (_, C) => b(_, C)),
      onRenameRequest: (b) => p.onRequest(t.RenameRequest.type, (_, C) => b(_, C, (0, i.attachWorkDone)(p, _), void 0)),
      onPrepareRename: (b) => p.onRequest(t.PrepareRenameRequest.type, (_, C) => b(_, C)),
      onDocumentLinks: (b) => p.onRequest(t.DocumentLinkRequest.type, (_, C) => b(_, C, (0, i.attachWorkDone)(p, _), (0, i.attachPartialResult)(p, _))),
      onDocumentLinkResolve: (b) => p.onRequest(t.DocumentLinkResolveRequest.type, (_, C) => b(_, C)),
      onDocumentColor: (b) => p.onRequest(t.DocumentColorRequest.type, (_, C) => b(_, C, (0, i.attachWorkDone)(p, _), (0, i.attachPartialResult)(p, _))),
      onColorPresentation: (b) => p.onRequest(t.ColorPresentationRequest.type, (_, C) => b(_, C, (0, i.attachWorkDone)(p, _), (0, i.attachPartialResult)(p, _))),
      onFoldingRanges: (b) => p.onRequest(t.FoldingRangeRequest.type, (_, C) => b(_, C, (0, i.attachWorkDone)(p, _), (0, i.attachPartialResult)(p, _))),
      onSelectionRanges: (b) => p.onRequest(t.SelectionRangeRequest.type, (_, C) => b(_, C, (0, i.attachWorkDone)(p, _), (0, i.attachPartialResult)(p, _))),
      onExecuteCommand: (b) => p.onRequest(t.ExecuteCommandRequest.type, (_, C) => b(_, C, (0, i.attachWorkDone)(p, _), void 0)),
      dispose: () => p.dispose()
    };
    for (let b of Ye)
      b.attach(ke);
    return p.onRequest(t.InitializeRequest.type, (b) => {
      f.initialize(b), n.string(b.trace) && (ce.trace = t.Trace.fromString(b.trace));
      for (let _ of Ye)
        _.initialize(b.capabilities);
      if (ze) {
        let _ = ze(b, new t.CancellationTokenSource().token, (0, i.attachWorkDone)(p, b), void 0);
        return Kt(_).then((C) => {
          if (C instanceof t.ResponseError)
            return C;
          let Re = C;
          Re || (Re = { capabilities: {} });
          let ye = Re.capabilities;
          ye || (ye = {}, Re.capabilities = ye), ye.textDocumentSync === void 0 || ye.textDocumentSync === null ? ye.textDocumentSync = n.number(ke.__textDocumentSync) ? ke.__textDocumentSync : t.TextDocumentSyncKind.None : !n.number(ye.textDocumentSync) && !n.number(ye.textDocumentSync.change) && (ye.textDocumentSync.change = n.number(ke.__textDocumentSync) ? ke.__textDocumentSync : t.TextDocumentSyncKind.None);
          for (let xt of Ye)
            xt.fillServerCapabilities(ye);
          return Re;
        });
      } else {
        let _ = { capabilities: { textDocumentSync: t.TextDocumentSyncKind.None } };
        for (let C of Ye)
          C.fillServerCapabilities(_.capabilities);
        return _;
      }
    }), p.onRequest(t.ShutdownRequest.type, () => {
      if (f.shutdownReceived = !0, $e)
        return $e(new t.CancellationTokenSource().token);
    }), p.onNotification(t.ExitNotification.type, () => {
      try {
        _e && _e();
      } finally {
        f.shutdownReceived ? f.exit(0) : f.exit(1);
      }
    }), p.onNotification(t.SetTraceNotification.type, (b) => {
      ce.trace = t.Trace.fromString(b.value);
    }), ke;
  }
  e.createConnection = U;
})(pr);
(function(e) {
  var t = ie && ie.__createBinding || (Object.create ? function(a, u, c, d) {
    d === void 0 && (d = c);
    var y = Object.getOwnPropertyDescriptor(u, c);
    (!y || ("get" in y ? !u.__esModule : y.writable || y.configurable)) && (y = { enumerable: !0, get: function() {
      return u[c];
    } }), Object.defineProperty(a, d, y);
  } : function(a, u, c, d) {
    d === void 0 && (d = c), a[d] = u[c];
  }), n = ie && ie.__exportStar || function(a, u) {
    for (var c in a)
      c !== "default" && !Object.prototype.hasOwnProperty.call(u, c) && t(u, a, c);
  };
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ProposedFeatures = e.NotebookDocuments = e.TextDocuments = e.SemanticTokensBuilder = void 0;
  const r = Se;
  Object.defineProperty(e, "SemanticTokensBuilder", { enumerable: !0, get: function() {
    return r.SemanticTokensBuilder;
  } }), n(oe, e);
  const i = Dt;
  Object.defineProperty(e, "TextDocuments", { enumerable: !0, get: function() {
    return i.TextDocuments;
  } });
  const o = Je;
  Object.defineProperty(e, "NotebookDocuments", { enumerable: !0, get: function() {
    return o.NotebookDocuments;
  } }), n(pr, e), function(a) {
    a.all = {
      __brand: "features"
    };
  }(e.ProposedFeatures || (e.ProposedFeatures = {}));
})(hn);
var Tr = { exports: {} };
(function(e) {
  e.exports = oe;
})(Tr);
(function(e) {
  var t = ie && ie.__createBinding || (Object.create ? function(u, c, d, y) {
    y === void 0 && (y = d);
    var v = Object.getOwnPropertyDescriptor(c, d);
    (!v || ("get" in v ? !c.__esModule : v.writable || v.configurable)) && (v = { enumerable: !0, get: function() {
      return c[d];
    } }), Object.defineProperty(u, y, v);
  } : function(u, c, d, y) {
    y === void 0 && (y = d), u[y] = c[d];
  }), n = ie && ie.__exportStar || function(u, c) {
    for (var d in u)
      d !== "default" && !Object.prototype.hasOwnProperty.call(c, d) && t(c, u, d);
  };
  Object.defineProperty(e, "__esModule", { value: !0 }), e.createConnection = void 0;
  const r = hn;
  n(Tr.exports, e), n(hn, e);
  let i = !1;
  const o = {
    initialize: (u) => {
    },
    get shutdownReceived() {
      return i;
    },
    set shutdownReceived(u) {
      i = u;
    },
    exit: (u) => {
    }
  };
  function a(u, c, d, y) {
    let v, m, g, P;
    u !== void 0 && u.__brand === "features" && (v = u, u = c, c = d, d = y), r.ConnectionStrategy.is(u) || r.ConnectionOptions.is(u) ? P = u : (m = u, g = c, P = d);
    const I = (B) => (0, r.createProtocolConnection)(m, g, B, P);
    return (0, r.createConnection)(I, o, v);
  }
  e.createConnection = a;
})(at);
(function(e) {
  e.exports = at;
})(At);
class _t {
  constructor(t, n, r, i) {
    this._uri = t, this._languageId = n, this._version = r, this._content = i, this._lineOffsets = void 0;
  }
  get uri() {
    return this._uri;
  }
  get languageId() {
    return this._languageId;
  }
  get version() {
    return this._version;
  }
  getText(t) {
    if (t) {
      const n = this.offsetAt(t.start), r = this.offsetAt(t.end);
      return this._content.substring(n, r);
    }
    return this._content;
  }
  update(t, n) {
    for (let r of t)
      if (_t.isIncremental(r)) {
        const i = wr(r.range), o = this.offsetAt(i.start), a = this.offsetAt(i.end);
        this._content = this._content.substring(0, o) + r.text + this._content.substring(a, this._content.length);
        const u = Math.max(i.start.line, 0), c = Math.max(i.end.line, 0);
        let d = this._lineOffsets;
        const y = Ii(r.text, !1, o);
        if (c - u === y.length)
          for (let m = 0, g = y.length; m < g; m++)
            d[m + u + 1] = y[m];
        else
          y.length < 1e4 ? d.splice(u + 1, c - u, ...y) : this._lineOffsets = d = d.slice(0, u + 1).concat(y, d.slice(c + 1));
        const v = r.text.length - (a - o);
        if (v !== 0)
          for (let m = u + 1 + y.length, g = d.length; m < g; m++)
            d[m] = d[m] + v;
      } else if (_t.isFull(r))
        this._content = r.text, this._lineOffsets = void 0;
      else
        throw new Error("Unknown change event received");
    this._version = n;
  }
  getLineOffsets() {
    return this._lineOffsets === void 0 && (this._lineOffsets = Ii(this._content, !0)), this._lineOffsets;
  }
  positionAt(t) {
    t = Math.max(Math.min(t, this._content.length), 0);
    let n = this.getLineOffsets(), r = 0, i = n.length;
    if (i === 0)
      return { line: 0, character: t };
    for (; r < i; ) {
      let a = Math.floor((r + i) / 2);
      n[a] > t ? i = a : r = a + 1;
    }
    let o = r - 1;
    return { line: o, character: t - n[o] };
  }
  offsetAt(t) {
    let n = this.getLineOffsets();
    if (t.line >= n.length)
      return this._content.length;
    if (t.line < 0)
      return 0;
    let r = n[t.line], i = t.line + 1 < n.length ? n[t.line + 1] : this._content.length;
    return Math.max(Math.min(r + t.character, i), r);
  }
  get lineCount() {
    return this.getLineOffsets().length;
  }
  static isIncremental(t) {
    let n = t;
    return n != null && typeof n.text == "string" && n.range !== void 0 && (n.rangeLength === void 0 || typeof n.rangeLength == "number");
  }
  static isFull(t) {
    let n = t;
    return n != null && typeof n.text == "string" && n.range === void 0 && n.rangeLength === void 0;
  }
}
var hi;
(function(e) {
  function t(i, o, a, u) {
    return new _t(i, o, a, u);
  }
  e.create = t;
  function n(i, o, a) {
    if (i instanceof _t)
      return i.update(o, a), i;
    throw new Error("TextDocument.update: document must be created by TextDocument.create");
  }
  e.update = n;
  function r(i, o) {
    let a = i.getText(), u = gi(o.map(Bo), (y, v) => {
      let m = y.range.start.line - v.range.start.line;
      return m === 0 ? y.range.start.character - v.range.start.character : m;
    }), c = 0;
    const d = [];
    for (const y of u) {
      let v = i.offsetAt(y.range.start);
      if (v < c)
        throw new Error("Overlapping edit");
      v > c && d.push(a.substring(c, v)), y.newText.length && d.push(y.newText), c = i.offsetAt(y.range.end);
    }
    return d.push(a.substr(c)), d.join("");
  }
  e.applyEdits = r;
})(hi || (hi = {}));
function gi(e, t) {
  if (e.length <= 1)
    return e;
  const n = e.length / 2 | 0, r = e.slice(0, n), i = e.slice(n);
  gi(r, t), gi(i, t);
  let o = 0, a = 0, u = 0;
  for (; o < r.length && a < i.length; )
    t(r[o], i[a]) <= 0 ? e[u++] = r[o++] : e[u++] = i[a++];
  for (; o < r.length; )
    e[u++] = r[o++];
  for (; a < i.length; )
    e[u++] = i[a++];
  return e;
}
function Ii(e, t, n = 0) {
  const r = t ? [n] : [];
  for (let i = 0; i < e.length; i++) {
    let o = e.charCodeAt(i);
    (o === 13 || o === 10) && (o === 13 && i + 1 < e.length && e.charCodeAt(i + 1) === 10 && i++, r.push(n + i + 1));
  }
  return r;
}
function wr(e) {
  const t = e.start, n = e.end;
  return t.line > n.line || t.line === n.line && t.character > n.character ? { start: n, end: t } : e;
}
function Bo(e) {
  const t = wr(e.range);
  return t !== e.range ? { newText: e.newText, range: t } : e;
}
console.log("running server lsp-web-extension-sample");
const Uo = new At.exports.BrowserMessageReader(self), Vo = new At.exports.BrowserMessageWriter(self);
self.onmessage((e) => {
  console.log("onmessage", e);
});
const Tt = At.exports.createConnection(Uo, Vo);
Tt.onInitialize((e) => (console.log("onInitialize", e), { capabilities: {
  colorProvider: {}
} }));
const Pr = new at.TextDocuments(hi);
Pr.listen(Tt);
Tt.onDocumentColor((e) => (console.log("onDocumentColor", e), Jo(e.textDocument)));
Tt.onColorPresentation((e) => (console.log("onColorPresentation", e), Qo(e.color, e.range)));
Tt.listen();
const Hi = /#([0-9A-Fa-f]{6})/g;
function Jo(e) {
  const t = [], n = Pr.get(e.uri);
  if (n) {
    const r = n.getText();
    Hi.lastIndex = 0;
    let i;
    for (; (i = Hi.exec(r)) != null; ) {
      const o = i.index, a = i[0].length, u = at.Range.create(n.positionAt(o), n.positionAt(o + a)), c = Xo(r, o);
      t.push({ color: c, range: u });
    }
  }
  return t;
}
function Qo(e, t) {
  const n = [], r = Math.round(e.red * 255), i = Math.round(e.green * 255), o = Math.round(e.blue * 255);
  function a(c) {
    const d = c.toString(16);
    return d.length !== 2 ? "0" + d : d;
  }
  const u = `#${a(r)}${a(i)}${a(o)}`;
  return n.push({ label: u, textEdit: at.TextEdit.replace(t, u) }), n;
}
function et(e) {
  return e >= 48 && e <= 57 ? e - 48 : e >= 65 && e <= 70 ? e - 65 + 10 : e >= 97 && e <= 102 ? e - 97 + 10 : 0;
}
function Xo(e, t) {
  const n = (16 * et(e.charCodeAt(t + 1)) + et(e.charCodeAt(t + 2))) / 255, r = (16 * et(e.charCodeAt(t + 3)) + et(e.charCodeAt(t + 4))) / 255, i = (16 * et(e.charCodeAt(t + 5)) + et(e.charCodeAt(t + 6))) / 255;
  return at.Color.create(n, r, i, 1);
}
