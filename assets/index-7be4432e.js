import{aY as g,h as i,j as t,r as c}from"./index-e23f2223.js";var Se=["isArray","start","level","className","render"];function $(e){var{isArray:r=!1,start:a=!1,level:o,className:n,render:s}=e,d=g(e,Se),l=r?"[]":"{}",v="w-rjv-"+(r?"brackets":"curlybraces")+"-"+(a?"start":"end")+" "+(n||""),f="var(--w-rjv-"+(r?"brackets":"curlybraces")+"-color, #236a7c)";if(s){var m=s(i({isArray:r,level:o,className:v,style:{color:f},children:a?l.charAt(0):l.charAt(1)},d));if(m)return m}return t.jsx(I,i({color:f,className:v},d,{children:a?l.charAt(0):l.charAt(1)}))}$.displayName="JVR.Meta";var Ve=["children","style","text","onCopied","render","show"];function ne(e){var{style:r,text:a="",onCopied:o,render:n,show:s}=e,d=g(e,Ve);if(!s)return null;var[l,v]=c.useState(!1),f=C=>{C.stopPropagation();var b=JSON.stringify(a||"",(w,p)=>typeof p=="bigint"?p.toString():p,2);a===1/0&&(b=1/0),navigator.clipboard.writeText(b).then(()=>{o&&o(b,a),v(!0);var w=setTimeout(()=>{v(!1),clearTimeout(w)},3e3)}).catch(w=>{})},m=i({},r,{cursor:"pointer",verticalAlign:"middle",marginLeft:5}),h=i({height:"1em",width:"1em",fill:"var(--w-rjv-copied-color, currentColor)",onClick:f,style:m,className:"w-rjv-copied"},d);return n?n(i({},e,h)):l?t.jsx("svg",i({viewBox:"0 0 32 36"},h,{fill:"var(--w-rjv-copied-success-color, #28a745)",children:t.jsx("path",{d:"M27.5,33 L2.5,33 L2.5,12.5 L27.5,12.5 L27.5,15.2249049 C29.1403264,13.8627542 29.9736597,13.1778155 30,13.1700887 C30,11.9705278 30,10.0804982 30,7.5 C30,6.1 28.9,5 27.5,5 L20,5 C20,2.2 17.8,0 15,0 C12.2,0 10,2.2 10,5 L2.5,5 C1.1,5 0,6.1 0,7.5 L0,33 C0,34.4 1.1,36 2.5,36 L27.5,36 C28.9,36 30,34.4 30,33 L30,26.1114493 L27.5,28.4926435 L27.5,33 Z M7.5,7.5 L10,7.5 C10,7.5 12.5,6.4 12.5,5 C12.5,3.6 13.6,2.5 15,2.5 C16.4,2.5 17.5,3.6 17.5,5 C17.5,6.4 18.8,7.5 20,7.5 L22.5,7.5 C22.5,7.5 25,8.6 25,10 L5,10 C5,8.5 6.1,7.5 7.5,7.5 Z M5,27.5 L10,27.5 L10,25 L5,25 L5,27.5 Z M28.5589286,16 L32,19.6 L21.0160714,30.5382252 L13.5303571,24.2571429 L17.1303571,20.6571429 L21.0160714,24.5428571 L28.5589286,16 Z M17.5,15 L5,15 L5,17.5 L17.5,17.5 L17.5,15 Z M10,20 L5,20 L5,22.5 L10,22.5 L10,20 Z"})})):t.jsx("svg",i({viewBox:"0 0 32 36"},h,{children:t.jsx("path",{d:"M27.5,33 L2.5,33 L2.5,12.5 L27.5,12.5 L27.5,20 L30,20 L30,7.5 C30,6.1 28.9,5 27.5,5 L20,5 C20,2.2 17.8,0 15,0 C12.2,0 10,2.2 10,5 L2.5,5 C1.1,5 0,6.1 0,7.5 L0,33 C0,34.4 1.1,36 2.5,36 L27.5,36 C28.9,36 30,34.4 30,33 L30,29 L27.5,29 L27.5,33 Z M7.5,7.5 L10,7.5 C10,7.5 12.5,6.4 12.5,5 C12.5,3.6 13.6,2.5 15,2.5 C16.4,2.5 17.5,3.6 17.5,5 C17.5,6.4 18.8,7.5 20,7.5 L22.5,7.5 C22.5,7.5 25,8.6 25,10 L5,10 C5,8.5 6.1,7.5 7.5,7.5 Z M5,27.5 L10,27.5 L10,25 L5,25 L5,27.5 Z M22.5,21.5 L22.5,16.5 L12.5,24 L22.5,31.5 L22.5,26.5 L32,26.5 L32,21.5 L22.5,21.5 Z M17.5,15 L5,15 L5,17.5 L17.5,17.5 L17.5,15 Z M10,20 L5,20 L5,22.5 L10,22.5 L10,20 Z"})}))}ne.displayName="JVR.Copied";var ke=["children","style"],Re=["children","length","style"],Ae=["color","style","isURL","href","children"],Me=["value","parentValue","setValue","countInfo","data","keyName","indentWidth","isSet","namespace","renderKey","components","quotes","level","enableClipboard","displayObjectSize","displayDataTypes","shortenTextAfterLength"],Te=["children","color","fontSize","opacity","paddingRight","style"],E=e=>t.jsx("div",i({},e));E.displayName="JVR.Line";var Je=e=>Number(e)===e&&e%1!==0||isNaN(e),q={string:{color:"var(--w-rjv-type-string-color, #cb4b16)",label:"string"},number:{color:"var(--w-rjv-type-int-color, #268bd2)",label:"int"},float:{color:"var(--w-rjv-type-float-color, #859900)",label:"float"},bigint:{color:"var(--w-rjv-type-bigint-color, #268bd2)",label:"bigint"},boolean:{color:"var(--w-rjv-type-boolean-color, #2aa198)",label:"bool"},date:{color:"var(--w-rjv-type-date-color, #586e75)",label:"date"},url:{color:"var(--w-rjv-type-url-color, #0969da)",label:"url"},null:{color:"var(--w-rjv-type-null-color, #d33682)",label:"null"},Set:{color:"var(--w-rjv-type-set-color, #268bd2)",label:"Set"},Map:{color:"var(--w-rjv-type-map-color, #268bd2)",label:"Map"},NaN:{color:"var(--w-rjv-type-nan-color, #859900)",label:"NaN"},undefined:{color:"var(--w-rjv-type-undefined-color, #586e75)",label:"undefined"}},G=e=>{var{children:r=":",style:a}=e,o=g(e,ke);return t.jsx("span",i({className:"w-rjv-colon",style:i({paddingRight:3},a,{color:"var(--w-rjv-colon-color, var(--w-rjv-color))"})},o,{children:r}))};G.displayName="JVR.Colon";function Ee(e){var r=typeof e,a="";typeof e=="number"&&(r=Je(e)?"float":"number",a=e.toString(),isNaN(e)&&(r="NaN",a="NaN")),typeof e=="boolean"&&(r="boolean",a=e.toString()),typeof e=="object"&&e instanceof Date&&(r="date",a=e.toString()),e===null&&(r="null",a=(""+e).toLocaleUpperCase()),e===void 0&&(r="undefined",a=String(e)),typeof e=="bigint"&&(r="bigint",a=e+"n");var o=e instanceof URL;return o&&(r="url",a='"'+e.href+'"'),typeof e=="string"&&(a='"'+e+'"'),{type:r,content:a}}var je=e=>{var{children:r,length:a,style:o}=e,n=g(e,Re),s=r,[d,l]=c.useState(a&&s.length>=a);c.useEffect(()=>l(a&&s.length>=a),[a]);var v=()=>l(!d),f=d?s.slice(0,a)+"...":s;return t.jsx(se,i({},n,{style:i({},o,{cursor:"pointer"}),onClick:v,children:f}))};je.displayName="JVR.RenderShortenTextValue";var se=e=>{var{color:r,style:a,isURL:o,href:n,children:s}=e,d=g(e,Ae);return t.jsxs(I,i({color:r,style:a},d,{className:"w-rjv-value",children:[o&&t.jsx("a",{href:n,style:{color:r},target:"_blank",rel:"noopener noreferrer",children:s}),!o&&s]}))};se.displayName="JVR.RenderStringValue";function me(e){var r,{value:a,parentValue:o,setValue:n,countInfo:s,data:d,keyName:l,indentWidth:v,namespace:f,renderKey:m,components:h={},quotes:C,enableClipboard:b,displayDataTypes:w,shortenTextAfterLength:p}=e,x=g(e,Me),V="",L={},{type:R,content:A}=Ee(a),U=t.jsx(Q,{type:R});a===null&&(U=t.jsx(c.Fragment,{}),L={fontWeight:"bold"}),(a===void 0||R.toLocaleLowerCase()==="nan"||!w)&&(U=t.jsx(c.Fragment,{}));var k=a instanceof URL;V=((r=q[R])==null?void 0:r.color)||"";var[Z,F]=c.useState(!1),W=c.useMemo(()=>b&&Z&&t.jsx(ne,{show:Z,text:a}),[b,Z,a]),N={className:"w-rjv-line",style:{paddingLeft:v}};if(b&&(N.onMouseEnter=()=>F(!0),N.onMouseLeave=()=>F(!1)),A&&typeof A=="string"){var O=h.value&&h.value({className:"w-rjv-value",style:i({color:V},L),type:R,value:a,setValue:n,data:d,parentValue:o,quotes:C,keyName:l,namespace:f,visible:Z,content:A,children:A}),ee=p&&R==="string"?t.jsx(je,{color:V,href:k?a.href:"",style:L,isURL:k,length:p,children:A}):t.jsx(se,{color:V,href:k?a.href:"",style:L,isURL:k,children:A});return t.jsx(E,i({},N,{children:t.jsxs(I,i({},x,{ref:null,children:[m,t.jsx(G,{}),U,O||ee,W]}))}))}var j=t.jsxs(c.Fragment,{children:[t.jsx($,{render:h.braces,start:!0,isArray:Array.isArray(a)}),t.jsx($,{render:h.braces,isArray:Array.isArray(a)}),s]});return t.jsx(E,i({},N,{children:t.jsxs(I,i({},x,{ref:null,children:[m,t.jsx(G,{}),U,j,W]}))}))}me.displayName="JVR.ValueView";var I=c.forwardRef((e,r)=>{var{children:a,color:o,fontSize:n,opacity:s,paddingRight:d,style:l}=e,v=g(e,Te);return t.jsx("span",i({style:i({color:o,fontSize:n,opacity:s,paddingRight:d},l)},v,{ref:r,children:a}))});I.displayName="JVR.Label";var Q=e=>{var r,a,{type:o}=e,n=(r=q[o])==null?void 0:r.color,s=(a=q[o])==null?void 0:a.label;if(n&&s)return t.jsx(I,{color:n,fontSize:11,opacity:.8,paddingRight:4,className:"w-rjv-type","data-type":o,children:s})};Q.displayName="JVR.Type";var Ie=["style"];function ie(e){var{style:r}=e,a=g(e,Ie),o=i({cursor:"pointer",height:"1em",width:"1em"},r);return t.jsx("svg",i({viewBox:"0 0 24 24",fill:"var(--w-rjv-arrow-color, currentColor)",style:o},a,{children:t.jsx("path",{d:"M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z"})}))}ie.displayName="JVR.TriangleArrow";var D={},K=[],fe={collapse(e){D=i({},D,{[e]:!1}),he()},expand(e){D=i({},D,{[e]:!0}),he()}};function Ue(){return D}function _e(e){return K=[...K,e],()=>{K=K.filter(r=>r!==e)}}function he(){for(var e of K)e()}function Ze(){var e=c.useSyncExternalStore(_e,Ue);return e}var $e=["children","render","color","value","className","keyName","highlightUpdates","quotes","style","namespace","parentName"];function Oe(e){var r=c.useRef();return c.useEffect(()=>{r.current=e}),r.current}function Pe(e){var{value:r,highlightUpdates:a,highlightContainer:o}=e,n=Oe(r),s=c.useMemo(()=>!a||n===void 0?!1:typeof r!=typeof n?!0:typeof r=="number"?isNaN(r)&&isNaN(n)?!1:r!==n:Array.isArray(r)!==Array.isArray(n)?!0:typeof r=="object"||typeof r=="function"?!1:r!==n,[a,r]);c.useEffect(()=>{o&&o.current&&s&&"animate"in o.current&&o.current.animate([{backgroundColor:"var(--w-rjv-update-color, #ebcb8b)"},{backgroundColor:""}],{duration:1e3,easing:"ease-in"})},[s,r,o])}var oe=e=>{var{render:r,color:a,value:o,className:n="w-rjv-object-key",keyName:s,highlightUpdates:d,quotes:l,style:v,namespace:f,parentName:m}=e,h=g(e,$e),C=c.useRef(null),b=typeof s=="string"?""+l+s+l:s;return r?r(i({className:n},h,{value:o,namespace:f,style:i({},v,{color:a}),parentName:m,keyName:s,quotes:l,label:s,children:b})):(Pe({value:o,highlightUpdates:d,highlightContainer:C}),t.jsx(I,i({className:n,color:a},h,{ref:C,children:b})))};oe.displayName="JSR.Semicolon";var ze=["style","render","count","level"],be=e=>{var{style:r,render:a,count:o,level:n}=e,s=g(e,ze),d=i({cursor:"pointer"},r),l="w-rjv-ellipsis "+(s.className||"");return a?a(i({style:d,count:o,level:n},s,{className:l})):t.jsx("span",i({className:l,style:d},s,{children:"..."}))};be.displayName="JVR.Ellipsis";var De=["value","keyName","className","displayDataTypes","components","displayObjectSize","enableClipboard","highlightUpdates","objectSortKeys","indentWidth","shortenTextAfterLength","collapsed","level","keyid","quotes","namespace","isSet","isMap","onCopied","onExpand","parentValue","setParentValue"];function Ke(e){try{return Object.keys(e).length}catch{return-1}}var le=e=>{var{children:r}=e;return t.jsxs(I,{style:{paddingLeft:4,fontStyle:"italic"},color:"var(--w-rjv-info-color, #0000004d)",className:"w-rjv-object-size",children:[r," items"]})};le.displayName="JVR.CountInfo";var X=c.forwardRef((e,r)=>{var a,{value:o={},keyName:n,className:s,displayDataTypes:d=!0,components:l={},displayObjectSize:v=!0,enableClipboard:f=!0,highlightUpdates:m=!0,objectSortKeys:h=!1,indentWidth:C=15,shortenTextAfterLength:b=30,collapsed:w,level:p=1,keyid:x="root",quotes:V='"',namespace:L=[],isSet:R=!1,isMap:A=!1,onCopied:U,onExpand:k,parentValue:Z,setParentValue:F}=e,W=g(e,De),N=Array.isArray(o),O=c.useId(),ee=Ze(),j=(a=ee[x])!=null?a:typeof w=="boolean"?w:typeof w=="number"?p<=w:!0,we=()=>{k&&typeof k=="function"&&k({expand:!j,keyid:x,keyName:n,value:o}),j?fe.collapse(x):fe.expand(x)},[M,B]=c.useState(o),ce={components:l,indentWidth:C,displayDataTypes:d,displayObjectSize:v,enableClipboard:f,highlightUpdates:m,onCopied:U,onExpand:k,collapsed:w,parentValue:o,setParentValue:B,quotes:V,level:p+1,style:{paddingLeft:C}},xe={displayDataTypes:d,displayObjectSize:v,enableClipboard:f,shortenTextAfterLength:b,level:p+1,parentValue:o,indentWidth:C,data:M,quotes:V,setValue:B},de={transform:"rotate("+(j?"0":"-90")+"deg)",transition:"all 0.3s"},Le=l.arrow?c.cloneElement(l.arrow,{style:de,"data-expand":j,className:"w-rjv-arrow"}):t.jsx(ie,{style:de,className:"w-rjv-arrow"}),[ve,ue]=c.useState(!1),re={};f&&(re.onMouseEnter=()=>ue(!0),re.onMouseLeave=()=>ue(!1)),c.useEffect(()=>B(o),[o]);var H=N?Object.keys(M).map(S=>Number(S)):Object.keys(M),P=N?Object.entries(M).map(S=>[Number(S[0]),S[1]]):Object.entries(M);h&&(P=h===!0?P.sort((S,J)=>{var[y]=S,[_]=J;return typeof y=="string"&&typeof _=="string"?y.localeCompare(_):0}):P.sort((S,J)=>{var[y]=S,[_]=J;return typeof y=="string"&&typeof _=="string"?h(y,_):0}));var T=t.jsx(le,{children:H.length});l.countInfo&&(T=l.countInfo({count:H.length,level:p,visible:j})||T),v||(T=null);var Ne=l.countInfoExtra&&l.countInfoExtra({count:H.length,level:p,showTools:ve,keyName:n,visible:j,value:M,namespace:[...L],parentValue:Z,setParentValue:F,setValue:B});return t.jsxs("div",i({ref:r},W,{className:s+" w-rjv-inner"},re,{children:[t.jsxs(E,{style:{display:"inline-flex",alignItems:"center"},onClick:we,children:[Le,(typeof n=="string"||typeof n=="number")&&t.jsxs(c.Fragment,{children:[t.jsx(oe,{value:M,quotes:V,"data-keys":x,namespace:[...L],render:l.objectKey,keyName:n,parentName:n,color:typeof n=="number"?q.number.color:""}),t.jsx(G,{})]}),R&&t.jsx(Q,{type:"Set"}),A&&t.jsx(Q,{type:"Map"}),t.jsx($,{start:!0,isArray:N,level:p,render:l.braces}),!j&&t.jsx(be,{render:l.ellipsis,count:H.length,level:p}),!j&&t.jsx($,{isArray:N,level:p,render:l.braces}),T,Ne,f&&t.jsx(ne,{show:ve,text:M,onCopied:U,render:l==null?void 0:l.copied})]}),j&&t.jsx(E,{className:"w-rjv-content",style:{borderLeft:"var(--w-rjv-border-left-width, 1px) var(--w-rjv-line-style, solid) var(--w-rjv-line-color, #ebebeb)",marginLeft:6},children:P.length>0&&[...P].map((S,J)=>{var[y,_]=S,z=_,ae=z instanceof Set,te=z instanceof Map,u=ae?Array.from(z):te?Object.fromEntries(z):z,pe=Array.isArray(u)&&u.length===0||typeof u=="object"&&u&&!(u instanceof Date)&&Object.keys(u).length===0;if((Array.isArray(u)||ae||te)&&!pe){var Y=N?J:y;return t.jsx(E,{className:"w-rjv-wrap",children:t.jsx(X,i({value:u,isSet:ae,isMap:te,namespace:[...L,Y],keyName:Y,keyid:x+O+Y},ce))},Y+J)}if(typeof u=="object"&&u&&!(u instanceof Date)&&!pe)return t.jsx(E,{className:"w-rjv-wrap",children:t.jsx(X,i({value:u,namespace:[...L,y],keyName:y,keyid:x+O+y},ce))},y+""+J);if(typeof u!="function"){var Ce=t.jsx(oe,{value:u,"data-keys":x,quotes:V,namespace:[...L,y],parentName:n,highlightUpdates:m,render:l.objectKey,color:typeof y=="number"?q.number.color:"",keyName:y}),ye=Array.isArray(u)?u.length:Ke(u);return T=t.jsx(le,{children:ye}),l.countInfo&&(T=l.countInfo({count:ye,level:p,visible:j})||T),t.jsx(me,i({components:l,namespace:[...L,y]},xe,{countInfo:T,renderKey:Ce,keyName:y,isSet:R,value:u}),J)}})}),j&&t.jsx(E,{style:{paddingLeft:2},children:t.jsx($,{render:l.braces,isArray:N,level:p,style:{paddingLeft:2,display:"inline-block"}})})]}))});X.displayName="JVR.RootNode";var qe=["value","style","className"],ge=c.forwardRef((e,r)=>{var{value:a,style:o,className:n}=e,s=g(e,qe),d=i({lineHeight:1.4,fontFamily:"var(--w-rjv-font-family, Menlo, monospace)",color:"var(--w-rjv-color, #002b36)",backgroundColor:"var(--w-rjv-background-color, #00000000)",fontSize:13},o),l="w-json-view-container w-rjv "+(n||""),v=c.useId();return t.jsx(X,i({className:l,value:a},s,{ref:r,keyid:v,style:d}))});ge.displayName="JVR.JsonView";var Fe={"--w-rjv-font-family":"monospace","--w-rjv-color":"#002b36","--w-rjv-background-color":"#ffffff","--w-rjv-line-color":"#ebebeb","--w-rjv-arrow-color":"var(--w-rjv-color)","--w-rjv-edit-color":"var(--w-rjv-color)","--w-rjv-info-color":"#0000004d","--w-rjv-update-color":"#ebcb8b","--w-rjv-copied-color":"#002b36","--w-rjv-copied-success-color":"#28a745","--w-rjv-curlybraces-color":"#236a7c","--w-rjv-colon-color":"#002b36","--w-rjv-brackets-color":"#236a7c","--w-rjv-type-string-color":"#cb4b16","--w-rjv-type-int-color":"#268bd2","--w-rjv-type-float-color":"#859900","--w-rjv-type-bigint-color":"#268bd2","--w-rjv-type-boolean-color":"#2aa198","--w-rjv-type-date-color":"#586e75","--w-rjv-type-url-color":"#0969da","--w-rjv-type-null-color":"#d33682","--w-rjv-type-nan-color":"#859900","--w-rjv-type-undefined-color":"#586e75"};const We=({data:e,collapsed:r})=>t.jsx(ge,{value:e,enableClipboard:!0,collapsed:r,components:{arrow:t.jsx(ie,{})},style:Fe}),He=We;export{He as J};