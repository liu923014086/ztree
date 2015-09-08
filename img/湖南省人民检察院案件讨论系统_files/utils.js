define([
    'jquery',
    'stacktrace',
	'widgets/messagebox'
],
    function ($, stacktrace,MessageBox) {
        $.fn.getDataId = function () {
            var id = this.attr('data-id');
            return id ? id.toString() : null;
        }
        $.fn.setDataId = function (id) {
            return this.attr('data-id', id);
        }
		var Utils = function(){};
        Utils.prototype = {
			constructor:Utils,
            alert: function (msg,title) {
				if( !msg ) return;
				this.msgbox = this.msgbox || new MessageBox();
				this.msgbox.alert(msg,title || '提示');
            },
			confirm:function (msg,title,callback,oktext,canceltext) {
				this.msgbox = this.msgbox || new MessageBox();
				this.msgbox.confirm(msg,title || '提示',callback,oktext,canceltext);
            },
			messagebox:function () {
				this.msgbox = this.msgbox || new MessageBox();
				this.msgbox.show.apply(this.msgbox,arguments);
            },
            assert: function (result) {
                if (!result) {
                }
            },
            returnLogin: function () {
                window.location.replace("login.html");
            },
			isIE:function(){
				if(!this.browser){
					var browser = this.browser = {};
					var ua = navigator.userAgent.toLowerCase();
					var s;
					(s = ua.match(/msie ([\d.]+)/)) ? browser.ie = s[1] :
					(s = ua.match(/firefox\/([\d.]+)/)) ? browser.firefox = s[1] :
					(s = ua.match(/chrome\/([\d.]+)/)) ? browser.chrome = s[1] :
					(s = ua.match(/opera.([\d.]+)/)) ? browser.opera = s[1] :
					(s = ua.match(/version\/([\d.]+).*safari/)) ? browser.safari = s[1] : 0;
				}
				return this.browser.ie;
			},
			//author: lars
			//Date newDate = parseDate("2006-07-02 08:09:04.423","yyyy-MM-dd hh:mm:ss.S")
			parseDate : function(str,fmt){
				if(str){
					if(!fmt) return new Date(str);
					var keywords = 'yMmdhsS';
					var newstr = new String(str);
					var char,newfmt={};
					for(var i=0,j,len=fmt.length;i<len;++i){
						char = fmt[i];
						if(keywords.indexOf(char)!== -1){
							j = i+1;
							while(j<len&&fmt[j]===char){j++;}
							newfmt[char] = newstr.slice(i,j);
							i = j-1;
						}
					}
					return new Date(newfmt.y,newfmt.M-1,newfmt.d,newfmt.h||0,newfmt.m||0,newfmt.s||0);
				}
			},
            checkbox : function(e,el,checkName){//全选效果 e:this  el:this.$el checkName:checkboxName  add by lsj
                var checkbox = el.find('input[name='+checkName+']');
                var firstValue;
                if(!checkbox[0].value){
                    $(checkbox[0]).attr('value','on');
                    firstValue = 'on';
                }else{
                    firstValue = checkbox[0].value;
                }

                if(checkbox[0].checked && e.currentTarget.value ==firstValue){//全选
                    for(var i = 1;i < checkbox.size();i++){
                        checkbox[i].checked = true;
                    }
                }else{
                    if(e.currentTarget.value == firstValue){
                        for(var i = 1;i < checkbox.size();i++){
                            checkbox[i].checked = false;
                        }
                    }
                }

                var isSelect = true;
                for(var i = 1;i < checkbox.size();i++){
                    if(!checkbox[i].checked){
                        isSelect = false;
                    }
                }
                if(e.currentTarget.value != firstValue){
                    if(isSelect){
                        checkbox[0].checked = true;
                    }else{
                        checkbox[0].checked = false;
                    }
                }
            },
            getcurUser : function(callback){//获取当前登录用户信息
                $.get('rest/user/getcurUser',{},callback);
            }
        };
		// 对Date的扩展，将 Date 转化为指定格式的String   
		// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
		// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
		// 例子：   
		// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
		// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
		Date.prototype.Format = function(fmt)   
		{ //author: meizz   
		  var o = {   
			"M+" : this.getMonth()+1,                 //月份   
			"d+" : this.getDate(),                    //日   
			"h+" : this.getHours(),                   //小时   
			"m+" : this.getMinutes(),                 //分   
			"s+" : this.getSeconds(),                 //秒   
			"q+" : Math.floor((this.getMonth()+3)/3), //季度   
			"S"  : this.getMilliseconds()             //毫秒   
		  };   
		  if(/(y+)/.test(fmt))   
			fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
		  for(var k in o)   
			if(new RegExp("("+ k +")").test(fmt))   
		  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
		  return fmt;   
		}
		//去除空格,回车
		String.prototype.trim = function()
		{
			return this.replace(/(^\s*)|(\s*$)/g, ""); 
		}
		window.Utils = new Utils();
        return window.Utils;
    });