var o=Object.defineProperty,n=(a,e)=>o(a,"name",{value:e,configurable:!0});class l{constructor(e){this.getStartOfToken=()=>this._start,this.getCurrentPosition=()=>this._pos,this.eol=()=>this._sourceText.length===this._pos,this.sol=()=>this._pos===0,this.peek=()=>this._sourceText.charAt(this._pos)?this._sourceText.charAt(this._pos):null,this.next=()=>{const t=this._sourceText.charAt(this._pos);return this._pos++,t},this.eat=t=>{if(this._testNextCharacter(t))return this._start=this._pos,this._pos++,this._sourceText.charAt(this._pos-1)},this.eatWhile=t=>{let s=this._testNextCharacter(t),r=!1;for(s&&(r=s,this._start=this._pos);s;)this._pos++,s=this._testNextCharacter(t),r=!0;return r},this.eatSpace=()=>this.eatWhile(/[\s\u00a0]/),this.skipToEnd=()=>{this._pos=this._sourceText.length},this.skipTo=t=>{this._pos=t},this.match=(t,s=!0,r=!1)=>{let i=null,h=null;return typeof t=="string"?(h=new RegExp(t,r?"i":"g").test(this._sourceText.substr(this._pos,t.length)),i=t):t instanceof RegExp&&(h=this._sourceText.slice(this._pos).match(t),i=h==null?void 0:h[0]),h!=null&&(typeof t=="string"||h instanceof Array&&this._sourceText.startsWith(h[0],this._pos))?(s&&(this._start=this._pos,i&&i.length&&(this._pos+=i.length)),h):!1},this.backUp=t=>{this._pos-=t},this.column=()=>this._pos,this.indentation=()=>{const t=this._sourceText.match(/\s*/);let s=0;if(t&&t.length!==0){const r=t[0];let i=0;for(;r.length>i;)r.charCodeAt(i)===9?s+=2:s++,i++}return s},this.current=()=>this._sourceText.slice(this._start,this._pos),this._start=0,this._pos=0,this._sourceText=e}_testNextCharacter(e){const t=this._sourceText.charAt(this._pos);let s=!1;return typeof e=="string"?s=t===e:s=e instanceof RegExp?e.test(t):e(t),s}}n(l,"CharacterStream");class _{constructor(e,t){this.containsPosition=s=>this.start.line===s.line?this.start.character<=s.character:this.end.line===s.line?this.end.character>=s.character:this.start.line<=s.line&&this.end.line>=s.line,this.start=e,this.end=t}setStart(e,t){this.start=new c(e,t)}setEnd(e,t){this.end=new c(e,t)}}n(_,"Range");class c{constructor(e,t){this.lessThanOrEqualTo=s=>this.line<s.line||this.line===s.line&&this.character<=s.character,this.line=e,this.character=t}setLine(e){this.line=e}setCharacter(e){this.character=e}}n(c,"Position");export{l as C,c as P,_ as R};