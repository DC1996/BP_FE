(function(e){function t(t){for(var r,o,i=t[0],c=t[1],l=t[2],v=0,f=[];v<i.length;v++)o=i[v],Object.prototype.hasOwnProperty.call(s,o)&&s[o]&&f.push(s[o][0]),s[o]=0;for(r in c)Object.prototype.hasOwnProperty.call(c,r)&&(e[r]=c[r]);u&&u(t);while(f.length)f.shift()();return n.push.apply(n,l||[]),a()}function a(){for(var e,t=0;t<n.length;t++){for(var a=n[t],r=!0,i=1;i<a.length;i++){var c=a[i];0!==s[c]&&(r=!1)}r&&(n.splice(t--,1),e=o(o.s=a[0]))}return e}var r={},s={app:0},n=[];function o(t){if(r[t])return r[t].exports;var a=r[t]={i:t,l:!1,exports:{}};return e[t].call(a.exports,a,a.exports,o),a.l=!0,a.exports}o.m=e,o.c=r,o.d=function(e,t,a){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:a})},o.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var a=Object.create(null);if(o.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)o.d(a,r,function(t){return e[t]}.bind(null,r));return a},o.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="/";var i=window["webpackJsonp"]=window["webpackJsonp"]||[],c=i.push.bind(i);i.push=t,i=i.slice();for(var l=0;l<i.length;l++)t(i[l]);var u=c;n.push([0,"chunk-vendors"]),a()})({0:function(e,t,a){e.exports=a("56d7")},"034f":function(e,t,a){"use strict";a("85ec")},1:function(e,t){},"48d1":function(e,t,a){},5143:function(e,t,a){e.exports=a.p+"img/math_logo2.081c44e3.svg"},"56d7":function(e,t,a){"use strict";a.r(t);a("e260"),a("e6cf"),a("cca6"),a("a79d");var r=a("2b0e"),s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-app",{staticClass:"custom-font"},[a("NavbarVue"),a("v-main",{staticClass:"ma-2"},[a("router-view")],1)],1)},n=[],o=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("v-app-bar",{staticClass:"px-8 py-6 pb-16",attrs:{id:"navbar",app:"",color:"white",light:"",flat:""}},[r("v-row",{attrs:{justify:"center",align:"center"}},[r("div",{staticClass:"d-flex align-center"},[r("router-link",{attrs:{to:"/"}},[r("v-img",{staticClass:"shrink",attrs:{alt:"Math Logo by IC",contain:"",src:a("5143"),transition:"fab-transition",width:"130"}})],1)],1),r("v-spacer"),r("v-scroll-x-transition",[r("v-btn",{staticClass:"no-uppercase mx-4",attrs:{text:"",large:"",color:"#1A936F"},on:{click:e.test}},[r("span",{},[e._v("Create task")])])],1),r("router-link",{attrs:{to:"/createTask"}},[r("v-btn",{staticClass:"no-uppercase mx-4",attrs:{href:"#",target:"_blank",text:"",large:"",color:"#114B5F"}},[r("span",[e._v("Create test")])])],1),r("router-link",{attrs:{to:"/yourTasks"}},[r("v-btn",{staticClass:"no-uppercase mx-4",attrs:{href:"#",target:"_blank",text:"",large:"",color:"#114B5F"}},[r("span",[e._v("Your history")])])],1),r("v-btn",{staticClass:"no-uppercase mx-4",attrs:{href:"#",target:"_blank",text:"",large:"",plain:"",color:"#114B5F"}},[e._v(" Login "),r("v-icon",[e._v("mdi-login")])],1)],1)],1)},i=[],c=a("bee2"),l=a("d4ec"),u=(a("ac1f"),a("00b4"),Object(c["a"])((function e(t,a){Object(l["a"])(this,e),this.type=t,this.value=a}))),v=0,f=11,p=22,d=33,b=44;function h(e){for(var t="",a=[],r=v,s=0;s<e.length;s++){var n=e[s];switch(r){case v:switch(t=n,n){case"$":r=f;break;case"#":r=p;break;case"@":r=d;break;case" ":break;case"\t":break;case"\n":a.push(new u("newline",n));break;case"(":a.push(new u("l-parenth",n));break;case")":a.push(new u("r-parenth",n));break;case"[":a.push(new u("l-bracket",n));break;case"]":a.push(new u("r-bracket",n));break;case"+":a.push(new u("add",n));break;case"-":a.push(new u("sub",n));break;case"/":a.push(new u("div",n));break;case"*":a.push(new u("mul",n));break;case",":a.push(new u("comma",n));break;case"=":a.push(new u("eq",n));break;case"^":a.push(new u("caret",n));break;default:if(/[\s$#@()+\-\^/*,=\[\]]/.test(e[s+1])){isNaN(+t)?a.push(new u("text",t)):a.push(new u("number",t));break}r=b;break}break;case f:if(/[a-zA-Z0-9\_]/.test(n)){if(t+=n,!/[a-zA-Z0-9\_]/.test(e[s+1])){a.push(new u("var",t)),r=v;break}r=f;break}a.push(t),r=v;break;case p:if(/[a-zA-Z]/.test(n)){if(t+=n,!/[a-zA-Z]/.test(e[s+1])){a.push(new u("keyword",t)),r=v;break}r=p;break}a.push(new u("hash",t)),r=v;break;case d:if(/[a-zA-Z0-9\_]/.test(n)){if(t+=n,!/[a-zA-Z0-9\_]/.test(e[s+1])){a.push(new u("answer",t)),r=v;break}r=d;break}a.push(new u("at",t)),r=v;break;case b:if(/[\s$#@()+\-\^/*,=\[\]]/.test(e[s+1])){t+=n,isNaN(+t)?"."==t[0]?a.push(new u("accessor",t)):a.push(new u("text",t)):a.push(new u("number",t)),r=v;break}t+=n;break}}return a}var m={methods:{test:function(){console.log(h())}}},k=m,x=a("2877"),y=a("6544"),g=a.n(y),w=a("40dc"),_=a("8336"),C=a("132d"),V=a("adda"),j=a("0fd9"),O=a("0789"),S=a("2fa4"),T=Object(x["a"])(k,o,i,!1,null,null,null),A=T.exports;g()(T,{VAppBar:w["a"],VBtn:_["a"],VIcon:C["a"],VImg:V["a"],VRow:j["a"],VScrollXTransition:O["d"],VSpacer:S["a"]});var q={name:"App",components:{NavbarVue:A}},I=q,M=(a("034f"),a("7496")),P=a("f6c4"),E=Object(x["a"])(I,s,n,!1,null,null,null),N=E.exports;g()(E,{VApp:M["a"],VMain:P["a"]});var $=a("8c4f"),B=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-app",{staticClass:"custom-font"},[a("NavbarVue"),a("v-main",{staticClass:"ma-2"},[a("createtaskpageVue")],1)],1)},z=[],F=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-container",{staticClass:"d-flex flex-column justify-start align-center mt-10 b-g rounded-lg"},[a("h3",{staticClass:"t-t-color text-h4 my-4 font-weight-medium"},[e._v(" Task ")]),a("v-container",{staticClass:"d-flex flex-row",attrs:{fluid:"",rounded:"",label:"Task"}},[a("v-col",{staticClass:"mx-2 pa-0 ma-0",attrs:{cols:"16"}},[a("v-textarea",{staticClass:"text-caption",attrs:{"text-narrow":"",id:"task-text",solo:"","no-resize":"",rows:"20"},model:{value:e.text,callback:function(t){e.text=t},expression:"text"}}),a("div",[a("v-btn",{staticClass:"mx-1",on:{click:e.parseText}},[e._v("Parse")]),a("v-btn",{staticClass:"mx-1",on:{click:e.previewTask}},[e._v("Preview")]),a("v-btn",{staticClass:"mx-1",on:{click:e.saveText}},[e._v("Save")]),a("v-btn",{staticClass:"mx-1",on:{click:e.restoreText}},[e._v("Restore")])],1),a("v-overlay",{attrs:{value:e.taskOverlay}},[a("v-sheet",{staticClass:"pa-4 ma-2 d-flex flex-column justify-flex-start align-flex-start rounded-lg",attrs:{elevation:"4",width:"600"}},[a("h3",[e._v("Task text: "+e._s(e.task_text))]),e._l(e.questions,(function(t,r){return a("div",{key:t,staticClass:"d-flex flex-column ma-2 pa-1"},[a("h4",{staticClass:"ma-1"},[e._v(" Question: "+e._s(t.text)+" ")]),t.text.includes(e.answers[r].name)?a("div",{staticClass:"ma-1 pa-1"},[e._l(e.answers[r].correct_values,(function(t,r){return a("p",{key:r},[e._v(e._s(t))])})),e._l(e.answers[r].incorrect_values,(function(t,r){return a("p",{key:r},[e._v(e._s(t))])}))],2):e._e()])})),a("v-btn",{on:{click:function(t){e.taskOverlay=!1}}},[e._v("Close")])],2)],1)],1),a("v-col",{staticClass:"mx-2",attrs:{cols:"16"}},[a("h4",[e._v(" Variables ")]),e._l(e.variables,(function(t,r){return a("v-chip",{key:r,staticClass:"mx-2 my-1 px-6 py-4 pointer",attrs:{elevation:6,color:"primary"},on:{click:function(t){return e.variableInfo(r)}}},[e._v(" "+e._s(t.name.substr(1))+" ")])})),0!=e.variables.length?a("v-overlay",{attrs:{value:e.overlayV}},[a("v-sheet",{staticClass:"pa-4 ma-2 d-flex flex-column justify-flex-start align-flex-start rounded-lg",attrs:{elevation:"4",width:"250"}},[a("h4",{staticClass:"ma-2"},[e._v(" "+e._s(e.variables[e.indexV].name)+" ")]),a("p",{staticClass:"ma-2"},[e._v(" Definition: "+e._s(e.variables[e.indexV].definition)+" ")]),a("p",{staticClass:"ma-2"},[e._v(" Range: "+e._s(e.variables[e.indexV].range)+" ")]),a("p",{staticClass:"ma-2"},[e._v(" Value: "+e._s(e.variables[e.indexV].value)+" ")]),a("v-btn",{on:{click:function(t){e.overlayV=!1}}},[e._v("Close")])],1)],1):e._e(),a("h4",[e._v("Questions")]),e._l(e.questions,(function(t){return a("v-sheet",{key:t,staticClass:"d-flex flex-row align-center ma-1 pa-1",attrs:{width:"50%",elevation:"3",rounded:""}},[a("v-tooltip",{attrs:{top:""},scopedSlots:e._u([{key:"activator",fn:function(r){var s=r.on;return[a("v-chip",e._g({staticClass:"mx-1",attrs:{label:"text"}},s),[e._v(" "+e._s(t.text)+" ")])]}}],null,!0)},[a("span",[e._v("Text")])])],1)})),a("h5",[e._v("Answers")]),e._l(e.answers,(function(t,r){return a("v-chip",{key:r,staticClass:"mx-2 my-1 px-6 py-4 pointer",attrs:{elevation:6,color:"primary"},on:{click:function(t){return e.answerInfo(r)}}},[e._v(" "+e._s(t.name.substr(1))+" ")])})),0!=e.answers.length?a("v-overlay",{attrs:{value:e.overlayA}},[a("v-sheet",{staticClass:"pa-4 ma-2 d-flex flex-column justify-flex-start align-flex-start rounded-lg",attrs:{elevation:"4",width:"250"}},[a("h4",{staticClass:"ma-2"},[e._v(" "+e._s(e.answers[e.indexA].name)+" ")]),e._l(e.answers[e.indexA].correct,(function(t){return a("p",{key:t,staticClass:"ma-2"},[e._v(" Correct: "+e._s(t)+" ")])})),e._l(e.answers[e.indexA].incorrect,(function(t){return a("p",{key:t,staticClass:"ma-2"},[e._v(" Incorrect: "+e._s(t)+" ")])})),a("v-btn",{on:{click:function(t){e.overlayA=!1}}},[e._v("Close")])],2)],1):e._e()],2)],1)],1)},Z=[],R=a("3835"),D=a("b85c"),L=(a("d3b7"),a("ddb0"),a("1276"),a("25f0"),a("5319"),a("b0c0"),a("159b"),a("4ec9"),a("3ca3"),a("33d1"),a("ea98"),2),Q=3,Y=4,J=6,U=7,W=8,X=Object(c["a"])((function e(t){Object(l["a"])(this,e),this.name=t,this.definition="",this.range="",this.value=0})),G=Object(c["a"])((function e(t){Object(l["a"])(this,e),this.name=t,this.correct=[],this.incorrect=[],this.correct_values=[],this.incorrect_values=[]})),H=Object(c["a"])((function e(){Object(l["a"])(this,e),this.text="",this.answers=new Map}));function K(e){var t=h(e),a=new Map;a.set("task-text","");for(var r="",s=0,n=v,o=0;o<t.length;o++){var i=t[o],c=o+1==t.length?t[o]:t[o+1];switch(n){case v:if("keyword"==i.type&&"#text"==i.value){n=b;break}if("keyword"==i.type&&"#question"==i.value){n=L,s++,a.set("q"+s.toString(),new H);break}if("keyword"==i.type&&"#definitions"==i.value){n=Q;break}if("keyword"==i.type&&"#ranges"==i.value){n=Y;break}if("newline"==i.type)break;break;case b:if("newline"!=i.type){var l=a.get("task-text");l+=i.value+" ",a.set("task-text",l)}if("keyword"==c.type){n=v;break}break;case L:var u=a.get("q"+s.toString());if("newline"!=i.type&&(u.text+=i.value+" "),a.set("q"+s.toString(),u),"keyword"==c.type){n=v;break}break;case Q:if("var"==i.type&&"eq"==c.type){a.set(i.value,new X(i.value)),r=i.value,n=f,o+=1;break}if("var"==i.type&&"newline"==c.type){a.set(i.value,new X(i.value)),o+=1;break}if("answer"==i.type){var p=a.get("q"+s.toString());r=i.value,void 0==p.answers.get(i.value)&&p.answers.set(i.value,new G(i.value)),a.set("q"+s.toString(),p),r=i.value,n=d;break}if("keyword"==c.type){n=v;break}break;case f:var m=a.get(r);if(m.definition+=i.value,a.set(r,m),"newline"==c.type){n=Q;break}break;case d:if("newline"==c.type){n=Q;break}if("accessor"==i.type&&".correct"==i.value){n=U;break}if("accessor"==i.type&&".incorrect"==i.value){n=W;break}break;case U:if("r-bracket"==c.type){n=Q;break}if("eq"==i.type||"newline"==i.type)break;var k=a.get("q"+s.toString()),x=k.answers.get(r);if("l-bracket"==i.type||"comma"==i.type){x.correct.push(""),k.answers.set(r,x),a.set("q"+s.toString(),k);break}var y=x.correct.at(-1);if(y+=i.value,x.correct[x.correct.length-1]=y,k.answers.set(r,x),a.set("q"+s.toString(),k),"r-bracket"==c.type){n=Q;break}break;case W:if("]"==c.value){n=Q;break}if("eq"==i.type||"newline"==i.type)break;var g=a.get("q"+s.toString()),w=g.answers.get(r);if("l-bracket"==i.type||"comma"==i.type){w.incorrect.push(""),g.answers.set(r,w),a.set("q"+s.toString(),g);break}var _=w.incorrect.at(-1);_+=i.value,w.incorrect[w.incorrect.length-1]=_,g.answers.set(r,w),a.set("q"+s.toString(),g);break;case Y:if("var"==i.type){r=i.value,n=J,o+=2;break}"newline"==c.type&&(n=v);break;case J:var C=a.get(r);if(C.range+=i.value,a.set(r,C),"newline"==c.type){n=Y;break}break}}return a}var ee=a("acd5"),te=a("d932"),ae={data:function(){return{text:"",task_text:"",variables:[],questions:[],answers:[],overlayV:!1,overlayA:!1,taskOverlay:!1,indexV:0,indexA:0}},computed:{getText:function(){return this.text}},created:function(){window.addEventListener("beforeunload",(function(e){e.returnValue="Write something",alert("wait")}))},methods:{variableInfo:function(e){this.indexV=e,this.overlayV=!0},answerInfo:function(e){this.indexA=e,this.overlayA=!0},previewTask:function(){this.taskOverlay=!0,localStorage.setItem("data",this.text)},saveText:function(){localStorage.setItem("data",this.text)},restoreText:function(){this.text=localStorage.getItem("data")},parseText:function(){var e=this;console.log(h(this.text));var t=K(this.text);console.log(t),this.variables=[],this.questions=[],this.answers=[],this.task_text="",this.task_text=t.get("task-text"),console.log("TADAAAA",this.task_text);var a,r=Object(D["a"])(t.entries());try{for(r.s();!(a=r.n()).done;){var s=Object(R["a"])(a.value,2),n=s[0],o=s[1];console.log(n),o instanceof X&&this.variables.push(o),o instanceof H&&this.questions.push(o)}}catch(w){r.e(w)}finally{r.f()}var i,c=Object(D["a"])(this.questions);try{for(c.s();!(i=c.n()).done;){var l,u=i.value,v=Object(D["a"])(u.answers.entries());try{for(v.s();!(l=v.n()).done;){var f=Object(R["a"])(l.value,2),p=f[0],d=f[1];console.log(p),this.answers.push(d)}}catch(w){v.e(w)}finally{v.f()}}}catch(w){c.e(w)}finally{c.f()}var b,m=Object(D["a"])(this.variables);try{var k=function(){var t=b.value;if(0!=t.range.length){var a=t.range.substring(1,t.range.length-1).split(","),r=Object(R["a"])(a,3),s=r[0],n=r[1],o=r[2];console.log(s,n,o),t.value=Object(ee["ee"])(parseInt(s),parseInt(n)).toString()}else t.value=t.definition;e.task_text=e.task_text.replace(t.name,t.value);var i,c=Object(D["a"])(e.answers);try{var l=function(){var e=i.value;e.correct.forEach((function(a,r){e.correct[r]=a.replace(t.name,t.value)})),e.incorrect.forEach((function(a,r){e.incorrect[r]=a.replace(t.name,t.value)}))};for(c.s();!(i=c.n()).done;)l()}catch(w){c.e(w)}finally{c.f()}};for(m.s();!(b=m.n()).done;)k()}catch(w){m.e(w)}finally{m.f()}var x,y=Object(D["a"])(this.answers);try{var g=function(){var e=x.value;e.correct.forEach((function(t){e.correct_values.push(Object(te["a"])(t))})),e.incorrect.forEach((function(t){e.incorrect_values.push(Object(te["a"])(t))}))};for(y.s();!(x=y.n()).done;)g()}catch(w){y.e(w)}finally{y.f()}console.log("VARS",this.variables),console.log("QSTN",this.questions),console.log("ANSW",this.answers)}}},re=ae,se=(a("c073"),a("cc20")),ne=a("62ad"),oe=a("a523"),ie=a("a797"),ce=a("8dd9"),le=a("a844"),ue=a("3a2f"),ve=Object(x["a"])(re,F,Z,!1,null,null,null),fe=ve.exports;g()(ve,{VBtn:_["a"],VChip:se["a"],VCol:ne["a"],VContainer:oe["a"],VOverlay:ie["a"],VSheet:ce["a"],VTextarea:le["a"],VTooltip:ue["a"]});var pe={components:{NavbarVue:A,createtaskpageVue:fe}},de=pe,be=Object(x["a"])(de,B,z,!1,null,null,null),he=be.exports;g()(be,{VApp:M["a"],VMain:P["a"]});var me=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("v-container",{staticClass:"d-flex flex-row justify-center align-start mt-10"},[r("v-card",{staticClass:"justify-center align-start px-8 py-4 mx-8 my-2",attrs:{color:"var(--green-background-color)","min-width":"400","max-width":"400","min-height":"480","max-height":"480",elevation:5}},[r("v-card-title",{staticClass:"t-t-color bold font-weight-medium text-h5"},[e._v("Create task")]),r("v-card-text",{staticClass:"d-t-color font-weight-normal text-body-1"},[e._v(" You can create your own task in a few simple steps. ")]),r("v-img",{staticClass:"shrink mx-auto my-0 py-0",attrs:{alt:"Man sitting, reading a math book, pi symbol",contain:"",transition:"scale-transition",src:a("fb68"),"max-height":"220"}}),r("v-card-actions",{staticClass:"d-flex flex-row justify-space-around mt-6"},[r("v-btn",{staticClass:"px-8 py-2 ma-0 no-uppercase t-t-color button-border",attrs:{to:"/yourTasks",elevation:"4",large:"",rounded:"",color:"var(--button-second-color)"}},[e._v(" All tasks ")]),r("v-btn",{staticClass:"px-8 py-2 ma-0 no-uppercase t-t-color button-border",attrs:{to:"/createTask",elevation:"4",large:"",rounded:"",color:"var(--button-color)"}},[e._v(" Create task ")])],1)],1),r("v-card",{staticClass:"justify-center align- px-8 py-4 mx-8 my-2",attrs:{color:"var(--green-background-color)","min-width":"400","max-width":"400","min-height":"480","max-height":"480",elevation:5}},[r("v-card-title",{staticClass:"t-t-color bold font-weight-medium text-h5"},[e._v("Create test")]),r("v-card-text",{staticClass:"d-t-color font-weight-normal text-body-1"},[e._v(" You can create your own test from existing tasks. ")]),r("v-img",{staticClass:"shrink mx-auto mt-9 pt-1",attrs:{alt:"Forms, question marks, cute character",contain:"",src:a("b73f"),"max-height":"240",transition:"scale-transition"}}),r("v-card-actions",{staticClass:"d-flex flex-row justify-space-around mt-6"},[r("v-btn",{staticClass:"px-8 py-2 ma-0 no-uppercase t-t-color button-border",attrs:{elevation:"4",large:"",rounded:"",color:"var(--button-second-color)"}},[e._v(" All tests ")]),r("v-btn",{staticClass:"px-8 py-2 ma-0 no-uppercase t-t-color button-border",attrs:{elevation:"4",large:"",rounded:"",color:"var(--button-color)"}},[e._v(" Create test ")])],1)],1)],1)},ke=[],xe={methods:{page2:function(){this.$router.push({name:"createTask"})}}},ye=xe,ge=a("b0af"),we=a("99d9"),_e=Object(x["a"])(ye,me,ke,!1,null,null,null),Ce=_e.exports;g()(_e,{VBtn:_["a"],VCard:ge["a"],VCardActions:we["a"],VCardText:we["b"],VCardTitle:we["c"],VContainer:oe["a"],VImg:V["a"]});var Ve=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-container",{staticClass:"d-flex flex-column justify-start align-center mt-10 rounded-lg"},[a("h3",{staticClass:"t-t-color text-h4 my-4 font-weight-medium"},[e._v(" All your tasks ")]),a("v-card",{staticClass:"ml-0",attrs:{elevation:"0"}},[a("v-card-title",[a("v-spacer"),a("v-spacer"),a("v-spacer"),a("v-text-field",{attrs:{"append-icon":"mdi-magnify",label:"Search","single-line":"","hide-details":""},model:{value:e.search,callback:function(t){e.search=t},expression:"search"}}),a("v-spacer"),a("v-spacer"),a("v-spacer")],1),a("v-data-table",{attrs:{headers:e.headers,items:e.tasks,"items-per-page":5,search:e.search},scopedSlots:e._u([{key:"item.modify",fn:function(t){var r=t.item;return[a("v-btn",{staticClass:"pa-1",attrs:{plain:""}},[a("v-icon",{attrs:{color:"var(--main-text-color)"}},[e._v("mdi-pencil-outline")])],1),a("v-icon",{on:{click:function(t){return e.modify(r)}}},[e._v("mdi-thumbs-down")]),a("v-btn",{attrs:{plain:""}},[a("v-icon",{attrs:{color:"orange"}},[e._v("mdi-close-circle-outline")])],1),a("v-icon",{on:{click:function(t){return e.modify(r)}}},[e._v("mdi-thumbs-down")])]}}],null,!0)})],1)],1)},je=[],Oe={data:function(){return{search:"",headers:[{text:"Task name",value:"name"},{text:"Last Modified",value:"last_mod"},{text:"Modify   Delete",value:"modify",align:"center",sortable:!1}],tasks:[{name:"Sčítanie do 10",last_mod:"20-12-2020"},{name:"SU - Bábiky",last_mod:"21-12-2020"},{name:"SU - Peniaze",last_mod:"02-01-2021"},{name:"Pytagorova veta",last_mod:"25-03-2021"},{name:"Porovnanie čísiel",last_mod:"06-04-2021"},{name:"Rovnobežky",last_mod:"01-01-2022"},{name:"Trojčlenka",last_mod:"21-01-2022"}]}},computed:{},created:function(){},methods:{}},Se=Oe,Te=(a("fecd"),a("8fea")),Ae=a("8654"),qe=Object(x["a"])(Se,Ve,je,!1,null,null,null),Ie=qe.exports;g()(qe,{VBtn:_["a"],VCard:ge["a"],VCardTitle:we["c"],VContainer:oe["a"],VDataTable:Te["a"],VIcon:C["a"],VSpacer:S["a"],VTextField:Ae["a"]});var Me=a("f309");r["a"].use(Me["a"]);var Pe=new Me["a"]({theme:{themes:{light:{primary:"#1a936f",secondary:"#b0bec5",accent:"#8c9eff",error:"#b71c1c"}}}});a("bf40");r["a"].use(Me["a"]),r["a"].use(A),r["a"].use(N),r["a"].use(he),r["a"].use(fe),r["a"].use($["a"]),r["a"].use(Ce),r["a"].use(Ie);var Ee=new $["a"]({routes:[{path:"/",component:Ce},{path:"/yourTasks",component:Ie},{path:"/createTask",component:fe}]});new r["a"]({router:Ee,components:{Navbar:A},methods:{},vuetify:Pe,render:function(e){return e(N)}}).$mount("#app")},"85ec":function(e,t,a){},a2e4:function(e,t,a){},b73f:function(e,t,a){e.exports=a.p+"img/undraw_create_test.1c90f36a.svg"},c073:function(e,t,a){"use strict";a("a2e4")},fb68:function(e,t,a){e.exports=a.p+"img/undraw_create_task.dc304872.svg"},fecd:function(e,t,a){"use strict";a("48d1")}});
//# sourceMappingURL=app.8e16eabe.js.map