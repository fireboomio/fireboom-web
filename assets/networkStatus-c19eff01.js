import{aG as U,bU as p,aE as h}from"./index-91e91fd5.js";var m="Invariant Violation",C=Object.setPrototypeOf,J=C===void 0?function(e,r){return e.__proto__=r,e}:C,V=function(e){U(r,e);function r(t){t===void 0&&(t=m);var n=e.call(this,typeof t=="number"?m+": "+t+" (see https://github.com/apollographql/invariant-packages)":t)||this;return n.framesToPop=1,n.name=m,J(n,r.prototype),n}return r}(Error);function d(e,r){if(!e)throw new V(r)}var q=["debug","log","warn","error","silent"],$=q.indexOf("log");function y(e){return function(){if(q.indexOf(e)>=$){var r=console[e]||console.log;return r.apply(console,arguments)}}}(function(e){e.debug=y("debug"),e.log=y("log"),e.warn=y("warn"),e.error=y("error")})(d||(d={}));var P="3.10.5";function c(e){try{return e()}catch{}}const b=c(function(){return globalThis})||c(function(){return window})||c(function(){return self})||c(function(){return global})||c(function(){return c.constructor("return this")()});var j=new Map;function Y(e){var r=j.get(e)||1;return j.set(e,r+1),"".concat(e,":").concat(r,":").concat(Math.random().toString(36).slice(2))}function X(e,r){r===void 0&&(r=0);var t=Y("stringifyForDisplay");return JSON.stringify(e,function(n,o){return o===void 0?t:o},r).split(JSON.stringify(t)).join("<undefined>")}function v(e){return function(r){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];if(typeof r=="number"){var o=r;r=A(o),r||(r=O(o,t),t=[])}e.apply(void 0,[r].concat(t))}}var Se=Object.assign(function(r,t){for(var n=[],o=2;o<arguments.length;o++)n[o-2]=arguments[o];r||d(r,A(t,n)||O(t,n))},{debug:v(d.debug),log:v(d.log),warn:v(d.warn),error:v(d.error)});function ze(e){for(var r=[],t=1;t<arguments.length;t++)r[t-1]=arguments[t];return new V(A(e,r)||O(e,r))}var x=Symbol.for("ApolloErrorMessageHandler_"+P);function Q(e){return typeof e=="string"?e:X(e,2).slice(0,1e3)}function A(e,r){if(r===void 0&&(r=[]),!!e)return b[x]&&b[x](e,r.map(Q))}function O(e,r){if(r===void 0&&(r=[]),!!e)return"An error occurred! For more details, see the full error text at https://go.apollo.dev/c/err#".concat(encodeURIComponent(JSON.stringify({version:P,message:e,args:r.map(Q)})))}var Ie=typeof WeakMap=="function"&&!c(function(){return navigator.product=="ReactNative"&&!global.HermesInternal}),_e=typeof WeakSet=="function",Z=typeof Symbol=="function"&&typeof Symbol.for=="function",Ae=Z&&Symbol.asyncIterator,ee=typeof c(function(){return window.document.createElement})=="function",re=c(function(){return navigator.userAgent.indexOf("jsdom")>=0})||!1,Oe=ee&&!re;function E(e){return e!==null&&typeof e=="object"}function te(){}class k{constructor(r=1/0,t=te){this.max=r,this.dispose=t,this.map=new Map,this.newest=null,this.oldest=null}has(r){return this.map.has(r)}get(r){const t=this.getNode(r);return t&&t.value}get size(){return this.map.size}getNode(r){const t=this.map.get(r);if(t&&t!==this.newest){const{older:n,newer:o}=t;o&&(o.older=n),n&&(n.newer=o),t.older=this.newest,t.older.newer=t,t.newer=null,this.newest=t,t===this.oldest&&(this.oldest=o)}return t}set(r,t){let n=this.getNode(r);return n?n.value=t:(n={key:r,value:t,newer:null,older:this.newest},this.newest&&(this.newest.newer=n),this.newest=n,this.oldest=this.oldest||n,this.map.set(r,n),n.value)}clean(){for(;this.oldest&&this.map.size>this.max;)this.delete(this.oldest.key)}delete(r){const t=this.map.get(r);return t?(t===this.newest&&(this.newest=t.older),t===this.oldest&&(this.oldest=t.newer),t.newer&&(t.newer.older=t.older),t.older&&(t.older.newer=t.newer),this.map.delete(r),this.dispose(t.value,r),!0):!1}}function M(){}const ne=M,oe=typeof WeakRef<"u"?WeakRef:function(e){return{deref:()=>e}},ie=typeof WeakMap<"u"?WeakMap:Map,se=typeof FinalizationRegistry<"u"?FinalizationRegistry:function(){return{register:M,unregister:M}},ae=10024;class R{constructor(r=1/0,t=ne){this.max=r,this.dispose=t,this.map=new ie,this.newest=null,this.oldest=null,this.unfinalizedNodes=new Set,this.finalizationScheduled=!1,this.size=0,this.finalize=()=>{const n=this.unfinalizedNodes.values();for(let o=0;o<ae;o++){const i=n.next().value;if(!i)break;this.unfinalizedNodes.delete(i);const a=i.key;delete i.key,i.keyRef=new oe(a),this.registry.register(a,i,i)}this.unfinalizedNodes.size>0?queueMicrotask(this.finalize):this.finalizationScheduled=!1},this.registry=new se(this.deleteNode.bind(this))}has(r){return this.map.has(r)}get(r){const t=this.getNode(r);return t&&t.value}getNode(r){const t=this.map.get(r);if(t&&t!==this.newest){const{older:n,newer:o}=t;o&&(o.older=n),n&&(n.newer=o),t.older=this.newest,t.older.newer=t,t.newer=null,this.newest=t,t===this.oldest&&(this.oldest=o)}return t}set(r,t){let n=this.getNode(r);return n?n.value=t:(n={key:r,value:t,newer:null,older:this.newest},this.newest&&(this.newest.newer=n),this.newest=n,this.oldest=this.oldest||n,this.scheduleFinalization(n),this.map.set(r,n),this.size++,n.value)}clean(){for(;this.oldest&&this.size>this.max;)this.deleteNode(this.oldest)}deleteNode(r){r===this.newest&&(this.newest=r.older),r===this.oldest&&(this.oldest=r.newer),r.newer&&(r.newer.older=r.older),r.older&&(r.older.newer=r.newer),this.size--;const t=r.key||r.keyRef&&r.keyRef.deref();this.dispose(r.value,t),r.keyRef?this.registry.unregister(r):this.unfinalizedNodes.delete(r),t&&this.map.delete(t)}delete(r){const t=this.map.get(r);return t?(this.deleteNode(t),!0):!1}scheduleFinalization(r){this.unfinalizedNodes.add(r),this.finalizationScheduled||(this.finalizationScheduled=!0,queueMicrotask(this.finalize))}}var w=new WeakSet;function B(e){e.size<=(e.max||-1)||w.has(e)||(w.add(e),setTimeout(function(){e.clean(),w.delete(e)},100))}var Ce=function(e,r){var t=new R(e,r);return t.set=function(n,o){var i=R.prototype.set.call(this,n,o);return B(this),i},t},je=function(e,r){var t=new k(e,r);return t.set=function(n,o){var i=k.prototype.set.call(this,n,o);return B(this),i},t},le=Symbol.for("apollo.cacheSize"),ce=p({},b[le]),f={};function xe(e,r){f[e]=r}var ke=globalThis.__DEV__!==!1?fe:void 0,Re=globalThis.__DEV__!==!1?de:void 0,De=globalThis.__DEV__!==!1?H:void 0;function ue(){var e={parser:1e3,canonicalStringify:1e3,print:2e3,"documentTransform.cache":2e3,"queryManager.getDocumentInfo":2e3,"PersistedQueryLink.persistedQueryHashes":2e3,"fragmentRegistry.transform":2e3,"fragmentRegistry.lookup":1e3,"fragmentRegistry.findFragmentSpreads":4e3,"cache.fragmentQueryDocuments":1e3,"removeTypenameFromVariables.getVariableDefinitions":2e3,"inMemoryCache.maybeBroadcastWatch":5e3,"inMemoryCache.executeSelectionSet":5e4,"inMemoryCache.executeSubSelectedArray":1e4};return Object.fromEntries(Object.entries(e).map(function(r){var t=r[0],n=r[1];return[t,ce[t]||n]}))}function fe(){var e,r,t,n,o;if(globalThis.__DEV__===!1)throw new Error("only supported in development mode");return{limits:ue(),sizes:p({print:(e=f.print)===null||e===void 0?void 0:e.call(f),parser:(r=f.parser)===null||r===void 0?void 0:r.call(f),canonicalStringify:(t=f.canonicalStringify)===null||t===void 0?void 0:t.call(f),links:z(this.link),queryManager:{getDocumentInfo:this.queryManager.transformCache.size,documentTransforms:G(this.queryManager.documentTransform)}},(o=(n=this.cache).getMemoryInternals)===null||o===void 0?void 0:o.call(n))}}function H(){return{cache:{fragmentQueryDocuments:u(this.getFragmentDoc)}}}function de(){var e=this.config.fragments;return p(p({},H.apply(this)),{addTypenameDocumentTransform:G(this.addTypenameTransform),inMemoryCache:{executeSelectionSet:u(this.storeReader.executeSelectionSet),executeSubSelectedArray:u(this.storeReader.executeSubSelectedArray),maybeBroadcastWatch:u(this.maybeBroadcastWatch)},fragmentRegistry:{findFragmentSpreads:u(e==null?void 0:e.findFragmentSpreads),lookup:u(e==null?void 0:e.lookup),transform:u(e==null?void 0:e.transform)}})}function he(e){return!!e&&"dirtyKey"in e}function u(e){return he(e)?e.size:void 0}function K(e){return e!=null}function G(e){return S(e).map(function(r){return{cache:r}})}function S(e){return e?h(h([u(e==null?void 0:e.performWork)],S(e==null?void 0:e.left),!0),S(e==null?void 0:e.right),!0).filter(K):[]}function z(e){var r;return e?h(h([(r=e==null?void 0:e.getMemoryInternals)===null||r===void 0?void 0:r.call(e)],z(e==null?void 0:e.left),!0),z(e==null?void 0:e.right),!0).filter(K):[]}var Fe=Array.isArray;function Te(e){return Array.isArray(e)&&e.length>0}function ge(e){var r=new Set([e]);return r.forEach(function(t){E(t)&&pe(t)===t&&Object.getOwnPropertyNames(t).forEach(function(n){E(t[n])&&r.add(t[n])})}),e}function pe(e){if(globalThis.__DEV__!==!1&&!Object.isFrozen(e))try{Object.freeze(e)}catch(r){if(r instanceof TypeError)return null;throw r}return e}function We(e){return globalThis.__DEV__!==!1&&ge(e),e}function D(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];var t=Object.create(null);return e.forEach(function(n){n&&Object.keys(n).forEach(function(o){var i=n[o];i!==void 0&&(t[o]=i)})}),t}function Ne(e,r){return D(e,r,r.variables&&{variables:D(p(p({},e&&e.variables),r.variables))})}var ye=Symbol();function Le(e){return e.extensions?Array.isArray(e.extensions[ye]):!1}function Ue(e){return e.hasOwnProperty("graphQLErrors")}var ve=function(e){var r=h(h(h([],e.graphQLErrors,!0),e.clientErrors,!0),e.protocolErrors,!0);return e.networkError&&r.push(e.networkError),r.map(function(t){return E(t)&&t.message||"Error message not found."}).join(`
`)},Ve=function(e){U(r,e);function r(t){var n=t.graphQLErrors,o=t.protocolErrors,i=t.clientErrors,a=t.networkError,s=t.errorMessage,g=t.extraInfo,l=e.call(this,s)||this;return l.name="ApolloError",l.graphQLErrors=n||[],l.protocolErrors=o||[],l.clientErrors=i||[],l.networkError=a||null,l.message=s||ve(l),l.extraInfo=g,l.__proto__=r.prototype,l}return r}(Error);const{toString:F,hasOwnProperty:me}=Object.prototype,T=Function.prototype.toString,I=new Map;function qe(e,r){try{return _(e,r)}finally{I.clear()}}function _(e,r){if(e===r)return!0;const t=F.call(e),n=F.call(r);if(t!==n)return!1;switch(t){case"[object Array]":if(e.length!==r.length)return!1;case"[object Object]":{if(N(e,r))return!0;const o=W(e),i=W(r),a=o.length;if(a!==i.length)return!1;for(let s=0;s<a;++s)if(!me.call(r,o[s]))return!1;for(let s=0;s<a;++s){const g=o[s];if(!_(e[g],r[g]))return!1}return!0}case"[object Error]":return e.name===r.name&&e.message===r.message;case"[object Number]":if(e!==e)return r!==r;case"[object Boolean]":case"[object Date]":return+e==+r;case"[object RegExp]":case"[object String]":return e==`${r}`;case"[object Map]":case"[object Set]":{if(e.size!==r.size)return!1;if(N(e,r))return!0;const o=e.entries(),i=t==="[object Map]";for(;;){const a=o.next();if(a.done)break;const[s,g]=a.value;if(!r.has(s)||i&&!_(g,r.get(s)))return!1}return!0}case"[object Uint16Array]":case"[object Uint8Array]":case"[object Uint32Array]":case"[object Int32Array]":case"[object Int8Array]":case"[object Int16Array]":case"[object ArrayBuffer]":e=new Uint8Array(e),r=new Uint8Array(r);case"[object DataView]":{let o=e.byteLength;if(o===r.byteLength)for(;o--&&e[o]===r[o];);return o===-1}case"[object AsyncFunction]":case"[object GeneratorFunction]":case"[object AsyncGeneratorFunction]":case"[object Function]":{const o=T.call(e);return o!==T.call(r)?!1:!Ee(o,be)}}return!1}function W(e){return Object.keys(e).filter(we,e)}function we(e){return this[e]!==void 0}const be="{ [native code] }";function Ee(e,r){const t=e.length-r.length;return t>=0&&e.indexOf(r,t)===t}function N(e,r){let t=I.get(e);if(t){if(t.has(r))return!0}else I.set(e,t=new Set);return t.add(r),!1}var L;(function(e){e[e.loading=1]="loading",e[e.setVariables=2]="setVariables",e[e.fetchMore=3]="fetchMore",e[e.refetch=4]="refetch",e[e.poll=6]="poll",e[e.ready=7]="ready",e[e.error=8]="error"})(L||(L={}));function Pe(e){return e?e<7:!1}export{Ce as A,ke as B,P as C,L as N,ye as P,k as S,R as W,Oe as a,ce as b,Z as c,Ie as d,qe as e,D as f,Ne as g,Te as h,Se as i,Ve as j,je as k,E as l,We as m,ze as n,_e as o,Fe as p,Ae as q,xe as r,c as s,De as t,X as u,Re as v,Pe as w,Y as x,Le as y,Ue as z};