import{K as x,O as y,ag as o,j as e,ao as l,ad as d,Q as p,V as u}from"./index-91e91fd5.js";import{d as i}from"./dayjs.min-3fcb3495.js";import{I as r}from"./index-7e059eb1.js";import{U as f}from"./index-1387ae5c.js";import{s as M}from"./subs.module-3247843c.js";import{u as h}from"./engine-ef77fc58.js";import{S as I}from"./index-30879f51.js";import"./common-7ac8785d.js";import"./index-990fc22b.js";import"./index-eabd0a5e.js";import"./useShowArrow-0c1f1245.js";import"./index-4b9f0184.js";import"./DownOutlined-34ad1f97.js";import"./PurePanel-48186b27.js";import"./index-18a7e39e.js";import"./interface-41bd3122.js";function H(){const s=x(),{globalSetting:c,updateGlobalSetting:g}=y(),[n]=o.useForm(),{globalStartTime:m}=h();async function j(a){const t=u.loading(s.formatMessage({id:"IyVzrX",defaultMessage:[{type:0,value:"保存中"}]}),0);try{await g(a)&&u.success(s.formatMessage({id:"jhfb/7",defaultMessage:[{type:0,value:"保存成功"}]}))}catch{}t()}const v=a=>{const t=i.duration(i().diff(i(a),"seconds"),"seconds");return s.formatMessage({id:"+zhQOH",defaultMessage:[{type:1,value:"days"},{type:0,value:"天 "},{type:1,value:"hours"},{type:0,value:"时 "},{type:1,value:"minutes"},{type:0,value:"分 "},{type:1,value:"seconds"},{type:0,value:"秒"}]},{days:t.$d.days,hours:t.$d.hours,minutes:t.$d.minutes,seconds:t.$d.seconds})};return e.jsx("div",{className:"pt-6",children:e.jsxs(o,{className:"common-form",form:n,labelCol:{span:5},wrapperCol:{span:12},onFinish:j,labelAlign:"right",initialValues:c,children:[e.jsx(o.Item,{label:s.formatMessage({id:"A5xsdI",defaultMessage:[{type:0,value:"运行时长"}]}),children:m?v(i(m).format("YYYY-MM-DD HH:mm:ss")):"-"}),e.jsx(r,{formItemProps:{label:s.formatMessage({id:"oOThrp",defaultMessage:[{type:0,value:"API外网地址"}]}),name:["nodeOptions","publicNodeUrl"]},inputRender:a=>e.jsx(f,{...a})}),e.jsx(r,{formItemProps:{label:s.formatMessage({id:"eqz7K0",defaultMessage:[{type:0,value:"API内网地址"}]}),name:["nodeOptions","nodeUrl"],tooltip:s.formatMessage({id:"cGUVW2",defaultMessage:[{type:0,value:"服务内网地址，一般不需要修改"}]})},inputRender:a=>e.jsx(f,{...a})}),e.jsx(r,{formItemProps:{label:s.formatMessage({id:"jD5jDy",defaultMessage:[{type:0,value:"API服务监听Host"}]}),name:["nodeOptions","listen","host"]}}),e.jsx(r,{formItemProps:{label:s.formatMessage({id:"tjlVGr",defaultMessage:[{type:0,value:"API服务监听端口"}]}),name:["nodeOptions","listen","port"]}}),e.jsx(r,{formItemProps:{label:s.formatMessage({id:"UifjEZ",defaultMessage:[{type:0,value:"日志水平"}]}),name:["nodeOptions","logger","level"]},inputRender:a=>e.jsxs(l.Group,{...a,className:"ml-4 flex items-center",children:[e.jsx(l,{value:"DEBUG",children:"Debug"}),e.jsx(l,{value:"INFO",children:"Info"}),e.jsx(l,{value:"WARN",children:"Warn"}),e.jsx(l,{value:"ERROR",children:"Error"})]})}),e.jsx(o.Item,{label:s.formatMessage({id:"8ATxSY",defaultMessage:[{type:0,value:"日志上报"}]}),name:"allowedReport",valuePropName:"checked",children:e.jsx(I,{className:M["switch-edit-btn"],size:"small"})}),e.jsxs(o.Item,{wrapperCol:{offset:5,span:12},children:[e.jsx(d,{className:"btn-cancel mr-4",onClick:()=>n.resetFields(),children:e.jsx(p,{id:"r2dEd/",defaultMessage:[{type:0,value:"重置"}]})}),e.jsx(d,{className:"btn-save",onClick:n.submit,children:e.jsx(p,{id:"b5l2vN",defaultMessage:[{type:0,value:"保存"}]})})]})]})})}export{H as default};