import{r as a,ae as j,k as P,Y as C,a5 as E,b as k,j as f}from"./index-e23f2223.js";import{G as D}from"./globalContext-79fdce0b.js";new BroadcastChannel("fb-vscode-out");const F=new BroadcastChannel("fb-vscode-in");let w=!1;function B({className:u,style:l}){var g;const[n,o]=a.useState(w),p=a.useRef(null),{vscode:e}=a.useContext(D),{data:t}=j("/sdk/enabledServer",P),i=t==null?void 0:t.language,[m,h]=a.useState(""),S=C(),d=E(),{pathname:b}=k();return a.useEffect(()=>{console.log("vscode init")},[]),a.useEffect(()=>{if(!i){e.hide();return}h("");const[,s]=b.match(/\/workbench\/data-source\/(\d+)/)||[];if(s){const c=d==null?void 0:d.find(r=>r.name===s);if(c&&c.sourceType===4){e.show();const r=`${S.customize}/customize/${c.name}`;e.checkHookExist(r).then(x=>{h(r)})}else e.hide()}else e.hide()},[d,b,i]),a.useEffect(()=>{var c,r;let s=m;!m&&((c=e==null?void 0:e.options)!=null&&c.visible)&&(s=(r=e==null?void 0:e.options)==null?void 0:r.currentPath),s=s.replace(/^(\.\/)?custom-\w+\//,"./"),s&&y().then(x=>{I(x,{cmd:"openFile",data:{path:s}}).then(()=>{F.postMessage({cmd:"openFile",data:{path:s}})})})},[m,e==null?void 0:e.options]),a.useEffect(()=>{e!=null&&e.options.visible&&(n||(w=!0,o(!0)))},[n,e==null?void 0:e.options.visible]),n&&(t!=null&&t.outputPath)?f.jsx("div",{style:{transform:(g=e==null?void 0:e.options)!=null&&g.visible?"none":"translate(-100vw, 0)"},children:f.jsx("iframe",{ref:p,"data-settings":'{"productConfiguration": {"nameShort": "fb-editor1","nameLong": "fb-editor2"}}',className:`border-0 h-full top-0 left-0 w-full ${u}`,src:`./vscode/index.html?baseDir=${t==null?void 0:t.outputPath}`,title:"vscode",style:l},i)}):f.jsx(f.Fragment,{})}async function y(){return new Promise((u,l)=>{const n=indexedDB.open("fb-controller",2);n.onerror=o=>{l("Failed to open IndexedDB")},n.onsuccess=o=>{u(o.target.result)},n.onupgradeneeded=o=>{o.target.result.createObjectStore("msg",{keyPath:"id",autoIncrement:!0})}})}async function I(u,l){return new Promise((n,o)=>{const t=u.transaction(["msg"],"readwrite").objectStore("msg").add({content:l});t.onerror=i=>{o("Failed to add message")},t.onsuccess=i=>{n(i.target.result)}})}export{B as V};