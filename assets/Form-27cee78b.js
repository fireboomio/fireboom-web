import{K as w,Y as I,X as b,dW as v,ag as a,r as u,j as e,ad as g,Q as j}from"./index-91e91fd5.js";import{F,l as N}from"./index-8a8f323c.js";import{c as U,F as _,S as k}from"./fireBoomConstants-acaaa4c8.js";import{G as A}from"./globalContext-cadf258b.js";import{m as C}from"./utils-9b986f1e.js";import{S as f}from"./index-30879f51.js";import{I as M}from"./index-cfcf0b28.js";import{S as y}from"./index-eabd0a5e.js";const E=`{
  "type": "object",
  "properties": {
    "postId": {
      "type": "string"
    }
  }
}`;let h;function O(n){h&&h.dispose();class o{async provideInlineCompletions(t){if(t.uri.path==="/profile.json"&&(await new Promise(i=>setTimeout(i,100)),!t.getValue()))return{items:[{insertText:E}]}}freeInlineCompletions(){}}h=n.languages.registerInlineCompletionsProvider("json",new o)}const $="_container_15mmq_1",B="_content_15mmq_7",z="_title_15mmq_17",P="_editor_15mmq_25",T={container:$,content:B,title:z,editor:P};N.config({paths:{vs:"./modules/monaco-editor/min/vs"}});function q({storageName:n,profile:o,onSave:x}){const t=w(),i=I(),{profile:m}=b(),[l]=v(),S=a.useWatch("maxAllowedUploadSizeBytes",l),{vscode:c}=u.useContext(A),p=u.useCallback(()=>{l.setFieldsValue({requireAuthentication:o.requireAuthentication,maxAllowedUploadSizeBytes:Math.round((o.maxAllowedUploadSizeBytes??0)/1024/1024*100)/100,allowedMimeTypes:o.allowedMimeTypes??[],allowedFileExtensions:o.allowedFileExtensions??[],metadataJSONSchema:o.metadataJSONSchema,maxAllowedFiles:o.maxAllowedFiles,hooks:o.hooks})},[o,l]);return u.useEffect(()=>{p()},[o,p]),e.jsxs(a,{className:"common-form overflow-auto",labelCol:{span:4},wrapperCol:{span:12},form:l,onFinish:async s=>{var r,d;(r=s==null?void 0:s.hooks)!=null&&r.preUpload&&!await c.checkHookExist(`${i.preUpload}/${n}/${m}/preUpload`)||(d=s==null?void 0:s.hooks)!=null&&d.postUpload&&!await c.checkHookExist(`${i.postUpload}/${n}/${m}/postUpload`)||x({...s,maxAllowedUploadSizeBytes:Math.round(s.maxAllowedUploadSizeBytes*1024*1024)})},children:[e.jsx(a.Item,{name:"requireAuthentication",label:t.formatMessage({id:"+s2H3p",defaultMessage:[{type:0,value:"需要认证"}]}),valuePropName:"checked",children:e.jsx(f,{})}),e.jsx(a.Item,{tooltip:t.formatMessage({id:"9K5ZRj",defaultMessage:[{type:0,value:"输入-1禁用限制"}]}),label:t.formatMessage({id:"RzYytI",defaultMessage:[{type:0,value:"最大尺寸"}]}),children:e.jsxs("div",{className:"flex items-center",children:[e.jsx(a.Item,{noStyle:!0,name:"maxAllowedUploadSizeBytes",children:e.jsx(M,{style:{width:200},addonAfter:"M",max:1024,min:-1,placeholder:t.formatMessage({id:"BZ2F1l",defaultMessage:[{type:0,value:"输入数值不大于1024M"}]})})}),e.jsxs("span",{className:"ml-2 text-[#999]",children:[Math.round(S*1024*1024)," Bytes"]})]})}),e.jsx(a.Item,{tooltip:t.formatMessage({id:"qiov2+",defaultMessage:[{type:0,value:"仅SDK限制，输入-1禁用限制"}]}),label:t.formatMessage({id:"CAAXfY",defaultMessage:[{type:0,value:"文件数量限制"}]}),name:"maxAllowedFiles",children:e.jsx(M,{style:{width:200},max:50,min:-1,placeholder:t.formatMessage({id:"6l+xcm",defaultMessage:[{type:0,value:"输入数值不大于50"}]})})}),e.jsx(a.Item,{label:t.formatMessage({id:"+pOhR+",defaultMessage:[{type:0,value:"文件类型"}]}),name:"allowedMimeTypes",children:e.jsx(y,{mode:"tags",options:U.map(s=>({label:s,value:s}))})}),e.jsx(a.Item,{label:t.formatMessage({id:"XUAQFk",defaultMessage:[{type:0,value:"文件后缀"}]}),name:"allowedFileExtensions",children:e.jsx(y,{mode:"tags",options:_.map(s=>({label:s,value:s}))})}),e.jsx(a.Item,{label:t.formatMessage({id:"6Wvms6",defaultMessage:[{type:0,value:"META"}]}),name:"metadataJSONSchema",children:e.jsx(F,{options:{fixedOverflowWidgets:!0,minimap:{enabled:!1},lineNumbers:"off"},className:T.editor,defaultLanguage:"json",defaultPath:"profile.json",onChange:s=>{l.setFieldValue("metadataJSONSchema",s)},beforeMount:s=>{var d;O(s),s.languages.json.jsonDefaults.setDiagnosticsOptions({validate:!0,schemas:[{uri:"profile.json",fileMatch:["profile.json"],schema:k}]});const r=s.Uri.parse("profile.json");(d=s.editor.getModel(r))==null||d.dispose(),s.editor.createModel("","json",r)},onMount:s=>{C(s),s.focus(),s.trigger("","editor.action.inlineSuggest.trigger",""),s.setValue(l.getFieldValue("metadataJSONSchema"))}})}),e.jsx(a.Item,{label:t.formatMessage({id:"X4MmvD",defaultMessage:[{type:0,value:"前置钩子"}]}),children:e.jsxs("div",{className:"flex items-center",children:[e.jsx(a.Item,{noStyle:!0,valuePropName:"checked",name:["hooks","preUpload"],children:e.jsx(f,{})}),e.jsx("span",{className:"ml-10 text-[#4C7BFE] cursor-pointer",onClick:()=>c.show(`${i.preUpload}/${n}/${m}/preUpload`),children:"编辑"})]})}),e.jsx(a.Item,{name:["hooks","postUpload"],label:t.formatMessage({id:"nzrX2V",defaultMessage:[{type:0,value:"后置钩子"}]}),children:e.jsxs("div",{className:"flex items-center",children:[e.jsx(a.Item,{noStyle:!0,valuePropName:"checked",name:["hooks","postUpload"],children:e.jsx(f,{})}),e.jsx("span",{className:"ml-10 text-[#4C7BFE] cursor-pointer",onClick:()=>c.show(`${i.preUpload}/${n}/${m}/postUpload`),children:"编辑"})]})}),e.jsxs(a.Item,{wrapperCol:{offset:4,span:12},children:[e.jsx(g,{className:"btn-cancel mr-4",onClick:p,children:e.jsx(j,{id:"2QzYmY",defaultMessage:[{type:0,value:"取消"}]})}),e.jsx(g,{className:"btn-save",onClick:()=>{l.submit()},children:e.jsx(j,{id:"b5l2vN",defaultMessage:[{type:0,value:"保存"}]})})]})]})}const W=Object.freeze(Object.defineProperty({__proto__:null,default:q},Symbol.toStringTag,{value:"Module"}));export{W as F,q as P,T as s};