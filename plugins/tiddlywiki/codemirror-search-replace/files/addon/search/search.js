'use strict';var $jscomp=$jscomp||{};$jscomp.scope={};$jscomp.findInternal=function(a,d,c){a instanceof String&&(a=String(a));for(var g=a.length,f=0;f<g;f++){var k=a[f];if(d.call(c,k,f,a))return{i:f,v:k}}return{i:-1,v:void 0}};$jscomp.ASSUME_ES5=!1;$jscomp.ASSUME_NO_NATIVE_MAP=!1;$jscomp.ASSUME_NO_NATIVE_SET=!1;$jscomp.SIMPLE_FROUND_POLYFILL=!1;$jscomp.ISOLATE_POLYFILLS=!1;
$jscomp.defineProperty=$jscomp.ASSUME_ES5||"function"==typeof Object.defineProperties?Object.defineProperty:function(a,d,c){if(a==Array.prototype||a==Object.prototype)return a;a[d]=c.value;return a};$jscomp.getGlobal=function(a){a=["object"==typeof globalThis&&globalThis,a,"object"==typeof window&&window,"object"==typeof self&&self,"object"==typeof global&&global];for(var d=0;d<a.length;++d){var c=a[d];if(c&&c.Math==Math)return c}throw Error("Cannot find global object");};$jscomp.global=$jscomp.getGlobal(this);
$jscomp.IS_SYMBOL_NATIVE="function"===typeof Symbol&&"symbol"===typeof Symbol("x");$jscomp.TRUST_ES6_POLYFILLS=!$jscomp.ISOLATE_POLYFILLS||$jscomp.IS_SYMBOL_NATIVE;$jscomp.polyfills={};$jscomp.propertyToPolyfillSymbol={};$jscomp.POLYFILL_PREFIX="$jscp$";var $jscomp$lookupPolyfilledValue=function(a,d){var c=$jscomp.propertyToPolyfillSymbol[d];if(null==c)return a[d];c=a[c];return void 0!==c?c:a[d]};
$jscomp.polyfill=function(a,d,c,g){d&&($jscomp.ISOLATE_POLYFILLS?$jscomp.polyfillIsolated(a,d,c,g):$jscomp.polyfillUnisolated(a,d,c,g))};$jscomp.polyfillUnisolated=function(a,d,c,g){c=$jscomp.global;a=a.split(".");for(g=0;g<a.length-1;g++){var f=a[g];f in c||(c[f]={});c=c[f]}a=a[a.length-1];g=c[a];d=d(g);d!=g&&null!=d&&$jscomp.defineProperty(c,a,{configurable:!0,writable:!0,value:d})};
$jscomp.polyfillIsolated=function(a,d,c,g){var f=a.split(".");a=1===f.length;g=f[0];g=!a&&g in $jscomp.polyfills?$jscomp.polyfills:$jscomp.global;for(var k=0;k<f.length-1;k++){var m=f[k];m in g||(g[m]={});g=g[m]}f=f[f.length-1];c=$jscomp.IS_SYMBOL_NATIVE&&"es6"===c?g[f]:null;d=d(c);null!=d&&(a?$jscomp.defineProperty($jscomp.polyfills,f,{configurable:!0,writable:!0,value:d}):d!==c&&($jscomp.propertyToPolyfillSymbol[f]=$jscomp.IS_SYMBOL_NATIVE?$jscomp.global.Symbol(f):$jscomp.POLYFILL_PREFIX+f,f=$jscomp.propertyToPolyfillSymbol[f],
$jscomp.defineProperty(g,f,{configurable:!0,writable:!0,value:d})))};$jscomp.polyfill("Array.prototype.find",function(a){return a?a:function(a,c){return $jscomp.findInternal(this,a,c).v}},"es6","es3");
(function(a){"object"==typeof exports&&"object"==typeof module?a(require("../../lib/codemirror"),require("./searchcursor"),require("../dialog/dialog")):"function"==typeof define&&define.amd?define(["../../lib/codemirror","./searchcursor","../dialog/dialog"],a):a(CodeMirror)})(function(a){function d(b,a){"string"==typeof b?b=new RegExp(b.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&"),a?"gi":"g"):b.global||(b=new RegExp(b.source,b.ignoreCase?"gi":"g"));return{token:function(a){b.lastIndex=a.pos;
var h=b.exec(a.string);if(h&&h.index==a.pos)return a.pos+=h[0].length||1,"searching";h?a.pos=h.index:a.skipToEnd()}}}function c(){this.overlay=this.posFrom=this.posTo=this.lastQuery=this.query=null}function g(b){return b.state.search||(b.state.search=new c)}function f(b){return"string"==typeof b&&b==b.toLowerCase()}function k(b,a,c){return b.getSearchCursor(a,c,{caseFold:f(a),multiline:!0})}function m(b,a,c,d,e){b.openDialog(a,d,{value:c,selectValueOnOpen:!0,closeOnEnter:!1,onClose:function(){n(b)},
onKeyDown:e})}function r(b,a,c,d,e){b.openDialog?b.openDialog(a,e,{value:d,selectValueOnOpen:!0}):e(prompt(c,d))}function A(b,a,c,d){if(b.openConfirm)b.openConfirm(a,d);else if(confirm(c))d[0]()}function v(b){return b.replace(/\\([nrt\\])/g,function(b,a){return"n"==a?"\n":"r"==a?"\r":"t"==a?"\t":"\\"==a?"\\":b})}function w(b){var a=b.match(/^\/(.*)\/([a-z]*)$/);if(a)try{b=new RegExp(a[1],-1==a[2].indexOf("i")?"":"i")}catch(C){}else b=v(b);if("string"==typeof b?""==b:b.test(""))b=/x^/;return b}function p(b,
a,c){a.queryText=c;a.query=w(c);b.removeOverlay(a.overlay,f(a.query));a.overlay=d(a.query,f(a.query));b.addOverlay(a.overlay);b.showMatchesOnScrollbar&&(a.annotate&&(a.annotate.clear(),a.annotate=null),a.annotate=b.showMatchesOnScrollbar(a.query,f(a.query)))}function l(b,c,d,f){var e=g(b);if(e.query)return q(b,c);var h=b.getSelection()||e.lastQuery;h instanceof RegExp&&"x^"==h.source&&(h=null);if(d&&b.openDialog){var t=null,u=function(c,d){a.e_stop(d);c&&(c!=e.queryText&&(p(b,e,c),e.posFrom=e.posTo=
b.getCursor()),t&&(t.style.opacity=1),q(b,d.shiftKey,function(a,c){var d;3>c.line&&document.querySelector&&(d=b.display.wrapper.querySelector(".CodeMirror-dialog"))&&d.getBoundingClientRect().bottom-4>b.cursorCoords(c,"window").top&&((t=d).style.opacity=.4)}))};m(b,x(b),h,u,function(c,d){var e=a.keyName(c),h=b.getOption("extraKeys");e=h&&h[e]||a.keyMap[b.getOption("keyMap")][e];if("findNext"==e||"findPrev"==e||"findPersistentNext"==e||"findPersistentPrev"==e)a.e_stop(c),p(b,g(b),d),b.execCommand(e);
else if("find"==e||"findPersistent"==e)a.e_stop(c),u(d,c)});f&&h&&(p(b,e,h),q(b,c))}else r(b,x(b),"Search for:",h,function(a){a&&!e.query&&b.operation(function(){p(b,e,a);e.posFrom=e.posTo=b.getCursor();q(b,c)})})}function q(b,c,d){b.operation(function(){var f=g(b),e=k(b,f.query,c?f.posFrom:f.posTo);if(!e.find(c)&&(e=k(b,f.query,c?a.Pos(b.lastLine()):a.Pos(b.firstLine(),0)),!e.find(c)))return;b.setSelection(e.from(),e.to());b.scrollIntoView({from:e.from(),to:e.to()},20);f.posFrom=e.from();f.posTo=
e.to();d&&d(e.from(),e.to())})}function n(b){b.operation(function(){var a=g(b);if(a.lastQuery=a.query)a.query=a.queryText=null,b.removeOverlay(a.overlay),a.annotate&&(a.annotate.clear(),a.annotate=null)})}function x(b){return'<span class="CodeMirror-search-label">'+b.phrase("Search:")+'</span> <input type="text" style="width: 10em" class="CodeMirror-search-field"/> <span style="color: #888" class="CodeMirror-search-hint">'+b.phrase("(Use /re/ syntax for regexp search)")+"</span>"}function B(b){return'<span class="CodeMirror-search-label">'+
b.phrase("Replace?")+"</span> <button>"+b.phrase("Yes")+"</button> <button>"+b.phrase("No")+"</button> <button>"+b.phrase("All")+"</button> <button>"+b.phrase("Stop")+"</button> "}function y(b,a,c){b.operation(function(){for(var d=k(b,a);d.findNext();)if("string"!=typeof a){var e=b.getRange(d.from(),d.to()).match(a);d.replace(c.replace(/\$(\d)/g,function(b,a){return e[a]}))}else d.replace(c)})}function z(b,a){if(!b.getOption("readOnly")){var c=b.getSelection()||g(b).lastQuery,d='<span class="CodeMirror-search-label">'+
(a?b.phrase("Replace all:"):b.phrase("Replace:"))+"</span>";r(b,d+(' <input type="text" style="width: 10em" class="CodeMirror-search-field"/> <span style="color: #888" class="CodeMirror-search-hint">'+b.phrase("(Use /re/ syntax for regexp search)")+"</span>"),d,c,function(c){c&&(c=w(c),r(b,'<span class="CodeMirror-search-label">'+b.phrase("With:")+'</span> <input type="text" style="width: 10em" class="CodeMirror-search-field"/>',b.phrase("Replace with:"),"",function(d){d=v(d);if(a)y(b,c,d);else{n(b);
var e=k(b,c,b.getCursor("from")),f=function(){var a=e.from(),h;if(!(h=e.findNext())&&(e=k(b,c),!(h=e.findNext())||a&&e.from().line==a.line&&e.from().ch==a.ch))return;b.setSelection(e.from(),e.to());b.scrollIntoView({from:e.from(),to:e.to()});A(b,B(b),b.phrase("Replace?"),[function(){g(h)},f,function(){y(b,c,d)}])},g=function(a){e.replace("string"==typeof c?d:d.replace(/\$(\d)/g,function(b,c){return a[c]}));f()};f()}}))})}}a.commands.find=function(a){n(a);l(a)};a.commands.findPersistent=function(a){n(a);
l(a,!1,!0)};a.commands.findPersistentNext=function(a){l(a,!1,!0,!0)};a.commands.findPersistentPrev=function(a){l(a,!0,!0,!0)};a.commands.findNext=l;a.commands.findPrev=function(a){l(a,!0)};a.commands.clearSearch=n;a.commands.replace=z;a.commands.replaceAll=function(a){z(a,!0)}});
