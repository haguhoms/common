(function($,window,document,Math,undefined){var div=document.createElement("div"),divStyle=div.style,suffix="Transform",testProperties=["O"+suffix,"ms"+suffix,"Webkit"+suffix,"Moz"+suffix],i=testProperties.length,supportProperty,supportMatrixFilter,supportFloat32Array="Float32Array"in window,propertyHook,propertyGet,rMatrix=/Matrix([^)]*)/,rAffine=/^\s*matrix\(\s*1\s*,\s*0\s*,\s*0\s*,\s*1\s*(?:,\s*0(?:px)?\s*){2}\)\s*$/,_transform="transform",_transformOrigin="transformOrigin",_translate="translate",_rotate="rotate",_scale="scale",_skew="skew",_matrix="matrix";while(i--){if(testProperties[i]in divStyle){$.support[_transform]=supportProperty=testProperties[i];$.support[_transformOrigin]=supportProperty+"Origin";continue}}if(!supportProperty){$.support.matrixFilter=supportMatrixFilter=divStyle.filter===""}$.cssNumber[_transform]=$.cssNumber[_transformOrigin]=true;if(supportProperty&&supportProperty!=_transform){$.cssProps[_transform]=supportProperty;$.cssProps[_transformOrigin]=supportProperty+"Origin";if(supportProperty=="Moz"+suffix){propertyHook={get:function(elem,computed){return(computed?$.css(elem,supportProperty).split("px").join(""):elem.style[supportProperty])},set:function(elem,value){elem.style[supportProperty]=/matrix\([^)p]*\)/.test(value)?value.replace(/matrix((?:[^,]*,){4})([^,]*),([^)]*)/,_matrix+"$1$2px,$3px"):value}}}else if(/^1\.[0-5](?:\.|$)/.test($.fn.jquery)){propertyHook={get:function(elem,computed){return(computed?$.css(elem,supportProperty.replace(/^ms/,"Ms")):elem.style[supportProperty])}}}}else if(supportMatrixFilter){propertyHook={get:function(elem,computed,asArray){var elemStyle=(computed&&elem.currentStyle?elem.currentStyle:elem.style),matrix,data;if(elemStyle&&rMatrix.test(elemStyle.filter)){matrix=RegExp.$1.split(",");matrix=[matrix[0].split("=")[1],matrix[2].split("=")[1],matrix[1].split("=")[1],matrix[3].split("=")[1]]}else{matrix=[1,0,0,1]}if(!$.cssHooks[_transformOrigin]){matrix[4]=elemStyle?parseInt(elemStyle.left,10)||0:0;matrix[5]=elemStyle?parseInt(elemStyle.top,10)||0:0}else{data=$._data(elem,"transformTranslate",undefined);matrix[4]=data?data[0]:0;matrix[5]=data?data[1]:0}return asArray?matrix:_matrix+"("+matrix+")"},set:function(elem,value,animate){var elemStyle=elem.style,currentStyle,Matrix,filter,centerOrigin;if(!animate){elemStyle.zoom=1}value=matrix(value);Matrix=["Matrix("+"M11="+value[0],"M12="+value[2],"M21="+value[1],"M22="+value[3],"SizingMethod='auto expand'"].join();filter=(currentStyle=elem.currentStyle)&&currentStyle.filter||elemStyle.filter||"";elemStyle.filter=rMatrix.test(filter)?filter.replace(rMatrix,Matrix):filter+" progid:DXImageTransform.Microsoft."+Matrix+")";if(!$.cssHooks[_transformOrigin]){if((centerOrigin=$.transform.centerOrigin)){elemStyle[centerOrigin=="margin"?"marginLeft":"left"]=-(elem.offsetWidth/2)+(elem.clientWidth/2)+"px";elemStyle[centerOrigin=="margin"?"marginTop":"top"]=-(elem.offsetHeight/2)+(elem.clientHeight/2)+"px"}elemStyle.left=value[4]+"px";elemStyle.top=value[5]+"px"}else{$.cssHooks[_transformOrigin].set(elem,value)}}}}if(propertyHook){$.cssHooks[_transform]=propertyHook}propertyGet=propertyHook&&propertyHook.get||$.css;$.fx.step.transform=function(fx){var elem=fx.elem,start=fx.start,end=fx.end,pos=fx.pos,transform="",precision=1E5,i,startVal,endVal,unit;if(!start||typeof start==="string"){if(!start){start=propertyGet(elem,supportProperty)}if(supportMatrixFilter){elem.style.zoom=1}end=end.split("+=").join(start);$.extend(fx,interpolationList(start,end));start=fx.start;end=fx.end}i=start.length;while(i--){startVal=start[i];endVal=end[i];unit=+false;switch(startVal[0]){case _translate:unit="px";case _scale:unit||(unit="");transform=startVal[0]+"("+Math.round((startVal[1][0]+(endVal[1][0]-startVal[1][0])*pos)*precision)/precision+unit+","+Math.round((startVal[1][1]+(endVal[1][1]-startVal[1][1])*pos)*precision)/precision+unit+")"+transform;break;case _skew+"X":case _skew+"Y":case _rotate:transform=startVal[0]+"("+Math.round((startVal[1]+(endVal[1]-startVal[1])*pos)*precision)/precision+"rad)"+transform;break}}fx.origin&&(transform=fx.origin+transform);propertyHook&&propertyHook.set?propertyHook.set(elem,transform,+true):elem.style[supportProperty]=transform};function matrix(transform){transform=transform.split(")");var trim=$.trim,i=-1,l=transform.length-1,split,prop,val,prev=supportFloat32Array?new Float32Array(6):[],curr=supportFloat32Array?new Float32Array(6):[],rslt=supportFloat32Array?new Float32Array(6):[1,0,0,1,0,0];prev[0]=prev[3]=rslt[0]=rslt[3]=1;prev[1]=prev[2]=prev[4]=prev[5]=0;while(++i<l){split=transform[i].split("(");prop=trim(split[0]);val=split[1];curr[0]=curr[3]=1;curr[1]=curr[2]=curr[4]=curr[5]=0;switch(prop){case _translate+"X":curr[4]=parseInt(val,10);break;case _translate+"Y":curr[5]=parseInt(val,10);break;case _translate:val=val.split(",");curr[4]=parseInt(val[0],10);curr[5]=parseInt(val[1]||0,10);break;case _rotate:val=toRadian(val);curr[0]=Math.cos(val);curr[1]=Math.sin(val);curr[2]=-Math.sin(val);curr[3]=Math.cos(val);break;case _scale+"X":curr[0]=+val;break;case _scale+"Y":curr[3]=val;break;case _scale:val=val.split(",");curr[0]=val[0];curr[3]=val.length>1?val[1]:val[0];break;case _skew+"X":curr[2]=Math.tan(toRadian(val));break;case _skew+"Y":curr[1]=Math.tan(toRadian(val));break;case _matrix:val=val.split(",");curr[0]=val[0];curr[1]=val[1];curr[2]=val[2];curr[3]=val[3];curr[4]=parseInt(val[4],10);curr[5]=parseInt(val[5],10);break}rslt[0]=prev[0]*curr[0]+prev[2]*curr[1];rslt[1]=prev[1]*curr[0]+prev[3]*curr[1];rslt[2]=prev[0]*curr[2]+prev[2]*curr[3];rslt[3]=prev[1]*curr[2]+prev[3]*curr[3];rslt[4]=prev[0]*curr[4]+prev[2]*curr[5]+prev[4];rslt[5]=prev[1]*curr[4]+prev[3]*curr[5]+prev[5];prev=[rslt[0],rslt[1],rslt[2],rslt[3],rslt[4],rslt[5]]}return rslt}function unmatrix(matrix){var scaleX,scaleY,skew,A=matrix[0],B=matrix[1],C=matrix[2],D=matrix[3];if(A*D-B*C){scaleX=Math.sqrt(A*A+B*B);A/=scaleX;B/=scaleX;skew=A*C+B*D;C-=A*skew;D-=B*skew;scaleY=Math.sqrt(C*C+D*D);C/=scaleY;D/=scaleY;skew/=scaleY;if(A*D<B*C){A=-A;B=-B;skew=-skew;scaleX=-scaleX}}else{scaleX=scaleY=skew=0}return[[_translate,[+matrix[4],+matrix[5]]],[_rotate,Math.atan2(B,A)],[_skew+"X",Math.atan(skew)],[_scale,[scaleX,scaleY]]]}function interpolationList(start,end){var list={start:[],end:[]},i=-1,l,currStart,currEnd,currType;(start=="none"||isAffine(start))&&(start="");(end=="none"||isAffine(end))&&(end="");if(start&&end&&!end.indexOf("matrix")&&toArray(start).join()==toArray(end.split(")")[0]).join()){list.origin=start;start="";end=end.slice(end.indexOf(")")+1)}if(!start&&!end){return}if(!start||!end||functionList(start)==functionList(end)){start&&(start=start.split(")"))&&(l=start.length);end&&(end=end.split(")"))&&(l=end.length);while(++i<l-1){start[i]&&(currStart=start[i].split("("));end[i]&&(currEnd=end[i].split("("));currType=$.trim((currStart||currEnd)[0]);append(list.start,parseFunction(currType,currStart?currStart[1]:0));append(list.end,parseFunction(currType,currEnd?currEnd[1]:0))}}else{list.start=unmatrix(matrix(start));list.end=unmatrix(matrix(end))}return list}function parseFunction(type,value){var defaultValue=+(!type.indexOf(_scale)),scaleX,cat=type.replace(/e[XY]/,"e");switch(type){case _translate+"Y":case _scale+"Y":value=[defaultValue,value?parseFloat(value):defaultValue];break;case _translate+"X":case _translate:case _scale+"X":scaleX=1;case _scale:value=value?(value=value.split(","))&&[parseFloat(value[0]),parseFloat(value.length>1?value[1]:type==_scale?scaleX||value[0]:defaultValue+"")]:[defaultValue,defaultValue];break;case _skew+"X":case _skew+"Y":case _rotate:value=value?toRadian(value):0;break;case _matrix:return unmatrix(value?toArray(value):[1,0,0,1,0,0]);break}return[[cat,value]]}function isAffine(matrix){return rAffine.test(matrix)}function functionList(transform){return transform.replace(/(?:\([^)]*\))|\s/g,"")}function append(arr1,arr2,value){while(value=arr2.shift()){arr1.push(value)}}function toRadian(value){return~value.indexOf("deg")?parseInt(value,10)*(Math.PI*2/360):~value.indexOf("grad")?parseInt(value,10)*(Math.PI/200):parseFloat(value)}function toArray(matrix){matrix=/([^,]*),([^,]*),([^,]*),([^,]*),([^,p]*)(?:px)?,([^)p]*)(?:px)?/.exec(matrix);return[matrix[1],matrix[2],matrix[3],matrix[4],matrix[5],matrix[6]]}$.transform={centerOrigin:"margin"}})(jQuery,window,document,Math);
(function(t,e){if(typeof define==="function"&&define.amd){define(["jquery"],e)}else if(typeof exports==="object"){module.exports=e(require("jquery"))}else{e(t.jQuery)}})(this,function(t){t.transit={version:"0.9.12",propertyMap:{marginLeft:"margin",marginRight:"margin",marginBottom:"margin",marginTop:"margin",paddingLeft:"padding",paddingRight:"padding",paddingBottom:"padding",paddingTop:"padding"},enabled:true,useTransitionEnd:false};var e=document.createElement("div");var n={};function i(t){if(t in e.style)return t;var n=["Moz","Webkit","O","ms"];var i=t.charAt(0).toUpperCase()+t.substr(1);for(var r=0;r<n.length;++r){var s=n[r]+i;if(s in e.style){return s}}}function r(){e.style[n.transform]="";e.style[n.transform]="rotateY(90deg)";return e.style[n.transform]!==""}var s=navigator.userAgent.toLowerCase().indexOf("chrome")>-1;n.transition=i("transition");n.transitionDelay=i("transitionDelay");n.transform=i("transform");n.transformOrigin=i("transformOrigin");n.filter=i("Filter");n.transform3d=r();var a={transition:"transitionend",MozTransition:"transitionend",OTransition:"oTransitionEnd",WebkitTransition:"webkitTransitionEnd",msTransition:"MSTransitionEnd"};var o=n.transitionEnd=a[n.transition]||null;for(var u in n){if(n.hasOwnProperty(u)&&typeof t.support[u]==="undefined"){t.support[u]=n[u]}}e=null;t.cssEase={_default:"ease","in":"ease-in",out:"ease-out","in-out":"ease-in-out",snap:"cubic-bezier(0,1,.5,1)",easeInCubic:"cubic-bezier(.550,.055,.675,.190)",easeOutCubic:"cubic-bezier(.215,.61,.355,1)",easeInOutCubic:"cubic-bezier(.645,.045,.355,1)",easeInCirc:"cubic-bezier(.6,.04,.98,.335)",easeOutCirc:"cubic-bezier(.075,.82,.165,1)",easeInOutCirc:"cubic-bezier(.785,.135,.15,.86)",easeInExpo:"cubic-bezier(.95,.05,.795,.035)",easeOutExpo:"cubic-bezier(.19,1,.22,1)",easeInOutExpo:"cubic-bezier(1,0,0,1)",easeInQuad:"cubic-bezier(.55,.085,.68,.53)",easeOutQuad:"cubic-bezier(.25,.46,.45,.94)",easeInOutQuad:"cubic-bezier(.455,.03,.515,.955)",easeInQuart:"cubic-bezier(.895,.03,.685,.22)",easeOutQuart:"cubic-bezier(.165,.84,.44,1)",easeInOutQuart:"cubic-bezier(.77,0,.175,1)",easeInQuint:"cubic-bezier(.755,.05,.855,.06)",easeOutQuint:"cubic-bezier(.23,1,.32,1)",easeInOutQuint:"cubic-bezier(.86,0,.07,1)",easeInSine:"cubic-bezier(.47,0,.745,.715)",easeOutSine:"cubic-bezier(.39,.575,.565,1)",easeInOutSine:"cubic-bezier(.445,.05,.55,.95)",easeInBack:"cubic-bezier(.6,-.28,.735,.045)",easeOutBack:"cubic-bezier(.175, .885,.32,1.275)",easeInOutBack:"cubic-bezier(.68,-.55,.265,1.55)"};t.cssHooks["transit:transform"]={get:function(e){return t(e).data("transform")||new f},set:function(e,i){var r=i;if(!(r instanceof f)){r=new f(r)}if(n.transform==="WebkitTransform"&&!s){e.style[n.transform]=r.toString(true)}else{e.style[n.transform]=r.toString()}t(e).data("transform",r)}};t.cssHooks.transform={set:t.cssHooks["transit:transform"].set};t.cssHooks.filter={get:function(t){return t.style[n.filter]},set:function(t,e){t.style[n.filter]=e}};if(t.fn.jquery<"1.8"){t.cssHooks.transformOrigin={get:function(t){return t.style[n.transformOrigin]},set:function(t,e){t.style[n.transformOrigin]=e}};t.cssHooks.transition={get:function(t){return t.style[n.transition]},set:function(t,e){t.style[n.transition]=e}}}p("scale");p("scaleX");p("scaleY");p("translate");p("rotate");p("rotateX");p("rotateY");p("rotate3d");p("perspective");p("skewX");p("skewY");p("x",true);p("y",true);function f(t){if(typeof t==="string"){this.parse(t)}return this}f.prototype={setFromString:function(t,e){var n=typeof e==="string"?e.split(","):e.constructor===Array?e:[e];n.unshift(t);f.prototype.set.apply(this,n)},set:function(t){var e=Array.prototype.slice.apply(arguments,[1]);if(this.setter[t]){this.setter[t].apply(this,e)}else{this[t]=e.join(",")}},get:function(t){if(this.getter[t]){return this.getter[t].apply(this)}else{return this[t]||0}},setter:{rotate:function(t){this.rotate=b(t,"deg")},rotateX:function(t){this.rotateX=b(t,"deg")},rotateY:function(t){this.rotateY=b(t,"deg")},scale:function(t,e){if(e===undefined){e=t}this.scale=t+","+e},skewX:function(t){this.skewX=b(t,"deg")},skewY:function(t){this.skewY=b(t,"deg")},perspective:function(t){this.perspective=b(t,"px")},x:function(t){this.set("translate",t,null)},y:function(t){this.set("translate",null,t)},translate:function(t,e){if(this._translateX===undefined){this._translateX=0}if(this._translateY===undefined){this._translateY=0}if(t!==null&&t!==undefined){this._translateX=b(t,"px")}if(e!==null&&e!==undefined){this._translateY=b(e,"px")}this.translate=this._translateX+","+this._translateY}},getter:{x:function(){return this._translateX||0},y:function(){return this._translateY||0},scale:function(){var t=(this.scale||"1,1").split(",");if(t[0]){t[0]=parseFloat(t[0])}if(t[1]){t[1]=parseFloat(t[1])}return t[0]===t[1]?t[0]:t},rotate3d:function(){var t=(this.rotate3d||"0,0,0,0deg").split(",");for(var e=0;e<=3;++e){if(t[e]){t[e]=parseFloat(t[e])}}if(t[3]){t[3]=b(t[3],"deg")}return t}},parse:function(t){var e=this;t.replace(/([a-zA-Z0-9]+)\((.*?)\)/g,function(t,n,i){e.setFromString(n,i)})},toString:function(t){var e=[];for(var i in this){if(this.hasOwnProperty(i)){if(!n.transform3d&&(i==="rotateX"||i==="rotateY"||i==="perspective"||i==="transformOrigin")){continue}if(i[0]!=="_"){if(t&&i==="scale"){e.push(i+"3d("+this[i]+",1)")}else if(t&&i==="translate"){e.push(i+"3d("+this[i]+",0)")}else{e.push(i+"("+this[i]+")")}}}}return e.join(" ")}};function c(t,e,n){if(e===true){t.queue(n)}else if(e){t.queue(e,n)}else{t.each(function(){n.call(this)})}}function l(e){var i=[];t.each(e,function(e){e=t.camelCase(e);e=t.transit.propertyMap[e]||t.cssProps[e]||e;e=h(e);if(n[e])e=h(n[e]);if(t.inArray(e,i)===-1){i.push(e)}});return i}function d(e,n,i,r){var s=l(e);if(t.cssEase[i]){i=t.cssEase[i]}var a=""+y(n)+" "+i;if(parseInt(r,10)>0){a+=" "+y(r)}var o=[];t.each(s,function(t,e){o.push(e+" "+a)});return o.join(", ")}t.fn.transition=t.fn.transit=function(e,i,r,s){var a=this;var u=0;var f=true;var l=t.extend(true,{},e);if(typeof i==="function"){s=i;i=undefined}if(typeof i==="object"){r=i.easing;u=i.delay||0;f=typeof i.queue==="undefined"?true:i.queue;s=i.complete;i=i.duration}if(typeof r==="function"){s=r;r=undefined}if(typeof l.easing!=="undefined"){r=l.easing;delete l.easing}if(typeof l.duration!=="undefined"){i=l.duration;delete l.duration}if(typeof l.complete!=="undefined"){s=l.complete;delete l.complete}if(typeof l.queue!=="undefined"){f=l.queue;delete l.queue}if(typeof l.delay!=="undefined"){u=l.delay;delete l.delay}if(typeof i==="undefined"){i=t.fx.speeds._default}if(typeof r==="undefined"){r=t.cssEase._default}i=y(i);var p=d(l,i,r,u);var h=t.transit.enabled&&n.transition;var b=h?parseInt(i,10)+parseInt(u,10):0;if(b===0){var g=function(t){a.css(l);if(s){s.apply(a)}if(t){t()}};c(a,f,g);return a}var m={};var v=function(e){var i=false;var r=function(){if(i){a.unbind(o,r)}if(b>0){a.each(function(){this.style[n.transition]=m[this]||null})}if(typeof s==="function"){s.apply(a)}if(typeof e==="function"){e()}};if(b>0&&o&&t.transit.useTransitionEnd){i=true;a.bind(o,r)}else{window.setTimeout(r,b)}a.each(function(){if(b>0){this.style[n.transition]=p}t(this).css(l)})};var z=function(t){this.offsetWidth;v(t)};c(a,f,z);return this};function p(e,i){if(!i){t.cssNumber[e]=true}t.transit.propertyMap[e]=n.transform;t.cssHooks[e]={get:function(n){var i=t(n).css("transit:transform");return i.get(e)},set:function(n,i){var r=t(n).css("transit:transform");r.setFromString(e,i);t(n).css({"transit:transform":r})}}}function h(t){return t.replace(/([A-Z])/g,function(t){return"-"+t.toLowerCase()})}function b(t,e){if(typeof t==="string"&&!t.match(/^[\-0-9\.]+$/)){return t}else{return""+t+e}}function y(e){var n=e;if(typeof n==="string"&&!n.match(/^[\-0-9\.]+/)){n=t.fx.speeds[n]||t.fx.speeds._default}return b(n,"ms")}t.transit.getTransitionValue=d;return t});
(function(w) {

  var Common
    , BaseAnimator;

  Common = (function() {
    Common.prototype.PI = 0;
    Common.prototype.RADIAN = 0;
    Common.prototype.UA = null;
    Common.prototype.W_WIDTH = null;
    Common.prototype.W_HEIGHT = null;

    function Common() {
      if (!(this instanceof Common)) {
        return new Common();
      }
      var pi = Math.PI;
      this.PI = pi * 0.5;
      this.RADIAN = pi / 180;
      this.init();
    }

    // 各初期処理
    Common.prototype.init = function() {
      var that = this;
      this.UA = this.getUA(); // userAgent取得
      this.getSize(); // windowサイズ取得
      $(w).resize(function() {
        that.getSize();
      });
    };

    // userAgent取得
    Common.prototype.getUA = function() {
      var ua, uaparam;
      uaparam = [
        {
          'iOS': false,
          'iPhone': false,
          'iPad': false,
          'Android': false,
          'IE6': false,
          'IE7': false,
          'IE8': false,
          'IE': false,
          'Firefox': false
        }
      ];
      ua = navigator.userAgent;
      if (ua.indexOf('iPhone') >= 0) {
        uaparam.iOS = true;
        uaparam.iPhone = true;
      } else if (ua.indexOf('iPad') >= 0) {
        uaparam.iOS = true;
        uaparam.iPad = true;
      } else if (ua.indexOf('Android') >= 0) {
        uaparam.Android = true;
      } else if (ua.indexOf('MSIE 6.0') >= 0) {
        uaparam.IE6 = true;
      } else if (ua.indexOf('MSIE 7.0') >= 0) {
        uaparam.IE7 = true;
      } else if (ua.indexOf('MSIE 8.0') >= 0) {
        uaparam.IE8 = true;
      } else if (ua.match(/MSIE/) || ua.match(/Trident/)) {
        uaparam.IE = true;
      } else if (ua.indexOf('Firefox') >= 0) {
        uaparam.Firefox = true;
      }
      return uaparam;
    };

    // 各サイズ取得
    Common.prototype.getSize = function() {
      this.W_W = this.getBrowserWidth();
      this.W_H = this.getBrowserHeight();
    };

    // ブラウザの幅取得
    Common.prototype.getBrowserWidth = function() {
      if ( window.innerWidth ) {
        return window.innerWidth;
      }
      else if ( document.documentElement && document.documentElement.clientWidth != 0 ) {
        return document.documentElement.clientWidth;
      }
      else if ( document.body ) {
        return document.body.clientWidth;
      }
      return 0;
    }

    // ブラウザの高さ取得
    Common.prototype.getBrowserHeight = function() {
      if ( window.innerHeight ) {
        return window.innerHeight;
      }
      else if ( document.documentElement && document.documentElement.clientHeight != 0 ) {
        return document.documentElement.clientHeight;
      }
      else if ( document.body ) {
        return document.body.clientHeight;
      }
      return 0;
    }

    // 進捗管理
    // e: easingType
    // t: currentTime
    // b: startValue
    // c: endValue
    // d: totalTime
    Common.prototype.getProgress = function(e, t, b, c, d) {
      var retValue;
      if (t === undefined) return null;
      if (t < 0) return 0;
      if (t > d) return c;

      switch (e) {
        case 'linear':
          retValue = c * t / d + b;
          break;
        case 'easeInSine':
          retValue = -c * Math.cos(t / d * this.PI) + c + b;
          break;
        case 'easeOutSine':
          retValue = c * Math.sin(t / d * this.PI) + b;
          break;
        case 'easeInOutSine':
          retValue = -(c / 2) * (Math.cos(this.PI * t / d) - 1) + b;
          break;
        case 'easeOutInSine':
          if (t < (d / 2)) {
            retValue = (c / 2) * Math.sin((t * 2) / d * this.PI) + b;
          }
          else {
            retValue = -(c / 2) * Math.cos((t * 2 - d) / d * this.PI) + (c / 2) + (b + (c / 2));
          }
          break;
        case 'easeInCubic':
          retValue = c * (t /= d) * t * t + b;
          break;
        case 'easeOutCubic':
          retValue = c * ((t = t / d - 1) * t * t + 1) + b;
          break;
        case 'easeInOutCubic':
          if (t /= (d / 2) < 1) {
            retValue = (c / 2) * t * t * t + b;
          }
          else {
            retValue = (c / 2) * ((t -= 2) * t * t + 2) + b;
          }
          break;
        case 'easeOutInCubic':
          if (t < d / 2) {
            retValue = c / 2 * ((t = t * 2 / d - 1) * t * t + 1) + b;
          }
          else {
            retValue = c / 2 * (t = (t * 2 - d) / d) * t * t + b + c / 2;
          }
          break;
        case 'easeInQuint':
          retValue = c * (t /= d) * t * t * t * t + b;
          break;
        case 'easeOutQuint':
          retValue = c * ((t = t / d - 1) * t * t * t * t + 1) + b;
          break;
        case 'easeInOutQuint':
          if ((t /= d / 2) < 1) {
            retValue = c / 2 * t * t * t * t * t + b;
          }
          else {
            retValue = c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
          }
          break;
        case 'easeOutInQuint':
          if (t < d / 2) {
            retValue = (c / 2) * ((t = (t * 2) / d - 1) * t * t * t * t + 1) + b;
          }
          else {
            retValue = (c / 2) * (t = (t * 2 - d) / d) * t * t * t * t + (b + c / 2);
          }
          break;
        case 'easeInCirc':
          retValue = -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
          break;
        case 'easeOutCirc':
          retValue = c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
          break;
        case 'easeInOutCirc':
          if ((t /= d / 2) < 1) {
            retValue = -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
          }
          else {
            retValue = c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
          }
          break;
        case 'easeOutInCirc':
          if (t < d / 2) {
            retValue = (c / 2) * Math.sqrt(1 - (t = (t * 2) / d - 1) * t) + b;
          }
          else {
            retValue = -(c / 2) * (Math.sqrt(1 - (t = (t * 2 - d) / d) * t) - 1) + (b + c / 2);
          }
          break;
        case 'easeInQuad':
          retValue = c * (t /= d) * t + b;
          break;
        case 'easeOutQuad':
          retValue = -c * (t /= d) * (t - 2) + b;
          break;
        case 'easeInOutQuad':
          if ((t /= d / 2) < 1) {
            retValue = c / 2 * t * t + b;
          }
          else {
            retValue = -c / 2 * ((--t) * (t - 2) - 1) + b;
          }
          break;
        case 'easeOutInQuad':
          if (t < d / 2) {
            retValue = -(c / 2) * (t = t * 2 / d) * (t - 2) + b;
          }
          else {
            retValue = (c / 2) * (t = (t * 2 - d) / d) * t + (b + c / 2);
          }
          break;
        case 'easeInQuart':
          retValue = c * (t /= d) * t * t * t + b;
          break;
        case 'easeOutQuart':
          retValue = -c * ((t = t / d - 1) * t * t * t - 1) + b;
          break;
        case 'easeInOutQuart':
          if ((t /= d / 2) < 1) {
            retValue = c / 2 * t * t * t * t + b;
          }
          else {
            retValue = -c / 2 * ((t -= 2) * t * t * t - 2) + b;
          }
          break;
        case 'easeOutInQuart':
          if (t < d / 2) {
            retValue = -(c / 2) * ((t = (t * 2) / d - 1) * t * t * t - 1) + b;
          }
          else {
            retValue = (c / 2) * (t = (t * 2 - d) / d) * t * t * t + (b + c / 2);
          }
          break;
        case 'easeInExpo': 
          if (t === 0) {
            retValue = b;
          } 
          else {
            retValue = c * Math.pow(2, 10 * (t / d - 1)) + b;
          }
          break;
        case 'easeOutExpo':
          if (t === d) {
            retValue = b + c;
          } 
          else {
            retValue = c * (-Math.pow(2, -10 * t / d) + 1) + b;
          }
          break;
        case 'easeInOutExpo':
          if (t === 0) {
            retValue = b;
          }
          else if (t === d) {
            retValue = b + c;
          }
          else if ((t /= d / 2) < 1) {
            retValue = c / 2 * Math.pow(2, 10 * (t - 1)) + b;
          }
          else {
            retValue = c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
          }
          break;
        case 'easeOutInExpo':
          if (t < d / 2) {
            if (t * 2.0 === d) {
              retValue = b + c / 2.0;
            } else {
              retValue = c / 2.0 * (1 - Math.pow(2, -10 * t * 2.0 / d)) + b;
            }
          }
          else if (t * 2.0 - d === 0) {
            retValue = b + c / 2.0;
          } 
          else {
            retValue = c / 2.0 * Math.pow(2, 10 * ((t * 2 - d) / d - 1)) + b + c / 2.0;
          }
          break;
        default:
          retValue = null;
          break;
      }
      return retValue;
    };

    // スリープ
    Common.prototype.sleep = function(time, callback) {
      setTimeout(function() {
        callback();
      }, time);
    };

    // 乱数範囲取得
    Common.prototype.getRandom = function(min, max) {
      return Math.random() * (max - min) + min;
    };

    return Common;
  })();

  BaseAnimator = (function() {
    BaseAnimator.prototype = new Common();
    BaseAnimator.prototype._body = null;
    BaseAnimator.prototype._startTime = 0;
    BaseAnimator.prototype._duration = 0;
    BaseAnimator.prototype._rid = 0;

    function BaseAnimator() {
      if (!(this instanceof BaseAnimator)) {
        return new BaseAnimator();
      }
      Common.call(this);
    }

    BaseAnimator.prototype.init = function(duration) {
      this._duration = duration;
    };

    BaseAnimator.prototype.start = function() {
      if (this._startTime !== 0) return;

      this._startTime = +new Date();
      this.update();
    };

    BaseAnimator.prototype.update = function() {
      var currentTime
        , diff
        , that = this;

      if (this._startTime === 0) return;

      currentTime = +new Date();
      diff = currentTime - this._startTime;

      // アニメーションの内容はanimateメソッドに一任
      this.animate(d);

      if (diff > this._duration) {
        cancelAnimationFrame(this._rid);
      }
      else {
        this._rid = requestAnimationFrame(function() {
          that.update();
        });
      }
    };

    BaseAnimator.prototype.animate = function(d) {};

    return BaseAnimator;
  })();

  function initialize() {
    var $image = $('.js-changeImage');
    $image.on({
      'mouseenter': function() {
        var $target = $(this).find('img');
        $target.attr('src', $target.attr('src').replace('_off', '_on'));
      },
      'mouseleave': function() {
        var $target = $(this).find('img');
        $target.attr('src', $target.attr('src').replace('_on', '_off'));
      }
    });
  }

  // リクエストアニメーションフレーム(初期化)
  requestAnimationFrame = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback, element) {
      return window.setTimeout(callback, 1000 / 60);
    };
  })();

  // キャンセルアニメーションフレーム(初期化)
  cancelAnimationFrame = (function() {
    return window.cancelAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame || window.oCancelRequestAnimationFrame || window.msCancelRequestAnimationFrame || window.clearTimeout;
  })();

  $(w).load(function() {
    initialize();
  });

})(window);
