import{a as c}from"./index.esm.e5edd667.js";/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */var o=function(){return o=Object.assign||function(t){for(var r,e=1,a=arguments.length;e<a;e++){r=arguments[e];for(var u in r)Object.prototype.hasOwnProperty.call(r,u)&&(t[u]=r[u])}return t},o.apply(this,arguments)},s=function(n){return typeof n=="function"},v=function(n){return s(n[1])?[n[0],n[1],n[2]||{}]:[n[0],null,(n[1]===null?n[2]:n[1])||{}]},m=function(n,t){return function(){for(var r=[],e=0;e<arguments.length;e++)r[e]=arguments[e];var a=v(r),u=a[0],l=a[1],i=a[2],f=(i.use||[]).concat(t);return n(u,l,o(o({},i),{use:f}))}},d=function(n){return function(t,r,e){return e.revalidateOnFocus=!1,e.revalidateIfStale=!1,e.revalidateOnReconnect=!1,n(t,r,e)}},h=m(c,d);export{h as i};
