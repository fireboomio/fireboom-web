import{f as x,r as c,c as $e,aU as Ce,b4 as Ze,d as m,e as E,o as ee,A as Je,h as Ye,_ as Qe,aV as et,cX as te,ch as Se,cl as tt,Y as je,a3 as me,V as z,aH as P,k as R,j as n,ad as we,Q as B,bS as Y,aq as Q,K as Ne,dP as Oe,g as at,p as st}from"./index-e23f2223.js";import{c as rt}from"./index-34bc28e3.js";import{E as nt}from"./50x-6edc01dd.js";import{u as ot}from"./lock-6df64501.js";import{a as lt,u as it}from"./ServiceDiscovery-59c29267.js";import{M as ct}from"./index-fa478bf1.js";import{S as dt}from"./index-b84acef7.js";import{T as mt}from"./index-9c4cfe1d.js";import{D as J}from"./index-10d51d42.js";import{E as fe}from"./index-7fdf62f6.js";import{P as gt}from"./index-3969b2b7.js";import{S as ut}from"./index-61965600.js";import{D as ht}from"./index-d35cf63a.js";import{C as pt}from"./CopyOutlined-02adc2bc.js";import{E as ft}from"./EditFilled-cbf8324d.js";import"./index-15e5be5a.js";import"./addEventListener-d48fdcc7.js";import"./LeftOutlined-e9646426.js";import"./PurePanel-08b7f9fd.js";import"./PlusOutlined-f92724a5.js";import"./useBreakpoint-b69ed978.js";import"./useForceUpdate-b3b49820.js";import"./index-fac314a2.js";import"./index-ea05c07e.js";const bt=e=>{const{prefixCls:t,className:a,style:s,size:r,shape:l}=e,o=x({[`${t}-lg`]:r==="large",[`${t}-sm`]:r==="small"}),d=x({[`${t}-circle`]:l==="circle",[`${t}-square`]:l==="square",[`${t}-round`]:l==="round"}),i=c.useMemo(()=>typeof r=="number"?{width:r,height:r,lineHeight:`${r}px`}:{},[r]);return c.createElement("span",{className:x(t,o,d,a),style:Object.assign(Object.assign({},i),s)})},ae=bt,xt=new Ze("ant-skeleton-loading",{"0%":{backgroundPosition:"100% 50%"},"100%":{backgroundPosition:"0 50%"}}),se=e=>({height:e,lineHeight:m(e)}),W=e=>Object.assign({width:e},se(e)),vt=e=>({background:e.skeletonLoadingBackground,backgroundSize:"400% 100%",animationName:xt,animationDuration:e.skeletonLoadingMotionDuration,animationTimingFunction:"ease",animationIterationCount:"infinite"}),oe=(e,t)=>Object.assign({width:t(e).mul(5).equal(),minWidth:t(e).mul(5).equal()},se(e)),yt=e=>{const{skeletonAvatarCls:t,gradientFromColor:a,controlHeight:s,controlHeightLG:r,controlHeightSM:l}=e;return{[`${t}`]:Object.assign({display:"inline-block",verticalAlign:"top",background:a},W(s)),[`${t}${t}-circle`]:{borderRadius:"50%"},[`${t}${t}-lg`]:Object.assign({},W(r)),[`${t}${t}-sm`]:Object.assign({},W(l))}},$t=e=>{const{controlHeight:t,borderRadiusSM:a,skeletonInputCls:s,controlHeightLG:r,controlHeightSM:l,gradientFromColor:o,calc:d}=e;return{[`${s}`]:Object.assign({display:"inline-block",verticalAlign:"top",background:o,borderRadius:a},oe(t,d)),[`${s}-lg`]:Object.assign({},oe(r,d)),[`${s}-sm`]:Object.assign({},oe(l,d))}},be=e=>Object.assign({width:e},se(e)),Ct=e=>{const{skeletonImageCls:t,imageSizeBase:a,gradientFromColor:s,borderRadiusSM:r,calc:l}=e;return{[`${t}`]:Object.assign(Object.assign({display:"flex",alignItems:"center",justifyContent:"center",verticalAlign:"top",background:s,borderRadius:r},be(l(a).mul(2).equal())),{[`${t}-path`]:{fill:"#bfbfbf"},[`${t}-svg`]:Object.assign(Object.assign({},be(a)),{maxWidth:l(a).mul(4).equal(),maxHeight:l(a).mul(4).equal()}),[`${t}-svg${t}-svg-circle`]:{borderRadius:"50%"}}),[`${t}${t}-circle`]:{borderRadius:"50%"}}},le=(e,t,a)=>{const{skeletonButtonCls:s}=e;return{[`${a}${s}-circle`]:{width:t,minWidth:t,borderRadius:"50%"},[`${a}${s}-round`]:{borderRadius:t}}},ie=(e,t)=>Object.assign({width:t(e).mul(2).equal(),minWidth:t(e).mul(2).equal()},se(e)),St=e=>{const{borderRadiusSM:t,skeletonButtonCls:a,controlHeight:s,controlHeightLG:r,controlHeightSM:l,gradientFromColor:o,calc:d}=e;return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({[`${a}`]:Object.assign({display:"inline-block",verticalAlign:"top",background:o,borderRadius:t,width:d(s).mul(2).equal(),minWidth:d(s).mul(2).equal()},ie(s,d))},le(e,s,a)),{[`${a}-lg`]:Object.assign({},ie(r,d))}),le(e,r,`${a}-lg`)),{[`${a}-sm`]:Object.assign({},ie(l,d))}),le(e,l,`${a}-sm`))},jt=e=>{const{componentCls:t,skeletonAvatarCls:a,skeletonTitleCls:s,skeletonParagraphCls:r,skeletonButtonCls:l,skeletonInputCls:o,skeletonImageCls:d,controlHeight:i,controlHeightLG:p,controlHeightSM:g,gradientFromColor:f,padding:v,marginSM:y,borderRadius:b,titleHeight:u,blockRadius:h,paragraphLiHeight:S,controlHeightXS:w,paragraphMarginTop:A}=e;return{[`${t}`]:{display:"table",width:"100%",[`${t}-header`]:{display:"table-cell",paddingInlineEnd:v,verticalAlign:"top",[`${a}`]:Object.assign({display:"inline-block",verticalAlign:"top",background:f},W(i)),[`${a}-circle`]:{borderRadius:"50%"},[`${a}-lg`]:Object.assign({},W(p)),[`${a}-sm`]:Object.assign({},W(g))},[`${t}-content`]:{display:"table-cell",width:"100%",verticalAlign:"top",[`${s}`]:{width:"100%",height:u,background:f,borderRadius:h,[`+ ${r}`]:{marginBlockStart:g}},[`${r}`]:{padding:0,"> li":{width:"100%",height:S,listStyle:"none",background:f,borderRadius:h,"+ li":{marginBlockStart:w}}},[`${r}> li:last-child:not(:first-child):not(:nth-child(2))`]:{width:"61%"}},[`&-round ${t}-content`]:{[`${s}, ${r} > li`]:{borderRadius:b}}},[`${t}-with-avatar ${t}-content`]:{[`${s}`]:{marginBlockStart:y,[`+ ${r}`]:{marginBlockStart:A}}},[`${t}${t}-element`]:Object.assign(Object.assign(Object.assign(Object.assign({display:"inline-block",width:"auto"},St(e)),yt(e)),$t(e)),Ct(e)),[`${t}${t}-block`]:{width:"100%",[`${l}`]:{width:"100%"},[`${o}`]:{width:"100%"}},[`${t}${t}-active`]:{[`
        ${s},
        ${r} > li,
        ${a},
        ${l},
        ${o},
        ${d}
      `]:Object.assign({},vt(e))}}},wt=e=>{const{colorFillContent:t,colorFill:a}=e,s=t,r=a;return{color:s,colorGradientEnd:r,gradientFromColor:s,gradientToColor:r,titleHeight:e.controlHeight/2,blockRadius:e.borderRadiusSM,paragraphMarginTop:e.marginLG+e.marginXXS,paragraphLiHeight:e.controlHeight/2}},q=$e("Skeleton",e=>{const{componentCls:t,calc:a}=e,s=Ce(e,{skeletonAvatarCls:`${t}-avatar`,skeletonTitleCls:`${t}-title`,skeletonParagraphCls:`${t}-paragraph`,skeletonButtonCls:`${t}-button`,skeletonInputCls:`${t}-input`,skeletonImageCls:`${t}-image`,imageSizeBase:a(e.controlHeight).mul(1.5).equal(),borderRadius:100,skeletonLoadingBackground:`linear-gradient(90deg, ${e.gradientFromColor} 25%, ${e.gradientToColor} 37%, ${e.gradientFromColor} 63%)`,skeletonLoadingMotionDuration:"1.4s"});return[jt(s)]},wt,{deprecatedTokens:[["color","gradientFromColor"],["colorGradientEnd","gradientToColor"]]}),Nt=e=>{const{prefixCls:t,className:a,rootClassName:s,active:r,shape:l="circle",size:o="default"}=e,{getPrefixCls:d}=c.useContext(E),i=d("skeleton",t),[p,g,f]=q(i),v=ee(e,["prefixCls","className"]),y=x(i,`${i}-element`,{[`${i}-active`]:r},a,s,g,f);return p(c.createElement("div",{className:y},c.createElement(ae,Object.assign({prefixCls:`${i}-avatar`,shape:l,size:o},v))))},Ot=Nt,Mt=e=>{const{prefixCls:t,className:a,rootClassName:s,active:r,block:l=!1,size:o="default"}=e,{getPrefixCls:d}=c.useContext(E),i=d("skeleton",t),[p,g,f]=q(i),v=ee(e,["prefixCls"]),y=x(i,`${i}-element`,{[`${i}-active`]:r,[`${i}-block`]:l},a,s,g,f);return p(c.createElement("div",{className:y},c.createElement(ae,Object.assign({prefixCls:`${i}-button`,size:o},v))))},At=Mt,Et="M365.714286 329.142857q0 45.714286-32.036571 77.677714t-77.677714 32.036571-77.677714-32.036571-32.036571-77.677714 32.036571-77.677714 77.677714-32.036571 77.677714 32.036571 32.036571 77.677714zM950.857143 548.571429l0 256-804.571429 0 0-109.714286 182.857143-182.857143 91.428571 91.428571 292.571429-292.571429zM1005.714286 146.285714l-914.285714 0q-7.460571 0-12.873143 5.412571t-5.412571 12.873143l0 694.857143q0 7.460571 5.412571 12.873143t12.873143 5.412571l914.285714 0q7.460571 0 12.873143-5.412571t5.412571-12.873143l0-694.857143q0-7.460571-5.412571-12.873143t-12.873143-5.412571zM1097.142857 164.571429l0 694.857143q0 37.741714-26.843429 64.585143t-64.585143 26.843429l-914.285714 0q-37.741714 0-64.585143-26.843429t-26.843429-64.585143l0-694.857143q0-37.741714 26.843429-64.585143t64.585143-26.843429l914.285714 0q37.741714 0 64.585143 26.843429t26.843429 64.585143z",Bt=e=>{const{prefixCls:t,className:a,rootClassName:s,style:r,active:l}=e,{getPrefixCls:o}=c.useContext(E),d=o("skeleton",t),[i,p,g]=q(d),f=x(d,`${d}-element`,{[`${d}-active`]:l},a,s,p,g);return i(c.createElement("div",{className:f},c.createElement("div",{className:x(`${d}-image`,a),style:r},c.createElement("svg",{viewBox:"0 0 1098 1024",xmlns:"http://www.w3.org/2000/svg",className:`${d}-image-svg`},c.createElement("path",{d:Et,className:`${d}-image-path`})))))},Pt=Bt,zt=e=>{const{prefixCls:t,className:a,rootClassName:s,active:r,block:l,size:o="default"}=e,{getPrefixCls:d}=c.useContext(E),i=d("skeleton",t),[p,g,f]=q(i),v=ee(e,["prefixCls"]),y=x(i,`${i}-element`,{[`${i}-active`]:r,[`${i}-block`]:l},a,s,g,f);return p(c.createElement("div",{className:y},c.createElement(ae,Object.assign({prefixCls:`${i}-input`,size:o},v))))},Rt=zt;var Tt={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M888 792H200V168c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v688c0 4.4 3.6 8 8 8h752c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM288 604a64 64 0 10128 0 64 64 0 10-128 0zm118-224a48 48 0 1096 0 48 48 0 10-96 0zm158 228a96 96 0 10192 0 96 96 0 10-192 0zm148-314a56 56 0 10112 0 56 56 0 10-112 0z"}}]},name:"dot-chart",theme:"outlined"};const It=Tt;var Lt=function(t,a){return c.createElement(Je,Ye({},t,{ref:a,icon:It}))},Ht=c.forwardRef(Lt);const Ft=Ht,Dt=e=>{const{prefixCls:t,className:a,rootClassName:s,style:r,active:l,children:o}=e,{getPrefixCls:d}=c.useContext(E),i=d("skeleton",t),[p,g,f]=q(i),v=x(i,`${i}-element`,{[`${i}-active`]:l},g,a,s,f),y=o??c.createElement(Ft,null);return p(c.createElement("div",{className:v},c.createElement("div",{className:x(`${i}-image`,a),style:r},y)))},Gt=Dt,Wt=(e,t)=>{const{width:a,rows:s=2}=t;if(Array.isArray(a))return a[e];if(s-1===e)return a},qt=e=>{const{prefixCls:t,className:a,style:s,rows:r}=e,l=Qe(Array(r)).map((o,d)=>c.createElement("li",{key:d,style:{width:Wt(d,e)}}));return c.createElement("ul",{className:x(t,a),style:s},l)},_t=qt,Vt=e=>{let{prefixCls:t,className:a,width:s,style:r}=e;return c.createElement("h3",{className:x(t,a),style:Object.assign({width:s},r)})},Kt=Vt;function ce(e){return e&&typeof e=="object"?e:{}}function Ut(e,t){return e&&!t?{size:"large",shape:"square"}:{size:"large",shape:"circle"}}function kt(e,t){return!e&&t?{width:"38%"}:e&&t?{width:"50%"}:{}}function Xt(e,t){const a={};return(!e||!t)&&(a.width="61%"),!e&&t?a.rows=3:a.rows=2,a}const _=e=>{const{prefixCls:t,loading:a,className:s,rootClassName:r,style:l,children:o,avatar:d=!1,title:i=!0,paragraph:p=!0,active:g,round:f}=e,{getPrefixCls:v,direction:y,skeleton:b}=c.useContext(E),u=v("skeleton",t),[h,S,w]=q(u);if(a||!("loading"in e)){const A=!!d,T=!!i,I=!!p;let X;if(A){const H=Object.assign(Object.assign({prefixCls:`${u}-avatar`},Ut(T,I)),ce(d));X=c.createElement("div",{className:`${u}-header`},c.createElement(ae,Object.assign({},H)))}let L;if(T||I){let H;if(T){const K=Object.assign(Object.assign({prefixCls:`${u}-title`},kt(A,I)),ce(i));H=c.createElement(Kt,Object.assign({},K))}let Z;if(I){const K=Object.assign(Object.assign({prefixCls:`${u}-paragraph`},Xt(A,T)),ce(p));Z=c.createElement(_t,Object.assign({},K))}L=c.createElement("div",{className:`${u}-content`},H,Z)}const V=x(u,{[`${u}-with-avatar`]:A,[`${u}-active`]:g,[`${u}-rtl`]:y==="rtl",[`${u}-round`]:f},b==null?void 0:b.className,s,r,S,w);return h(c.createElement("div",{className:V,style:Object.assign(Object.assign({},b==null?void 0:b.style),l)},X,L))}return o??null};_.Button=At;_.Avatar=Ot;_.Input=Rt;_.Image=Pt;_.Node=Gt;const Zt=_;var Jt=globalThis&&globalThis.__rest||function(e,t){var a={};for(var s in e)Object.prototype.hasOwnProperty.call(e,s)&&t.indexOf(s)<0&&(a[s]=e[s]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var r=0,s=Object.getOwnPropertySymbols(e);r<s.length;r++)t.indexOf(s[r])<0&&Object.prototype.propertyIsEnumerable.call(e,s[r])&&(a[s[r]]=e[s[r]]);return a};const Yt=e=>{var{prefixCls:t,className:a,hoverable:s=!0}=e,r=Jt(e,["prefixCls","className","hoverable"]);const{getPrefixCls:l}=c.useContext(E),o=l("card",t),d=x(`${o}-grid`,a,{[`${o}-grid-hoverable`]:s});return c.createElement("div",Object.assign({},r,{className:d}))},Me=Yt,Qt=e=>{const{antCls:t,componentCls:a,headerHeight:s,cardPaddingBase:r,tabsMarginBottom:l}=e;return Object.assign(Object.assign({display:"flex",justifyContent:"center",flexDirection:"column",minHeight:s,marginBottom:-1,padding:`0 ${m(r)}`,color:e.colorTextHeading,fontWeight:e.fontWeightStrong,fontSize:e.headerFontSize,background:e.headerBg,borderBottom:`${m(e.lineWidth)} ${e.lineType} ${e.colorBorderSecondary}`,borderRadius:`${m(e.borderRadiusLG)} ${m(e.borderRadiusLG)} 0 0`},te()),{"&-wrapper":{width:"100%",display:"flex",alignItems:"center"},"&-title":Object.assign(Object.assign({display:"inline-block",flex:1},Se),{[`
          > ${a}-typography,
          > ${a}-typography-edit-content
        `]:{insetInlineStart:0,marginTop:0,marginBottom:0}}),[`${t}-tabs-top`]:{clear:"both",marginBottom:l,color:e.colorText,fontWeight:"normal",fontSize:e.fontSize,"&-bar":{borderBottom:`${m(e.lineWidth)} ${e.lineType} ${e.colorBorderSecondary}`}}})},ea=e=>{const{cardPaddingBase:t,colorBorderSecondary:a,cardShadow:s,lineWidth:r}=e;return{width:"33.33%",padding:t,border:0,borderRadius:0,boxShadow:`
      ${m(r)} 0 0 0 ${a},
      0 ${m(r)} 0 0 ${a},
      ${m(r)} ${m(r)} 0 0 ${a},
      ${m(r)} 0 0 0 ${a} inset,
      0 ${m(r)} 0 0 ${a} inset;
    `,transition:`all ${e.motionDurationMid}`,"&-hoverable:hover":{position:"relative",zIndex:1,boxShadow:s}}},ta=e=>{const{componentCls:t,iconCls:a,actionsLiMargin:s,cardActionsIconSize:r,colorBorderSecondary:l,actionsBg:o}=e;return Object.assign(Object.assign({margin:0,padding:0,listStyle:"none",background:o,borderTop:`${m(e.lineWidth)} ${e.lineType} ${l}`,display:"flex",borderRadius:`0 0 ${m(e.borderRadiusLG)} ${m(e.borderRadiusLG)}`},te()),{"& > li":{margin:s,color:e.colorTextDescription,textAlign:"center","> span":{position:"relative",display:"block",minWidth:e.calc(e.cardActionsIconSize).mul(2).equal(),fontSize:e.fontSize,lineHeight:e.lineHeight,cursor:"pointer","&:hover":{color:e.colorPrimary,transition:`color ${e.motionDurationMid}`},[`a:not(${t}-btn), > ${a}`]:{display:"inline-block",width:"100%",color:e.colorTextDescription,lineHeight:m(e.fontHeight),transition:`color ${e.motionDurationMid}`,"&:hover":{color:e.colorPrimary}},[`> ${a}`]:{fontSize:r,lineHeight:m(e.calc(r).mul(e.lineHeight).equal())}},"&:not(:last-child)":{borderInlineEnd:`${m(e.lineWidth)} ${e.lineType} ${l}`}}})},aa=e=>Object.assign(Object.assign({margin:`${m(e.calc(e.marginXXS).mul(-1).equal())} 0`,display:"flex"},te()),{"&-avatar":{paddingInlineEnd:e.padding},"&-detail":{overflow:"hidden",flex:1,"> div:not(:last-child)":{marginBottom:e.marginXS}},"&-title":Object.assign({color:e.colorTextHeading,fontWeight:e.fontWeightStrong,fontSize:e.fontSizeLG},Se),"&-description":{color:e.colorTextDescription}}),sa=e=>{const{componentCls:t,cardPaddingBase:a,colorFillAlter:s}=e;return{[`${t}-head`]:{padding:`0 ${m(a)}`,background:s,"&-title":{fontSize:e.fontSize}},[`${t}-body`]:{padding:`${m(e.padding)} ${m(a)}`}}},ra=e=>{const{componentCls:t}=e;return{overflow:"hidden",[`${t}-body`]:{userSelect:"none"}}},na=e=>{const{antCls:t,componentCls:a,cardShadow:s,cardHeadPadding:r,colorBorderSecondary:l,boxShadowTertiary:o,cardPaddingBase:d,extraColor:i}=e;return{[a]:Object.assign(Object.assign({},et(e)),{position:"relative",background:e.colorBgContainer,borderRadius:e.borderRadiusLG,[`&:not(${a}-bordered)`]:{boxShadow:o},[`${a}-head`]:Qt(e),[`${a}-extra`]:{marginInlineStart:"auto",color:i,fontWeight:"normal",fontSize:e.fontSize},[`${a}-body`]:Object.assign({padding:d,borderRadius:` 0 0 ${m(e.borderRadiusLG)} ${m(e.borderRadiusLG)}`},te()),[`${a}-grid`]:ea(e),[`${a}-cover`]:{"> *":{display:"block",width:"100%"},[`img, img + ${t}-image-mask`]:{borderRadius:`${m(e.borderRadiusLG)} ${m(e.borderRadiusLG)} 0 0`}},[`${a}-actions`]:ta(e),[`${a}-meta`]:aa(e)}),[`${a}-bordered`]:{border:`${m(e.lineWidth)} ${e.lineType} ${l}`,[`${a}-cover`]:{marginTop:-1,marginInlineStart:-1,marginInlineEnd:-1}},[`${a}-hoverable`]:{cursor:"pointer",transition:`box-shadow ${e.motionDurationMid}, border-color ${e.motionDurationMid}`,"&:hover":{borderColor:"transparent",boxShadow:s}},[`${a}-contain-grid`]:{borderRadius:`${m(e.borderRadiusLG)} ${m(e.borderRadiusLG)} 0 0 `,[`${a}-body`]:{display:"flex",flexWrap:"wrap"},[`&:not(${a}-loading) ${a}-body`]:{marginBlockStart:e.calc(e.lineWidth).mul(-1).equal(),marginInlineStart:e.calc(e.lineWidth).mul(-1).equal(),padding:0}},[`${a}-contain-tabs`]:{[`> ${a}-head`]:{minHeight:0,[`${a}-head-title, ${a}-extra`]:{paddingTop:r}}},[`${a}-type-inner`]:sa(e),[`${a}-loading`]:ra(e),[`${a}-rtl`]:{direction:"rtl"}}},oa=e=>{const{componentCls:t,cardPaddingSM:a,headerHeightSM:s,headerFontSizeSM:r}=e;return{[`${t}-small`]:{[`> ${t}-head`]:{minHeight:s,padding:`0 ${m(a)}`,fontSize:r,[`> ${t}-head-wrapper`]:{[`> ${t}-extra`]:{fontSize:e.fontSize}}},[`> ${t}-body`]:{padding:a}},[`${t}-small${t}-contain-tabs`]:{[`> ${t}-head`]:{[`${t}-head-title, ${t}-extra`]:{paddingTop:0,display:"flex",alignItems:"center"}}}}},la=e=>({headerBg:"transparent",headerFontSize:e.fontSizeLG,headerFontSizeSM:e.fontSize,headerHeight:e.fontSizeLG*e.lineHeightLG+e.padding*2,headerHeightSM:e.fontSize*e.lineHeight+e.paddingXS*2,actionsBg:e.colorBgContainer,actionsLiMargin:`${e.paddingSM}px 0`,tabsMarginBottom:-e.padding-e.lineWidth,extraColor:e.colorText}),ia=$e("Card",e=>{const t=Ce(e,{cardShadow:e.boxShadowCard,cardHeadPadding:e.padding,cardPaddingBase:e.paddingLG,cardActionsIconSize:e.fontSize,cardPaddingSM:12});return[na(t),oa(t)]},la);var xe=globalThis&&globalThis.__rest||function(e,t){var a={};for(var s in e)Object.prototype.hasOwnProperty.call(e,s)&&t.indexOf(s)<0&&(a[s]=e[s]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var r=0,s=Object.getOwnPropertySymbols(e);r<s.length;r++)t.indexOf(s[r])<0&&Object.prototype.propertyIsEnumerable.call(e,s[r])&&(a[s[r]]=e[s[r]]);return a};const ca=e=>{const{actionClasses:t,actions:a=[],actionStyle:s}=e;return c.createElement("ul",{className:t,style:s},a.map((r,l)=>{const o=`action-${l}`;return c.createElement("li",{style:{width:`${100/a.length}%`},key:o},c.createElement("span",null,r))}))},da=c.forwardRef((e,t)=>{const{prefixCls:a,className:s,rootClassName:r,style:l,extra:o,headStyle:d={},bodyStyle:i={},title:p,loading:g,bordered:f=!0,size:v,type:y,cover:b,actions:u,tabList:h,children:S,activeTabKey:w,defaultActiveTabKey:A,tabBarExtraContent:T,hoverable:I,tabProps:X={},classNames:L,styles:V}=e,H=xe(e,["prefixCls","className","rootClassName","style","extra","headStyle","bodyStyle","title","loading","bordered","size","type","cover","actions","tabList","children","activeTabKey","defaultActiveTabKey","tabBarExtraContent","hoverable","tabProps","classNames","styles"]),{getPrefixCls:Z,direction:K,card:N}=c.useContext(E),Be=j=>{var $;($=e.onTabChange)===null||$===void 0||$.call(e,j)},F=j=>{var $;return x(($=N==null?void 0:N.classNames)===null||$===void 0?void 0:$[j],L==null?void 0:L[j])},D=j=>{var $;return Object.assign(Object.assign({},($=N==null?void 0:N.styles)===null||$===void 0?void 0:$[j]),V==null?void 0:V[j])},Pe=c.useMemo(()=>{let j=!1;return c.Children.forEach(S,$=>{$&&$.type&&$.type===Me&&(j=!0)}),j},[S]),C=Z("card",a),[ze,Re,Te]=ia(C),Ie=c.createElement(Zt,{loading:!0,active:!0,paragraph:{rows:4},title:!1},S),ue=w!==void 0,Le=Object.assign(Object.assign({},X),{[ue?"activeKey":"defaultActiveKey"]:ue?w:A,tabBarExtraContent:T});let he;const U=tt(v),He=!U||U==="default"?"large":U,pe=h?c.createElement(mt,Object.assign({size:He},Le,{className:`${C}-head-tabs`,onChange:Be,items:h.map(j=>{var{tab:$}=j,ne=xe(j,["tab"]);return Object.assign({label:$},ne)})})):null;if(p||o||pe){const j=x(`${C}-head`,F("header")),$=x(`${C}-head-title`,F("title")),ne=x(`${C}-extra`,F("extra")),Xe=Object.assign(Object.assign({},d),D("header"));he=c.createElement("div",{className:j,style:Xe},c.createElement("div",{className:`${C}-head-wrapper`},p&&c.createElement("div",{className:$,style:D("title")},p),o&&c.createElement("div",{className:ne,style:D("extra")},o)),pe)}const Fe=x(`${C}-cover`,F("cover")),De=b?c.createElement("div",{className:Fe,style:D("cover")},b):null,Ge=x(`${C}-body`,F("body")),We=Object.assign(Object.assign({},i),D("body")),qe=c.createElement("div",{className:Ge,style:We},g?Ie:S),_e=x(`${C}-actions`,F("actions")),Ve=u&&u.length?c.createElement(ca,{actionClasses:_e,actionStyle:D("actions"),actions:u}):null,Ke=ee(H,["onTabChange"]),Ue=x(C,N==null?void 0:N.className,{[`${C}-loading`]:g,[`${C}-bordered`]:f,[`${C}-hoverable`]:I,[`${C}-contain-grid`]:Pe,[`${C}-contain-tabs`]:h&&h.length,[`${C}-${U}`]:U,[`${C}-type-${y}`]:!!y,[`${C}-rtl`]:K==="rtl"},s,r,Re,Te),ke=Object.assign(Object.assign({},N==null?void 0:N.style),l);return ze(c.createElement("div",Object.assign({ref:t},Ke,{className:Ue,style:ke}),he,De,qe,Ve))}),ma=da;var ga=globalThis&&globalThis.__rest||function(e,t){var a={};for(var s in e)Object.prototype.hasOwnProperty.call(e,s)&&t.indexOf(s)<0&&(a[s]=e[s]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var r=0,s=Object.getOwnPropertySymbols(e);r<s.length;r++)t.indexOf(s[r])<0&&Object.prototype.propertyIsEnumerable.call(e,s[r])&&(a[s[r]]=e[s[r]]);return a};const ua=e=>{const{prefixCls:t,className:a,avatar:s,title:r,description:l}=e,o=ga(e,["prefixCls","className","avatar","title","description"]),{getPrefixCls:d}=c.useContext(E),i=d("card",t),p=x(`${i}-meta`,a),g=s?c.createElement("div",{className:`${i}-meta-avatar`},s):null,f=r?c.createElement("div",{className:`${i}-meta-title`},r):null,v=l?c.createElement("div",{className:`${i}-meta-description`},l):null,y=f||v?c.createElement("div",{className:`${i}-meta-detail`},f,v):null;return c.createElement("div",Object.assign({},o,{className:p}),g,y)},ha=ua,ge=ma;ge.Grid=Me;ge.Meta=ha;const Ae=ge;var re={};re.byteLength=ba;re.toByteArray=va;re.fromByteArray=Ca;var M=[],O=[],pa=typeof Uint8Array<"u"?Uint8Array:Array,de="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";for(var G=0,fa=de.length;G<fa;++G)M[G]=de[G],O[de.charCodeAt(G)]=G;O["-".charCodeAt(0)]=62;O["_".charCodeAt(0)]=63;function Ee(e){var t=e.length;if(t%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var a=e.indexOf("=");a===-1&&(a=t);var s=a===t?0:4-a%4;return[a,s]}function ba(e){var t=Ee(e),a=t[0],s=t[1];return(a+s)*3/4-s}function xa(e,t,a){return(t+a)*3/4-a}function va(e){var t,a=Ee(e),s=a[0],r=a[1],l=new pa(xa(e,s,r)),o=0,d=r>0?s-4:s,i;for(i=0;i<d;i+=4)t=O[e.charCodeAt(i)]<<18|O[e.charCodeAt(i+1)]<<12|O[e.charCodeAt(i+2)]<<6|O[e.charCodeAt(i+3)],l[o++]=t>>16&255,l[o++]=t>>8&255,l[o++]=t&255;return r===2&&(t=O[e.charCodeAt(i)]<<2|O[e.charCodeAt(i+1)]>>4,l[o++]=t&255),r===1&&(t=O[e.charCodeAt(i)]<<10|O[e.charCodeAt(i+1)]<<4|O[e.charCodeAt(i+2)]>>2,l[o++]=t>>8&255,l[o++]=t&255),l}function ya(e){return M[e>>18&63]+M[e>>12&63]+M[e>>6&63]+M[e&63]}function $a(e,t,a){for(var s,r=[],l=t;l<a;l+=3)s=(e[l]<<16&16711680)+(e[l+1]<<8&65280)+(e[l+2]&255),r.push(ya(s));return r.join("")}function Ca(e){for(var t,a=e.length,s=a%3,r=[],l=16383,o=0,d=a-s;o<d;o+=l)r.push($a(e,o,o+l>d?d:o+l));return s===1?(t=e[a-1],r.push(M[t>>2]+M[t<<4&63]+"==")):s===2&&(t=(e[a-2]<<8)+e[a-1],r.push(M[t>>10]+M[t>>4&63]+M[t<<2&63]+"=")),r.join("")}const Sa="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAXVBMVEUAAAD29v/19vj09vj09vj19fj19fj19fj19fj29vj09vgzMzPv8PKhoqOFhYZmZmZCQkLCw8Xx8vTr7O7Nzs/AwcO2t7ioqKqcnZ6VlZZ2dnd0dHVVVVVGRkc9PT2jobaUAAAACnRSTlMAG/Py2baba05un7UgfgAAAJJJREFUKM91UtcSwzAIA8cjEV3p3v//mb32HMolRk/WyRZGQBVcUgwhpsJkwRmKbKS+g0HXU8WAGYZ6v9LVZjvW4+8NTz5rkd3k9q2TsRSQiRj4W52UMBU0USi1hUTRWo1KIgW0iiO4gmvlFne/axo8PJ5nJWwiuYq8NRIb4kXkpSHa2Pe3+1Fj9wblj9ZfBnd9Pk2YEmQ3bGOFAAAAAElFTkSuQmCC",ja="_download_gb3yo_1",wa="_remoteCard_gb3yo_10",Na="_icon_gb3yo_13",Oa="_btn_gb3yo_24",Ma="_descLine_gb3yo_35",k={download:ja,remoteCard:wa,icon:Na,btn:Oa,descLine:Ma},Aa=({sdks:e,onUpdate:t,actionRef:a})=>{const{getRepositoryUrl:s}=lt(),{initialize:r}=je(),[l,o]=c.useState(!1),{data:d,isValidating:i,error:p,mutate:g}=it("sdks.json"),{remoteServer:f,remoteClient:v}=c.useMemo(()=>{const h=[],S=[];return d!=null&&d.official&&d.official.forEach(w=>{w.type==="server"?h.push(w):S.push(w)}),{remoteServer:h,remoteClient:S}},[d]),y=c.useMemo(()=>new Set((e==null?void 0:e.map(h=>h.dirName))??[]),[e]),{loading:b,fun:u}=ot(async h=>{const S=s(h.gitUrl),w=z.loading(P.formatMessage({id:"/cqdKk",defaultMessage:[{type:0,value:"下载"}]}),-1);try{await R.post("/sdk",{...h,gitUrl:S}),t(),r(),me("/sdk/enabledServer"),z.success(P.formatMessage({id:"WJWR3q",defaultMessage:[{type:0,value:"下载成功"}]}))}catch{z.error(P.formatMessage({id:"eJ2viL",defaultMessage:[{type:0,value:"下载失败"}]}))}w()},[me]);return c.useEffect(()=>{a&&(a.current={show:()=>{o(!0),g()}})},[a,g]),n.jsxs(ct,{width:"80vw",footer:null,open:l,onCancel:()=>o(!1),title:n.jsx("div",{className:"text-center",children:P.formatMessage({id:"DAKKuk",defaultMessage:[{type:0,value:"模版市场"}]})}),styles:{body:{minHeight:"60vh"}},children:[i?n.jsx("div",{className:"flex h-40vh w-full items-center justify-center",children:n.jsx(dt,{tip:"Loading",size:"large"})}):null,!i&&p?n.jsxs("div",{className:"flex flex-col h-40vh w-full items-center justify-center",children:[n.jsx(nt,{}),n.jsx(we,{onClick:()=>{g()},children:P.formatMessage({id:"pR5Kts",defaultMessage:[{type:0,value:"重试"}]})})]}):null,!i&&!p&&n.jsxs("div",{children:[n.jsx("div",{className:"text-xs  mb-4 text-[#666]",children:n.jsx(B,{id:"p5GCek",defaultMessage:[{type:0,value:"钩子模版"}]})}),n.jsx(Y,{className:"",gutter:[32,32],children:f==null?void 0:f.map((h,S)=>n.jsx(Q,{xl:8,xxl:6,md:12,children:n.jsx(ve,{exist:y.has(h.name),sdk:h,onSelect:()=>{u(h)}})},S))}),n.jsx("div",{className:"text-xs  mb-4 mt-8 text-[#666]",children:n.jsx(B,{id:"gRp6eK",defaultMessage:[{type:0,value:"客户端模版"}]})}),n.jsx(Y,{className:"",gutter:[32,32],children:v==null?void 0:v.map((h,S)=>n.jsx(Q,{xl:8,xxl:6,md:12,children:n.jsx(ve,{exist:y.has(h.name),sdk:h,onSelect:()=>{u(h)}})},S))})]})]})},ve=({onSelect:e,sdk:t,exist:a})=>{const s=Ne();return n.jsxs(Ae,{title:n.jsxs("div",{className:"flex items-center",children:[n.jsx("img",{alt:"",className:k.icon,src:t.icon.startsWith("http")?t.icon:`data:image/svg+xml;base64,${base64.fromByteArray(new TextEncoder().encode(`${t.icon}`))}`}),t.title]}),className:k.remoteCard,extra:a?n.jsx("div",{className:"text-[#787D8B]",children:"已下载"}):null,children:[n.jsxs(J,{size:"small",column:1,labelStyle:{width:100},contentStyle:{color:"#787D8B"},children:[n.jsx(J.Item,{label:s.formatMessage({id:"jiM9+b",defaultMessage:[{type:0,value:"模板ID"}]}),children:t.name}),n.jsx(J.Item,{label:s.formatMessage({id:"Ph2Nn+",defaultMessage:[{type:0,value:"功能描述"}]}),children:n.jsx("div",{className:k.descLine,children:t.description})}),n.jsx(J.Item,{label:s.formatMessage({id:"Zlo7bL",defaultMessage:[{type:0,value:"生成路径"}]}),children:t.outputPath})]}),a?null:n.jsx("div",{className:k.download,children:n.jsx("div",{className:k.btn,onClick:e,children:"点击下载"})})]})},ts=()=>{const{data:e,mutate:t}=Oe("/sdk",R.get),a=c.useRef(),{server:s,client:r}=c.useMemo(()=>{const o=[],d=[];return e&&e.forEach(i=>{i.type==="server"?o.push(i):d.push(i)}),{server:o,client:d}},[e]),l=(o,d)=>{t([...e.slice(0,o-2),d,...e.slice(o-1)])};return n.jsxs(Ae,{children:[n.jsxs("div",{className:"flex mb-4 items-center",children:[n.jsx("div",{className:"text-base t-medium",children:n.jsx(B,{id:"hw2IgW",defaultMessage:[{type:0,value:"模版仓库"}]})}),n.jsx("div",{className:"flex-1"}),n.jsx(we,{onClick:()=>{var o;(o=a.current)==null||o.show()},children:P.formatMessage({id:"t9OiGA",defaultMessage:[{type:0,value:"浏览模版市场"}]})})]}),n.jsxs("div",{className:"flex mb-4 items-center",children:[n.jsx("div",{className:"text-xs text-[#666]",children:n.jsx(B,{id:"p5GCek",defaultMessage:[{type:0,value:"钩子模版"}]})}),n.jsx("div",{className:"text-xs ml-3 text-[#787D8B]",children:n.jsx(B,{id:"RKEnyl",defaultMessage:[{type:0,value:"（钩子同时只能开启一个，为toggle模式）"}]})})]}),n.jsxs(Y,{className:"",gutter:[32,32],children:[s==null?void 0:s.map((o,d)=>n.jsx(Q,{xl:8,xxl:6,md:12,children:n.jsx(ye,{sdk:o,onChange:i=>l(d,i)})},o.name)),!(s!=null&&s.length)&&n.jsx(fe,{className:"m-auto",description:P.formatMessage({id:"cLNR9b",defaultMessage:[{type:0,value:"暂无模板"}]})})]}),n.jsx("div",{className:"flex mb-4 items-center mt-8",children:n.jsxs("div",{className:"text-xs text-[#666]",children:[n.jsx(B,{id:"gRp6eK",defaultMessage:[{type:0,value:"客户端模版"}]}),r.length&&n.jsxs("span",{className:"text-xs ml-3 text-[#787D8B]",children:["（",n.jsx("code",{className:"px-1 text-primary",children:"generated-sdk"}),n.jsx(B,{id:"bXiKzU",defaultMessage:[{type:0,value:"目录下生成的文件可以使用"}]}),n.jsxs("span",{className:"mx-1 text-primary cursor-pointer",onClick:()=>{rt(`${window.location.origin}/generated-sdk`),z.success("已复制")},children:[window.location.origin,"/generated-sdk",n.jsx(pt,{className:"ml-0.5 mr-1"})]}),n.jsx(B,{id:"J0Nrpk",defaultMessage:[{type:0,value:"加上文件路径访问"}]}),"）"]})]})}),n.jsxs(Y,{className:"",gutter:[32,32],children:[r==null?void 0:r.map((o,d)=>n.jsx(Q,{xl:8,xxl:6,md:12,children:n.jsx(ye,{sdk:o,onChange:i=>l(d,i)})},d)),!(r!=null&&r.length)&&n.jsx(fe,{className:"m-auto",description:P.formatMessage({id:"7Mbp/s",defaultMessage:[{type:0,value:"暂无 模版"}]})})]}),n.jsx(Aa,{sdks:e??[],onUpdate:t,actionRef:a})]})};async function Ea(e){const t=e.gitUrl.match(/^https?:\/\/(.+)\/(.+\/.+)\.git/);if(t)try{const a=await st(`https://api.github.com/repos/${t[2]}/git/refs/heads/${e.gitBranch}`);return a&&a.object.sha!==e.gitCommitHash?{repo:t[2],localSha:e.gitCommitHash,remoteSha:a.object.sha}:!1}catch(a){console.error(a)}return!1}const ye=({onChange:e,sdk:t})=>{const a=Ne(),[s,r]=c.useState(!1),[l,o]=c.useState(!1),[d,i]=c.useState(t.outputPath),{initialize:p}=je(),{mutate:g}=Oe("/sdk",R.get),f=c.useCallback(b=>{const u=b.currentTarget.value;b.key==="Escape"?(i(t.outputPath),o(!1)):b.key==="Enter"&&R.put("/sdk",{name:t.name,outputPath:u}).then(h=>{console.log("res",h),e({...t,outputPath:u}),z.success(a.formatMessage({id:"jhfb/7",defaultMessage:[{type:0,value:"保存成功"}]}))})},[a,e,t]),v=c.useCallback(b=>{R.put("/sdk",{name:t.name,enabled:b}).then(u=>{g(),p(),me("/sdk/enabledServer")})},[p,g,t.name]),y=c.useMemo(()=>{const b=[{key:"delete",icon:"",label:n.jsx(gt,{title:a.formatMessage({id:"nS8PfW",defaultMessage:[{type:0,value:"确定要删除?"}]}),okText:a.formatMessage({id:"r0/TUu",defaultMessage:[{type:0,value:"确定"}]}),cancelText:a.formatMessage({id:"2QzYmY",defaultMessage:[{type:0,value:"取消"}]}),onConfirm:async()=>{await R.delete(`/sdk/${t.name}`),z.success(a.formatMessage({id:"aiBGBs",defaultMessage:[{type:0,value:"删除成功"}]})),g()},children:a.formatMessage({id:"XeiAal",defaultMessage:[{type:0,value:"删除"}]})})},{key:"update",label:a.formatMessage({id:"iCvPMa",defaultMessage:[{type:0,value:"升级"}]}),onClick:async()=>{const u=z.loading(a.formatMessage({id:"GdhWnp",defaultMessage:[{type:0,value:"升级中"}]}));try{await R.put("/sdk",{name:t.name,gitCommitHash:"latest"}),z.success(a.formatMessage({id:"uG+OVa",defaultMessage:[{type:0,value:"升级成功"}]})),g()}finally{u()}}}];return t.enabled===!0&&b.push({key:"download",label:a.formatMessage({id:"4bLnOM",defaultMessage:[{type:0,value:"下载生成文件"}]}),onClick:async()=>{const u=at();window.open(`/api/sdk/downloadOutput/${t.name}?${u?`&auth-key=${u}`:""}`)}}),b},[a,g,t]);return c.useEffect(()=>{Ea(t).then(r)},[t]),n.jsxs("div",{className:"bg-white rounded shadow p-4 hover:shadow-lg",children:[n.jsxs("div",{className:"flex items-center",children:[n.jsx("img",{alt:"",className:"w-10 h-10 mr-2.5",src:t.icon.startsWith("http")?t.icon:`data:image/svg+xml;base64,${re.fromByteArray(new TextEncoder().encode(`${t.icon}`))}`}),n.jsxs("div",{className:"flex-1",children:[n.jsxs("div",{className:"flex items-center",children:[n.jsx("div",{className:"text-base t-medium",children:t.name}),s&&n.jsx("a",{className:"ml-4 text-primary italic border border-primary border-solid rounded px-1 py-0.5 leading-2 text-xs",href:`https://github.com/${s.repo}/compare/${s.localSha.substring(0,7)}..${s.remoteSha.substring(0,7)}`,target:"_blank",rel:"noreferrer",children:"new"})]}),n.jsxs("div",{className:"flex mt-1 items-center",children:[n.jsx("div",{className:"rounded-md bg-[#D8D8D8] h-2.5 shadow w-2.5"}),n.jsx("div",{className:"text-xs ml-1 text-[#5F6269]",children:t.author})]})]}),n.jsx(ut,{className:"flex-shrink-0",checked:t.enabled,onChange:v}),n.jsx(ht,{menu:{items:y},trigger:["hover"],children:n.jsx("img",{alt:"",className:"cursor-pointer h-3 ml-2 w-3",src:Sa})})]}),n.jsx("div",{className:"bg-[rgba(95,98,105,0.1)] h-0.5 mt-2 mb-3"}),n.jsxs("div",{className:"text-xs text-[#787D8B] line-clamp-2",children:[a.formatMessage({id:"Ph2Nn+",defaultMessage:[{type:0,value:"功能描述"}]}),"：",t.description||"-"]}),n.jsxs("div",{className:"flex h-8 mt-3 relative items-center",children:[n.jsxs("span",{className:"flex-shrink-0 text-xs text-[#787D8B] line-clamp-2",children:[a.formatMessage({id:"Zlo7bL",defaultMessage:[{type:0,value:"生成路径"}]}),"："]}),n.jsx("input",{value:d,readOnly:!l,className:"border rounded h-full outline-none border-[rgba(95,98,105,0.1)] text-sm w-full px-3 text-[#5F6269] focus:border-[rgba(95,98,105,0.8)]",onClick:()=>o(!0),onBlur:()=>o(!1),onKeyDown:f,onInput:b=>i(b.currentTarget.value)}),n.jsx(ft,{className:"cursor-pointer top-2 right-3 absolute",size:8})]})]})};export{ts as default};