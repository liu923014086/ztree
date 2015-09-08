///<reference path="../libs/jQuery/jquery1.9.js" />
define(['jquery'],
    function ($) {
        /*
10 注册录像机服务失败
11 请求录像机服务失败
12 注册画面合成器失败
13 画面合成器请求服务失败
14 画面合成器请求参数失败
15 释放画面合成服务失败
16 注销画面合成器失败
17 注册混音器服务失败
18 混音器请求服务失败
19 混音参数通知失败
20 释放混音器服务失败
21 注销混音器失败
22 释放录像机服务失败
23 注销录像机失败
24 开启录像失败
25 开启录像成功
27 开启双流失败
28 开启双流成功
29 停止双流失败
30 停止双流成功
31 停止录像失败
32 停止录像成功
37 p2p终端断链
38 MCU会议终端断链

	
	 */
        var SystemMessage = {
            1: 'MSG_CONNECT_MCU_FAIL',
            2: 'MSG_START_CONFER_SUC',
            3: 'MSG_START_CONFER_FAIL',
            4: 'MSG_CONNECT_MT_FAIL ',
			5: 'MSG_SELVIEW_FAIL',
            6: 'MSG_SERVER_PROMPT',
			8: 'MSG_STOP_CONFER_SUC',
			9: 'MSG_STOP_CONFER_FAIL',
			10: 'MSG_REGISTER_REC_FAIL',
			11: 'MSG_REQUEST_REC_SER_FAIL',
			12: 'MSG_REGISTER_VMP_FAIL',
			13: 'MSG_REQUEST_VMP_SER_FAIL',
			14: 'MSG_VMP_PARAM_FAIL',
			15: 'MSG_RELEASE_VMP_SER_FAIL',
			16: 'MSG_LOGOUT_VMP_FAIL',
			17: 'MSG_REGISTER_MIXER_FAIL',
			18: 'MSG_REQUEST_MIXER_SER_FAIL',
			19: 'MSG_MIXER_PARAM_FAIL',
			20: 'MSG_RELEASE_MIXER_SER_FAIL',
			21: 'MSG_LOGOUT_MIXER_FAIL',
			22: 'MSG_RELEASE_REC_SER_FAIL',
			23: 'MSG_LOGOUT_REC_FAIL',
			24: 'MSG_STARTED_REC_SUC',
			25: 'MSG_STARTED_REC_FAIL',
			27: 'MSG_START_DUALFLOW_FAIL',
			28: 'MSG_START_DUALFLOW_SUC',
			29: 'MSG_STOP_DUALFLOW_FAIL',
			30: 'MSG_STOP_DUALFLOW_SUC',
			31: 'MSG_STOP_REC_SUC',
			32: 'MSG_STOP_REC_FAIL',
			33: 'MSG_BURN_START',//开始刻录
			34: 'MSG_BURN_END',//停止刻录
			38: 'MSG_BURNING_PROCESS',//刻录中
			36: 'MSG_REC_INTERRUPT',
			37: 'MSG_P2PMT_BROKEN_LINK',	
			38: 'MSG_MCUMT_BROKEN_LINK',//MCU会议终端断链
			39: 'MSG_MCU_DISCONNECT',//MCU断链
			40: 'MSG_MCU_NOTSTARTED',//MCU断链
			41: 'MSG_DATACONF_FAIL'//数据会议失败
        };
        var Observer = function (callback, scope, data) {
            this.callback = callback;
            this.scope = scope;
            this.data = data;
        };
        Observer.prototype = {
            constructor: Observer
        };
        /*
        url:轮询action地址
        timeout:服务器响应超时时间
        accuracy:轮询精度即上次ajax返回到下次再请求的间隔时间
        failedcallback:server返回success为false的处理, return false停止轮询
        timeoutcallback:响应超时的处理,return false停止轮询
        */
        var Cometter = App.Widgets.Cometter = function (url, timeout, accuracy,failedcallback,timeoutcallback) {
            this.url = url;
            this.timeout = timeout;
            this.accuracy = accuracy || 100;
            this.run = false;
            this.lastSystemEventId = 0;
            this.failedcallback = failedcallback;
            this.timeoutcallback = timeoutcallback;
            this.observers = new Array();
        };
        Cometter.prototype = {
            constructor: Cometter,
            start: function (url, timeout) {
				if(!url && !timeout && this.run){ return }
                this.url = url || this.url;
                this.timeout = timeout || this.timeout;
                this.run = true;
				this.timer && clearTimeout(this.timer);
                this.timer = setTimeout($.proxy(this.process, this), 20);
            },
            process: function () {
                $.ajax({
                    url: this.url,
                    dataType: 'json',
                    type: 'post',
                    timeout: this.timeout,
                    success: this.onsuccess,
                    error: this.onerror,
                    context: this,
                    data: { lastEventId: this.lastSystemEventId },
                    statusCode: {503: this.timeoutcallback}
                });
            },
            stop: function () {
                this.run = false;
                if (this.timer) {
                    clearTimeout(this.timer);
					this.timer = null;
                }
            },
			registerEvent:function(eventId,eventMsg){
				if(!eventId || !eventMsg || SystemMessage[eventId]){
					return false;
				}
				SystemMessage[eventId] = eventMsg;
				return true;
			},
            addListenner: function (event, callback, scope, data) {
                var obsvr = new Observer(callback, scope, data);
                var obsvrs = this.observers[event];
                if (!obsvrs) {
                    obsvrs = new Array();
                    this.observers[event] = obsvrs;
                }
                obsvrs.push(obsvr);
            },
            removeListenner: function (event, callback) {
                var obsvrs = this.observers[event];
                for (var index in obsvrs) {
                    if (obsvrs[index].callback === callback) {
                        obsvrs.splice(index, 1);
                        break;
                    }
                }
            },
            onsuccess: function (data, textStatus) {
                if (data.success == true) {
                    if (data.data != null) {
                        var eventList = data.data.eventList;
                        for (var i = 0; eventList && i < eventList.length; i++) {
                            var obj = eventList[i];
                            if (obj.eventId > this.lastSystemEventId) {
                                this.lastSystemEventId = obj.eventId;
                            }
                            var event = SystemMessage[obj.eventType];
                            var obsvrs = event ? this.observers[event] : [];
                            try {
                                for (var index in obsvrs) {
                                    var obsvr = obsvrs[index];
                                    if (obsvr.callback) {
                                        obsvr.callback.call(obsvr.scope || this, obj.data, obsvr.data);
                                    }
                                }
                            } catch (err) {
                            }
                        }
                    }
                } else {
                    if (this.failedcallback) {
                        this.run = !!this.failedcallback.call(this, data, textStatus);
                    }
                }
                if (this.run && data.success) {
                    this.timer = setTimeout($.proxy(this.process, this), this.accuracy);
                }
            },
            onerror: function (XMLHttpRequest, textStatus, errorThrown) {
                // 通常情况下textStatus和errorThown只有其中一个有值
                if (textStatus == 'timeout') {
                    if (this.timeoutcallback) {
                        this.run = !!this.timeoutcallback.call(this);
                    }
                    if (this.run) {
                        this.timer = setTimeout($.proxy(this.process, this), this.accuracy);
                    }
                } else {
                    this.timeoutcallback && setTimeout($.proxy(this.timeoutcallback, this), 1000);
                }
            }
        };
        return App.Widgets.Cometter;
    });