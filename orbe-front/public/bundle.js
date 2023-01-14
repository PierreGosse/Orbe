(()=>{"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function o(t){t.forEach(e)}function r(t){return"function"==typeof t}function s(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function c(t){return 0===Object.keys(t).length}new Set;let i,l=!1;function a(t,e){t.appendChild(e)}function u(t){t.parentNode&&t.parentNode.removeChild(t)}function d(t){return document.createElement(t)}function f(t){return document.createTextNode(t)}function $(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function h(t){i=t}new Map;const p=[],m=[],b=[],g=[],y=Promise.resolve();let _=!1;function w(t){b.push(t)}const k=new Set;let x=0;function v(){if(0!==x)return;const t=i;do{try{for(;x<p.length;){const t=p[x];x++,h(t),E(t.$$)}}catch(t){throw p.length=0,x=0,t}for(h(null),p.length=0,x=0;m.length;)m.pop()();for(let t=0;t<b.length;t+=1){const e=b[t];k.has(e)||(k.add(e),e())}b.length=0}while(p.length);for(;g.length;)g.pop()();_=!1,k.clear(),h(t)}function E(t){if(null!==t.fragment){t.update(),o(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(w)}}const C=new Set;let S;function T(t,e){const n=t.$$;null!==n.fragment&&(o(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function j(s,c,a,d,f,$,m,b=[-1]){const g=i;h(s);const k=s.$$={fragment:null,ctx:[],props:$,update:t,not_equal:f,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(c.context||(g?g.$$.context:[])),callbacks:n(),dirty:b,skip_bound:!1,root:c.target||g.$$.root};m&&m(k.root);let x=!1;if(k.ctx=a?a(s,c.props||{},((t,e,...n)=>{const o=n.length?n[0]:e;return k.ctx&&f(k.ctx[t],k.ctx[t]=o)&&(!k.skip_bound&&k.bound[t]&&k.bound[t](o),x&&function(t,e){-1===t.$$.dirty[0]&&(p.push(t),_||(_=!0,y.then(v)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}(s,t)),e})):[],k.update(),x=!0,o(k.before_update),k.fragment=!!d&&d(k.ctx),c.target){if(c.hydrate){l=!0;const t=(T=c.target,Array.from(T.childNodes));k.fragment&&k.fragment.l(t),t.forEach(u)}else k.fragment&&k.fragment.c();c.intro&&((E=s.$$.fragment)&&E.i&&(C.delete(E),E.i(S))),function(t,n,s,c){const{fragment:i,after_update:l}=t.$$;i&&i.m(n,s),c||w((()=>{const n=t.$$.on_mount.map(e).filter(r);t.$$.on_destroy?t.$$.on_destroy.push(...n):o(n),t.$$.on_mount=[]})),l.forEach(w)}(s,c.target,c.anchor,c.customElement),l=!1,v()}var E,S,T;h(g)}"undefined"!=typeof window?window:"undefined"!=typeof globalThis?globalThis:global,new Set(["allowfullscreen","allowpaymentrequest","async","autofocus","autoplay","checked","controls","default","defer","disabled","formnovalidate","hidden","inert","ismap","itemscope","loop","multiple","muted","nomodule","novalidate","open","playsinline","readonly","required","reversed","selected"]),"function"==typeof HTMLElement&&(S=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){const{on_mount:t}=this.$$;this.$$.on_disconnect=t.map(e).filter(r);for(const t in this.$$.slotted)this.appendChild(this.$$.slotted[t])}attributeChangedCallback(t,e,n){this[t]=n}disconnectedCallback(){o(this.$$.on_disconnect)}$destroy(){T(this,1),this.$destroy=t}$on(e,n){if(!r(n))return t;const o=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return o.push(n),()=>{const t=o.indexOf(n);-1!==t&&o.splice(t,1)}}$set(t){this.$$set&&!c(t)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}});class M{$destroy(){T(this,1),this.$destroy=t}$on(e,n){if(!r(n))return t;const o=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return o.push(n),()=>{const t=o.indexOf(n);-1!==t&&o.splice(t,1)}}$set(t){this.$$set&&!c(t)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function A(e){let n,o,r,s,c,i,l;return{c(){n=d("main"),o=d("h1"),r=f("Hello "),s=f(e[0]),c=f("!"),i=f(" "),l=d("p"),l.innerHTML='Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.',$(o,"class","svelte-1tky8bj"),$(n,"class","svelte-1tky8bj")},m(t,e){(function(t,e,n){t.insertBefore(e,n||null)})(t,n,e),a(n,o),a(o,r),a(o,s),a(o,c),a(n,i),a(n,l)},p(t,[e]){var n,o;1&e&&(n=s,o=""+(o=t[0]),n.wholeText!==o&&(n.data=o))},i:t,o:t,d(t){t&&u(n)}}}function H(t,e,n){let{name:o}=e;return t.$$set=t=>{"name"in t&&n(0,o=t.name)},[o]}new class extends M{constructor(t){super(),j(this,t,H,A,s,{name:0})}}({target:document.body,props:{name:"world"}})})();