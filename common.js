(function($,window,document,Math,undefined){var div=document.createElement("div"),divStyle=div.style,suffix="Transform",testProperties=["O"+suffix,"ms"+suffix,"Webkit"+suffix,"Moz"+suffix],i=testProperties.length,supportProperty,supportMatrixFilter,supportFloat32Array="Float32Array"in window,propertyHook,propertyGet,rMatrix=/Matrix([^)]*)/,rAffine=/^\s*matrix\(\s*1\s*,\s*0\s*,\s*0\s*,\s*1\s*(?:,\s*0(?:px)?\s*){2}\)\s*$/,_transform="transform",_transformOrigin="transformOrigin",_translate="translate",_rotate="rotate",_scale="scale",_skew="skew",_matrix="matrix";while(i--){if(testProperties[i]in divStyle){$.support[_transform]=supportProperty=testProperties[i];$.support[_transformOrigin]=supportProperty+"Origin";continue}}if(!supportProperty){$.support.matrixFilter=supportMatrixFilter=divStyle.filter===""}$.cssNumber[_transform]=$.cssNumber[_transformOrigin]=true;if(supportProperty&&supportProperty!=_transform){$.cssProps[_transform]=supportProperty;$.cssProps[_transformOrigin]=supportProperty+"Origin";if(supportProperty=="Moz"+suffix){propertyHook={get:function(elem,computed){return(computed?$.css(elem,supportProperty).split("px").join(""):elem.style[supportProperty])},set:function(elem,value){elem.style[supportProperty]=/matrix\([^)p]*\)/.test(value)?value.replace(/matrix((?:[^,]*,){4})([^,]*),([^)]*)/,_matrix+"$1$2px,$3px"):value}}}else if(/^1\.[0-5](?:\.|$)/.test($.fn.jquery)){propertyHook={get:function(elem,computed){return(computed?$.css(elem,supportProperty.replace(/^ms/,"Ms")):elem.style[supportProperty])}}}}else if(supportMatrixFilter){propertyHook={get:function(elem,computed,asArray){var elemStyle=(computed&&elem.currentStyle?elem.currentStyle:elem.style),matrix,data;if(elemStyle&&rMatrix.test(elemStyle.filter)){matrix=RegExp.$1.split(",");matrix=[matrix[0].split("=")[1],matrix[2].split("=")[1],matrix[1].split("=")[1],matrix[3].split("=")[1]]}else{matrix=[1,0,0,1]}if(!$.cssHooks[_transformOrigin]){matrix[4]=elemStyle?parseInt(elemStyle.left,10)||0:0;matrix[5]=elemStyle?parseInt(elemStyle.top,10)||0:0}else{data=$._data(elem,"transformTranslate",undefined);matrix[4]=data?data[0]:0;matrix[5]=data?data[1]:0}return asArray?matrix:_matrix+"("+matrix+")"},set:function(elem,value,animate){var elemStyle=elem.style,currentStyle,Matrix,filter,centerOrigin;if(!animate){elemStyle.zoom=1}value=matrix(value);Matrix=["Matrix("+"M11="+value[0],"M12="+value[2],"M21="+value[1],"M22="+value[3],"SizingMethod='auto expand'"].join();filter=(currentStyle=elem.currentStyle)&&currentStyle.filter||elemStyle.filter||"";elemStyle.filter=rMatrix.test(filter)?filter.replace(rMatrix,Matrix):filter+" progid:DXImageTransform.Microsoft."+Matrix+")";if(!$.cssHooks[_transformOrigin]){if((centerOrigin=$.transform.centerOrigin)){elemStyle[centerOrigin=="margin"?"marginLeft":"left"]=-(elem.offsetWidth/2)+(elem.clientWidth/2)+"px";elemStyle[centerOrigin=="margin"?"marginTop":"top"]=-(elem.offsetHeight/2)+(elem.clientHeight/2)+"px"}elemStyle.left=value[4]+"px";elemStyle.top=value[5]+"px"}else{$.cssHooks[_transformOrigin].set(elem,value)}}}}if(propertyHook){$.cssHooks[_transform]=propertyHook}propertyGet=propertyHook&&propertyHook.get||$.css;$.fx.step.transform=function(fx){var elem=fx.elem,start=fx.start,end=fx.end,pos=fx.pos,transform="",precision=1E5,i,startVal,endVal,unit;if(!start||typeof start==="string"){if(!start){start=propertyGet(elem,supportProperty)}if(supportMatrixFilter){elem.style.zoom=1}end=end.split("+=").join(start);$.extend(fx,interpolationList(start,end));start=fx.start;end=fx.end}i=start.length;while(i--){startVal=start[i];endVal=end[i];unit=+false;switch(startVal[0]){case _translate:unit="px";case _scale:unit||(unit="");transform=startVal[0]+"("+Math.round((startVal[1][0]+(endVal[1][0]-startVal[1][0])*pos)*precision)/precision+unit+","+Math.round((startVal[1][1]+(endVal[1][1]-startVal[1][1])*pos)*precision)/precision+unit+")"+transform;break;case _skew+"X":case _skew+"Y":case _rotate:transform=startVal[0]+"("+Math.round((startVal[1]+(endVal[1]-startVal[1])*pos)*precision)/precision+"rad)"+transform;break}}fx.origin&&(transform=fx.origin+transform);propertyHook&&propertyHook.set?propertyHook.set(elem,transform,+true):elem.style[supportProperty]=transform};function matrix(transform){transform=transform.split(")");var trim=$.trim,i=-1,l=transform.length-1,split,prop,val,prev=supportFloat32Array?new Float32Array(6):[],curr=supportFloat32Array?new Float32Array(6):[],rslt=supportFloat32Array?new Float32Array(6):[1,0,0,1,0,0];prev[0]=prev[3]=rslt[0]=rslt[3]=1;prev[1]=prev[2]=prev[4]=prev[5]=0;while(++i<l){split=transform[i].split("(");prop=trim(split[0]);val=split[1];curr[0]=curr[3]=1;curr[1]=curr[2]=curr[4]=curr[5]=0;switch(prop){case _translate+"X":curr[4]=parseInt(val,10);break;case _translate+"Y":curr[5]=parseInt(val,10);break;case _translate:val=val.split(",");curr[4]=parseInt(val[0],10);curr[5]=parseInt(val[1]||0,10);break;case _rotate:val=toRadian(val);curr[0]=Math.cos(val);curr[1]=Math.sin(val);curr[2]=-Math.sin(val);curr[3]=Math.cos(val);break;case _scale+"X":curr[0]=+val;break;case _scale+"Y":curr[3]=val;break;case _scale:val=val.split(",");curr[0]=val[0];curr[3]=val.length>1?val[1]:val[0];break;case _skew+"X":curr[2]=Math.tan(toRadian(val));break;case _skew+"Y":curr[1]=Math.tan(toRadian(val));break;case _matrix:val=val.split(",");curr[0]=val[0];curr[1]=val[1];curr[2]=val[2];curr[3]=val[3];curr[4]=parseInt(val[4],10);curr[5]=parseInt(val[5],10);break}rslt[0]=prev[0]*curr[0]+prev[2]*curr[1];rslt[1]=prev[1]*curr[0]+prev[3]*curr[1];rslt[2]=prev[0]*curr[2]+prev[2]*curr[3];rslt[3]=prev[1]*curr[2]+prev[3]*curr[3];rslt[4]=prev[0]*curr[4]+prev[2]*curr[5]+prev[4];rslt[5]=prev[1]*curr[4]+prev[3]*curr[5]+prev[5];prev=[rslt[0],rslt[1],rslt[2],rslt[3],rslt[4],rslt[5]]}return rslt}function unmatrix(matrix){var scaleX,scaleY,skew,A=matrix[0],B=matrix[1],C=matrix[2],D=matrix[3];if(A*D-B*C){scaleX=Math.sqrt(A*A+B*B);A/=scaleX;B/=scaleX;skew=A*C+B*D;C-=A*skew;D-=B*skew;scaleY=Math.sqrt(C*C+D*D);C/=scaleY;D/=scaleY;skew/=scaleY;if(A*D<B*C){A=-A;B=-B;skew=-skew;scaleX=-scaleX}}else{scaleX=scaleY=skew=0}return[[_translate,[+matrix[4],+matrix[5]]],[_rotate,Math.atan2(B,A)],[_skew+"X",Math.atan(skew)],[_scale,[scaleX,scaleY]]]}function interpolationList(start,end){var list={start:[],end:[]},i=-1,l,currStart,currEnd,currType;(start=="none"||isAffine(start))&&(start="");(end=="none"||isAffine(end))&&(end="");if(start&&end&&!end.indexOf("matrix")&&toArray(start).join()==toArray(end.split(")")[0]).join()){list.origin=start;start="";end=end.slice(end.indexOf(")")+1)}if(!start&&!end){return}if(!start||!end||functionList(start)==functionList(end)){start&&(start=start.split(")"))&&(l=start.length);end&&(end=end.split(")"))&&(l=end.length);while(++i<l-1){start[i]&&(currStart=start[i].split("("));end[i]&&(currEnd=end[i].split("("));currType=$.trim((currStart||currEnd)[0]);append(list.start,parseFunction(currType,currStart?currStart[1]:0));append(list.end,parseFunction(currType,currEnd?currEnd[1]:0))}}else{list.start=unmatrix(matrix(start));list.end=unmatrix(matrix(end))}return list}function parseFunction(type,value){var defaultValue=+(!type.indexOf(_scale)),scaleX,cat=type.replace(/e[XY]/,"e");switch(type){case _translate+"Y":case _scale+"Y":value=[defaultValue,value?parseFloat(value):defaultValue];break;case _translate+"X":case _translate:case _scale+"X":scaleX=1;case _scale:value=value?(value=value.split(","))&&[parseFloat(value[0]),parseFloat(value.length>1?value[1]:type==_scale?scaleX||value[0]:defaultValue+"")]:[defaultValue,defaultValue];break;case _skew+"X":case _skew+"Y":case _rotate:value=value?toRadian(value):0;break;case _matrix:return unmatrix(value?toArray(value):[1,0,0,1,0,0]);break}return[[cat,value]]}function isAffine(matrix){return rAffine.test(matrix)}function functionList(transform){return transform.replace(/(?:\([^)]*\))|\s/g,"")}function append(arr1,arr2,value){while(value=arr2.shift()){arr1.push(value)}}function toRadian(value){return~value.indexOf("deg")?parseInt(value,10)*(Math.PI*2/360):~value.indexOf("grad")?parseInt(value,10)*(Math.PI/200):parseFloat(value)}function toArray(matrix){matrix=/([^,]*),([^,]*),([^,]*),([^,]*),([^,p]*)(?:px)?,([^)p]*)(?:px)?/.exec(matrix);return[matrix[1],matrix[2],matrix[3],matrix[4],matrix[5],matrix[6]]}$.transform={centerOrigin:"margin"}})(jQuery,window,document,Math);
(function(w) {

  var Const
    , BaseAnimator;

  Const = (function() {
    Const.prototype.PI = 0;
    Const.prototype.RADIAN = 0;
    Const.prototype.UA = null;
    Const.prototype.W_WIDTH = null;
    Const.prototype.W_HEIGHT = null;

    function Const() {
      var pi = Math.PI;
      this.PI = pi * 0.5;
      this.RADIAN = pi / 180;
      this.init();
    }

    // 各初期処理
    Const.prototype.init = function() {
      var that = this;
      this.UA = this.getUA(); // userAgent取得
      this.getSize(); // windowサイズ取得
      $(w).resize(function() {
        that.getSize();
      });
    };

    // userAgent取得
    Const.prototype.getUA = function() {
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
    Const.prototype.getSize = function() {
      this.W_W = this.getBrowserWidth();
      this.W_H = this.getBrowserHeight();
    };

    // ブラウザの幅取得
    Const.prototype.getBrowserWidth = function() {
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
    Const.prototype.getBrowserHeight = function() {
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
    Const.prototype.getProgress = function(e, t, b, c, d) {
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
    Const.prototype.sleep = function(time, callback) {
      setTimeout(function() {
        callback();
      }, time);
    };

    // 乱数範囲取得
    Const.prototype.getRandom = function(min, max) {
      return Math.random() * (max - min) + min;
    };

    return Const;
  })();

  BaseAnimator = (function() {
    BaseAnimator.prototype._body = null;
    BaseAnimator.prototype._startTime = 0;
    BaseAnimator.prototype._duration = 0;
    BaseAnimator.prototype._rid = 0;

    function BaseAnimator() {

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

      if (diff > this._duration) {
        cancelAnimationFrame(this._rid);
      }
      else {
        this._rid = requestAnimationFrame(function() {
          that.update();
        });
      }
    };

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

  $(window).load(function() {
    initialize();
  });

})(window);
