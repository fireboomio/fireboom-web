function C(e,t){if(!!!e)throw new Error(t)}function z(e){return typeof e=="object"&&e!==null}function q(e,t){if(!!!e)throw new Error(t??"Unexpected invariant triggered.")}const H=/\r\n|[\n\r]/g;function v(e,t){let n=0,s=1;for(const i of e.body.matchAll(H)){if(typeof i.index=="number"||q(!1),i.index>=t)break;n=i.index+i[0].length,s+=1}return{line:s,column:t+1-n}}function W(e){return M(e.source,v(e.source,e.start))}function M(e,t){const n=e.locationOffset.column-1,s="".padStart(n)+e.body,i=t.line-1,r=e.locationOffset.line-1,a=t.line+r,u=t.line===1?n:0,h=t.column+u,f=`${e.name}:${a}:${h}
`,p=s.split(/\r\n|[\n\r]/g),N=p[i];if(N.length>120){const T=Math.floor(h/80),I=h%80,E=[];for(let x=0;x<N.length;x+=80)E.push(N.slice(x,x+80));return f+w([[`${a} |`,E[0]],...E.slice(1,T+1).map(x=>["|",x]),["|","^".padStart(I)],["|",E[T+1]]])}return f+w([[`${a-1} |`,p[i-1]],[`${a} |`,N],["|","^".padStart(h)],[`${a+1} |`,p[i+1]]])}function w(e){const t=e.filter(([s,i])=>i!==void 0),n=Math.max(...t.map(([s])=>s.length));return t.map(([s,i])=>s.padStart(n)+(i?" "+i:"")).join(`
`)}function Z(e){const t=e[0];return t==null||"kind"in t||"length"in t?{nodes:t,source:e[1],positions:e[2],path:e[3],originalError:e[4],extensions:e[5]}:t}class b extends Error{constructor(t,...n){var s,i,r;const{nodes:a,source:u,positions:h,path:f,originalError:p,extensions:N}=Z(n);super(t),this.name="GraphQLError",this.path=f??void 0,this.originalError=p??void 0,this.nodes=P(Array.isArray(a)?a:a?[a]:void 0);const T=P((s=this.nodes)===null||s===void 0?void 0:s.map(E=>E.loc).filter(E=>E!=null));this.source=u??(T==null||(i=T[0])===null||i===void 0?void 0:i.source),this.positions=h??(T==null?void 0:T.map(E=>E.start)),this.locations=h&&u?h.map(E=>v(u,E)):T==null?void 0:T.map(E=>v(E.source,E.start));const I=z(p==null?void 0:p.extensions)?p==null?void 0:p.extensions:void 0;this.extensions=(r=N??I)!==null&&r!==void 0?r:Object.create(null),Object.defineProperties(this,{message:{writable:!0,enumerable:!0},name:{enumerable:!1},nodes:{enumerable:!1},source:{enumerable:!1},positions:{enumerable:!1},originalError:{enumerable:!1}}),p!=null&&p.stack?Object.defineProperty(this,"stack",{value:p.stack,writable:!0,configurable:!0}):Error.captureStackTrace?Error.captureStackTrace(this,b):Object.defineProperty(this,"stack",{value:Error().stack,writable:!0,configurable:!0})}get[Symbol.toStringTag](){return"GraphQLError"}toString(){let t=this.message;if(this.nodes)for(const n of this.nodes)n.loc&&(t+=`

`+W(n.loc));else if(this.source&&this.locations)for(const n of this.locations)t+=`

`+M(this.source,n);return t}toJSON(){const t={message:this.message};return this.locations!=null&&(t.locations=this.locations),this.path!=null&&(t.path=this.path),this.extensions!=null&&Object.keys(this.extensions).length>0&&(t.extensions=this.extensions),t}}function P(e){return e===void 0||e.length===0?void 0:e}function d(e,t,n){return new b(`Syntax Error: ${n}`,{source:e,positions:[t]})}class K{constructor(t,n,s){this.start=t.start,this.end=n.end,this.startToken=t,this.endToken=n,this.source=s}get[Symbol.toStringTag](){return"Location"}toJSON(){return{start:this.start,end:this.end}}}class B{constructor(t,n,s,i,r,a){this.kind=t,this.start=n,this.end=s,this.line=i,this.column=r,this.value=a,this.prev=null,this.next=null}get[Symbol.toStringTag](){return"Token"}toJSON(){return{kind:this.kind,value:this.value,line:this.line,column:this.column}}}const ee={Name:[],Document:["definitions"],OperationDefinition:["name","variableDefinitions","directives","selectionSet"],VariableDefinition:["variable","type","defaultValue","directives"],Variable:["name"],SelectionSet:["selections"],Field:["alias","name","arguments","directives","selectionSet"],Argument:["name","value"],FragmentSpread:["name","directives"],InlineFragment:["typeCondition","directives","selectionSet"],FragmentDefinition:["name","variableDefinitions","typeCondition","directives","selectionSet"],IntValue:[],FloatValue:[],StringValue:[],BooleanValue:[],NullValue:[],EnumValue:[],ListValue:["values"],ObjectValue:["fields"],ObjectField:["name","value"],Directive:["name","arguments"],NamedType:["name"],ListType:["type"],NonNullType:["type"],SchemaDefinition:["description","directives","operationTypes"],OperationTypeDefinition:["type"],ScalarTypeDefinition:["description","name","directives"],ObjectTypeDefinition:["description","name","interfaces","directives","fields"],FieldDefinition:["description","name","arguments","type","directives"],InputValueDefinition:["description","name","type","defaultValue","directives"],InterfaceTypeDefinition:["description","name","interfaces","directives","fields"],UnionTypeDefinition:["description","name","directives","types"],EnumTypeDefinition:["description","name","directives","values"],EnumValueDefinition:["description","name","directives"],InputObjectTypeDefinition:["description","name","directives","fields"],DirectiveDefinition:["description","name","arguments","locations"],SchemaExtension:["directives","operationTypes"],ScalarTypeExtension:["name","directives"],ObjectTypeExtension:["name","interfaces","directives","fields"],InterfaceTypeExtension:["name","interfaces","directives","fields"],UnionTypeExtension:["name","directives","types"],EnumTypeExtension:["name","directives","values"],InputObjectTypeExtension:["name","directives","fields"]},te=new Set(Object.keys(ee));function ye(e){const t=e==null?void 0:e.kind;return typeof t=="string"&&te.has(t)}var O;(function(e){e.QUERY="query",e.MUTATION="mutation",e.SUBSCRIPTION="subscription"})(O||(O={}));var L;(function(e){e.QUERY="QUERY",e.MUTATION="MUTATION",e.SUBSCRIPTION="SUBSCRIPTION",e.FIELD="FIELD",e.FRAGMENT_DEFINITION="FRAGMENT_DEFINITION",e.FRAGMENT_SPREAD="FRAGMENT_SPREAD",e.INLINE_FRAGMENT="INLINE_FRAGMENT",e.VARIABLE_DEFINITION="VARIABLE_DEFINITION",e.SCHEMA="SCHEMA",e.SCALAR="SCALAR",e.OBJECT="OBJECT",e.FIELD_DEFINITION="FIELD_DEFINITION",e.ARGUMENT_DEFINITION="ARGUMENT_DEFINITION",e.INTERFACE="INTERFACE",e.UNION="UNION",e.ENUM="ENUM",e.ENUM_VALUE="ENUM_VALUE",e.INPUT_OBJECT="INPUT_OBJECT",e.INPUT_FIELD_DEFINITION="INPUT_FIELD_DEFINITION"})(L||(L={}));var c;(function(e){e.NAME="Name",e.DOCUMENT="Document",e.OPERATION_DEFINITION="OperationDefinition",e.VARIABLE_DEFINITION="VariableDefinition",e.SELECTION_SET="SelectionSet",e.FIELD="Field",e.ARGUMENT="Argument",e.FRAGMENT_SPREAD="FragmentSpread",e.INLINE_FRAGMENT="InlineFragment",e.FRAGMENT_DEFINITION="FragmentDefinition",e.VARIABLE="Variable",e.INT="IntValue",e.FLOAT="FloatValue",e.STRING="StringValue",e.BOOLEAN="BooleanValue",e.NULL="NullValue",e.ENUM="EnumValue",e.LIST="ListValue",e.OBJECT="ObjectValue",e.OBJECT_FIELD="ObjectField",e.DIRECTIVE="Directive",e.NAMED_TYPE="NamedType",e.LIST_TYPE="ListType",e.NON_NULL_TYPE="NonNullType",e.SCHEMA_DEFINITION="SchemaDefinition",e.OPERATION_TYPE_DEFINITION="OperationTypeDefinition",e.SCALAR_TYPE_DEFINITION="ScalarTypeDefinition",e.OBJECT_TYPE_DEFINITION="ObjectTypeDefinition",e.FIELD_DEFINITION="FieldDefinition",e.INPUT_VALUE_DEFINITION="InputValueDefinition",e.INTERFACE_TYPE_DEFINITION="InterfaceTypeDefinition",e.UNION_TYPE_DEFINITION="UnionTypeDefinition",e.ENUM_TYPE_DEFINITION="EnumTypeDefinition",e.ENUM_VALUE_DEFINITION="EnumValueDefinition",e.INPUT_OBJECT_TYPE_DEFINITION="InputObjectTypeDefinition",e.DIRECTIVE_DEFINITION="DirectiveDefinition",e.SCHEMA_EXTENSION="SchemaExtension",e.SCALAR_TYPE_EXTENSION="ScalarTypeExtension",e.OBJECT_TYPE_EXTENSION="ObjectTypeExtension",e.INTERFACE_TYPE_EXTENSION="InterfaceTypeExtension",e.UNION_TYPE_EXTENSION="UnionTypeExtension",e.ENUM_TYPE_EXTENSION="EnumTypeExtension",e.INPUT_OBJECT_TYPE_EXTENSION="InputObjectTypeExtension"})(c||(c={}));function R(e){return e===9||e===32}function y(e){return e>=48&&e<=57}function V(e){return e>=97&&e<=122||e>=65&&e<=90}function j(e){return V(e)||e===95}function ne(e){return V(e)||y(e)||e===95}function ie(e){var t;let n=Number.MAX_SAFE_INTEGER,s=null,i=-1;for(let a=0;a<e.length;++a){var r;const u=e[a],h=se(u);h!==u.length&&(s=(r=s)!==null&&r!==void 0?r:a,i=a,a!==0&&h<n&&(n=h))}return e.map((a,u)=>u===0?a:a.slice(n)).slice((t=s)!==null&&t!==void 0?t:0,i+1)}function se(e){let t=0;for(;t<e.length&&R(e.charCodeAt(t));)++t;return t}function De(e,t){const n=e.replace(/"""/g,'\\"""'),s=n.split(/\r\n|[\n\r]/g),i=s.length===1,r=s.length>1&&s.slice(1).every(I=>I.length===0||R(I.charCodeAt(0))),a=n.endsWith('\\"""'),u=e.endsWith('"')&&!a,h=e.endsWith("\\"),f=u||h,p=!(t!=null&&t.minimize)&&(!i||e.length>70||f||r||a);let N="";const T=i&&R(e.charCodeAt(0));return(p&&!T||r)&&(N+=`
`),N+=n,(p||f)&&(N+=`
`),'"""'+N+'"""'}var o;(function(e){e.SOF="<SOF>",e.EOF="<EOF>",e.BANG="!",e.DOLLAR="$",e.AMP="&",e.PAREN_L="(",e.PAREN_R=")",e.SPREAD="...",e.COLON=":",e.EQUALS="=",e.AT="@",e.BRACKET_L="[",e.BRACKET_R="]",e.BRACE_L="{",e.PIPE="|",e.BRACE_R="}",e.NAME="Name",e.INT="Int",e.FLOAT="Float",e.STRING="String",e.BLOCK_STRING="BlockString",e.COMMENT="Comment"})(o||(o={}));class re{constructor(t){const n=new B(o.SOF,0,0,0,0);this.source=t,this.lastToken=n,this.token=n,this.line=1,this.lineStart=0}get[Symbol.toStringTag](){return"Lexer"}advance(){return this.lastToken=this.token,this.token=this.lookahead()}lookahead(){let t=this.token;if(t.kind!==o.EOF)do if(t.next)t=t.next;else{const n=ae(this,t.end);t.next=n,n.prev=t,t=n}while(t.kind===o.COMMENT);return t}}function oe(e){return e===o.BANG||e===o.DOLLAR||e===o.AMP||e===o.PAREN_L||e===o.PAREN_R||e===o.SPREAD||e===o.COLON||e===o.EQUALS||e===o.AT||e===o.BRACKET_L||e===o.BRACKET_R||e===o.BRACE_L||e===o.PIPE||e===o.BRACE_R}function _(e){return e>=0&&e<=55295||e>=57344&&e<=1114111}function S(e,t){return G(e.charCodeAt(t))&&Y(e.charCodeAt(t+1))}function G(e){return e>=55296&&e<=56319}function Y(e){return e>=56320&&e<=57343}function m(e,t){const n=e.source.body.codePointAt(t);if(n===void 0)return o.EOF;if(n>=32&&n<=126){const s=String.fromCodePoint(n);return s==='"'?`'"'`:`"${s}"`}return"U+"+n.toString(16).toUpperCase().padStart(4,"0")}function l(e,t,n,s,i){const r=e.line,a=1+n-e.lineStart;return new B(t,n,s,r,a,i)}function ae(e,t){const n=e.source.body,s=n.length;let i=t;for(;i<s;){const r=n.charCodeAt(i);switch(r){case 65279:case 9:case 32:case 44:++i;continue;case 10:++i,++e.line,e.lineStart=i;continue;case 13:n.charCodeAt(i+1)===10?i+=2:++i,++e.line,e.lineStart=i;continue;case 35:return ce(e,i);case 33:return l(e,o.BANG,i,i+1);case 36:return l(e,o.DOLLAR,i,i+1);case 38:return l(e,o.AMP,i,i+1);case 40:return l(e,o.PAREN_L,i,i+1);case 41:return l(e,o.PAREN_R,i,i+1);case 46:if(n.charCodeAt(i+1)===46&&n.charCodeAt(i+2)===46)return l(e,o.SPREAD,i,i+3);break;case 58:return l(e,o.COLON,i,i+1);case 61:return l(e,o.EQUALS,i,i+1);case 64:return l(e,o.AT,i,i+1);case 91:return l(e,o.BRACKET_L,i,i+1);case 93:return l(e,o.BRACKET_R,i,i+1);case 123:return l(e,o.BRACE_L,i,i+1);case 124:return l(e,o.PIPE,i,i+1);case 125:return l(e,o.BRACE_R,i,i+1);case 34:return n.charCodeAt(i+1)===34&&n.charCodeAt(i+2)===34?fe(e,i):he(e,i)}if(y(r)||r===45)return ue(e,i,r);if(j(r))return Ee(e,i);throw d(e.source,i,r===39?`Unexpected single quote character ('), did you mean to use a double quote (")?`:_(r)||S(n,i)?`Unexpected character: ${m(e,i)}.`:`Invalid character: ${m(e,i)}.`)}return l(e,o.EOF,s,s)}function ce(e,t){const n=e.source.body,s=n.length;let i=t+1;for(;i<s;){const r=n.charCodeAt(i);if(r===10||r===13)break;if(_(r))++i;else if(S(n,i))i+=2;else break}return l(e,o.COMMENT,t,i,n.slice(t+1,i))}function ue(e,t,n){const s=e.source.body;let i=t,r=n,a=!1;if(r===45&&(r=s.charCodeAt(++i)),r===48){if(r=s.charCodeAt(++i),y(r))throw d(e.source,i,`Invalid number, unexpected digit after 0: ${m(e,i)}.`)}else i=g(e,i,r),r=s.charCodeAt(i);if(r===46&&(a=!0,r=s.charCodeAt(++i),i=g(e,i,r),r=s.charCodeAt(i)),(r===69||r===101)&&(a=!0,r=s.charCodeAt(++i),(r===43||r===45)&&(r=s.charCodeAt(++i)),i=g(e,i,r),r=s.charCodeAt(i)),r===46||j(r))throw d(e.source,i,`Invalid number, expected digit but got: ${m(e,i)}.`);return l(e,a?o.FLOAT:o.INT,t,i,s.slice(t,i))}function g(e,t,n){if(!y(n))throw d(e.source,t,`Invalid number, expected digit but got: ${m(e,t)}.`);const s=e.source.body;let i=t+1;for(;y(s.charCodeAt(i));)++i;return i}function he(e,t){const n=e.source.body,s=n.length;let i=t+1,r=i,a="";for(;i<s;){const u=n.charCodeAt(i);if(u===34)return a+=n.slice(r,i),l(e,o.STRING,t,i+1,a);if(u===92){a+=n.slice(r,i);const h=n.charCodeAt(i+1)===117?n.charCodeAt(i+2)===123?pe(e,i):le(e,i):de(e,i);a+=h.value,i+=h.size,r=i;continue}if(u===10||u===13)break;if(_(u))++i;else if(S(n,i))i+=2;else throw d(e.source,i,`Invalid character within String: ${m(e,i)}.`)}throw d(e.source,i,"Unterminated string.")}function pe(e,t){const n=e.source.body;let s=0,i=3;for(;i<12;){const r=n.charCodeAt(t+i++);if(r===125){if(i<5||!_(s))break;return{value:String.fromCodePoint(s),size:i}}if(s=s<<4|A(r),s<0)break}throw d(e.source,t,`Invalid Unicode escape sequence: "${n.slice(t,t+i)}".`)}function le(e,t){const n=e.source.body,s=U(n,t+2);if(_(s))return{value:String.fromCodePoint(s),size:6};if(G(s)&&n.charCodeAt(t+6)===92&&n.charCodeAt(t+7)===117){const i=U(n,t+8);if(Y(i))return{value:String.fromCodePoint(s,i),size:12}}throw d(e.source,t,`Invalid Unicode escape sequence: "${n.slice(t,t+6)}".`)}function U(e,t){return A(e.charCodeAt(t))<<12|A(e.charCodeAt(t+1))<<8|A(e.charCodeAt(t+2))<<4|A(e.charCodeAt(t+3))}function A(e){return e>=48&&e<=57?e-48:e>=65&&e<=70?e-55:e>=97&&e<=102?e-87:-1}function de(e,t){const n=e.source.body;switch(n.charCodeAt(t+1)){case 34:return{value:'"',size:2};case 92:return{value:"\\",size:2};case 47:return{value:"/",size:2};case 98:return{value:"\b",size:2};case 102:return{value:"\f",size:2};case 110:return{value:`
`,size:2};case 114:return{value:"\r",size:2};case 116:return{value:"	",size:2}}throw d(e.source,t,`Invalid character escape sequence: "${n.slice(t,t+2)}".`)}function fe(e,t){const n=e.source.body,s=n.length;let i=e.lineStart,r=t+3,a=r,u="";const h=[];for(;r<s;){const f=n.charCodeAt(r);if(f===34&&n.charCodeAt(r+1)===34&&n.charCodeAt(r+2)===34){u+=n.slice(a,r),h.push(u);const p=l(e,o.BLOCK_STRING,t,r+3,ie(h).join(`
`));return e.line+=h.length-1,e.lineStart=i,p}if(f===92&&n.charCodeAt(r+1)===34&&n.charCodeAt(r+2)===34&&n.charCodeAt(r+3)===34){u+=n.slice(a,r),a=r+1,r+=4;continue}if(f===10||f===13){u+=n.slice(a,r),h.push(u),f===13&&n.charCodeAt(r+1)===10?r+=2:++r,u="",a=r,i=r;continue}if(_(f))++r;else if(S(n,r))r+=2;else throw d(e.source,r,`Invalid character within String: ${m(e,r)}.`)}throw d(e.source,r,"Unterminated string.")}function Ee(e,t){const n=e.source.body,s=n.length;let i=t+1;for(;i<s;){const r=n.charCodeAt(i);if(ne(r))++i;else break}return l(e,o.NAME,t,i,n.slice(t,i))}const Te=10,$=2;function J(e){return k(e,[])}function k(e,t){switch(typeof e){case"string":return JSON.stringify(e);case"function":return e.name?`[function ${e.name}]`:"[function]";case"object":return Ne(e,t);default:return String(e)}}function Ne(e,t){if(e===null)return"null";if(t.includes(e))return"[Circular]";const n=[...t,e];if(me(e)){const s=e.toJSON();if(s!==e)return typeof s=="string"?s:k(s,n)}else if(Array.isArray(e))return xe(e,n);return Ie(e,n)}function me(e){return typeof e.toJSON=="function"}function Ie(e,t){const n=Object.entries(e);return n.length===0?"{}":t.length>$?"["+Oe(e)+"]":"{ "+n.map(([i,r])=>i+": "+k(r,t)).join(", ")+" }"}function xe(e,t){if(e.length===0)return"[]";if(t.length>$)return"[Array]";const n=Math.min(Te,e.length),s=e.length-n,i=[];for(let r=0;r<n;++r)i.push(k(e[r],t));return s===1?i.push("... 1 more item"):s>1&&i.push(`... ${s} more items`),"["+i.join(", ")+"]"}function Oe(e){const t=Object.prototype.toString.call(e).replace(/^\[object /,"").replace(/]$/,"");if(t==="Object"&&typeof e.constructor=="function"){const n=e.constructor.name;if(typeof n=="string"&&n!=="")return n}return t}const _e=globalThis.process?function(t,n){return t instanceof n}:function(t,n){if(t instanceof n)return!0;if(typeof t=="object"&&t!==null){var s;const i=n.prototype[Symbol.toStringTag],r=Symbol.toStringTag in t?t[Symbol.toStringTag]:(s=t.constructor)===null||s===void 0?void 0:s.name;if(i===r){const a=J(t);throw new Error(`Cannot use ${i} "${a}" from another module or realm.

Ensure that there is only one instance of "graphql" in the node_modules
directory. If different versions of "graphql" are the dependencies of other
relied on modules, use "resolutions" to ensure only one version is installed.

https://yarnpkg.com/en/docs/selective-version-resolutions

Duplicate "graphql" modules cannot be used at the same time since different
versions may have different capabilities and behavior. The data from one
version used in the function from another could produce confusing and
spurious results.`)}}return!1};class Q{constructor(t,n="GraphQL request",s={line:1,column:1}){typeof t=="string"||C(!1,`Body must be a string. Received: ${J(t)}.`),this.body=t,this.name=n,this.locationOffset=s,this.locationOffset.line>0||C(!1,"line in locationOffset is 1-indexed and must be positive."),this.locationOffset.column>0||C(!1,"column in locationOffset is 1-indexed and must be positive.")}get[Symbol.toStringTag](){return"Source"}}function Ae(e){return _e(e,Q)}function Se(e,t){return new F(e,t).parseDocument()}function ke(e,t){const n=new F(e,t);n.expectToken(o.SOF);const s=n.parseValueLiteral(!1);return n.expectToken(o.EOF),s}function Ce(e,t){const n=new F(e,t);n.expectToken(o.SOF);const s=n.parseTypeReference();return n.expectToken(o.EOF),s}class F{constructor(t,n={}){const s=Ae(t)?t:new Q(t);this._lexer=new re(s),this._options=n,this._tokenCounter=0}parseName(){const t=this.expectToken(o.NAME);return this.node(t,{kind:c.NAME,value:t.value})}parseDocument(){return this.node(this._lexer.token,{kind:c.DOCUMENT,definitions:this.many(o.SOF,this.parseDefinition,o.EOF)})}parseDefinition(){if(this.peek(o.BRACE_L))return this.parseOperationDefinition();const t=this.peekDescription(),n=t?this._lexer.lookahead():this._lexer.token;if(n.kind===o.NAME){switch(n.value){case"schema":return this.parseSchemaDefinition();case"scalar":return this.parseScalarTypeDefinition();case"type":return this.parseObjectTypeDefinition();case"interface":return this.parseInterfaceTypeDefinition();case"union":return this.parseUnionTypeDefinition();case"enum":return this.parseEnumTypeDefinition();case"input":return this.parseInputObjectTypeDefinition();case"directive":return this.parseDirectiveDefinition()}if(t)throw d(this._lexer.source,this._lexer.token.start,"Unexpected description, descriptions are supported only on type definitions.");switch(n.value){case"query":case"mutation":case"subscription":return this.parseOperationDefinition();case"fragment":return this.parseFragmentDefinition();case"extend":return this.parseTypeSystemExtension()}}throw this.unexpected(n)}parseOperationDefinition(){const t=this._lexer.token;if(this.peek(o.BRACE_L))return this.node(t,{kind:c.OPERATION_DEFINITION,operation:O.QUERY,name:void 0,variableDefinitions:[],directives:[],selectionSet:this.parseSelectionSet()});const n=this.parseOperationType();let s;return this.peek(o.NAME)&&(s=this.parseName()),this.node(t,{kind:c.OPERATION_DEFINITION,operation:n,name:s,variableDefinitions:this.parseVariableDefinitions(),directives:this.parseDirectives(!1),selectionSet:this.parseSelectionSet()})}parseOperationType(){const t=this.expectToken(o.NAME);switch(t.value){case"query":return O.QUERY;case"mutation":return O.MUTATION;case"subscription":return O.SUBSCRIPTION}throw this.unexpected(t)}parseVariableDefinitions(){return this.optionalMany(o.PAREN_L,this.parseVariableDefinition,o.PAREN_R)}parseVariableDefinition(){return this.node(this._lexer.token,{kind:c.VARIABLE_DEFINITION,variable:this.parseVariable(),type:(this.expectToken(o.COLON),this.parseTypeReference()),defaultValue:this.expectOptionalToken(o.EQUALS)?this.parseConstValueLiteral():void 0,directives:this.parseConstDirectives()})}parseVariable(){const t=this._lexer.token;return this.expectToken(o.DOLLAR),this.node(t,{kind:c.VARIABLE,name:this.parseName()})}parseSelectionSet(){return this.node(this._lexer.token,{kind:c.SELECTION_SET,selections:this.many(o.BRACE_L,this.parseSelection,o.BRACE_R)})}parseSelection(){return this.peek(o.SPREAD)?this.parseFragment():this.parseField()}parseField(){const t=this._lexer.token,n=this.parseName();let s,i;return this.expectOptionalToken(o.COLON)?(s=n,i=this.parseName()):i=n,this.node(t,{kind:c.FIELD,alias:s,name:i,arguments:this.parseArguments(!1),directives:this.parseDirectives(!1),selectionSet:this.peek(o.BRACE_L)?this.parseSelectionSet():void 0})}parseArguments(t){const n=t?this.parseConstArgument:this.parseArgument;return this.optionalMany(o.PAREN_L,n,o.PAREN_R)}parseArgument(t=!1){const n=this._lexer.token,s=this.parseName();return this.expectToken(o.COLON),this.node(n,{kind:c.ARGUMENT,name:s,value:this.parseValueLiteral(t)})}parseConstArgument(){return this.parseArgument(!0)}parseFragment(){const t=this._lexer.token;this.expectToken(o.SPREAD);const n=this.expectOptionalKeyword("on");return!n&&this.peek(o.NAME)?this.node(t,{kind:c.FRAGMENT_SPREAD,name:this.parseFragmentName(),directives:this.parseDirectives(!1)}):this.node(t,{kind:c.INLINE_FRAGMENT,typeCondition:n?this.parseNamedType():void 0,directives:this.parseDirectives(!1),selectionSet:this.parseSelectionSet()})}parseFragmentDefinition(){const t=this._lexer.token;return this.expectKeyword("fragment"),this._options.allowLegacyFragmentVariables===!0?this.node(t,{kind:c.FRAGMENT_DEFINITION,name:this.parseFragmentName(),variableDefinitions:this.parseVariableDefinitions(),typeCondition:(this.expectKeyword("on"),this.parseNamedType()),directives:this.parseDirectives(!1),selectionSet:this.parseSelectionSet()}):this.node(t,{kind:c.FRAGMENT_DEFINITION,name:this.parseFragmentName(),typeCondition:(this.expectKeyword("on"),this.parseNamedType()),directives:this.parseDirectives(!1),selectionSet:this.parseSelectionSet()})}parseFragmentName(){if(this._lexer.token.value==="on")throw this.unexpected();return this.parseName()}parseValueLiteral(t){const n=this._lexer.token;switch(n.kind){case o.BRACKET_L:return this.parseList(t);case o.BRACE_L:return this.parseObject(t);case o.INT:return this.advanceLexer(),this.node(n,{kind:c.INT,value:n.value});case o.FLOAT:return this.advanceLexer(),this.node(n,{kind:c.FLOAT,value:n.value});case o.STRING:case o.BLOCK_STRING:return this.parseStringLiteral();case o.NAME:switch(this.advanceLexer(),n.value){case"true":return this.node(n,{kind:c.BOOLEAN,value:!0});case"false":return this.node(n,{kind:c.BOOLEAN,value:!1});case"null":return this.node(n,{kind:c.NULL});default:return this.node(n,{kind:c.ENUM,value:n.value})}case o.DOLLAR:if(t)if(this.expectToken(o.DOLLAR),this._lexer.token.kind===o.NAME){const s=this._lexer.token.value;throw d(this._lexer.source,n.start,`Unexpected variable "$${s}" in constant value.`)}else throw this.unexpected(n);return this.parseVariable();default:throw this.unexpected()}}parseConstValueLiteral(){return this.parseValueLiteral(!0)}parseStringLiteral(){const t=this._lexer.token;return this.advanceLexer(),this.node(t,{kind:c.STRING,value:t.value,block:t.kind===o.BLOCK_STRING})}parseList(t){const n=()=>this.parseValueLiteral(t);return this.node(this._lexer.token,{kind:c.LIST,values:this.any(o.BRACKET_L,n,o.BRACKET_R)})}parseObject(t){const n=()=>this.parseObjectField(t);return this.node(this._lexer.token,{kind:c.OBJECT,fields:this.any(o.BRACE_L,n,o.BRACE_R)})}parseObjectField(t){const n=this._lexer.token,s=this.parseName();return this.expectToken(o.COLON),this.node(n,{kind:c.OBJECT_FIELD,name:s,value:this.parseValueLiteral(t)})}parseDirectives(t){const n=[];for(;this.peek(o.AT);)n.push(this.parseDirective(t));return n}parseConstDirectives(){return this.parseDirectives(!0)}parseDirective(t){const n=this._lexer.token;return this.expectToken(o.AT),this.node(n,{kind:c.DIRECTIVE,name:this.parseName(),arguments:this.parseArguments(t)})}parseTypeReference(){const t=this._lexer.token;let n;if(this.expectOptionalToken(o.BRACKET_L)){const s=this.parseTypeReference();this.expectToken(o.BRACKET_R),n=this.node(t,{kind:c.LIST_TYPE,type:s})}else n=this.parseNamedType();return this.expectOptionalToken(o.BANG)?this.node(t,{kind:c.NON_NULL_TYPE,type:n}):n}parseNamedType(){return this.node(this._lexer.token,{kind:c.NAMED_TYPE,name:this.parseName()})}peekDescription(){return this.peek(o.STRING)||this.peek(o.BLOCK_STRING)}parseDescription(){if(this.peekDescription())return this.parseStringLiteral()}parseSchemaDefinition(){const t=this._lexer.token,n=this.parseDescription();this.expectKeyword("schema");const s=this.parseConstDirectives(),i=this.many(o.BRACE_L,this.parseOperationTypeDefinition,o.BRACE_R);return this.node(t,{kind:c.SCHEMA_DEFINITION,description:n,directives:s,operationTypes:i})}parseOperationTypeDefinition(){const t=this._lexer.token,n=this.parseOperationType();this.expectToken(o.COLON);const s=this.parseNamedType();return this.node(t,{kind:c.OPERATION_TYPE_DEFINITION,operation:n,type:s})}parseScalarTypeDefinition(){const t=this._lexer.token,n=this.parseDescription();this.expectKeyword("scalar");const s=this.parseName(),i=this.parseConstDirectives();return this.node(t,{kind:c.SCALAR_TYPE_DEFINITION,description:n,name:s,directives:i})}parseObjectTypeDefinition(){const t=this._lexer.token,n=this.parseDescription();this.expectKeyword("type");const s=this.parseName(),i=this.parseImplementsInterfaces(),r=this.parseConstDirectives(),a=this.parseFieldsDefinition();return this.node(t,{kind:c.OBJECT_TYPE_DEFINITION,description:n,name:s,interfaces:i,directives:r,fields:a})}parseImplementsInterfaces(){return this.expectOptionalKeyword("implements")?this.delimitedMany(o.AMP,this.parseNamedType):[]}parseFieldsDefinition(){return this.optionalMany(o.BRACE_L,this.parseFieldDefinition,o.BRACE_R)}parseFieldDefinition(){const t=this._lexer.token,n=this.parseDescription(),s=this.parseName(),i=this.parseArgumentDefs();this.expectToken(o.COLON);const r=this.parseTypeReference(),a=this.parseConstDirectives();return this.node(t,{kind:c.FIELD_DEFINITION,description:n,name:s,arguments:i,type:r,directives:a})}parseArgumentDefs(){return this.optionalMany(o.PAREN_L,this.parseInputValueDef,o.PAREN_R)}parseInputValueDef(){const t=this._lexer.token,n=this.parseDescription(),s=this.parseName();this.expectToken(o.COLON);const i=this.parseTypeReference();let r;this.expectOptionalToken(o.EQUALS)&&(r=this.parseConstValueLiteral());const a=this.parseConstDirectives();return this.node(t,{kind:c.INPUT_VALUE_DEFINITION,description:n,name:s,type:i,defaultValue:r,directives:a})}parseInterfaceTypeDefinition(){const t=this._lexer.token,n=this.parseDescription();this.expectKeyword("interface");const s=this.parseName(),i=this.parseImplementsInterfaces(),r=this.parseConstDirectives(),a=this.parseFieldsDefinition();return this.node(t,{kind:c.INTERFACE_TYPE_DEFINITION,description:n,name:s,interfaces:i,directives:r,fields:a})}parseUnionTypeDefinition(){const t=this._lexer.token,n=this.parseDescription();this.expectKeyword("union");const s=this.parseName(),i=this.parseConstDirectives(),r=this.parseUnionMemberTypes();return this.node(t,{kind:c.UNION_TYPE_DEFINITION,description:n,name:s,directives:i,types:r})}parseUnionMemberTypes(){return this.expectOptionalToken(o.EQUALS)?this.delimitedMany(o.PIPE,this.parseNamedType):[]}parseEnumTypeDefinition(){const t=this._lexer.token,n=this.parseDescription();this.expectKeyword("enum");const s=this.parseName(),i=this.parseConstDirectives(),r=this.parseEnumValuesDefinition();return this.node(t,{kind:c.ENUM_TYPE_DEFINITION,description:n,name:s,directives:i,values:r})}parseEnumValuesDefinition(){return this.optionalMany(o.BRACE_L,this.parseEnumValueDefinition,o.BRACE_R)}parseEnumValueDefinition(){const t=this._lexer.token,n=this.parseDescription(),s=this.parseEnumValueName(),i=this.parseConstDirectives();return this.node(t,{kind:c.ENUM_VALUE_DEFINITION,description:n,name:s,directives:i})}parseEnumValueName(){if(this._lexer.token.value==="true"||this._lexer.token.value==="false"||this._lexer.token.value==="null")throw d(this._lexer.source,this._lexer.token.start,`${D(this._lexer.token)} is reserved and cannot be used for an enum value.`);return this.parseName()}parseInputObjectTypeDefinition(){const t=this._lexer.token,n=this.parseDescription();this.expectKeyword("input");const s=this.parseName(),i=this.parseConstDirectives(),r=this.parseInputFieldsDefinition();return this.node(t,{kind:c.INPUT_OBJECT_TYPE_DEFINITION,description:n,name:s,directives:i,fields:r})}parseInputFieldsDefinition(){return this.optionalMany(o.BRACE_L,this.parseInputValueDef,o.BRACE_R)}parseTypeSystemExtension(){const t=this._lexer.lookahead();if(t.kind===o.NAME)switch(t.value){case"schema":return this.parseSchemaExtension();case"scalar":return this.parseScalarTypeExtension();case"type":return this.parseObjectTypeExtension();case"interface":return this.parseInterfaceTypeExtension();case"union":return this.parseUnionTypeExtension();case"enum":return this.parseEnumTypeExtension();case"input":return this.parseInputObjectTypeExtension()}throw this.unexpected(t)}parseSchemaExtension(){const t=this._lexer.token;this.expectKeyword("extend"),this.expectKeyword("schema");const n=this.parseConstDirectives(),s=this.optionalMany(o.BRACE_L,this.parseOperationTypeDefinition,o.BRACE_R);if(n.length===0&&s.length===0)throw this.unexpected();return this.node(t,{kind:c.SCHEMA_EXTENSION,directives:n,operationTypes:s})}parseScalarTypeExtension(){const t=this._lexer.token;this.expectKeyword("extend"),this.expectKeyword("scalar");const n=this.parseName(),s=this.parseConstDirectives();if(s.length===0)throw this.unexpected();return this.node(t,{kind:c.SCALAR_TYPE_EXTENSION,name:n,directives:s})}parseObjectTypeExtension(){const t=this._lexer.token;this.expectKeyword("extend"),this.expectKeyword("type");const n=this.parseName(),s=this.parseImplementsInterfaces(),i=this.parseConstDirectives(),r=this.parseFieldsDefinition();if(s.length===0&&i.length===0&&r.length===0)throw this.unexpected();return this.node(t,{kind:c.OBJECT_TYPE_EXTENSION,name:n,interfaces:s,directives:i,fields:r})}parseInterfaceTypeExtension(){const t=this._lexer.token;this.expectKeyword("extend"),this.expectKeyword("interface");const n=this.parseName(),s=this.parseImplementsInterfaces(),i=this.parseConstDirectives(),r=this.parseFieldsDefinition();if(s.length===0&&i.length===0&&r.length===0)throw this.unexpected();return this.node(t,{kind:c.INTERFACE_TYPE_EXTENSION,name:n,interfaces:s,directives:i,fields:r})}parseUnionTypeExtension(){const t=this._lexer.token;this.expectKeyword("extend"),this.expectKeyword("union");const n=this.parseName(),s=this.parseConstDirectives(),i=this.parseUnionMemberTypes();if(s.length===0&&i.length===0)throw this.unexpected();return this.node(t,{kind:c.UNION_TYPE_EXTENSION,name:n,directives:s,types:i})}parseEnumTypeExtension(){const t=this._lexer.token;this.expectKeyword("extend"),this.expectKeyword("enum");const n=this.parseName(),s=this.parseConstDirectives(),i=this.parseEnumValuesDefinition();if(s.length===0&&i.length===0)throw this.unexpected();return this.node(t,{kind:c.ENUM_TYPE_EXTENSION,name:n,directives:s,values:i})}parseInputObjectTypeExtension(){const t=this._lexer.token;this.expectKeyword("extend"),this.expectKeyword("input");const n=this.parseName(),s=this.parseConstDirectives(),i=this.parseInputFieldsDefinition();if(s.length===0&&i.length===0)throw this.unexpected();return this.node(t,{kind:c.INPUT_OBJECT_TYPE_EXTENSION,name:n,directives:s,fields:i})}parseDirectiveDefinition(){const t=this._lexer.token,n=this.parseDescription();this.expectKeyword("directive"),this.expectToken(o.AT);const s=this.parseName(),i=this.parseArgumentDefs(),r=this.expectOptionalKeyword("repeatable");this.expectKeyword("on");const a=this.parseDirectiveLocations();return this.node(t,{kind:c.DIRECTIVE_DEFINITION,description:n,name:s,arguments:i,repeatable:r,locations:a})}parseDirectiveLocations(){return this.delimitedMany(o.PIPE,this.parseDirectiveLocation)}parseDirectiveLocation(){const t=this._lexer.token,n=this.parseName();if(Object.prototype.hasOwnProperty.call(L,n.value))return n;throw this.unexpected(t)}node(t,n){return this._options.noLocation!==!0&&(n.loc=new K(t,this._lexer.lastToken,this._lexer.source)),n}peek(t){return this._lexer.token.kind===t}expectToken(t){const n=this._lexer.token;if(n.kind===t)return this.advanceLexer(),n;throw d(this._lexer.source,n.start,`Expected ${X(t)}, found ${D(n)}.`)}expectOptionalToken(t){return this._lexer.token.kind===t?(this.advanceLexer(),!0):!1}expectKeyword(t){const n=this._lexer.token;if(n.kind===o.NAME&&n.value===t)this.advanceLexer();else throw d(this._lexer.source,n.start,`Expected "${t}", found ${D(n)}.`)}expectOptionalKeyword(t){const n=this._lexer.token;return n.kind===o.NAME&&n.value===t?(this.advanceLexer(),!0):!1}unexpected(t){const n=t??this._lexer.token;return d(this._lexer.source,n.start,`Unexpected ${D(n)}.`)}any(t,n,s){this.expectToken(t);const i=[];for(;!this.expectOptionalToken(s);)i.push(n.call(this));return i}optionalMany(t,n,s){if(this.expectOptionalToken(t)){const i=[];do i.push(n.call(this));while(!this.expectOptionalToken(s));return i}return[]}many(t,n,s){this.expectToken(t);const i=[];do i.push(n.call(this));while(!this.expectOptionalToken(s));return i}delimitedMany(t,n){this.expectOptionalToken(t);const s=[];do s.push(n.call(this));while(this.expectOptionalToken(t));return s}advanceLexer(){const{maxTokens:t}=this._options,n=this._lexer.advance();if(t!==void 0&&n.kind!==o.EOF&&(++this._tokenCounter,this._tokenCounter>t))throw d(this._lexer.source,n.start,`Document contains more that ${t} tokens. Parsing aborted.`)}}function D(e){const t=e.value;return X(e.kind)+(t!=null?` "${t}"`:"")}function X(e){return oe(e)?`"${e}"`:e}export{L as D,b as G,c as K,O,ee as Q,ye as a,Ce as b,De as c,C as d,ne as e,j as f,_e as g,z as h,J as i,q as j,ke as k,Se as p};