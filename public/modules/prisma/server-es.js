var GA = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function iE(A) {
  return A && A.__esModule && Object.prototype.hasOwnProperty.call(A, "default") ? A.default : A;
}
function wE(A) {
  if (A.__esModule)
    return A;
  var I = A.default;
  if (typeof I == "function") {
    var g = function Q() {
      return this instanceof Q ? Reflect.construct(I, arguments, this.constructor) : I.apply(this, arguments);
    };
    g.prototype = I.prototype;
  } else
    g = {};
  return Object.defineProperty(g, "__esModule", { value: !0 }), Object.keys(A).forEach(function(Q) {
    var B = Object.getOwnPropertyDescriptor(A, Q);
    Object.defineProperty(g, Q, B.get ? B : {
      enumerable: !0,
      get: function() {
        return A[Q];
      }
    });
  }), g;
}
var DA = {}, mA, eA;
function AQ() {
  throw new Error("setTimeout has not been defined");
}
function IQ() {
  throw new Error("clearTimeout has not been defined");
}
(function() {
  try {
    typeof setTimeout == "function" ? mA = setTimeout : mA = AQ;
  } catch {
    mA = AQ;
  }
  try {
    typeof clearTimeout == "function" ? eA = clearTimeout : eA = IQ;
  } catch {
    eA = IQ;
  }
})();
function PB(A) {
  if (mA === setTimeout)
    return setTimeout(A, 0);
  if ((mA === AQ || !mA) && setTimeout)
    return mA = setTimeout, setTimeout(A, 0);
  try {
    return mA(A, 0);
  } catch {
    try {
      return mA.call(null, A, 0);
    } catch {
      return mA.call(this, A, 0);
    }
  }
}
function NE(A) {
  if (eA === clearTimeout)
    return clearTimeout(A);
  if ((eA === IQ || !eA) && clearTimeout)
    return eA = clearTimeout, clearTimeout(A);
  try {
    return eA(A);
  } catch {
    try {
      return eA.call(null, A);
    } catch {
      return eA.call(this, A);
    }
  }
}
var xA = [], yI = !1, iI, Cg = -1;
function kE() {
  !yI || !iI || (yI = !1, iI.length ? xA = iI.concat(xA) : Cg = -1, xA.length && vB());
}
function vB() {
  if (!yI) {
    var A = PB(kE);
    yI = !0;
    for (var I = xA.length; I; ) {
      for (iI = xA, xA = []; ++Cg < I; )
        iI && iI[Cg].run();
      Cg = -1, I = xA.length;
    }
    iI = null, yI = !1, NE(A);
  }
}
DA.nextTick = function(A) {
  var I = new Array(arguments.length - 1);
  if (arguments.length > 1)
    for (var g = 1; g < arguments.length; g++)
      I[g - 1] = arguments[g];
  xA.push(new _B(A, I)), xA.length === 1 && !yI && PB(vB);
};
function _B(A, I) {
  this.fun = A, this.array = I;
}
_B.prototype.run = function() {
  this.fun.apply(null, this.array);
};
DA.title = "browser";
DA.browser = !0;
DA.env = {};
DA.argv = [];
DA.version = "";
DA.versions = {};
function TA() {
}
DA.on = TA;
DA.addListener = TA;
DA.once = TA;
DA.off = TA;
DA.removeListener = TA;
DA.removeAllListeners = TA;
DA.emit = TA;
DA.prependListener = TA;
DA.prependOnceListener = TA;
DA.listeners = function(A) {
  return [];
};
DA.binding = function(A) {
  throw new Error("process.binding is not supported");
};
DA.cwd = function() {
  return "/";
};
DA.chdir = function(A) {
  throw new Error("process.chdir is not supported");
};
DA.umask = function() {
  return 0;
};
var U = {}, gQ = {}, VA = {}, kA = {}, FI = {}, BB = {}, tA = {};
Object.defineProperty(tA, "__esModule", { value: !0 });
let QQ;
function BQ() {
  if (QQ === void 0)
    throw new Error("No runtime abstraction layer installed");
  return QQ;
}
(function(A) {
  function I(g) {
    if (g === void 0)
      throw new Error("No runtime abstraction layer provided");
    QQ = g;
  }
  A.install = I;
})(BQ || (BQ = {}));
tA.default = BQ;
var CB = {};
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.Disposable = void 0, function(I) {
    function g(Q) {
      return {
        dispose: Q
      };
    }
    I.create = g;
  }(A.Disposable || (A.Disposable = {}));
})(CB);
var YI = {};
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.Emitter = A.Event = void 0;
  const I = tA;
  (function(B) {
    const C = { dispose() {
    } };
    B.None = function() {
      return C;
    };
  })(A.Event || (A.Event = {}));
  class g {
    add(C, E = null, D) {
      this._callbacks || (this._callbacks = [], this._contexts = []), this._callbacks.push(C), this._contexts.push(E), Array.isArray(D) && D.push({ dispose: () => this.remove(C, E) });
    }
    remove(C, E = null) {
      if (!this._callbacks)
        return;
      let D = !1;
      for (let o = 0, i = this._callbacks.length; o < i; o++)
        if (this._callbacks[o] === C)
          if (this._contexts[o] === E) {
            this._callbacks.splice(o, 1), this._contexts.splice(o, 1);
            return;
          } else
            D = !0;
      if (D)
        throw new Error("When adding a listener with a context, you should remove it with the same context");
    }
    invoke(...C) {
      if (!this._callbacks)
        return [];
      const E = [], D = this._callbacks.slice(0), o = this._contexts.slice(0);
      for (let i = 0, N = D.length; i < N; i++)
        try {
          E.push(D[i].apply(o[i], C));
        } catch (F) {
          (0, I.default)().console.error(F);
        }
      return E;
    }
    isEmpty() {
      return !this._callbacks || this._callbacks.length === 0;
    }
    dispose() {
      this._callbacks = void 0, this._contexts = void 0;
    }
  }
  class Q {
    constructor(C) {
      this._options = C;
    }
    /**
     * For the public to allow to subscribe
     * to events from this Emitter
     */
    get event() {
      return this._event || (this._event = (C, E, D) => {
        this._callbacks || (this._callbacks = new g()), this._options && this._options.onFirstListenerAdd && this._callbacks.isEmpty() && this._options.onFirstListenerAdd(this), this._callbacks.add(C, E);
        const o = {
          dispose: () => {
            this._callbacks && (this._callbacks.remove(C, E), o.dispose = Q._noop, this._options && this._options.onLastListenerRemove && this._callbacks.isEmpty() && this._options.onLastListenerRemove(this));
          }
        };
        return Array.isArray(D) && D.push(o), o;
      }), this._event;
    }
    /**
     * To be kept private to fire an event to
     * subscribers
     */
    fire(C) {
      this._callbacks && this._callbacks.invoke.call(this._callbacks, C);
    }
    dispose() {
      this._callbacks && (this._callbacks.dispose(), this._callbacks = void 0);
    }
  }
  A.Emitter = Q, Q._noop = function() {
  };
})(YI);
var Mg = {};
Object.defineProperty(Mg, "__esModule", { value: !0 });
Mg.AbstractMessageBuffer = void 0;
const hE = 13, FE = 10, YE = `\r
`;
class ME {
  constructor(I = "utf-8") {
    this._encoding = I, this._chunks = [], this._totalLength = 0;
  }
  get encoding() {
    return this._encoding;
  }
  append(I) {
    const g = typeof I == "string" ? this.fromString(I, this._encoding) : I;
    this._chunks.push(g), this._totalLength += g.byteLength;
  }
  tryReadHeaders() {
    if (this._chunks.length === 0)
      return;
    let I = 0, g = 0, Q = 0, B = 0;
    A:
      for (; g < this._chunks.length; ) {
        const o = this._chunks[g];
        for (Q = 0; Q < o.length; ) {
          switch (o[Q]) {
            case hE:
              switch (I) {
                case 0:
                  I = 1;
                  break;
                case 2:
                  I = 3;
                  break;
                default:
                  I = 0;
              }
              break;
            case FE:
              switch (I) {
                case 1:
                  I = 2;
                  break;
                case 3:
                  I = 4, Q++;
                  break A;
                default:
                  I = 0;
              }
              break;
            default:
              I = 0;
          }
          Q++;
        }
        B += o.byteLength, g++;
      }
    if (I !== 4)
      return;
    const C = this._read(B + Q), E = /* @__PURE__ */ new Map(), D = this.toString(C, "ascii").split(YE);
    if (D.length < 2)
      return E;
    for (let o = 0; o < D.length - 2; o++) {
      const i = D[o], N = i.indexOf(":");
      if (N === -1)
        throw new Error("Message header must separate key and value using :");
      const F = i.substr(0, N), h = i.substr(N + 1).trim();
      E.set(F, h);
    }
    return E;
  }
  tryReadBody(I) {
    if (!(this._totalLength < I))
      return this._read(I);
  }
  get numberOfBytes() {
    return this._totalLength;
  }
  _read(I) {
    if (I === 0)
      return this.emptyBuffer();
    if (I > this._totalLength)
      throw new Error("Cannot read so many bytes!");
    if (this._chunks[0].byteLength === I) {
      const C = this._chunks[0];
      return this._chunks.shift(), this._totalLength -= I, this.asNative(C);
    }
    if (this._chunks[0].byteLength > I) {
      const C = this._chunks[0], E = this.asNative(C, I);
      return this._chunks[0] = C.slice(I), this._totalLength -= I, E;
    }
    const g = this.allocNative(I);
    let Q = 0, B = 0;
    for (; I > 0; ) {
      const C = this._chunks[B];
      if (C.byteLength > I) {
        const E = C.slice(0, I);
        g.set(E, Q), Q += I, this._chunks[B] = C.slice(I), this._totalLength -= I, I -= I;
      } else
        g.set(C, Q), Q += C.byteLength, this._chunks.shift(), this._totalLength -= C.byteLength, I -= C.byteLength;
    }
    return g;
  }
}
Mg.AbstractMessageBuffer = ME;
Object.defineProperty(BB, "__esModule", { value: !0 });
const $B = tA, sI = CB, cE = YI, aE = Mg;
class cg extends aE.AbstractMessageBuffer {
  constructor(I = "utf-8") {
    super(I), this.asciiDecoder = new TextDecoder("ascii");
  }
  emptyBuffer() {
    return cg.emptyBuffer;
  }
  fromString(I, g) {
    return new TextEncoder().encode(I);
  }
  toString(I, g) {
    return g === "ascii" ? this.asciiDecoder.decode(I) : new TextDecoder(g).decode(I);
  }
  asNative(I, g) {
    return g === void 0 ? I : I.slice(0, g);
  }
  allocNative(I) {
    return new Uint8Array(I);
  }
}
cg.emptyBuffer = new Uint8Array(0);
class RE {
  constructor(I) {
    this.socket = I, this._onData = new cE.Emitter(), this._messageListener = (g) => {
      g.data.arrayBuffer().then((B) => {
        this._onData.fire(new Uint8Array(B));
      }, () => {
        (0, $B.default)().console.error("Converting blob to array buffer failed.");
      });
    }, this.socket.addEventListener("message", this._messageListener);
  }
  onClose(I) {
    return this.socket.addEventListener("close", I), sI.Disposable.create(() => this.socket.removeEventListener("close", I));
  }
  onError(I) {
    return this.socket.addEventListener("error", I), sI.Disposable.create(() => this.socket.removeEventListener("error", I));
  }
  onEnd(I) {
    return this.socket.addEventListener("end", I), sI.Disposable.create(() => this.socket.removeEventListener("end", I));
  }
  onData(I) {
    return this._onData.event(I);
  }
}
class JE {
  constructor(I) {
    this.socket = I;
  }
  onClose(I) {
    return this.socket.addEventListener("close", I), sI.Disposable.create(() => this.socket.removeEventListener("close", I));
  }
  onError(I) {
    return this.socket.addEventListener("error", I), sI.Disposable.create(() => this.socket.removeEventListener("error", I));
  }
  onEnd(I) {
    return this.socket.addEventListener("end", I), sI.Disposable.create(() => this.socket.removeEventListener("end", I));
  }
  write(I, g) {
    if (typeof I == "string") {
      if (g !== void 0 && g !== "utf-8")
        throw new Error(`In a Browser environments only utf-8 text encoding is supported. But got encoding: ${g}`);
      this.socket.send(I);
    } else
      this.socket.send(I);
    return Promise.resolve();
  }
  end() {
    this.socket.close();
  }
}
const UE = new TextEncoder(), AC = Object.freeze({
  messageBuffer: Object.freeze({
    create: (A) => new cg(A)
  }),
  applicationJson: Object.freeze({
    encoder: Object.freeze({
      name: "application/json",
      encode: (A, I) => {
        if (I.charset !== "utf-8")
          throw new Error(`In a Browser environments only utf-8 text encoding is supported. But got encoding: ${I.charset}`);
        return Promise.resolve(UE.encode(JSON.stringify(A, void 0, 0)));
      }
    }),
    decoder: Object.freeze({
      name: "application/json",
      decode: (A, I) => {
        if (!(A instanceof Uint8Array))
          throw new Error("In a Browser environments only Uint8Arrays are supported.");
        return Promise.resolve(JSON.parse(new TextDecoder(I.charset).decode(A)));
      }
    })
  }),
  stream: Object.freeze({
    asReadableStream: (A) => new RE(A),
    asWritableStream: (A) => new JE(A)
  }),
  console,
  timer: Object.freeze({
    setTimeout(A, I, ...g) {
      const Q = setTimeout(A, I, ...g);
      return { dispose: () => clearTimeout(Q) };
    },
    setImmediate(A, ...I) {
      const g = setTimeout(A, 0, ...I);
      return { dispose: () => clearTimeout(g) };
    },
    setInterval(A, I, ...g) {
      const Q = setInterval(A, I, ...g);
      return { dispose: () => clearInterval(Q) };
    }
  })
});
function CQ() {
  return AC;
}
(function(A) {
  function I() {
    $B.default.install(AC);
  }
  A.install = I;
})(CQ || (CQ = {}));
BB.default = CQ;
var tg = {}, ng = {}, cA = {}, cB;
function rI() {
  if (cB)
    return cA;
  cB = 1, Object.defineProperty(cA, "__esModule", { value: !0 }), cA.stringArray = cA.array = cA.func = cA.error = cA.number = cA.string = cA.boolean = void 0;
  function A(D) {
    return D === !0 || D === !1;
  }
  cA.boolean = A;
  function I(D) {
    return typeof D == "string" || D instanceof String;
  }
  cA.string = I;
  function g(D) {
    return typeof D == "number" || D instanceof Number;
  }
  cA.number = g;
  function Q(D) {
    return D instanceof Error;
  }
  cA.error = Q;
  function B(D) {
    return typeof D == "function";
  }
  cA.func = B;
  function C(D) {
    return Array.isArray(D);
  }
  cA.array = C;
  function E(D) {
    return C(D) && D.every((o) => I(o));
  }
  return cA.stringArray = E, cA;
}
var aB;
function IC() {
  return aB || (aB = 1, function(A) {
    Object.defineProperty(A, "__esModule", { value: !0 }), A.Message = A.NotificationType9 = A.NotificationType8 = A.NotificationType7 = A.NotificationType6 = A.NotificationType5 = A.NotificationType4 = A.NotificationType3 = A.NotificationType2 = A.NotificationType1 = A.NotificationType0 = A.NotificationType = A.RequestType9 = A.RequestType8 = A.RequestType7 = A.RequestType6 = A.RequestType5 = A.RequestType4 = A.RequestType3 = A.RequestType2 = A.RequestType1 = A.RequestType = A.RequestType0 = A.AbstractMessageSignature = A.ParameterStructures = A.ResponseError = A.ErrorCodes = void 0;
    const I = rI();
    var g;
    (function(G) {
      G.ParseError = -32700, G.InvalidRequest = -32600, G.MethodNotFound = -32601, G.InvalidParams = -32602, G.InternalError = -32603, G.jsonrpcReservedErrorRangeStart = -32099, G.serverErrorStart = -32099, G.MessageWriteError = -32099, G.MessageReadError = -32098, G.PendingResponseRejected = -32097, G.ConnectionInactive = -32096, G.ServerNotInitialized = -32002, G.UnknownErrorCode = -32001, G.jsonrpcReservedErrorRangeEnd = -32e3, G.serverErrorEnd = -32e3;
    })(g = A.ErrorCodes || (A.ErrorCodes = {}));
    class Q extends Error {
      constructor(H, x, e) {
        super(x), this.code = I.number(H) ? H : g.UnknownErrorCode, this.data = e, Object.setPrototypeOf(this, Q.prototype);
      }
      toJson() {
        const H = {
          code: this.code,
          message: this.message
        };
        return this.data !== void 0 && (H.data = this.data), H;
      }
    }
    A.ResponseError = Q;
    class B {
      constructor(H) {
        this.kind = H;
      }
      static is(H) {
        return H === B.auto || H === B.byName || H === B.byPosition;
      }
      toString() {
        return this.kind;
      }
    }
    A.ParameterStructures = B, B.auto = new B("auto"), B.byPosition = new B("byPosition"), B.byName = new B("byName");
    class C {
      constructor(H, x) {
        this.method = H, this.numberOfParams = x;
      }
      get parameterStructures() {
        return B.auto;
      }
    }
    A.AbstractMessageSignature = C;
    class E extends C {
      constructor(H) {
        super(H, 0);
      }
    }
    A.RequestType0 = E;
    class D extends C {
      constructor(H, x = B.auto) {
        super(H, 1), this._parameterStructures = x;
      }
      get parameterStructures() {
        return this._parameterStructures;
      }
    }
    A.RequestType = D;
    class o extends C {
      constructor(H, x = B.auto) {
        super(H, 1), this._parameterStructures = x;
      }
      get parameterStructures() {
        return this._parameterStructures;
      }
    }
    A.RequestType1 = o;
    class i extends C {
      constructor(H) {
        super(H, 2);
      }
    }
    A.RequestType2 = i;
    class N extends C {
      constructor(H) {
        super(H, 3);
      }
    }
    A.RequestType3 = N;
    class F extends C {
      constructor(H) {
        super(H, 4);
      }
    }
    A.RequestType4 = F;
    class h extends C {
      constructor(H) {
        super(H, 5);
      }
    }
    A.RequestType5 = h;
    class k extends C {
      constructor(H) {
        super(H, 6);
      }
    }
    A.RequestType6 = k;
    class c extends C {
      constructor(H) {
        super(H, 7);
      }
    }
    A.RequestType7 = c;
    class L extends C {
      constructor(H) {
        super(H, 8);
      }
    }
    A.RequestType8 = L;
    class O extends C {
      constructor(H) {
        super(H, 9);
      }
    }
    A.RequestType9 = O;
    class l extends C {
      constructor(H, x = B.auto) {
        super(H, 1), this._parameterStructures = x;
      }
      get parameterStructures() {
        return this._parameterStructures;
      }
    }
    A.NotificationType = l;
    class t extends C {
      constructor(H) {
        super(H, 0);
      }
    }
    A.NotificationType0 = t;
    class V extends C {
      constructor(H, x = B.auto) {
        super(H, 1), this._parameterStructures = x;
      }
      get parameterStructures() {
        return this._parameterStructures;
      }
    }
    A.NotificationType1 = V;
    class f extends C {
      constructor(H) {
        super(H, 2);
      }
    }
    A.NotificationType2 = f;
    class hA extends C {
      constructor(H) {
        super(H, 3);
      }
    }
    A.NotificationType3 = hA;
    class $ extends C {
      constructor(H) {
        super(H, 4);
      }
    }
    A.NotificationType4 = $;
    class wA extends C {
      constructor(H) {
        super(H, 5);
      }
    }
    A.NotificationType5 = wA;
    class Z extends C {
      constructor(H) {
        super(H, 6);
      }
    }
    A.NotificationType6 = Z;
    class n extends C {
      constructor(H) {
        super(H, 7);
      }
    }
    A.NotificationType7 = n;
    class W extends C {
      constructor(H) {
        super(H, 8);
      }
    }
    A.NotificationType8 = W;
    class j extends C {
      constructor(H) {
        super(H, 9);
      }
    }
    A.NotificationType9 = j, function(G) {
      function H(T) {
        const AA = T;
        return AA && I.string(AA.method) && (I.string(AA.id) || I.number(AA.id));
      }
      G.isRequest = H;
      function x(T) {
        const AA = T;
        return AA && I.string(AA.method) && T.id === void 0;
      }
      G.isNotification = x;
      function e(T) {
        const AA = T;
        return AA && (AA.result !== void 0 || !!AA.error) && (I.string(AA.id) || I.number(AA.id) || AA.id === null);
      }
      G.isResponse = e;
    }(A.Message || (A.Message = {}));
  }(ng)), ng;
}
var Wg = {}, RB;
function gC() {
  return RB || (RB = 1, function(A) {
    var I;
    Object.defineProperty(A, "__esModule", { value: !0 }), A.LRUCache = A.LinkedMap = A.Touch = void 0;
    var g;
    (function(C) {
      C.None = 0, C.First = 1, C.AsOld = C.First, C.Last = 2, C.AsNew = C.Last;
    })(g = A.Touch || (A.Touch = {}));
    class Q {
      constructor() {
        this[I] = "LinkedMap", this._map = /* @__PURE__ */ new Map(), this._head = void 0, this._tail = void 0, this._size = 0, this._state = 0;
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
        var E;
        return (E = this._head) == null ? void 0 : E.value;
      }
      get last() {
        var E;
        return (E = this._tail) == null ? void 0 : E.value;
      }
      has(E) {
        return this._map.has(E);
      }
      get(E, D = g.None) {
        const o = this._map.get(E);
        if (o)
          return D !== g.None && this.touch(o, D), o.value;
      }
      set(E, D, o = g.None) {
        let i = this._map.get(E);
        if (i)
          i.value = D, o !== g.None && this.touch(i, o);
        else {
          switch (i = { key: E, value: D, next: void 0, previous: void 0 }, o) {
            case g.None:
              this.addItemLast(i);
              break;
            case g.First:
              this.addItemFirst(i);
              break;
            case g.Last:
              this.addItemLast(i);
              break;
            default:
              this.addItemLast(i);
              break;
          }
          this._map.set(E, i), this._size++;
        }
        return this;
      }
      delete(E) {
        return !!this.remove(E);
      }
      remove(E) {
        const D = this._map.get(E);
        if (D)
          return this._map.delete(E), this.removeItem(D), this._size--, D.value;
      }
      shift() {
        if (!this._head && !this._tail)
          return;
        if (!this._head || !this._tail)
          throw new Error("Invalid list");
        const E = this._head;
        return this._map.delete(E.key), this.removeItem(E), this._size--, E.value;
      }
      forEach(E, D) {
        const o = this._state;
        let i = this._head;
        for (; i; ) {
          if (D ? E.bind(D)(i.value, i.key, this) : E(i.value, i.key, this), this._state !== o)
            throw new Error("LinkedMap got modified during iteration.");
          i = i.next;
        }
      }
      keys() {
        const E = this._state;
        let D = this._head;
        const o = {
          [Symbol.iterator]: () => o,
          next: () => {
            if (this._state !== E)
              throw new Error("LinkedMap got modified during iteration.");
            if (D) {
              const i = { value: D.key, done: !1 };
              return D = D.next, i;
            } else
              return { value: void 0, done: !0 };
          }
        };
        return o;
      }
      values() {
        const E = this._state;
        let D = this._head;
        const o = {
          [Symbol.iterator]: () => o,
          next: () => {
            if (this._state !== E)
              throw new Error("LinkedMap got modified during iteration.");
            if (D) {
              const i = { value: D.value, done: !1 };
              return D = D.next, i;
            } else
              return { value: void 0, done: !0 };
          }
        };
        return o;
      }
      entries() {
        const E = this._state;
        let D = this._head;
        const o = {
          [Symbol.iterator]: () => o,
          next: () => {
            if (this._state !== E)
              throw new Error("LinkedMap got modified during iteration.");
            if (D) {
              const i = { value: [D.key, D.value], done: !1 };
              return D = D.next, i;
            } else
              return { value: void 0, done: !0 };
          }
        };
        return o;
      }
      [(I = Symbol.toStringTag, Symbol.iterator)]() {
        return this.entries();
      }
      trimOld(E) {
        if (E >= this.size)
          return;
        if (E === 0) {
          this.clear();
          return;
        }
        let D = this._head, o = this.size;
        for (; D && o > E; )
          this._map.delete(D.key), D = D.next, o--;
        this._head = D, this._size = o, D && (D.previous = void 0), this._state++;
      }
      addItemFirst(E) {
        if (!this._head && !this._tail)
          this._tail = E;
        else if (this._head)
          E.next = this._head, this._head.previous = E;
        else
          throw new Error("Invalid list");
        this._head = E, this._state++;
      }
      addItemLast(E) {
        if (!this._head && !this._tail)
          this._head = E;
        else if (this._tail)
          E.previous = this._tail, this._tail.next = E;
        else
          throw new Error("Invalid list");
        this._tail = E, this._state++;
      }
      removeItem(E) {
        if (E === this._head && E === this._tail)
          this._head = void 0, this._tail = void 0;
        else if (E === this._head) {
          if (!E.next)
            throw new Error("Invalid list");
          E.next.previous = void 0, this._head = E.next;
        } else if (E === this._tail) {
          if (!E.previous)
            throw new Error("Invalid list");
          E.previous.next = void 0, this._tail = E.previous;
        } else {
          const D = E.next, o = E.previous;
          if (!D || !o)
            throw new Error("Invalid list");
          D.previous = o, o.next = D;
        }
        E.next = void 0, E.previous = void 0, this._state++;
      }
      touch(E, D) {
        if (!this._head || !this._tail)
          throw new Error("Invalid list");
        if (!(D !== g.First && D !== g.Last)) {
          if (D === g.First) {
            if (E === this._head)
              return;
            const o = E.next, i = E.previous;
            E === this._tail ? (i.next = void 0, this._tail = i) : (o.previous = i, i.next = o), E.previous = void 0, E.next = this._head, this._head.previous = E, this._head = E, this._state++;
          } else if (D === g.Last) {
            if (E === this._tail)
              return;
            const o = E.next, i = E.previous;
            E === this._head ? (o.previous = void 0, this._head = o) : (o.previous = i, i.next = o), E.next = void 0, E.previous = this._tail, this._tail.next = E, this._tail = E, this._state++;
          }
        }
      }
      toJSON() {
        const E = [];
        return this.forEach((D, o) => {
          E.push([o, D]);
        }), E;
      }
      fromJSON(E) {
        this.clear();
        for (const [D, o] of E)
          this.set(D, o);
      }
    }
    A.LinkedMap = Q;
    class B extends Q {
      constructor(E, D = 1) {
        super(), this._limit = E, this._ratio = Math.min(Math.max(0, D), 1);
      }
      get limit() {
        return this._limit;
      }
      set limit(E) {
        this._limit = E, this.checkTrim();
      }
      get ratio() {
        return this._ratio;
      }
      set ratio(E) {
        this._ratio = Math.min(Math.max(0, E), 1), this.checkTrim();
      }
      get(E, D = g.AsNew) {
        return super.get(E, D);
      }
      peek(E) {
        return super.get(E, g.None);
      }
      set(E, D) {
        return super.set(E, D, g.Last), this.checkTrim(), this;
      }
      checkTrim() {
        this.size > this._limit && this.trimOld(Math.round(this._limit * this._ratio));
      }
    }
    A.LRUCache = B;
  }(Wg)), Wg;
}
var Xg = {}, JB;
function QC() {
  return JB || (JB = 1, function(A) {
    Object.defineProperty(A, "__esModule", { value: !0 }), A.CancellationTokenSource = A.CancellationToken = void 0;
    const I = tA, g = rI(), Q = YI;
    var B;
    (function(o) {
      o.None = Object.freeze({
        isCancellationRequested: !1,
        onCancellationRequested: Q.Event.None
      }), o.Cancelled = Object.freeze({
        isCancellationRequested: !0,
        onCancellationRequested: Q.Event.None
      });
      function i(N) {
        const F = N;
        return F && (F === o.None || F === o.Cancelled || g.boolean(F.isCancellationRequested) && !!F.onCancellationRequested);
      }
      o.is = i;
    })(B = A.CancellationToken || (A.CancellationToken = {}));
    const C = Object.freeze(function(o, i) {
      const N = (0, I.default)().timer.setTimeout(o.bind(i), 0);
      return { dispose() {
        N.dispose();
      } };
    });
    class E {
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
        return this._isCancelled ? C : (this._emitter || (this._emitter = new Q.Emitter()), this._emitter.event);
      }
      dispose() {
        this._emitter && (this._emitter.dispose(), this._emitter = void 0);
      }
    }
    class D {
      get token() {
        return this._token || (this._token = new E()), this._token;
      }
      cancel() {
        this._token ? this._token.cancel() : this._token = B.Cancelled;
      }
      dispose() {
        this._token ? this._token instanceof E && this._token.dispose() : this._token = B.None;
      }
    }
    A.CancellationTokenSource = D;
  }(Xg)), Xg;
}
var xg = {}, UB;
function yE() {
  return UB || (UB = 1, function(A) {
    Object.defineProperty(A, "__esModule", { value: !0 }), A.ReadableStreamMessageReader = A.AbstractMessageReader = A.MessageReader = void 0;
    const I = tA, g = rI(), Q = YI;
    (function(D) {
      function o(i) {
        let N = i;
        return N && g.func(N.listen) && g.func(N.dispose) && g.func(N.onError) && g.func(N.onClose) && g.func(N.onPartialMessage);
      }
      D.is = o;
    })(A.MessageReader || (A.MessageReader = {}));
    class B {
      constructor() {
        this.errorEmitter = new Q.Emitter(), this.closeEmitter = new Q.Emitter(), this.partialMessageEmitter = new Q.Emitter();
      }
      dispose() {
        this.errorEmitter.dispose(), this.closeEmitter.dispose();
      }
      get onError() {
        return this.errorEmitter.event;
      }
      fireError(o) {
        this.errorEmitter.fire(this.asError(o));
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
      firePartialMessage(o) {
        this.partialMessageEmitter.fire(o);
      }
      asError(o) {
        return o instanceof Error ? o : new Error(`Reader received error. Reason: ${g.string(o.message) ? o.message : "unknown"}`);
      }
    }
    A.AbstractMessageReader = B;
    var C;
    (function(D) {
      function o(i) {
        let N, F;
        const h = /* @__PURE__ */ new Map();
        let k;
        const c = /* @__PURE__ */ new Map();
        if (i === void 0 || typeof i == "string")
          N = i ?? "utf-8";
        else {
          if (N = i.charset ?? "utf-8", i.contentDecoder !== void 0 && (F = i.contentDecoder, h.set(F.name, F)), i.contentDecoders !== void 0)
            for (const L of i.contentDecoders)
              h.set(L.name, L);
          if (i.contentTypeDecoder !== void 0 && (k = i.contentTypeDecoder, c.set(k.name, k)), i.contentTypeDecoders !== void 0)
            for (const L of i.contentTypeDecoders)
              c.set(L.name, L);
        }
        return k === void 0 && (k = (0, I.default)().applicationJson.decoder, c.set(k.name, k)), { charset: N, contentDecoder: F, contentDecoders: h, contentTypeDecoder: k, contentTypeDecoders: c };
      }
      D.fromOptions = o;
    })(C || (C = {}));
    class E extends B {
      constructor(o, i) {
        super(), this.readable = o, this.options = C.fromOptions(i), this.buffer = (0, I.default)().messageBuffer.create(this.options.charset), this._partialMessageTimeout = 1e4, this.nextMessageLength = -1, this.messageToken = 0;
      }
      set partialMessageTimeout(o) {
        this._partialMessageTimeout = o;
      }
      get partialMessageTimeout() {
        return this._partialMessageTimeout;
      }
      listen(o) {
        this.nextMessageLength = -1, this.messageToken = 0, this.partialMessageTimer = void 0, this.callback = o;
        const i = this.readable.onData((N) => {
          this.onData(N);
        });
        return this.readable.onError((N) => this.fireError(N)), this.readable.onClose(() => this.fireClose()), i;
      }
      onData(o) {
        for (this.buffer.append(o); ; ) {
          if (this.nextMessageLength === -1) {
            const F = this.buffer.tryReadHeaders();
            if (!F)
              return;
            const h = F.get("Content-Length");
            if (!h)
              throw new Error("Header must provide a Content-Length property.");
            const k = parseInt(h);
            if (isNaN(k))
              throw new Error("Content-Length value must be a number.");
            this.nextMessageLength = k;
          }
          const i = this.buffer.tryReadBody(this.nextMessageLength);
          if (i === void 0) {
            this.setPartialMessageTimer();
            return;
          }
          this.clearPartialMessageTimer(), this.nextMessageLength = -1;
          let N;
          this.options.contentDecoder !== void 0 ? N = this.options.contentDecoder.decode(i) : N = Promise.resolve(i), N.then((F) => {
            this.options.contentTypeDecoder.decode(F, this.options).then((h) => {
              this.callback(h);
            }, (h) => {
              this.fireError(h);
            });
          }, (F) => {
            this.fireError(F);
          });
        }
      }
      clearPartialMessageTimer() {
        this.partialMessageTimer && (this.partialMessageTimer.dispose(), this.partialMessageTimer = void 0);
      }
      setPartialMessageTimer() {
        this.clearPartialMessageTimer(), !(this._partialMessageTimeout <= 0) && (this.partialMessageTimer = (0, I.default)().timer.setTimeout((o, i) => {
          this.partialMessageTimer = void 0, o === this.messageToken && (this.firePartialMessage({ messageToken: o, waitingTime: i }), this.setPartialMessageTimer());
        }, this._partialMessageTimeout, this.messageToken, this._partialMessageTimeout));
      }
    }
    A.ReadableStreamMessageReader = E;
  }(xg)), xg;
}
var Vg = {}, mI = {}, yB;
function sE() {
  if (yB)
    return mI;
  yB = 1, Object.defineProperty(mI, "__esModule", { value: !0 }), mI.Semaphore = void 0;
  const A = tA;
  class I {
    constructor(Q = 1) {
      if (Q <= 0)
        throw new Error("Capacity must be greater than 0");
      this._capacity = Q, this._active = 0, this._waiting = [];
    }
    lock(Q) {
      return new Promise((B, C) => {
        this._waiting.push({ thunk: Q, resolve: B, reject: C }), this.runNext();
      });
    }
    get active() {
      return this._active;
    }
    runNext() {
      this._waiting.length === 0 || this._active === this._capacity || (0, A.default)().timer.setImmediate(() => this.doRunNext());
    }
    doRunNext() {
      if (this._waiting.length === 0 || this._active === this._capacity)
        return;
      const Q = this._waiting.shift();
      if (this._active++, this._active > this._capacity)
        throw new Error("To many thunks active");
      try {
        const B = Q.thunk();
        B instanceof Promise ? B.then((C) => {
          this._active--, Q.resolve(C), this.runNext();
        }, (C) => {
          this._active--, Q.reject(C), this.runNext();
        }) : (this._active--, Q.resolve(B), this.runNext());
      } catch (B) {
        this._active--, Q.reject(B), this.runNext();
      }
    }
  }
  return mI.Semaphore = I, mI;
}
var sB;
function KE() {
  return sB || (sB = 1, function(A) {
    Object.defineProperty(A, "__esModule", { value: !0 }), A.WriteableStreamMessageWriter = A.AbstractMessageWriter = A.MessageWriter = void 0;
    const I = tA, g = rI(), Q = sE(), B = YI, C = "Content-Length: ", E = `\r
`;
    (function(N) {
      function F(h) {
        let k = h;
        return k && g.func(k.dispose) && g.func(k.onClose) && g.func(k.onError) && g.func(k.write);
      }
      N.is = F;
    })(A.MessageWriter || (A.MessageWriter = {}));
    class D {
      constructor() {
        this.errorEmitter = new B.Emitter(), this.closeEmitter = new B.Emitter();
      }
      dispose() {
        this.errorEmitter.dispose(), this.closeEmitter.dispose();
      }
      get onError() {
        return this.errorEmitter.event;
      }
      fireError(F, h, k) {
        this.errorEmitter.fire([this.asError(F), h, k]);
      }
      get onClose() {
        return this.closeEmitter.event;
      }
      fireClose() {
        this.closeEmitter.fire(void 0);
      }
      asError(F) {
        return F instanceof Error ? F : new Error(`Writer received error. Reason: ${g.string(F.message) ? F.message : "unknown"}`);
      }
    }
    A.AbstractMessageWriter = D;
    var o;
    (function(N) {
      function F(h) {
        return h === void 0 || typeof h == "string" ? { charset: h ?? "utf-8", contentTypeEncoder: (0, I.default)().applicationJson.encoder } : { charset: h.charset ?? "utf-8", contentEncoder: h.contentEncoder, contentTypeEncoder: h.contentTypeEncoder ?? (0, I.default)().applicationJson.encoder };
      }
      N.fromOptions = F;
    })(o || (o = {}));
    class i extends D {
      constructor(F, h) {
        super(), this.writable = F, this.options = o.fromOptions(h), this.errorCount = 0, this.writeSemaphore = new Q.Semaphore(1), this.writable.onError((k) => this.fireError(k)), this.writable.onClose(() => this.fireClose());
      }
      async write(F) {
        return this.writeSemaphore.lock(async () => this.options.contentTypeEncoder.encode(F, this.options).then((k) => this.options.contentEncoder !== void 0 ? this.options.contentEncoder.encode(k) : k).then((k) => {
          const c = [];
          return c.push(C, k.byteLength.toString(), E), c.push(E), this.doWrite(F, c, k);
        }, (k) => {
          throw this.fireError(k), k;
        }));
      }
      async doWrite(F, h, k) {
        try {
          return await this.writable.write(h.join(""), "ascii"), this.writable.write(k);
        } catch (c) {
          return this.handleError(c, F), Promise.reject(c);
        }
      }
      handleError(F, h) {
        this.errorCount++, this.fireError(F, h, this.errorCount);
      }
      end() {
        this.writable.end();
      }
    }
    A.WriteableStreamMessageWriter = i;
  }(Vg)), Vg;
}
var Tg = {}, KB;
function ZE() {
  return KB || (KB = 1, function(A) {
    Object.defineProperty(A, "__esModule", { value: !0 }), A.createMessageConnection = A.ConnectionOptions = A.CancellationStrategy = A.CancellationSenderStrategy = A.CancellationReceiverStrategy = A.ConnectionStrategy = A.ConnectionError = A.ConnectionErrors = A.LogTraceNotification = A.SetTraceNotification = A.TraceFormat = A.TraceValues = A.Trace = A.NullLogger = A.ProgressType = A.ProgressToken = void 0;
    const I = tA, g = rI(), Q = IC(), B = gC(), C = YI, E = QC();
    var D;
    (function(Z) {
      Z.type = new Q.NotificationType("$/cancelRequest");
    })(D || (D = {}));
    var o;
    (function(Z) {
      function n(W) {
        return typeof W == "string" || typeof W == "number";
      }
      Z.is = n;
    })(o = A.ProgressToken || (A.ProgressToken = {}));
    var i;
    (function(Z) {
      Z.type = new Q.NotificationType("$/progress");
    })(i || (i = {}));
    class N {
      constructor() {
      }
    }
    A.ProgressType = N;
    var F;
    (function(Z) {
      function n(W) {
        return g.func(W);
      }
      Z.is = n;
    })(F || (F = {})), A.NullLogger = Object.freeze({
      error: () => {
      },
      warn: () => {
      },
      info: () => {
      },
      log: () => {
      }
    });
    var h;
    (function(Z) {
      Z[Z.Off = 0] = "Off", Z[Z.Messages = 1] = "Messages", Z[Z.Compact = 2] = "Compact", Z[Z.Verbose = 3] = "Verbose";
    })(h = A.Trace || (A.Trace = {})), function(Z) {
      Z.Off = "off", Z.Messages = "messages", Z.Compact = "compact", Z.Verbose = "verbose";
    }(A.TraceValues || (A.TraceValues = {})), function(Z) {
      function n(j) {
        if (!g.string(j))
          return Z.Off;
        switch (j = j.toLowerCase(), j) {
          case "off":
            return Z.Off;
          case "messages":
            return Z.Messages;
          case "compact":
            return Z.Compact;
          case "verbose":
            return Z.Verbose;
          default:
            return Z.Off;
        }
      }
      Z.fromString = n;
      function W(j) {
        switch (j) {
          case Z.Off:
            return "off";
          case Z.Messages:
            return "messages";
          case Z.Compact:
            return "compact";
          case Z.Verbose:
            return "verbose";
          default:
            return "off";
        }
      }
      Z.toString = W;
    }(h = A.Trace || (A.Trace = {}));
    var k;
    (function(Z) {
      Z.Text = "text", Z.JSON = "json";
    })(k = A.TraceFormat || (A.TraceFormat = {})), function(Z) {
      function n(W) {
        return g.string(W) ? (W = W.toLowerCase(), W === "json" ? Z.JSON : Z.Text) : Z.Text;
      }
      Z.fromString = n;
    }(k = A.TraceFormat || (A.TraceFormat = {}));
    var c;
    (function(Z) {
      Z.type = new Q.NotificationType("$/setTrace");
    })(c = A.SetTraceNotification || (A.SetTraceNotification = {}));
    var L;
    (function(Z) {
      Z.type = new Q.NotificationType("$/logTrace");
    })(L = A.LogTraceNotification || (A.LogTraceNotification = {}));
    var O;
    (function(Z) {
      Z[Z.Closed = 1] = "Closed", Z[Z.Disposed = 2] = "Disposed", Z[Z.AlreadyListening = 3] = "AlreadyListening";
    })(O = A.ConnectionErrors || (A.ConnectionErrors = {}));
    class l extends Error {
      constructor(n, W) {
        super(W), this.code = n, Object.setPrototypeOf(this, l.prototype);
      }
    }
    A.ConnectionError = l;
    var t;
    (function(Z) {
      function n(W) {
        const j = W;
        return j && g.func(j.cancelUndispatched);
      }
      Z.is = n;
    })(t = A.ConnectionStrategy || (A.ConnectionStrategy = {}));
    var V;
    (function(Z) {
      Z.Message = Object.freeze({
        createCancellationTokenSource(W) {
          return new E.CancellationTokenSource();
        }
      });
      function n(W) {
        const j = W;
        return j && g.func(j.createCancellationTokenSource);
      }
      Z.is = n;
    })(V = A.CancellationReceiverStrategy || (A.CancellationReceiverStrategy = {}));
    var f;
    (function(Z) {
      Z.Message = Object.freeze({
        sendCancellation(W, j) {
          return W.sendNotification(D.type, { id: j });
        },
        cleanup(W) {
        }
      });
      function n(W) {
        const j = W;
        return j && g.func(j.sendCancellation) && g.func(j.cleanup);
      }
      Z.is = n;
    })(f = A.CancellationSenderStrategy || (A.CancellationSenderStrategy = {}));
    var hA;
    (function(Z) {
      Z.Message = Object.freeze({
        receiver: V.Message,
        sender: f.Message
      });
      function n(W) {
        const j = W;
        return j && V.is(j.receiver) && f.is(j.sender);
      }
      Z.is = n;
    })(hA = A.CancellationStrategy || (A.CancellationStrategy = {})), function(Z) {
      function n(W) {
        const j = W;
        return j && (hA.is(j.cancellationStrategy) || t.is(j.connectionStrategy));
      }
      Z.is = n;
    }(A.ConnectionOptions || (A.ConnectionOptions = {}));
    var $;
    (function(Z) {
      Z[Z.New = 1] = "New", Z[Z.Listening = 2] = "Listening", Z[Z.Closed = 3] = "Closed", Z[Z.Disposed = 4] = "Disposed";
    })($ || ($ = {}));
    function wA(Z, n, W, j) {
      const G = W !== void 0 ? W : A.NullLogger;
      let H = 0, x = 0, e = 0;
      const T = "2.0";
      let AA;
      const II = /* @__PURE__ */ new Map();
      let zA;
      const gI = /* @__PURE__ */ new Map(), QI = /* @__PURE__ */ new Map();
      let MI, pA = new B.LinkedMap(), jA = /* @__PURE__ */ new Map(), BI = /* @__PURE__ */ new Set(), qA = /* @__PURE__ */ new Map(), u = h.Off, m = k.Text, Y, K = $.New;
      const d = new C.Emitter(), R = new C.Emitter(), MA = new C.Emitter(), KA = new C.Emitter(), fA = new C.Emitter(), CI = j && j.cancellationStrategy ? j.cancellationStrategy : hA.Message;
      function lI(w) {
        if (w === null)
          throw new Error("Can't send requests with id null since the response can't be correlated.");
        return "req-" + w.toString();
      }
      function vI(w) {
        return w === null ? "res-unknown-" + (++e).toString() : "res-" + w.toString();
      }
      function _I() {
        return "not-" + (++x).toString();
      }
      function cI(w, s) {
        Q.Message.isRequest(s) ? w.set(lI(s.id), s) : Q.Message.isResponse(s) ? w.set(vI(s.id), s) : w.set(_I(), s);
      }
      function mg(w) {
      }
      function EI() {
        return K === $.Listening;
      }
      function DI() {
        return K === $.Closed;
      }
      function OA() {
        return K === $.Disposed;
      }
      function nA() {
        (K === $.New || K === $.Listening) && (K = $.Closed, R.fire(void 0));
      }
      function J(w) {
        d.fire([w, void 0, void 0]);
      }
      function y(w) {
        d.fire(w);
      }
      Z.onClose(nA), Z.onError(J), n.onClose(nA), n.onError(y);
      function q() {
        MI || pA.size === 0 || (MI = (0, I.default)().timer.setImmediate(() => {
          MI = void 0, lA();
        }));
      }
      function lA() {
        if (pA.size === 0)
          return;
        const w = pA.shift();
        try {
          Q.Message.isRequest(w) ? eg(w) : Q.Message.isNotification(w) ? gE(w) : Q.Message.isResponse(w) ? IE(w) : QE(w);
        } finally {
          q();
        }
      }
      const ZA = (w) => {
        try {
          if (Q.Message.isNotification(w) && w.method === D.type.method) {
            const s = w.params.id, S = lI(s), p = pA.get(S);
            if (Q.Message.isRequest(p)) {
              const _ = j == null ? void 0 : j.connectionStrategy, P = _ && _.cancelUndispatched ? _.cancelUndispatched(p, mg) : void 0;
              if (P && (P.error !== void 0 || P.result !== void 0)) {
                pA.delete(S), qA.delete(s), P.id = p.id, $I(P, w.method, Date.now()), n.write(P).catch(() => G.error("Sending response for canceled message failed."));
                return;
              }
            }
            const v = qA.get(s);
            if (v !== void 0) {
              v.cancel(), dg(w);
              return;
            } else
              BI.add(s);
          }
          cI(pA, w);
        } finally {
          q();
        }
      };
      function eg(w) {
        if (OA())
          return;
        function s(z, IA, r) {
          const NA = {
            jsonrpc: T,
            id: w.id
          };
          z instanceof Q.ResponseError ? NA.error = z.toJson() : NA.result = z === void 0 ? null : z, $I(NA, IA, r), n.write(NA).catch(() => G.error("Sending response failed."));
        }
        function S(z, IA, r) {
          const NA = {
            jsonrpc: T,
            id: w.id,
            error: z.toJson()
          };
          $I(NA, IA, r), n.write(NA).catch(() => G.error("Sending response failed."));
        }
        function p(z, IA, r) {
          z === void 0 && (z = null);
          const NA = {
            jsonrpc: T,
            id: w.id,
            result: z
          };
          $I(NA, IA, r), n.write(NA).catch(() => G.error("Sending response failed."));
        }
        EE(w);
        const v = II.get(w.method);
        let _, P;
        v && (_ = v.type, P = v.handler);
        const FA = Date.now();
        if (P || AA) {
          const z = w.id ?? String(Date.now()), IA = CI.receiver.createCancellationTokenSource(z);
          w.id !== null && BI.has(w.id) && IA.cancel(), w.id !== null && qA.set(z, IA);
          try {
            let r;
            if (P)
              if (w.params === void 0) {
                if (_ !== void 0 && _.numberOfParams !== 0) {
                  S(new Q.ResponseError(Q.ErrorCodes.InvalidParams, `Request ${w.method} defines ${_.numberOfParams} params but received none.`), w.method, FA);
                  return;
                }
                r = P(IA.token);
              } else if (Array.isArray(w.params)) {
                if (_ !== void 0 && _.parameterStructures === Q.ParameterStructures.byName) {
                  S(new Q.ResponseError(Q.ErrorCodes.InvalidParams, `Request ${w.method} defines parameters by name but received parameters by position`), w.method, FA);
                  return;
                }
                r = P(...w.params, IA.token);
              } else {
                if (_ !== void 0 && _.parameterStructures === Q.ParameterStructures.byPosition) {
                  S(new Q.ResponseError(Q.ErrorCodes.InvalidParams, `Request ${w.method} defines parameters by position but received parameters by name`), w.method, FA);
                  return;
                }
                r = P(w.params, IA.token);
              }
            else
              AA && (r = AA(w.method, w.params, IA.token));
            const NA = r;
            r ? NA.then ? NA.then((JA) => {
              qA.delete(z), s(JA, w.method, FA);
            }, (JA) => {
              qA.delete(z), JA instanceof Q.ResponseError ? S(JA, w.method, FA) : JA && g.string(JA.message) ? S(new Q.ResponseError(Q.ErrorCodes.InternalError, `Request ${w.method} failed with message: ${JA.message}`), w.method, FA) : S(new Q.ResponseError(Q.ErrorCodes.InternalError, `Request ${w.method} failed unexpectedly without providing any details.`), w.method, FA);
            }) : (qA.delete(z), s(r, w.method, FA)) : (qA.delete(z), p(r, w.method, FA));
          } catch (r) {
            qA.delete(z), r instanceof Q.ResponseError ? s(r, w.method, FA) : r && g.string(r.message) ? S(new Q.ResponseError(Q.ErrorCodes.InternalError, `Request ${w.method} failed with message: ${r.message}`), w.method, FA) : S(new Q.ResponseError(Q.ErrorCodes.InternalError, `Request ${w.method} failed unexpectedly without providing any details.`), w.method, FA);
          }
        } else
          S(new Q.ResponseError(Q.ErrorCodes.MethodNotFound, `Unhandled method ${w.method}`), w.method, FA);
      }
      function IE(w) {
        if (!OA())
          if (w.id === null)
            w.error ? G.error(`Received response message without id: Error is: 
${JSON.stringify(w.error, void 0, 4)}`) : G.error("Received response message without id. No further error information provided.");
          else {
            const s = w.id, S = jA.get(s);
            if (DE(w, S), S !== void 0) {
              jA.delete(s);
              try {
                if (w.error) {
                  const p = w.error;
                  S.reject(new Q.ResponseError(p.code, p.message, p.data));
                } else if (w.result !== void 0)
                  S.resolve(w.result);
                else
                  throw new Error("Should never happen.");
              } catch (p) {
                p.message ? G.error(`Response handler '${S.method}' failed with message: ${p.message}`) : G.error(`Response handler '${S.method}' failed unexpectedly.`);
              }
            }
          }
      }
      function gE(w) {
        if (OA())
          return;
        let s, S;
        if (w.method === D.type.method) {
          const p = w.params.id;
          BI.delete(p), dg(w);
          return;
        } else {
          const p = gI.get(w.method);
          p && (S = p.handler, s = p.type);
        }
        if (S || zA)
          try {
            if (dg(w), S)
              if (w.params === void 0)
                s !== void 0 && s.numberOfParams !== 0 && s.parameterStructures !== Q.ParameterStructures.byName && G.error(`Notification ${w.method} defines ${s.numberOfParams} params but received none.`), S();
              else if (Array.isArray(w.params)) {
                const p = w.params;
                w.method === i.type.method && p.length === 2 && o.is(p[0]) ? S({ token: p[0], value: p[1] }) : (s !== void 0 && (s.parameterStructures === Q.ParameterStructures.byName && G.error(`Notification ${w.method} defines parameters by name but received parameters by position`), s.numberOfParams !== w.params.length && G.error(`Notification ${w.method} defines ${s.numberOfParams} params but received ${p.length} arguments`)), S(...p));
              } else
                s !== void 0 && s.parameterStructures === Q.ParameterStructures.byPosition && G.error(`Notification ${w.method} defines parameters by position but received parameters by name`), S(w.params);
            else
              zA && zA(w.method, w.params);
          } catch (p) {
            p.message ? G.error(`Notification handler '${w.method}' failed with message: ${p.message}`) : G.error(`Notification handler '${w.method}' failed unexpectedly.`);
          }
        else
          MA.fire(w);
      }
      function QE(w) {
        if (!w) {
          G.error("Received empty message.");
          return;
        }
        G.error(`Received message which is neither a response nor a notification message:
${JSON.stringify(w, null, 4)}`);
        const s = w;
        if (g.string(s.id) || g.number(s.id)) {
          const S = s.id, p = jA.get(S);
          p && p.reject(new Error("The received response has neither a result nor an error property."));
        }
      }
      function rA(w) {
        if (w != null)
          switch (u) {
            case h.Verbose:
              return JSON.stringify(w, null, 4);
            case h.Compact:
              return JSON.stringify(w);
            default:
              return;
          }
      }
      function BE(w) {
        if (!(u === h.Off || !Y))
          if (m === k.Text) {
            let s;
            (u === h.Verbose || u === h.Compact) && w.params && (s = `Params: ${rA(w.params)}

`), Y.log(`Sending request '${w.method} - (${w.id})'.`, s);
          } else
            aI("send-request", w);
      }
      function CE(w) {
        if (!(u === h.Off || !Y))
          if (m === k.Text) {
            let s;
            (u === h.Verbose || u === h.Compact) && (w.params ? s = `Params: ${rA(w.params)}

` : s = `No parameters provided.

`), Y.log(`Sending notification '${w.method}'.`, s);
          } else
            aI("send-notification", w);
      }
      function $I(w, s, S) {
        if (!(u === h.Off || !Y))
          if (m === k.Text) {
            let p;
            (u === h.Verbose || u === h.Compact) && (w.error && w.error.data ? p = `Error data: ${rA(w.error.data)}

` : w.result ? p = `Result: ${rA(w.result)}

` : w.error === void 0 && (p = `No result returned.

`)), Y.log(`Sending response '${s} - (${w.id})'. Processing request took ${Date.now() - S}ms`, p);
          } else
            aI("send-response", w);
      }
      function EE(w) {
        if (!(u === h.Off || !Y))
          if (m === k.Text) {
            let s;
            (u === h.Verbose || u === h.Compact) && w.params && (s = `Params: ${rA(w.params)}

`), Y.log(`Received request '${w.method} - (${w.id})'.`, s);
          } else
            aI("receive-request", w);
      }
      function dg(w) {
        if (!(u === h.Off || !Y || w.method === L.type.method))
          if (m === k.Text) {
            let s;
            (u === h.Verbose || u === h.Compact) && (w.params ? s = `Params: ${rA(w.params)}

` : s = `No parameters provided.

`), Y.log(`Received notification '${w.method}'.`, s);
          } else
            aI("receive-notification", w);
      }
      function DE(w, s) {
        if (!(u === h.Off || !Y))
          if (m === k.Text) {
            let S;
            if ((u === h.Verbose || u === h.Compact) && (w.error && w.error.data ? S = `Error data: ${rA(w.error.data)}

` : w.result ? S = `Result: ${rA(w.result)}

` : w.error === void 0 && (S = `No result returned.

`)), s) {
              const p = w.error ? ` Request failed: ${w.error.message} (${w.error.code}).` : "";
              Y.log(`Received response '${s.method} - (${w.id})' in ${Date.now() - s.timerStart}ms.${p}`, S);
            } else
              Y.log(`Received response ${w.id} without active response promise.`, S);
          } else
            aI("receive-response", w);
      }
      function aI(w, s) {
        if (!Y || u === h.Off)
          return;
        const S = {
          isLSPMessage: !0,
          type: w,
          message: s,
          timestamp: Date.now()
        };
        Y.log(S);
      }
      function pI() {
        if (DI())
          throw new l(O.Closed, "Connection is closed.");
        if (OA())
          throw new l(O.Disposed, "Connection is disposed.");
      }
      function oE() {
        if (EI())
          throw new l(O.AlreadyListening, "Connection is already listening");
      }
      function GE() {
        if (!EI())
          throw new Error("Call listen() first.");
      }
      function jI(w) {
        return w === void 0 ? null : w;
      }
      function FB(w) {
        if (w !== null)
          return w;
      }
      function YB(w) {
        return w != null && !Array.isArray(w) && typeof w == "object";
      }
      function bg(w, s) {
        switch (w) {
          case Q.ParameterStructures.auto:
            return YB(s) ? FB(s) : [jI(s)];
          case Q.ParameterStructures.byName:
            if (!YB(s))
              throw new Error("Received parameters by name but param is not an object literal.");
            return FB(s);
          case Q.ParameterStructures.byPosition:
            return [jI(s)];
          default:
            throw new Error(`Unknown parameter structure ${w.toString()}`);
        }
      }
      function MB(w, s) {
        let S;
        const p = w.numberOfParams;
        switch (p) {
          case 0:
            S = void 0;
            break;
          case 1:
            S = bg(w.parameterStructures, s[0]);
            break;
          default:
            S = [];
            for (let v = 0; v < s.length && v < p; v++)
              S.push(jI(s[v]));
            if (s.length < p)
              for (let v = s.length; v < p; v++)
                S.push(null);
            break;
        }
        return S;
      }
      const RI = {
        sendNotification: (w, ...s) => {
          pI();
          let S, p;
          if (g.string(w)) {
            S = w;
            const _ = s[0];
            let P = 0, FA = Q.ParameterStructures.auto;
            Q.ParameterStructures.is(_) && (P = 1, FA = _);
            let z = s.length;
            const IA = z - P;
            switch (IA) {
              case 0:
                p = void 0;
                break;
              case 1:
                p = bg(FA, s[P]);
                break;
              default:
                if (FA === Q.ParameterStructures.byName)
                  throw new Error(`Received ${IA} parameters for 'by Name' notification parameter structure.`);
                p = s.slice(P, z).map((r) => jI(r));
                break;
            }
          } else {
            const _ = s;
            S = w.method, p = MB(w, _);
          }
          const v = {
            jsonrpc: T,
            method: S,
            params: p
          };
          return CE(v), n.write(v).catch(() => G.error("Sending notification failed."));
        },
        onNotification: (w, s) => {
          pI();
          let S;
          return g.func(w) ? zA = w : s && (g.string(w) ? (S = w, gI.set(w, { type: void 0, handler: s })) : (S = w.method, gI.set(w.method, { type: w, handler: s }))), {
            dispose: () => {
              S !== void 0 ? gI.delete(S) : zA = void 0;
            }
          };
        },
        onProgress: (w, s, S) => {
          if (QI.has(s))
            throw new Error(`Progress handler for token ${s} already registered`);
          return QI.set(s, S), {
            dispose: () => {
              QI.delete(s);
            }
          };
        },
        sendProgress: (w, s, S) => RI.sendNotification(i.type, { token: s, value: S }),
        onUnhandledProgress: KA.event,
        sendRequest: (w, ...s) => {
          pI(), GE();
          let S, p, v;
          if (g.string(w)) {
            S = w;
            const z = s[0], IA = s[s.length - 1];
            let r = 0, NA = Q.ParameterStructures.auto;
            Q.ParameterStructures.is(z) && (r = 1, NA = z);
            let JA = s.length;
            E.CancellationToken.is(IA) && (JA = JA - 1, v = IA);
            const oI = JA - r;
            switch (oI) {
              case 0:
                p = void 0;
                break;
              case 1:
                p = bg(NA, s[r]);
                break;
              default:
                if (NA === Q.ParameterStructures.byName)
                  throw new Error(`Received ${oI} parameters for 'by Name' request parameter structure.`);
                p = s.slice(r, JA).map((uA) => jI(uA));
                break;
            }
          } else {
            const z = s;
            S = w.method, p = MB(w, z);
            const IA = w.numberOfParams;
            v = E.CancellationToken.is(z[IA]) ? z[IA] : void 0;
          }
          const _ = H++;
          let P;
          return v && (P = v.onCancellationRequested(() => {
            const z = CI.sender.sendCancellation(RI, _);
            return z === void 0 ? (G.log(`Received no promise from cancellation strategy when cancelling id ${_}`), Promise.resolve()) : z.catch(() => {
              G.log(`Sending cancellation messages for id ${_} failed`);
            });
          })), new Promise((z, IA) => {
            const r = {
              jsonrpc: T,
              id: _,
              method: S,
              params: p
            }, NA = (uA) => {
              z(uA), CI.sender.cleanup(_), P == null || P.dispose();
            }, JA = (uA) => {
              IA(uA), CI.sender.cleanup(_), P == null || P.dispose();
            };
            let oI = { method: S, timerStart: Date.now(), resolve: NA, reject: JA };
            BE(r);
            try {
              n.write(r).catch(() => G.error("Sending request failed."));
            } catch (uA) {
              oI.reject(new Q.ResponseError(Q.ErrorCodes.MessageWriteError, uA.message ? uA.message : "Unknown reason")), oI = null;
            }
            oI && jA.set(_, oI);
          });
        },
        onRequest: (w, s) => {
          pI();
          let S = null;
          return F.is(w) ? (S = void 0, AA = w) : g.string(w) ? (S = null, s !== void 0 && (S = w, II.set(w, { handler: s, type: void 0 }))) : s !== void 0 && (S = w.method, II.set(w.method, { type: w, handler: s })), {
            dispose: () => {
              S !== null && (S !== void 0 ? II.delete(S) : AA = void 0);
            }
          };
        },
        hasPendingResponse: () => jA.size > 0,
        trace: async (w, s, S) => {
          let p = !1, v = k.Text;
          S !== void 0 && (g.boolean(S) ? p = S : (p = S.sendNotification || !1, v = S.traceFormat || k.Text)), u = w, m = v, u === h.Off ? Y = void 0 : Y = s, p && !DI() && !OA() && await RI.sendNotification(c.type, { value: h.toString(w) });
        },
        onError: d.event,
        onClose: R.event,
        onUnhandledNotification: MA.event,
        onDispose: fA.event,
        end: () => {
          n.end();
        },
        dispose: () => {
          if (OA())
            return;
          K = $.Disposed, fA.fire(void 0);
          const w = new Q.ResponseError(Q.ErrorCodes.PendingResponseRejected, "Pending response rejected since connection got disposed");
          for (const s of jA.values())
            s.reject(w);
          jA = /* @__PURE__ */ new Map(), qA = /* @__PURE__ */ new Map(), BI = /* @__PURE__ */ new Set(), pA = new B.LinkedMap(), g.func(n.dispose) && n.dispose(), g.func(Z.dispose) && Z.dispose();
        },
        listen: () => {
          pI(), oE(), K = $.Listening, Z.listen(ZA);
        },
        inspect: () => {
          (0, I.default)().console.log("inspect");
        }
      };
      return RI.onNotification(L.type, (w) => {
        if (u === h.Off || !Y)
          return;
        const s = u === h.Verbose || u === h.Compact;
        Y.log(w.message, s ? w.verbose : void 0);
      }), RI.onNotification(i.type, (w) => {
        const s = QI.get(w.token);
        s ? s(w.value) : KA.fire(w);
      }), RI;
    }
    A.createMessageConnection = wA;
  }(Tg)), Tg;
}
var ZB;
function HB() {
  return ZB || (ZB = 1, function(A) {
    Object.defineProperty(A, "__esModule", { value: !0 }), A.TraceFormat = A.TraceValues = A.Trace = A.ProgressType = A.ProgressToken = A.createMessageConnection = A.NullLogger = A.ConnectionOptions = A.ConnectionStrategy = A.WriteableStreamMessageWriter = A.AbstractMessageWriter = A.MessageWriter = A.ReadableStreamMessageReader = A.AbstractMessageReader = A.MessageReader = A.CancellationToken = A.CancellationTokenSource = A.Emitter = A.Event = A.Disposable = A.LRUCache = A.Touch = A.LinkedMap = A.ParameterStructures = A.NotificationType9 = A.NotificationType8 = A.NotificationType7 = A.NotificationType6 = A.NotificationType5 = A.NotificationType4 = A.NotificationType3 = A.NotificationType2 = A.NotificationType1 = A.NotificationType0 = A.NotificationType = A.ErrorCodes = A.ResponseError = A.RequestType9 = A.RequestType8 = A.RequestType7 = A.RequestType6 = A.RequestType5 = A.RequestType4 = A.RequestType3 = A.RequestType2 = A.RequestType1 = A.RequestType0 = A.RequestType = A.Message = A.RAL = void 0, A.CancellationStrategy = A.CancellationSenderStrategy = A.CancellationReceiverStrategy = A.ConnectionError = A.ConnectionErrors = A.LogTraceNotification = A.SetTraceNotification = void 0;
    const I = IC();
    Object.defineProperty(A, "Message", { enumerable: !0, get: function() {
      return I.Message;
    } }), Object.defineProperty(A, "RequestType", { enumerable: !0, get: function() {
      return I.RequestType;
    } }), Object.defineProperty(A, "RequestType0", { enumerable: !0, get: function() {
      return I.RequestType0;
    } }), Object.defineProperty(A, "RequestType1", { enumerable: !0, get: function() {
      return I.RequestType1;
    } }), Object.defineProperty(A, "RequestType2", { enumerable: !0, get: function() {
      return I.RequestType2;
    } }), Object.defineProperty(A, "RequestType3", { enumerable: !0, get: function() {
      return I.RequestType3;
    } }), Object.defineProperty(A, "RequestType4", { enumerable: !0, get: function() {
      return I.RequestType4;
    } }), Object.defineProperty(A, "RequestType5", { enumerable: !0, get: function() {
      return I.RequestType5;
    } }), Object.defineProperty(A, "RequestType6", { enumerable: !0, get: function() {
      return I.RequestType6;
    } }), Object.defineProperty(A, "RequestType7", { enumerable: !0, get: function() {
      return I.RequestType7;
    } }), Object.defineProperty(A, "RequestType8", { enumerable: !0, get: function() {
      return I.RequestType8;
    } }), Object.defineProperty(A, "RequestType9", { enumerable: !0, get: function() {
      return I.RequestType9;
    } }), Object.defineProperty(A, "ResponseError", { enumerable: !0, get: function() {
      return I.ResponseError;
    } }), Object.defineProperty(A, "ErrorCodes", { enumerable: !0, get: function() {
      return I.ErrorCodes;
    } }), Object.defineProperty(A, "NotificationType", { enumerable: !0, get: function() {
      return I.NotificationType;
    } }), Object.defineProperty(A, "NotificationType0", { enumerable: !0, get: function() {
      return I.NotificationType0;
    } }), Object.defineProperty(A, "NotificationType1", { enumerable: !0, get: function() {
      return I.NotificationType1;
    } }), Object.defineProperty(A, "NotificationType2", { enumerable: !0, get: function() {
      return I.NotificationType2;
    } }), Object.defineProperty(A, "NotificationType3", { enumerable: !0, get: function() {
      return I.NotificationType3;
    } }), Object.defineProperty(A, "NotificationType4", { enumerable: !0, get: function() {
      return I.NotificationType4;
    } }), Object.defineProperty(A, "NotificationType5", { enumerable: !0, get: function() {
      return I.NotificationType5;
    } }), Object.defineProperty(A, "NotificationType6", { enumerable: !0, get: function() {
      return I.NotificationType6;
    } }), Object.defineProperty(A, "NotificationType7", { enumerable: !0, get: function() {
      return I.NotificationType7;
    } }), Object.defineProperty(A, "NotificationType8", { enumerable: !0, get: function() {
      return I.NotificationType8;
    } }), Object.defineProperty(A, "NotificationType9", { enumerable: !0, get: function() {
      return I.NotificationType9;
    } }), Object.defineProperty(A, "ParameterStructures", { enumerable: !0, get: function() {
      return I.ParameterStructures;
    } });
    const g = gC();
    Object.defineProperty(A, "LinkedMap", { enumerable: !0, get: function() {
      return g.LinkedMap;
    } }), Object.defineProperty(A, "LRUCache", { enumerable: !0, get: function() {
      return g.LRUCache;
    } }), Object.defineProperty(A, "Touch", { enumerable: !0, get: function() {
      return g.Touch;
    } });
    const Q = CB;
    Object.defineProperty(A, "Disposable", { enumerable: !0, get: function() {
      return Q.Disposable;
    } });
    const B = YI;
    Object.defineProperty(A, "Event", { enumerable: !0, get: function() {
      return B.Event;
    } }), Object.defineProperty(A, "Emitter", { enumerable: !0, get: function() {
      return B.Emitter;
    } });
    const C = QC();
    Object.defineProperty(A, "CancellationTokenSource", { enumerable: !0, get: function() {
      return C.CancellationTokenSource;
    } }), Object.defineProperty(A, "CancellationToken", { enumerable: !0, get: function() {
      return C.CancellationToken;
    } });
    const E = yE();
    Object.defineProperty(A, "MessageReader", { enumerable: !0, get: function() {
      return E.MessageReader;
    } }), Object.defineProperty(A, "AbstractMessageReader", { enumerable: !0, get: function() {
      return E.AbstractMessageReader;
    } }), Object.defineProperty(A, "ReadableStreamMessageReader", { enumerable: !0, get: function() {
      return E.ReadableStreamMessageReader;
    } });
    const D = KE();
    Object.defineProperty(A, "MessageWriter", { enumerable: !0, get: function() {
      return D.MessageWriter;
    } }), Object.defineProperty(A, "AbstractMessageWriter", { enumerable: !0, get: function() {
      return D.AbstractMessageWriter;
    } }), Object.defineProperty(A, "WriteableStreamMessageWriter", { enumerable: !0, get: function() {
      return D.WriteableStreamMessageWriter;
    } });
    const o = ZE();
    Object.defineProperty(A, "ConnectionStrategy", { enumerable: !0, get: function() {
      return o.ConnectionStrategy;
    } }), Object.defineProperty(A, "ConnectionOptions", { enumerable: !0, get: function() {
      return o.ConnectionOptions;
    } }), Object.defineProperty(A, "NullLogger", { enumerable: !0, get: function() {
      return o.NullLogger;
    } }), Object.defineProperty(A, "createMessageConnection", { enumerable: !0, get: function() {
      return o.createMessageConnection;
    } }), Object.defineProperty(A, "ProgressToken", { enumerable: !0, get: function() {
      return o.ProgressToken;
    } }), Object.defineProperty(A, "ProgressType", { enumerable: !0, get: function() {
      return o.ProgressType;
    } }), Object.defineProperty(A, "Trace", { enumerable: !0, get: function() {
      return o.Trace;
    } }), Object.defineProperty(A, "TraceValues", { enumerable: !0, get: function() {
      return o.TraceValues;
    } }), Object.defineProperty(A, "TraceFormat", { enumerable: !0, get: function() {
      return o.TraceFormat;
    } }), Object.defineProperty(A, "SetTraceNotification", { enumerable: !0, get: function() {
      return o.SetTraceNotification;
    } }), Object.defineProperty(A, "LogTraceNotification", { enumerable: !0, get: function() {
      return o.LogTraceNotification;
    } }), Object.defineProperty(A, "ConnectionErrors", { enumerable: !0, get: function() {
      return o.ConnectionErrors;
    } }), Object.defineProperty(A, "ConnectionError", { enumerable: !0, get: function() {
      return o.ConnectionError;
    } }), Object.defineProperty(A, "CancellationReceiverStrategy", { enumerable: !0, get: function() {
      return o.CancellationReceiverStrategy;
    } }), Object.defineProperty(A, "CancellationSenderStrategy", { enumerable: !0, get: function() {
      return o.CancellationSenderStrategy;
    } }), Object.defineProperty(A, "CancellationStrategy", { enumerable: !0, get: function() {
      return o.CancellationStrategy;
    } });
    const i = tA;
    A.RAL = i.default;
  }(tg)), tg;
}
(function(A) {
  var I = GA && GA.__createBinding || (Object.create ? function(o, i, N, F) {
    F === void 0 && (F = N);
    var h = Object.getOwnPropertyDescriptor(i, N);
    (!h || ("get" in h ? !i.__esModule : h.writable || h.configurable)) && (h = { enumerable: !0, get: function() {
      return i[N];
    } }), Object.defineProperty(o, F, h);
  } : function(o, i, N, F) {
    F === void 0 && (F = N), o[F] = i[N];
  }), g = GA && GA.__exportStar || function(o, i) {
    for (var N in o)
      N !== "default" && !Object.prototype.hasOwnProperty.call(i, N) && I(i, o, N);
  };
  Object.defineProperty(A, "__esModule", { value: !0 }), A.createMessageConnection = A.BrowserMessageWriter = A.BrowserMessageReader = void 0, BB.default.install();
  const B = HB();
  g(HB(), A);
  class C extends B.AbstractMessageReader {
    constructor(i) {
      super(), this._onData = new B.Emitter(), this._messageListener = (N) => {
        this._onData.fire(N.data);
      }, i.addEventListener("error", (N) => this.fireError(N)), i.onmessage = this._messageListener;
    }
    listen(i) {
      return this._onData.event(i);
    }
  }
  A.BrowserMessageReader = C;
  class E extends B.AbstractMessageWriter {
    constructor(i) {
      super(), this.context = i, this.errorCount = 0, i.addEventListener("error", (N) => this.fireError(N));
    }
    write(i) {
      try {
        return this.context.postMessage(i), Promise.resolve();
      } catch (N) {
        return this.handleError(N, i), Promise.reject(N);
      }
    }
    handleError(i, N) {
      this.errorCount++, this.fireError(i, N, this.errorCount);
    }
    end() {
    }
  }
  A.BrowserMessageWriter = E;
  function D(o, i, N, F) {
    return N === void 0 && (N = B.NullLogger), B.ConnectionStrategy.is(F) && (F = { connectionStrategy: F }), (0, B.createMessageConnection)(o, i, N, F);
  }
  A.createMessageConnection = D;
})(FI);
var SB = FI, BC = {}, EQ;
(function(A) {
  function I(g) {
    return typeof g == "string";
  }
  A.is = I;
})(EQ || (EQ = {}));
var og;
(function(A) {
  function I(g) {
    return typeof g == "string";
  }
  A.is = I;
})(og || (og = {}));
var DQ;
(function(A) {
  A.MIN_VALUE = -2147483648, A.MAX_VALUE = 2147483647;
  function I(g) {
    return typeof g == "number" && A.MIN_VALUE <= g && g <= A.MAX_VALUE;
  }
  A.is = I;
})(DQ || (DQ = {}));
var nI;
(function(A) {
  A.MIN_VALUE = 0, A.MAX_VALUE = 2147483647;
  function I(g) {
    return typeof g == "number" && A.MIN_VALUE <= g && g <= A.MAX_VALUE;
  }
  A.is = I;
})(nI || (nI = {}));
var SA;
(function(A) {
  function I(Q, B) {
    return Q === Number.MAX_VALUE && (Q = nI.MAX_VALUE), B === Number.MAX_VALUE && (B = nI.MAX_VALUE), { line: Q, character: B };
  }
  A.create = I;
  function g(Q) {
    var B = Q;
    return M.objectLiteral(B) && M.uinteger(B.line) && M.uinteger(B.character);
  }
  A.is = g;
})(SA || (SA = {}));
var BA;
(function(A) {
  function I(Q, B, C, E) {
    if (M.uinteger(Q) && M.uinteger(B) && M.uinteger(C) && M.uinteger(E))
      return { start: SA.create(Q, B), end: SA.create(C, E) };
    if (SA.is(Q) && SA.is(B))
      return { start: Q, end: B };
    throw new Error("Range#create called with invalid arguments[".concat(Q, ", ").concat(B, ", ").concat(C, ", ").concat(E, "]"));
  }
  A.create = I;
  function g(Q) {
    var B = Q;
    return M.objectLiteral(B) && SA.is(B.start) && SA.is(B.end);
  }
  A.is = g;
})(BA || (BA = {}));
var WI;
(function(A) {
  function I(Q, B) {
    return { uri: Q, range: B };
  }
  A.create = I;
  function g(Q) {
    var B = Q;
    return M.objectLiteral(B) && BA.is(B.range) && (M.string(B.uri) || M.undefined(B.uri));
  }
  A.is = g;
})(WI || (WI = {}));
var oQ;
(function(A) {
  function I(Q, B, C, E) {
    return { targetUri: Q, targetRange: B, targetSelectionRange: C, originSelectionRange: E };
  }
  A.create = I;
  function g(Q) {
    var B = Q;
    return M.objectLiteral(B) && BA.is(B.targetRange) && M.string(B.targetUri) && BA.is(B.targetSelectionRange) && (BA.is(B.originSelectionRange) || M.undefined(B.originSelectionRange));
  }
  A.is = g;
})(oQ || (oQ = {}));
var Gg;
(function(A) {
  function I(Q, B, C, E) {
    return {
      red: Q,
      green: B,
      blue: C,
      alpha: E
    };
  }
  A.create = I;
  function g(Q) {
    var B = Q;
    return M.objectLiteral(B) && M.numberRange(B.red, 0, 1) && M.numberRange(B.green, 0, 1) && M.numberRange(B.blue, 0, 1) && M.numberRange(B.alpha, 0, 1);
  }
  A.is = g;
})(Gg || (Gg = {}));
var GQ;
(function(A) {
  function I(Q, B) {
    return {
      range: Q,
      color: B
    };
  }
  A.create = I;
  function g(Q) {
    var B = Q;
    return M.objectLiteral(B) && BA.is(B.range) && Gg.is(B.color);
  }
  A.is = g;
})(GQ || (GQ = {}));
var iQ;
(function(A) {
  function I(Q, B, C) {
    return {
      label: Q,
      textEdit: B,
      additionalTextEdits: C
    };
  }
  A.create = I;
  function g(Q) {
    var B = Q;
    return M.objectLiteral(B) && M.string(B.label) && (M.undefined(B.textEdit) || bA.is(B)) && (M.undefined(B.additionalTextEdits) || M.typedArray(B.additionalTextEdits, bA.is));
  }
  A.is = g;
})(iQ || (iQ = {}));
var wQ;
(function(A) {
  A.Comment = "comment", A.Imports = "imports", A.Region = "region";
})(wQ || (wQ = {}));
var NQ;
(function(A) {
  function I(Q, B, C, E, D, o) {
    var i = {
      startLine: Q,
      endLine: B
    };
    return M.defined(C) && (i.startCharacter = C), M.defined(E) && (i.endCharacter = E), M.defined(D) && (i.kind = D), M.defined(o) && (i.collapsedText = o), i;
  }
  A.create = I;
  function g(Q) {
    var B = Q;
    return M.objectLiteral(B) && M.uinteger(B.startLine) && M.uinteger(B.startLine) && (M.undefined(B.startCharacter) || M.uinteger(B.startCharacter)) && (M.undefined(B.endCharacter) || M.uinteger(B.endCharacter)) && (M.undefined(B.kind) || M.string(B.kind));
  }
  A.is = g;
})(NQ || (NQ = {}));
var ig;
(function(A) {
  function I(Q, B) {
    return {
      location: Q,
      message: B
    };
  }
  A.create = I;
  function g(Q) {
    var B = Q;
    return M.defined(B) && WI.is(B.location) && M.string(B.message);
  }
  A.is = g;
})(ig || (ig = {}));
var kQ;
(function(A) {
  A.Error = 1, A.Warning = 2, A.Information = 3, A.Hint = 4;
})(kQ || (kQ = {}));
var hQ;
(function(A) {
  A.Unnecessary = 1, A.Deprecated = 2;
})(hQ || (hQ = {}));
var FQ;
(function(A) {
  function I(g) {
    var Q = g;
    return M.objectLiteral(Q) && M.string(Q.href);
  }
  A.is = I;
})(FQ || (FQ = {}));
var XI;
(function(A) {
  function I(Q, B, C, E, D, o) {
    var i = { range: Q, message: B };
    return M.defined(C) && (i.severity = C), M.defined(E) && (i.code = E), M.defined(D) && (i.source = D), M.defined(o) && (i.relatedInformation = o), i;
  }
  A.create = I;
  function g(Q) {
    var B, C = Q;
    return M.defined(C) && BA.is(C.range) && M.string(C.message) && (M.number(C.severity) || M.undefined(C.severity)) && (M.integer(C.code) || M.string(C.code) || M.undefined(C.code)) && (M.undefined(C.codeDescription) || M.string((B = C.codeDescription) === null || B === void 0 ? void 0 : B.href)) && (M.string(C.source) || M.undefined(C.source)) && (M.undefined(C.relatedInformation) || M.typedArray(C.relatedInformation, ig.is));
  }
  A.is = g;
})(XI || (XI = {}));
var NI;
(function(A) {
  function I(Q, B) {
    for (var C = [], E = 2; E < arguments.length; E++)
      C[E - 2] = arguments[E];
    var D = { title: Q, command: B };
    return M.defined(C) && C.length > 0 && (D.arguments = C), D;
  }
  A.create = I;
  function g(Q) {
    var B = Q;
    return M.defined(B) && M.string(B.title) && M.string(B.command);
  }
  A.is = g;
})(NI || (NI = {}));
var bA;
(function(A) {
  function I(C, E) {
    return { range: C, newText: E };
  }
  A.replace = I;
  function g(C, E) {
    return { range: { start: C, end: C }, newText: E };
  }
  A.insert = g;
  function Q(C) {
    return { range: C, newText: "" };
  }
  A.del = Q;
  function B(C) {
    var E = C;
    return M.objectLiteral(E) && M.string(E.newText) && BA.is(E.range);
  }
  A.is = B;
})(bA || (bA = {}));
var wI;
(function(A) {
  function I(Q, B, C) {
    var E = { label: Q };
    return B !== void 0 && (E.needsConfirmation = B), C !== void 0 && (E.description = C), E;
  }
  A.create = I;
  function g(Q) {
    var B = Q;
    return M.objectLiteral(B) && M.string(B.label) && (M.boolean(B.needsConfirmation) || B.needsConfirmation === void 0) && (M.string(B.description) || B.description === void 0);
  }
  A.is = g;
})(wI || (wI = {}));
var aA;
(function(A) {
  function I(g) {
    var Q = g;
    return M.string(Q);
  }
  A.is = I;
})(aA || (aA = {}));
var WA;
(function(A) {
  function I(C, E, D) {
    return { range: C, newText: E, annotationId: D };
  }
  A.replace = I;
  function g(C, E, D) {
    return { range: { start: C, end: C }, newText: E, annotationId: D };
  }
  A.insert = g;
  function Q(C, E) {
    return { range: C, newText: "", annotationId: E };
  }
  A.del = Q;
  function B(C) {
    var E = C;
    return bA.is(E) && (wI.is(E.annotationId) || aA.is(E.annotationId));
  }
  A.is = B;
})(WA || (WA = {}));
var xI;
(function(A) {
  function I(Q, B) {
    return { textDocument: Q, edits: B };
  }
  A.create = I;
  function g(Q) {
    var B = Q;
    return M.defined(B) && VI.is(B.textDocument) && Array.isArray(B.edits);
  }
  A.is = g;
})(xI || (xI = {}));
var ZI;
(function(A) {
  function I(Q, B, C) {
    var E = {
      kind: "create",
      uri: Q
    };
    return B !== void 0 && (B.overwrite !== void 0 || B.ignoreIfExists !== void 0) && (E.options = B), C !== void 0 && (E.annotationId = C), E;
  }
  A.create = I;
  function g(Q) {
    var B = Q;
    return B && B.kind === "create" && M.string(B.uri) && (B.options === void 0 || (B.options.overwrite === void 0 || M.boolean(B.options.overwrite)) && (B.options.ignoreIfExists === void 0 || M.boolean(B.options.ignoreIfExists))) && (B.annotationId === void 0 || aA.is(B.annotationId));
  }
  A.is = g;
})(ZI || (ZI = {}));
var HI;
(function(A) {
  function I(Q, B, C, E) {
    var D = {
      kind: "rename",
      oldUri: Q,
      newUri: B
    };
    return C !== void 0 && (C.overwrite !== void 0 || C.ignoreIfExists !== void 0) && (D.options = C), E !== void 0 && (D.annotationId = E), D;
  }
  A.create = I;
  function g(Q) {
    var B = Q;
    return B && B.kind === "rename" && M.string(B.oldUri) && M.string(B.newUri) && (B.options === void 0 || (B.options.overwrite === void 0 || M.boolean(B.options.overwrite)) && (B.options.ignoreIfExists === void 0 || M.boolean(B.options.ignoreIfExists))) && (B.annotationId === void 0 || aA.is(B.annotationId));
  }
  A.is = g;
})(HI || (HI = {}));
var SI;
(function(A) {
  function I(Q, B, C) {
    var E = {
      kind: "delete",
      uri: Q
    };
    return B !== void 0 && (B.recursive !== void 0 || B.ignoreIfNotExists !== void 0) && (E.options = B), C !== void 0 && (E.annotationId = C), E;
  }
  A.create = I;
  function g(Q) {
    var B = Q;
    return B && B.kind === "delete" && M.string(B.uri) && (B.options === void 0 || (B.options.recursive === void 0 || M.boolean(B.options.recursive)) && (B.options.ignoreIfNotExists === void 0 || M.boolean(B.options.ignoreIfNotExists))) && (B.annotationId === void 0 || aA.is(B.annotationId));
  }
  A.is = g;
})(SI || (SI = {}));
var wg;
(function(A) {
  function I(g) {
    var Q = g;
    return Q && (Q.changes !== void 0 || Q.documentChanges !== void 0) && (Q.documentChanges === void 0 || Q.documentChanges.every(function(B) {
      return M.string(B.kind) ? ZI.is(B) || HI.is(B) || SI.is(B) : xI.is(B);
    }));
  }
  A.is = I;
})(wg || (wg = {}));
var Ag = (
  /** @class */
  function() {
    function A(I, g) {
      this.edits = I, this.changeAnnotations = g;
    }
    return A.prototype.insert = function(I, g, Q) {
      var B, C;
      if (Q === void 0 ? B = bA.insert(I, g) : aA.is(Q) ? (C = Q, B = WA.insert(I, g, Q)) : (this.assertChangeAnnotations(this.changeAnnotations), C = this.changeAnnotations.manage(Q), B = WA.insert(I, g, C)), this.edits.push(B), C !== void 0)
        return C;
    }, A.prototype.replace = function(I, g, Q) {
      var B, C;
      if (Q === void 0 ? B = bA.replace(I, g) : aA.is(Q) ? (C = Q, B = WA.replace(I, g, Q)) : (this.assertChangeAnnotations(this.changeAnnotations), C = this.changeAnnotations.manage(Q), B = WA.replace(I, g, C)), this.edits.push(B), C !== void 0)
        return C;
    }, A.prototype.delete = function(I, g) {
      var Q, B;
      if (g === void 0 ? Q = bA.del(I) : aA.is(g) ? (B = g, Q = WA.del(I, g)) : (this.assertChangeAnnotations(this.changeAnnotations), B = this.changeAnnotations.manage(g), Q = WA.del(I, B)), this.edits.push(Q), B !== void 0)
        return B;
    }, A.prototype.add = function(I) {
      this.edits.push(I);
    }, A.prototype.all = function() {
      return this.edits;
    }, A.prototype.clear = function() {
      this.edits.splice(0, this.edits.length);
    }, A.prototype.assertChangeAnnotations = function(I) {
      if (I === void 0)
        throw new Error("Text edit change is not configured to manage change annotations.");
    }, A;
  }()
), LB = (
  /** @class */
  function() {
    function A(I) {
      this._annotations = I === void 0 ? /* @__PURE__ */ Object.create(null) : I, this._counter = 0, this._size = 0;
    }
    return A.prototype.all = function() {
      return this._annotations;
    }, Object.defineProperty(A.prototype, "size", {
      get: function() {
        return this._size;
      },
      enumerable: !1,
      configurable: !0
    }), A.prototype.manage = function(I, g) {
      var Q;
      if (aA.is(I) ? Q = I : (Q = this.nextId(), g = I), this._annotations[Q] !== void 0)
        throw new Error("Id ".concat(Q, " is already in use."));
      if (g === void 0)
        throw new Error("No annotation provided for id ".concat(Q));
      return this._annotations[Q] = g, this._size++, Q;
    }, A.prototype.nextId = function() {
      return this._counter++, this._counter.toString();
    }, A;
  }()
), HE = (
  /** @class */
  function() {
    function A(I) {
      var g = this;
      this._textEditChanges = /* @__PURE__ */ Object.create(null), I !== void 0 ? (this._workspaceEdit = I, I.documentChanges ? (this._changeAnnotations = new LB(I.changeAnnotations), I.changeAnnotations = this._changeAnnotations.all(), I.documentChanges.forEach(function(Q) {
        if (xI.is(Q)) {
          var B = new Ag(Q.edits, g._changeAnnotations);
          g._textEditChanges[Q.textDocument.uri] = B;
        }
      })) : I.changes && Object.keys(I.changes).forEach(function(Q) {
        var B = new Ag(I.changes[Q]);
        g._textEditChanges[Q] = B;
      })) : this._workspaceEdit = {};
    }
    return Object.defineProperty(A.prototype, "edit", {
      /**
       * Returns the underlying [WorkspaceEdit](#WorkspaceEdit) literal
       * use to be returned from a workspace edit operation like rename.
       */
      get: function() {
        return this.initDocumentChanges(), this._changeAnnotations !== void 0 && (this._changeAnnotations.size === 0 ? this._workspaceEdit.changeAnnotations = void 0 : this._workspaceEdit.changeAnnotations = this._changeAnnotations.all()), this._workspaceEdit;
      },
      enumerable: !1,
      configurable: !0
    }), A.prototype.getTextEditChange = function(I) {
      if (VI.is(I)) {
        if (this.initDocumentChanges(), this._workspaceEdit.documentChanges === void 0)
          throw new Error("Workspace edit is not configured for document changes.");
        var g = { uri: I.uri, version: I.version }, Q = this._textEditChanges[g.uri];
        if (!Q) {
          var B = [], C = {
            textDocument: g,
            edits: B
          };
          this._workspaceEdit.documentChanges.push(C), Q = new Ag(B, this._changeAnnotations), this._textEditChanges[g.uri] = Q;
        }
        return Q;
      } else {
        if (this.initChanges(), this._workspaceEdit.changes === void 0)
          throw new Error("Workspace edit is not configured for normal text edit changes.");
        var Q = this._textEditChanges[I];
        if (!Q) {
          var B = [];
          this._workspaceEdit.changes[I] = B, Q = new Ag(B), this._textEditChanges[I] = Q;
        }
        return Q;
      }
    }, A.prototype.initDocumentChanges = function() {
      this._workspaceEdit.documentChanges === void 0 && this._workspaceEdit.changes === void 0 && (this._changeAnnotations = new LB(), this._workspaceEdit.documentChanges = [], this._workspaceEdit.changeAnnotations = this._changeAnnotations.all());
    }, A.prototype.initChanges = function() {
      this._workspaceEdit.documentChanges === void 0 && this._workspaceEdit.changes === void 0 && (this._workspaceEdit.changes = /* @__PURE__ */ Object.create(null));
    }, A.prototype.createFile = function(I, g, Q) {
      if (this.initDocumentChanges(), this._workspaceEdit.documentChanges === void 0)
        throw new Error("Workspace edit is not configured for document changes.");
      var B;
      wI.is(g) || aA.is(g) ? B = g : Q = g;
      var C, E;
      if (B === void 0 ? C = ZI.create(I, Q) : (E = aA.is(B) ? B : this._changeAnnotations.manage(B), C = ZI.create(I, Q, E)), this._workspaceEdit.documentChanges.push(C), E !== void 0)
        return E;
    }, A.prototype.renameFile = function(I, g, Q, B) {
      if (this.initDocumentChanges(), this._workspaceEdit.documentChanges === void 0)
        throw new Error("Workspace edit is not configured for document changes.");
      var C;
      wI.is(Q) || aA.is(Q) ? C = Q : B = Q;
      var E, D;
      if (C === void 0 ? E = HI.create(I, g, B) : (D = aA.is(C) ? C : this._changeAnnotations.manage(C), E = HI.create(I, g, B, D)), this._workspaceEdit.documentChanges.push(E), D !== void 0)
        return D;
    }, A.prototype.deleteFile = function(I, g, Q) {
      if (this.initDocumentChanges(), this._workspaceEdit.documentChanges === void 0)
        throw new Error("Workspace edit is not configured for document changes.");
      var B;
      wI.is(g) || aA.is(g) ? B = g : Q = g;
      var C, E;
      if (B === void 0 ? C = SI.create(I, Q) : (E = aA.is(B) ? B : this._changeAnnotations.manage(B), C = SI.create(I, Q, E)), this._workspaceEdit.documentChanges.push(C), E !== void 0)
        return E;
    }, A;
  }()
), YQ;
(function(A) {
  function I(Q) {
    return { uri: Q };
  }
  A.create = I;
  function g(Q) {
    var B = Q;
    return M.defined(B) && M.string(B.uri);
  }
  A.is = g;
})(YQ || (YQ = {}));
var MQ;
(function(A) {
  function I(Q, B) {
    return { uri: Q, version: B };
  }
  A.create = I;
  function g(Q) {
    var B = Q;
    return M.defined(B) && M.string(B.uri) && M.integer(B.version);
  }
  A.is = g;
})(MQ || (MQ = {}));
var VI;
(function(A) {
  function I(Q, B) {
    return { uri: Q, version: B };
  }
  A.create = I;
  function g(Q) {
    var B = Q;
    return M.defined(B) && M.string(B.uri) && (B.version === null || M.integer(B.version));
  }
  A.is = g;
})(VI || (VI = {}));
var cQ;
(function(A) {
  function I(Q, B, C, E) {
    return { uri: Q, languageId: B, version: C, text: E };
  }
  A.create = I;
  function g(Q) {
    var B = Q;
    return M.defined(B) && M.string(B.uri) && M.string(B.languageId) && M.integer(B.version) && M.string(B.text);
  }
  A.is = g;
})(cQ || (cQ = {}));
var Ng;
(function(A) {
  A.PlainText = "plaintext", A.Markdown = "markdown";
  function I(g) {
    var Q = g;
    return Q === A.PlainText || Q === A.Markdown;
  }
  A.is = I;
})(Ng || (Ng = {}));
var LI;
(function(A) {
  function I(g) {
    var Q = g;
    return M.objectLiteral(g) && Ng.is(Q.kind) && M.string(Q.value);
  }
  A.is = I;
})(LI || (LI = {}));
var aQ;
(function(A) {
  A.Text = 1, A.Method = 2, A.Function = 3, A.Constructor = 4, A.Field = 5, A.Variable = 6, A.Class = 7, A.Interface = 8, A.Module = 9, A.Property = 10, A.Unit = 11, A.Value = 12, A.Enum = 13, A.Keyword = 14, A.Snippet = 15, A.Color = 16, A.File = 17, A.Reference = 18, A.Folder = 19, A.EnumMember = 20, A.Constant = 21, A.Struct = 22, A.Event = 23, A.Operator = 24, A.TypeParameter = 25;
})(aQ || (aQ = {}));
var RQ;
(function(A) {
  A.PlainText = 1, A.Snippet = 2;
})(RQ || (RQ = {}));
var JQ;
(function(A) {
  A.Deprecated = 1;
})(JQ || (JQ = {}));
var UQ;
(function(A) {
  function I(Q, B, C) {
    return { newText: Q, insert: B, replace: C };
  }
  A.create = I;
  function g(Q) {
    var B = Q;
    return B && M.string(B.newText) && BA.is(B.insert) && BA.is(B.replace);
  }
  A.is = g;
})(UQ || (UQ = {}));
var yQ;
(function(A) {
  A.asIs = 1, A.adjustIndentation = 2;
})(yQ || (yQ = {}));
var sQ;
(function(A) {
  function I(g) {
    var Q = g;
    return Q && (M.string(Q.detail) || Q.detail === void 0) && (M.string(Q.description) || Q.description === void 0);
  }
  A.is = I;
})(sQ || (sQ = {}));
var KQ;
(function(A) {
  function I(g) {
    return { label: g };
  }
  A.create = I;
})(KQ || (KQ = {}));
var ZQ;
(function(A) {
  function I(g, Q) {
    return { items: g || [], isIncomplete: !!Q };
  }
  A.create = I;
})(ZQ || (ZQ = {}));
var TI;
(function(A) {
  function I(Q) {
    return Q.replace(/[\\`*_{}[\]()#+\-.!]/g, "\\$&");
  }
  A.fromPlainText = I;
  function g(Q) {
    var B = Q;
    return M.string(B) || M.objectLiteral(B) && M.string(B.language) && M.string(B.value);
  }
  A.is = g;
})(TI || (TI = {}));
var HQ;
(function(A) {
  function I(g) {
    var Q = g;
    return !!Q && M.objectLiteral(Q) && (LI.is(Q.contents) || TI.is(Q.contents) || M.typedArray(Q.contents, TI.is)) && (g.range === void 0 || BA.is(g.range));
  }
  A.is = I;
})(HQ || (HQ = {}));
var SQ;
(function(A) {
  function I(g, Q) {
    return Q ? { label: g, documentation: Q } : { label: g };
  }
  A.create = I;
})(SQ || (SQ = {}));
var LQ;
(function(A) {
  function I(g, Q) {
    for (var B = [], C = 2; C < arguments.length; C++)
      B[C - 2] = arguments[C];
    var E = { label: g };
    return M.defined(Q) && (E.documentation = Q), M.defined(B) ? E.parameters = B : E.parameters = [], E;
  }
  A.create = I;
})(LQ || (LQ = {}));
var qQ;
(function(A) {
  A.Text = 1, A.Read = 2, A.Write = 3;
})(qQ || (qQ = {}));
var OQ;
(function(A) {
  function I(g, Q) {
    var B = { range: g };
    return M.number(Q) && (B.kind = Q), B;
  }
  A.create = I;
})(OQ || (OQ = {}));
var lQ;
(function(A) {
  A.File = 1, A.Module = 2, A.Namespace = 3, A.Package = 4, A.Class = 5, A.Method = 6, A.Property = 7, A.Field = 8, A.Constructor = 9, A.Enum = 10, A.Interface = 11, A.Function = 12, A.Variable = 13, A.Constant = 14, A.String = 15, A.Number = 16, A.Boolean = 17, A.Array = 18, A.Object = 19, A.Key = 20, A.Null = 21, A.EnumMember = 22, A.Struct = 23, A.Event = 24, A.Operator = 25, A.TypeParameter = 26;
})(lQ || (lQ = {}));
var pQ;
(function(A) {
  A.Deprecated = 1;
})(pQ || (pQ = {}));
var jQ;
(function(A) {
  function I(g, Q, B, C, E) {
    var D = {
      name: g,
      kind: Q,
      location: { uri: C, range: B }
    };
    return E && (D.containerName = E), D;
  }
  A.create = I;
})(jQ || (jQ = {}));
var mQ;
(function(A) {
  function I(g, Q, B, C) {
    return C !== void 0 ? { name: g, kind: Q, location: { uri: B, range: C } } : { name: g, kind: Q, location: { uri: B } };
  }
  A.create = I;
})(mQ || (mQ = {}));
var eQ;
(function(A) {
  function I(Q, B, C, E, D, o) {
    var i = {
      name: Q,
      detail: B,
      kind: C,
      range: E,
      selectionRange: D
    };
    return o !== void 0 && (i.children = o), i;
  }
  A.create = I;
  function g(Q) {
    var B = Q;
    return B && M.string(B.name) && M.number(B.kind) && BA.is(B.range) && BA.is(B.selectionRange) && (B.detail === void 0 || M.string(B.detail)) && (B.deprecated === void 0 || M.boolean(B.deprecated)) && (B.children === void 0 || Array.isArray(B.children)) && (B.tags === void 0 || Array.isArray(B.tags));
  }
  A.is = g;
})(eQ || (eQ = {}));
var dQ;
(function(A) {
  A.Empty = "", A.QuickFix = "quickfix", A.Refactor = "refactor", A.RefactorExtract = "refactor.extract", A.RefactorInline = "refactor.inline", A.RefactorRewrite = "refactor.rewrite", A.Source = "source", A.SourceOrganizeImports = "source.organizeImports", A.SourceFixAll = "source.fixAll";
})(dQ || (dQ = {}));
var zI;
(function(A) {
  A.Invoked = 1, A.Automatic = 2;
})(zI || (zI = {}));
var bQ;
(function(A) {
  function I(Q, B, C) {
    var E = { diagnostics: Q };
    return B != null && (E.only = B), C != null && (E.triggerKind = C), E;
  }
  A.create = I;
  function g(Q) {
    var B = Q;
    return M.defined(B) && M.typedArray(B.diagnostics, XI.is) && (B.only === void 0 || M.typedArray(B.only, M.string)) && (B.triggerKind === void 0 || B.triggerKind === zI.Invoked || B.triggerKind === zI.Automatic);
  }
  A.is = g;
})(bQ || (bQ = {}));
var tQ;
(function(A) {
  function I(Q, B, C) {
    var E = { title: Q }, D = !0;
    return typeof B == "string" ? (D = !1, E.kind = B) : NI.is(B) ? E.command = B : E.edit = B, D && C !== void 0 && (E.kind = C), E;
  }
  A.create = I;
  function g(Q) {
    var B = Q;
    return B && M.string(B.title) && (B.diagnostics === void 0 || M.typedArray(B.diagnostics, XI.is)) && (B.kind === void 0 || M.string(B.kind)) && (B.edit !== void 0 || B.command !== void 0) && (B.command === void 0 || NI.is(B.command)) && (B.isPreferred === void 0 || M.boolean(B.isPreferred)) && (B.edit === void 0 || wg.is(B.edit));
  }
  A.is = g;
})(tQ || (tQ = {}));
var nQ;
(function(A) {
  function I(Q, B) {
    var C = { range: Q };
    return M.defined(B) && (C.data = B), C;
  }
  A.create = I;
  function g(Q) {
    var B = Q;
    return M.defined(B) && BA.is(B.range) && (M.undefined(B.command) || NI.is(B.command));
  }
  A.is = g;
})(nQ || (nQ = {}));
var WQ;
(function(A) {
  function I(Q, B) {
    return { tabSize: Q, insertSpaces: B };
  }
  A.create = I;
  function g(Q) {
    var B = Q;
    return M.defined(B) && M.uinteger(B.tabSize) && M.boolean(B.insertSpaces);
  }
  A.is = g;
})(WQ || (WQ = {}));
var XQ;
(function(A) {
  function I(Q, B, C) {
    return { range: Q, target: B, data: C };
  }
  A.create = I;
  function g(Q) {
    var B = Q;
    return M.defined(B) && BA.is(B.range) && (M.undefined(B.target) || M.string(B.target));
  }
  A.is = g;
})(XQ || (XQ = {}));
var xQ;
(function(A) {
  function I(Q, B) {
    return { range: Q, parent: B };
  }
  A.create = I;
  function g(Q) {
    var B = Q;
    return M.objectLiteral(B) && BA.is(B.range) && (B.parent === void 0 || A.is(B.parent));
  }
  A.is = g;
})(xQ || (xQ = {}));
var VQ;
(function(A) {
  A.namespace = "namespace", A.type = "type", A.class = "class", A.enum = "enum", A.interface = "interface", A.struct = "struct", A.typeParameter = "typeParameter", A.parameter = "parameter", A.variable = "variable", A.property = "property", A.enumMember = "enumMember", A.event = "event", A.function = "function", A.method = "method", A.macro = "macro", A.keyword = "keyword", A.modifier = "modifier", A.comment = "comment", A.string = "string", A.number = "number", A.regexp = "regexp", A.operator = "operator", A.decorator = "decorator";
})(VQ || (VQ = {}));
var TQ;
(function(A) {
  A.declaration = "declaration", A.definition = "definition", A.readonly = "readonly", A.static = "static", A.deprecated = "deprecated", A.abstract = "abstract", A.async = "async", A.modification = "modification", A.documentation = "documentation", A.defaultLibrary = "defaultLibrary";
})(TQ || (TQ = {}));
var zQ;
(function(A) {
  function I(g) {
    var Q = g;
    return M.objectLiteral(Q) && (Q.resultId === void 0 || typeof Q.resultId == "string") && Array.isArray(Q.data) && (Q.data.length === 0 || typeof Q.data[0] == "number");
  }
  A.is = I;
})(zQ || (zQ = {}));
var fQ;
(function(A) {
  function I(Q, B) {
    return { range: Q, text: B };
  }
  A.create = I;
  function g(Q) {
    var B = Q;
    return B != null && BA.is(B.range) && M.string(B.text);
  }
  A.is = g;
})(fQ || (fQ = {}));
var rQ;
(function(A) {
  function I(Q, B, C) {
    return { range: Q, variableName: B, caseSensitiveLookup: C };
  }
  A.create = I;
  function g(Q) {
    var B = Q;
    return B != null && BA.is(B.range) && M.boolean(B.caseSensitiveLookup) && (M.string(B.variableName) || B.variableName === void 0);
  }
  A.is = g;
})(rQ || (rQ = {}));
var uQ;
(function(A) {
  function I(Q, B) {
    return { range: Q, expression: B };
  }
  A.create = I;
  function g(Q) {
    var B = Q;
    return B != null && BA.is(B.range) && (M.string(B.expression) || B.expression === void 0);
  }
  A.is = g;
})(uQ || (uQ = {}));
var PQ;
(function(A) {
  function I(Q, B) {
    return { frameId: Q, stoppedLocation: B };
  }
  A.create = I;
  function g(Q) {
    var B = Q;
    return M.defined(B) && BA.is(Q.stoppedLocation);
  }
  A.is = g;
})(PQ || (PQ = {}));
var kg;
(function(A) {
  A.Type = 1, A.Parameter = 2;
  function I(g) {
    return g === 1 || g === 2;
  }
  A.is = I;
})(kg || (kg = {}));
var hg;
(function(A) {
  function I(Q) {
    return { value: Q };
  }
  A.create = I;
  function g(Q) {
    var B = Q;
    return M.objectLiteral(B) && (B.tooltip === void 0 || M.string(B.tooltip) || LI.is(B.tooltip)) && (B.location === void 0 || WI.is(B.location)) && (B.command === void 0 || NI.is(B.command));
  }
  A.is = g;
})(hg || (hg = {}));
var vQ;
(function(A) {
  function I(Q, B, C) {
    var E = { position: Q, label: B };
    return C !== void 0 && (E.kind = C), E;
  }
  A.create = I;
  function g(Q) {
    var B = Q;
    return M.objectLiteral(B) && SA.is(B.position) && (M.string(B.label) || M.typedArray(B.label, hg.is)) && (B.kind === void 0 || kg.is(B.kind)) && B.textEdits === void 0 || M.typedArray(B.textEdits, bA.is) && (B.tooltip === void 0 || M.string(B.tooltip) || LI.is(B.tooltip)) && (B.paddingLeft === void 0 || M.boolean(B.paddingLeft)) && (B.paddingRight === void 0 || M.boolean(B.paddingRight));
  }
  A.is = g;
})(vQ || (vQ = {}));
var _Q;
(function(A) {
  function I(g) {
    var Q = g;
    return M.objectLiteral(Q) && og.is(Q.uri) && M.string(Q.name);
  }
  A.is = I;
})(_Q || (_Q = {}));
var SE = [`
`, `\r
`, "\r"], $Q;
(function(A) {
  function I(C, E, D, o) {
    return new LE(C, E, D, o);
  }
  A.create = I;
  function g(C) {
    var E = C;
    return !!(M.defined(E) && M.string(E.uri) && (M.undefined(E.languageId) || M.string(E.languageId)) && M.uinteger(E.lineCount) && M.func(E.getText) && M.func(E.positionAt) && M.func(E.offsetAt));
  }
  A.is = g;
  function Q(C, E) {
    for (var D = C.getText(), o = B(E, function(c, L) {
      var O = c.range.start.line - L.range.start.line;
      return O === 0 ? c.range.start.character - L.range.start.character : O;
    }), i = D.length, N = o.length - 1; N >= 0; N--) {
      var F = o[N], h = C.offsetAt(F.range.start), k = C.offsetAt(F.range.end);
      if (k <= i)
        D = D.substring(0, h) + F.newText + D.substring(k, D.length);
      else
        throw new Error("Overlapping edit");
      i = h;
    }
    return D;
  }
  A.applyEdits = Q;
  function B(C, E) {
    if (C.length <= 1)
      return C;
    var D = C.length / 2 | 0, o = C.slice(0, D), i = C.slice(D);
    B(o, E), B(i, E);
    for (var N = 0, F = 0, h = 0; N < o.length && F < i.length; ) {
      var k = E(o[N], i[F]);
      k <= 0 ? C[h++] = o[N++] : C[h++] = i[F++];
    }
    for (; N < o.length; )
      C[h++] = o[N++];
    for (; F < i.length; )
      C[h++] = i[F++];
    return C;
  }
})($Q || ($Q = {}));
var LE = (
  /** @class */
  function() {
    function A(I, g, Q, B) {
      this._uri = I, this._languageId = g, this._version = Q, this._content = B, this._lineOffsets = void 0;
    }
    return Object.defineProperty(A.prototype, "uri", {
      get: function() {
        return this._uri;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(A.prototype, "languageId", {
      get: function() {
        return this._languageId;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(A.prototype, "version", {
      get: function() {
        return this._version;
      },
      enumerable: !1,
      configurable: !0
    }), A.prototype.getText = function(I) {
      if (I) {
        var g = this.offsetAt(I.start), Q = this.offsetAt(I.end);
        return this._content.substring(g, Q);
      }
      return this._content;
    }, A.prototype.update = function(I, g) {
      this._content = I.text, this._version = g, this._lineOffsets = void 0;
    }, A.prototype.getLineOffsets = function() {
      if (this._lineOffsets === void 0) {
        for (var I = [], g = this._content, Q = !0, B = 0; B < g.length; B++) {
          Q && (I.push(B), Q = !1);
          var C = g.charAt(B);
          Q = C === "\r" || C === `
`, C === "\r" && B + 1 < g.length && g.charAt(B + 1) === `
` && B++;
        }
        Q && g.length > 0 && I.push(g.length), this._lineOffsets = I;
      }
      return this._lineOffsets;
    }, A.prototype.positionAt = function(I) {
      I = Math.max(Math.min(I, this._content.length), 0);
      var g = this.getLineOffsets(), Q = 0, B = g.length;
      if (B === 0)
        return SA.create(0, I);
      for (; Q < B; ) {
        var C = Math.floor((Q + B) / 2);
        g[C] > I ? B = C : Q = C + 1;
      }
      var E = Q - 1;
      return SA.create(E, I - g[E]);
    }, A.prototype.offsetAt = function(I) {
      var g = this.getLineOffsets();
      if (I.line >= g.length)
        return this._content.length;
      if (I.line < 0)
        return 0;
      var Q = g[I.line], B = I.line + 1 < g.length ? g[I.line + 1] : this._content.length;
      return Math.max(Math.min(Q + I.character, B), Q);
    }, Object.defineProperty(A.prototype, "lineCount", {
      get: function() {
        return this.getLineOffsets().length;
      },
      enumerable: !1,
      configurable: !0
    }), A;
  }()
), M;
(function(A) {
  var I = Object.prototype.toString;
  function g(k) {
    return typeof k < "u";
  }
  A.defined = g;
  function Q(k) {
    return typeof k > "u";
  }
  A.undefined = Q;
  function B(k) {
    return k === !0 || k === !1;
  }
  A.boolean = B;
  function C(k) {
    return I.call(k) === "[object String]";
  }
  A.string = C;
  function E(k) {
    return I.call(k) === "[object Number]";
  }
  A.number = E;
  function D(k, c, L) {
    return I.call(k) === "[object Number]" && c <= k && k <= L;
  }
  A.numberRange = D;
  function o(k) {
    return I.call(k) === "[object Number]" && -2147483648 <= k && k <= 2147483647;
  }
  A.integer = o;
  function i(k) {
    return I.call(k) === "[object Number]" && 0 <= k && k <= 2147483647;
  }
  A.uinteger = i;
  function N(k) {
    return I.call(k) === "[object Function]";
  }
  A.func = N;
  function F(k) {
    return k !== null && typeof k == "object";
  }
  A.objectLiteral = F;
  function h(k, c) {
    return Array.isArray(k) && k.every(c);
  }
  A.typedArray = h;
})(M || (M = {}));
const qE = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get AnnotatedTextEdit() {
    return WA;
  },
  get ChangeAnnotation() {
    return wI;
  },
  get ChangeAnnotationIdentifier() {
    return aA;
  },
  get CodeAction() {
    return tQ;
  },
  get CodeActionContext() {
    return bQ;
  },
  get CodeActionKind() {
    return dQ;
  },
  get CodeActionTriggerKind() {
    return zI;
  },
  get CodeDescription() {
    return FQ;
  },
  get CodeLens() {
    return nQ;
  },
  get Color() {
    return Gg;
  },
  get ColorInformation() {
    return GQ;
  },
  get ColorPresentation() {
    return iQ;
  },
  get Command() {
    return NI;
  },
  get CompletionItem() {
    return KQ;
  },
  get CompletionItemKind() {
    return aQ;
  },
  get CompletionItemLabelDetails() {
    return sQ;
  },
  get CompletionItemTag() {
    return JQ;
  },
  get CompletionList() {
    return ZQ;
  },
  get CreateFile() {
    return ZI;
  },
  get DeleteFile() {
    return SI;
  },
  get Diagnostic() {
    return XI;
  },
  get DiagnosticRelatedInformation() {
    return ig;
  },
  get DiagnosticSeverity() {
    return kQ;
  },
  get DiagnosticTag() {
    return hQ;
  },
  get DocumentHighlight() {
    return OQ;
  },
  get DocumentHighlightKind() {
    return qQ;
  },
  get DocumentLink() {
    return XQ;
  },
  get DocumentSymbol() {
    return eQ;
  },
  get DocumentUri() {
    return EQ;
  },
  EOL: SE,
  get FoldingRange() {
    return NQ;
  },
  get FoldingRangeKind() {
    return wQ;
  },
  get FormattingOptions() {
    return WQ;
  },
  get Hover() {
    return HQ;
  },
  get InlayHint() {
    return vQ;
  },
  get InlayHintKind() {
    return kg;
  },
  get InlayHintLabelPart() {
    return hg;
  },
  get InlineValueContext() {
    return PQ;
  },
  get InlineValueEvaluatableExpression() {
    return uQ;
  },
  get InlineValueText() {
    return fQ;
  },
  get InlineValueVariableLookup() {
    return rQ;
  },
  get InsertReplaceEdit() {
    return UQ;
  },
  get InsertTextFormat() {
    return RQ;
  },
  get InsertTextMode() {
    return yQ;
  },
  get Location() {
    return WI;
  },
  get LocationLink() {
    return oQ;
  },
  get MarkedString() {
    return TI;
  },
  get MarkupContent() {
    return LI;
  },
  get MarkupKind() {
    return Ng;
  },
  get OptionalVersionedTextDocumentIdentifier() {
    return VI;
  },
  get ParameterInformation() {
    return SQ;
  },
  get Position() {
    return SA;
  },
  get Range() {
    return BA;
  },
  get RenameFile() {
    return HI;
  },
  get SelectionRange() {
    return xQ;
  },
  get SemanticTokenModifiers() {
    return TQ;
  },
  get SemanticTokenTypes() {
    return VQ;
  },
  get SemanticTokens() {
    return zQ;
  },
  get SignatureInformation() {
    return LQ;
  },
  get SymbolInformation() {
    return jQ;
  },
  get SymbolKind() {
    return lQ;
  },
  get SymbolTag() {
    return pQ;
  },
  get TextDocument() {
    return $Q;
  },
  get TextDocumentEdit() {
    return xI;
  },
  get TextDocumentIdentifier() {
    return YQ;
  },
  get TextDocumentItem() {
    return cQ;
  },
  get TextEdit() {
    return bA;
  },
  get URI() {
    return og;
  },
  get VersionedTextDocumentIdentifier() {
    return MQ;
  },
  WorkspaceChange: HE,
  get WorkspaceEdit() {
    return wg;
  },
  get WorkspaceFolder() {
    return _Q;
  },
  get WorkspaceSymbol() {
    return mQ;
  },
  get integer() {
    return DQ;
  },
  get uinteger() {
    return nI;
  }
}, Symbol.toStringTag, { value: "Module" })), EB = /* @__PURE__ */ wE(qE);
var gA = {};
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.ProtocolNotificationType = A.ProtocolNotificationType0 = A.ProtocolRequestType = A.ProtocolRequestType0 = A.RegistrationType = A.MessageDirection = void 0;
  const I = FI;
  (function(D) {
    D.clientToServer = "clientToServer", D.serverToClient = "serverToClient", D.both = "both";
  })(A.MessageDirection || (A.MessageDirection = {}));
  class g {
    constructor(o) {
      this.method = o;
    }
  }
  A.RegistrationType = g;
  class Q extends I.RequestType0 {
    constructor(o) {
      super(o);
    }
  }
  A.ProtocolRequestType0 = Q;
  class B extends I.RequestType {
    constructor(o) {
      super(o, I.ParameterStructures.byName);
    }
  }
  A.ProtocolRequestType = B;
  class C extends I.NotificationType0 {
    constructor(o) {
      super(o);
    }
  }
  A.ProtocolNotificationType0 = C;
  class E extends I.NotificationType {
    constructor(o) {
      super(o, I.ParameterStructures.byName);
    }
  }
  A.ProtocolNotificationType = E;
})(gA);
var CC = {}, QA = {};
Object.defineProperty(QA, "__esModule", { value: !0 });
QA.objectLiteral = QA.typedArray = QA.stringArray = QA.array = QA.func = QA.error = QA.number = QA.string = QA.boolean = void 0;
function OE(A) {
  return A === !0 || A === !1;
}
QA.boolean = OE;
function EC(A) {
  return typeof A == "string" || A instanceof String;
}
QA.string = EC;
function lE(A) {
  return typeof A == "number" || A instanceof Number;
}
QA.number = lE;
function pE(A) {
  return A instanceof Error;
}
QA.error = pE;
function jE(A) {
  return typeof A == "function";
}
QA.func = jE;
function DC(A) {
  return Array.isArray(A);
}
QA.array = DC;
function mE(A) {
  return DC(A) && A.every((I) => EC(I));
}
QA.stringArray = mE;
function eE(A, I) {
  return Array.isArray(A) && A.every(I);
}
QA.typedArray = eE;
function dE(A) {
  return A !== null && typeof A == "object";
}
QA.objectLiteral = dE;
var oC = {};
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.ImplementationRequest = void 0;
  const I = gA;
  (function(g) {
    g.method = "textDocument/implementation", g.messageDirection = I.MessageDirection.clientToServer, g.type = new I.ProtocolRequestType(g.method);
  })(A.ImplementationRequest || (A.ImplementationRequest = {}));
})(oC);
var GC = {};
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.TypeDefinitionRequest = void 0;
  const I = gA;
  (function(g) {
    g.method = "textDocument/typeDefinition", g.messageDirection = I.MessageDirection.clientToServer, g.type = new I.ProtocolRequestType(g.method);
  })(A.TypeDefinitionRequest || (A.TypeDefinitionRequest = {}));
})(GC);
var iC = {};
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.DidChangeWorkspaceFoldersNotification = A.WorkspaceFoldersRequest = void 0;
  const I = gA;
  (function(g) {
    g.method = "workspace/workspaceFolders", g.messageDirection = I.MessageDirection.serverToClient, g.type = new I.ProtocolRequestType0(g.method);
  })(A.WorkspaceFoldersRequest || (A.WorkspaceFoldersRequest = {})), function(g) {
    g.method = "workspace/didChangeWorkspaceFolders", g.messageDirection = I.MessageDirection.clientToServer, g.type = new I.ProtocolNotificationType(g.method);
  }(A.DidChangeWorkspaceFoldersNotification || (A.DidChangeWorkspaceFoldersNotification = {}));
})(iC);
var wC = {};
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.ConfigurationRequest = void 0;
  const I = gA;
  (function(g) {
    g.method = "workspace/configuration", g.messageDirection = I.MessageDirection.serverToClient, g.type = new I.ProtocolRequestType(g.method);
  })(A.ConfigurationRequest || (A.ConfigurationRequest = {}));
})(wC);
var NC = {};
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.ColorPresentationRequest = A.DocumentColorRequest = void 0;
  const I = gA;
  (function(g) {
    g.method = "textDocument/documentColor", g.messageDirection = I.MessageDirection.clientToServer, g.type = new I.ProtocolRequestType(g.method);
  })(A.DocumentColorRequest || (A.DocumentColorRequest = {})), function(g) {
    g.method = "textDocument/colorPresentation", g.messageDirection = I.MessageDirection.clientToServer, g.type = new I.ProtocolRequestType(g.method);
  }(A.ColorPresentationRequest || (A.ColorPresentationRequest = {}));
})(NC);
var kC = {};
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.FoldingRangeRequest = void 0;
  const I = gA;
  (function(g) {
    g.method = "textDocument/foldingRange", g.messageDirection = I.MessageDirection.clientToServer, g.type = new I.ProtocolRequestType(g.method);
  })(A.FoldingRangeRequest || (A.FoldingRangeRequest = {}));
})(kC);
var hC = {};
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.DeclarationRequest = void 0;
  const I = gA;
  (function(g) {
    g.method = "textDocument/declaration", g.messageDirection = I.MessageDirection.clientToServer, g.type = new I.ProtocolRequestType(g.method);
  })(A.DeclarationRequest || (A.DeclarationRequest = {}));
})(hC);
var FC = {};
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.SelectionRangeRequest = void 0;
  const I = gA;
  (function(g) {
    g.method = "textDocument/selectionRange", g.messageDirection = I.MessageDirection.clientToServer, g.type = new I.ProtocolRequestType(g.method);
  })(A.SelectionRangeRequest || (A.SelectionRangeRequest = {}));
})(FC);
var YC = {};
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.WorkDoneProgressCancelNotification = A.WorkDoneProgressCreateRequest = A.WorkDoneProgress = void 0;
  const I = FI, g = gA;
  (function(Q) {
    Q.type = new I.ProgressType();
    function B(C) {
      return C === Q.type;
    }
    Q.is = B;
  })(A.WorkDoneProgress || (A.WorkDoneProgress = {})), function(Q) {
    Q.method = "window/workDoneProgress/create", Q.messageDirection = g.MessageDirection.serverToClient, Q.type = new g.ProtocolRequestType(Q.method);
  }(A.WorkDoneProgressCreateRequest || (A.WorkDoneProgressCreateRequest = {})), function(Q) {
    Q.method = "window/workDoneProgress/cancel", Q.messageDirection = g.MessageDirection.clientToServer, Q.type = new g.ProtocolNotificationType(Q.method);
  }(A.WorkDoneProgressCancelNotification || (A.WorkDoneProgressCancelNotification = {}));
})(YC);
var MC = {};
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.CallHierarchyOutgoingCallsRequest = A.CallHierarchyIncomingCallsRequest = A.CallHierarchyPrepareRequest = void 0;
  const I = gA;
  (function(g) {
    g.method = "textDocument/prepareCallHierarchy", g.messageDirection = I.MessageDirection.clientToServer, g.type = new I.ProtocolRequestType(g.method);
  })(A.CallHierarchyPrepareRequest || (A.CallHierarchyPrepareRequest = {})), function(g) {
    g.method = "callHierarchy/incomingCalls", g.messageDirection = I.MessageDirection.clientToServer, g.type = new I.ProtocolRequestType(g.method);
  }(A.CallHierarchyIncomingCallsRequest || (A.CallHierarchyIncomingCallsRequest = {})), function(g) {
    g.method = "callHierarchy/outgoingCalls", g.messageDirection = I.MessageDirection.clientToServer, g.type = new I.ProtocolRequestType(g.method);
  }(A.CallHierarchyOutgoingCallsRequest || (A.CallHierarchyOutgoingCallsRequest = {}));
})(MC);
var cC = {};
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.SemanticTokensRefreshRequest = A.SemanticTokensRangeRequest = A.SemanticTokensDeltaRequest = A.SemanticTokensRequest = A.SemanticTokensRegistrationType = A.TokenFormat = void 0;
  const I = gA;
  (function(Q) {
    Q.Relative = "relative";
  })(A.TokenFormat || (A.TokenFormat = {}));
  var g;
  (function(Q) {
    Q.method = "textDocument/semanticTokens", Q.type = new I.RegistrationType(Q.method);
  })(g = A.SemanticTokensRegistrationType || (A.SemanticTokensRegistrationType = {})), function(Q) {
    Q.method = "textDocument/semanticTokens/full", Q.messageDirection = I.MessageDirection.clientToServer, Q.type = new I.ProtocolRequestType(Q.method), Q.registrationMethod = g.method;
  }(A.SemanticTokensRequest || (A.SemanticTokensRequest = {})), function(Q) {
    Q.method = "textDocument/semanticTokens/full/delta", Q.messageDirection = I.MessageDirection.clientToServer, Q.type = new I.ProtocolRequestType(Q.method), Q.registrationMethod = g.method;
  }(A.SemanticTokensDeltaRequest || (A.SemanticTokensDeltaRequest = {})), function(Q) {
    Q.method = "textDocument/semanticTokens/range", Q.messageDirection = I.MessageDirection.clientToServer, Q.type = new I.ProtocolRequestType(Q.method), Q.registrationMethod = g.method;
  }(A.SemanticTokensRangeRequest || (A.SemanticTokensRangeRequest = {})), function(Q) {
    Q.method = "workspace/semanticTokens/refresh", Q.messageDirection = I.MessageDirection.clientToServer, Q.type = new I.ProtocolRequestType0(Q.method);
  }(A.SemanticTokensRefreshRequest || (A.SemanticTokensRefreshRequest = {}));
})(cC);
var aC = {};
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.ShowDocumentRequest = void 0;
  const I = gA;
  (function(g) {
    g.method = "window/showDocument", g.messageDirection = I.MessageDirection.serverToClient, g.type = new I.ProtocolRequestType(g.method);
  })(A.ShowDocumentRequest || (A.ShowDocumentRequest = {}));
})(aC);
var RC = {};
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.LinkedEditingRangeRequest = void 0;
  const I = gA;
  (function(g) {
    g.method = "textDocument/linkedEditingRange", g.messageDirection = I.MessageDirection.clientToServer, g.type = new I.ProtocolRequestType(g.method);
  })(A.LinkedEditingRangeRequest || (A.LinkedEditingRangeRequest = {}));
})(RC);
var JC = {};
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.WillDeleteFilesRequest = A.DidDeleteFilesNotification = A.DidRenameFilesNotification = A.WillRenameFilesRequest = A.DidCreateFilesNotification = A.WillCreateFilesRequest = A.FileOperationPatternKind = void 0;
  const I = gA;
  (function(g) {
    g.file = "file", g.folder = "folder";
  })(A.FileOperationPatternKind || (A.FileOperationPatternKind = {})), function(g) {
    g.method = "workspace/willCreateFiles", g.messageDirection = I.MessageDirection.clientToServer, g.type = new I.ProtocolRequestType(g.method);
  }(A.WillCreateFilesRequest || (A.WillCreateFilesRequest = {})), function(g) {
    g.method = "workspace/didCreateFiles", g.messageDirection = I.MessageDirection.clientToServer, g.type = new I.ProtocolNotificationType(g.method);
  }(A.DidCreateFilesNotification || (A.DidCreateFilesNotification = {})), function(g) {
    g.method = "workspace/willRenameFiles", g.messageDirection = I.MessageDirection.clientToServer, g.type = new I.ProtocolRequestType(g.method);
  }(A.WillRenameFilesRequest || (A.WillRenameFilesRequest = {})), function(g) {
    g.method = "workspace/didRenameFiles", g.messageDirection = I.MessageDirection.clientToServer, g.type = new I.ProtocolNotificationType(g.method);
  }(A.DidRenameFilesNotification || (A.DidRenameFilesNotification = {})), function(g) {
    g.method = "workspace/didDeleteFiles", g.messageDirection = I.MessageDirection.clientToServer, g.type = new I.ProtocolNotificationType(g.method);
  }(A.DidDeleteFilesNotification || (A.DidDeleteFilesNotification = {})), function(g) {
    g.method = "workspace/willDeleteFiles", g.messageDirection = I.MessageDirection.clientToServer, g.type = new I.ProtocolRequestType(g.method);
  }(A.WillDeleteFilesRequest || (A.WillDeleteFilesRequest = {}));
})(JC);
var UC = {};
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.MonikerRequest = A.MonikerKind = A.UniquenessLevel = void 0;
  const I = gA;
  (function(g) {
    g.document = "document", g.project = "project", g.group = "group", g.scheme = "scheme", g.global = "global";
  })(A.UniquenessLevel || (A.UniquenessLevel = {})), function(g) {
    g.$import = "import", g.$export = "export", g.local = "local";
  }(A.MonikerKind || (A.MonikerKind = {})), function(g) {
    g.method = "textDocument/moniker", g.messageDirection = I.MessageDirection.clientToServer, g.type = new I.ProtocolRequestType(g.method);
  }(A.MonikerRequest || (A.MonikerRequest = {}));
})(UC);
var yC = {};
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.TypeHierarchySubtypesRequest = A.TypeHierarchySupertypesRequest = A.TypeHierarchyPrepareRequest = void 0;
  const I = gA;
  (function(g) {
    g.method = "textDocument/prepareTypeHierarchy", g.messageDirection = I.MessageDirection.clientToServer, g.type = new I.ProtocolRequestType(g.method);
  })(A.TypeHierarchyPrepareRequest || (A.TypeHierarchyPrepareRequest = {})), function(g) {
    g.method = "typeHierarchy/supertypes", g.messageDirection = I.MessageDirection.clientToServer, g.type = new I.ProtocolRequestType(g.method);
  }(A.TypeHierarchySupertypesRequest || (A.TypeHierarchySupertypesRequest = {})), function(g) {
    g.method = "typeHierarchy/subtypes", g.messageDirection = I.MessageDirection.clientToServer, g.type = new I.ProtocolRequestType(g.method);
  }(A.TypeHierarchySubtypesRequest || (A.TypeHierarchySubtypesRequest = {}));
})(yC);
var sC = {};
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.InlineValueRefreshRequest = A.InlineValueRequest = void 0;
  const I = gA;
  (function(g) {
    g.method = "textDocument/inlineValue", g.messageDirection = I.MessageDirection.clientToServer, g.type = new I.ProtocolRequestType(g.method);
  })(A.InlineValueRequest || (A.InlineValueRequest = {})), function(g) {
    g.method = "workspace/inlineValue/refresh", g.messageDirection = I.MessageDirection.clientToServer, g.type = new I.ProtocolRequestType0(g.method);
  }(A.InlineValueRefreshRequest || (A.InlineValueRefreshRequest = {}));
})(sC);
var KC = {};
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.InlayHintRefreshRequest = A.InlayHintResolveRequest = A.InlayHintRequest = void 0;
  const I = gA;
  (function(g) {
    g.method = "textDocument/inlayHint", g.messageDirection = I.MessageDirection.clientToServer, g.type = new I.ProtocolRequestType(g.method);
  })(A.InlayHintRequest || (A.InlayHintRequest = {})), function(g) {
    g.method = "inlayHint/resolve", g.messageDirection = I.MessageDirection.clientToServer, g.type = new I.ProtocolRequestType(g.method);
  }(A.InlayHintResolveRequest || (A.InlayHintResolveRequest = {})), function(g) {
    g.method = "workspace/inlayHint/refresh", g.messageDirection = I.MessageDirection.clientToServer, g.type = new I.ProtocolRequestType0(g.method);
  }(A.InlayHintRefreshRequest || (A.InlayHintRefreshRequest = {}));
})(KC);
var ZC = {};
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.DiagnosticRefreshRequest = A.WorkspaceDiagnosticRequest = A.DocumentDiagnosticRequest = A.DocumentDiagnosticReportKind = A.DiagnosticServerCancellationData = void 0;
  const I = FI, g = QA, Q = gA;
  (function(B) {
    function C(E) {
      const D = E;
      return D && g.boolean(D.retriggerRequest);
    }
    B.is = C;
  })(A.DiagnosticServerCancellationData || (A.DiagnosticServerCancellationData = {})), function(B) {
    B.Full = "full", B.Unchanged = "unchanged";
  }(A.DocumentDiagnosticReportKind || (A.DocumentDiagnosticReportKind = {})), function(B) {
    B.method = "textDocument/diagnostic", B.messageDirection = Q.MessageDirection.clientToServer, B.type = new Q.ProtocolRequestType(B.method), B.partialResult = new I.ProgressType();
  }(A.DocumentDiagnosticRequest || (A.DocumentDiagnosticRequest = {})), function(B) {
    B.method = "workspace/diagnostic", B.messageDirection = Q.MessageDirection.clientToServer, B.type = new Q.ProtocolRequestType(B.method), B.partialResult = new I.ProgressType();
  }(A.WorkspaceDiagnosticRequest || (A.WorkspaceDiagnosticRequest = {})), function(B) {
    B.method = "workspace/diagnostic/refresh", B.messageDirection = Q.MessageDirection.clientToServer, B.type = new Q.ProtocolRequestType0(B.method);
  }(A.DiagnosticRefreshRequest || (A.DiagnosticRefreshRequest = {}));
})(ZC);
var HC = {};
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.DidCloseNotebookDocumentNotification = A.DidSaveNotebookDocumentNotification = A.DidChangeNotebookDocumentNotification = A.NotebookCellArrayChange = A.DidOpenNotebookDocumentNotification = A.NotebookDocumentSyncRegistrationType = A.NotebookDocument = A.NotebookCell = A.ExecutionSummary = A.NotebookCellKind = void 0;
  const I = EB, g = QA, Q = gA;
  var B;
  (function(o) {
    o.Markup = 1, o.Code = 2;
    function i(N) {
      return N === 1 || N === 2;
    }
    o.is = i;
  })(B = A.NotebookCellKind || (A.NotebookCellKind = {}));
  var C;
  (function(o) {
    function i(h, k) {
      const c = { executionOrder: h };
      return (k === !0 || k === !1) && (c.success = k), c;
    }
    o.create = i;
    function N(h) {
      const k = h;
      return g.objectLiteral(k) && I.uinteger.is(k.executionOrder) && (k.success === void 0 || g.boolean(k.success));
    }
    o.is = N;
    function F(h, k) {
      return h === k ? !0 : h == null || k === null || k === void 0 ? !1 : h.executionOrder === k.executionOrder && h.success === k.success;
    }
    o.equals = F;
  })(C = A.ExecutionSummary || (A.ExecutionSummary = {}));
  var E;
  (function(o) {
    function i(k, c) {
      return { kind: k, document: c };
    }
    o.create = i;
    function N(k) {
      const c = k;
      return g.objectLiteral(c) && B.is(c.kind) && I.DocumentUri.is(c.document) && (c.metadata === void 0 || g.objectLiteral(c.metadata));
    }
    o.is = N;
    function F(k, c) {
      const L = /* @__PURE__ */ new Set();
      return k.document !== c.document && L.add("document"), k.kind !== c.kind && L.add("kind"), k.executionSummary !== c.executionSummary && L.add("executionSummary"), (k.metadata !== void 0 || c.metadata !== void 0) && !h(k.metadata, c.metadata) && L.add("metadata"), (k.executionSummary !== void 0 || c.executionSummary !== void 0) && !C.equals(k.executionSummary, c.executionSummary) && L.add("executionSummary"), L;
    }
    o.diff = F;
    function h(k, c) {
      if (k === c)
        return !0;
      if (k == null || c === null || c === void 0 || typeof k != typeof c || typeof k != "object")
        return !1;
      const L = Array.isArray(k), O = Array.isArray(c);
      if (L !== O)
        return !1;
      if (L && O) {
        if (k.length !== c.length)
          return !1;
        for (let l = 0; l < k.length; l++)
          if (!h(k[l], c[l]))
            return !1;
      }
      if (g.objectLiteral(k) && g.objectLiteral(c)) {
        const l = Object.keys(k), t = Object.keys(c);
        if (l.length !== t.length || (l.sort(), t.sort(), !h(l, t)))
          return !1;
        for (let V = 0; V < l.length; V++) {
          const f = l[V];
          if (!h(k[f], c[f]))
            return !1;
        }
      }
      return !0;
    }
  })(E = A.NotebookCell || (A.NotebookCell = {})), function(o) {
    function i(F, h, k, c) {
      return { uri: F, notebookType: h, version: k, cells: c };
    }
    o.create = i;
    function N(F) {
      const h = F;
      return g.objectLiteral(h) && g.string(h.uri) && I.integer.is(h.version) && g.typedArray(h.cells, E.is);
    }
    o.is = N;
  }(A.NotebookDocument || (A.NotebookDocument = {}));
  var D;
  (function(o) {
    o.method = "notebookDocument/sync", o.messageDirection = Q.MessageDirection.clientToServer, o.type = new Q.RegistrationType(o.method);
  })(D = A.NotebookDocumentSyncRegistrationType || (A.NotebookDocumentSyncRegistrationType = {})), function(o) {
    o.method = "notebookDocument/didOpen", o.messageDirection = Q.MessageDirection.clientToServer, o.type = new Q.ProtocolNotificationType(o.method), o.registrationMethod = D.method;
  }(A.DidOpenNotebookDocumentNotification || (A.DidOpenNotebookDocumentNotification = {})), function(o) {
    function i(F) {
      const h = F;
      return g.objectLiteral(h) && I.uinteger.is(h.start) && I.uinteger.is(h.deleteCount) && (h.cells === void 0 || g.typedArray(h.cells, E.is));
    }
    o.is = i;
    function N(F, h, k) {
      const c = { start: F, deleteCount: h };
      return k !== void 0 && (c.cells = k), c;
    }
    o.create = N;
  }(A.NotebookCellArrayChange || (A.NotebookCellArrayChange = {})), function(o) {
    o.method = "notebookDocument/didChange", o.messageDirection = Q.MessageDirection.clientToServer, o.type = new Q.ProtocolNotificationType(o.method), o.registrationMethod = D.method;
  }(A.DidChangeNotebookDocumentNotification || (A.DidChangeNotebookDocumentNotification = {})), function(o) {
    o.method = "notebookDocument/didSave", o.messageDirection = Q.MessageDirection.clientToServer, o.type = new Q.ProtocolNotificationType(o.method), o.registrationMethod = D.method;
  }(A.DidSaveNotebookDocumentNotification || (A.DidSaveNotebookDocumentNotification = {})), function(o) {
    o.method = "notebookDocument/didClose", o.messageDirection = Q.MessageDirection.clientToServer, o.type = new Q.ProtocolNotificationType(o.method), o.registrationMethod = D.method;
  }(A.DidCloseNotebookDocumentNotification || (A.DidCloseNotebookDocumentNotification = {}));
})(HC);
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.WorkspaceSymbolRequest = A.CodeActionResolveRequest = A.CodeActionRequest = A.DocumentSymbolRequest = A.DocumentHighlightRequest = A.ReferencesRequest = A.DefinitionRequest = A.SignatureHelpRequest = A.SignatureHelpTriggerKind = A.HoverRequest = A.CompletionResolveRequest = A.CompletionRequest = A.CompletionTriggerKind = A.PublishDiagnosticsNotification = A.WatchKind = A.RelativePattern = A.FileChangeType = A.DidChangeWatchedFilesNotification = A.WillSaveTextDocumentWaitUntilRequest = A.WillSaveTextDocumentNotification = A.TextDocumentSaveReason = A.DidSaveTextDocumentNotification = A.DidCloseTextDocumentNotification = A.DidChangeTextDocumentNotification = A.TextDocumentContentChangeEvent = A.DidOpenTextDocumentNotification = A.TextDocumentSyncKind = A.TelemetryEventNotification = A.LogMessageNotification = A.ShowMessageRequest = A.ShowMessageNotification = A.MessageType = A.DidChangeConfigurationNotification = A.ExitNotification = A.ShutdownRequest = A.InitializedNotification = A.InitializeErrorCodes = A.InitializeRequest = A.WorkDoneProgressOptions = A.TextDocumentRegistrationOptions = A.StaticRegistrationOptions = A.PositionEncodingKind = A.FailureHandlingKind = A.ResourceOperationKind = A.UnregistrationRequest = A.RegistrationRequest = A.DocumentSelector = A.NotebookCellTextDocumentFilter = A.NotebookDocumentFilter = A.TextDocumentFilter = void 0, A.TypeHierarchySubtypesRequest = A.TypeHierarchyPrepareRequest = A.MonikerRequest = A.MonikerKind = A.UniquenessLevel = A.WillDeleteFilesRequest = A.DidDeleteFilesNotification = A.WillRenameFilesRequest = A.DidRenameFilesNotification = A.WillCreateFilesRequest = A.DidCreateFilesNotification = A.FileOperationPatternKind = A.LinkedEditingRangeRequest = A.ShowDocumentRequest = A.SemanticTokensRegistrationType = A.SemanticTokensRefreshRequest = A.SemanticTokensRangeRequest = A.SemanticTokensDeltaRequest = A.SemanticTokensRequest = A.TokenFormat = A.CallHierarchyPrepareRequest = A.CallHierarchyOutgoingCallsRequest = A.CallHierarchyIncomingCallsRequest = A.WorkDoneProgressCancelNotification = A.WorkDoneProgressCreateRequest = A.WorkDoneProgress = A.SelectionRangeRequest = A.DeclarationRequest = A.FoldingRangeRequest = A.ColorPresentationRequest = A.DocumentColorRequest = A.ConfigurationRequest = A.DidChangeWorkspaceFoldersNotification = A.WorkspaceFoldersRequest = A.TypeDefinitionRequest = A.ImplementationRequest = A.ApplyWorkspaceEditRequest = A.ExecuteCommandRequest = A.PrepareRenameRequest = A.RenameRequest = A.PrepareSupportDefaultBehavior = A.DocumentOnTypeFormattingRequest = A.DocumentRangeFormattingRequest = A.DocumentFormattingRequest = A.DocumentLinkResolveRequest = A.DocumentLinkRequest = A.CodeLensRefreshRequest = A.CodeLensResolveRequest = A.CodeLensRequest = A.WorkspaceSymbolResolveRequest = void 0, A.DidCloseNotebookDocumentNotification = A.DidSaveNotebookDocumentNotification = A.DidChangeNotebookDocumentNotification = A.NotebookCellArrayChange = A.DidOpenNotebookDocumentNotification = A.NotebookDocumentSyncRegistrationType = A.NotebookDocument = A.NotebookCell = A.ExecutionSummary = A.NotebookCellKind = A.DiagnosticRefreshRequest = A.WorkspaceDiagnosticRequest = A.DocumentDiagnosticRequest = A.DocumentDiagnosticReportKind = A.DiagnosticServerCancellationData = A.InlayHintRefreshRequest = A.InlayHintResolveRequest = A.InlayHintRequest = A.InlineValueRefreshRequest = A.InlineValueRequest = A.TypeHierarchySupertypesRequest = void 0;
  const I = gA, g = EB, Q = QA, B = oC;
  Object.defineProperty(A, "ImplementationRequest", { enumerable: !0, get: function() {
    return B.ImplementationRequest;
  } });
  const C = GC;
  Object.defineProperty(A, "TypeDefinitionRequest", { enumerable: !0, get: function() {
    return C.TypeDefinitionRequest;
  } });
  const E = iC;
  Object.defineProperty(A, "WorkspaceFoldersRequest", { enumerable: !0, get: function() {
    return E.WorkspaceFoldersRequest;
  } }), Object.defineProperty(A, "DidChangeWorkspaceFoldersNotification", { enumerable: !0, get: function() {
    return E.DidChangeWorkspaceFoldersNotification;
  } });
  const D = wC;
  Object.defineProperty(A, "ConfigurationRequest", { enumerable: !0, get: function() {
    return D.ConfigurationRequest;
  } });
  const o = NC;
  Object.defineProperty(A, "DocumentColorRequest", { enumerable: !0, get: function() {
    return o.DocumentColorRequest;
  } }), Object.defineProperty(A, "ColorPresentationRequest", { enumerable: !0, get: function() {
    return o.ColorPresentationRequest;
  } });
  const i = kC;
  Object.defineProperty(A, "FoldingRangeRequest", { enumerable: !0, get: function() {
    return i.FoldingRangeRequest;
  } });
  const N = hC;
  Object.defineProperty(A, "DeclarationRequest", { enumerable: !0, get: function() {
    return N.DeclarationRequest;
  } });
  const F = FC;
  Object.defineProperty(A, "SelectionRangeRequest", { enumerable: !0, get: function() {
    return F.SelectionRangeRequest;
  } });
  const h = YC;
  Object.defineProperty(A, "WorkDoneProgress", { enumerable: !0, get: function() {
    return h.WorkDoneProgress;
  } }), Object.defineProperty(A, "WorkDoneProgressCreateRequest", { enumerable: !0, get: function() {
    return h.WorkDoneProgressCreateRequest;
  } }), Object.defineProperty(A, "WorkDoneProgressCancelNotification", { enumerable: !0, get: function() {
    return h.WorkDoneProgressCancelNotification;
  } });
  const k = MC;
  Object.defineProperty(A, "CallHierarchyIncomingCallsRequest", { enumerable: !0, get: function() {
    return k.CallHierarchyIncomingCallsRequest;
  } }), Object.defineProperty(A, "CallHierarchyOutgoingCallsRequest", { enumerable: !0, get: function() {
    return k.CallHierarchyOutgoingCallsRequest;
  } }), Object.defineProperty(A, "CallHierarchyPrepareRequest", { enumerable: !0, get: function() {
    return k.CallHierarchyPrepareRequest;
  } });
  const c = cC;
  Object.defineProperty(A, "TokenFormat", { enumerable: !0, get: function() {
    return c.TokenFormat;
  } }), Object.defineProperty(A, "SemanticTokensRequest", { enumerable: !0, get: function() {
    return c.SemanticTokensRequest;
  } }), Object.defineProperty(A, "SemanticTokensDeltaRequest", { enumerable: !0, get: function() {
    return c.SemanticTokensDeltaRequest;
  } }), Object.defineProperty(A, "SemanticTokensRangeRequest", { enumerable: !0, get: function() {
    return c.SemanticTokensRangeRequest;
  } }), Object.defineProperty(A, "SemanticTokensRefreshRequest", { enumerable: !0, get: function() {
    return c.SemanticTokensRefreshRequest;
  } }), Object.defineProperty(A, "SemanticTokensRegistrationType", { enumerable: !0, get: function() {
    return c.SemanticTokensRegistrationType;
  } });
  const L = aC;
  Object.defineProperty(A, "ShowDocumentRequest", { enumerable: !0, get: function() {
    return L.ShowDocumentRequest;
  } });
  const O = RC;
  Object.defineProperty(A, "LinkedEditingRangeRequest", { enumerable: !0, get: function() {
    return O.LinkedEditingRangeRequest;
  } });
  const l = JC;
  Object.defineProperty(A, "FileOperationPatternKind", { enumerable: !0, get: function() {
    return l.FileOperationPatternKind;
  } }), Object.defineProperty(A, "DidCreateFilesNotification", { enumerable: !0, get: function() {
    return l.DidCreateFilesNotification;
  } }), Object.defineProperty(A, "WillCreateFilesRequest", { enumerable: !0, get: function() {
    return l.WillCreateFilesRequest;
  } }), Object.defineProperty(A, "DidRenameFilesNotification", { enumerable: !0, get: function() {
    return l.DidRenameFilesNotification;
  } }), Object.defineProperty(A, "WillRenameFilesRequest", { enumerable: !0, get: function() {
    return l.WillRenameFilesRequest;
  } }), Object.defineProperty(A, "DidDeleteFilesNotification", { enumerable: !0, get: function() {
    return l.DidDeleteFilesNotification;
  } }), Object.defineProperty(A, "WillDeleteFilesRequest", { enumerable: !0, get: function() {
    return l.WillDeleteFilesRequest;
  } });
  const t = UC;
  Object.defineProperty(A, "UniquenessLevel", { enumerable: !0, get: function() {
    return t.UniquenessLevel;
  } }), Object.defineProperty(A, "MonikerKind", { enumerable: !0, get: function() {
    return t.MonikerKind;
  } }), Object.defineProperty(A, "MonikerRequest", { enumerable: !0, get: function() {
    return t.MonikerRequest;
  } });
  const V = yC;
  Object.defineProperty(A, "TypeHierarchyPrepareRequest", { enumerable: !0, get: function() {
    return V.TypeHierarchyPrepareRequest;
  } }), Object.defineProperty(A, "TypeHierarchySubtypesRequest", { enumerable: !0, get: function() {
    return V.TypeHierarchySubtypesRequest;
  } }), Object.defineProperty(A, "TypeHierarchySupertypesRequest", { enumerable: !0, get: function() {
    return V.TypeHierarchySupertypesRequest;
  } });
  const f = sC;
  Object.defineProperty(A, "InlineValueRequest", { enumerable: !0, get: function() {
    return f.InlineValueRequest;
  } }), Object.defineProperty(A, "InlineValueRefreshRequest", { enumerable: !0, get: function() {
    return f.InlineValueRefreshRequest;
  } });
  const hA = KC;
  Object.defineProperty(A, "InlayHintRequest", { enumerable: !0, get: function() {
    return hA.InlayHintRequest;
  } }), Object.defineProperty(A, "InlayHintResolveRequest", { enumerable: !0, get: function() {
    return hA.InlayHintResolveRequest;
  } }), Object.defineProperty(A, "InlayHintRefreshRequest", { enumerable: !0, get: function() {
    return hA.InlayHintRefreshRequest;
  } });
  const $ = ZC;
  Object.defineProperty(A, "DiagnosticServerCancellationData", { enumerable: !0, get: function() {
    return $.DiagnosticServerCancellationData;
  } }), Object.defineProperty(A, "DocumentDiagnosticReportKind", { enumerable: !0, get: function() {
    return $.DocumentDiagnosticReportKind;
  } }), Object.defineProperty(A, "DocumentDiagnosticRequest", { enumerable: !0, get: function() {
    return $.DocumentDiagnosticRequest;
  } }), Object.defineProperty(A, "WorkspaceDiagnosticRequest", { enumerable: !0, get: function() {
    return $.WorkspaceDiagnosticRequest;
  } }), Object.defineProperty(A, "DiagnosticRefreshRequest", { enumerable: !0, get: function() {
    return $.DiagnosticRefreshRequest;
  } });
  const wA = HC;
  Object.defineProperty(A, "NotebookCellKind", { enumerable: !0, get: function() {
    return wA.NotebookCellKind;
  } }), Object.defineProperty(A, "ExecutionSummary", { enumerable: !0, get: function() {
    return wA.ExecutionSummary;
  } }), Object.defineProperty(A, "NotebookCell", { enumerable: !0, get: function() {
    return wA.NotebookCell;
  } }), Object.defineProperty(A, "NotebookDocument", { enumerable: !0, get: function() {
    return wA.NotebookDocument;
  } }), Object.defineProperty(A, "NotebookDocumentSyncRegistrationType", { enumerable: !0, get: function() {
    return wA.NotebookDocumentSyncRegistrationType;
  } }), Object.defineProperty(A, "DidOpenNotebookDocumentNotification", { enumerable: !0, get: function() {
    return wA.DidOpenNotebookDocumentNotification;
  } }), Object.defineProperty(A, "NotebookCellArrayChange", { enumerable: !0, get: function() {
    return wA.NotebookCellArrayChange;
  } }), Object.defineProperty(A, "DidChangeNotebookDocumentNotification", { enumerable: !0, get: function() {
    return wA.DidChangeNotebookDocumentNotification;
  } }), Object.defineProperty(A, "DidSaveNotebookDocumentNotification", { enumerable: !0, get: function() {
    return wA.DidSaveNotebookDocumentNotification;
  } }), Object.defineProperty(A, "DidCloseNotebookDocumentNotification", { enumerable: !0, get: function() {
    return wA.DidCloseNotebookDocumentNotification;
  } });
  var Z;
  (function(G) {
    function H(x) {
      const e = x;
      return Q.string(e.language) || Q.string(e.scheme) || Q.string(e.pattern);
    }
    G.is = H;
  })(Z = A.TextDocumentFilter || (A.TextDocumentFilter = {}));
  var n;
  (function(G) {
    function H(x) {
      const e = x;
      return Q.objectLiteral(e) && (Q.string(e.notebookType) || Q.string(e.scheme) || Q.string(e.pattern));
    }
    G.is = H;
  })(n = A.NotebookDocumentFilter || (A.NotebookDocumentFilter = {}));
  var W;
  (function(G) {
    function H(x) {
      const e = x;
      return Q.objectLiteral(e) && (Q.string(e.notebook) || n.is(e.notebook)) && (e.language === void 0 || Q.string(e.language));
    }
    G.is = H;
  })(W = A.NotebookCellTextDocumentFilter || (A.NotebookCellTextDocumentFilter = {}));
  var j;
  (function(G) {
    function H(x) {
      if (!Array.isArray(x))
        return !1;
      for (let e of x)
        if (!Q.string(e) && !Z.is(e) && !W.is(e))
          return !1;
      return !0;
    }
    G.is = H;
  })(j = A.DocumentSelector || (A.DocumentSelector = {})), function(G) {
    G.method = "client/registerCapability", G.messageDirection = I.MessageDirection.serverToClient, G.type = new I.ProtocolRequestType(G.method);
  }(A.RegistrationRequest || (A.RegistrationRequest = {})), function(G) {
    G.method = "client/unregisterCapability", G.messageDirection = I.MessageDirection.serverToClient, G.type = new I.ProtocolRequestType(G.method);
  }(A.UnregistrationRequest || (A.UnregistrationRequest = {})), function(G) {
    G.Create = "create", G.Rename = "rename", G.Delete = "delete";
  }(A.ResourceOperationKind || (A.ResourceOperationKind = {})), function(G) {
    G.Abort = "abort", G.Transactional = "transactional", G.TextOnlyTransactional = "textOnlyTransactional", G.Undo = "undo";
  }(A.FailureHandlingKind || (A.FailureHandlingKind = {})), function(G) {
    G.UTF8 = "utf-8", G.UTF16 = "utf-16", G.UTF32 = "utf-32";
  }(A.PositionEncodingKind || (A.PositionEncodingKind = {})), function(G) {
    function H(x) {
      const e = x;
      return e && Q.string(e.id) && e.id.length > 0;
    }
    G.hasId = H;
  }(A.StaticRegistrationOptions || (A.StaticRegistrationOptions = {})), function(G) {
    function H(x) {
      const e = x;
      return e && (e.documentSelector === null || j.is(e.documentSelector));
    }
    G.is = H;
  }(A.TextDocumentRegistrationOptions || (A.TextDocumentRegistrationOptions = {})), function(G) {
    function H(e) {
      const T = e;
      return Q.objectLiteral(T) && (T.workDoneProgress === void 0 || Q.boolean(T.workDoneProgress));
    }
    G.is = H;
    function x(e) {
      const T = e;
      return T && Q.boolean(T.workDoneProgress);
    }
    G.hasWorkDoneProgress = x;
  }(A.WorkDoneProgressOptions || (A.WorkDoneProgressOptions = {})), function(G) {
    G.method = "initialize", G.messageDirection = I.MessageDirection.clientToServer, G.type = new I.ProtocolRequestType(G.method);
  }(A.InitializeRequest || (A.InitializeRequest = {})), function(G) {
    G.unknownProtocolVersion = 1;
  }(A.InitializeErrorCodes || (A.InitializeErrorCodes = {})), function(G) {
    G.method = "initialized", G.messageDirection = I.MessageDirection.clientToServer, G.type = new I.ProtocolNotificationType(G.method);
  }(A.InitializedNotification || (A.InitializedNotification = {})), function(G) {
    G.method = "shutdown", G.messageDirection = I.MessageDirection.clientToServer, G.type = new I.ProtocolRequestType0(G.method);
  }(A.ShutdownRequest || (A.ShutdownRequest = {})), function(G) {
    G.method = "exit", G.messageDirection = I.MessageDirection.clientToServer, G.type = new I.ProtocolNotificationType0(G.method);
  }(A.ExitNotification || (A.ExitNotification = {})), function(G) {
    G.method = "workspace/didChangeConfiguration", G.messageDirection = I.MessageDirection.clientToServer, G.type = new I.ProtocolNotificationType(G.method);
  }(A.DidChangeConfigurationNotification || (A.DidChangeConfigurationNotification = {})), function(G) {
    G.Error = 1, G.Warning = 2, G.Info = 3, G.Log = 4;
  }(A.MessageType || (A.MessageType = {})), function(G) {
    G.method = "window/showMessage", G.messageDirection = I.MessageDirection.serverToClient, G.type = new I.ProtocolNotificationType(G.method);
  }(A.ShowMessageNotification || (A.ShowMessageNotification = {})), function(G) {
    G.method = "window/showMessageRequest", G.messageDirection = I.MessageDirection.serverToClient, G.type = new I.ProtocolRequestType(G.method);
  }(A.ShowMessageRequest || (A.ShowMessageRequest = {})), function(G) {
    G.method = "window/logMessage", G.messageDirection = I.MessageDirection.serverToClient, G.type = new I.ProtocolNotificationType(G.method);
  }(A.LogMessageNotification || (A.LogMessageNotification = {})), function(G) {
    G.method = "telemetry/event", G.messageDirection = I.MessageDirection.serverToClient, G.type = new I.ProtocolNotificationType(G.method);
  }(A.TelemetryEventNotification || (A.TelemetryEventNotification = {})), function(G) {
    G.None = 0, G.Full = 1, G.Incremental = 2;
  }(A.TextDocumentSyncKind || (A.TextDocumentSyncKind = {})), function(G) {
    G.method = "textDocument/didOpen", G.messageDirection = I.MessageDirection.clientToServer, G.type = new I.ProtocolNotificationType(G.method);
  }(A.DidOpenTextDocumentNotification || (A.DidOpenTextDocumentNotification = {})), function(G) {
    function H(e) {
      let T = e;
      return T != null && typeof T.text == "string" && T.range !== void 0 && (T.rangeLength === void 0 || typeof T.rangeLength == "number");
    }
    G.isIncremental = H;
    function x(e) {
      let T = e;
      return T != null && typeof T.text == "string" && T.range === void 0 && T.rangeLength === void 0;
    }
    G.isFull = x;
  }(A.TextDocumentContentChangeEvent || (A.TextDocumentContentChangeEvent = {})), function(G) {
    G.method = "textDocument/didChange", G.messageDirection = I.MessageDirection.clientToServer, G.type = new I.ProtocolNotificationType(G.method);
  }(A.DidChangeTextDocumentNotification || (A.DidChangeTextDocumentNotification = {})), function(G) {
    G.method = "textDocument/didClose", G.messageDirection = I.MessageDirection.clientToServer, G.type = new I.ProtocolNotificationType(G.method);
  }(A.DidCloseTextDocumentNotification || (A.DidCloseTextDocumentNotification = {})), function(G) {
    G.method = "textDocument/didSave", G.messageDirection = I.MessageDirection.clientToServer, G.type = new I.ProtocolNotificationType(G.method);
  }(A.DidSaveTextDocumentNotification || (A.DidSaveTextDocumentNotification = {})), function(G) {
    G.Manual = 1, G.AfterDelay = 2, G.FocusOut = 3;
  }(A.TextDocumentSaveReason || (A.TextDocumentSaveReason = {})), function(G) {
    G.method = "textDocument/willSave", G.messageDirection = I.MessageDirection.clientToServer, G.type = new I.ProtocolNotificationType(G.method);
  }(A.WillSaveTextDocumentNotification || (A.WillSaveTextDocumentNotification = {})), function(G) {
    G.method = "textDocument/willSaveWaitUntil", G.messageDirection = I.MessageDirection.clientToServer, G.type = new I.ProtocolRequestType(G.method);
  }(A.WillSaveTextDocumentWaitUntilRequest || (A.WillSaveTextDocumentWaitUntilRequest = {})), function(G) {
    G.method = "workspace/didChangeWatchedFiles", G.messageDirection = I.MessageDirection.clientToServer, G.type = new I.ProtocolNotificationType(G.method);
  }(A.DidChangeWatchedFilesNotification || (A.DidChangeWatchedFilesNotification = {})), function(G) {
    G.Created = 1, G.Changed = 2, G.Deleted = 3;
  }(A.FileChangeType || (A.FileChangeType = {})), function(G) {
    function H(x) {
      const e = x;
      return Q.objectLiteral(e) && (g.URI.is(e.baseUri) || g.WorkspaceFolder.is(e.baseUri)) && Q.string(e.pattern);
    }
    G.is = H;
  }(A.RelativePattern || (A.RelativePattern = {})), function(G) {
    G.Create = 1, G.Change = 2, G.Delete = 4;
  }(A.WatchKind || (A.WatchKind = {})), function(G) {
    G.method = "textDocument/publishDiagnostics", G.messageDirection = I.MessageDirection.serverToClient, G.type = new I.ProtocolNotificationType(G.method);
  }(A.PublishDiagnosticsNotification || (A.PublishDiagnosticsNotification = {})), function(G) {
    G.Invoked = 1, G.TriggerCharacter = 2, G.TriggerForIncompleteCompletions = 3;
  }(A.CompletionTriggerKind || (A.CompletionTriggerKind = {})), function(G) {
    G.method = "textDocument/completion", G.messageDirection = I.MessageDirection.clientToServer, G.type = new I.ProtocolRequestType(G.method);
  }(A.CompletionRequest || (A.CompletionRequest = {})), function(G) {
    G.method = "completionItem/resolve", G.messageDirection = I.MessageDirection.clientToServer, G.type = new I.ProtocolRequestType(G.method);
  }(A.CompletionResolveRequest || (A.CompletionResolveRequest = {})), function(G) {
    G.method = "textDocument/hover", G.messageDirection = I.MessageDirection.clientToServer, G.type = new I.ProtocolRequestType(G.method);
  }(A.HoverRequest || (A.HoverRequest = {})), function(G) {
    G.Invoked = 1, G.TriggerCharacter = 2, G.ContentChange = 3;
  }(A.SignatureHelpTriggerKind || (A.SignatureHelpTriggerKind = {})), function(G) {
    G.method = "textDocument/signatureHelp", G.messageDirection = I.MessageDirection.clientToServer, G.type = new I.ProtocolRequestType(G.method);
  }(A.SignatureHelpRequest || (A.SignatureHelpRequest = {})), function(G) {
    G.method = "textDocument/definition", G.messageDirection = I.MessageDirection.clientToServer, G.type = new I.ProtocolRequestType(G.method);
  }(A.DefinitionRequest || (A.DefinitionRequest = {})), function(G) {
    G.method = "textDocument/references", G.messageDirection = I.MessageDirection.clientToServer, G.type = new I.ProtocolRequestType(G.method);
  }(A.ReferencesRequest || (A.ReferencesRequest = {})), function(G) {
    G.method = "textDocument/documentHighlight", G.messageDirection = I.MessageDirection.clientToServer, G.type = new I.ProtocolRequestType(G.method);
  }(A.DocumentHighlightRequest || (A.DocumentHighlightRequest = {})), function(G) {
    G.method = "textDocument/documentSymbol", G.messageDirection = I.MessageDirection.clientToServer, G.type = new I.ProtocolRequestType(G.method);
  }(A.DocumentSymbolRequest || (A.DocumentSymbolRequest = {})), function(G) {
    G.method = "textDocument/codeAction", G.messageDirection = I.MessageDirection.clientToServer, G.type = new I.ProtocolRequestType(G.method);
  }(A.CodeActionRequest || (A.CodeActionRequest = {})), function(G) {
    G.method = "codeAction/resolve", G.messageDirection = I.MessageDirection.clientToServer, G.type = new I.ProtocolRequestType(G.method);
  }(A.CodeActionResolveRequest || (A.CodeActionResolveRequest = {})), function(G) {
    G.method = "workspace/symbol", G.messageDirection = I.MessageDirection.clientToServer, G.type = new I.ProtocolRequestType(G.method);
  }(A.WorkspaceSymbolRequest || (A.WorkspaceSymbolRequest = {})), function(G) {
    G.method = "workspaceSymbol/resolve", G.messageDirection = I.MessageDirection.clientToServer, G.type = new I.ProtocolRequestType(G.method);
  }(A.WorkspaceSymbolResolveRequest || (A.WorkspaceSymbolResolveRequest = {})), function(G) {
    G.method = "textDocument/codeLens", G.messageDirection = I.MessageDirection.clientToServer, G.type = new I.ProtocolRequestType(G.method);
  }(A.CodeLensRequest || (A.CodeLensRequest = {})), function(G) {
    G.method = "codeLens/resolve", G.messageDirection = I.MessageDirection.clientToServer, G.type = new I.ProtocolRequestType(G.method);
  }(A.CodeLensResolveRequest || (A.CodeLensResolveRequest = {})), function(G) {
    G.method = "workspace/codeLens/refresh", G.messageDirection = I.MessageDirection.serverToClient, G.type = new I.ProtocolRequestType0(G.method);
  }(A.CodeLensRefreshRequest || (A.CodeLensRefreshRequest = {})), function(G) {
    G.method = "textDocument/documentLink", G.messageDirection = I.MessageDirection.clientToServer, G.type = new I.ProtocolRequestType(G.method);
  }(A.DocumentLinkRequest || (A.DocumentLinkRequest = {})), function(G) {
    G.method = "documentLink/resolve", G.messageDirection = I.MessageDirection.clientToServer, G.type = new I.ProtocolRequestType(G.method);
  }(A.DocumentLinkResolveRequest || (A.DocumentLinkResolveRequest = {})), function(G) {
    G.method = "textDocument/formatting", G.messageDirection = I.MessageDirection.clientToServer, G.type = new I.ProtocolRequestType(G.method);
  }(A.DocumentFormattingRequest || (A.DocumentFormattingRequest = {})), function(G) {
    G.method = "textDocument/rangeFormatting", G.messageDirection = I.MessageDirection.clientToServer, G.type = new I.ProtocolRequestType(G.method);
  }(A.DocumentRangeFormattingRequest || (A.DocumentRangeFormattingRequest = {})), function(G) {
    G.method = "textDocument/onTypeFormatting", G.messageDirection = I.MessageDirection.clientToServer, G.type = new I.ProtocolRequestType(G.method);
  }(A.DocumentOnTypeFormattingRequest || (A.DocumentOnTypeFormattingRequest = {})), function(G) {
    G.Identifier = 1;
  }(A.PrepareSupportDefaultBehavior || (A.PrepareSupportDefaultBehavior = {})), function(G) {
    G.method = "textDocument/rename", G.messageDirection = I.MessageDirection.clientToServer, G.type = new I.ProtocolRequestType(G.method);
  }(A.RenameRequest || (A.RenameRequest = {})), function(G) {
    G.method = "textDocument/prepareRename", G.messageDirection = I.MessageDirection.clientToServer, G.type = new I.ProtocolRequestType(G.method);
  }(A.PrepareRenameRequest || (A.PrepareRenameRequest = {})), function(G) {
    G.method = "workspace/executeCommand", G.messageDirection = I.MessageDirection.clientToServer, G.type = new I.ProtocolRequestType(G.method);
  }(A.ExecuteCommandRequest || (A.ExecuteCommandRequest = {})), function(G) {
    G.method = "workspace/applyEdit", G.messageDirection = I.MessageDirection.serverToClient, G.type = new I.ProtocolRequestType("workspace/applyEdit");
  }(A.ApplyWorkspaceEditRequest || (A.ApplyWorkspaceEditRequest = {}));
})(CC);
var ag = {};
Object.defineProperty(ag, "__esModule", { value: !0 });
ag.createProtocolConnection = void 0;
const qB = FI;
function bE(A, I, g, Q) {
  return qB.ConnectionStrategy.is(Q) && (Q = { connectionStrategy: Q }), (0, qB.createMessageConnection)(A, I, g, Q);
}
ag.createProtocolConnection = bE;
(function(A) {
  var I = GA && GA.__createBinding || (Object.create ? function(B, C, E, D) {
    D === void 0 && (D = E);
    var o = Object.getOwnPropertyDescriptor(C, E);
    (!o || ("get" in o ? !C.__esModule : o.writable || o.configurable)) && (o = { enumerable: !0, get: function() {
      return C[E];
    } }), Object.defineProperty(B, D, o);
  } : function(B, C, E, D) {
    D === void 0 && (D = E), B[D] = C[E];
  }), g = GA && GA.__exportStar || function(B, C) {
    for (var E in B)
      E !== "default" && !Object.prototype.hasOwnProperty.call(C, E) && I(C, B, E);
  };
  Object.defineProperty(A, "__esModule", { value: !0 }), A.LSPErrorCodes = A.createProtocolConnection = void 0, g(FI, A), g(EB, A), g(gA, A), g(CC, A);
  var Q = ag;
  Object.defineProperty(A, "createProtocolConnection", { enumerable: !0, get: function() {
    return Q.createProtocolConnection;
  } }), function(B) {
    B.lspReservedErrorRangeStart = -32899, B.RequestFailed = -32803, B.ServerCancelled = -32802, B.ContentModified = -32801, B.RequestCancelled = -32800, B.lspReservedErrorRangeEnd = -32800;
  }(A.LSPErrorCodes || (A.LSPErrorCodes = {}));
})(BC);
(function(A) {
  var I = GA && GA.__createBinding || (Object.create ? function(C, E, D, o) {
    o === void 0 && (o = D);
    var i = Object.getOwnPropertyDescriptor(E, D);
    (!i || ("get" in i ? !E.__esModule : i.writable || i.configurable)) && (i = { enumerable: !0, get: function() {
      return E[D];
    } }), Object.defineProperty(C, o, i);
  } : function(C, E, D, o) {
    o === void 0 && (o = D), C[o] = E[D];
  }), g = GA && GA.__exportStar || function(C, E) {
    for (var D in C)
      D !== "default" && !Object.prototype.hasOwnProperty.call(E, D) && I(E, C, D);
  };
  Object.defineProperty(A, "__esModule", { value: !0 }), A.createProtocolConnection = void 0;
  const Q = SB;
  g(SB, A), g(BC, A);
  function B(C, E, D, o) {
    return (0, Q.createMessageConnection)(C, E, D, o);
  }
  A.createProtocolConnection = B;
})(kA);
Object.defineProperty(VA, "__esModule", { value: !0 });
VA.SemanticTokensBuilder = VA.SemanticTokensDiff = VA.SemanticTokensFeature = void 0;
const Ig = kA, tE = (A) => class extends A {
  get semanticTokens() {
    return {
      refresh: () => this.connection.sendRequest(Ig.SemanticTokensRefreshRequest.type),
      on: (I) => {
        const g = Ig.SemanticTokensRequest.type;
        return this.connection.onRequest(g, (Q, B) => I(Q, B, this.attachWorkDoneProgress(Q), this.attachPartialResultProgress(g, Q)));
      },
      onDelta: (I) => {
        const g = Ig.SemanticTokensDeltaRequest.type;
        return this.connection.onRequest(g, (Q, B) => I(Q, B, this.attachWorkDoneProgress(Q), this.attachPartialResultProgress(g, Q)));
      },
      onRange: (I) => {
        const g = Ig.SemanticTokensRangeRequest.type;
        return this.connection.onRequest(g, (Q, B) => I(Q, B, this.attachWorkDoneProgress(Q), this.attachPartialResultProgress(g, Q)));
      }
    };
  }
};
VA.SemanticTokensFeature = tE;
class SC {
  constructor(I, g) {
    this.originalSequence = I, this.modifiedSequence = g;
  }
  computeDiff() {
    const I = this.originalSequence.length, g = this.modifiedSequence.length;
    let Q = 0;
    for (; Q < g && Q < I && this.originalSequence[Q] === this.modifiedSequence[Q]; )
      Q++;
    if (Q < g && Q < I) {
      let B = I - 1, C = g - 1;
      for (; B >= Q && C >= Q && this.originalSequence[B] === this.modifiedSequence[C]; )
        B--, C--;
      (B < Q || C < Q) && (B++, C++);
      const E = B - Q + 1, D = this.modifiedSequence.slice(Q, C + 1);
      return D.length === 1 && D[0] === this.originalSequence[B] ? [
        { start: Q, deleteCount: E - 1 }
      ] : [
        { start: Q, deleteCount: E, data: D }
      ];
    } else
      return Q < g ? [
        { start: Q, deleteCount: 0, data: this.modifiedSequence.slice(Q) }
      ] : Q < I ? [
        { start: Q, deleteCount: I - Q }
      ] : [];
  }
}
VA.SemanticTokensDiff = SC;
class nE {
  constructor() {
    this._prevData = void 0, this.initialize();
  }
  initialize() {
    this._id = Date.now(), this._prevLine = 0, this._prevChar = 0, this._data = [], this._dataLen = 0;
  }
  push(I, g, Q, B, C) {
    let E = I, D = g;
    this._dataLen > 0 && (E -= this._prevLine, E === 0 && (D -= this._prevChar)), this._data[this._dataLen++] = E, this._data[this._dataLen++] = D, this._data[this._dataLen++] = Q, this._data[this._dataLen++] = B, this._data[this._dataLen++] = C, this._prevLine = I, this._prevChar = g;
  }
  get id() {
    return this._id.toString();
  }
  previousResult(I) {
    this.id === I && (this._prevData = this._data), this.initialize();
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
      edits: new SC(this._prevData, this._data).computeDiff()
    } : this.build();
  }
}
VA.SemanticTokensBuilder = nE;
var uI = {};
Object.defineProperty(uI, "__esModule", { value: !0 });
uI.TextDocuments = void 0;
const GI = kA;
class WE {
  /**
   * Create a new text document manager.
   */
  constructor(I) {
    this._configuration = I, this._syncedDocuments = /* @__PURE__ */ new Map(), this._onDidChangeContent = new GI.Emitter(), this._onDidOpen = new GI.Emitter(), this._onDidClose = new GI.Emitter(), this._onDidSave = new GI.Emitter(), this._onWillSave = new GI.Emitter();
  }
  /**
   * An event that fires when a text document managed by this manager
   * has been opened.
   */
  get onDidOpen() {
    return this._onDidOpen.event;
  }
  /**
   * An event that fires when a text document managed by this manager
   * has been opened or the content changes.
   */
  get onDidChangeContent() {
    return this._onDidChangeContent.event;
  }
  /**
   * An event that fires when a text document managed by this manager
   * will be saved.
   */
  get onWillSave() {
    return this._onWillSave.event;
  }
  /**
   * Sets a handler that will be called if a participant wants to provide
   * edits during a text document save.
   */
  onWillSaveWaitUntil(I) {
    this._willSaveWaitUntil = I;
  }
  /**
   * An event that fires when a text document managed by this manager
   * has been saved.
   */
  get onDidSave() {
    return this._onDidSave.event;
  }
  /**
   * An event that fires when a text document managed by this manager
   * has been closed.
   */
  get onDidClose() {
    return this._onDidClose.event;
  }
  /**
   * Returns the document for the given URI. Returns undefined if
   * the document is not managed by this instance.
   *
   * @param uri The text document's URI to retrieve.
   * @return the text document or `undefined`.
   */
  get(I) {
    return this._syncedDocuments.get(I);
  }
  /**
   * Returns all text documents managed by this instance.
   *
   * @return all text documents.
   */
  all() {
    return Array.from(this._syncedDocuments.values());
  }
  /**
   * Returns the URIs of all text documents managed by this instance.
   *
   * @return the URI's of all text documents.
   */
  keys() {
    return Array.from(this._syncedDocuments.keys());
  }
  /**
   * Listens for `low level` notification on the given connection to
   * update the text documents managed by this instance.
   *
   * Please note that the connection only provides handlers not an event model. Therefore
   * listening on a connection will overwrite the following handlers on a connection:
   * `onDidOpenTextDocument`, `onDidChangeTextDocument`, `onDidCloseTextDocument`,
   * `onWillSaveTextDocument`, `onWillSaveTextDocumentWaitUntil` and `onDidSaveTextDocument`.
   *
   * Use the corresponding events on the TextDocuments instance instead.
   *
   * @param connection The connection to listen on.
   */
  listen(I) {
    I.__textDocumentSync = GI.TextDocumentSyncKind.Incremental;
    const g = [];
    return g.push(I.onDidOpenTextDocument((Q) => {
      const B = Q.textDocument, C = this._configuration.create(B.uri, B.languageId, B.version, B.text);
      this._syncedDocuments.set(B.uri, C);
      const E = Object.freeze({ document: C });
      this._onDidOpen.fire(E), this._onDidChangeContent.fire(E);
    })), g.push(I.onDidChangeTextDocument((Q) => {
      const B = Q.textDocument, C = Q.contentChanges;
      if (C.length === 0)
        return;
      const { version: E } = B;
      if (E == null)
        throw new Error(`Received document change event for ${B.uri} without valid version identifier`);
      let D = this._syncedDocuments.get(B.uri);
      D !== void 0 && (D = this._configuration.update(D, C, E), this._syncedDocuments.set(B.uri, D), this._onDidChangeContent.fire(Object.freeze({ document: D })));
    })), g.push(I.onDidCloseTextDocument((Q) => {
      let B = this._syncedDocuments.get(Q.textDocument.uri);
      B !== void 0 && (this._syncedDocuments.delete(Q.textDocument.uri), this._onDidClose.fire(Object.freeze({ document: B })));
    })), g.push(I.onWillSaveTextDocument((Q) => {
      let B = this._syncedDocuments.get(Q.textDocument.uri);
      B !== void 0 && this._onWillSave.fire(Object.freeze({ document: B, reason: Q.reason }));
    })), g.push(I.onWillSaveTextDocumentWaitUntil((Q, B) => {
      let C = this._syncedDocuments.get(Q.textDocument.uri);
      return C !== void 0 && this._willSaveWaitUntil ? this._willSaveWaitUntil(Object.freeze({ document: C, reason: Q.reason }), B) : [];
    })), g.push(I.onDidSaveTextDocument((Q) => {
      let B = this._syncedDocuments.get(Q.textDocument.uri);
      B !== void 0 && this._onDidSave.fire(Object.freeze({ document: B }));
    })), GI.Disposable.create(() => {
      g.forEach((Q) => Q.dispose());
    });
  }
}
uI.TextDocuments = WE;
var kI = {};
Object.defineProperty(kI, "__esModule", { value: !0 });
kI.NotebookDocuments = kI.NotebookSyncFeature = void 0;
const LA = kA, OB = uI, XE = (A) => class extends A {
  get synchronization() {
    return {
      onDidOpenNotebookDocument: (I) => this.connection.onNotification(LA.DidOpenNotebookDocumentNotification.type, (g) => {
        I(g);
      }),
      onDidChangeNotebookDocument: (I) => this.connection.onNotification(LA.DidChangeNotebookDocumentNotification.type, (g) => {
        I(g);
      }),
      onDidSaveNotebookDocument: (I) => this.connection.onNotification(LA.DidSaveNotebookDocumentNotification.type, (g) => {
        I(g);
      }),
      onDidCloseNotebookDocument: (I) => this.connection.onNotification(LA.DidCloseNotebookDocumentNotification.type, (g) => {
        I(g);
      })
    };
  }
};
kI.NotebookSyncFeature = XE;
class KI {
  onDidOpenTextDocument(I) {
    return this.openHandler = I, LA.Disposable.create(() => {
      this.openHandler = void 0;
    });
  }
  openTextDocument(I) {
    this.openHandler && this.openHandler(I);
  }
  onDidChangeTextDocument(I) {
    return this.changeHandler = I, LA.Disposable.create(() => {
      this.changeHandler = I;
    });
  }
  changeTextDocument(I) {
    this.changeHandler && this.changeHandler(I);
  }
  onDidCloseTextDocument(I) {
    return this.closeHandler = I, LA.Disposable.create(() => {
      this.closeHandler = void 0;
    });
  }
  closeTextDocument(I) {
    this.closeHandler && this.closeHandler(I);
  }
  onWillSaveTextDocument() {
    return KI.NULL_DISPOSE;
  }
  onWillSaveTextDocumentWaitUntil() {
    return KI.NULL_DISPOSE;
  }
  onDidSaveTextDocument() {
    return KI.NULL_DISPOSE;
  }
}
KI.NULL_DISPOSE = Object.freeze({ dispose: () => {
} });
class xE {
  constructor(I) {
    I instanceof OB.TextDocuments ? this._cellTextDocuments = I : this._cellTextDocuments = new OB.TextDocuments(I), this.notebookDocuments = /* @__PURE__ */ new Map(), this.notebookCellMap = /* @__PURE__ */ new Map(), this._onDidOpen = new LA.Emitter(), this._onDidChange = new LA.Emitter(), this._onDidSave = new LA.Emitter(), this._onDidClose = new LA.Emitter();
  }
  get cellTextDocuments() {
    return this._cellTextDocuments;
  }
  getCellTextDocument(I) {
    return this._cellTextDocuments.get(I.document);
  }
  getNotebookDocument(I) {
    return this.notebookDocuments.get(I);
  }
  getNotebookCell(I) {
    const g = this.notebookCellMap.get(I);
    return g && g[0];
  }
  findNotebookDocumentForCell(I) {
    const g = typeof I == "string" ? I : I.document, Q = this.notebookCellMap.get(g);
    return Q && Q[1];
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
  /**
   * Listens for `low level` notification on the given connection to
   * update the notebook documents managed by this instance.
   *
   * Please note that the connection only provides handlers not an event model. Therefore
   * listening on a connection will overwrite the following handlers on a connection:
   * `onDidOpenNotebookDocument`, `onDidChangeNotebookDocument`, `onDidSaveNotebookDocument`,
   *  and `onDidCloseNotebookDocument`.
   *
   * @param connection The connection to listen on.
   */
  listen(I) {
    const g = new KI(), Q = [];
    return Q.push(this.cellTextDocuments.listen(g)), Q.push(I.notebooks.synchronization.onDidOpenNotebookDocument((B) => {
      this.notebookDocuments.set(B.notebookDocument.uri, B.notebookDocument);
      for (const C of B.cellTextDocuments)
        g.openTextDocument({ textDocument: C });
      this.updateCellMap(B.notebookDocument), this._onDidOpen.fire(B.notebookDocument);
    })), Q.push(I.notebooks.synchronization.onDidChangeNotebookDocument((B) => {
      const C = this.notebookDocuments.get(B.notebookDocument.uri);
      if (C === void 0)
        return;
      C.version = B.notebookDocument.version;
      const E = C.metadata;
      let D = !1;
      const o = B.change;
      o.metadata !== void 0 && (D = !0, C.metadata = o.metadata);
      const i = [], N = [], F = [], h = [];
      if (o.cells !== void 0) {
        const l = o.cells;
        if (l.structure !== void 0) {
          const t = l.structure.array;
          if (C.cells.splice(t.start, t.deleteCount, ...t.cells !== void 0 ? t.cells : []), l.structure.didOpen !== void 0)
            for (const V of l.structure.didOpen)
              g.openTextDocument({ textDocument: V }), i.push(V.uri);
          if (l.structure.didClose)
            for (const V of l.structure.didClose)
              g.closeTextDocument({ textDocument: V }), N.push(V.uri);
        }
        if (l.data !== void 0) {
          const t = new Map(l.data.map((V) => [V.document, V]));
          for (let V = 0; V <= C.cells.length; V++) {
            const f = t.get(C.cells[V].document);
            if (f !== void 0) {
              const hA = C.cells.splice(V, 1, f);
              if (F.push({ old: hA[0], new: f }), t.delete(f.document), t.size === 0)
                break;
            }
          }
        }
        if (l.textContent !== void 0)
          for (const t of l.textContent)
            g.changeTextDocument({ textDocument: t.document, contentChanges: t.changes }), h.push(t.document.uri);
      }
      this.updateCellMap(C);
      const k = { notebookDocument: C };
      D && (k.metadata = { old: E, new: C.metadata });
      const c = [];
      for (const l of i)
        c.push(this.getNotebookCell(l));
      const L = [];
      for (const l of N)
        L.push(this.getNotebookCell(l));
      const O = [];
      for (const l of h)
        O.push(this.getNotebookCell(l));
      (c.length > 0 || L.length > 0 || F.length > 0 || O.length > 0) && (k.cells = { added: c, removed: L, changed: { data: F, textContent: O } }), (k.metadata !== void 0 || k.cells !== void 0) && this._onDidChange.fire(k);
    })), Q.push(I.notebooks.synchronization.onDidSaveNotebookDocument((B) => {
      const C = this.notebookDocuments.get(B.notebookDocument.uri);
      C !== void 0 && this._onDidSave.fire(C);
    })), Q.push(I.notebooks.synchronization.onDidCloseNotebookDocument((B) => {
      const C = this.notebookDocuments.get(B.notebookDocument.uri);
      if (C !== void 0) {
        this._onDidClose.fire(C);
        for (const E of B.cellTextDocuments)
          g.closeTextDocument({ textDocument: E });
        this.notebookDocuments.delete(B.notebookDocument.uri);
        for (const E of C.cells)
          this.notebookCellMap.delete(E.document);
      }
    })), LA.Disposable.create(() => {
      Q.forEach((B) => B.dispose());
    });
  }
  updateCellMap(I) {
    for (const g of I.cells)
      this.notebookCellMap.set(g.document, [g, I]);
  }
}
kI.NotebookDocuments = xE;
var LC = {}, EA = {};
Object.defineProperty(EA, "__esModule", { value: !0 });
EA.thenable = EA.typedArray = EA.stringArray = EA.array = EA.func = EA.error = EA.number = EA.string = EA.boolean = void 0;
function VE(A) {
  return A === !0 || A === !1;
}
EA.boolean = VE;
function qC(A) {
  return typeof A == "string" || A instanceof String;
}
EA.string = qC;
function TE(A) {
  return typeof A == "number" || A instanceof Number;
}
EA.number = TE;
function zE(A) {
  return A instanceof Error;
}
EA.error = zE;
function OC(A) {
  return typeof A == "function";
}
EA.func = OC;
function lC(A) {
  return Array.isArray(A);
}
EA.array = lC;
function fE(A) {
  return lC(A) && A.every((I) => qC(I));
}
EA.stringArray = fE;
function rE(A, I) {
  return Array.isArray(A) && A.every(I);
}
EA.typedArray = rE;
function uE(A) {
  return A && OC(A.then);
}
EA.thenable = uE;
var sA = {};
Object.defineProperty(sA, "__esModule", { value: !0 });
sA.generateUuid = sA.parse = sA.isUUID = sA.v4 = sA.empty = void 0;
class DB {
  constructor(I) {
    this._value = I;
  }
  asHex() {
    return this._value;
  }
  equals(I) {
    return this.asHex() === I.asHex();
  }
}
class X extends DB {
  constructor() {
    super([
      X._randomHex(),
      X._randomHex(),
      X._randomHex(),
      X._randomHex(),
      X._randomHex(),
      X._randomHex(),
      X._randomHex(),
      X._randomHex(),
      "-",
      X._randomHex(),
      X._randomHex(),
      X._randomHex(),
      X._randomHex(),
      "-",
      "4",
      X._randomHex(),
      X._randomHex(),
      X._randomHex(),
      "-",
      X._oneOf(X._timeHighBits),
      X._randomHex(),
      X._randomHex(),
      X._randomHex(),
      "-",
      X._randomHex(),
      X._randomHex(),
      X._randomHex(),
      X._randomHex(),
      X._randomHex(),
      X._randomHex(),
      X._randomHex(),
      X._randomHex(),
      X._randomHex(),
      X._randomHex(),
      X._randomHex(),
      X._randomHex()
    ].join(""));
  }
  static _oneOf(I) {
    return I[Math.floor(I.length * Math.random())];
  }
  static _randomHex() {
    return X._oneOf(X._chars);
  }
}
X._chars = ["0", "1", "2", "3", "4", "5", "6", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
X._timeHighBits = ["8", "9", "a", "b"];
sA.empty = new DB("00000000-0000-0000-0000-000000000000");
function pC() {
  return new X();
}
sA.v4 = pC;
const PE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function jC(A) {
  return PE.test(A);
}
sA.isUUID = jC;
function vE(A) {
  if (!jC(A))
    throw new Error("invalid uuid");
  return new DB(A);
}
sA.parse = vE;
function _E() {
  return pC().asHex();
}
sA.generateUuid = _E;
var vA = {};
Object.defineProperty(vA, "__esModule", { value: !0 });
vA.attachPartialResult = vA.ProgressFeature = vA.attachWorkDone = void 0;
const _A = kA, $E = sA;
class $A {
  constructor(I, g) {
    this._connection = I, this._token = g, $A.Instances.set(this._token, this);
  }
  begin(I, g, Q, B) {
    let C = {
      kind: "begin",
      title: I,
      percentage: g,
      message: Q,
      cancellable: B
    };
    this._connection.sendProgress(_A.WorkDoneProgress.type, this._token, C);
  }
  report(I, g) {
    let Q = {
      kind: "report"
    };
    typeof I == "number" ? (Q.percentage = I, g !== void 0 && (Q.message = g)) : Q.message = I, this._connection.sendProgress(_A.WorkDoneProgress.type, this._token, Q);
  }
  done() {
    $A.Instances.delete(this._token), this._connection.sendProgress(_A.WorkDoneProgress.type, this._token, { kind: "end" });
  }
}
$A.Instances = /* @__PURE__ */ new Map();
class lB extends $A {
  constructor(I, g) {
    super(I, g), this._source = new _A.CancellationTokenSource();
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
class oB {
  constructor() {
  }
  begin() {
  }
  report() {
  }
  done() {
  }
}
class pB extends oB {
  constructor() {
    super(), this._source = new _A.CancellationTokenSource();
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
function AD(A, I) {
  if (I === void 0 || I.workDoneToken === void 0)
    return new oB();
  const g = I.workDoneToken;
  return delete I.workDoneToken, new $A(A, g);
}
vA.attachWorkDone = AD;
const ID = (A) => class extends A {
  constructor() {
    super(), this._progressSupported = !1;
  }
  initialize(I) {
    var g;
    super.initialize(I), ((g = I == null ? void 0 : I.window) == null ? void 0 : g.workDoneProgress) === !0 && (this._progressSupported = !0, this.connection.onNotification(_A.WorkDoneProgressCancelNotification.type, (Q) => {
      let B = $A.Instances.get(Q.token);
      (B instanceof lB || B instanceof pB) && B.cancel();
    }));
  }
  attachWorkDoneProgress(I) {
    return I === void 0 ? new oB() : new $A(this.connection, I);
  }
  createWorkDoneProgress() {
    if (this._progressSupported) {
      const I = (0, $E.generateUuid)();
      return this.connection.sendRequest(_A.WorkDoneProgressCreateRequest.type, { token: I }).then(() => new lB(this.connection, I));
    } else
      return Promise.resolve(new pB());
  }
};
vA.ProgressFeature = ID;
var AB;
(function(A) {
  A.type = new _A.ProgressType();
})(AB || (AB = {}));
class gD {
  constructor(I, g) {
    this._connection = I, this._token = g;
  }
  report(I) {
    this._connection.sendProgress(AB.type, this._token, I);
  }
}
function QD(A, I) {
  if (I === void 0 || I.partialResultToken === void 0)
    return;
  const g = I.partialResultToken;
  return delete I.partialResultToken, new gD(A, g);
}
vA.attachPartialResult = QD;
var Rg = {};
Object.defineProperty(Rg, "__esModule", { value: !0 });
Rg.ConfigurationFeature = void 0;
const BD = kA, CD = EA, ED = (A) => class extends A {
  getConfiguration(I) {
    return I ? CD.string(I) ? this._getConfiguration({ section: I }) : this._getConfiguration(I) : this._getConfiguration({});
  }
  _getConfiguration(I) {
    let g = {
      items: Array.isArray(I) ? I : [I]
    };
    return this.connection.sendRequest(BD.ConfigurationRequest.type, g).then((Q) => Array.isArray(Q) ? Array.isArray(I) ? Q : Q[0] : Array.isArray(I) ? [] : null);
  }
};
Rg.ConfigurationFeature = ED;
var Jg = {};
Object.defineProperty(Jg, "__esModule", { value: !0 });
Jg.WorkspaceFoldersFeature = void 0;
const gg = kA, DD = (A) => class extends A {
  constructor() {
    super(), this._notificationIsAutoRegistered = !1;
  }
  initialize(I) {
    super.initialize(I);
    let g = I.workspace;
    g && g.workspaceFolders && (this._onDidChangeWorkspaceFolders = new gg.Emitter(), this.connection.onNotification(gg.DidChangeWorkspaceFoldersNotification.type, (Q) => {
      this._onDidChangeWorkspaceFolders.fire(Q.event);
    }));
  }
  fillServerCapabilities(I) {
    var Q, B;
    super.fillServerCapabilities(I);
    const g = (B = (Q = I.workspace) == null ? void 0 : Q.workspaceFolders) == null ? void 0 : B.changeNotifications;
    this._notificationIsAutoRegistered = g === !0 || typeof g == "string";
  }
  getWorkspaceFolders() {
    return this.connection.sendRequest(gg.WorkspaceFoldersRequest.type);
  }
  get onDidChangeWorkspaceFolders() {
    if (!this._onDidChangeWorkspaceFolders)
      throw new Error("Client doesn't support sending workspace folder change events.");
    return !this._notificationIsAutoRegistered && !this._unregistration && (this._unregistration = this.connection.client.register(gg.DidChangeWorkspaceFoldersNotification.type)), this._onDidChangeWorkspaceFolders.event;
  }
};
Jg.WorkspaceFoldersFeature = DD;
var Ug = {};
Object.defineProperty(Ug, "__esModule", { value: !0 });
Ug.CallHierarchyFeature = void 0;
const zg = kA, oD = (A) => class extends A {
  get callHierarchy() {
    return {
      onPrepare: (I) => this.connection.onRequest(zg.CallHierarchyPrepareRequest.type, (g, Q) => I(g, Q, this.attachWorkDoneProgress(g), void 0)),
      onIncomingCalls: (I) => {
        const g = zg.CallHierarchyIncomingCallsRequest.type;
        return this.connection.onRequest(g, (Q, B) => I(Q, B, this.attachWorkDoneProgress(Q), this.attachPartialResultProgress(g, Q)));
      },
      onOutgoingCalls: (I) => {
        const g = zg.CallHierarchyOutgoingCallsRequest.type;
        return this.connection.onRequest(g, (Q, B) => I(Q, B, this.attachWorkDoneProgress(Q), this.attachPartialResultProgress(g, Q)));
      }
    };
  }
};
Ug.CallHierarchyFeature = oD;
var yg = {};
Object.defineProperty(yg, "__esModule", { value: !0 });
yg.ShowDocumentFeature = void 0;
const GD = kA, iD = (A) => class extends A {
  showDocument(I) {
    return this.connection.sendRequest(GD.ShowDocumentRequest.type, I);
  }
};
yg.ShowDocumentFeature = iD;
var sg = {};
Object.defineProperty(sg, "__esModule", { value: !0 });
sg.FileOperationsFeature = void 0;
const JI = kA, wD = (A) => class extends A {
  onDidCreateFiles(I) {
    return this.connection.onNotification(JI.DidCreateFilesNotification.type, (g) => {
      I(g);
    });
  }
  onDidRenameFiles(I) {
    return this.connection.onNotification(JI.DidRenameFilesNotification.type, (g) => {
      I(g);
    });
  }
  onDidDeleteFiles(I) {
    return this.connection.onNotification(JI.DidDeleteFilesNotification.type, (g) => {
      I(g);
    });
  }
  onWillCreateFiles(I) {
    return this.connection.onRequest(JI.WillCreateFilesRequest.type, (g, Q) => I(g, Q));
  }
  onWillRenameFiles(I) {
    return this.connection.onRequest(JI.WillRenameFilesRequest.type, (g, Q) => I(g, Q));
  }
  onWillDeleteFiles(I) {
    return this.connection.onRequest(JI.WillDeleteFilesRequest.type, (g, Q) => I(g, Q));
  }
};
sg.FileOperationsFeature = wD;
var Kg = {};
Object.defineProperty(Kg, "__esModule", { value: !0 });
Kg.LinkedEditingRangeFeature = void 0;
const ND = kA, kD = (A) => class extends A {
  onLinkedEditingRange(I) {
    return this.connection.onRequest(ND.LinkedEditingRangeRequest.type, (g, Q) => I(g, Q, this.attachWorkDoneProgress(g), void 0));
  }
};
Kg.LinkedEditingRangeFeature = kD;
var Zg = {};
Object.defineProperty(Zg, "__esModule", { value: !0 });
Zg.TypeHierarchyFeature = void 0;
const fg = kA, hD = (A) => class extends A {
  get typeHierarchy() {
    return {
      onPrepare: (I) => this.connection.onRequest(fg.TypeHierarchyPrepareRequest.type, (g, Q) => I(g, Q, this.attachWorkDoneProgress(g), void 0)),
      onSupertypes: (I) => {
        const g = fg.TypeHierarchySupertypesRequest.type;
        return this.connection.onRequest(g, (Q, B) => I(Q, B, this.attachWorkDoneProgress(Q), this.attachPartialResultProgress(g, Q)));
      },
      onSubtypes: (I) => {
        const g = fg.TypeHierarchySubtypesRequest.type;
        return this.connection.onRequest(g, (Q, B) => I(Q, B, this.attachWorkDoneProgress(Q), this.attachPartialResultProgress(g, Q)));
      }
    };
  }
};
Zg.TypeHierarchyFeature = hD;
var Hg = {};
Object.defineProperty(Hg, "__esModule", { value: !0 });
Hg.InlineValueFeature = void 0;
const jB = kA, FD = (A) => class extends A {
  get inlineValue() {
    return {
      refresh: () => this.connection.sendRequest(jB.InlineValueRefreshRequest.type),
      on: (I) => this.connection.onRequest(jB.InlineValueRequest.type, (g, Q) => I(g, Q, this.attachWorkDoneProgress(g)))
    };
  }
};
Hg.InlineValueFeature = FD;
var Sg = {};
Object.defineProperty(Sg, "__esModule", { value: !0 });
Sg.InlayHintFeature = void 0;
const rg = kA, YD = (A) => class extends A {
  get inlayHint() {
    return {
      refresh: () => this.connection.sendRequest(rg.InlayHintRefreshRequest.type),
      on: (I) => this.connection.onRequest(rg.InlayHintRequest.type, (g, Q) => I(g, Q, this.attachWorkDoneProgress(g))),
      resolve: (I) => this.connection.onRequest(rg.InlayHintResolveRequest.type, (g, Q) => I(g, Q))
    };
  }
};
Sg.InlayHintFeature = YD;
var Lg = {};
Object.defineProperty(Lg, "__esModule", { value: !0 });
Lg.DiagnosticFeature = void 0;
const eI = kA, MD = (A) => class extends A {
  get diagnostics() {
    return {
      refresh: () => this.connection.sendRequest(eI.DiagnosticRefreshRequest.type),
      on: (I) => this.connection.onRequest(eI.DocumentDiagnosticRequest.type, (g, Q) => I(g, Q, this.attachWorkDoneProgress(g), this.attachPartialResultProgress(eI.DocumentDiagnosticRequest.partialResult, g))),
      onWorkspace: (I) => this.connection.onRequest(eI.WorkspaceDiagnosticRequest.type, (g, Q) => I(g, Q, this.attachWorkDoneProgress(g), this.attachPartialResultProgress(eI.WorkspaceDiagnosticRequest.partialResult, g)))
    };
  }
};
Lg.DiagnosticFeature = MD;
var qg = {};
Object.defineProperty(qg, "__esModule", { value: !0 });
qg.MonikerFeature = void 0;
const cD = kA, aD = (A) => class extends A {
  get moniker() {
    return {
      on: (I) => {
        const g = cD.MonikerRequest.type;
        return this.connection.onRequest(g, (Q, B) => I(Q, B, this.attachWorkDoneProgress(Q), this.attachPartialResultProgress(g, Q)));
      }
    };
  }
};
qg.MonikerFeature = aD;
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.createConnection = A.combineFeatures = A.combineNotebooksFeatures = A.combineLanguagesFeatures = A.combineWorkspaceFeatures = A.combineWindowFeatures = A.combineClientFeatures = A.combineTracerFeatures = A.combineTelemetryFeatures = A.combineConsoleFeatures = A._NotebooksImpl = A._LanguagesImpl = A.BulkUnregistration = A.BulkRegistration = A.ErrorMessageTracker = void 0;
  const I = kA, g = EA, Q = sA, B = vA, C = Rg, E = Jg, D = Ug, o = VA, i = yg, N = sg, F = Kg, h = Zg, k = Hg, c = Sg, L = Lg, O = kI, l = qg;
  function t(m) {
    if (m !== null)
      return m;
  }
  class V {
    constructor() {
      this._messages = /* @__PURE__ */ Object.create(null);
    }
    /**
     * Add a message to the tracker.
     *
     * @param message The message to add.
     */
    add(Y) {
      let K = this._messages[Y];
      K || (K = 0), K++, this._messages[Y] = K;
    }
    /**
     * Send all tracked messages to the connection's window.
     *
     * @param connection The connection established between client and server.
     */
    sendErrors(Y) {
      Object.keys(this._messages).forEach((K) => {
        Y.window.showErrorMessage(K);
      });
    }
  }
  A.ErrorMessageTracker = V;
  class f {
    constructor() {
    }
    rawAttach(Y) {
      this._rawConnection = Y;
    }
    attach(Y) {
      this._connection = Y;
    }
    get connection() {
      if (!this._connection)
        throw new Error("Remote is not attached to a connection yet.");
      return this._connection;
    }
    fillServerCapabilities(Y) {
    }
    initialize(Y) {
    }
    error(Y) {
      this.send(I.MessageType.Error, Y);
    }
    warn(Y) {
      this.send(I.MessageType.Warning, Y);
    }
    info(Y) {
      this.send(I.MessageType.Info, Y);
    }
    log(Y) {
      this.send(I.MessageType.Log, Y);
    }
    send(Y, K) {
      this._rawConnection && this._rawConnection.sendNotification(I.LogMessageNotification.type, { type: Y, message: K }).catch(() => {
        (0, I.RAL)().console.error("Sending log message failed");
      });
    }
  }
  class hA {
    constructor() {
    }
    attach(Y) {
      this._connection = Y;
    }
    get connection() {
      if (!this._connection)
        throw new Error("Remote is not attached to a connection yet.");
      return this._connection;
    }
    initialize(Y) {
    }
    fillServerCapabilities(Y) {
    }
    showErrorMessage(Y, ...K) {
      let d = { type: I.MessageType.Error, message: Y, actions: K };
      return this.connection.sendRequest(I.ShowMessageRequest.type, d).then(t);
    }
    showWarningMessage(Y, ...K) {
      let d = { type: I.MessageType.Warning, message: Y, actions: K };
      return this.connection.sendRequest(I.ShowMessageRequest.type, d).then(t);
    }
    showInformationMessage(Y, ...K) {
      let d = { type: I.MessageType.Info, message: Y, actions: K };
      return this.connection.sendRequest(I.ShowMessageRequest.type, d).then(t);
    }
  }
  const $ = (0, i.ShowDocumentFeature)((0, B.ProgressFeature)(hA));
  (function(m) {
    function Y() {
      return new wA();
    }
    m.create = Y;
  })(A.BulkRegistration || (A.BulkRegistration = {}));
  class wA {
    constructor() {
      this._registrations = [], this._registered = /* @__PURE__ */ new Set();
    }
    add(Y, K) {
      const d = g.string(Y) ? Y : Y.method;
      if (this._registered.has(d))
        throw new Error(`${d} is already added to this registration`);
      const R = Q.generateUuid();
      this._registrations.push({
        id: R,
        method: d,
        registerOptions: K || {}
      }), this._registered.add(d);
    }
    asRegistrationParams() {
      return {
        registrations: this._registrations
      };
    }
  }
  (function(m) {
    function Y() {
      return new Z(void 0, []);
    }
    m.create = Y;
  })(A.BulkUnregistration || (A.BulkUnregistration = {}));
  class Z {
    constructor(Y, K) {
      this._connection = Y, this._unregistrations = /* @__PURE__ */ new Map(), K.forEach((d) => {
        this._unregistrations.set(d.method, d);
      });
    }
    get isAttached() {
      return !!this._connection;
    }
    attach(Y) {
      this._connection = Y;
    }
    add(Y) {
      this._unregistrations.set(Y.method, Y);
    }
    dispose() {
      let Y = [];
      for (let d of this._unregistrations.values())
        Y.push(d);
      let K = {
        unregisterations: Y
      };
      this._connection.sendRequest(I.UnregistrationRequest.type, K).catch(() => {
        this._connection.console.info("Bulk unregistration failed.");
      });
    }
    disposeSingle(Y) {
      const K = g.string(Y) ? Y : Y.method, d = this._unregistrations.get(K);
      if (!d)
        return !1;
      let R = {
        unregisterations: [d]
      };
      return this._connection.sendRequest(I.UnregistrationRequest.type, R).then(() => {
        this._unregistrations.delete(K);
      }, (MA) => {
        this._connection.console.info(`Un-registering request handler for ${d.id} failed.`);
      }), !0;
    }
  }
  class n {
    attach(Y) {
      this._connection = Y;
    }
    get connection() {
      if (!this._connection)
        throw new Error("Remote is not attached to a connection yet.");
      return this._connection;
    }
    initialize(Y) {
    }
    fillServerCapabilities(Y) {
    }
    register(Y, K, d) {
      return Y instanceof wA ? this.registerMany(Y) : Y instanceof Z ? this.registerSingle1(Y, K, d) : this.registerSingle2(Y, K);
    }
    registerSingle1(Y, K, d) {
      const R = g.string(K) ? K : K.method, MA = Q.generateUuid();
      let KA = {
        registrations: [{ id: MA, method: R, registerOptions: d || {} }]
      };
      return Y.isAttached || Y.attach(this.connection), this.connection.sendRequest(I.RegistrationRequest.type, KA).then((fA) => (Y.add({ id: MA, method: R }), Y), (fA) => (this.connection.console.info(`Registering request handler for ${R} failed.`), Promise.reject(fA)));
    }
    registerSingle2(Y, K) {
      const d = g.string(Y) ? Y : Y.method, R = Q.generateUuid();
      let MA = {
        registrations: [{ id: R, method: d, registerOptions: K || {} }]
      };
      return this.connection.sendRequest(I.RegistrationRequest.type, MA).then((KA) => I.Disposable.create(() => {
        this.unregisterSingle(R, d).catch(() => {
          this.connection.console.info(`Un-registering capability with id ${R} failed.`);
        });
      }), (KA) => (this.connection.console.info(`Registering request handler for ${d} failed.`), Promise.reject(KA)));
    }
    unregisterSingle(Y, K) {
      let d = {
        unregisterations: [{ id: Y, method: K }]
      };
      return this.connection.sendRequest(I.UnregistrationRequest.type, d).catch(() => {
        this.connection.console.info(`Un-registering request handler for ${Y} failed.`);
      });
    }
    registerMany(Y) {
      let K = Y.asRegistrationParams();
      return this.connection.sendRequest(I.RegistrationRequest.type, K).then(() => new Z(this._connection, K.registrations.map((d) => ({ id: d.id, method: d.method }))), (d) => (this.connection.console.info("Bulk registration failed."), Promise.reject(d)));
    }
  }
  class W {
    constructor() {
    }
    attach(Y) {
      this._connection = Y;
    }
    get connection() {
      if (!this._connection)
        throw new Error("Remote is not attached to a connection yet.");
      return this._connection;
    }
    initialize(Y) {
    }
    fillServerCapabilities(Y) {
    }
    applyEdit(Y) {
      function K(R) {
        return R && !!R.edit;
      }
      let d = K(Y) ? Y : { edit: Y };
      return this.connection.sendRequest(I.ApplyWorkspaceEditRequest.type, d);
    }
  }
  const j = (0, N.FileOperationsFeature)((0, E.WorkspaceFoldersFeature)((0, C.ConfigurationFeature)(W)));
  class G {
    constructor() {
      this._trace = I.Trace.Off;
    }
    attach(Y) {
      this._connection = Y;
    }
    get connection() {
      if (!this._connection)
        throw new Error("Remote is not attached to a connection yet.");
      return this._connection;
    }
    initialize(Y) {
    }
    fillServerCapabilities(Y) {
    }
    set trace(Y) {
      this._trace = Y;
    }
    log(Y, K) {
      this._trace !== I.Trace.Off && this.connection.sendNotification(I.LogTraceNotification.type, {
        message: Y,
        verbose: this._trace === I.Trace.Verbose ? K : void 0
      }).catch(() => {
      });
    }
  }
  class H {
    constructor() {
    }
    attach(Y) {
      this._connection = Y;
    }
    get connection() {
      if (!this._connection)
        throw new Error("Remote is not attached to a connection yet.");
      return this._connection;
    }
    initialize(Y) {
    }
    fillServerCapabilities(Y) {
    }
    logEvent(Y) {
      this.connection.sendNotification(I.TelemetryEventNotification.type, Y).catch(() => {
        this.connection.console.log("Sending TelemetryEventNotification failed");
      });
    }
  }
  class x {
    constructor() {
    }
    attach(Y) {
      this._connection = Y;
    }
    get connection() {
      if (!this._connection)
        throw new Error("Remote is not attached to a connection yet.");
      return this._connection;
    }
    initialize(Y) {
    }
    fillServerCapabilities(Y) {
    }
    attachWorkDoneProgress(Y) {
      return (0, B.attachWorkDone)(this.connection, Y);
    }
    attachPartialResultProgress(Y, K) {
      return (0, B.attachPartialResult)(this.connection, K);
    }
  }
  A._LanguagesImpl = x;
  const e = (0, l.MonikerFeature)((0, L.DiagnosticFeature)((0, c.InlayHintFeature)((0, k.InlineValueFeature)((0, h.TypeHierarchyFeature)((0, F.LinkedEditingRangeFeature)((0, o.SemanticTokensFeature)((0, D.CallHierarchyFeature)(x))))))));
  class T {
    constructor() {
    }
    attach(Y) {
      this._connection = Y;
    }
    get connection() {
      if (!this._connection)
        throw new Error("Remote is not attached to a connection yet.");
      return this._connection;
    }
    initialize(Y) {
    }
    fillServerCapabilities(Y) {
    }
    attachWorkDoneProgress(Y) {
      return (0, B.attachWorkDone)(this.connection, Y);
    }
    attachPartialResultProgress(Y, K) {
      return (0, B.attachPartialResult)(this.connection, K);
    }
  }
  A._NotebooksImpl = T;
  const AA = (0, O.NotebookSyncFeature)(T);
  function II(m, Y) {
    return function(K) {
      return Y(m(K));
    };
  }
  A.combineConsoleFeatures = II;
  function zA(m, Y) {
    return function(K) {
      return Y(m(K));
    };
  }
  A.combineTelemetryFeatures = zA;
  function gI(m, Y) {
    return function(K) {
      return Y(m(K));
    };
  }
  A.combineTracerFeatures = gI;
  function QI(m, Y) {
    return function(K) {
      return Y(m(K));
    };
  }
  A.combineClientFeatures = QI;
  function MI(m, Y) {
    return function(K) {
      return Y(m(K));
    };
  }
  A.combineWindowFeatures = MI;
  function pA(m, Y) {
    return function(K) {
      return Y(m(K));
    };
  }
  A.combineWorkspaceFeatures = pA;
  function jA(m, Y) {
    return function(K) {
      return Y(m(K));
    };
  }
  A.combineLanguagesFeatures = jA;
  function BI(m, Y) {
    return function(K) {
      return Y(m(K));
    };
  }
  A.combineNotebooksFeatures = BI;
  function qA(m, Y) {
    function K(R, MA, KA) {
      return R && MA ? KA(R, MA) : R || MA;
    }
    return {
      __brand: "features",
      console: K(m.console, Y.console, II),
      tracer: K(m.tracer, Y.tracer, gI),
      telemetry: K(m.telemetry, Y.telemetry, zA),
      client: K(m.client, Y.client, QI),
      window: K(m.window, Y.window, MI),
      workspace: K(m.workspace, Y.workspace, pA),
      languages: K(m.languages, Y.languages, jA),
      notebooks: K(m.notebooks, Y.notebooks, BI)
    };
  }
  A.combineFeatures = qA;
  function u(m, Y, K) {
    const d = K && K.console ? new (K.console(f))() : new f(), R = m(d);
    d.rawAttach(R);
    const MA = K && K.tracer ? new (K.tracer(G))() : new G(), KA = K && K.telemetry ? new (K.telemetry(H))() : new H(), fA = K && K.client ? new (K.client(n))() : new n(), CI = K && K.window ? new (K.window($))() : new $(), lI = K && K.workspace ? new (K.workspace(j))() : new j(), vI = K && K.languages ? new (K.languages(e))() : new e(), _I = K && K.notebooks ? new (K.notebooks(AA))() : new AA(), cI = [d, MA, KA, fA, CI, lI, vI, _I];
    function mg(J) {
      return J instanceof Promise ? J : g.thenable(J) ? new Promise((y, q) => {
        J.then((lA) => y(lA), (lA) => q(lA));
      }) : Promise.resolve(J);
    }
    let EI, DI, OA, nA = {
      listen: () => R.listen(),
      sendRequest: (J, ...y) => R.sendRequest(g.string(J) ? J : J.method, ...y),
      onRequest: (J, y) => R.onRequest(J, y),
      sendNotification: (J, y) => {
        const q = g.string(J) ? J : J.method;
        return arguments.length === 1 ? R.sendNotification(q) : R.sendNotification(q, y);
      },
      onNotification: (J, y) => R.onNotification(J, y),
      onProgress: R.onProgress,
      sendProgress: R.sendProgress,
      onInitialize: (J) => (DI = J, {
        dispose: () => {
          DI = void 0;
        }
      }),
      onInitialized: (J) => R.onNotification(I.InitializedNotification.type, J),
      onShutdown: (J) => (EI = J, {
        dispose: () => {
          EI = void 0;
        }
      }),
      onExit: (J) => (OA = J, {
        dispose: () => {
          OA = void 0;
        }
      }),
      get console() {
        return d;
      },
      get telemetry() {
        return KA;
      },
      get tracer() {
        return MA;
      },
      get client() {
        return fA;
      },
      get window() {
        return CI;
      },
      get workspace() {
        return lI;
      },
      get languages() {
        return vI;
      },
      get notebooks() {
        return _I;
      },
      onDidChangeConfiguration: (J) => R.onNotification(I.DidChangeConfigurationNotification.type, J),
      onDidChangeWatchedFiles: (J) => R.onNotification(I.DidChangeWatchedFilesNotification.type, J),
      __textDocumentSync: void 0,
      onDidOpenTextDocument: (J) => R.onNotification(I.DidOpenTextDocumentNotification.type, J),
      onDidChangeTextDocument: (J) => R.onNotification(I.DidChangeTextDocumentNotification.type, J),
      onDidCloseTextDocument: (J) => R.onNotification(I.DidCloseTextDocumentNotification.type, J),
      onWillSaveTextDocument: (J) => R.onNotification(I.WillSaveTextDocumentNotification.type, J),
      onWillSaveTextDocumentWaitUntil: (J) => R.onRequest(I.WillSaveTextDocumentWaitUntilRequest.type, J),
      onDidSaveTextDocument: (J) => R.onNotification(I.DidSaveTextDocumentNotification.type, J),
      sendDiagnostics: (J) => R.sendNotification(I.PublishDiagnosticsNotification.type, J),
      onHover: (J) => R.onRequest(I.HoverRequest.type, (y, q) => J(y, q, (0, B.attachWorkDone)(R, y), void 0)),
      onCompletion: (J) => R.onRequest(I.CompletionRequest.type, (y, q) => J(y, q, (0, B.attachWorkDone)(R, y), (0, B.attachPartialResult)(R, y))),
      onCompletionResolve: (J) => R.onRequest(I.CompletionResolveRequest.type, J),
      onSignatureHelp: (J) => R.onRequest(I.SignatureHelpRequest.type, (y, q) => J(y, q, (0, B.attachWorkDone)(R, y), void 0)),
      onDeclaration: (J) => R.onRequest(I.DeclarationRequest.type, (y, q) => J(y, q, (0, B.attachWorkDone)(R, y), (0, B.attachPartialResult)(R, y))),
      onDefinition: (J) => R.onRequest(I.DefinitionRequest.type, (y, q) => J(y, q, (0, B.attachWorkDone)(R, y), (0, B.attachPartialResult)(R, y))),
      onTypeDefinition: (J) => R.onRequest(I.TypeDefinitionRequest.type, (y, q) => J(y, q, (0, B.attachWorkDone)(R, y), (0, B.attachPartialResult)(R, y))),
      onImplementation: (J) => R.onRequest(I.ImplementationRequest.type, (y, q) => J(y, q, (0, B.attachWorkDone)(R, y), (0, B.attachPartialResult)(R, y))),
      onReferences: (J) => R.onRequest(I.ReferencesRequest.type, (y, q) => J(y, q, (0, B.attachWorkDone)(R, y), (0, B.attachPartialResult)(R, y))),
      onDocumentHighlight: (J) => R.onRequest(I.DocumentHighlightRequest.type, (y, q) => J(y, q, (0, B.attachWorkDone)(R, y), (0, B.attachPartialResult)(R, y))),
      onDocumentSymbol: (J) => R.onRequest(I.DocumentSymbolRequest.type, (y, q) => J(y, q, (0, B.attachWorkDone)(R, y), (0, B.attachPartialResult)(R, y))),
      onWorkspaceSymbol: (J) => R.onRequest(I.WorkspaceSymbolRequest.type, (y, q) => J(y, q, (0, B.attachWorkDone)(R, y), (0, B.attachPartialResult)(R, y))),
      onWorkspaceSymbolResolve: (J) => R.onRequest(I.WorkspaceSymbolResolveRequest.type, J),
      onCodeAction: (J) => R.onRequest(I.CodeActionRequest.type, (y, q) => J(y, q, (0, B.attachWorkDone)(R, y), (0, B.attachPartialResult)(R, y))),
      onCodeActionResolve: (J) => R.onRequest(I.CodeActionResolveRequest.type, (y, q) => J(y, q)),
      onCodeLens: (J) => R.onRequest(I.CodeLensRequest.type, (y, q) => J(y, q, (0, B.attachWorkDone)(R, y), (0, B.attachPartialResult)(R, y))),
      onCodeLensResolve: (J) => R.onRequest(I.CodeLensResolveRequest.type, (y, q) => J(y, q)),
      onDocumentFormatting: (J) => R.onRequest(I.DocumentFormattingRequest.type, (y, q) => J(y, q, (0, B.attachWorkDone)(R, y), void 0)),
      onDocumentRangeFormatting: (J) => R.onRequest(I.DocumentRangeFormattingRequest.type, (y, q) => J(y, q, (0, B.attachWorkDone)(R, y), void 0)),
      onDocumentOnTypeFormatting: (J) => R.onRequest(I.DocumentOnTypeFormattingRequest.type, (y, q) => J(y, q)),
      onRenameRequest: (J) => R.onRequest(I.RenameRequest.type, (y, q) => J(y, q, (0, B.attachWorkDone)(R, y), void 0)),
      onPrepareRename: (J) => R.onRequest(I.PrepareRenameRequest.type, (y, q) => J(y, q)),
      onDocumentLinks: (J) => R.onRequest(I.DocumentLinkRequest.type, (y, q) => J(y, q, (0, B.attachWorkDone)(R, y), (0, B.attachPartialResult)(R, y))),
      onDocumentLinkResolve: (J) => R.onRequest(I.DocumentLinkResolveRequest.type, (y, q) => J(y, q)),
      onDocumentColor: (J) => R.onRequest(I.DocumentColorRequest.type, (y, q) => J(y, q, (0, B.attachWorkDone)(R, y), (0, B.attachPartialResult)(R, y))),
      onColorPresentation: (J) => R.onRequest(I.ColorPresentationRequest.type, (y, q) => J(y, q, (0, B.attachWorkDone)(R, y), (0, B.attachPartialResult)(R, y))),
      onFoldingRanges: (J) => R.onRequest(I.FoldingRangeRequest.type, (y, q) => J(y, q, (0, B.attachWorkDone)(R, y), (0, B.attachPartialResult)(R, y))),
      onSelectionRanges: (J) => R.onRequest(I.SelectionRangeRequest.type, (y, q) => J(y, q, (0, B.attachWorkDone)(R, y), (0, B.attachPartialResult)(R, y))),
      onExecuteCommand: (J) => R.onRequest(I.ExecuteCommandRequest.type, (y, q) => J(y, q, (0, B.attachWorkDone)(R, y), void 0)),
      dispose: () => R.dispose()
    };
    for (let J of cI)
      J.attach(nA);
    return R.onRequest(I.InitializeRequest.type, (J) => {
      Y.initialize(J), g.string(J.trace) && (MA.trace = I.Trace.fromString(J.trace));
      for (let y of cI)
        y.initialize(J.capabilities);
      if (DI) {
        let y = DI(J, new I.CancellationTokenSource().token, (0, B.attachWorkDone)(R, J), void 0);
        return mg(y).then((q) => {
          if (q instanceof I.ResponseError)
            return q;
          let lA = q;
          lA || (lA = { capabilities: {} });
          let ZA = lA.capabilities;
          ZA || (ZA = {}, lA.capabilities = ZA), ZA.textDocumentSync === void 0 || ZA.textDocumentSync === null ? ZA.textDocumentSync = g.number(nA.__textDocumentSync) ? nA.__textDocumentSync : I.TextDocumentSyncKind.None : !g.number(ZA.textDocumentSync) && !g.number(ZA.textDocumentSync.change) && (ZA.textDocumentSync.change = g.number(nA.__textDocumentSync) ? nA.__textDocumentSync : I.TextDocumentSyncKind.None);
          for (let eg of cI)
            eg.fillServerCapabilities(ZA);
          return lA;
        });
      } else {
        let y = { capabilities: { textDocumentSync: I.TextDocumentSyncKind.None } };
        for (let q of cI)
          q.fillServerCapabilities(y.capabilities);
        return y;
      }
    }), R.onRequest(I.ShutdownRequest.type, () => {
      if (Y.shutdownReceived = !0, EI)
        return EI(new I.CancellationTokenSource().token);
    }), R.onNotification(I.ExitNotification.type, () => {
      try {
        OA && OA();
      } finally {
        Y.shutdownReceived ? Y.exit(0) : Y.exit(1);
      }
    }), R.onNotification(I.SetTraceNotification.type, (J) => {
      MA.trace = I.Trace.fromString(J.value);
    }), nA;
  }
  A.createConnection = u;
})(LC);
(function(A) {
  var I = GA && GA.__createBinding || (Object.create ? function(E, D, o, i) {
    i === void 0 && (i = o);
    var N = Object.getOwnPropertyDescriptor(D, o);
    (!N || ("get" in N ? !D.__esModule : N.writable || N.configurable)) && (N = { enumerable: !0, get: function() {
      return D[o];
    } }), Object.defineProperty(E, i, N);
  } : function(E, D, o, i) {
    i === void 0 && (i = o), E[i] = D[o];
  }), g = GA && GA.__exportStar || function(E, D) {
    for (var o in E)
      o !== "default" && !Object.prototype.hasOwnProperty.call(D, o) && I(D, E, o);
  };
  Object.defineProperty(A, "__esModule", { value: !0 }), A.ProposedFeatures = A.NotebookDocuments = A.TextDocuments = A.SemanticTokensBuilder = void 0;
  const Q = VA;
  Object.defineProperty(A, "SemanticTokensBuilder", { enumerable: !0, get: function() {
    return Q.SemanticTokensBuilder;
  } }), g(kA, A);
  const B = uI;
  Object.defineProperty(A, "TextDocuments", { enumerable: !0, get: function() {
    return B.TextDocuments;
  } });
  const C = kI;
  Object.defineProperty(A, "NotebookDocuments", { enumerable: !0, get: function() {
    return C.NotebookDocuments;
  } }), g(LC, A), function(E) {
    E.all = {
      __brand: "features"
    };
  }(A.ProposedFeatures || (A.ProposedFeatures = {}));
})(gQ);
var RD = kA;
(function(A) {
  var I = GA && GA.__createBinding || (Object.create ? function(D, o, i, N) {
    N === void 0 && (N = i);
    var F = Object.getOwnPropertyDescriptor(o, i);
    (!F || ("get" in F ? !o.__esModule : F.writable || F.configurable)) && (F = { enumerable: !0, get: function() {
      return o[i];
    } }), Object.defineProperty(D, N, F);
  } : function(D, o, i, N) {
    N === void 0 && (N = i), D[N] = o[i];
  }), g = GA && GA.__exportStar || function(D, o) {
    for (var i in D)
      i !== "default" && !Object.prototype.hasOwnProperty.call(o, i) && I(o, D, i);
  };
  Object.defineProperty(A, "__esModule", { value: !0 }), A.createConnection = void 0;
  const Q = gQ;
  g(RD, A), g(gQ, A);
  let B = !1;
  const C = {
    initialize: (D) => {
    },
    get shutdownReceived() {
      return B;
    },
    set shutdownReceived(D) {
      B = D;
    },
    exit: (D) => {
    }
  };
  function E(D, o, i, N) {
    let F, h, k, c;
    D !== void 0 && D.__brand === "features" && (F = D, D = o, o = i, i = N), Q.ConnectionStrategy.is(D) || Q.ConnectionOptions.is(D) ? c = D : (h = D, k = o, c = i);
    const L = (O) => (0, Q.createProtocolConnection)(h, k, O, c);
    return (0, Q.createConnection)(L, C, F);
  }
  A.createConnection = E;
})(U);
var ug = U;
class fI {
  constructor(I, g, Q, B) {
    this._uri = I, this._languageId = g, this._version = Q, this._content = B, this._lineOffsets = void 0;
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
  getText(I) {
    if (I) {
      const g = this.offsetAt(I.start), Q = this.offsetAt(I.end);
      return this._content.substring(g, Q);
    }
    return this._content;
  }
  update(I, g) {
    for (let Q of I)
      if (fI.isIncremental(Q)) {
        const B = mC(Q.range), C = this.offsetAt(B.start), E = this.offsetAt(B.end);
        this._content = this._content.substring(0, C) + Q.text + this._content.substring(E, this._content.length);
        const D = Math.max(B.start.line, 0), o = Math.max(B.end.line, 0);
        let i = this._lineOffsets;
        const N = mB(Q.text, !1, C);
        if (o - D === N.length)
          for (let h = 0, k = N.length; h < k; h++)
            i[h + D + 1] = N[h];
        else
          N.length < 1e4 ? i.splice(D + 1, o - D, ...N) : this._lineOffsets = i = i.slice(0, D + 1).concat(N, i.slice(o + 1));
        const F = Q.text.length - (E - C);
        if (F !== 0)
          for (let h = D + 1 + N.length, k = i.length; h < k; h++)
            i[h] = i[h] + F;
      } else if (fI.isFull(Q))
        this._content = Q.text, this._lineOffsets = void 0;
      else
        throw new Error("Unknown change event received");
    this._version = g;
  }
  getLineOffsets() {
    return this._lineOffsets === void 0 && (this._lineOffsets = mB(this._content, !0)), this._lineOffsets;
  }
  positionAt(I) {
    I = Math.max(Math.min(I, this._content.length), 0);
    let g = this.getLineOffsets(), Q = 0, B = g.length;
    if (B === 0)
      return { line: 0, character: I };
    for (; Q < B; ) {
      let E = Math.floor((Q + B) / 2);
      g[E] > I ? B = E : Q = E + 1;
    }
    let C = Q - 1;
    return { line: C, character: I - g[C] };
  }
  offsetAt(I) {
    let g = this.getLineOffsets();
    if (I.line >= g.length)
      return this._content.length;
    if (I.line < 0)
      return 0;
    let Q = g[I.line], B = I.line + 1 < g.length ? g[I.line + 1] : this._content.length;
    return Math.max(Math.min(Q + I.character, B), Q);
  }
  get lineCount() {
    return this.getLineOffsets().length;
  }
  static isIncremental(I) {
    let g = I;
    return g != null && typeof g.text == "string" && g.range !== void 0 && (g.rangeLength === void 0 || typeof g.rangeLength == "number");
  }
  static isFull(I) {
    let g = I;
    return g != null && typeof g.text == "string" && g.range === void 0 && g.rangeLength === void 0;
  }
}
var IB;
(function(A) {
  function I(B, C, E, D) {
    return new fI(B, C, E, D);
  }
  A.create = I;
  function g(B, C, E) {
    if (B instanceof fI)
      return B.update(C, E), B;
    throw new Error("TextDocument.update: document must be created by TextDocument.create");
  }
  A.update = g;
  function Q(B, C) {
    let E = B.getText(), D = gB(C.map(JD), (N, F) => {
      let h = N.range.start.line - F.range.start.line;
      return h === 0 ? N.range.start.character - F.range.start.character : h;
    }), o = 0;
    const i = [];
    for (const N of D) {
      let F = B.offsetAt(N.range.start);
      if (F < o)
        throw new Error("Overlapping edit");
      F > o && i.push(E.substring(o, F)), N.newText.length && i.push(N.newText), o = B.offsetAt(N.range.end);
    }
    return i.push(E.substr(o)), i.join("");
  }
  A.applyEdits = Q;
})(IB || (IB = {}));
function gB(A, I) {
  if (A.length <= 1)
    return A;
  const g = A.length / 2 | 0, Q = A.slice(0, g), B = A.slice(g);
  gB(Q, I), gB(B, I);
  let C = 0, E = 0, D = 0;
  for (; C < Q.length && E < B.length; )
    I(Q[C], B[E]) <= 0 ? A[D++] = Q[C++] : A[D++] = B[E++];
  for (; C < Q.length; )
    A[D++] = Q[C++];
  for (; E < B.length; )
    A[D++] = B[E++];
  return A;
}
function mB(A, I, g = 0) {
  const Q = I ? [g] : [];
  for (let B = 0; B < A.length; B++) {
    let C = A.charCodeAt(B);
    (C === 13 || C === 10) && (C === 13 && B + 1 < A.length && A.charCodeAt(B + 1) === 10 && B++, Q.push(g + B + 1));
  }
  return Q;
}
function mC(A) {
  const I = A.start, g = A.end;
  return I.line > g.line || I.line === g.line && I.character > g.character ? { start: g, end: I } : A;
}
function JD(A) {
  const I = mC(A.range);
  return I !== A.range ? { newText: A.newText, range: I } : A;
}
var Og = {};
Og.byteLength = sD;
Og.toByteArray = ZD;
Og.fromByteArray = LD;
var dA = [], HA = [], UD = typeof Uint8Array < "u" ? Uint8Array : Array, Pg = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var UI = 0, yD = Pg.length; UI < yD; ++UI)
  dA[UI] = Pg[UI], HA[Pg.charCodeAt(UI)] = UI;
HA["-".charCodeAt(0)] = 62;
HA["_".charCodeAt(0)] = 63;
function eC(A) {
  var I = A.length;
  if (I % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var g = A.indexOf("=");
  g === -1 && (g = I);
  var Q = g === I ? 0 : 4 - g % 4;
  return [g, Q];
}
function sD(A) {
  var I = eC(A), g = I[0], Q = I[1];
  return (g + Q) * 3 / 4 - Q;
}
function KD(A, I, g) {
  return (I + g) * 3 / 4 - g;
}
function ZD(A) {
  var I, g = eC(A), Q = g[0], B = g[1], C = new UD(KD(A, Q, B)), E = 0, D = B > 0 ? Q - 4 : Q, o;
  for (o = 0; o < D; o += 4)
    I = HA[A.charCodeAt(o)] << 18 | HA[A.charCodeAt(o + 1)] << 12 | HA[A.charCodeAt(o + 2)] << 6 | HA[A.charCodeAt(o + 3)], C[E++] = I >> 16 & 255, C[E++] = I >> 8 & 255, C[E++] = I & 255;
  return B === 2 && (I = HA[A.charCodeAt(o)] << 2 | HA[A.charCodeAt(o + 1)] >> 4, C[E++] = I & 255), B === 1 && (I = HA[A.charCodeAt(o)] << 10 | HA[A.charCodeAt(o + 1)] << 4 | HA[A.charCodeAt(o + 2)] >> 2, C[E++] = I >> 8 & 255, C[E++] = I & 255), C;
}
function HD(A) {
  return dA[A >> 18 & 63] + dA[A >> 12 & 63] + dA[A >> 6 & 63] + dA[A & 63];
}
function SD(A, I, g) {
  for (var Q, B = [], C = I; C < g; C += 3)
    Q = (A[C] << 16 & 16711680) + (A[C + 1] << 8 & 65280) + (A[C + 2] & 255), B.push(HD(Q));
  return B.join("");
}
function LD(A) {
  for (var I, g = A.length, Q = g % 3, B = [], C = 16383, E = 0, D = g - Q; E < D; E += C)
    B.push(SD(A, E, E + C > D ? D : E + C));
  return Q === 1 ? (I = A[g - 1], B.push(
    dA[I >> 2] + dA[I << 4 & 63] + "=="
  )) : Q === 2 && (I = (A[g - 2] << 8) + A[g - 1], B.push(
    dA[I >> 10] + dA[I >> 4 & 63] + dA[I << 2 & 63] + "="
  )), B.join("");
}
const qD = Og.toByteArray(
);
let dC = {};
const CA = {};
dC.__wbindgen_placeholder__ = CA;
let a, bC = new TextDecoder("utf-8", { ignoreBOM: !0, fatal: !0 });
bC.decode();
let vg = new Uint8Array();
function Eg() {
  return vg.byteLength === 0 && (vg = new Uint8Array(a.memory.buffer)), vg;
}
function oA(A, I) {
  return bC.decode(Eg().subarray(A, A + I));
}
const XA = new Array(32).fill(void 0);
XA.push(void 0, null, !0, !1);
let dI = XA.length;
function tC(A) {
  dI === XA.length && XA.push(XA.length + 1);
  const I = dI;
  return dI = XA[I], XA[I] = A, I;
}
let iA = 0, Dg = new TextEncoder("utf-8");
const OD = typeof Dg.encodeInto == "function" ? function(A, I) {
  return Dg.encodeInto(A, I);
} : function(A, I) {
  const g = Dg.encode(A);
  return I.set(g), {
    read: A.length,
    written: g.length
  };
};
function YA(A, I, g) {
  if (g === void 0) {
    const D = Dg.encode(A), o = I(D.length);
    return Eg().subarray(o, o + D.length).set(D), iA = D.length, o;
  }
  let Q = A.length, B = I(Q);
  const C = Eg();
  let E = 0;
  for (; E < Q; E++) {
    const D = A.charCodeAt(E);
    if (D > 127)
      break;
    C[B + E] = D;
  }
  if (E !== Q) {
    E !== 0 && (A = A.slice(E)), B = g(B, Q, Q = E + A.length * 3);
    const D = Eg().subarray(B + E, B + Q), o = OD(A, D);
    E += o.written;
  }
  return iA = E, B;
}
let _g = new Int32Array();
function b() {
  return _g.byteLength === 0 && (_g = new Int32Array(a.memory.buffer)), _g;
}
CA.format = function(A, I) {
  try {
    const B = a.__wbindgen_add_to_stack_pointer(-16), C = YA(A, a.__wbindgen_malloc, a.__wbindgen_realloc), E = iA, D = YA(I, a.__wbindgen_malloc, a.__wbindgen_realloc), o = iA;
    a.format(B, C, E, D, o);
    var g = b()[B / 4 + 0], Q = b()[B / 4 + 1];
    return oA(g, Q);
  } finally {
    a.__wbindgen_add_to_stack_pointer(16), a.__wbindgen_free(g, Q);
  }
};
function lD(A) {
  return XA[A];
}
function pD(A) {
  A < 36 || (XA[A] = dI, dI = A);
}
function GB(A) {
  const I = lD(A);
  return pD(A), I;
}
CA.get_config = function(A) {
  try {
    const D = a.__wbindgen_add_to_stack_pointer(-16), o = YA(A, a.__wbindgen_malloc, a.__wbindgen_realloc), i = iA;
    a.get_config(D, o, i);
    var I = b()[D / 4 + 0], g = b()[D / 4 + 1], Q = b()[D / 4 + 2], B = b()[D / 4 + 3], C = I, E = g;
    if (B)
      throw C = 0, E = 0, GB(Q);
    return oA(C, E);
  } finally {
    a.__wbindgen_add_to_stack_pointer(16), a.__wbindgen_free(C, E);
  }
};
CA.lint = function(A) {
  try {
    const Q = a.__wbindgen_add_to_stack_pointer(-16), B = YA(A, a.__wbindgen_malloc, a.__wbindgen_realloc), C = iA;
    a.lint(Q, B, C);
    var I = b()[Q / 4 + 0], g = b()[Q / 4 + 1];
    return oA(I, g);
  } finally {
    a.__wbindgen_add_to_stack_pointer(16), a.__wbindgen_free(I, g);
  }
};
CA.native_types = function(A) {
  try {
    const Q = a.__wbindgen_add_to_stack_pointer(-16), B = YA(A, a.__wbindgen_malloc, a.__wbindgen_realloc), C = iA;
    a.native_types(Q, B, C);
    var I = b()[Q / 4 + 0], g = b()[Q / 4 + 1];
    return oA(I, g);
  } finally {
    a.__wbindgen_add_to_stack_pointer(16), a.__wbindgen_free(I, g);
  }
};
CA.referential_actions = function(A) {
  try {
    const Q = a.__wbindgen_add_to_stack_pointer(-16), B = YA(A, a.__wbindgen_malloc, a.__wbindgen_realloc), C = iA;
    a.referential_actions(Q, B, C);
    var I = b()[Q / 4 + 0], g = b()[Q / 4 + 1];
    return oA(I, g);
  } finally {
    a.__wbindgen_add_to_stack_pointer(16), a.__wbindgen_free(I, g);
  }
};
CA.preview_features = function() {
  try {
    const g = a.__wbindgen_add_to_stack_pointer(-16);
    a.preview_features(g);
    var A = b()[g / 4 + 0], I = b()[g / 4 + 1];
    return oA(A, I);
  } finally {
    a.__wbindgen_add_to_stack_pointer(16), a.__wbindgen_free(A, I);
  }
};
CA.text_document_completion = function(A, I) {
  try {
    const B = a.__wbindgen_add_to_stack_pointer(-16), C = YA(A, a.__wbindgen_malloc, a.__wbindgen_realloc), E = iA, D = YA(I, a.__wbindgen_malloc, a.__wbindgen_realloc), o = iA;
    a.text_document_completion(B, C, E, D, o);
    var g = b()[B / 4 + 0], Q = b()[B / 4 + 1];
    return oA(g, Q);
  } finally {
    a.__wbindgen_add_to_stack_pointer(16), a.__wbindgen_free(g, Q);
  }
};
CA.code_actions = function(A, I) {
  try {
    const B = a.__wbindgen_add_to_stack_pointer(-16), C = YA(A, a.__wbindgen_malloc, a.__wbindgen_realloc), E = iA, D = YA(I, a.__wbindgen_malloc, a.__wbindgen_realloc), o = iA;
    a.code_actions(B, C, E, D, o);
    var g = b()[B / 4 + 0], Q = b()[B / 4 + 1];
    return oA(g, Q);
  } finally {
    a.__wbindgen_add_to_stack_pointer(16), a.__wbindgen_free(g, Q);
  }
};
CA.debug_panic = function() {
  a.debug_panic();
};
class Fg {
  static __wrap(I) {
    const g = Object.create(Fg.prototype);
    return g.ptr = I, g;
  }
  __destroy_into_raw() {
    const I = this.ptr;
    return this.ptr = 0, I;
  }
  free() {
    const I = this.__destroy_into_raw();
    a.__wbg_adonetstring_free(I);
  }
  /**
   * A constructor to create a new `AdoNet`, used from JavaScript with
   * `new AdoNet("server=tcp:localhost,1433")`.
   * @param {string} s
   */
  constructor(I) {
    try {
      const C = a.__wbindgen_add_to_stack_pointer(-16), E = YA(I, a.__wbindgen_malloc, a.__wbindgen_realloc), D = iA;
      a.adonetstring_new(C, E, D);
      var g = b()[C / 4 + 0], Q = b()[C / 4 + 1], B = b()[C / 4 + 2];
      if (B)
        throw GB(Q);
      return Fg.__wrap(g);
    } finally {
      a.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Get a parameter from the connection's key-value pairs
   * @param {string} key
   * @returns {string | undefined}
   */
  get(I) {
    try {
      const B = a.__wbindgen_add_to_stack_pointer(-16), C = YA(I, a.__wbindgen_malloc, a.__wbindgen_realloc), E = iA;
      a.adonetstring_get(B, this.ptr, C, E);
      var g = b()[B / 4 + 0], Q = b()[B / 4 + 1];
      let D;
      return g !== 0 && (D = oA(g, Q).slice(), a.__wbindgen_free(g, Q * 1)), D;
    } finally {
      a.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Set a parameter value to the connection's key-value pairs. If replacing
   * a pre-existing value, returns the old value.
   * @param {string} key
   * @param {string} value
   * @returns {string | undefined}
   */
  set(I, g) {
    try {
      const C = a.__wbindgen_add_to_stack_pointer(-16), E = YA(I, a.__wbindgen_malloc, a.__wbindgen_realloc), D = iA, o = YA(g, a.__wbindgen_malloc, a.__wbindgen_realloc), i = iA;
      a.adonetstring_set(C, this.ptr, E, D, o, i);
      var Q = b()[C / 4 + 0], B = b()[C / 4 + 1];
      let N;
      return Q !== 0 && (N = oA(Q, B).slice(), a.__wbindgen_free(Q, B * 1)), N;
    } finally {
      a.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Get a string representation of the `AdoNetString`.
   * @returns {string}
   */
  to_string() {
    try {
      const Q = a.__wbindgen_add_to_stack_pointer(-16);
      a.adonetstring_to_string(Q, this.ptr);
      var I = b()[Q / 4 + 0], g = b()[Q / 4 + 1];
      return oA(I, g);
    } finally {
      a.__wbindgen_add_to_stack_pointer(16), a.__wbindgen_free(I, g);
    }
  }
}
CA.AdoNetString = Fg;
class Yg {
  static __wrap(I) {
    const g = Object.create(Yg.prototype);
    return g.ptr = I, g;
  }
  __destroy_into_raw() {
    const I = this.ptr;
    return this.ptr = 0, I;
  }
  free() {
    const I = this.__destroy_into_raw();
    a.__wbg_jdbcstring_free(I);
  }
  /**
   * A constructor to create a new `JdbcInstance`, used from JavaScript with
   * `new JdbcString("sqlserver://...")`.
   * @param {string} s
   */
  constructor(I) {
    try {
      const C = a.__wbindgen_add_to_stack_pointer(-16), E = YA(I, a.__wbindgen_malloc, a.__wbindgen_realloc), D = iA;
      a.jdbcstring_new(C, E, D);
      var g = b()[C / 4 + 0], Q = b()[C / 4 + 1], B = b()[C / 4 + 2];
      if (B)
        throw GB(Q);
      return Yg.__wrap(g);
    } finally {
      a.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Access the connection sub-protocol
   * @returns {string}
   */
  sub_protocol() {
    try {
      const Q = a.__wbindgen_add_to_stack_pointer(-16);
      a.jdbcstring_sub_protocol(Q, this.ptr);
      var I = b()[Q / 4 + 0], g = b()[Q / 4 + 1];
      return oA(I, g);
    } finally {
      a.__wbindgen_add_to_stack_pointer(16), a.__wbindgen_free(I, g);
    }
  }
  /**
   * Access the connection server name
   * @returns {string | undefined}
   */
  server_name() {
    try {
      const Q = a.__wbindgen_add_to_stack_pointer(-16);
      a.jdbcstring_server_name(Q, this.ptr);
      var I = b()[Q / 4 + 0], g = b()[Q / 4 + 1];
      let B;
      return I !== 0 && (B = oA(I, g).slice(), a.__wbindgen_free(I, g * 1)), B;
    } finally {
      a.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Access the connection's instance name
   * @returns {string | undefined}
   */
  instance_name() {
    try {
      const Q = a.__wbindgen_add_to_stack_pointer(-16);
      a.jdbcstring_instance_name(Q, this.ptr);
      var I = b()[Q / 4 + 0], g = b()[Q / 4 + 1];
      let B;
      return I !== 0 && (B = oA(I, g).slice(), a.__wbindgen_free(I, g * 1)), B;
    } finally {
      a.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Access the connection's port
   * @returns {number | undefined}
   */
  port() {
    const I = a.jdbcstring_port(this.ptr);
    return I === 16777215 ? void 0 : I;
  }
  /**
   * Get a parameter from the connection's key-value pairs
   * @param {string} key
   * @returns {string | undefined}
   */
  get(I) {
    try {
      const B = a.__wbindgen_add_to_stack_pointer(-16), C = YA(I, a.__wbindgen_malloc, a.__wbindgen_realloc), E = iA;
      a.jdbcstring_get(B, this.ptr, C, E);
      var g = b()[B / 4 + 0], Q = b()[B / 4 + 1];
      let D;
      return g !== 0 && (D = oA(g, Q).slice(), a.__wbindgen_free(g, Q * 1)), D;
    } finally {
      a.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Set a parameter value to the connection's key-value pairs. If replacing
   * a pre-existing value, returns the old value.
   * @param {string} key
   * @param {string} value
   * @returns {string | undefined}
   */
  set(I, g) {
    try {
      const C = a.__wbindgen_add_to_stack_pointer(-16), E = YA(I, a.__wbindgen_malloc, a.__wbindgen_realloc), D = iA, o = YA(g, a.__wbindgen_malloc, a.__wbindgen_realloc), i = iA;
      a.jdbcstring_set(C, this.ptr, E, D, o, i);
      var Q = b()[C / 4 + 0], B = b()[C / 4 + 1];
      let N;
      return Q !== 0 && (N = oA(Q, B).slice(), a.__wbindgen_free(Q, B * 1)), N;
    } finally {
      a.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Get a string representation of the `JdbcString`.
   * @returns {string}
   */
  to_string() {
    try {
      const Q = a.__wbindgen_add_to_stack_pointer(-16);
      a.jdbcstring_to_string(Q, this.ptr);
      var I = b()[Q / 4 + 0], g = b()[Q / 4 + 1];
      return oA(I, g);
    } finally {
      a.__wbindgen_add_to_stack_pointer(16), a.__wbindgen_free(I, g);
    }
  }
}
CA.JdbcString = Yg;
CA.__wbindgen_error_new = function(A, I) {
  const g = new Error(oA(A, I));
  return tC(g);
};
CA.__wbindgen_string_new = function(A, I) {
  const g = oA(A, I);
  return tC(g);
};
CA.__wbindgen_throw = function(A, I) {
  throw new Error(oA(A, I));
};
const jD = new WebAssembly.Module(qD), mD = new WebAssembly.Instance(jD, dC);
a = mD.exports;
CA.__wasm = a;
var eD = function() {
  function A(I, g, Q, B, C) {
    return I < g || Q < g ? I > Q ? Q + 1 : I + 1 : B === C ? g : g + 1;
  }
  return function(I, g) {
    if (I === g)
      return 0;
    if (I.length > g.length) {
      var Q = I;
      I = g, g = Q;
    }
    for (var B = I.length, C = g.length; B > 0 && I.charCodeAt(B - 1) === g.charCodeAt(C - 1); )
      B--, C--;
    for (var E = 0; E < B && I.charCodeAt(E) === g.charCodeAt(E); )
      E++;
    if (B -= E, C -= E, B === 0 || C < 3)
      return C;
    var D = 0, o, i, N, F, h, k, c, L, O, l, t, V, f = [];
    for (o = 0; o < B; o++)
      f.push(o + 1), f.push(I.charCodeAt(E + o));
    for (var hA = f.length - 1; D < C - 3; )
      for (O = g.charCodeAt(E + (i = D)), l = g.charCodeAt(E + (N = D + 1)), t = g.charCodeAt(E + (F = D + 2)), V = g.charCodeAt(E + (h = D + 3)), k = D += 4, o = 0; o < hA; o += 2)
        c = f[o], L = f[o + 1], i = A(c, i, N, O, L), N = A(i, N, F, l, L), F = A(N, F, h, t, L), k = A(F, h, k, V, L), f[o] = k, h = F, F = N, N = i, i = c;
    for (; D < C; )
      for (O = g.charCodeAt(E + (i = D)), k = ++D, o = 0; o < hA; o += 2)
        c = f[o], f[o] = k = A(c, i, k, O, f[o + 1]), i = c;
    return k;
  };
}();
const dD = /* @__PURE__ */ iE(eD);
function nC(A, I) {
  try {
    const g = CA.native_types(A);
    return JSON.parse(g);
  } catch (g) {
    return I && I(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `prisma-fmt error'd during getting available native types. ${g}`
    ), [];
  }
}
class QB {
  constructor(I, g, Q, B) {
    this.type = I, this.range = g, this.nameRange = Q, this.name = B;
  }
}
function iB(A) {
  const I = A.lineCount - 1;
  return {
    start: { line: 0, character: 0 },
    end: { line: I, character: Number.MAX_SAFE_INTEGER }
  };
}
function UA(A, I) {
  return A.getText({
    start: { line: I, character: 0 },
    end: { line: I, character: Number.MAX_SAFE_INTEGER }
  });
}
function AI(A) {
  return Array(A.lineCount).fill(0).map((I, g) => UA(A, g).trim());
}
function bD(A, I) {
  if (I.trim().length === 0)
    return !0;
  const g = I.slice(0, A.character), Q = /\w+/.exec(g);
  return Q ? Q.length === 1 && Q.index !== void 0 && g.length - Q.index - Q[0].length === 0 : !0;
}
function lg(A, I) {
  const g = UA(A, I.line), Q = g.slice(0, I.character + 1).search(/\S+$/), B = g.slice(I.character).search(/\W/);
  return B < 0 ? "" : g.slice(Q, B + I.character);
}
function* WC(A) {
  let I = "", g = "", Q, B = U.Position.create(0, 0);
  const C = ["model", "type", "enum", "datasource", "generator"];
  for (const [E, D] of A.entries()) {
    if (C.some((o) => D.startsWith(o)) && D.includes("{")) {
      g && Q && (yield new QB(
        g,
        U.Range.create(B, U.Position.create(E - 1, 0)),
        Q,
        I
      ), g = "", Q = void 0);
      const o = D.search(/\s+/);
      g = ~o ? D.slice(0, o) : D, I = D.slice(g.length, D.length - 2).trimStart();
      const i = D.length - 2 - I.length;
      I = I.trimEnd(), Q = U.Range.create(E, i, E, i + I.length), B = U.Position.create(E, 0);
      continue;
    }
    D.startsWith("}") && g && Q && (yield new QB(
      g,
      U.Range.create(B, U.Position.create(E, 1)),
      Q,
      I
    ), g = "", Q = void 0);
  }
}
function hI(A, I) {
  for (const g of WC(I)) {
    if (g.range.start.line > A)
      return;
    if (A <= g.range.end.line)
      return g;
  }
}
function PI(A, I) {
  const g = I.map((B, C) => {
    if (B.includes("model") && B.includes(A) || B.includes("type") && B.includes(A) || B.includes("enum") && B.includes(A))
      return C;
  }).filter((B) => B !== void 0);
  if (g.length === 0)
    return;
  const Q = g.map((B) => {
    const C = hI(B, I);
    if (C && C.name === A)
      return C;
  }).filter((B) => B !== void 0);
  if (Q.length === 1 && Q[0])
    return Q[0];
}
function tD(A) {
  const I = AI(A), g = "experimentalFeatures";
  let Q = !1;
  for (const [B, C] of I.entries())
    if (C.startsWith("generator") && C.includes("{") && (Q = !0), !!Q) {
      if (Q && C.startsWith("}"))
        return;
      if (C.startsWith(g)) {
        const E = UA(A, B).indexOf(g);
        return {
          start: { line: B, character: E },
          end: { line: B, character: E + g.length }
        };
      }
    }
}
function bI(A) {
  const g = /\[([^\]]+)\]/.exec(A);
  return !g || !g[1] ? [] : g[1].split(",").map((B) => (B = B.trim().replace('"', "").replace('"', ""), B.endsWith(".") ? B.slice(0, -1) : B));
}
function nD(A) {
  return nC(A.getText()).length !== 0;
}
function XC(A) {
  return A.replace(/ .*/, "");
}
function pg(A) {
  const I = [];
  for (const g of A) {
    const B = /^(model|enum)\s+(\w+)\s+{/gm.exec(g);
    B && B[2] && I.push(B[2]);
  }
  return I;
}
function WD(A, I) {
  const g = "()";
  let Q = 0, B = 0;
  for (let C = 0; C < I.character; C++)
    A[C] === g[0] ? Q++ : A[C] === g[1] && B++;
  return Q >= 2 && Q > B;
}
function qI(A, I, g) {
  let Q = 0, B = 0;
  for (let C = 0; C < I.character; C++)
    A[C] === g[0] ? Q++ : A[C] === g[1] && B++;
  return Q > B;
}
function XD(A, I) {
  let g = !1;
  for (let Q = 0; Q < I.character; Q++)
    A[Q] === '"' && (g = !g);
  return g;
}
function eB(A, I, g, Q) {
  return qI(A, Q, "[]") ? [
    {
      name: "fields",
      position: I.findIndex((C) => C.includes("fields"))
    },
    {
      name: "references",
      position: I.findIndex((C) => C.includes("references"))
    }
  ].sort((C, E) => C.position < E.position ? 1 : -1)[0].name === g : !1;
}
function wB(A) {
  const I = A.split(/\s+/);
  if (I.length < 2)
    return;
  const g = I[1];
  if (g.length !== 0)
    return g;
}
function xC(A, I) {
  return A.getText({
    start: {
      line: I.line,
      character: I.character - 1
    },
    end: { line: I.line, character: I.character }
  });
}
function dB(A, I, g) {
  const Q = xC(I, A), B = Q.search(/\s/), C = g.length === 2 && Q === "@", E = g.length === 2 && B !== -1;
  return g.length > 2 || C || E;
}
function VC(A) {
  const I = A.find((Q) => Q.startsWith("datasource") && Q.includes("{"));
  if (!I)
    return;
  const g = I.indexOf("{");
  return I.slice(10, g).trim();
}
function OI(A) {
  const I = /datasource.*\{(\n|\N)\s*(.*\n)?\n*\s*provider\s=\s(\"(.*)\")[^}]+}/.exec(A.join(`
`));
  if (!I || !I[4])
    return;
  const g = I[4];
  if (typeof g == "string" && g.length >= 1)
    return g;
}
function NB(A) {
  const g = /previewFeatures\s=\s(\[.*\])/g.exec(A.join(`
`));
  if (!(!g || !g[1]))
    try {
      const Q = JSON.parse(g[1]);
      if (Array.isArray(Q) && Q.length > 0)
        return Q.map((B) => B.toLowerCase());
    } catch {
    }
}
function tI(A, I, g) {
  const Q = [];
  for (let B = I.range.start.line + 1; B < I.range.end.line; B++)
    if (!g || B !== g.line) {
      const C = A[B], E = TC(C);
      E && Q.push(E);
    }
  return Q;
}
function TC(A) {
  return A.startsWith("//") || A.startsWith("@@") ? void 0 : A.replace(/ .*/, "");
}
function kB(A, I, g) {
  const Q = /* @__PURE__ */ new Map(), B = {};
  let C = !1;
  for (const [E, D] of A.entries())
    if (E === I.range.start.line + 1 && (C = !0), !!C) {
      if (E === I.range.end.line)
        break;
      if (!D.startsWith("@@") && (!g || E !== g.line)) {
        const o = wB(D);
        if (o !== void 0) {
          const i = Q.get(o);
          if (i)
            i.lineIndexes.push(E), Q.set(o, i);
          else {
            const N = TC(D);
            Q.set(o, { lineIndexes: [E], fieldName: N }), B[N] = o;
          }
        }
      }
    }
  return { fieldTypes: Q, fieldTypeNames: B };
}
function zC(A, I, g) {
  const Q = I.shift(), C = g.fieldTypeNames[Q];
  if (!C)
    return [];
  const E = PI(C, A);
  return !E || E.type !== "type" ? [] : I.length ? zC(
    A,
    I,
    kB(A, E)
  ) : tI(A, E);
}
function bB(A) {
  const I = { line: A.lineCount, character: 0 };
  return { start: I, end: I };
}
function tB(A, I) {
  const g = Math.min(2, Math.floor(A.length * 0.34));
  let Q = Math.floor(A.length * 0.4) + 1, B, C = !1;
  const E = A.toLowerCase();
  for (const D of I) {
    if (!(Math.abs(D.length - E.length) <= g))
      continue;
    const o = D.toLowerCase();
    if (o === E)
      return D;
    if (C || D.length < 3)
      continue;
    const i = dD(E, o);
    i > Q || (i < 3 ? (C = !0, B = D) : (Q = i, B = D));
  }
  return B;
}
function xD(A, I, g) {
  return A ? g.replace("[]", "") : I ? g.replace("?", "") : g;
}
function VD(A, I, g) {
  return A ? `${g}[]` : I ? `${g}?` : g;
}
function TD(A, I) {
  const g = I.context.diagnostics;
  if (!g || g.length === 0)
    return [];
  const Q = CA.code_actions(
    A.getText(),
    JSON.stringify(I)
  ), B = JSON.parse(Q);
  for (const C of g)
    if (C.severity === U.DiagnosticSeverity.Error && C.message.startsWith("Type") && C.message.includes(
      "is neither a built-in type, nor refers to another model, custom type, or enum."
    )) {
      let E = A.getText(C.range);
      const D = E.endsWith("[]"), o = E.endsWith("?");
      E = xD(D, o, E);
      const i = AI(A), N = tB(E, pg(i));
      N && B.push({
        title: `Change spelling to '${N}'`,
        kind: U.CodeActionKind.QuickFix,
        diagnostics: [C],
        edit: {
          changes: {
            [I.textDocument.uri]: [
              {
                range: C.range,
                newText: VD(
                  D,
                  o,
                  N
                )
              }
            ]
          }
        }
      }), B.push({
        title: `Create new model '${E}'`,
        kind: U.CodeActionKind.QuickFix,
        diagnostics: [C],
        edit: {
          changes: {
            [I.textDocument.uri]: [
              {
                range: bB(A),
                newText: `
model ${E} {

}
`
              }
            ]
          }
        }
      }), B.push({
        title: `Create new enum '${E}'`,
        kind: U.CodeActionKind.QuickFix,
        diagnostics: [C],
        edit: {
          changes: {
            [I.textDocument.uri]: [
              {
                range: bB(A),
                newText: `
enum ${E} {

}
`
              }
            ]
          }
        }
      });
    } else if (C.severity === U.DiagnosticSeverity.Warning && C.message.includes("property has been renamed to 'previewFeatures'"))
      B.push({
        title: "Rename property to 'previewFeatures'",
        kind: U.CodeActionKind.QuickFix,
        diagnostics: [C],
        edit: {
          changes: {
            [I.textDocument.uri]: [
              {
                range: C.range,
                newText: "previewFeatures"
              }
            ]
          }
        }
      });
    else if (C.severity === U.DiagnosticSeverity.Error && C.message.includes("It does not start with any known Prisma schema keyword.")) {
      const E = A.getText(C.range).split(/\s/);
      if (E.length !== 0) {
        const D = tB(E[0], [
          "model",
          "enum",
          "datasource",
          "generator"
        ]);
        D && B.push({
          title: `Change spelling to '${D}'`,
          kind: U.CodeActionKind.QuickFix,
          diagnostics: [C],
          edit: {
            changes: {
              [I.textDocument.uri]: [
                {
                  range: {
                    start: C.range.start,
                    end: {
                      line: C.range.start.line,
                      character: E[0].length
                    }
                  },
                  // the red squiggly lines start at the beginning of the blog and end at the end of the line, include e.g. 'mode nameOfBlock {' but
                  // we only want to replace e.g. 'mode' with 'model', not delete the whole line
                  newText: D
                }
              ]
            }
          }
        });
      }
    }
  return B;
}
function yA(A) {
  if (typeof A != "object")
    return A;
  var I, g, Q = Object.prototype.toString.call(A);
  if (Q === "[object Object]") {
    if (A.constructor !== Object && typeof A.constructor == "function") {
      g = new A.constructor();
      for (I in A)
        A.hasOwnProperty(I) && g[I] !== A[I] && (g[I] = yA(A[I]));
    } else {
      g = {};
      for (I in A)
        I === "__proto__" ? Object.defineProperty(g, I, {
          value: yA(A[I]),
          configurable: !0,
          enumerable: !0,
          writable: !0
        }) : g[I] = yA(A[I]);
    }
    return g;
  }
  if (Q === "[object Array]") {
    for (I = A.length, g = Array(I); I--; )
      g[I] = yA(A[I]);
    return g;
  }
  return Q === "[object Set]" ? (g = /* @__PURE__ */ new Set(), A.forEach(function(B) {
    g.add(yA(B));
  }), g) : Q === "[object Map]" ? (g = /* @__PURE__ */ new Map(), A.forEach(function(B, C) {
    g.set(yA(C), yA(B));
  }), g) : Q === "[object Date]" ? /* @__PURE__ */ new Date(+A) : Q === "[object RegExp]" ? (g = new RegExp(A.source, A.flags), g.lastIndex = A.lastIndex, g) : Q === "[object DataView]" ? new A.constructor(yA(A.buffer)) : Q === "[object ArrayBuffer]" ? A.slice(0) : Q.slice(-6) === "Array]" ? new A.constructor(A) : A;
}
const zD = [
  {
    label: "String",
    documentation: "Variable length text"
  },
  {
    label: "Boolean",
    documentation: "True or false value"
  },
  {
    label: "Int",
    documentation: "Integer value"
  },
  {
    label: "Float",
    documentation: "Floating point number"
  },
  {
    label: "DateTime",
    documentation: "Timestamp"
  },
  {
    label: "Geometry",
    documentation: "GEO spatial data"
  },
  {
    label: "Json",
    documentation: "A JSON object"
  },
  {
    label: "Bytes",
    documentation: ""
  },
  {
    label: "Decimal",
    documentation: "Decimal value"
  },
  {
    label: "BigInt",
    documentation: "Integer values that may be greater than 2^53"
  },
  {
    label: "Unsupported",
    insertText: 'Unsupported("$0")',
    documentation: "An arbitrary database column type, for which Prisma has no syntax. Fields of type `Unsupported` work with Prisma Migrate and introspection, but are not exposed in Prisma Client.",
    fullSignature: "Unsupported(_ name: String)",
    params: [
      {
        label: "name",
        documentation: 'Name of the column type as expected by the underlying database, e.g. Unsupported("GEOGRAPHY(POINT,4326)"). This string is not validated by Prisma Migrate and will be used by Prisma Migrate to generate the DDL statements to evolve the database schema. Prisma Introspect will overwrite this when re-introspecting if the type does not match.'
      }
    ]
  }
], fD = [
  {
    label: "datasource",
    documentation: "The datasource block tells the schema where the models are backed."
  },
  {
    label: "generator",
    documentation: "Generator blocks configure which clients are generated and how they're generated. Language preferences and binary configuration will go in here."
  },
  {
    label: "model",
    documentation: "Models represent the entities of your application domain. They are defined using model blocks in the data model."
  },
  {
    label: "enum",
    documentation: "Enums are defined via the enum block. You can define enums in your data model if they're supported by the datasource you use (e.g SQLite: not supported)."
  }
], rD = [
  {
    label: "provider",
    documentation: "Describes which datasource connector to use. Can be one of the following datasource providers: `postgresql`, `mysql`, `sqlserver`, `sqlite`, `mongodb` or `cockroachdb`."
  },
  {
    label: "url",
    documentation: "Connection URL including authentication info. Each datasource provider documents the URL syntax. Most providers use the syntax provided by the database [learn more](https://pris.ly/d/connection-strings)."
  },
  {
    label: "shadowDatabaseUrl",
    documentation: "Connection URL including authentication info to use for Migrate's [shadow database](https://pris.ly/d/migrate-shadow). Each datasource provider documents the URL syntax. Most providers use the syntax provided by the database."
  },
  {
    label: "relationMode",
    insertText: "relationMode = $0",
    documentation: 'Set the global relation mode for all relations. Values can be either `"foreignKeys"` (Default), or `"prisma"`. [learn more](https://pris.ly/d/relationMode)',
    fullSignature: 'relationMode = "foreignKeys" | "prisma")'
  },
  {
    label: "extensions",
    insertText: "extensions = [$0]",
    documentation: "Enable PostgreSQL extensions. [Learn More](https://pris.ly/d/postgresql-extensions)"
  }
], uD = [
  {
    label: "provider",
    documentation: "Describes which generator to use. This can point to a file that implements a generator or specify a built-in generator directly."
  },
  {
    label: "output",
    documentation: "Determines the location for the generated client [learn more](https://pris.ly/d/prisma-schema)"
  },
  {
    label: "binaryTargets",
    documentation: "Specifies the OS on which the Prisma Client will run to ensure binary compatibility of the query engine."
  },
  {
    label: "previewFeatures",
    documentation: "Enables preview feature flags."
  },
  {
    label: "engineType",
    documentation: "Defines the query engine type for Prisma Client."
  }
], fC = [
  {
    label: "@@map",
    insertText: '@@map("$0")',
    documentation: "Maps a model name from the Prisma schema to a different table name.",
    fullSignature: "@@map(_ name: String)",
    params: [
      {
        label: "name",
        insertText: 'name: "$0"',
        documentation: "The name of the target database table."
      }
    ]
  },
  {
    label: "@@id",
    insertText: "@@id([$0])",
    documentation: "Defines a multi-field ID on the model.",
    fullSignature: "@@id(_ fields: FieldReference[], name: String?, map: String?)",
    params: [
      {
        label: "fields",
        insertText: "fields: [$0]",
        documentation: "A list of references."
      },
      {
        label: "name",
        insertText: 'name: "$0"',
        documentation: "Defines the name in your Prisma Client API."
      },
      {
        label: "map",
        insertText: 'map: "$0"',
        documentation: "Defines a custom name for the primary key in the database."
      }
    ]
  },
  {
    label: "@@unique",
    insertText: "@@unique([$0])",
    documentation: "Defines a compound unique constraint for the specified fields.",
    fullSignature: "@@unique(_ fields: FieldReference[], name: String?, map: String?)",
    params: [
      {
        label: "fields",
        insertText: "fields: [$0]",
        documentation: "A list of references."
      },
      {
        label: "name",
        insertText: 'name: "$0"',
        documentation: "Defines the name in your Prisma Client API."
      },
      {
        label: "map",
        insertText: 'map: "$0"',
        documentation: "Defines a custom constraint name in the database."
      }
    ]
  },
  {
    label: "@@index",
    insertText: "@@index([$0])",
    documentation: "Defines an index on the model.",
    fullSignature: "@@index(_ fields: FieldReference[], map: String?)",
    params: [
      {
        label: "fields",
        insertText: "fields: [$0]",
        documentation: "A list of references."
      },
      {
        label: "map",
        insertText: 'map: "$0"',
        documentation: "Defines a custom index name in the database."
      }
    ]
  },
  {
    label: "@@fulltext",
    insertText: "@@fulltext([$0])",
    documentation: "Defines a full-text index on the model.",
    fullSignature: "@@fulltext(_ fields: FieldReference[], map: String?)",
    params: [
      {
        label: "fields",
        insertText: "fields: [$0]",
        documentation: "A list of references."
      },
      {
        label: "map",
        insertText: 'map: "$0"',
        documentation: "Defines a custom index name in the database."
      }
    ]
  },
  {
    label: "@@ignore",
    documentation: "A model with an `@@ignore` attribute can be kept in sync with the database schema using Prisma Migrate and Introspection, but won't be exposed in Prisma Client.",
    fullSignature: "@@ignore",
    params: []
  }
], hB = [
  {
    label: "@id",
    fullSignature: "@id",
    documentation: "Defines a single-field ID on the model.",
    params: [
      {
        label: "map",
        insertText: 'map: "$0"',
        documentation: "Defines a custom primary key name in the database."
      },
      {
        label: "length",
        insertText: "length: $0",
        documentation: "Defines a maximum length for the subpart of the value to be indexed in cases where the full value would exceed MySQL's limits for index sizes. See https://dev.mysql.com/doc/refman/8.0/en/innodb-limits.html"
      },
      {
        label: "sort",
        insertText: "sort: $0",
        documentation: "Specify in which order the entries of the index are stored in the database. This can have an effect on whether the database is able to use an index for specific queries."
      }
    ]
  },
  {
    label: "@unique",
    fullSignature: "@unique",
    documentation: "Defines a unique constraint for this field.",
    params: [
      {
        label: "map",
        insertText: 'map: "$0"',
        documentation: "Defines a custom name for the unique constraint in the database."
      },
      {
        label: "length",
        insertText: "length: $0",
        documentation: "Defines a maximum length for the subpart of the value to be indexed in cases where the full value would exceed MySQL's limits for index sizes. See https://dev.mysql.com/doc/refman/8.0/en/innodb-limits.html"
      },
      {
        label: "sort",
        insertText: "sort: $0",
        documentation: "Specify in which order the entries of the index are stored in the database. This can have an effect on whether the database is able to use an index for specific queries."
      }
    ]
  },
  {
    label: "@map",
    insertText: '@map("$0")',
    documentation: "Maps a field name from the Prisma schema to a different column name.",
    fullSignature: "@map(_ name: String)",
    params: [
      {
        label: "name",
        documentation: "The name of the target database column."
      }
    ]
  },
  {
    label: "@default",
    insertText: "@default($0)",
    documentation: "Defines a default value for this field. `@default` takes an expression as an argument.",
    fullSignature: "@default(_ expression: Expression)",
    params: [
      {
        label: "expression",
        documentation: "An expression (e.g. `5`, `true`, `now()`)."
      }
    ]
  },
  {
    label: "@relation",
    insertText: "@relation($0)",
    documentation: "Defines a connection between two models. [Learn more](https://pris.ly/d/relation-attribute).",
    fullSignature: "@relation(_ name: String?, map: String?, fields: FieldReference[]?, references: FieldReference[]?)",
    params: [
      {
        label: "name",
        documentation: "Defines the name of the relationship. In an m-n-relation, it also determines the name of the underlying relation table."
      },
      {
        label: "map",
        documentation: "Defines a custom name for the foreign key in the database."
      },
      {
        label: "fields",
        documentation: "A list of field references of the *current* model."
      },
      {
        label: "references",
        documentation: "A list of field references of the model on *the other side of the relation*."
      },
      {
        label: "onDelete",
        documentation: "Specifies the action to perform when a referenced entry in the referenced model is being deleted."
      },
      {
        label: "onUpdate",
        documentation: "Specifies the action to perform when a referenced field in the referenced model is being updated to a new value."
      }
    ]
  },
  {
    label: "@updatedAt",
    fullSignature: "@updatedAt",
    documentation: "Automatically stores the time when a record was last updated.",
    params: []
  },
  {
    label: "@ignore",
    fullSignature: "@ignore",
    documentation: "A field with an `@ignore` attribute can be kept in sync with the database schema using Prisma Migrate and Introspection, but won't be exposed in Prisma Client.",
    params: []
  }
], PD = [
  {
    label: "references",
    insertText: "references: [$0]",
    fullSignature: "references: []",
    documentation: "A list of field references of the model on *the other side of the relation*.",
    params: []
  },
  {
    label: "fields",
    insertText: "fields: [$0]",
    fullSignature: "fields: []",
    documentation: "A list of field references of the *current* model.",
    params: []
  },
  {
    label: "onDelete",
    insertText: "onDelete: $0",
    fullSignature: "onDelete: Cascade | Restrict | NoAction | SetNull | SetDefault",
    documentation: "Specifies the action to perform when a referenced entry in the referenced model is being deleted [learn more](https://pris.ly/d/referential-actions).",
    params: []
  },
  {
    label: "onUpdate",
    insertText: "onUpdate: $0",
    fullSignature: "onUpdate: Cascade | Restrict | NoAction | SetNull | SetDefault",
    documentation: "Specifies the action to perform when a referenced field in the referenced model is being updated to a new value [learn more](https://pris.ly/d/referential-actions).",
    params: []
  },
  {
    label: '""',
    insertText: '"$0"',
    fullSignature: "String",
    documentation: "Defines the name of the relationship. In an m-n-relation, it also determines the name of the underlying relation table.",
    params: []
  },
  {
    label: "name",
    insertText: 'name: "$0"',
    fullSignature: "name: String",
    documentation: "Defines the name of the relationship. In an m-n-relation, it also determines the name of the underlying relation table.",
    params: []
  },
  {
    label: "map",
    insertText: 'map: "$0"',
    fullSignature: "map: String",
    documentation: "Defines a custom name for the foreign key in the database.",
    params: []
  }
], vD = [
  {
    label: '""',
    insertText: '"$0"',
    fullSignature: '""',
    documentation: "Connection URL including authentication info. Each datasource provider documents the URL syntax. Most providers use the syntax provided by the database [learn more](https://pris.ly/d/prisma-schema).",
    params: []
  },
  {
    label: "env()",
    insertText: 'env("$0")',
    fullSignature: "env(_ environmentVariable: string)",
    documentation: "Specifies a datasource via an environment variable. When running a Prisma CLI command that needs the database connection URL (e.g. `prisma generate`), you need to make sure that the `DATABASE_URL` environment variable is set. One way to do so is by creating a `.env` file. Note that the file must be in the same directory as your schema.prisma file to automatically be picked up by the Prisma CLI.",
    params: [
      {
        label: "environmentVariable",
        documentation: "The environment variable in which the database connection URL is stored."
      }
    ]
  }
], _D = [
  {
    label: "prisma-client-js",
    documentation: "Built-in generator."
  }
], $D = [
  {
    label: '""',
    insertText: '"$0"',
    documentation: "Specifies a single provider."
  }
], Ao = [
  {
    label: "library",
    documentation: "Node-API library. (Default)"
  },
  {
    label: "binary",
    documentation: "Executable binary."
  },
  {
    label: "dataproxy",
    documentation: "Prisma Data Proxy."
  }
], Io = [
  {
    label: '""',
    insertText: '"$0"',
    documentation: "Specifies the engine type."
  }
], go = [
  {
    label: "mysql",
    documentation: "Specifies a MySQL datasource. Learn more about this connector [here](https://pris.ly/d/mysql-connector)."
  },
  {
    label: "postgresql",
    documentation: "Specifies a PostgreSQL datasource. Learn more about this connector [here](https://pris.ly/d/postgresql-connector)."
  },
  {
    label: "sqlite",
    documentation: "Specifies a SQLite datasource. Learn more about this connector [here](https://pris.ly/d/sqlite-connector)."
  },
  {
    label: "sqlserver",
    documentation: "Specifies a Microsoft SQL Server datasource. Learn more about this connector [here](https://pris.ly/d/sqlserver-connector)."
  },
  {
    label: "mongodb",
    documentation: "Specifies a MongoDB datasource. Learn more about this connector [here](https://pris.ly/d/mongodb-connector)."
  },
  {
    label: "cockroachdb",
    documentation: "Specifies a CockroachDB datasource. Learn more about this connector [here](https://pris.ly/d/cockroachdb-connector)."
  }
], Qo = [
  {
    label: '""',
    insertText: '"$0"',
    documentation: "Specifies a single provider."
  }
], Bo = [
  {
    label: "[]",
    insertText: "[$0]",
    documentation: "Enables preview feature flags."
  },
  {
    label: '""',
    insertText: '"$0"',
    documentation: "Enables a preview feature flag."
  }
], Co = [
  {
    label: "foreignKeys",
    insertText: "foreignKeys",
    documentation: "Default value. The relation will use the Foreign Keys from the database."
  },
  {
    label: "prisma",
    insertText: "prisma",
    documentation: "The relation will not use Foreign Keys from the databse. Prisma Client will emulate their behavior for update and delete queries. [learn more](https://pris.ly/d/relationMode)"
  }
];
function RA(A, I) {
  const g = [];
  for (const Q of A)
    g.push({
      label: Q.label,
      kind: I,
      insertText: Q.insertText,
      insertTextFormat: Q.insertText ? U.InsertTextFormat.Snippet : U.InsertTextFormat.PlainText,
      insertTextMode: Q.insertText ? U.InsertTextMode.adjustIndentation : void 0,
      documentation: Q.documentation ? { kind: U.MarkupKind.Markdown, value: Q.documentation } : void 0
    });
  return g;
}
function jg(A, I) {
  const g = [];
  for (const Q of A) {
    const B = ["```prisma", Q.fullSignature, "```", "___", Q.documentation];
    for (const C of Q.params)
      B.push("", "_@param_ " + C.label + " " + C.documentation);
    g.push({
      label: Q.label,
      kind: I,
      insertText: Q.insertText,
      insertTextFormat: U.InsertTextFormat.Snippet,
      insertTextMode: Q.insertText ? U.InsertTextMode.adjustIndentation : void 0,
      documentation: {
        kind: U.MarkupKind.Markdown,
        value: B.join(`
`)
      }
    });
  }
  return g;
}
const nB = RA(
  zD,
  U.CompletionItemKind.TypeParameter
), Eo = RA(
  fD,
  U.CompletionItemKind.Class
), Do = RA(
  rD,
  U.CompletionItemKind.Field
), oo = RA(
  Co,
  U.CompletionItemKind.Field
), Go = RA(
  uD,
  U.CompletionItemKind.Field
);
function Qg({
  blockAttribute: A,
  wordBeforePosition: I,
  datasourceProvider: g,
  previewFeatures: Q
}) {
  const B = RA(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    fC.find((C) => C.label.includes(A)).params,
    U.CompletionItemKind.Property
  );
  if (g === "sqlserver" && A !== "@@fulltext") {
    if (I.includes("clustered:"))
      return rC;
    B.push({
      label: "clustered",
      insertText: "clustered: $0",
      insertTextFormat: U.InsertTextFormat.Snippet,
      kind: U.CompletionItemKind.Property,
      documentation: "An index, unique constraint or primary key can be created as clustered or non-clustered; altering the storage and retrieve behavior of the index."
    });
  } else
    A === "@@index" && g && ["postgresql", "postgres"].includes(g) && B.push({
      label: "type",
      kind: U.CompletionItemKind.Property,
      insertText: "type: $0",
      insertTextFormat: U.InsertTextFormat.Snippet,
      insertTextMode: U.InsertTextMode.adjustIndentation,
      documentation: {
        kind: "markdown",
        value: "Defines the access type of indexes: BTree (default) or Hash."
      }
    });
  return B;
}
const io = jg(
  fC,
  U.CompletionItemKind.Property
), wo = [
  {
    label: "Asc",
    kind: U.CompletionItemKind.Enum,
    insertTextFormat: U.InsertTextFormat.PlainText,
    documentation: {
      kind: "markdown",
      value: "Ascending"
    }
  },
  {
    label: "Desc",
    kind: U.CompletionItemKind.Enum,
    insertTextFormat: U.InsertTextFormat.PlainText,
    documentation: {
      kind: "markdown",
      value: "Descending"
    }
  }
], rC = [
  {
    label: "true",
    kind: U.CompletionItemKind.Value,
    insertTextFormat: U.InsertTextFormat.PlainText,
    documentation: {
      kind: "markdown",
      value: "CLUSTERED"
    }
  },
  {
    label: "false",
    kind: U.CompletionItemKind.Value,
    insertTextFormat: U.InsertTextFormat.PlainText,
    documentation: {
      kind: "markdown",
      value: "NONCLUSTERED"
    }
  }
];
function WB(A, I, g, Q) {
  const B = RA(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    hB.find((E) => E.label.includes(A)).params,
    U.CompletionItemKind.Property
  ), C = uC(
    A,
    I,
    g,
    Q,
    B
  );
  if (g === "sqlserver") {
    if (Q.includes("clustered:"))
      return rC;
    C.push({
      label: "clustered",
      insertText: "clustered: $0",
      insertTextFormat: U.InsertTextFormat.Snippet,
      kind: U.CompletionItemKind.Property,
      documentation: "An index, unique constraint or primary key can be created as clustered or non-clustered; altering the storage and retrieve behavior of the index."
    });
  }
  return C;
}
function uC(A, I, g, Q, B) {
  return Q.includes("sort:") ? wo : g === "mysql" ? ["@unique", "@@unique", "@@index"].includes(A) ? B : B.filter((C) => C.label !== "sort") : g === "sqlserver" ? ["@unique", "@@unique", "@@index", "@id", "@@id"].includes(A) ? B.filter((C) => C.label !== "length") : B.filter((C) => C.label !== "length" && C.label !== "sort") : ["@unique", "@@unique", "@@index"].includes(A) ? B.filter((C) => C.label !== "length") : B.filter((C) => C.label !== "length" && C.label !== "sort");
}
const No = jg(
  hB,
  U.CompletionItemKind.Property
), ko = (
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  RA(
    hB.find((A) => A.label === "@unique").params.filter((A) => A.label === "length" || A.label === "sort"),
    U.CompletionItemKind.Property
  )
), XB = jg(
  PD,
  U.CompletionItemKind.Property
), xB = jg(
  vD,
  U.CompletionItemKind.Property
), ho = RA(
  go,
  U.CompletionItemKind.Constant
), Fo = RA(
  Qo,
  U.CompletionItemKind.Property
), Yo = RA(
  _D,
  U.CompletionItemKind.Constant
), Mo = RA(
  $D,
  U.CompletionItemKind.Property
), co = RA(
  Ao,
  U.CompletionItemKind.Constant
), ao = RA(
  Io,
  U.CompletionItemKind.Property
), VB = RA(
  Bo,
  U.CompletionItemKind.Property
);
function PA(A, I) {
  return A.map((g) => ({ label: g, kind: I }));
}
function PC(A, I, g) {
  let Q = !1;
  for (const [B, C] of g.entries())
    if (B === I.range.start.line + 1 && (Q = !0), !!Q) {
      if (B === I.range.end.line)
        break;
      C.startsWith("//") || C.includes("@id") && (A = A.filter((E) => !E.label.includes("id")));
    }
  return A;
}
function Ro(A, I, g, Q) {
  return Q === "type" && (A = A.filter((E) => E.label !== "@default" && E.label !== "@relation")), g === "Int" || g === "String" || Q === "enum" || (A = A.filter((E) => E.label !== "@id")), g === "DateTime" || (A = A.filter((E) => E.label !== "@updatedAt")), I.includes("@map") && (A = A.filter((E) => E.label !== "@map")), A;
}
function vC(A, I, g, Q) {
  let B = !1;
  for (const [C, E] of g.entries()) {
    if (C === I.range.start.line + 1 && (B = !0), !B || C === Q.line)
      continue;
    if (C === I.range.end.line)
      break;
    const D = E.replace(/ .*/, "");
    A.includes(D) && (A = A.filter((o) => o !== D));
  }
  return A;
}
function Jo(A, I, g, Q) {
  let B = A.map((C) => U.CompletionItem.create(C));
  if (qI(g, I, "[]"))
    if (Q) {
      const C = bI(g);
      return B = B.filter((E) => !C.includes(E.label)), {
        items: B,
        isIncomplete: !0
      };
    } else
      return {
        items: VB.filter((C) => !C.label.includes("[")),
        isIncomplete: !0
      };
  else
    return {
      items: VB.filter((C) => !C.label.includes('"')),
      isIncomplete: !0
    };
}
function _C(A, I) {
  let g = nC(A.getText());
  if (g.length === 0)
    return console.log("Did not receive any native type suggestions from prisma-fmt call."), [];
  const Q = [];
  return g = g.filter((B) => B.prisma_types.includes(I)), g.forEach((B) => {
    if (B._number_of_args + B._number_of_optional_args !== 0) {
      let C = "";
      B._number_of_optional_args !== 0 && (C = `${C}Number of optional arguments: ${B._number_of_optional_args}.
'`), B._number_of_args !== 0 && (C = `${C}Number of required arguments: ${B._number_of_args}.
`), Q.push({
        label: `${B.name}()`,
        kind: U.CompletionItemKind.TypeParameter,
        insertText: `${B.name}($0)`,
        documentation: { kind: U.MarkupKind.Markdown, value: C },
        insertTextFormat: U.InsertTextFormat.Snippet
      });
    } else
      Q.push({
        label: B.name,
        kind: U.CompletionItemKind.TypeParameter
      });
  }), Q;
}
function Uo(A) {
  console.log("running preview_features() from prisma-fmt");
  try {
    const I = CA.preview_features();
    return JSON.parse(I);
  } catch (I) {
    return A && A(`prisma-fmt error'd during getting available preview features.
 ${I}`), [];
  }
}
function yo(A, I) {
  if (A.type !== "model")
    return [];
  const g = PC(yA(io), A, I), Q = OI(I), B = NB(I);
  return !!(Q && ["mysql", "mongodb"].includes(Q) && (B != null && B.includes("fulltextindex"))) === !1 ? g.filter((E) => E.label !== "@@fulltext") : g;
}
function so(A, I, g, Q) {
  const B = nD(Q);
  if (
    // TODO type? native "@db." types?
    A.type !== "model" || !B || g.length < 2
  )
    return;
  const C = VC(I);
  if (!C || g[g.length - 1] !== `@${C}`)
    return;
  const E = g[1].replace("?", "").replace("[]", "");
  return {
    items: _C(Q, E),
    isIncomplete: !0
  };
}
function TB(A, I, g, Q, B) {
  if (A.type !== "model")
    return;
  const C = wB(I);
  if (!C)
    return;
  let E = [];
  if (Q.length >= 2) {
    const o = VC(g), i = Q[1], N = _C(B, i);
    if (o && (I.includes(`@${o}`) || E.push({
      // https://code.visualstudio.com/docs/editor/intellisense#_types-of-completions
      kind: U.CompletionItemKind.Property,
      label: "@" + o,
      documentation: "Defines a native database type that should be used for this field. See https://www.prisma.io/docs/concepts/components/prisma-schema/data-model#native-types-mapping",
      insertText: `@${o}$0`,
      insertTextFormat: U.InsertTextFormat.Snippet
    }), N.length !== 0 && // Check that we are not separated by a space like `@db. |`
    Q[Q.length - 1] === `@${o}`))
      return E.push(...N), {
        items: E,
        isIncomplete: !1
      };
  }
  E.push(...No);
  const D = PI(C, g);
  return E = Ro(E, I, C, D == null ? void 0 : D.type), E = PC(E, A, g), {
    items: E,
    isIncomplete: !1
  };
}
function Ko(A, I, g, Q) {
  const B = [];
  if (OI(I) === "mongodb" ? B.push(...nB.filter((i) => i.label !== "Decimal")) : B.push(...nB), A instanceof QB) {
    const i = pg(I);
    B.push(...PA(i, U.CompletionItemKind.Reference));
  }
  const E = Q.slice(0, g.character).split(" "), D = E[E.length - 1], o = B.filter((i) => i.label.length === D.length);
  if (o.length !== 0)
    for (const i of o)
      B.push(
        {
          label: `${i.label}?`,
          kind: i.kind,
          documentation: i.documentation
        },
        {
          label: `${i.label}[]`,
          kind: i.kind,
          documentation: i.documentation
        }
      );
  return {
    items: B,
    isIncomplete: !0
  };
}
function Zo(A, I, g) {
  var D, o;
  let Q = yA(Do);
  const B = (D = NB(I)) == null ? void 0 : D.includes("postgresqlextensions"), C = (o = OI(I)) == null ? void 0 : o.includes("postgres");
  B && C || (Q = Q.filter((i) => i.label !== "extensions"));
  const E = vC(
    Q.map((i) => i.label),
    A,
    I,
    g
  );
  return Q.filter((i) => E.includes(i.label));
}
function Ho(A, I, g) {
  const Q = yA(Go), B = vC(
    Q.map((C) => C.label),
    A,
    I,
    g
  );
  return Q.filter((C) => B.includes(C.label));
}
function So(A, I, g, Q) {
  let B = [];
  switch (A) {
    case "datasource":
      B = Zo(Q, I, g);
      break;
    case "generator":
      B = Ho(Q, I, g);
      break;
    case "model":
      B = yo(Q, I);
      break;
  }
  return {
    items: B,
    isIncomplete: !1
  };
}
function Lo(A) {
  const I = yA(Eo);
  let g = !1;
  for (const Q of A) {
    if (Q.includes("datasource")) {
      g = !0;
      continue;
    }
    if (g) {
      if (Q.includes("}"))
        break;
      Q.startsWith("provider") && Q.includes("sqlite") && I.pop();
    }
    if (!I.map((B) => B.label).includes("enum"))
      break;
  }
  return {
    items: I,
    isIncomplete: !1
  };
}
function qo(A) {
  return A == "datasource" || A == "generator" ? {
    items: [{ label: "=" }],
    isIncomplete: !1
  } : void 0;
}
function zB(A, I, g, Q, B) {
  let C = [];
  const E = XD(g, Q), D = OI(B);
  switch (A) {
    case "generator":
      if (I.startsWith("provider")) {
        const o = Yo;
        return E ? {
          items: o,
          isIncomplete: !0
        } : {
          items: Mo,
          isIncomplete: !0
        };
      } else if (I.startsWith("previewFeatures")) {
        const o = Uo();
        if (o.length > 0)
          return Jo(o, Q, g, E);
      } else if (I.startsWith("engineType")) {
        const o = co;
        return E ? {
          items: o,
          isIncomplete: !0
        } : {
          items: ao,
          isIncomplete: !0
        };
      }
      break;
    case "datasource":
      if (I.startsWith("provider")) {
        const o = ho;
        return E ? {
          items: o,
          isIncomplete: !0
        } : {
          items: Fo,
          isIncomplete: !0
        };
      } else if (I.startsWith("url"))
        if (qI(g, Q, "()"))
          C = ["DATABASE_URL"];
        else
          return I.includes("env") ? {
            items: xB.filter((o) => !o.label.includes("env")),
            isIncomplete: !0
          } : {
            items: xB,
            isIncomplete: !0
          };
      else if (I.startsWith("relationMode") && D !== "mongodb") {
        const o = oo, i = yA(o).map(
          (N) => (N.label = `"${N.label}"`, N.insertText = `"${N.insertText}"`, N)
        );
        if (E)
          return {
            items: o,
            isIncomplete: !0
          };
        if (!I.endsWith('"'))
          return {
            items: i,
            isIncomplete: !0
          };
      }
  }
  return {
    items: PA(C, U.CompletionItemKind.Constant),
    isIncomplete: !1
  };
}
function Oo({
  currentLine: A,
  lines: I,
  wordsBeforePosition: g
}) {
  const Q = [], B = OI(I);
  if (B === "cockroachdb" && g.some((o) => o.includes("sequence("))) {
    const o = ["virtual", "minValue", "maxValue", "cache", "increment", "start"];
    return A.includes("virtual") || (o.some((i) => A.includes(i)) || Q.push({
      label: "virtual",
      insertText: "virtual",
      kind: U.CompletionItemKind.Property,
      documentation: "Virtual sequences are sequences that do not generate monotonically increasing values and instead produce values like those generated by the built-in function unique_rowid(). They are intended for use in combination with SERIAL-typed columns."
    }), A.includes("minValue") || Q.push({
      label: "minValue",
      insertText: "minValue: $0",
      kind: U.CompletionItemKind.Property,
      documentation: "The new minimum value of the sequence."
    }), A.includes("maxValue") || Q.push({
      label: "maxValue",
      insertText: "maxValue: $0",
      kind: U.CompletionItemKind.Property,
      documentation: "The new maximum value of the sequence."
    }), A.includes("cache") || Q.push({
      label: "cache",
      insertText: "cache: $0",
      kind: U.CompletionItemKind.Property,
      documentation: "The number of sequence values to cache in memory for reuse in the session. A cache size of 1 means that there is no cache, and cache sizes of less than 1 are not valid."
    }), A.includes("increment") || Q.push({
      label: "increment",
      insertText: "increment: $0",
      kind: U.CompletionItemKind.Property,
      documentation: "The new value by which the sequence is incremented. A negative number creates a descending sequence. A positive number creates an ascending sequence."
    }), A.includes("start") || Q.push({
      label: "start",
      insertText: "start: $0",
      kind: U.CompletionItemKind.Property,
      documentation: "The value the sequence starts at if you RESTART or if the sequence hits the MAXVALUE and CYCLE is set."
    })), Q;
  }
  B === "mongodb" ? Q.push({
    label: "auto()",
    kind: U.CompletionItemKind.Function,
    documentation: "Represents default values that are automatically generated by the database.",
    insertText: "auto()",
    insertTextFormat: U.InsertTextFormat.Snippet
  }) : Q.push({
    label: 'dbgenerated("")',
    kind: U.CompletionItemKind.Function,
    documentation: "The SQL definition of the default value which is generated by the database. This is not validated by Prisma.",
    insertText: 'dbgenerated("$0")',
    insertTextFormat: U.InsertTextFormat.Snippet
  });
  const C = wB(A);
  if (!C)
    return [];
  switch (C) {
    case "BigInt":
    case "Int":
      if (B === "cockroachdb" && (Q.push({
        label: "sequence()",
        kind: U.CompletionItemKind.Function,
        documentation: "Create a sequence of integers in the underlying database and assign the incremented values to the ID values of the created records based on the sequence."
      }), C === "Int"))
        break;
      Q.push({
        label: "autoincrement()",
        kind: U.CompletionItemKind.Function,
        documentation: "Create a sequence of integers in the underlying database and assign the incremented values to the ID values of the created records based on the sequence."
      });
      break;
    case "DateTime":
      Q.push({
        label: "now()",
        kind: U.CompletionItemKind.Function,
        documentation: {
          kind: U.MarkupKind.Markdown,
          value: "Set a timestamp of the time when a record is created."
        }
      });
      break;
    case "Geometry":
      Q.push({
        label: "@db.Geography(Point, 4326)",
        kind: U.CompletionItemKind.Function,
        documentation: {
          kind: U.MarkupKind.Markdown,
          value: "Set a default value for a geometry field with the given type and SRID."
        }
      });
      break;
    case "String":
      Q.push(
        {
          label: "uuid()",
          kind: U.CompletionItemKind.Function,
          documentation: {
            kind: U.MarkupKind.Markdown,
            value: "Generate a globally unique identifier based on the [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier) spec."
          }
        },
        {
          label: "cuid()",
          kind: U.CompletionItemKind.Function,
          documentation: {
            kind: U.MarkupKind.Markdown,
            value: "Generate a globally unique identifier based on the [cuid](https://github.com/ericelliott/cuid) spec."
          }
        }
      );
      break;
    case "Boolean":
      Q.push(
        { label: "true", kind: U.CompletionItemKind.Value },
        { label: "false", kind: U.CompletionItemKind.Value }
      );
      break;
  }
  C.endsWith("[]") && Q.unshift({
    label: "[]",
    insertText: "[$0]",
    insertTextFormat: U.InsertTextFormat.Snippet,
    documentation: "Set a default value on the list field",
    kind: U.CompletionItemKind.Value
  });
  const D = PI(C, I);
  return D && D.type === "enum" && tI(I, D).forEach((i) => Q.push({ label: i, kind: U.CompletionItemKind.Value })), Q;
}
function fB({
  attribute: A,
  wordsBeforePosition: I,
  untrimmedCurrentLine: g,
  lines: Q,
  block: B,
  position: C
}) {
  const E = I[I.length - 1], D = I[I.length - 2], o = E === "" ? D : E;
  let i = [];
  const N = OI(Q), F = NB(Q);
  if (A === "@relation") {
    if (N === "mongodb" ? i = XB.filter(
      (c) => c.label !== "map" && c.label !== "onDelete" && c.label !== "onUpdate"
    ) : i = XB, o.includes("@relation"))
      return {
        items: i,
        isIncomplete: !1
      };
    if (eB(g, I, "fields", C))
      return {
        items: PA(tI(Q, B, C), U.CompletionItemKind.Field),
        isIncomplete: !1
      };
    if (eB(g, I, "references", C)) {
      const c = I[1].replace("?", "").replace("[]", ""), L = PI(c, Q);
      return !L || L.type !== "model" ? void 0 : {
        items: PA(tI(Q, L), U.CompletionItemKind.Field),
        isIncomplete: !1
      };
    }
  } else {
    let c;
    if (I.some((O) => O.includes("@@id")) ? c = "@@id" : I.some((O) => O.includes("@id")) ? c = "@id" : I.some((O) => O.includes("@@unique")) ? c = "@@unique" : I.some((O) => O.includes("@unique")) ? c = "@unique" : I.some((O) => O.includes("@@index")) ? c = "@@index" : I.some((O) => O.includes("@@fulltext")) && (c = "@@fulltext"), c && c !== "@@fulltext" && qI(g, C, "[]")) {
      if (WD(g, C)) {
        const t = [];
        return N === "postgresql" && c === "@@index" && t.push({
          label: "ops",
          insertText: "ops: $0",
          insertTextFormat: U.InsertTextFormat.Snippet,
          kind: U.CompletionItemKind.Property,
          documentation: "Specify the operator class for an indexed field."
        }), t.push(
          ...uC(
            c,
            F,
            N,
            o,
            ko
          )
        ), {
          items: t,
          isIncomplete: !1
        };
      }
      const O = bI(g);
      if (N === "mongodb" && O && E.endsWith(".")) {
        const V = ((wA) => {
          const [Z, n, W] = new RegExp(/(.*\[)?(.+)/).exec(wA) || [];
          let j = W;
          return j != null && j.includes(",") && (j = j.split(",").pop()), j != null && j.endsWith(".") && (j = j.slice(0, -1)), j;
        })(E);
        if (!V)
          return {
            isIncomplete: !1,
            items: []
          };
        const f = V.split("."), hA = kB(Q, B), $ = zC(Q, f, hA);
        return {
          items: PA($, U.CompletionItemKind.Field),
          isIncomplete: !1
        };
      }
      let l = tI(Q, B, C);
      if (O.length > 0) {
        if (E.includes("."))
          return {
            isIncomplete: !1,
            items: []
          };
        if (l = l.filter((t) => !O.includes(t)), E !== "" && !E.endsWith(",") && !E.endsWith(", "))
          return {
            items: PA(l, U.CompletionItemKind.Field),
            isIncomplete: !1
          };
      }
      return {
        items: PA(l, U.CompletionItemKind.Field),
        isIncomplete: !1
      };
    }
    let L = [];
    if (c === "@@unique" ? L = Qg({
      blockAttribute: "@@unique",
      wordBeforePosition: o,
      datasourceProvider: N,
      previewFeatures: F
    }) : c === "@@id" ? L = Qg({
      blockAttribute: "@@id",
      wordBeforePosition: o,
      datasourceProvider: N,
      previewFeatures: F
    }) : c === "@@index" ? L = Qg({
      blockAttribute: "@@index",
      wordBeforePosition: o,
      datasourceProvider: N,
      previewFeatures: F
    }) : c === "@@fulltext" && (L = Qg({
      blockAttribute: "@@fulltext",
      wordBeforePosition: o,
      datasourceProvider: N,
      previewFeatures: F
    })), L.length)
      i = L;
    else {
      let O = [];
      c === "@unique" ? O = WB(
        "@unique",
        F,
        N,
        o
      ) : c === "@id" && (O = WB(
        "@id",
        F,
        N,
        o
      )), i = O;
    }
  }
  const h = /* @__PURE__ */ new Set();
  for (const c of I)
    c.includes("references") && h.add("references"), c.includes("fields") && h.add("fields"), c.includes("onUpdate") && h.add("onUpdate"), c.includes("onDelete") && h.add("onDelete"), c.includes("map") && h.add("map"), (c.includes("name") || /".*"/.exec(c)) && (h.add("name"), h.add('""')), c.includes("type") && h.add("type");
  const k = i.reduce(
    (c, L) => {
      let O = !1;
      for (const l of h)
        L.label.includes(l) && (O = !0);
      return O || c.push(L), c;
    },
    []
  );
  if (k.length !== 0)
    return {
      items: k,
      isIncomplete: !1
    };
}
function rB(A, I, g, Q, B) {
  const C = A.slice(0, Q.character).trimLeft().split(/\s+/);
  return C.some((E) => E.includes("@default")) ? {
    items: Oo({
      currentLine: I[Q.line],
      lines: I,
      wordsBeforePosition: C
    }),
    isIncomplete: !1
  } : C.some((E) => E.includes("@relation")) ? fB({
    attribute: "@relation",
    wordsBeforePosition: C,
    untrimmedCurrentLine: A,
    lines: I,
    // document,
    block: B,
    position: Q
  }) : (
    // matches
    // @id, @unique
    // @@id, @@unique, @@index, @@fulltext
    C.some(
      (E) => E.includes("@unique") || E.includes("@id") || E.includes("@@index") || E.includes("@@fulltext")
    ) ? fB({
      wordsBeforePosition: C,
      untrimmedCurrentLine: A,
      lines: I,
      // document,
      block: B,
      position: Q
    }) : {
      items: PA([], U.CompletionItemKind.Field),
      isIncomplete: !1
    }
  );
}
var Bg = U;
function lo(A) {
  const I = [];
  return A.map((g, Q) => {
    if (g.includes("@@ignore")) {
      const B = hI(Q, A);
      B && I.push({
        range: { start: B.range.start, end: B.range.end },
        message: "@@ignore: When using Prisma Migrate, this model will be kept in sync with the database schema, however, it will not be exposed in Prisma Client.",
        tags: [Bg.DiagnosticTag.Unnecessary],
        severity: Bg.DiagnosticSeverity.Hint,
        code: "@@ignore documentation",
        codeDescription: {
          href: "https://pris.ly/d/schema-reference#ignore-1"
        }
      });
    } else
      g.includes("@ignore") && I.push({
        range: {
          start: { line: Q, character: 0 },
          end: { line: Q, character: Number.MAX_VALUE }
        },
        message: "@ignore: When using Prisma Migrate, this field will be kept in sync with the database schema, however, it will not be exposed in Prisma Client.",
        tags: [Bg.DiagnosticTag.Unnecessary],
        severity: Bg.DiagnosticSeverity.Hint,
        code: "@ignore documentation",
        codeDescription: {
          href: "https://pris.ly/d/schema-reference#ignore"
        }
      });
  }), I;
}
function po(A, I, g) {
  console.log("running format() from prisma-fmt");
  try {
    return CA.format(A, JSON.stringify(I));
  } catch (Q) {
    return g && g(
      "prisma-fmt error'd during formatting. To get a more detailed output please see Prisma Language Server output. To see the output, go to View > Output from the toolbar, then select 'Prisma Language Server' in the Output panel."
    ), console.warn(
      `
prisma-fmt error'd during formatting. Please report this issue on [Prisma Language Tools](https://github.com/prisma/language-tools/issues). 
Linter output:
`
    ), console.warn(Q), A;
  }
}
function jo(A, I) {
  console.log("running lint() from prisma-fmt");
  try {
    const g = CA.lint(A);
    return JSON.parse(g);
  } catch (g) {
    const Q = `prisma-fmt error'd during linting.
`;
    return I && I(Q + g), console.error(Q), console.error(g), [];
  }
}
function mo(A, I) {
  const g = I;
  g.textDocument = { uri: "file:/dev/null" };
  const Q = JSON.stringify(g), B = CA.text_document_completion(A, Q);
  return JSON.parse(B);
}
function $C(A) {
  const I = A.split(/\s+/);
  return I.length < 2 ? "" : I[1].replace("?", "").replace("[]", "");
}
function eo(A, I) {
  const g = pg(I), Q = $C(A);
  return Q == "" ? !1 : g.includes(Q);
}
function bo(A, I, g, Q) {
  if (g.type !== "model" || // TODO type
  I.line == g.range.start.line || I.line == g.range.end.line || A.startsWith("@"))
    return !1;
  const B = UA(Q, I.line), C = XC(A), E = B.indexOf(C);
  if (!(E <= I.character && E + C.length >= I.character))
    return !1;
  const o = $C(A);
  return o !== "" && o !== void 0;
}
function to(A, I, g, Q) {
  return I.type !== "model" ? !1 : A.line === I.range.start.line ? A.character > 5 : AE(I, g, Q, A, "model");
}
function no(A, I, g, Q) {
  return I.type === "enum" && A.line === I.range.start.line ? A.character > 4 : AE(I, g, Q, A, "enum");
}
function AE(A, I, g, Q, B) {
  if (A.type !== "model")
    return !1;
  const C = pg(I), E = lg(g, Q);
  return C.includes(E) ? I.findIndex((i) => i.startsWith(B) && i.includes(E)) !== -1 : !1;
}
function Wo(A, I, g, Q) {
  return g.type === "enum" && I.line !== g.range.start.line && !A.startsWith("@@") && !lg(Q, I).startsWith("@");
}
function Xo(A, I, g, Q, B, C) {
  const E = `'${A}' was renamed to '${I}'`;
  let D = "";
  g ? D = "Enum " : B ? D = "Field " : Q ? D = "Model " : C && (D = "Enum value "), console.log(D + E);
}
function xo(A, I) {
  return {
    range: {
      start: {
        line: I,
        character: Number.MAX_VALUE
      },
      end: {
        line: I,
        character: Number.MAX_VALUE
      }
    },
    newText: ` @map("${A}")`
  };
}
function Vo(A, I) {
  return {
    range: {
      start: {
        line: I.range.end.line,
        character: 0
      },
      end: I.range.end
    },
    newText: `	@@map("${A}")
}`
  };
}
function To(A, I) {
  return I.length === 0 ? !0 : !I.some((g) => A >= g.range.start.line && A <= g.range.end.line);
}
function zo(A, I, g, Q, B, C) {
  const E = [], D = ["@@index", "@@id", "@@unique"], o = "@relation";
  let i = !1;
  for (const [N, F] of Q.entries())
    if (N === B.range.start.line + 1 && (i = !0), !!i) {
      if (N === B.range.end.line)
        break;
      if (F.includes(o) && F.includes(A) && !C) {
        const h = UA(g, N), k = h.indexOf("fields:"), c = h.slice(k).indexOf("]") + k, L = h.slice(k, c + 1), O = L.indexOf(A), l = bI(L);
        O !== -1 && l.includes(A) && E.push({
          range: {
            start: {
              line: N,
              character: k + O
            },
            end: {
              line: N,
              character: k + O + A.length
            }
          },
          newText: I
        });
      }
      if (D.some((h) => F.includes(h)) && F.includes(A)) {
        const h = UA(g, N);
        if (bI(h).includes(A)) {
          const c = h.indexOf(A);
          E.push({
            range: {
              start: {
                line: N,
                character: c
              },
              end: {
                line: N,
                character: c + A.length
              }
            },
            newText: I
          });
        }
      }
    }
  for (const [N, F] of Q.entries())
    if (F.includes(B.name) && F.includes(A) && F.includes(o)) {
      const h = UA(g, N), k = h.indexOf("references:"), c = h.slice(k).indexOf("]") + k, L = h.slice(k, c + 1), O = L.indexOf(A), l = bI(L);
      O !== -1 && l.includes(A) && E.push({
        range: {
          start: {
            line: N,
            character: k + O
          },
          end: {
            line: N,
            character: k + O + A.length
          }
        },
        newText: I
      });
    }
  return E;
}
function fo(A, I, g, Q, B) {
  const C = [], E = `@default(${A})`;
  for (const [D, o] of Q.entries())
    if (o.includes(E) && o.includes(B)) {
      const N = UA(g, D).indexOf(E);
      C.push({
        range: {
          start: {
            line: D,
            character: N
          },
          end: {
            line: D,
            character: N + E.length
          }
        },
        newText: `@default(${I})`
      });
    }
  return C;
}
function ro(A, I, g, Q) {
  const B = [], C = [];
  for (const [E, D] of Q.entries())
    if (D.includes(A) && To(E, B)) {
      const o = hI(E, Q);
      if (o && o.type == "model") {
        B.push(o);
        const i = kB(Q, o);
        for (const N of i.fieldTypes.keys())
          if (N.replace("?", "").replace("[]", "") === A) {
            const F = i.fieldTypes.get(N);
            if (!(F != null && F.lineIndexes))
              return C;
            for (const h of F.lineIndexes) {
              const k = UA(g, h), c = Q[h].split(/\s+/), L = k.indexOf(c[0]), O = k.indexOf(
                A,
                L + c[0].length
              );
              C.push({
                range: {
                  start: {
                    line: h,
                    character: O
                  },
                  end: {
                    line: h,
                    character: O + A.length
                  }
                },
                newText: I
              });
            }
          }
      }
    }
  return C;
}
function uo(A) {
  return A.includes("@map(");
}
function Po(A, I) {
  let g = !1;
  for (const [Q, B] of I.entries())
    if (Q === A.range.start.line + 1 && (g = !0), !!g) {
      if (Q === A.range.end.line)
        break;
      if (B.startsWith("@@map("))
        return !0;
    }
  return !1;
}
function vo(A, I, g, Q) {
  const C = UA(g, Q).indexOf(I);
  return {
    range: {
      start: {
        line: Q,
        character: C
      },
      end: {
        line: Q,
        character: C + I.length
      }
    },
    newText: A
  };
}
function _o(A, I, g, Q) {
  return Q ? Po(g, I) : uo(A);
}
function $o(A, I, g, Q) {
  return Q ? Vo(A, g) : xo(A, I.line);
}
function AG(A, I, g, Q, B, C) {
  if (I) {
    const E = UA(B, C.line), o = E.slice(0, C.character + E.slice(C.character).search(/\W/)).trim().split(/\s+/);
    return o.length < 2 ? "" : o[1];
  }
  return g || Q ? XC(A) : "";
}
function IG(A, I) {
  const g = A.getText(iB(A)), Q = jo(g, (D) => {
    I && I(D);
  }), B = [];
  Q.some(
    (D) => D.text === "Field declarations don't require a `:`." || D.text === "Model declarations have to be indicated with the `model` keyword."
  ) && I && I(
    "You might currently be viewing a Prisma 1 datamodel which is based on the GraphQL syntax. The current Prisma Language Server doesn't support this syntax. If you are handling a Prisma 1 datamodel, please change the file extension to `.graphql` so the new Prisma Language Server does not get triggered anymore."
  );
  for (const D of Q) {
    const o = {
      range: {
        start: A.positionAt(D.start),
        end: A.positionAt(D.end)
      },
      message: D.text,
      source: ""
    };
    o.message !== 'Type "Geometry" is neither a built-in type, nor refers to another model, custom type, or enum.' && (D.is_warning ? o.severity = U.DiagnosticSeverity.Warning : o.severity = U.DiagnosticSeverity.Error, B.push(o));
  }
  if (A.getText().includes("experimentalFeatures")) {
    const D = tD(A);
    D && B.push({
      severity: U.DiagnosticSeverity.Warning,
      range: D,
      message: "This property has been renamed to 'previewFeatures' to better communicate what they are.",
      source: ""
    });
  }
  const C = AI(A), E = lo(C);
  return B.push(...E), B;
}
function gG(A, I) {
  const g = I.textDocument, Q = I.position, B = AI(A), C = lg(A, Q);
  if (C === "")
    return;
  const E = B.map((o, i) => {
    if (o.includes("model") && o.includes(C) || o.includes("type") && o.includes(C) || o.includes("enum") && o.includes(C))
      return i;
  }).filter((o) => o !== void 0);
  if (E.length === 0)
    return;
  const D = E.map((o) => {
    const i = hI(o, B);
    if (i && i.name === C)
      return i;
  }).filter((o) => o !== void 0);
  if (D.length === 1 && D[0])
    return [
      {
        targetUri: g.uri,
        targetRange: D[0].range,
        targetSelectionRange: D[0].nameRange
      }
    ];
}
function QG(A, I, g) {
  const Q = po(I.getText(), A, g);
  return [U.TextEdit.replace(iB(I), Q)];
}
function BG(A, I) {
  const g = I.position, Q = AI(A), B = lg(A, g);
  if (B === "")
    return;
  const C = PI(B, Q);
  if (!C)
    return;
  const E = C.range.start.line - 1, D = A.getText({
    start: { line: E, character: 0 },
    end: { line: E, character: Number.MAX_SAFE_INTEGER }
  });
  if (D.startsWith("///"))
    return {
      contents: D.slice(4).trim()
    };
}
function CG(A, I) {
  const g = I.getText(iB(I)), Q = mo(g, A);
  if (Q.items.length !== 0)
    return Q;
}
function EG(A, I) {
  const g = A.context, Q = A.position, B = AI(I), C = UA(I, Q.line), E = C.slice(0, Q.character - 1).trim(), D = E.split(/\s+/), o = xC(I, Q), i = o.search(/\s/) !== -1, N = D.length >= 3 && !E.includes("[") && i, F = hI(Q.line, B);
  if (!F)
    return D.length > 1 || D.length === 1 && i ? void 0 : Lo(B);
  if (bD(Q, UA(I, Q.line)))
    return So(F.type, B, Q, F);
  if ((g == null ? void 0 : g.triggerKind) === U.CompletionTriggerKind.TriggerCharacter)
    switch (g.triggerCharacter) {
      case "@":
        return dB(Q, I, D) ? TB(
          F,
          UA(I, Q.line),
          B,
          D,
          I
        ) : void 0;
      case '"':
        return zB(
          F.type,
          B[Q.line],
          C,
          Q,
          B
        );
      case ".":
        return F.type === "model" && qI(C, Q, "()") ? rB(
          C,
          B,
          I,
          Q,
          F
        ) : so(F, B, D, I);
    }
  switch (F.type) {
    case "model":
    case "type":
      return qI(C, Q, "()") ? rB(
        C,
        B,
        I,
        Q,
        F
      ) : dB(Q, I, D) ? TB(
        F,
        B[Q.line],
        B,
        D,
        I
      ) : Ko(F, B, Q, C);
    case "datasource":
    case "generator":
      if (D.length === 1 && i)
        return qo(F.type);
      if (E.includes("=") && !E.includes("]") && !N && o !== ",")
        return zB(
          F.type,
          B[Q.line],
          C,
          Q,
          B
        );
      break;
  }
}
function DG(A, I) {
  return CG(A, I) || EG(A, I);
}
function oG(A, I) {
  const g = AI(I), Q = A.position, B = g[Q.line], C = hI(Q.line, g), E = [];
  if (!C)
    return;
  const D = to(A.position, C, g, I), o = no(A.position, C, g, I), i = Wo(
    B,
    A.position,
    C,
    I
  ), N = bo(
    B,
    A.position,
    C,
    I
  ), F = N && eo(B, g);
  if (D || o || i || N) {
    const h = AG(
      B,
      D || o,
      i,
      N,
      I,
      A.position
    );
    let k = Q.line, c = C, L = B;
    if (D || o) {
      const O = new RegExp(
        `\\s*(model|enum)\\s+(${h})\\s*({)`,
        "g"
      );
      if (k = g.findIndex((t) => O.test(t)), k === -1)
        return;
      L = g[k];
      const l = hI(k, g);
      if (!l)
        return;
      c = l;
    }
    return E.push(vo(A.newName, h, I, k)), !F && !_o(L, g, c, D || o) && E.push(
      $o(h, Q, c, D || o)
    ), D || o ? E.push(...ro(h, A.newName, I, g)) : i ? E.push(
      ...fo(
        h,
        A.newName,
        I,
        g,
        c.name
      )
    ) : N && E.push(
      ...zo(
        h,
        A.newName,
        I,
        g,
        c,
        F
      )
    ), Xo(
      h,
      A.newName,
      o,
      D,
      N,
      i
    ), {
      changes: {
        [I.uri]: E
      }
    };
  }
}
function GG(A, I) {
  return A.context.diagnostics.length ? TD(I, A) : [];
}
function iG(A, I) {
  const g = AI(I);
  return Array.from(WC(g), (Q) => ({
    kind: {
      model: U.SymbolKind.Class,
      enum: U.SymbolKind.Enum,
      type: U.SymbolKind.Interface,
      datasource: U.SymbolKind.Struct,
      generator: U.SymbolKind.Function
    }[Q.type],
    name: Q.name,
    range: Q.range,
    selectionRange: Q.nameRange
  }));
}
function wG() {
  return "mock";
}
function NG() {
  return "mock";
}
function kG() {
  return "mock";
}
function hG(A) {
  const I = new ug.BrowserMessageReader(self), g = new ug.BrowserMessageWriter(self);
  return ug.createConnection(I, g);
}
let uB = !1, $g = !1;
FG();
function FG(A) {
  const I = hG();
  console.log = I.console.log.bind(I.console), console.error = I.console.error.bind(I.console);
  const g = new U.TextDocuments(IB);
  I.onInitialize((E) => {
    var F, h, k;
    I.console.info(`Default version of Prisma 'prisma-fmt': ${wG()}`);
    const D = NG();
    I.console.info(`Prisma Engines version: ${D}`);
    const o = kG();
    I.console.info(`Prisma CLI version: ${o}`);
    const i = E.capabilities;
    uB = !!((h = (F = i == null ? void 0 : i.textDocument) == null ? void 0 : F.codeAction) != null && h.codeActionLiteralSupport), $g = !!((k = i == null ? void 0 : i.workspace) != null && k.configuration);
    const N = {
      capabilities: {
        definitionProvider: !0,
        documentFormattingProvider: !0,
        completionProvider: {
          resolveProvider: !0,
          triggerCharacters: ["@", '"', "."]
        },
        hoverProvider: !0,
        renameProvider: !0,
        documentSymbolProvider: !0
      }
    };
    return uB && (N.capabilities.codeActionProvider = {
      codeActionKinds: [U.CodeActionKind.QuickFix]
    }), N;
  }), I.onInitialized(() => {
    $g && I.client.register(U.DidChangeConfigurationNotification.type, void 0);
  });
  const Q = /* @__PURE__ */ new Map();
  I.onDidChangeConfiguration((E) => {
    I.console.info("Configuration changed."), $g && Q.clear(), g.all().forEach(B);
  }), g.onDidClose((E) => {
    Q.delete(E.document.uri);
  });
  function B(E) {
    const D = IG(
      E,
      (o) => {
        I.window.showErrorMessage(o);
      }
    );
    I.sendDiagnostics({ uri: E.uri, diagnostics: D });
  }
  g.onDidChangeContent((E) => {
    B(E.document);
  });
  function C(E) {
    return g.get(E);
  }
  I.onDefinition((E) => {
    const D = C(E.textDocument.uri);
    if (D)
      return gG(D, E);
  }), I.onCompletion((E) => {
    const D = C(E.textDocument.uri);
    if (D)
      return DG(E, D);
  }), I.onCompletionResolve((E) => E), I.onDidChangeWatchedFiles(() => {
    I.console.log("Types have changed. Sending request to restart TS Language Server."), I.sendNotification("prisma/didChangeWatchedFiles", {});
  }), I.onHover((E) => {
    const D = C(E.textDocument.uri);
    if (D)
      return BG(D, E);
  }), I.onDocumentFormatting((E) => {
    const D = C(E.textDocument.uri);
    if (D)
      return QG(E, D, (o) => {
        I.window.showErrorMessage(o);
      });
  }), I.onCodeAction((E) => {
    const D = C(E.textDocument.uri);
    if (D)
      return GG(E, D);
  }), I.onRenameRequest((E) => {
    const D = C(E.textDocument.uri);
    if (D)
      return oG(E, D);
  }), I.onDocumentSymbol((E) => {
    const D = C(E.textDocument.uri);
    if (D)
      return iG(E, D);
  }), g.listen(I), I.listen();
}
export {
  FG as startServer
};