///<reference path="../libs/require.js" />
///<reference path="../libs/jQuery/jquery1.9.js" />
///<reference path="../libs/bootstrap/bootstrap-modal.js" />
///<reference path="../libs/underscore.js" />

define(['jquery','text!templates/message.html'], function ($,tpl) {
    var MessageBox = App.Widgets.MessageBox = function (options) {
        var me = this;
        this.$el = $('#msgbox');
		if(this.$el.length < 1){
			this.$el = $('<div class="modal" id="msgbox"><div class="modal-dialog"><div class="modal-content"></div></div></div>').appendTo(document.body);
		}
		this.tpl = tpl;
        this.$el.on('click','button',function (e) {
			switch($(e.target).attr('data-type')){
				case 'ok':{
					me.onresult('ok');
					break;
				}
				case 'cancel':{
					me.onresult('cancel');
					break;
				}
			}
        });
        return this;
    }

    MessageBox.prototype = {
        constructor: MessageBox,
        show: function (msg, title ,type ,callback, scope ,param,oktext,canceltext) {
            var me = this;
			var data = {text:msg ,title:title,type:type,OkBtnText:oktext||'确定',CancelBtnText:canceltext||'取消'};
			this.$el.find('.modal-content').html(_.template(this.tpl,data));
			this.callback = callback;
			this.scope = scope;
			this.param = param;
            this.$el.modal({backdrop:false,keyboard:false});
        },
		hide:function(){
			this.$el.modal('hide');
		},
		onresult:function(result){
			if(this.callback){
				this.callback.call(this.scope || this, result ,this.param );
			}
		},
        alert: function (msg,title) {
			this.show(msg,title,'alert');
        },
        confirm: function (msg,title,callback,oktext,canceltext) {
			this.show(msg,title,'confirm',callback,null,null,oktext,canceltext);
        },
		prompt:function(){
		}
    };

    return MessageBox;
});
















