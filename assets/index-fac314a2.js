import{c as w,aU as S,cJ as E,aV as N,cK as B,cL as T,c9 as j,cM as k,r as a,e as x,f as b,cN as W,T as _,cO as I}from"./index-e23f2223.js";const y=e=>e?typeof e=="function"?e():e:null,z=e=>{const{componentCls:o,popoverColor:r,titleMinWidth:t,fontWeightStrong:n,innerPadding:l,boxShadowSecondary:s,colorTextHeading:i,borderRadiusLG:c,zIndexPopup:u,titleMarginBottom:f,colorBgElevated:g,popoverBg:p,titleBorderBottom:d,innerContentPadding:v,titlePadding:m}=e;return[{[o]:Object.assign(Object.assign({},N(e)),{position:"absolute",top:0,left:{_skip_check_:!0,value:0},zIndex:u,fontWeight:"normal",whiteSpace:"normal",textAlign:"start",cursor:"auto",userSelect:"text",transformOrigin:"var(--arrow-x, 50%) var(--arrow-y, 50%)","--antd-arrow-background-color":g,"&-rtl":{direction:"rtl"},"&-hidden":{display:"none"},[`${o}-content`]:{position:"relative"},[`${o}-inner`]:{backgroundColor:p,backgroundClip:"padding-box",borderRadius:c,boxShadow:s,padding:l},[`${o}-title`]:{minWidth:t,marginBottom:f,color:i,fontWeight:n,borderBottom:d,padding:m},[`${o}-inner-content`]:{color:r,padding:v}})},B(e,"var(--antd-arrow-background-color)"),{[`${o}-pure`]:{position:"relative",maxWidth:"none",margin:e.sizePopupArrow,display:"inline-block",[`${o}-content`]:{display:"inline-block"}}}]},M=e=>{const{componentCls:o}=e;return{[o]:T.map(r=>{const t=e[`${r}6`];return{[`&${o}-${r}`]:{"--antd-arrow-background-color":t,[`${o}-inner`]:{backgroundColor:t},[`${o}-arrow`]:{background:"transparent"}}}})}},D=e=>{const{lineWidth:o,controlHeight:r,fontHeight:t,padding:n,wireframe:l,zIndexPopupBase:s,borderRadiusLG:i,marginXS:c,lineType:u,colorSplit:f,paddingSM:g}=e,p=r-t,d=p/2,v=p/2-o,m=n;return Object.assign(Object.assign(Object.assign({titleMinWidth:177,zIndexPopup:s+30},j(e)),k({contentRadius:i,limitVerticalRadius:!0})),{innerPadding:l?0:12,titleMarginBottom:l?0:c,titlePadding:l?`${d}px ${m}px ${v}px`:0,titleBorderBottom:l?`${o}px ${u} ${f}`:"none",innerContentPadding:l?`${g}px ${m}px`:0})},C=w("Popover",e=>{const{colorBgElevated:o,colorText:r}=e,t=S(e,{popoverBg:o,popoverColor:r});return[z(t),M(t),E(t,"zoom-big")]},D,{resetStyle:!1,deprecatedTokens:[["width","titleMinWidth"],["minWidth","titleMinWidth"]]});var R=globalThis&&globalThis.__rest||function(e,o){var r={};for(var t in e)Object.prototype.hasOwnProperty.call(e,t)&&o.indexOf(t)<0&&(r[t]=e[t]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var n=0,t=Object.getOwnPropertySymbols(e);n<t.length;n++)o.indexOf(t[n])<0&&Object.prototype.propertyIsEnumerable.call(e,t[n])&&(r[t[n]]=e[t[n]]);return r};const L=(e,o,r)=>!o&&!r?null:a.createElement(a.Fragment,null,o&&a.createElement("div",{className:`${e}-title`},y(o)),a.createElement("div",{className:`${e}-inner-content`},y(r))),A=e=>{const{hashId:o,prefixCls:r,className:t,style:n,placement:l="top",title:s,content:i,children:c}=e;return a.createElement("div",{className:b(o,r,`${r}-pure`,`${r}-placement-${l}`,t),style:n},a.createElement("div",{className:`${r}-arrow`}),a.createElement(W,Object.assign({},e,{className:o,prefixCls:r}),c||L(r,s,i)))},H=e=>{const{prefixCls:o,className:r}=e,t=R(e,["prefixCls","className"]),{getPrefixCls:n}=a.useContext(x),l=n("popover",o),[s,i,c]=C(l);return s(a.createElement(A,Object.assign({},t,{prefixCls:l,hashId:i,className:b(r,c)})))},V=H;var F=globalThis&&globalThis.__rest||function(e,o){var r={};for(var t in e)Object.prototype.hasOwnProperty.call(e,t)&&o.indexOf(t)<0&&(r[t]=e[t]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var n=0,t=Object.getOwnPropertySymbols(e);n<t.length;n++)o.indexOf(t[n])<0&&Object.prototype.propertyIsEnumerable.call(e,t[n])&&(r[t[n]]=e[t[n]]);return r};const G=e=>{let{title:o,content:r,prefixCls:t}=e;return a.createElement(a.Fragment,null,o&&a.createElement("div",{className:`${t}-title`},y(o)),a.createElement("div",{className:`${t}-inner-content`},y(r)))},P=a.forwardRef((e,o)=>{const{prefixCls:r,title:t,content:n,overlayClassName:l,placement:s="top",trigger:i="hover",mouseEnterDelay:c=.1,mouseLeaveDelay:u=.1,overlayStyle:f={}}=e,g=F(e,["prefixCls","title","content","overlayClassName","placement","trigger","mouseEnterDelay","mouseLeaveDelay","overlayStyle"]),{getPrefixCls:p}=a.useContext(x),d=p("popover",r),[v,m,h]=C(d),O=p(),$=b(l,m,h);return v(a.createElement(_,Object.assign({placement:s,trigger:i,mouseEnterDelay:c,mouseLeaveDelay:u,overlayStyle:f},g,{prefixCls:d,overlayClassName:$,ref:o,overlay:t||n?a.createElement(G,{prefixCls:d,title:t,content:n}):null,transitionName:I(O,"zoom-big",g.transitionName),"data-popover-inject":!0})))});P._InternalPanelDoNotUseOrYouWillBeFired=V;const J=P;export{J as P,V as a,y as g};